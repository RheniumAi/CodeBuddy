import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from './config/passport.js';
import session from "express-session";
// Import WebSocket server
import { server, app } from "./lib/utils/socket.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import collaborateRoutes from "./routes/collaborate.routes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  })
);
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/collaborate", collaborateRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
