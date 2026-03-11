import { createContext, useContext, useState, type ReactNode } from "react";

export type Severity = "HIGH" | "MEDIUM" | "LOW";
export type AlertStatus = "pending" | "confirmed" | "ignored";

export interface CrackAlert {
  id: number;
  type: string;
  severity: Severity;
  location: string;
  km: number;
  time: string;
  timestamp: string;
  lat: number;
  lng: number;
  status: AlertStatus;
  confidence: number;
  irSensor: "Active" | "Inactive";
  description: string;
}

export interface RobotStatus {
  online: boolean;
  lat: number;
  lng: number;
  km: number;
  speed: number;
  battery: number;
}

interface AlertContextType {
  alerts: CrackAlert[];
  robotStatus: RobotStatus;
  updateStatus: (id: number, status: AlertStatus) => void;
  loading: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
const mockAlerts: CrackAlert[] = [
  {
    id: 1,
    type: "Longitudinal Crack",
    severity: "HIGH",
    location: "Railway Track Section A",
    km: 143.5,
    time: "10:23 AM",
    timestamp: "2024-01-15T10:23:00",
    lat: 28.6155,
    lng: 77.2100,
    status: "pending",
    confidence: 94,
    irSensor: "Active",
    description: "Wide longitudinal crack detected across main rail track.",
  },
  {
    id: 2,
    type: "Transverse Crack",
    severity: "MEDIUM",
    location: "Railway Track Section B",
    km: 156.2,
    time: "11:45 AM",
    timestamp: "2024-01-15T11:45:00",
    lat: 28.6200,
    lng: 77.2200,
    status: "confirmed",
    confidence: 82,
    irSensor: "Active",
    description: "Transverse crack detected near joint section.",
  },
  {
    id: 3,
    type: "Surface Defect",
    severity: "LOW",
    location: "Railway Track Section C",
    km: 162.8,
    time: "02:10 PM",
    timestamp: "2024-01-15T14:10:00",
    lat: 28.6300,
    lng: 77.2300,
    status: "ignored",
    confidence: 67,
    irSensor: "Inactive",
    description: "Minor surface defect, monitoring required.",
  },
  {
    id: 4,
    type: "Longitudinal Crack",
    severity: "HIGH",
    location: "Railway Track Section D",
    km: 178.4,
    time: "03:55 PM",
    timestamp: "2024-01-15T15:55:00",
    lat: 28.6400,
    lng: 77.2400,
    status: "pending",
    confidence: 91,
    irSensor: "Active",
    description: "Critical crack detected near bridge approach.",
  },
];

const defaultRobot: RobotStatus = {
  online: true,
  lat: 28.6155,
  lng: 77.2100,
  km: 143,
  speed: 5.2,
  battery: 78,
};
// ──────────────────────────────────────────────────────────

const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<CrackAlert[]>(mockAlerts);
  const [robotStatus] = useState<RobotStatus>(defaultRobot);
  const [loading] = useState(false);

  // Mock update - just updates local state (no API call)
  const updateStatus = (id: number, status: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    // TODO: Replace with Spring Boot API call:
    // await fetch(`http://localhost:8080/api/alerts/${id}/status`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ status }),
    // });
  };

  return (
    <AlertContext.Provider value={{ alerts, robotStatus, updateStatus, loading }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertProvider");
  return ctx;
};