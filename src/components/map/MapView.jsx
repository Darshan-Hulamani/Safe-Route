import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DangerZones from './DangerZones';
import RouteLayer from './RouteLayer';
import { useReports } from '../../hooks/useReports';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useTheme } from '../../context/ThemeContext';
import { useTraffic } from '../../hooks/useTraffic';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = L.divIcon({
  html: '<div style="width:20px;height:20px;background:#1e3c72;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(30,60,114,0.5);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng); } });
  return null;
}

function FlyToLocation({ location }) {
  const map = useMap();
  React.useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 15);
  }, [location, map]);
  return null;
}

export default function MapView({ onMapClick, routeCoords, safety }) {
  const { location } = useGeolocation();
  const { reports } = useReports();
  const { theme } = useTheme();
  const { trafficTileUrl, trafficEnabled, setTrafficEnabled, isMapboxAvailable } = useTraffic();

  const defaultCenter = location ? [location.lat, location.lng] : [12.9716, 77.5946];
  const defaultZoom = location ? 15 : 12;

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = theme === 'dark'
    ? '&copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Traffic Toggle Button */}
      {isMapboxAvailable && (
        <button
          onClick={() => setTrafficEnabled(!trafficEnabled)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            background: trafficEnabled ? '#22c55e' : 'var(--bg-secondary)',
            color: trafficEnabled ? '#fff' : 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          🚦 {trafficEnabled ? 'Traffic ON' : 'Traffic OFF'}
        </button>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        key={theme}
      >
        <TileLayer attribution={attribution} url={tileUrl} />

        {/* Traffic Tile Layer */}
        {trafficTileUrl && (
          <TileLayer
            key="traffic-layer"
            url={trafficTileUrl}
            attribution='Traffic by <a href="https://www.mapbox.com/">Mapbox</a>'
            opacity={0.7}
          />
        )}

        <MapClickHandler onMapClick={onMapClick} />
        {location && (
          <Marker position={[location.lat, location.lng]} icon={userIcon}>
            <Popup>📍 You are here</Popup>
          </Marker>
        )}
        <DangerZones zones={reports} />
        {routeCoords && routeCoords.length > 0 && (
          <RouteLayer coords={routeCoords} safety={safety} />
        )}
        <FlyToLocation location={location} />
      </MapContainer>
    </div>
  );
}