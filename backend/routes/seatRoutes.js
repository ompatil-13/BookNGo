import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

// Number of seats for each travel mode
const seatConfig = {
  Flight: 120,
  Bus: 60,
  Train: 200,
};

// Function to generate seats dynamically
function generateSeats(count, mode) {
  const seats = [];
  const columns = ["A", "B", "C", "D", "E", "F"]; // 6 seats per row
  let row = 1;
  let colIndex = 0;

  for (let i = 1; i <= count; i++) {
    const column = columns[colIndex];
    seats.push({
      seat_no: `${row}${column}`,
      row,
      column,
      mode_of_travel: mode,
      isBooked: false,
    });

    colIndex++;
    if (colIndex >= columns.length) {
      colIndex = 0;
      row++;
    }
  }
  return seats;
}

// ✅ Re-initialize all seats for all modes (DELETE + INSERT)
router.get("/init", async (req, res) => {
  try {
    await Seat.deleteMany({});

    for (const [mode, count] of Object.entries(seatConfig)) {
      const seats = generateSeats(count, mode);
      await Seat.insertMany(seats);
      console.log(`✅ ${count} ${mode} seats initialized`);
    }

    res.json({ message: "✅ Seats initialized successfully for Flight, Bus & Train" });
  } catch (err) {
    console.error("❌ Seat initialization error:", err);
    res.status(500).json({ message: "Error initializing seats", error: err.message });
  }
});

// ✅ Get seats — supports query ?mode=Flight
router.get("/", async (req, res) => {
  try {
    const { mode } = req.query;
    const query = mode ? { mode_of_travel: mode } : {};
    const seats = await Seat.find(query).sort({ row: 1, column: 1 });
    res.json(seats);
  } catch (err) {
    console.error("❌ Seat fetch error:", err);
    res.status(500).json({ message: "Error fetching seats", error: err.message });
  }
});

export default router;
