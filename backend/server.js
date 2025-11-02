import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";

const app = express();

// ✅ Enable CORS for your frontend hosted on Vercel
app.use(cors({
  origin: ["https://book-n-go-ten.vercel.app"], // your actual frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ BookNGo Backend API is running successfully!");
});

// ✅ MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelDB";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/seats", seatRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
