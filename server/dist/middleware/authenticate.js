import jwt from "jsonwebtoken";
export const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token || !process.env.ACCESS_JWT_SECRET) {
            return res.status(401).json({ message: "not authenticated" });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
        if (typeof decoded === "string" || !decoded.userId) {
            return res.status(401).json({ message: "invalid token" });
        }
        req.userId = decoded.userId;
        req.sessionId = decoded.sessionId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "invalid or expired token" });
    }
};
//# sourceMappingURL=authenticate.js.map