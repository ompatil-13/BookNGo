import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  ticket_id: { type: String, required: true },
  aadhaar_no: { type: String, required: true },
  mode_of_travel: { type: String, enum: ["Flight", "Bus", "Train"], required: true },
  travel_from: { type: String, required: true },
  travel_to: { type: String, required: true },
  date: { type: String, required: true },
  seat_no: { type: String, required: true },
  status: { type: String, default: "Confirmed" }
});

export default mongoose.model("Ticket", TicketSchema);

