import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-item" end>
        <span className="nav-icon">🗺️</span>
        <span>Map</span>
      </NavLink>
      <NavLink to="/sos" className="nav-item">
        <span className="nav-icon">🆘</span>
        <span>SOS</span>
      </NavLink>
      <NavLink to="/contacts" className="nav-item">
        <span className="nav-icon">👥</span>
        <span>Contacts</span>
      </NavLink>
      <NavLink to="/reports" className="nav-item">
        <span className="nav-icon">📋</span>
        <span>Reports</span>
      </NavLink>
      <button onClick={toggleTheme} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <span className="nav-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    </nav>
  );
}