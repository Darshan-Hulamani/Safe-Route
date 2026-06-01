import React, { useEffect, useState } from 'react';
import { reverseGeocode } from '../../services/maps/geocodingService';

export default function ReportLocation({ lat, lng }) {
  const [name, setName] = useState('Loading location…');

  useEffect(() => {
    let cancelled = false;
    reverseGeocode(lat, lng).then(data => {
      if (!cancelled && data && data.display_name) {
        // Use the first part of the address (street/area)
        const shortName = data.display_name.split(',')[0].trim();
        setName(shortName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      } else if (!cancelled) {
        setName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    }).catch(() => {
      if (!cancelled) setName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    });
    return () => { cancelled = true; };
  }, [lat, lng]);

  return <span>📍 {name}</span>;
}