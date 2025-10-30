import React, { useEffect, useState } from "react";
import { api, getUser, getToken } from "../api";

export default function MyBookings() {
  const user = getUser();
  const token = getToken();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get(`/api/tickets/user/${user.aadhaar_no}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
      }
    };
    if (user?.aadhaar_no) fetchTickets();
  }, [user, token]);

  return (
    <div>
      <h2>My Bookings</h2>
      {error && <p className="alert error">{error}</p>}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mode</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Seat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.ticket_id}>
                <td>{t.ticket_id}</td>
                <td>{t.mode_of_travel}</td>
                <td>{t.travel_from}</td>
                <td>{t.travel_to}</td>
                <td>{t.date}</td>
                <td>{t.seat_no}</td>
                <td>{t.status}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

