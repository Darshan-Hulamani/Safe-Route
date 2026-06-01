import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const userIcon = L.divIcon({
  className: 'user-marker',
  html: '<div style="background: #1e3c72; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [20, 20],
});

export default function UserMarker({ position }) {
  return (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}