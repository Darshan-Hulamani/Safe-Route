import React from 'react';
import SOSButton from '../components/sos/SOSButton';
import LiveTracking from '../components/sos/LiveTracking';

export default function SOS() {
  const actionCardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '25px',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    transition: '0.3s ease',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  };

  const emergencyCardStyle = {
    borderRadius: '18px',
    padding: '20px',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        overflowY: 'auto',
        padding: '30px',
        paddingBottom: '180px',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <h1
          style={{
            fontSize: '42px',
            fontWeight: '800',
            marginBottom: '10px',
            color: 'var(--text)',
          }}
        >
          🚨 Emergency Center
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '18px',
          }}
        >
          Quick access to emergency assistance
        </p>
      </div>

      {/* Main Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(320px,1fr))',
          gap: '25px',
          marginBottom: '30px',
        }}
      >
        {/* SOS */}
        <div style={actionCardStyle}>
          <h2
            style={{
              color: 'var(--text)',
              marginBottom: '20px',
            }}
          >
            🚨 Emergency SOS
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <SOSButton />
          </div>

          <p
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Send emergency alerts instantly
          </p>
        </div>

        {/* Live Location */}
        <div style={actionCardStyle}>
          <h2
            style={{
              color: 'var(--text)',
              marginBottom: '20px',
            }}
          >
            📍 Live Location
          </h2>

          <LiveTracking />

          <p
            style={{
              color: 'var(--text-secondary)',
              marginTop: '15px',
            }}
          >
            Share your live location instantly
          </p>
        </div>
      </div>

      {/* Emergency Services */}
      <h2
        style={{
          marginBottom: '20px',
          textAlign: 'center',
          color: 'var(--text)',
        }}
      >
        Emergency Services
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(180px,1fr))',
          gap: '20px',
        }}
      >
        <a href="tel:112" style={{ textDecoration: 'none' }}>
          <div
            style={{
              ...emergencyCardStyle,
              background:
                'linear-gradient(135deg,#ef4444,#dc2626)',
            }}
          >
            🚨
            <br />
            Emergency
            <br />
            112
          </div>
        </a>

        <a href="tel:100" style={{ textDecoration: 'none' }}>
          <div
            style={{
              ...emergencyCardStyle,
              background:
                'linear-gradient(135deg,#3b82f6,#2563eb)',
            }}
          >
            👮
            <br />
            Police
            <br />
            100
          </div>
        </a>

        <a href="tel:108" style={{ textDecoration: 'none' }}>
          <div
            style={{
              ...emergencyCardStyle,
              background:
                'linear-gradient(135deg,#22c55e,#16a34a)',
            }}
          >
            🚑
            <br />
            Ambulance
            <br />
            108
          </div>
        </a>

        <a href="tel:1091" style={{ textDecoration: 'none' }}>
          <div
            style={{
              ...emergencyCardStyle,
              background:
                'linear-gradient(135deg,#a855f7,#7e22ce)',
            }}
          >
            👩
            <br />
            Women Helpline
            <br />
            1091
          </div>
        </a>
      </div>
    </div>
  );
}