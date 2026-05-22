import { useRef, useState, useEffect, useCallback } from "react";
import Map, { Marker, Popup, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;
const MAP_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

export interface CrackMarker {
  id: number | string;
  latitude: number;
  longitude: number;
  severity?: "low" | "medium" | "high" | "critical" | string;
  sensorId?: string;
  label?: string;
  timestamp?: string;
}

interface MapComponentProps {
  markers?: CrackMarker[];
  singleMarker?: CrackMarker;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  focusId?: number | string;
  height?: string;
  interactive?: boolean;
}

const SEVERITY_COLOR: Record<string, string> = {
  low: "#4ade80",
  medium: "#facc15",
  high: "#f97316",
  critical: "#ef4444",
};

function severityColor(severity?: string): string {
  if (!severity || typeof severity !== "string") return "#60a5fa";
  return SEVERITY_COLOR[severity.toLowerCase()] ?? "#60a5fa";
}

function severityLabel(severity?: string): string {
  if (!severity || typeof severity !== "string") return "Unknown";
  return severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
}

export default function MapComponent({
  markers = [],
  singleMarker,
  centerLat,
  centerLng,
  zoom,
  focusId,
  height = "100%",
  interactive = true,
}: MapComponentProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<CrackMarker | null>(null);

  const allMarkers: CrackMarker[] = singleMarker ? [singleMarker] : markers;

  // ── viewState is initialised ONCE from props — never overwritten by prop changes.
  // The user (or flyTo) drives the camera after that.
  const [viewState, setViewState] = useState(() => ({
    latitude:  centerLat ?? allMarkers[0]?.latitude  ?? 7.8731,
    longitude: centerLng ?? allMarkers[0]?.longitude ?? 80.7718,
    zoom:      zoom      ?? (singleMarker ? 16 : 8),
  }));

  // ── Focus: fly to + open popup when focusId resolves to a real marker ────────
  const focusedMarker = focusId != null
    ? allMarkers.find((m) => String(m.id) === String(focusId)) ?? null
    : null;

  useEffect(() => {
    if (!focusedMarker) return;

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [focusedMarker.longitude, focusedMarker.latitude],
        zoom: 16,
        duration: 1200,
      });
    } else {
      setViewState((prev) => ({
        ...prev,
        latitude:  focusedMarker.latitude,
        longitude: focusedMarker.longitude,
        zoom: 16,
      }));
    }

    setPopupInfo(focusedMarker);
  // Only re-run when the focused marker's identity changes (not on every render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedMarker?.id]);

  const handleMarkerClick = useCallback((marker: CrackMarker) => {
    setPopupInfo((prev) =>
      prev && String(prev.id) === String(marker.id) ? null : marker
    );
  }, []);

  return (
    <div style={{ width: "100%", height, position: "relative" }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        interactive={interactive}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        {allMarkers.map((marker) => {
          const color = severityColor(marker.severity);
          const isFocused = focusId != null && String(marker.id) === String(focusId);

          return (
            <Marker
              key={marker.id}
              latitude={marker.latitude}
              longitude={marker.longitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(marker);
              }}
            >
              <div
                style={{
                  position: "relative",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isFocused && (
                  <div
                    style={{
                      position: "absolute",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: `2px solid ${color}`,
                      animation: "pulse-ring 1.4s ease-out infinite",
                      opacity: 0.7,
                    }}
                  />
                )}
                <div
                  style={{
                    width: isFocused ? 16 : 12,
                    height: isFocused ? 16 : 12,
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: "2px solid rgba(255,255,255,0.85)",
                    boxShadow: `0 0 6px ${color}99`,
                    transition: "all 0.2s ease",
                  }}
                />
              </div>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            latitude={popupInfo.latitude}
            longitude={popupInfo.longitude}
            anchor="bottom"
            offset={14}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <div
              style={{
                backgroundColor: "#0f172a",
                color: "#e2e8f0",
                padding: "10px 14px",
                borderRadius: 6,
                minWidth: 180,
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: severityColor(popupInfo.severity),
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontWeight: 700, fontSize: 13 }}>
                  {popupInfo.label ?? `Crack #${popupInfo.id}`}
                </span>
              </div>
              {popupInfo.sensorId && (
                <div style={{ color: "#94a3b8" }}>
                  Sensor: <span style={{ color: "#e2e8f0" }}>{popupInfo.sensorId}</span>
                </div>
              )}
              <div style={{ color: "#94a3b8" }}>
                Severity:{" "}
                <span style={{ color: severityColor(popupInfo.severity), fontWeight: 600 }}>
                  {severityLabel(popupInfo.severity)}
                </span>
              </div>
              <div style={{ color: "#94a3b8", marginTop: 4, fontSize: 11 }}>
                {popupInfo.latitude.toFixed(5)}, {popupInfo.longitude.toFixed(5)}
              </div>
              {popupInfo.timestamp && (
                <div style={{ color: "#64748b", marginTop: 4, fontSize: 10 }}>
                  {new Date(popupInfo.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
