import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const uri = process.env.DB_URI;
        if (!uri)
            throw new Error("DB URL not defined");
        await mongoose.connect(uri, { dbName: process.env.DB_NAME });
        console.log("DataBase connected Successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Error in connecting to database", error.message);
        }
        else {
            console.log("Error in connecting to the database", error);
        }
        process.exit(1);
    }
};
//# sourceMappingURL=connection.js.map