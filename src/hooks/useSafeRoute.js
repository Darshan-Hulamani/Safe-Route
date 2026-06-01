import { useState, useCallback } from 'react';
import { getSafeRoute } from '../services/maps/routingService';
import { useReports } from './useReports';
import toast from 'react-hot-toast';

export function useSafeRoute() {
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);
  const [safety, setSafety] = useState(null);
  const { reports } = useReports();

  const calculateSafeRoute = useCallback(async (source, destination, mode = 'walking', trafficEnabled = false) => {
    if (!source || !destination || !source.lat || !destination.lat) {
      toast.error('Invalid locations');
      return;
    }
    setLoading(true);
    try {
      const result = await getSafeRoute(source, destination, mode, reports, trafficEnabled);
      setRoute(result.route);
      setSafety({ score: result.safetyScore });
      const msg =
        result.safetyScore >= 80
          ? `✅ Safe route (${result.safetyScore}%)`
          : result.safetyScore >= 50
          ? `⚠️ Moderate risk (${result.safetyScore}%)`
          : `🚨 High risk – detouring around danger zones (${result.safetyScore}%)`;
      toast(msg, { duration: 4000 });
    } catch (err) {
      console.error(err);
      toast.error('Route calculation failed');
      setRoute(null);
      setSafety(null);
    } finally {
      setLoading(false);
    }
  }, [reports]);

  return { loading, route, safety, calculateSafeRoute };
}