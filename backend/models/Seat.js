import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
  seat_no: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  mode_of_travel: { type: String, enum: ["Flight", "Bus", "Train"], required: true },
  row: { type: Number, required: true },
  column: { type: String, required: true }
});

// Compound unique index: seat_no + mode_of_travel (allows same seat_no for different modes)
SeatSchema.index({ seat_no: 1, mode_of_travel: 1 }, { unique: true });

export default mongoose.model("Seat", SeatSchema);
