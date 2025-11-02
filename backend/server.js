import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import Seat from "./models/Seat.js"; // ⬅️ Import Seat model

const app = express();

// ✅ Allow requests from your Vercel frontend
app.use(cors({
  origin: ["https://book-n-go-ten.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.send("✅ BookNGo Backend API is running successfully!");
});

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelDB";

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("MongoDB connected");

    // ✅ Automatically initialize seats if empty
    const count = await Seat.countDocuments();
    if (count === 0) {
      console.log("No seats found — initializing default seats...");

      const modes = ["Flight", "Bus", "Train"];
      const seatsToCreate = [];
      const columns = ['A', 'B', 'C', 'D'];

      for (const mode of modes) {
        for (let row = 1; row <= 10; row++) {
          for (let col of columns) {
            seatsToCreate.push({
              seat_no: `${row}${col}`,
              mode_of_travel: mode,
              row,
              column: col,
              isBooked: false
            });
          }
        }
      }

      await Seat.insertMany(seatsToCreate);
      console.log("✅ Default seats initialized successfully.");
    } else {
      console.log("Seats already exist, skipping initialization.");
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/seats", seatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

