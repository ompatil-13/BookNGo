import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

// Number of seats & columns per travel mode
const seatConfig = {
  Flight: { count: 120, columns: ["A", "B", "C", "D", "E", "F"] }, // 6 per row
  Bus: { count: 60, columns: ["A", "B", "C", "D"] },               // 4 per row
  Train: { count: 200, columns: ["A", "B", "C", "D", "E", "F", "G", "H"] }, // 8 per row
};

// Generate seats dynamically per mode
function generateSeats(mode, count, columns) {
  const seats = [];
  const prefix = mode[0].toUpperCase(); // F, B, T
  let row = 1;
  let colIndex = 0;

  for (let i = 1; i <= count; i++) {
    const column = columns[colIndex];
    const seat_no = `${prefix}-${row}${column}`;

    seats.push({
      seat_no,
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

// ✅ Initialize all modes
router.get("/init", async (req, res) => {
  try {
    await Seat.deleteMany({});

    for (const [mode, { count, columns }] of Object.entries(seatConfig)) {
      const seats = generateSeats(mode, count, columns);
      await Seat.insertMany(seats);
      console.log(`✅ Initialized ${count} ${mode} seats`);
    }

    res.json({ message: "✅ Seats initialized for Flight, Bus & Train" });
  } catch (err) {
    console.error("❌ Initialization error:", err);
    res.status(500).json({ message: "Error initializing seats", error: err.message });
  }
});

// ✅ Get seats by mode (example: /api/seats?mode=Bus)
router.get("/", async (req, res) => {
  try {
    const { mode } = req.query;
    const query = mode ? { mode_of_travel: mode } : {};
    const seats = await Seat.find(query).sort({ row: 1, column: 1 });
    res.json(seats);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Error fetching seats", error: err.message });
  }
});

export default router;
