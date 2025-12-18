import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { AlertTriangle, Navigation } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBridges } from '@/lib/api';
import L from 'leaflet';

// Fix for default markers in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Low Bridge Icon
const lowBridgeIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Safe Route (Avoiding the low bridge at Times Square)
const SAFE_ROUTE_POINTS: [number, number][] = [
  [40.6892, -74.0445],
  [40.7127, -74.0134],
  [40.7350, -74.0200],
  [40.7600, -74.0100],
  [40.7800, -73.9700],
];

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

export function MapView() {
  const [activeRoute, setActiveRoute] = useState<'direct' | 'safe'>('safe');
  
  const { data: bridges = [], isLoading } = useQuery({
    queryKey: ['bridges'],
    queryFn: getBridges,
  });

  const hazardCount = bridges.filter(b => b.clearanceInches < 162).length;

  return (
    <div className="h-full w-full relative group">
      <MapContainer center={[40.7128, -74.0060]} zoom={12} style={{ height: '100%', width: '100%', background: '#1a1d24' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={[40.7328, -74.0060]} />

        {/* Low Bridge Markers - Real Data from Database */}
        {!isLoading && bridges.map(bridge => (
          <Marker key={bridge.id} position={[bridge.latitude, bridge.longitude]} icon={lowBridgeIcon}>
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 text-destructive font-bold mb-1">
                  <AlertTriangle size={16} />
                  LOW CLEARANCE
                </div>
                <div className="font-mono text-lg font-bold">{bridge.clearanceHeight}</div>
                <div className="text-xs font-bold">{bridge.name}</div>
                <div className="text-xs text-muted-foreground">{bridge.city}, {bridge.state}</div>
                <div className="text-xs text-muted-foreground">{bridge.roadName}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Demo Route */}
        <Polyline positions={SAFE_ROUTE_POINTS} pathOptions={{ color: "#f97316", weight: 6 }} />

      </MapContainer>

      {/* Map Overlay Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
         <div className="bg-card/90 backdrop-blur p-3 rounded-md border border-border shadow-lg">
            <h3 className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Route Status</h3>
            <div className="flex items-center gap-2 text-primary font-bold">
                <Navigation className="h-4 w-4" />
                <span>SAFE ROUTE ACTIVE</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
                Avoiding {hazardCount} low clearance hazards
            </div>
         </div>
      </div>
    </div>
  );
}