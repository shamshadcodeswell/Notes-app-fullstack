import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    userId?: Types.ObjectId;
    sessionId?: Types.ObjectId;
  }
}
