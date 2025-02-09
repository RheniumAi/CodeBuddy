import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Importing routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Auth Routes
app.use("/api/auth", authRoutes);

// Landing page route(User route)
app.use("/api/user", userRoutes);

// Collaboration routes
// app.use('/api/collaborate', collaborateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
