import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { AlertTriangle, Navigation, MapPin } from 'lucide-react';
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

// Mock Data
const LOW_BRIDGES = [
  { id: 1, lat: 40.7128, lng: -74.0060, height: "12' 8\"", name: "Holland Tunnel Approach" },
  { id: 2, lat: 40.7589, lng: -73.9851, height: "11' 6\"", name: "Times Square Underpass" },
  { id: 3, lat: 40.8075, lng: -73.9626, height: "12' 0\"", name: "Riverside Drive Bridge" },
  { id: 4, lat: 40.6782, lng: -73.9442, height: "12' 4\"", name: "Atlantic Ave Overpass" },
];

const ROUTE_POINTS: [number, number][] = [
  [40.6892, -74.0445], // Statue of Liberty (Start approx)
  [40.7127, -74.0134], // WTC
  [40.7300, -74.0000], // Village
  [40.7500, -73.9900], // Penn Station
  [40.7580, -73.9855], // Times Square (Avoid!)
  [40.7800, -73.9700], // Central Park
];

// Safe Route (Avoiding the low bridge at Times Square)
const SAFE_ROUTE_POINTS: [number, number][] = [
  [40.6892, -74.0445],
  [40.7127, -74.0134],
  [40.7350, -74.0200], // Detour West
  [40.7600, -74.0100], // Detour West
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

  return (
    <div className="h-full w-full relative group">
      <MapContainer center={[40.7128, -74.0060]} zoom={12} style={{ height: '100%', width: '100%', background: '#1a1d24' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={[40.7328, -74.0060]} />

        {/* Low Bridge Markers */}
        {LOW_BRIDGES.map(bridge => (
          <Marker key={bridge.id} position={[bridge.lat, bridge.lng]} icon={lowBridgeIcon}>
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 text-destructive font-bold mb-1">
                  <AlertTriangle size={16} />
                  LOW CLEARANCE
                </div>
                <div className="font-mono text-lg font-bold">{bridge.height}</div>
                <div className="text-xs text-muted-foreground">{bridge.name}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Routes */}
        {activeRoute === 'direct' && (
           <Polyline positions={ROUTE_POINTS} pathOptions={{ color: "#ef4444", weight: 4, dashArray: "10, 10", opacity: 0.6 }} />
        )}
        
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
                Avoiding 2 low clearance hazards
            </div>
         </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="flex gap-2 bg-card/90 backdrop-blur p-1 rounded-lg border border-border shadow-2xl">
            <button 
                onClick={() => setActiveRoute('safe')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${activeRoute === 'safe' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
                Safe Route
            </button>
            <button 
                onClick={() => setActiveRoute('direct')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${activeRoute === 'direct' ? 'bg-destructive text-destructive-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
                Show Hazards
            </button>
          </div>
      </div>
    </div>
  );
}