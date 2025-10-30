import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

// POST /api/tickets/book
router.post("/book", protect, async (req, res) => {
  try {
    const { aadhaar_no, mode_of_travel, travel_from, travel_to, date, seat_no } = req.body;
    if (!aadhaar_no || !mode_of_travel || !travel_from || !travel_to || !date || !seat_no) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (req.user?.aadhaar_no !== aadhaar_no) {
      return res.status(403).json({ message: "Forbidden: token/user mismatch" });
    }
    const ticket = await Ticket.create({
      ticket_id: String(Date.now()),
      aadhaar_no,
      mode_of_travel,
      travel_from,
      travel_to,
      date,
      seat_no,
      status: "Confirmed"
    });
    return res.status(201).json(ticket);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/tickets/user/:aadhaar_no
router.get("/user/:aadhaar_no", protect, async (req, res) => {
  try {
    const { aadhaar_no } = req.params;
    if (req.user?.aadhaar_no !== aadhaar_no) {
      return res.status(403).json({ message: "Forbidden: token/user mismatch" });
    }
    const tickets = await Ticket.find({ aadhaar_no }).sort({ date: -1 });
    return res.json(tickets);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

