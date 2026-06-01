const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const INDIA_BOUNDS = '68.0,38.0,97.0,6.0';

export const geocode = async (query) => {
  try {
    const url = `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&accept-language=en&countrycodes=in&viewbox=${INDIA_BOUNDS}&bounded=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};