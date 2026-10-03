import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const dbConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default dbConnection;