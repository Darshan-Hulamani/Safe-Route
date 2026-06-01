import React from 'react';

export default function BottomSheet({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      zIndex: 2000,
    }}>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
        }}
      />

      {/* Content */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--card-bg)',
        color: 'var(--text)',
        borderRadius: '20px 20px 0 0',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '20px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
        zIndex: 2001,
        borderTop: '1px solid var(--border)',
      }}>
        {/* Handle bar */}
        <div style={{
          width: '40px',
          height: '4px',
          background: 'var(--text-secondary)',
          borderRadius: '2px',
          margin: '0 auto 20px',
          cursor: 'pointer',
          opacity: 0.5,
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '22px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: '5px',
            lineHeight: '1',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}