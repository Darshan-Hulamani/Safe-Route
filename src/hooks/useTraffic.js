import { useState, useMemo } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export function useTraffic() {
  const [trafficEnabled, setTrafficEnabled] = useState(false);
  const [trafficMode] = useState('both'); // not used for now

  const trafficTileUrl = useMemo(() => {
    if (!trafficEnabled || !MAPBOX_TOKEN) return null;
    return `https://api.mapbox.com/styles/v1/mapbox/traffic-day-v2/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`;
  }, [trafficEnabled]);

  return {
    trafficEnabled,
    setTrafficEnabled,
    trafficTileUrl,
    isMapboxAvailable: !!MAPBOX_TOKEN,
  };
}