import React, { useState } from "react";
import { api } from "../api";

export default function Register() {
  const [form, setForm] = useState({ aadhaar_no: "", name: "", gender: "", email: "", contact: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const { data } = await api.post("/api/users/register", form);
      setMessage(data.message || "Registered successfully");
      setForm({ aadhaar_no: "", name: "", gender: "", email: "", contact: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Register</h2>
      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <input name="aadhaar_no" placeholder="Aadhaar Number" value={form.aadhaar_no} onChange={onChange} required />
        <input name="name" placeholder="Full Name" value={form.name} onChange={onChange} required />
        <select name="gender" value={form.gender} onChange={onChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="contact" placeholder="Contact Number" value={form.contact} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button className="btn" type="submit">Create Account</button>
      </form>
    </div>
  );
}

