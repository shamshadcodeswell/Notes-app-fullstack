import sessionModel from "../db/models/session.model.js";
import userModel from "../db/models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
// ---------- helpers ----------
// Frontend (Vercel) and backend (Render) are different sites, so the cookie
// must be SameSite=None + Secure. Chrome also accepts Secure cookies on localhost.
const refreshCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
};
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
// JWTs are long and random: SHA-256 is correct here. bcrypt only reads the
// first 72 bytes, which are identical across a user's tokens.
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const getSecrets = () => {
    const { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } = process.env;
    if (!ACCESS_JWT_SECRET || !REFRESH_JWT_SECRET)
        return null;
    return { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET };
};
const signTokens = (payload, secrets) => ({
    accessToken: jwt.sign(payload, secrets.ACCESS_JWT_SECRET, {
        expiresIn: "15m",
    }),
    refreshToken: jwt.sign(payload, secrets.REFRESH_JWT_SECRET, {
        expiresIn: "7d",
    }),
});
// Creates a new session, signs both tokens, sets the cookie, returns the access token
const startSession = async (req, res, userId, secrets) => {
    const session = new sessionModel({
        user: userId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        revoked: false,
    });
    const { accessToken, refreshToken } = signTokens({ userId, sessionId: session._id }, secrets);
    session.refreshTokenHash = hashToken(refreshToken);
    await session.save();
    res.cookie("refreshToken", refreshToken, {
        ...refreshCookieOptions,
        maxAge: REFRESH_MAX_AGE,
    });
    return accessToken;
};
// ---------- controllers ----------
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body ?? {};
    const secrets = getSecrets();
    if (!secrets) {
        console.error("JWT secrets are missing");
        res.status(500).json({ message: "internal server error" });
        return;
    }
    if (typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !email.trim() ||
        password.length < 8) {
        res.status(400).json({
            message: "username, email and a password of at least 8 characters are required",
        });
        return;
    }
    try {
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            res.status(409).json({ message: "user already exists" });
            return;
        }
        const passHash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: passHash,
        });
        const accessToken = await startSession(req, res, user._id, secrets);
        res
            .status(201)
            .json({ message: "user registered successfully", accessToken });
    }
    catch (error) {
        console.error("Register failed:", error);
        res.status(500).json({ message: "internal server error" });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body ?? {};
    const secrets = getSecrets();
    if (!secrets) {
        console.error("JWT secrets are missing");
        res.status(500).json({ message: "internal server error" });
        return;
    }
    if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ message: "email and password are required" });
        return;
    }
    try {
        const user = await userModel.findOne({ email });
        const isValid = user
            ? await bcrypt.compare(password, user.password)
            : false;
        if (!user || !isValid) {
            res.status(401).json({ message: "email or password incorrect" });
            return;
        }
        const accessToken = await startSession(req, res, user._id, secrets);
        res.status(200).json({ message: "login successful", accessToken });
    }
    catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ message: "internal server error" });
    }
};
export const logout = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    try {
        if (refreshToken && process.env.REFRESH_JWT_SECRET) {
            // Revoke even if the token has expired
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, {
                ignoreExpiration: true,
            });
            if (typeof decoded !== "string" && decoded.sessionId) {
                await sessionModel.findByIdAndUpdate(decoded.sessionId, {
                    revoked: true,
                    refreshTokenHash: "",
                });
            }
        }
    }
    catch (error) {
        // Tampered or invalid token: nothing to revoke, still log out
        console.error("Logout revoke failed:", error);
    }
    finally {
        res.clearCookie("refreshToken", refreshCookieOptions);
        res.status(200).json({ message: "successfully logged out" });
    }
};
export const rotateToken = async (req, res) => {
    const secrets = getSecrets();
    if (!secrets) {
        console.error("JWT secrets are missing");
        res.status(500).json({ message: "internal server error" });
        return;
    }
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: "not authenticated" });
        return;
    }
    try {
        const decoded = jwt.verify(refreshToken, secrets.REFRESH_JWT_SECRET);
        if (typeof decoded === "string" || !decoded.sessionId || !decoded.userId) {
            throw new jwt.JsonWebTokenError("invalid token payload");
        }
        const session = await sessionModel.findById(decoded.sessionId);
        if (!session || session.revoked || !session.refreshTokenHash) {
            res.clearCookie("refreshToken", refreshCookieOptions);
            res.status(401).json({ message: "session expired, please log in again" });
            return;
        }
        // Valid signature but not the latest token: it was reused. Kill the session.
        if (hashToken(refreshToken) !== session.refreshTokenHash) {
            session.revoked = true;
            session.refreshTokenHash = "";
            await session.save();
            res.clearCookie("refreshToken", refreshCookieOptions);
            res.status(401).json({ message: "session expired, please log in again" });
            return;
        }
        const { accessToken, refreshToken: newRefreshToken } = signTokens({ userId: decoded.userId, sessionId: decoded.sessionId }, secrets);
        session.refreshTokenHash = hashToken(newRefreshToken);
        await session.save();
        res.cookie("refreshToken", newRefreshToken, {
            ...refreshCookieOptions,
            maxAge: REFRESH_MAX_AGE,
        });
        res.status(200).json({ message: "token rotated", accessToken });
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            // Also covers TokenExpiredError, which extends JsonWebTokenError
            res.clearCookie("refreshToken", refreshCookieOptions);
            res.status(401).json({ message: "invalid or expired token" });
            return;
        }
        console.error("Token rotation failed:", error);
        res.status(500).json({ message: "internal server error" });
    }
};
export const getMe = async (req, res) => {
    const secret = process.env.ACCESS_JWT_SECRET;
    if (!secret) {
        console.error("ACCESS_JWT_SECRET is missing");
        res.status(500).json({ message: "internal server error" });
        return;
    }
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        res.status(401).json({ message: "not authenticated" });
        return;
    }
    try {
        const decoded = jwt.verify(accessToken, secret);
        if (typeof decoded === "string" || !decoded.userId) {
            throw new jwt.JsonWebTokenError("invalid token payload");
        }
        const user = await userModel.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(401).json({ message: "user not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "invalid or expired token" });
            return;
        }
        console.error("getMe failed:", error);
        res.status(500).json({ message: "internal server error" });
    }
};
//# sourceMappingURL=authController.js.map