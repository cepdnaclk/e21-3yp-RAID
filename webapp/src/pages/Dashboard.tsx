import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wifi, MapPin, Bell, Map, FileText, 
  ChevronRight, Gauge, Battery, LogOut, Camera, AlertTriangle, Ruler
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useUltrasonicTelemetry } from "@/hooks/useUltrasonicTelemetry";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Selected device and sensor (controls what data stream we listen to)
  const [deviceId, setDeviceId] = useState("esp-001");
  const [sensorId, setSensorId] = useState("IR_Bottom");
  const [ultrasonicSensorId, setUltrasonicSensorId] = useState("ULTRA_FRONT");

  // Custom hook: gives historical + real-time crack data
  const { liveCracks, isConnected } = useTelemetry(deviceId, sensorId);
  const { liveUltrasonic, isConnected: isUltrasonicConnected } = useUltrasonicTelemetry(deviceId, ultrasonicSensorId);

  // Total number of detected events
  const total = liveCracks.length;

  // Count of unresolved/active issues
  const pending = liveCracks.filter(c => c.status !== 'RESOLVED').length;
  const latestUltrasonic = liveUltrasonic[0];

  // Logout user and redirect to home page
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      {/* ================= HEADER SECTION ================= */}
      <div className="bg-slate-900 rounded-b-[2rem] px-6 py-8 shadow-lg">

        {/* Title + connection status */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Mission Control
            </h1>

            {/* Live connection indicator (green = connected, red = disconnected) */}
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              </span>
              <p className="text-sm text-slate-400">Live Telemetry active</p>
            </div>
          </div>

          {/* Logout button */}
          <Button onClick={handleLogout} variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
            <LogOut size={20} />
          </Button>
        </div>

        {/* Device and sensor selection */}
        <div className="flex gap-3 mb-6">

          {/* Select IoT device */}
          <select 
            value={deviceId} 
            onChange={(e) => setDeviceId(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm w-full"
          >
            <option value="esp-001">Robot-01 (esp-001)</option>
            <option value="esp-002">Robot-02 (esp-002)</option>
          </select>

          {/* Select sensor type */}
          <select 
            value={sensorId} 
            onChange={(e) => setSensorId(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm w-full"
          >
            <option value="IR_Bottom">IR array</option>
            <option value="ESP32_CAM_INTEGRATED">Robot Camera</option>
          </select>

          <select
            value={ultrasonicSensorId}
            onChange={(e) => setUltrasonicSensorId(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm w-full"
          >
            <option value="ULTRA_FRONT">Ultrasonic Front</option>
            <option value="ULTRA_REAR">Ultrasonic Rear</option>
          </select>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Ruler size={18} /> Ultrasonic Distance Feed
            </h2>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isUltrasonicConnected ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {isUltrasonicConnected ? "LIVE" : "DISCONNECTED"}
            </span>
          </div>

          {latestUltrasonic ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Distance</p>
                <p className="text-2xl font-bold text-slate-900">{Number(latestUltrasonic.distanceCm).toFixed(1)} cm</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Obstacle</p>
                <p className={`text-lg font-bold ${latestUltrasonic.obstacleDetected ? "text-rose-600" : "text-emerald-600"}`}>
                  {latestUltrasonic.obstacleDetected ? "Detected" : "Clear"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Last Reading</p>
                <p className="text-sm font-semibold text-slate-900">{new Date(latestUltrasonic.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic text-sm">No ultrasonic readings yet.</p>
          )}
        </div>
      </div>

      {/* ================= LIVE DATA SECTION ================= */}
      <div className="px-6 mt-8">

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Live Anomaly Feed
          </h2>

          {/* Count of unresolved events */}
          <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle size={14} /> {pending} Pending
          </span>
        </div>

        {/* Table container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <table className="w-full text-left text-sm">

            {/* Table header */}
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Visual Evidence</th>
                <th className="p-4 font-semibold text-slate-600">Time & Location</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>

            {/* Table body */}
            <tbody className="divide-y divide-slate-100">

              {/* If no data is available */}
              {liveCracks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 italic">
                    Track conditions nominal. Awaiting telemetry.
                  </td>
                </tr>
              ) : (

                /* Loop through all crack events */
                liveCracks.map((crack, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">

                    {/* ================= IMAGE COLUMN ================= */}
                    <td className="p-4">
                      <div className="w-24 h-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative group">

                        {/* Updated to check both your path and your friend's path */}
                        {(crack.imageUrl || crack.media?.imageUrl) ? (
                          <img 
                            src={crack.imageUrl || crack.media?.imageUrl} 
                            alt="Track Defect" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Camera size={20} className="mb-1 opacity-50" />
                            <span className="text-[10px] uppercase font-semibold">No Image</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ================= TIME + GPS COLUMN ================= */}
                    <td className="p-4">

                      {/* Convert timestamp into readable time */}
                      <p className="font-medium text-slate-900 mb-1">
                        {new Date(crack.timestamp).toLocaleTimeString()}
                      </p>

                      {/* GPS location with fallback values */}
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
                        <MapPin size={12} className="text-indigo-400" />
                        <span>
                          {crack.gps?.lat || "5.9496"}° N, {crack.gps?.lng || "80.5353"}° E
                        </span>
                      </div>
                    </td>

                    {/* ================= STATUS COLUMN ================= */}
                    <td className="p-4">

                      {/* Show crack status (default = CRITICAL if missing) */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                        {crack.status || "CRITICAL"}
                      </span>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <BottomNav />
    </div>
  );
}