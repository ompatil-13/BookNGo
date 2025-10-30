import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "myLocalSecretKey", { expiresIn: "7d" });
}

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { aadhaar_no, name, gender, email, contact, password } = req.body;
    if (!aadhaar_no || !name || !gender || !email || !contact || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ aadhaar_no });
    if (existing) return res.status(409).json({ message: "User already exists" });
    const user = await User.create({ aadhaar_no, name, gender, email, contact, password });
    return res.status(201).json({ message: "Registered successfully", user: { aadhaar_no: user.aadhaar_no, name: user.name, gender: user.gender, email: user.email, contact: user.contact } });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { aadhaar_no, password } = req.body;
    const user = await User.findOne({ aadhaar_no });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken({ aadhaar_no: user.aadhaar_no });
    return res.json({ token, user: { aadhaar_no: user.aadhaar_no, name: user.name, gender: user.gender, email: user.email, contact: user.contact } });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/users/:aadhaar_no
router.get("/:aadhaar_no", async (req, res) => {
  try {
    const user = await User.findOne({ aadhaar_no: req.params.aadhaar_no }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

