import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

// Number of seats per travel mode
const seatConfig = {
  Flight: 120,
  Bus: 60,
  Train: 200,
};

// Utility to generate seat positions (rows & columns)
function generateSeats(count, mode) {
  const seats = [];
  const columns = ["A", "B", "C", "D", "E", "F"]; // up to 6 per row
  let row = 1;
  let colIndex = 0;

  for (let i = 1; i <= count; i++) {
    const column = columns[colIndex];
    seats.push({
      seat_no: `${mode[0]}-${i}`,
      row,
      column,
      mode_of_travel: mode,
    });

    colIndex++;
    if (colIndex >= columns.length) {
      colIndex = 0;
      row++;
    }
  }
  return seats;
}

// 🔹 Initialize seats for all modes (run once)
router.post("/initialize", async (req, res) => {
  try {
    for (const [mode, count] of Object.entries(seatConfig)) {
      const existing = await Seat.find({ mode_of_travel: mode });
      if (existing.length === 0) {
        const seats = generateSeats(count, mode);
        await Seat.insertMany(seats);
        console.log(`${count} ${mode} seats initialized`);
      } else {
        console.log(`${mode} seats already initialized`);
      }
    }
    res.json({ message: "✅ Seats initialized for all modes!" });
  } catch (err) {
    console.error("Seat initialization error:", err);
    res.status(500).json({ message: "Error initializing seats" });
  }
});

// 🔹 Fetch seats by travel mode
router.get("/:mode", async (req, res) => {
  try {
    const mode = req.params.mode;
    const seats = await Seat.find({ mode_of_travel: mode }).sort({ row: 1, column: 1 });
    res.json(seats);
  } catch (err) {
    console.error("Seat fetch error:", err);
    res.status(500).json({ message: "Error fetching seats" });
  }
});

export default router;

