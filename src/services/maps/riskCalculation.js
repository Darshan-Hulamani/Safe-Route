// Simple risk score based on proximity to danger zones
export const calculateRouteRisk = (routeCoords, dangerZones, thresholdMeters = 50) => {
  if (!routeCoords || !dangerZones.length) return { score: 100, affectedZones: [] };

  let totalRisk = 0;
  const affected = [];

  routeCoords.forEach((coord) => {
    dangerZones.forEach(zone => {
      const dist = haversineDistance(coord, [zone.latitude, zone.longitude]);
      if (dist < thresholdMeters) {
        totalRisk += (1 - dist / thresholdMeters) * zone.riskWeight || 0.5;
        if (!affected.find(z => z.id === zone.id)) affected.push(zone);
      }
    });
  });

  const score = Math.max(0, Math.round(100 - totalRisk * 20));
  return { score, affectedZones: affected };
};

function haversineDistance(coord1, coord2) {
  const R = 6371e3; // metres
  const φ1 = coord1[1] * Math.PI/180;
  const φ2 = coord2[0] * Math.PI/180;
  const Δφ = (coord2[0]-coord1[1]) * Math.PI/180;
  const Δλ = (coord2[1]-coord1[0]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}