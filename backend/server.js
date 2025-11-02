import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import Seat from "./models/Seat.js"; // Import seat model

const app = express();

// ✅ Allow frontend from Vercel to access backend
app.use(cors({
  origin: ["https://book-n-go-ten.vercel.app"],
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
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Check if seats exist
    const seatCount = await Seat.countDocuments();
    if (seatCount === 0) {
      console.log("🪑 No seats found — initializing realistic seat layouts...");

      // Configuration for each mode of travel
      const layouts = [
        { mode: "Flight", rows: 20, columns: ["A", "B", "C", "D", "E", "F"] },
        { mode: "Bus", rows: 15, columns: ["A", "B", "C", "D"] },
        { mode: "Train", rows: 25, columns: ["A", "B", "C", "D", "E", "F", "G", "H"] }
      ];

      const allSeats = [];

      for (const layout of layouts) {
        const { mode, rows, columns } = layout;
        for (let row = 1; row <= rows; row++) {
          for (const col of columns) {
            allSeats.push({
              seat_no: `${row}${col}`,
              mode_of_travel: mode,
              row,
              column: col,
              isBooked: false
            });
          }
        }
      }

      await Seat.insertMany(allSeats);
      console.log("✅ Seats initialized for Flight, Bus, and Train successfully!");
    } else {
      console.log("✅ Seats already exist — skipping initialization.");
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

