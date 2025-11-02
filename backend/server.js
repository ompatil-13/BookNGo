import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";

const app = express();


//allow request from frontend on vercel 
  origin: ["https://your-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ BookNGo Backend API is running successfully!");
});

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelDB";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/seats", seatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

