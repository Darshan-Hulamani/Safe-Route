import React from 'react';
import { useRouteContext } from '../context/RouteContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { travelMode, setTravelMode } = useRouteContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-page" style={{ padding: '20px' }}>
      <h1>Settings</h1>

      <label style={{ display: 'block', marginBottom: '15px' }}>
        Travel Mode:
        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          style={{ marginTop: '5px', width: '100%' }}
        >
          <option value="walking">Walking</option>
          <option value="driving">Driving</option>
          <option value="cycling">Cycling</option>
        </select>
      </label>

      {/* Theme toggle */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Appearance</strong>
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌞 Light</span>
          <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme === 'dark' ? '#3b82f6' : '#ccc',
              borderRadius: '34px',
              transition: '0.4s'
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '18px',
                width: '18px',
                left: theme === 'dark' ? '28px' : '4px',
                bottom: '3px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '0.4s'
              }} />
            </span>
          </label>
          <span>🌙 Dark</span>
        </div>
      </div>

      <section className="future-roadmap">
        <h2>Future Roadmap</h2>
        <ul>
          <li>AI‑based risk prediction</li>
          <li>Community patrols</li>
          <li>Integration with local authorities</li>
          <li>Voice alerts for danger zones</li>
        </ul>
      </section>
    </div>
  );
}