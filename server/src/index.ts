import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/connection.js";
import express from "express";
import notesRouter from "./routes/api-notes.js";
import cors from "cors";
import authRouter from "./routes/api-auth.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/notes", notesRouter);
app.use("/api/auth", authRouter);
(async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`app started listening to the port ${process.env.PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in starting the server", error.message);
    } else {
      console.log("Error in starting the server", error);
    }
  }
})();
