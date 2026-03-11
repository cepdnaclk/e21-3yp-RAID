import { useNavigate } from "react-router-dom";
import { AlertTriangle, MapPin, Clock, ChevronRight, Bell, CheckCircle2, XCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import { useAlerts } from "@/context/AlertContext";
import { statusColor } from "@/data/mockData";

const Alerts = () => {
  const navigate = useNavigate();
  const { alerts } = useAlerts();

  const pending = alerts.filter((a) => a.status === "pending");
  const resolved = alerts.filter((a) => a.status !== "pending");

  const renderAlert = (alert: typeof alerts[0]) => (
    <button
      key={alert.id}
      onClick={() => navigate(`/crack/${alert.id}`)}
      className={`w-full bg-card rounded-2xl p-4 shadow-sm border border-border text-left transition-all hover:shadow-md active:scale-[0.98]`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-destructive/10 p-1.5 rounded-lg">
            {alert.status === "confirmed" ? (
              <CheckCircle2 className="text-success" size={16} />
            ) : alert.status === "ignored" ? (
              <XCircle className="text-muted-foreground" size={16} />
            ) : (
              <AlertTriangle className="text-destructive" size={16} />
            )}
          </div>
          <span className="font-semibold text-foreground text-sm">{alert.type}</span>
        </div>
        <ChevronRight className="text-muted-foreground" size={16} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[alert.status].badge}`}>
          {statusColor[alert.status].label}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <MapPin size={13} className="text-accent" />
          <span>{alert.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>{alert.time}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border">
        <span className="text-[11px] text-muted-foreground">{alert.lat.toFixed(4)}° N, {alert.lng.toFixed(4)}° E</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${
            alert.status === "pending" ? "bg-warning animate-pulse" :
            alert.status === "confirmed" ? "bg-success" : "bg-muted-foreground"
          }`} />
          <span className={`text-[11px] font-medium ${
            alert.status === "pending" ? "text-warning" :
            alert.status === "confirmed" ? "text-success" : "text-muted-foreground"
          }`}>
            {alert.status === "pending" ? "Action Pending" :
             alert.status === "confirmed" ? "Crack Confirmed" : "Ignored"}
          </span>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Live Alerts"
        subtitle="Active notifications"
        icon={<Bell className="text-primary-foreground" size={24} />}
      />

      <div className="px-5 mt-5 space-y-6">
        {/* Pending */}
        {pending.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <h3 className="font-bold text-foreground text-sm">Pending Review ({pending.length})</h3>
            </div>
            <div className="space-y-3">{pending.map(renderAlert)}</div>
          </div>
        )}

        {/* Resolved */}
        {resolved.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground text-sm mb-3">Resolved ({resolved.length})</h3>
            <div className="space-y-3">{resolved.map(renderAlert)}</div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Alerts;
