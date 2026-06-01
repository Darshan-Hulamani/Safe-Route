import { useState, useEffect } from 'react';
import { watchLocation } from '../services/gps/liveLocation';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stopWatching = watchLocation(
      (loc) => setLocation(loc),
      (err) => setError(err.message)
    );
    return stopWatching;
  }, []);

  return { location, error };
}