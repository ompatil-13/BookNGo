import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

// GET /api/seats?mode_of_travel=Flight
router.get("/", async (req, res) => {
  try {
    const { mode_of_travel } = req.query;
    const query = mode_of_travel ? { mode_of_travel } : {};
    const seats = await Seat.find(query).sort({ row: 1, column: 1 });
    return res.json(seats);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/seats/:seat_no
router.get("/:seat_no", async (req, res) => {
  try {
    const seat = await Seat.findOne({ seat_no: req.params.seat_no });
    if (!seat) return res.status(404).json({ message: "Seat not found" });
    return res.json(seat);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/seats/initialize - Initialize seats for a travel mode (admin/utility endpoint)
router.post("/initialize", async (req, res) => {
  try {
    const { mode_of_travel, rows, seatsPerRow } = req.body;
    if (!mode_of_travel || !rows || !seatsPerRow) {
      return res.status(400).json({ message: "mode_of_travel, rows, and seatsPerRow are required" });
    }

    const seatsToCreate = [];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    for (let row = 1; row <= rows; row++) {
      for (let colIndex = 0; colIndex < seatsPerRow; colIndex++) {
        const column = columns[colIndex];
        const seat_no = `${row}${column}`;
        seatsToCreate.push({
          seat_no,
          mode_of_travel,
          row,
          column,
          isBooked: false
        });
      }
    }

    // Use bulkWrite to upsert seats (avoid duplicates)
    const operations = seatsToCreate.map(seat => ({
      updateOne: {
        filter: { seat_no: seat.seat_no, mode_of_travel: seat.mode_of_travel },
        update: { $setOnInsert: seat },
        upsert: true
      }
    }));

    await Seat.bulkWrite(operations);
    return res.json({ message: `Initialized ${seatsToCreate.length} seats for ${mode_of_travel}` });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
