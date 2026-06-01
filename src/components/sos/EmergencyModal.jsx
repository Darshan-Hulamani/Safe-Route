import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import toast from 'react-hot-toast';

export default function EmergencyModal({ isOpen, onClose, location }) {
  const callEmergency = () => {
    window.location.href = 'tel:112'; // India emergency number
    toast.success('Calling emergency services...');
  };

  const shareLocation = async () => {
    if (!location) {
      toast.error('Location not available');
      return;
    }
    const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    if (navigator.share) {
      await navigator.share({
        title: 'Emergency - My Location',
        text: `I need help! My location: ${mapsLink}`,
      });
    } else {
      await navigator.clipboard.writeText(mapsLink);
      toast.success('Location link copied!');
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <h2 style={{ color: '#e63946', marginBottom: '20px' }}>🚨 Emergency Options</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={callEmergency}
          style={{ 
            padding: '15px', 
            background: '#e63946', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📞 Call Emergency (112)
        </button>
        
        <button 
          onClick={shareLocation}
          style={{ 
            padding: '15px', 
            background: '#f4a261', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📍 Share My Location
        </button>
        
        <button 
          onClick={onClose}
          style={{ 
            padding: '12px', 
            background: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </BottomSheet>
  );
}