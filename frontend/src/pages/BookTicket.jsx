import React, { useEffect, useState } from "react";
import { api, getUser, getToken } from "../api";

export default function BookTicket() {
  const loggedUser = getUser();
  const token = getToken();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    aadhaar_no: loggedUser?.aadhaar_no || "",
    mode_of_travel: "",
    travel_from: "",
    travel_to: "",
    date: "",
    seat_no: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/api/users/${form.aadhaar_no}`);
        setProfile(data);
      } catch (err) {
        setProfile(null);
      }
    };
    if (form.aadhaar_no) fetchProfile();
  }, [form.aadhaar_no]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const { data } = await api.post("/api/tickets/book", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`Ticket booked! ID: ${data.ticket_id}`);
      setForm({ ...form, mode_of_travel: "", travel_from: "", travel_to: "", date: "", seat_no: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Book Ticket</h2>
      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}

      <div className="profile-box">
        <h3>Aadhaar Profile</h3>
        <div className="grid-2">
          <div>
            <label>Aadhaar No</label>
            <input name="aadhaar_no" value={form.aadhaar_no} onChange={onChange} placeholder="Enter Aadhaar No" />
          </div>
          <div>
            <label>Name</label>
            <input value={profile?.name || ""} readOnly />
          </div>
          <div>
            <label>Gender</label>
            <input value={profile?.gender || ""} readOnly />
          </div>
          <div>
            <label>Contact</label>
            <input value={profile?.contact || ""} readOnly />
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="form">
        <select name="mode_of_travel" value={form.mode_of_travel} onChange={onChange} required>
          <option value="">Mode of Travel</option>
          <option value="Flight">Flight</option>
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
        </select>
        <input name="travel_from" placeholder="From" value={form.travel_from} onChange={onChange} required />
        <input name="travel_to" placeholder="To" value={form.travel_to} onChange={onChange} required />
        <input type="date" name="date" value={form.date} onChange={onChange} required />
        <input name="seat_no" placeholder="Seat No" value={form.seat_no} onChange={onChange} required />
        <button className="btn" type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}

