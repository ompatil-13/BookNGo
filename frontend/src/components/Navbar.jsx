import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, getUser, clearAuth } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="brand"><Link to="/">Aadhaar Travel</Link></div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/book">Book Ticket</Link></li>
          <li><Link to="/bookings">My Bookings</Link></li>
          {!token ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <>
              <li className="user">{user?.name || user?.aadhaar_no}</li>
              <li><button className="btn" onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

