import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URI}/${process.env.DB_NAME}`,
    );
    console.log("DataBase connected Successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in connecting to database", error.message);
    } else {
      console.log("Error in connecting to the database", error);
    }
    process.exit(1);
  }
};
