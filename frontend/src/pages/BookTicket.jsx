import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function SeatSelector({
  mode_of_travel,
  seatLayout,
  onSeatSelect,
  selectedSeat,
  disabled,
  refreshTrigger,
}) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seats from backend
  const fetchSeats = async () => {
    if (!mode_of_travel) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/seats/${mode_of_travel}`);
      setSeats(data);
    } catch (err) {
      console.error("Failed to load seats:", err);
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever mode or refresh changes
  useEffect(() => {
    fetchSeats();
  }, [mode_of_travel, refreshTrigger]);

  // Generate seats dynamically if backend not initialized
  const generateSeats = () => {
    const rows = seatLayout?.rows || 10;
    const cols = seatLayout?.cols || 4;
    const seatLetters = ["A", "B", "C", "D"].slice(0, cols);
    const generated = [];

    for (let i = 1; i <= rows; i++) {
      seatLetters.forEach((letter) => {
        const seatNo = `${i}${letter}`;
        const backendSeat = seats.find((s) => s.seat_no === seatNo);
        generated.push({
          seat_no: seatNo,
          isBooked: backendSeat ? backendSeat.isBooked : false,
        });
      });
    }
    return generated;
  };

  const displayedSeats = generateSeats();

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading seat map...</p>;

  return (
    <div className="seat-selector">
      <div className="seat-legend">
        <span>
          <span className="seat available"></span> Available
        </span>
        <span>
          <span className="seat booked"></span> Booked
        </span>
        <span>
          <span className="seat selected"></span> Selected
        </span>
      </div>

      <div className="seat-grid">
        {Array.from({ length: seatLayout?.rows || 10 }).map((_, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {["A", "B", "C", "D"]
              .slice(0, seatLayout?.cols || 4)
              .map((letter) => {
                const seatNo = `${rowIndex + 1}${letter}`;
                const seat = displayedSeats.find(
                  (s) => s.seat_no === seatNo
                );
                const isBooked = seat?.isBooked;
                const isSelected = selectedSeat === seatNo;

                return (
                  <button
                    key={seatNo}
                    className={`seat-btn ${
                      isBooked
                        ? "booked"
                        : isSelected
                        ? "selected"
                        : "available"
                    }`}
                    onClick={() => !isBooked && !disabled && onSeatSelect(seatNo)}
                    disabled={isBooked || disabled}
                  >
                    {letter}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .seat-selector {
          text-align: center;
          margin-top: 1rem;
        }

        .seat-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .seat {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 4px;
          margin-right: 5px;
        }

        .seat.available {
          background-color: #4caf50;
        }
        .seat.booked {
          background-color: #d9534f;
        }
        .seat.selected {
          background-color: #2196f3;
        }

        .seat-grid {
          display: inline-block;
          padding: 10px;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .seat-row {
          display: flex;
          justify-content: center;
          margin-bottom: 6px;
        }

        .seat-btn {
          width: 40px;
          height: 40px;
          margin: 3px;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .seat-btn.available {
          background-color: #4caf50;
          color: white;
        }

        .seat-btn.available:hover {
          background-color: #43a047;
        }

        .seat-btn.booked {
          background-color: #d9534f;
          color: white;
          cursor: not-allowed;
        }

        .seat-btn.selected {
          background-color: #2196f3;
          color: white;
        }
      `}</style>
    </div>
  );
}
