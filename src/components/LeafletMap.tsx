import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocateFixed, Maximize2 } from 'lucide-react';

interface LeafletMapProps {
  coordinates: { lat: number; lng: number }[];
  currentLocation: { lat: number; lng: number } | null;
  isTracking: boolean;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  coordinates,
  currentLocation,
  isTracking,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center (urban university / city center)
    const initialLat = currentLocation?.lat || 28.6139;
    const initialLng = currentLocation?.lng || 77.2090;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: false,
    });

    // Add zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Clean up
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Polyline and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const latLngs = coordinates.map((c) => [c.lat, c.lng] as [number, number]);

    // Draw route polyline
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latLngs);
    } else if (latLngs.length > 0) {
      polylineRef.current = L.polyline(latLngs, {
        color: '#16a34a',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // Start Marker (Green Flag)
    if (coordinates.length > 0) {
      const startCoord = coordinates[0];
      if (!startMarkerRef.current) {
        const startIcon = L.divIcon({
          className: 'custom-start-marker',
          html: `<div style="background-color: #0f172a; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#a3e635;"></span> START
          </div>`,
          iconSize: [60, 24],
          iconAnchor: [30, 24],
        });
        startMarkerRef.current = L.marker([startCoord.lat, startCoord.lng], { icon: startIcon }).addTo(map);
      } else {
        startMarkerRef.current.setLatLng([startCoord.lat, startCoord.lng]);
      }
    } else if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }

    // Current User Marker (Pulsing Green Dot)
    const activePos = currentLocation || (coordinates.length > 0 ? coordinates[coordinates.length - 1] : null);

    if (activePos) {
      if (!userMarkerRef.current) {
        const pulseIcon = L.divIcon({
          className: 'custom-pulsing-marker',
          html: `<div class="user-marker-pulse"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        userMarkerRef.current = L.marker([activePos.lat, activePos.lng], { icon: pulseIcon }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng([activePos.lat, activePos.lng]);
      }

      if (isTracking && map) {
        map.panTo([activePos.lat, activePos.lng], { animate: true, duration: 0.8 });
      }
    }
  }, [coordinates, currentLocation, isTracking]);

  const handleCenterOnUser = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const target = currentLocation || (coordinates.length > 0 ? coordinates[coordinates.length - 1] : null);
    if (target) {
      map.setView([target.lat, target.lng], 17, { animate: true });
    }
  };

  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || coordinates.length === 0) return;
    const bounds = L.latLngBounds(coordinates.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 });
  };

  return (
    <div className={`relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`}>
      {/* Actual Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />

      {/* Floating Map Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleCenterOnUser}
          title="Center on my location"
          className="p-2.5 rounded-xl bg-white/95 backdrop-blur-xs text-slate-700 hover:text-emerald-700 hover:bg-white shadow-md border border-slate-200 transition-all cursor-pointer"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
        {coordinates.length > 1 && (
          <button
            type="button"
            onClick={handleFitBounds}
            title="Fit entire route"
            className="p-2.5 rounded-xl bg-white/95 backdrop-blur-xs text-slate-700 hover:text-emerald-700 hover:bg-white shadow-md border border-slate-200 transition-all cursor-pointer"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Live Map Watermark / Tile Attribution */}
      <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-[11px] font-medium text-slate-700 border border-slate-200/80 shadow-xs pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
        <span>OpenStreetMap Live Satellite & Grid</span>
      </div>
    </div>
  );
};
