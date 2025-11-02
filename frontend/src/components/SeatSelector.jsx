import React, { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/seatSelector.css";

export default function SeatSelector({ mode_of_travel, onSeatSelect, selectedSeat, disabled = false, refreshTrigger = 0 }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode_of_travel) {
      // Reset seats when mode changes
      setSeats([]);
      if (onSeatSelect) onSeatSelect(""); // Clear selection when mode changes
      fetchSeats();
    } else {
      setSeats([]);
      setLoading(false);
    }
  }, [mode_of_travel, refreshTrigger]);

  const fetchSeats = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/api/seats/${mode_of_travel}`);
      // Handle response - should be an array
      if (Array.isArray(data)) {
        setSeats(data);
      } else if (data.seats && Array.isArray(data.seats)) {
        setSeats(data.seats);
      } else {
        setSeats([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load seats");
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (disabled || seat.isBooked) return;
    onSeatSelect(seat.seat_no);
  };

  // Group seats by row for display
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(groupedSeats).sort((a, b) => a - b);

  // Column configurations per mode
  const columnConfig = {
    Flight: ["A", "B", "C", "D", "E", "F"],
    Bus: ["A", "B", "C"],
    Train: ["A", "B", "C", "D"]
  };

  const expectedColumns = columnConfig[mode_of_travel] || [];

  if (loading) {
    return <div className="seat-selector-loading">Loading seats...</div>;
  }

  if (error) {
    return <div className="seat-selector-error">{error}</div>;
  }

  if (seats.length === 0) {
    return (
      <div className="seat-selector-empty">
        <p>No seats available for {mode_of_travel}.</p>
        <p className="text-muted">Seats need to be initialized first.</p>
      </div>
    );
  }

  return (
    <div className="seat-selector-container">
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat-selected"></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="seat-info">
        <p><strong>{mode_of_travel}:</strong> {seats.length} seats ({rows.length} rows × {expectedColumns.length} columns per row)</p>
      </div>

      <div className="seat-grid">
        {rows.map((rowNum) => (
          <div key={rowNum} className="seat-row">
            <span className="row-label">Row {rowNum}</span>
            <div className="seat-columns">
              {groupedSeats[rowNum]
                .sort((a, b) => a.column.localeCompare(b.column))
                .map((seat) => {
                  const isSelected = selectedSeat === seat.seat_no;
                  const isBooked = seat.isBooked;
                  let seatClass = "seat";
                  if (isBooked) seatClass += " seat-booked";
                  else if (isSelected) seatClass += " seat-selected";
                  else seatClass += " seat-available";

                  return (
                    <button
                      key={seat.seat_no}
                      type="button"
                      className={seatClass}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isBooked || disabled}
                      title={isBooked ? "Already booked" : `Seat ${seat.seat_no}`}
                    >
                      {seat.seat_no}
                    </button>
                  );
                })}
              {/* Fill empty spaces for incomplete rows */}
              {Array.from({ length: expectedColumns.length - groupedSeats[rowNum].length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="seat seat-empty" style={{ visibility: 'hidden' }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSeat && (
        <div className="selected-seat-info">
          Selected Seat: <strong>{selectedSeat}</strong>
        </div>
      )}
    </div>
  );
}
