import React from 'react';
import { Polyline, Marker, Tooltip } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const startIcon = L.divIcon({
  html: `<div style="width:36px; height:36px; background:#2a9d8f; border:3px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="18" height="18" fill="white">
      <path d="M352 348.4C416.1 333.9 464 276.5 464 208C464 128.5 399.5 64 320 64C240.5 64 176 128.5 176 208C176 276.5 223.9 333.9 288 348.4L288 544C288 561.7 302.3 576 320 576C337.7 576 352 561.7 352 544L352 348.4zM328 160C297.1 160 272 185.1 272 216C272 229.3 261.3 240 248 240C234.7 240 224 229.3 224 216C224 158.6 270.6 112 328 112C341.3 112 352 122.7 352 136C352 149.3 341.3 160 328 160z"/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: ''
});

const endIcon = L.divIcon({
  html: `<div style="width:36px; height:36px; background:#e63946; border:3px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24" height="24" fill="white">
      <path d="M320 48C337.7 48 352 62.3 352 80L352 98.3C450.1 112.3 527.7 189.9 541.7 288L560 288C577.7 288 592 302.3 592 320C592 337.7 577.7 352 560 352L541.7 352C527.7 450.1 450.1 527.7 352 541.7L352 560C352 577.7 337.7 592 320 592C302.3 592 288 577.7 288 560L288 541.7C189.9 527.7 112.3 450.1 98.3 352L80 352C62.3 352 48 337.7 48 320C48 302.3 62.3 288 80 288L98.3 288C112.3 189.9 189.9 112.3 288 98.3L288 80C288 62.3 302.3 48 320 48zM160 320C160 408.4 231.6 480 320 480C408.4 480 480 408.4 480 320C480 231.6 408.4 160 320 160C231.6 160 160 231.6 160 320zM320 224C373 224 416 267 416 320C416 373 373 416 320 416C267 416 224 373 224 320C224 267 267 224 320 224z"/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: ''
});

export default function RouteLayer({ coords, safety }) {
  const map = useMap();

  // Make sure we have a valid array of [lat, lng] pairs
  const positions = coords.map(c => [c[0], c[1]]);

  useEffect(() => {
    if (positions.length) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
    }
  }, [positions, map]);

  const color = !safety ? '#2a9d8f' :
                safety.score >= 80 ? '#2a9d8f' :
                safety.score >= 50 ? '#f4a261' : '#e63946';

  return (
    <>
      <Polyline positions={positions} weight={5} color={color} opacity={0.9}>
        <Tooltip sticky>
          <b>{color === '#2a9d8f' ? '✅ Safe' : color === '#f4a261' ? '⚠️ Moderate' : '🚨 Risky'} Route</b>
          <br/>Safety: {safety?.score ?? '…'}%
        </Tooltip>
      </Polyline>

      {/* Only render markers if positions exist */}
      {positions.length > 0 && <Marker position={positions[0]} icon={startIcon} />}
      {positions.length > 1 && <Marker position={positions[positions.length-1]} icon={endIcon} />}
    </>
  );
}