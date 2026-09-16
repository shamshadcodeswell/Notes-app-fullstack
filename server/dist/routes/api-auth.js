import express from "express";
import * as authControllers from "../controllers/authController.js";
const authRouter = express.Router();
authRouter.post("/register", authControllers.registerUser);
authRouter.post("/login", authControllers.login);
authRouter.post("/logout", authControllers.logout);
authRouter.post("/rotate-token", authControllers.rotateToken);
authRouter.get("/get-me", authControllers.getMe);
export default authRouter;
//# sourceMappingURL=api-auth.js.map