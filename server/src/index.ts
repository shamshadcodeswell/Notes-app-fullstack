import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/connection.js";
import express from "express";
const app = express();

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
