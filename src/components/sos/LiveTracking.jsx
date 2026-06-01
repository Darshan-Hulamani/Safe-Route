import React from 'react';
import toast from 'react-hot-toast';
import { useGeolocation } from '../../hooks/useGeolocation';

export default function LiveTracking() {
  const { location } = useGeolocation();

  const shareLink = async () => {
    // Get fresh location for sharing
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
        const shareText = `Track my live location: ${mapsLink}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title: 'My Live Location',
              text: shareText,
            });
          } catch (err) {
            console.log('Share cancelled');
          }
        } else {
          await navigator.clipboard.writeText(shareText);
          toast.success('Location link copied!');
        }
      },
      (err) => {
        toast.error('Could not get location. Please enable GPS.');
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button
        onClick={shareLink}
        style={{
          padding: '15px 30px',
          background: '#2a9d8f',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        🔗 Share Live Location
      </button>
      <p style={{ marginTop: '10px', color: '#6c757d', fontSize: '14px' }}>
        Share a Google Maps link of your current location
      </p>
    </div>
  );
}