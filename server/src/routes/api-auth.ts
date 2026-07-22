import express from "express";
import * as authControllers from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", authControllers.registerUser);
authRouter.post("/login", authControllers.login);
authRouter.get("/logout", authControllers.logout);
authRouter.get("/rotate", authControllers.rotateToken);
authRouter.get("/get-me", authControllers.getMe);

export default authRouter;
