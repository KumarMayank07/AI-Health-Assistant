import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import doctorRoutes from "./routes/doctors.js";
// import chatRoutes from './routes/chat.js';
import uploadRoutes from "./routes/upload.js";
import reportsRouter from "./routes/reports.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Debug environment variables
console.log("Environment check:");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY ? "Set" : "Not set");
console.log("NODE_ENV:", process.env.NODE_ENV);

// Security middleware
app.use(helmet());

// Configure CORS origins
const corsOrigins = {
  development: [
    "http://localhost:5000",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8501",
    "http://localhost:8502",
  ],
  production: (process.env.FRONTEND_URL || "https://yourdomain.com").split(",").map(url => url.trim()),
};

const allowedOrigins = corsOrigins[process.env.NODE_ENV] || corsOrigins.development;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Please check your MONGODB_URI in the .env file");
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Clarity Retina Care API is running",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
// app.use('/api/chat', chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reports", reportsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(
    `📊 Health check available at: http://localhost:${PORT}/api/health`
  );
});
