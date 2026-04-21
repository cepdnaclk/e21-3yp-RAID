import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type CrackLocation = {
    sensorId: string;
    timestamp: string;
    deviceId: string;
    crackDetected: boolean;
    status: string;
    lat: number;
    lng: number;
    severity: number;
};

const toSeverityBucket = (severity: number): "HIGH" | "MEDIUM" | "LOW" => {
    if (severity >= 0.7) return "HIGH";
    if (severity >= 0.4) return "MEDIUM";
    return "LOW";
};

const markerColor = (severity: number): string => {
    const bucket = toSeverityBucket(severity);
    if (bucket === "HIGH") return "#dc2626";
    if (bucket === "MEDIUM") return "#f59e0b";
    return "#2563eb";
};

const popupContent = (location: CrackLocation): HTMLElement => {
    const root = document.createElement("div");
    root.className = "text-sm";

    const addRow = (label: string, value: string) => {
        const row = document.createElement("div");
        const strong = document.createElement("strong");
        strong.textContent = `${label}: `;
        row.appendChild(strong);
        row.appendChild(document.createTextNode(value));
        root.appendChild(row);
    };

    addRow("Sensor", location.sensorId);
    addRow("Device", location.deviceId);
    addRow("Status", location.status);
    addRow("Severity", location.severity.toFixed(2));
    addRow("Time", location.timestamp);
    addRow("Lat/Lng", `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);

    return root;
};

const parsePayload = (payload: unknown): CrackLocation | null => {
    if (typeof payload !== "object" || payload === null) return null;
    const obj = payload as Record<string, unknown>;

    const rawLocation = (obj.location as Record<string, unknown> | undefined) ?? {};
    const lat = Number(rawLocation.lat ?? obj.lat ?? rawLocation.latitude ?? obj.latitude ?? 0);
    const lng = Number(rawLocation.lng ?? obj.lng ?? rawLocation.longitude ?? obj.longitude ?? 0);
    const severity = Number(obj.severity ?? 0);

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) {
        return null;
    }

    return {
        sensorId: String(obj.sensorId ?? "unknown"),
        timestamp: String(obj.timestamp ?? ""),
        deviceId: String(obj.deviceId ?? "unknown"),
        crackDetected: Boolean(obj.crackDetected),
        status: String(obj.status ?? "UNKNOWN"),
        lat,
        lng,
        severity: Number.isFinite(severity) ? severity : 0,
    };
};

const wsToSockJsUrl = (wsUrl: string): string => {
    return wsUrl.replace(/^ws:/, "http:").replace(/^wss:/, "https:").replace(/\/+$/, "").replace(/\/ws$/, "/raid-websocket");
};

const MapPage = () => {
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8080";
    const wsUrl = (import.meta.env.VITE_WS_URL as string | undefined) ?? "ws://localhost:8080/ws";

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerLayerRef = useRef<L.LayerGroup | null>(null);
    const hasCenteredRef = useRef(false);
    const [locations, setLocations] = useState<CrackLocation[]>([]);

    const upsertLocation = useCallback((incoming: CrackLocation) => {
        setLocations((prev) => {
            const key = `${incoming.sensorId}-${incoming.timestamp}`;
            const filtered = prev.filter((p) => `${p.sensorId}-${p.timestamp}` !== key);
            return [incoming, ...filtered].slice(0, 2000);
        });
    }, []);

    useEffect(() => {
        const loadHistory = async () => {
            const response = await fetch(`${apiBaseUrl}/api/crack-locations`);
            if (!response.ok) {
                throw new Error(`Failed to fetch crack locations: ${response.status}`);
            }
            const data = (await response.json()) as unknown[];
            const parsed = data.map(parsePayload).filter((x): x is CrackLocation => x !== null);
            setLocations(parsed);
        };

        loadHistory().catch((err) => {
            console.error(err);
        });
    }, [apiBaseUrl]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        const map = L.map(mapContainerRef.current, {
            center: [7.8731, 80.7718],
            zoom: 12,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        markerLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
            markerLayerRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        const layer = markerLayerRef.current;
        if (!map || !layer) {
            return;
        }

        layer.clearLayers();

        locations.forEach((loc) => {
            const color = markerColor(loc.severity);
            const marker = L.circleMarker([loc.lat, loc.lng], {
                radius: 8,
                color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 2,
            });

            marker.bindPopup(popupContent(loc));
            marker.addTo(layer);
        });

        if (!hasCenteredRef.current && locations.length > 0) {
            map.setView([locations[0].lat, locations[0].lng], 12);
            hasCenteredRef.current = true;
        }
    }, [locations]);

    useEffect(() => {
        const sockJsUrl = wsToSockJsUrl(wsUrl);

        const client = new Client({
            webSocketFactory: () => new SockJS(sockJsUrl),
            reconnectDelay: 3000,
            onConnect: () => {
                client.subscribe("/topic/cracks", (message) => {
                    try {
                        const payload = JSON.parse(message.body) as unknown;
                        const parsed = parsePayload(payload);
                        if (parsed) {
                            upsertLocation(parsed);
                        }
                    } catch (e) {
                        console.error("Failed to parse /topic/cracks payload", e);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("STOMP error", frame.headers["message"], frame.body);
            },
        });

        client.activate();
        return () => {
            client.deactivate();
        };
    }, [upsertLocation, wsUrl]);

    return <div ref={mapContainerRef} className="w-full h-[calc(100vh-80px)]" />;
};

export default MapPage;
