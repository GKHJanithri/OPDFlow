require("dotenv").config();

const express = require("express");
const dbConnection = require("./config/db");

const app = express();

app.get("/", (req, res) => res.send("Hello Server is Running .."));

const PORT = process.env.PORT || 3000;

const startServer = async () => {
	await dbConnection();
	app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
};

startServer();