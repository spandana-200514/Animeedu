import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../services/api.js";

function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="logo-mark">AE</span>
        <div>
          <strong>AnimeEdu</strong>
          <p>AI Animated Learning Platform</p>
        </div>
      </div>
      <div className="navbar-actions">
        <NavLink to="/reports">Reports</NavLink>
        <div className="user-chip">{user?.full_name || "Student"}</div>
        <button type="button" className="ghost-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
