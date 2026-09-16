import sessionModel from "../db/models/session.model.js";
import userModel, { type userType } from "../db/models/user.model.js";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const userExist = await userModel.findOne({ email: email });
    if (userExist) throw new Error("User already exists");

    const passSalt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, passSalt);
    const user = await userModel.create({
      username,
      email,
      password: passHash,
    });

    const session = await sessionModel.create({
      user: user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    if (!process.env.REFRESH_JWT_SECRET) throw new Error("key doesnt exist");
    const refreshToken = jwt.sign(
      { userId: user._id, sessionId: session._id },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "7d" },
    );

    const RTSalt = await bcrypt.genSalt(10);
    const RTHash = await bcrypt.hash(refreshToken, RTSalt);
    session.refreshTokenHash = RTHash;
    await session.save();

    if (!process.env.ACCESS_JWT_SECRET) throw new Error("key doesnt exist");
    const accessToken = jwt.sign(
      { userId: user._id, sessionId: session._id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "user registered successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("account does not exist");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("email or password incorrect");

    let session = await sessionModel.findOne({
      user: user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    if (session) {
      session.revoked = false;
      session.refreshTokenHash = "";
      await session.save();
    } else {
      session = await sessionModel.create({
        user: user._id,
        refreshTokenHash: "",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        revoked: false,
      });
    }
    if (!process.env.REFRESH_JWT_SECRET)
      throw new Error("internal server error");
    const refreshToken = jwt.sign(
      { userId: user._id, sessionId: session._id },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "7d" },
    );

    if (!process.env.ACCESS_JWT_SECRET)
      throw new Error("internal server error");
    const accessToken = jwt.sign(
      { userId: user._id, sessionId: session._id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "15m" },
    );

    const RTSalt = await bcrypt.genSalt(10);
    const RTHash = await bcrypt.hash(refreshToken, RTSalt);
    session.refreshTokenHash = RTHash;
    await session.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "login successful",
      accessToken: accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) throw new Error("session not found");
    if (!process.env.ACCESS_JWT_SECRET) throw new Error("session not found");
    const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
    if (typeof decoded === "string" || !decoded.sessionId) {
      throw new Error("invalid token");
    }
    const session = await sessionModel.findById(decoded.sessionId);
    if (!session) throw new Error("session not found");
    session.revoked = true;
    session.refreshTokenHash = "";
    await session.save();
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "successfully logged out" });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "invalid or expired token" });
    } else if (error instanceof Error) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
};

export const rotateToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!process.env.REFRESH_JWT_SECRET) throw new Error("invalid token");
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    if (typeof decoded === "string" || !decoded.sessionId || !decoded.userId) {
      throw new Error("invalid token");
    }
    const session = await sessionModel.findById(decoded.sessionId);
    if (!session || !session.refreshTokenHash || session.revoked === true)
      throw new Error("session not found");
    const isValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );
    if (!isValid) {
      session.revoked = true;
      session.refreshTokenHash = "";
      await session.save();
      throw new Error("invalid token");
    }
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, sessionId: decoded.sessionId },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "7d" },
    );
    if (!process.env.ACCESS_JWT_SECRET)
      throw new Error("Internal server error");
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, sessionId: decoded.sessionId },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "15m" },
    );

    const RTSalt = await bcrypt.genSalt(10);
    const RTHash = await bcrypt.hash(newRefreshToken, RTSalt);

    session.refreshTokenHash = RTHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    });
    res.status(200).json({
      message: "token rotated",
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "invalid or expired token" });
    } else if (error instanceof Error) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) throw new Error("not authenticated");
    if (!process.env.ACCESS_JWT_SECRET)
      throw new Error("internal server error");

    const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
    if (typeof decoded === "string" || !decoded.userId) {
      throw new Error("invalid token");
    }

    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) throw new Error("user not found");

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "invalid or expired token" });
    } else if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
};
