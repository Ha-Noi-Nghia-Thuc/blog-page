import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import admin from "firebase-admin"
import serviceAccountKey from "./config/firebase-adminsdk.json" with { type: "json" }
import { connectDatabase } from "./lib/connect-database.js"
import authRoutes from "./routes/auth.route.js"

// Load environment variables
dotenv.config()

const app = express()
const API_PREFIX = "/api/v1"
const PORT = process.env.PORT || 5000

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ]

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
})

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// API Routes
app.use(`${API_PREFIX}/auth`, authRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found",
    path: req.originalUrl,
  })
})

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error("Server error:", err)

  // CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS policy violation",
    })
  }

  // Default error response
  res.status(500).json({
    message: "Lỗi máy chủ nội bộ",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  })
})

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}${API_PREFIX}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
