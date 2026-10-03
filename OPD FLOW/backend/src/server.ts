import dotenv from "dotenv";
import express from "express";
import dbConnection from "./config/db";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OPDFlow Server is Running");
});

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    await dbConnection();

    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();