import React from 'react';

export default function AutocompleteList({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ul
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        right: 0,
        listStyle: 'none',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        maxHeight: '200px',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        padding: '4px',
      }}
    >
      {suggestions.map((s, idx) => (
        <li
          key={idx}
          onClick={() => onSelect({ lat: parseFloat(s.lat), lng: parseFloat(s.lon), display: s.display_name })}
          style={{
            padding: '10px 12px',
            cursor: 'pointer',
            borderRadius: '8px',
            color: 'var(--text)',
            fontSize: '14px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          {s.display_name}
        </li>
      ))}
    </ul>
  );
}