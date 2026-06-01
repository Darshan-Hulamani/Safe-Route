import React, { useState } from 'react';
import SourceInput from './SourceInput';
import DestinationInput from './DestinationInput';

export default function SearchBar({ onSearch }) {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  const isValid = source && destination &&
                  !isNaN(source.lat) && !isNaN(source.lng) &&
                  !isNaN(destination.lat) && !isNaN(destination.lng);

  const handleClick = () => {
    if (isValid) onSearch(source, destination);
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
      }}
    >
      <h3 style={{ margin: '0 0 15px', color: 'var(--primary)', fontSize: '18px', fontWeight: '700' }}>
        🗺️ Plan Safe Route
      </h3>

      <SourceInput onSelect={setSource} />
      <DestinationInput onSelect={setDestination} />

      <button
        onClick={handleClick}
        disabled={!isValid}
        style={{
          width: '100%',
          padding: '14px',
          marginTop: '10px',
          background: isValid
            ? 'linear-gradient(135deg, var(--primary), var(--primary-light))'
            : 'var(--text-secondary)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '15px',
          cursor: isValid ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          opacity: isValid ? 1 : 0.5,
          boxShadow: isValid ? '0 4px 12px rgba(30,60,114,0.3)' : 'none',
          letterSpacing: '0.3px',
        }}
      >
        🔍 Find Safe Route
      </button>
    </div>
  );
}