import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

// Seat configuration: count and columns per mode
const seatConfig = {
  Flight: { total: 120, columns: ["A", "B", "C", "D", "E", "F"] },
  Bus: { total: 60, columns: ["A", "B", "C"] },
  Train: { total: 200, columns: ["A", "B", "C", "D"] }
};

// Function to generate seats for a specific mode
function generateSeats(mode, count) {
  const config = seatConfig[mode];
  if (!config) throw new Error(`Invalid mode: ${mode}`);
  
  const seats = [];
  const { columns } = config;
  const seatsPerRow = columns.length;
  const numRows = Math.ceil(count / seatsPerRow);
  let seatIndex = 0;

  for (let row = 1; row <= numRows; row++) {
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      if (seatIndex >= count) break; // Stop if we've created all seats
      
      const column = columns[colIndex];
      const prefix = mode[0]; // F for Flight, B for Bus, T for Train
      const seat_no = `${prefix}${row}${column}`; // F1A, F1B, B1A, T1A, etc.
      
      seats.push({
        seat_no,
        mode_of_travel: mode,
        row,
        column,
        isBooked: false
      });
      
      seatIndex++;
    }
  }
  
  return seats;
}

// POST /api/seats/initialize - Initialize all seats (deletes old and creates new)
router.post("/initialize", async (req, res) => {
  try {
    console.log("🔄 Starting seat initialization...");
    
    const results = {};
    
    for (const [mode, config] of Object.entries(seatConfig)) {
      // Delete old seats for this mode
      const deleteResult = await Seat.deleteMany({ mode_of_travel: mode });
      console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing ${mode} seats`);
      
      // Generate new seats using the exact count
      const seats = generateSeats(mode, config.total);
      
      // Bulk insert
      const insertResult = await Seat.insertMany(seats);
      console.log(`✅ Created ${insertResult.length} ${mode} seats (${config.total} total, ${config.columns.length} columns per row)`);
      
      results[mode] = {
        deleted: deleteResult.deletedCount,
        created: insertResult.length,
        expected: config.total,
        columns: config.columns.length,
        rows: Math.ceil(config.total / config.columns.length)
      };
    }
    
    res.json({
      message: "Seats initialized successfully for all modes",
      results
    });
  } catch (err) {
    console.error("❌ Seat initialization error:", err);
    res.status(500).json({
      message: "Error initializing seats",
      error: err.message
    });
  }
});

// GET /api/seats/count - Get total seat counts per mode (MUST be before /:mode)
router.get("/count", async (req, res) => {
  try {
    const counts = {};
    
    for (const mode of Object.keys(seatConfig)) {
      const count = await Seat.countDocuments({ mode_of_travel: mode });
      counts[mode] = count;
    }
    
    res.json(counts);
  } catch (err) {
    console.error("❌ Seat count error:", err);
    res.status(500).json({
      message: "Error counting seats",
      error: err.message
    });
  }
});

// GET /api/seats - Get all seats (optional, for debugging - MUST be before /:mode)
router.get("/", async (req, res) => {
  try {
    const { mode_of_travel } = req.query;
    const query = mode_of_travel ? { mode_of_travel } : {};
    const seats = await Seat.find(query).sort({ mode_of_travel: 1, row: 1, column: 1 });
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/seats/:mode - Get all seats for a specific mode (MUST be last)
router.get("/:mode", async (req, res) => {
  try {
    const mode = req.params.mode;
    
    if (!seatConfig[mode]) {
      return res.status(400).json({ message: `Invalid mode: ${mode}. Use Flight, Bus, or Train` });
    }
    
    const seats = await Seat.find({ mode_of_travel: mode })
      .sort({ row: 1, column: 1 });
    
    console.log(`📋 Fetched ${seats.length} seats for ${mode}`);
    
    res.json(seats); // Return array directly for frontend compatibility
  } catch (err) {
    console.error("❌ Seat fetch error:", err);
    res.status(500).json({
      message: "Error fetching seats",
      error: err.message
    });
  }
});

export default router;
