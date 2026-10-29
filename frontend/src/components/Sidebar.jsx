import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/learning", label: "Learning Studio" },
  { to: "/animation", label: "Animation Studio" },
  { to: "/character-studio", label: "Characters" },
  { to: "/animation-preview", label: "Video Preview" },
  { to: "/quiz", label: "AI Quiz" },
  { to: "/tutor", label: "AI Tutor" },
  { to: "/code", label: "Code Analyzer" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/reports", label: "Reports" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar-label">Workspace</p>
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;
