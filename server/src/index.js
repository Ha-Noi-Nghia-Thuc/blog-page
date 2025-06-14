import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./lib/connect-database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
  connectDatabase();
  console.log(`server is running on port ${PORT}`);
});
