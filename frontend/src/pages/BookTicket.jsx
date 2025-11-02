import React, { useEffect, useState } from "react";
import { api, getUser, getToken } from "../api";
import SeatSelector from "../components/SeatSelector";

export default function BookTicket() {
  const loggedUser = getUser();
  const token = getToken();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [refreshSeats, setRefreshSeats] = useState(0);
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
        const { data } = await api.get(/api/users/${form.aadhaar_no});
        setProfile(data);
      } catch (err) {
        setProfile(null);
      }
    };
    if (form.aadhaar_no) fetchProfile();
  }, [form.aadhaar_no]);

  // Reset seat selection when mode of travel changes
  useEffect(() => {
    setSelectedSeat("");
    setForm(prev => ({ ...prev, seat_no: "" }));
  }, [form.mode_of_travel]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSeatSelect = (seatNo) => {
    setSelectedSeat(seatNo);
    setForm({ ...form, seat_no: seatNo });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    if (!form.seat_no) {
      setError("Please select a seat");
      return;
    }

    try {
      const { data } = await api.post("/api/tickets/book", form, {
        headers: { Authorization: Bearer ${token} }
      });
      setMessage(Ticket booked! ID: ${data.ticket_id});
      // Reset form and refresh seat data
      setForm({ ...form, mode_of_travel: "", travel_from: "", travel_to: "", date: "", seat_no: "" });
      setSelectedSeat("");
      // Refresh seats by triggering SeatSelector refresh
      setRefreshSeats(prev => prev + 1);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Booking failed";
      setError(errorMsg);
      // If seat was already booked, refresh seat data
      if (err.response?.status === 409) {
        setTimeout(() => {
          setRefreshSeats(prev => prev + 1);
          setSelectedSeat("");
          setForm(prev => ({ ...prev, seat_no: "" }));
        }, 1000);
      }
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
        
        {form.mode_of_travel && (
          <SeatSelector
            mode_of_travel={form.mode_of_travel}
            onSeatSelect={handleSeatSelect}
            selectedSeat={selectedSeat}
            disabled={!form.travel_from || !form.travel_to || !form.date}
            refreshTrigger={refreshSeats}
          />
        )}
        
        {!form.mode_of_travel && (
          <p className="seat-hint">Please select a mode of travel to view available seats</p>
        )}
        
        <button className="btn" type="submit" disabled={!form.seat_no}>
          {form.seat_no ? Book Seat ${form.seat_no} : "Select a seat to continue"}
        </button>
      </form>
    </div>
  );
}

