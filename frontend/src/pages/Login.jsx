import React, { useState } from "react";
import { api, setAuth } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ aadhaar_no: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/api/users/login", form);
      setAuth(data.token, data.user);
      navigate("/book");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Login</h2>
      {error && <p className="alert error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <input name="aadhaar_no" placeholder="Aadhaar Number" value={form.aadhaar_no} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  );
}

