const OSRM_BASE = 'https://router.project-osrm.org';
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
const MAPBOX_DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox';

const PROFILE_MAP = {
  walking: 'foot',
  driving: 'car',
  cycling: 'bike'
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function fetchRoute(coordsArray, mode = 'walking') {
  const profile = PROFILE_MAP[mode] || 'foot';
  const coordsStr = coordsArray.map(c => `${c.lng},${c.lat}`).join(';');
  const url = `${OSRM_BASE}/route/v1/${profile}/${coordsStr}?overview=full&geometries=geojson&steps=true&alternatives=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM error ${res.status}`);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No route');
  return data.routes;
}

// ** FIXED ** Returns a score between 0 (worst) and 100 (best)
function scoreRoute(route, dangerZones) {
  const coords = route.geometry.coordinates;
  if (!dangerZones.length) return { score: 100, nearZones: [] };

  let totalRisk = 0;
  const nearZones = [];
  const seenIds = new Set();

  coords.forEach(c => {
    dangerZones.forEach(zone => {
      const dist = calculateDistance(c[1], c[0], zone.latitude, zone.longitude);
      if (dist < 500) {  // only penalise points within 500m
        const severity = Math.max(0, 1 - dist / 500); // 1 = very close, 0 = at 500m
        totalRisk += severity;
        if (!seenIds.has(zone.id)) {
          nearZones.push(zone);
          seenIds.add(zone.id);
        }
      }
    });
  });

  // Average risk per point, then convert to score 0-100
  const avgRisk = coords.length > 0 ? totalRisk / coords.length : 0;
  const score = Math.round(100 * (1 - avgRisk));
  return { score: Math.max(0, Math.min(100, score)), nearZones };
}

// Fetch traffic penalty from Mapbox (1 = no penalty, >1 = congestion)
async function getTrafficPenalty(routeCoords, mode = 'walking') {
  if (!MAPBOX_TOKEN || mode !== 'driving') return 1;
  const coords = routeCoords.map(c => `${c[0]},${c[1]}`).join(';');
  const url = `${MAPBOX_DIRECTIONS_URL}/driving-traffic/${coords}?geometries=geojson&access_token=${MAPBOX_TOKEN}&annotations=congestion`;
  try {
    const res = await fetch(url);
    if (!res.ok) return 1;
    const data = await res.json();
    if (!data.routes || !data.routes[0]) return 1;
    const legs = data.routes[0].legs;
    let totalCongestion = 0, segments = 0;
    legs.forEach(leg => {
      leg.annotation?.congestion?.forEach(level => {
        const weight = level === 'severe' ? 2 : level === 'heavy' ? 1.5 : level === 'moderate' ? 1.2 : 1;
        totalCongestion += weight;
        segments++;
      });
    });
    return segments ? totalCongestion / segments : 1;
  } catch (e) {
    console.warn('Traffic data fetch failed:', e);
    return 1;
  }
}

function getAvoidWaypoint(zone, routeStart, routeEnd) {
  const dx = routeEnd.lng - routeStart.lng;
  const dy = routeEnd.lat - routeStart.lat;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  const perpX = -dy / len;
  const perpY = dx / len;
  const offset = 0.0045; // ~200m
  return {
    lat: zone.latitude + perpY * offset,
    lng: zone.longitude + perpX * offset
  };
}

export async function getSafeRoute(
  startCoords,
  endCoords,
  mode = 'walking',
  dangerZones = [],
  applyTraffic = false
) {
  // Helper to compute final score for a route (danger + optional traffic)
  async function computeFinalScore(route) {
    const { score: dangerScore } = scoreRoute(route, dangerZones);
    let trafficPenalty = 1;
    if (applyTraffic && MAPBOX_TOKEN) {
      trafficPenalty = await getTrafficPenalty(route.geometry.coordinates, mode);
    }
    // Final score = danger score divided by traffic penalty, capped at 100
    const finalScore = Math.round(dangerScore / trafficPenalty);
    return {
      finalScore: Math.min(100, Math.max(0, finalScore)),
      dangerScore,
      trafficPenalty
    };
  }

  // No danger zones -> still apply traffic if requested
  if (!dangerZones.length) {
    const routes = await fetchRoute([startCoords, endCoords], mode);
    const bestRoute = routes[0];
    const { finalScore, trafficPenalty } = await computeFinalScore(bestRoute);
    return {
      route: bestRoute,
      safetyScore: finalScore,
      allRoutes: routes,
      details: { nearbyZones: 0, risk: 0, blocked: false, trafficPenalty }
    };
  }

  // First attempt: standard alternative routes
  let routes = await fetchRoute([startCoords, endCoords], mode);
  let best = null;
  let bestScore = -1;
  let bestTrafficPenalty = 1;

  for (const r of routes) {
    const { finalScore, trafficPenalty } = await computeFinalScore(r);
    if (finalScore > bestScore) {
      bestScore = finalScore;
      best = r;
      bestTrafficPenalty = trafficPenalty;
    }
  }

  // If the best route is unsafe (final score < 60), try to avoid the first dangerous zone
  if (bestScore < 60) {
    const { nearZones } = scoreRoute(best, dangerZones);
    if (nearZones.length > 0) {
      const avoidZone = nearZones[0];
      const waypoint = getAvoidWaypoint(avoidZone, startCoords, endCoords);
      console.log("Using Detour waypoint:", waypoint, "to avoid zone:", avoidZone);
      try {
        const viaRoutes = await fetchRoute([startCoords, waypoint, endCoords], mode);
        if (viaRoutes.length) {
          let viaBest = null, viaBestScore = -1;
          for (const r of viaRoutes) {
            const { finalScore } = await computeFinalScore(r);
            if (finalScore > viaBestScore) {
              viaBestScore = finalScore;
              viaBest = r;
            }
          }
          if (viaBestScore > bestScore) {
            best = viaBest;
            bestScore = viaBestScore;
          }
        }
      } catch (e) {
        console.warn('Avoidance routing failed, using standard route', e);
      }
    }
  }

  return {
    route: best || routes[0],
    safetyScore: bestScore >= 0 ? bestScore : 100,
    allRoutes: routes,
    details: { trafficPenalty: bestTrafficPenalty }
  };
}