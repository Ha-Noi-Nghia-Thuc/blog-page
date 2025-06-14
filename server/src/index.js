import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./lib/connect-database.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const API_PREFIX = "/api/v1";
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);

// Connect Database
connectDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}${API_PREFIX}`);
});
