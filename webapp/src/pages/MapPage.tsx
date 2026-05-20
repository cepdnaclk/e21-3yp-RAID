import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { X, MapPin, Clock, Zap, AlertCircle } from "lucide-react";

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

const getSeverityColor = (severity: number): string => {
    const bucket = toSeverityBucket(severity);
    if (bucket === "HIGH") return "#dc2626";
    if (bucket === "MEDIUM") return "#f59e0b";
    return "#2563eb";
};

const getSeverityBadge = (severity: number): { bg: string; text: string; label: string } => {
    const bucket = toSeverityBucket(severity);
    if (bucket === "HIGH") return { bg: "bg-red-100", text: "text-red-800", label: "HIGH" };
    if (bucket === "MEDIUM") return { bg: "bg-orange-100", text: "text-orange-800", label: "MEDIUM" };
    return { bg: "bg-blue-100", text: "text-blue-800", label: "LOW" };
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
    const mapboxToken = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? "";

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const hasCenteredRef = useRef(false);
    const [locations, setLocations] = useState<CrackLocation[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<CrackLocation | null>(null);
    const markerRefs = useRef<Map<string, mapboxgl.Marker>>(new Map());

    // Set Mapbox token
    mapboxgl.accessToken = mapboxToken;

    const upsertLocation = useCallback((incoming: CrackLocation) => {
        setLocations((prev) => {
            const key = `${incoming.sensorId}-${incoming.timestamp}`;
            const filtered = prev.filter((p) => `${p.sensorId}-${p.timestamp}` !== key);
            return [incoming, ...filtered].slice(0, 2000);
        });
    }, []);

    // Fetch initial history
    useEffect(() => {
        const loadHistory = async () => {
            const crackResponse = await fetch(`${apiBaseUrl}/api/crack-locations`);
            if (!crackResponse.ok) {
                throw new Error(`Failed to fetch crack locations: ${crackResponse.status}`);
            }

            const crackData = (await crackResponse.json()) as unknown[];
            const crackParsed = crackData.map(parsePayload).filter((x): x is CrackLocation => x !== null);

            setLocations([...crackParsed]);
        };

        loadHistory().catch((err) => {
            console.error(err);
        });
    }, [apiBaseUrl]);

    // Initialize Mapbox map
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [80.7718, 7.8731],
            zoom: 12,
        });

        mapRef.current = map;

        map.on("load", () => {
            console.log("Mapbox map loaded");
        });

        map.on("error", (e) => {
            console.error("Mapbox error:", e);
        });

        return () => {
            markerRefs.current.clear();
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Update markers when locations change
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Clear existing markers
        markerRefs.current.forEach((marker) => marker.remove());
        markerRefs.current.clear();

        // Add new markers for each location
        locations.forEach((loc) => {
            const color = getSeverityColor(loc.severity);
            const key = `${loc.sensorId}-${loc.timestamp}`;

            const el = document.createElement("div");
            el.className = "w-4 h-4 rounded-full cursor-pointer hover:scale-125 transition-transform";
            el.style.backgroundColor = color;
            el.style.boxShadow = `0 0 8px ${color}`;
            el.onclick = () => setSelectedLocation(loc);

            const marker = new mapboxgl.Marker({ element: el }).setLngLat([loc.lng, loc.lat]).addTo(map);

            markerRefs.current.set(key, marker);
        });

        // Center map on first location if not already centered
        if (!hasCenteredRef.current && locations.length > 0) {
            map.flyTo({
                center: [locations[0].lng, locations[0].lat],
                zoom: 14,
                duration: 1500,
            });
            hasCenteredRef.current = true;
        }
    }, [locations]);

    // Real-time WebSocket updates
    useEffect(() => {
        const sockJsUrl = wsToSockJsUrl(wsUrl);

        const client = new Client({
            webSocketFactory: () => new SockJS(sockJsUrl),
            reconnectDelay: 3000,
            onConnect: () => {
                client.subscribe("/topic/crack-events", (message) => {
                    try {
                        const payload = JSON.parse(message.body) as unknown;
                        const parsed = parsePayload(payload);
                        if (parsed) {
                            upsertLocation(parsed);
                        }
                    } catch (e) {
                        console.error("Failed to parse /topic/crack-events payload", e);
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

    return (
        <div className="flex w-full h-[calc(100vh-80px)] bg-gray-50">
            {/* Map Container */}
            <div ref={mapContainerRef} className="flex-1" />

            {/* Side Details Panel */}
            {selectedLocation && (
                <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-lg z-50 flex flex-col animate-in slide-in-from-right-80 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Crack Details</h2>
                            <p className="text-sm text-blue-100 mt-1">ID: {selectedLocation.deviceId}</p>
                        </div>
                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="p-1 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Severity Badge */}
                        {(() => {
                            const badge = getSeverityBadge(selectedLocation.severity);
                            return (
                                <div className={`${badge.bg} ${badge.text} px-4 py-3 rounded-lg font-semibold flex items-center gap-2`}>
                                    <AlertCircle size={18} />
                                    Severity: {badge.label} ({selectedLocation.severity.toFixed(3)})
                                </div>
                            );
                        })()}

                        {/* Device Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Device Information</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Device ID:</span>
                                    <span className="font-mono font-semibold text-gray-900">{selectedLocation.deviceId}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sensor ID:</span>
                                    <span className="font-mono font-semibold text-gray-900">{selectedLocation.sensorId}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-semibold text-gray-900">{selectedLocation.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Location Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                <MapPin size={16} />
                                Location
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Latitude:</span>
                                    <span className="font-mono font-semibold text-gray-900">{selectedLocation.lat.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Longitude:</span>
                                    <span className="font-mono font-semibold text-gray-900">{selectedLocation.lng.toFixed(6)}</span>
                                </div>
                                <button
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`,
                                            "_blank"
                                        )
                                    }
                                    className="w-full mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Open in Google Maps
                                </button>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                <Clock size={16} />
                                Timestamp
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-900">{selectedLocation.timestamp}</p>
                            </div>
                        </div>

                        {/* Crack Detected Status */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                <Zap size={16} />
                                Detection Status
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p
                                    className={`text-sm font-semibold ${selectedLocation.crackDetected ? "text-red-600" : "text-green-600"
                                        }`}
                                >
                                    {selectedLocation.crackDetected ? "Crack Detected" : "No Crack"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapPage;
