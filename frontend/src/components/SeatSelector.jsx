import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function SeatSelector({ mode_of_travel, onSeatSelect, selectedSeat, disabled, refreshTrigger }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seats by mode_of_travel
  useEffect(() => {
    const fetchSeats = async () => {
      if (!mode_of_travel) return;
      setLoading(true);
      try {
        // 🔥 fetch only seats for selected mode
        const { data } = await api.get(`/api/seats?mode_of_travel=${mode_of_travel}`);
        setSeats(data);
      } catch (err) {
        console.error("Failed to load seats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [mode_of_travel, refreshTrigger]);

  if (loading) return <p>Loading seats...</p>;
  if (!seats.length) return <p>No seats available for {mode_of_travel}</p>;

  return (
    <div className="seat-grid">
      {seats.map((seat) => (
        <button
          key={`${seat.mode_of_travel}-${seat.seat_no}`}
          className={`seat ${seat.isBooked ? "booked" : ""} ${
            selectedSeat === seat.seat_no ? "selected" : ""
          }`}
          onClick={() => onSeatSelect(seat.seat_no)}
          disabled={seat.isBooked || disabled}
        >
          {seat.seat_no}
        </button>
      ))}
    </div>
  );
}
