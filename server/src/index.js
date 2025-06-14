import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import admin from "firebase-admin";
import { connectDatabase } from "./lib/connect-database.js";
import serviceAccountKey from "./config/firebase-adminsdk.json" with { type: "json" };

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const API_PREFIX = "/api/v1";
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URI,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000"
    ];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Cross-Origin-Opener-Policy']
};

app.use(cors(corsOptions));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: err.message });
});

// Connect Database
connectDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}${API_PREFIX}`);
});