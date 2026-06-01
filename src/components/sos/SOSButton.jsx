import React from 'react';
import { useSOS } from '../../hooks/useSOS';
import toast from 'react-hot-toast';
import '../../index.css';
import '../../App.css';

export default function SOSButton() {
  const { triggerSOS, sosActive, deactivateSOS } = useSOS();

  const handleSOS = () => {
    if (sosActive) {
      deactivateSOS();
      toast.success('SOS deactivated');
      return;
    }

    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');

      window.open(
        'https://wa.me/',
        '_blank'
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const freshLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        const TRUSTED_CONTACT =
        localStorage.getItem(
          'trusted_contact'
        ) || '919480801000';
        const message = `🚨 EMERGENCY ALERT 🚨

I may be in danger.

My live location:
https://maps.google.com/?q=${freshLocation.lat},${freshLocation.lng}

Please contact me immediately.

Sent from SafeRoute.`;

        if (TRUSTED_CONTACT) {
          window.open(
            `https://wa.me/${TRUSTED_CONTACT}?text=${encodeURIComponent(
              message
            )}`,
            '_blank'
          );
        } else {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              message
            )}`,
            '_blank'
          );
        }

        triggerSOS(freshLocation);
        toast.success('Emergency alert sent!');
      },

      (err) => {
        console.error(err);

        const TRUSTED_CONTACT =
        localStorage.getItem(
          'trusted_contact'
  ) || '919480801000';

        const message = `🚨 EMERGENCY ALERT 🚨

Location unavailable.

Please contact me immediately.

Sent from SafeRoute.`;

        if (TRUSTED_CONTACT) {
          window.open(
            `https://wa.me/${TRUSTED_CONTACT}?text=${encodeURIComponent(
              message
            )}`,
            '_blank'
          );
        } else {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              message
            )}`,
            '_blank'
          );
        }

        toast.error(
          'Location unavailable. Opening WhatsApp.'
        );
      },

      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 60000,
      }
    );
  };

  return (
<button
  className={`sos-button ${sosActive ? 'active' : ''}`}
  onClick={handleSOS}
  style={{
    
    background: sosActive
      ? 'linear-gradient(135deg,#6c757d,#495057)'
      : 'linear-gradient(135deg,#ff1744,#d50000)',
    color: 'white',
    border: '3px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    width: '85px',
    height: '85px',
    fontWeight: '800',
    fontSize: '18px',
    boxShadow: sosActive
      ? '0 0 25px rgba(108,117,125,0.7)'
      : '0 0 30px rgba(255,23,68,0.8)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    animation: sosActive
      ? 'pulse 1.5s infinite'
      : 'pulse 2s infinite',
    backdropFilter: 'blur(10px)',
  }}
>
  <span style={{ fontSize: '24px' }}>
    🚨
  </span>

  <span
    style={{
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: '1px'
    }}
  >
    {sosActive ? 'STOP' : 'SOS'}
  </span>
</button>
  );
}