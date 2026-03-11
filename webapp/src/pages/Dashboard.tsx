import { useNavigate } from "react-router-dom";
import { Wifi, MapPin, Bell, Map, FileText, ChevronRight, Activity, Battery, Gauge, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { alerts, robotStatus } = useAlerts();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const pending = alerts.filter((a) => a.status === "pending").length;
  const confirmed = alerts.filter((a) => a.status === "confirmed").length;
  const ignored = alerts.filter((a) => a.status === "ignored").length;
  const total = alerts.length;

  const quickActions = [
    { icon: Bell, label: "Live Alerts", desc: "View active notifications", badge: pending, path: "/alerts", color: "bg-destructive/10 text-destructive" },
    { icon: Map, label: "Live Map", desc: "Robot & crack locations", path: "/map", color: "bg-accent/10 text-accent" },
    { icon: FileText, label: "Reports", desc: "Inspection summaries", path: "/reports", color: "bg-success/10 text-success" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="header-gradient rounded-b-3xl px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Dashboard</h1>
            <p className="text-sm text-primary-foreground/80">Welcome back,</p>
          </div>
          <Button
            onClick={handleLogout}
            size="sm"
            variant="ghost"
            className="flex items-center gap-2 text-primary-foreground hover:bg-white/20"
          >
            <LogOut size={18} />
          </Button>
        </div>

        {/* Robot Status Card inside header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2 rounded-xl">
                <Wifi className="text-primary-foreground" size={18} />
              </div>
              <div>
                <p className="text-xs text-primary-foreground/70">Robot Status</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                  <span className="font-semibold text-primary-foreground">Online</span>
                </div>
              </div>
            </div>
            <span className="bg-green-400/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <MapPin className="text-primary-foreground/70 mx-auto mb-0.5" size={14} />
              <p className="text-xs text-primary-foreground/70">Location</p>
              <p className="text-sm font-semibold text-primary-foreground">KM {robotStatus.km}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <Gauge className="text-primary-foreground/70 mx-auto mb-0.5" size={14} />
              <p className="text-xs text-primary-foreground/70">Speed</p>
              <p className="text-sm font-semibold text-primary-foreground">{robotStatus.speed} km/h</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <Battery className="text-primary-foreground/70 mx-auto mb-0.5" size={14} />
              <p className="text-xs text-primary-foreground/70">Battery</p>
              <p className="text-sm font-semibold text-primary-foreground">{robotStatus.battery}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="space-y-3">
          {quickActions.map(({ icon: Icon, label, desc, badge, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 border border-border shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon size={22} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              {badge !== undefined && badge > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {badge}
                </span>
              )}
              <ChevronRight className="text-muted-foreground" size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Today's Summary</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="stat-blue rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Total Alerts</p>
            <p className="text-3xl font-bold text-foreground">{total}</p>
          </div>
          <div className="stat-green rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Confirmed</p>
            <p className="text-3xl font-bold text-success">{confirmed}</p>
          </div>
          <div className="stat-red rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-3xl font-bold text-destructive">{pending}</p>
          </div>
          <div className="stat-purple rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Ignored</p>
            <p className="text-3xl font-bold text-muted-foreground">{ignored}</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
