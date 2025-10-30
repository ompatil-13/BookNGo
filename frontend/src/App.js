import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BookTicket from "./pages/BookTicket";
import MyBookings from "./pages/MyBookings";
import "./styles/form.css";
import "./styles/navbar.css";
import "./styles/table.css";
import { getToken } from "./api";

function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book" element={<PrivateRoute><BookTicket /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

