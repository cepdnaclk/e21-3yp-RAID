import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import MapComponent, { CrackMarker } from "../components/Map";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CrackLocation {
  sensorId?: string;
  timestamp?: string;
  deviceId?: string;
  crackDetected?: boolean;
  status?: string;
  severity?: number | string;
  imageUrl?: string;
  location?: {
    lat: number;
    lng: number;
    valid: boolean;
    satellites: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely parse a WebSocket payload that may arrive as JSON string or object */
function parsePayload(raw: unknown): CrackLocation | null {
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (data && data.location && typeof data.location.lat === "number") {
      return data as CrackLocation;
    }
  } catch {
    // malformed payload — silently ignore
  }
  return null;
}

function severityFromNumber(s?: number | string): string {
  if (typeof s === "string") return s;
  if (s === undefined || s === null) return "low";
  if (s >= 8) return "critical";
  if (s >= 5) return "high";
  if (s >= 2) return "medium";
  return "low";
}

function toMarker(c: CrackLocation, index: number): CrackMarker {
  return {
    id: `${c.deviceId ?? "device"}-${c.timestamp ?? index}`,
    latitude: c.location?.lat ?? 0,
    longitude: c.location?.lng ?? 0,
    severity: severityFromNumber(c.severity),
    sensorId: c.sensorId,
    label: `${c.status ?? "Crack"} — ${c.deviceId ?? c.sensorId ?? "unknown"}`,
    timestamp: c.timestamp,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapPage() {
  const [searchParams] = useSearchParams();

  // URL params from CrackDetails "View on Map" button
  const focusId = searchParams.get("id") ?? undefined;
  const focusLat = searchParams.get("lat")
    ? parseFloat(searchParams.get("lat")!)
    : undefined;
  const focusLng = searchParams.get("lng")
    ? parseFloat(searchParams.get("lng")!)
    : undefined;

  const [locations, setLocations] = useState<CrackLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const stompRef = useRef<Client | null>(null);

  // ── Initial fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/crack-locations")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<CrackLocation[]>;
      })
      .then((data) => {
        setLocations(data);
      })
      .catch((err) => {
        console.error("[MapPage] Failed to fetch crack locations:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── WebSocket / STOMP ──────────────────────────────────────────────────────
  useEffect(() => {
    const client = new Client({
      brokerURL: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`,
      reconnectDelay: 5000,
      onConnect: () => {
        setWsConnected(true);
        client.subscribe("/topic/cracks", (message) => {
          const parsed = parsePayload(message.body);
          if (!parsed) return;

          setLocations((prev) => {
            const idx = prev.findIndex((l) => l.id === parsed.id);
            if (idx !== -1) {
              // Update existing
              const updated = [...prev];
              updated[idx] = parsed;
              return updated;
            }
            // Add new
            return [...prev, parsed];
          });
        });
      },
      onDisconnect: () => setWsConnected(false),
      onStompError: (frame) => {
        console.error("[MapPage] STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
      stompRef.current = null;
    };
  }, []);

  // ── Derived map props ──────────────────────────────────────────────────────

  const initialLat = focusLat ?? 7.8731;
  const initialLng = focusLng ?? 80.7718;
  const initialZoom = focusLat ? 16 : 8;

  // Merge API markers with a stub built from URL params so the popup opens
  // immediately — even before the API fetch completes — using the lat/lng
  // already embedded in the URL by CrackDetails.
  const urlStub: CrackMarker | null =
    focusId && focusLat && focusLng
      ? {
          id: focusId,
          latitude: focusLat,
          longitude: focusLng,
          label: `Crack #${focusId}`,
        }
      : null;

  const apiMarkers = locations
  .filter(c => (c.location?.lat ?? 0) !== 0 && (c.location?.lng ?? 0) !== 0)
  .map((c, i) => toMarker(c, i));

  // De-duplicate: once the real marker arrives from the API it replaces the stub
  const markers: CrackMarker[] = urlStub
    ? [
        urlStub,
        ...apiMarkers.filter((m) => String(m.id) !== String(focusId)),
      ]
    : apiMarkers;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#0f172a",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Map fills the entire viewport ── */}
      <MapComponent
        markers={markers}
        centerLat={initialLat}
        centerLng={initialLng}
        zoom={initialZoom}
        focusId={focusId}
        height="100%"
      />

      {/* ── Status bar (top-left overlay) ── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Title chip */}
        <div
          style={{
            background: "rgba(15,23,42,0.88)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(99,102,241,0.35)",
            borderRadius: 8,
            padding: "8px 14px",
            color: "#e2e8f0",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          CRACK MONITOR — LIVE MAP
        </div>

        {/* Loading / count chip */}
        <div
          style={{
            background: "rgba(15,23,42,0.80)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: "6px 12px",
            color: "#94a3b8",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {isLoading ? (
            <>
              <LoadingDot />
              <span>Loading crack data…</span>
            </>
          ) : (
            <>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: wsConnected ? "#4ade80" : "#f97316",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span>
                {locations.length} location{locations.length !== 1 ? "s" : ""} •{" "}
                {wsConnected ? "Live" : "Offline"}
              </span>
            </>
          )}
        </div>

        {/* Focus indicator */}
        {focusId && (
          <div
            style={{
              background: "rgba(99,102,241,0.18)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(99,102,241,0.5)",
              borderRadius: 8,
              padding: "6px 12px",
              color: "#a5b4fc",
              fontSize: 11,
            }}
          >
            Focused → Crack #{focusId}
          </div>
        )}
      </div>

      {/* ── Legend (bottom-left overlay) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 16,
          zIndex: 10,
          background: "rgba(15,23,42,0.82)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {[
          { label: "Low", color: "#4ade80" },
          { label: "Medium", color: "#facc15" },
          { label: "High", color: "#f97316" },
          { label: "Critical", color: "#ef4444" },
        ].map(({ label, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              color: "#cbd5e1",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: color,
                border: "1.5px solid rgba(255,255,255,0.5)",
                flexShrink: 0,
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tiny animated loading indicator ──────────────────────────────────────────

function LoadingDot() {
  return (
    <>
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "#60a5fa",
          animation: "map-blink 1s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
      <style>{`
        @keyframes map-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </>
  );
}
