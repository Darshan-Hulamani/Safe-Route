import React from 'react';
import { Circle, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useReports } from '../../hooks/useReports';

// Helper: colour based on danger type
const getColor = (type) => {
  const colors = {
    assault: '#e63946',
    theft: '#f4a261',
    harassment: '#e76f51',
    poor_lighting: '#ffb703',
    other: '#6c757d',
  };
  return colors[type] || '#e63946';
};

// Danger zone icon – red hazard triangle
const dangerIcon = L.divIcon({
  html: `<div style="width:32px; height:32px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="32" height="32" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
      <path d="M288 96L211.7 96C182.3 96 156.6 116.1 149.6 144.6L65.4 484.5C57.9 514.7 80.8 544 112 544L321.4 544C310.2 519.6 304 492.6 304 464C304 435.4 310.2 408.3 321.4 384C320.9 384 320.4 384 319.9 384C302.2 384 287.9 369.7 287.9 352L287.9 288C287.9 270.3 302.2 256 319.9 256C337.6 256 351.9 270.3 351.9 288L351.9 337C387.1 297.1 438.6 272 495.9 272C504.9 272 513.7 272.6 522.4 273.8L490.4 144.6C483.4 116.1 457.8 96 428.3 96L351.9 96L351.9 160C351.9 177.7 337.6 192 319.9 192C302.2 192 287.9 177.7 287.9 160L287.9 96zM496 608C575.5 608 640 543.5 640 464C640 384.5 575.5 320 496 320C416.5 320 352 384.5 352 464C352 543.5 416.5 608 496 608zM496 508C507 508 516 517 516 528C516 539 507 548 496 548C485 548 476 539 476 528C476 517 485 508 496 508zM496 368C504.8 368 512 375.2 512 384L512 464C512 472.8 504.8 480 496 480C487.2 480 480 472.8 480 464L480 384C480 375.2 487.2 368 496 368z" fill="#e63946"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
  className: ''
});

export default function DangerZones({ zones }) {
  const { rateReport } = useReports();

  if (!zones || zones.length === 0) return null;

  return (
    <>
      {zones.map((zone) => {
        const color = getColor(zone.type);

        return (
          <React.Fragment key={zone.id}>
            {/* Danger zone radius circle */}
            <Circle
              center={[zone.latitude, zone.longitude]}
              radius={100}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 5',
              }}
            />
            {/* Center marker */}
            <Marker position={[zone.latitude, zone.longitude]} icon={dangerIcon}>
              <Popup
                key={`${zone.id}-${zone.rating}-${zone.confirm_count}`}
                minWidth={220}
              >
                <div style={{ minWidth: '200px' }}>
                  <strong style={{ textTransform: 'capitalize', color: color }}>
                    ⚠️ {zone.type.replace('_', ' ')}
                  </strong>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}>
                    {zone.description || 'No description'}
                  </p>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>
                    <div>📏 Radius: 100 m</div>
                    <div>👍 {zone.confirm_count || 0} confirmations</div>
                    <div style={{ marginTop: '6px' }}>
                      <span>Rating: </span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          onClick={(e) => {
                            e.stopPropagation();
                            rateReport(zone.id, star);
                          }}
                          style={{
                            cursor: 'pointer',
                            color: star <= (zone.rating || 0) ? '#f59e0b' : '#ccc',
                            fontSize: '18px',
                            pointerEvents: 'auto',
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      🕒{' '}
                      {new Date(zone.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </>
  );
}