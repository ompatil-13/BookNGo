import React, { useEffect, useState } from "react";
import axios from "axios";

const SeatSelector = ({ mode }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Dynamic grid columns for each travel mode
  const gridColumns = {
    Flight: "grid-cols-6", // 6 seats per row
    Bus: "grid-cols-4",    // 4 seats per row
    Train: "grid-cols-8",  // 8 seats per row
  };

  useEffect(() => {
    if (!mode) return;
    setLoading(true);

    axios
      .get(`https://bookngo-backend-rtyo.onrender.com/api/seats/${mode}`)
      .then((res) => {
        setSeats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Seat fetch error:", err);
        setLoading(false);
      });
  }, [mode]);

  const handleSeatSelect = (seat) => {
    if (seat.isBooked) {
      alert("❌ This seat is already booked!");
      return;
    }
    setSelectedSeat(seat);
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-6">Loading seats...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        {mode} Seat Selection
      </h2>

      {/* Seat Legends */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 border rounded"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 border rounded"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 border rounded"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div
        className={`grid gap-2 justify-center ${gridColumns[mode] || "grid-cols-6"}`}
      >
        {seats.map((seat) => (
          <button
            key={seat._id}
            onClick={() => handleSeatSelect(seat)}
            className={`p-2 text-sm font-medium border rounded-lg transition-all
              ${
                seat.isBooked
                  ? "bg-red-400 text-white cursor-not-allowed"
                  : selectedSeat?._id === seat._id
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-blue-300"
              }`}
          >
            {seat.seat_no}
          </button>
        ))}
      </div>

      {/* Selected Seat Display */}
      {selectedSeat && (
        <div className="mt-6 text-center">
          <p className="text-lg font-medium">
            ✅ Selected Seat:{" "}
            <span className="font-bold text-green-600">
              {selectedSeat.seat_no}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;

