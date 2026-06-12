import { useState, useRef } from "react";
import { FileText, Calendar, TrendingUp, Download, ShieldCheck, Zap, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import { useTelemetry } from "@/hooks/useTelemetry";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const tabs = ["Daily", "Weekly", "Monthly"] as const;

const Reports = () => {
  const [active, setActive] = useState<typeof tabs[number]>("Daily");
  const reportRef = useRef<HTMLDivElement>(null);

  // Real ESP32 "esp-001" has 3 DynamoDB partition keys: LEFT, RIGHT, CENTER
  const sensorLeft   = useTelemetry("esp-001", "LEFT");
  const sensorRight  = useTelemetry("esp-001", "RIGHT");
  const sensorCenter = useTelemetry("esp-001", "CENTER");

  const combinedCracks = [
    ...sensorLeft.liveCracks,
    ...sensorRight.liveCracks,
    ...sensorCenter.liveCracks,
  ].sort((a, b) => new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime());

  const isConnected = sensorLeft.isConnected || sensorRight.isConnected || sensorCenter.isConnected;

  const now = new Date();
  
  const filteredCracks = combinedCracks.filter(crack => {
    if (!crack.timestamp) return false;
    const crackDate = new Date(crack.timestamp);
    const diffTime = Math.abs(now.getTime() - crackDate.getTime());
    
    if (active === "Daily") {
      // Last 24 hours
      return diffTime <= 24 * 60 * 60 * 1000;
    } else if (active === "Weekly") {
      // Last 7 days
      return diffTime <= 7 * 24 * 60 * 60 * 1000;
    } else if (active === "Monthly") {
      // Last 30 days
      return diffTime <= 30 * 24 * 60 * 60 * 1000;
    }
    return true;
  });

  const total = filteredCracks.length;

  const getSummaryTitle = () => {
    if (active === "Daily") return "Today's Summary";
    if (active === "Weekly") return "This Week's Summary";
    return "This Month's Summary";
  };

  const getDateDisplay = () => {
    const today = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    if (active === "Daily") return today;
    
    const pastDate = new Date();
    if (active === "Weekly") pastDate.setDate(now.getDate() - 7);
    if (active === "Monthly") pastDate.setDate(now.getDate() - 30);
    
    return `${pastDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${today}`;
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf_height = pdf.internal.pageSize.getHeight();
      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf_height;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf_height;
      }

      pdf.save(`rail-sight-guard-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Reports" subtitle="Inspection summaries & analytics" icon={<FileText className="text-primary-foreground" size={24} />} />

      <div className="px-5 mt-5 space-y-5" ref={reportRef}>
        {/* Tabs and Download Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  active === tab
                    ? "header-gradient text-primary-foreground shadow-md"
                    : "bg-card border border-border text-foreground hover:bg-secondary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Button
            onClick={downloadPDF}
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Download size={16} />
            PDF
          </Button>
        </div>

        {/* Summary Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 rounded-xl backdrop-blur-md border border-blue-500/30">
                <Calendar size={22} className="text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">{getSummaryTitle()}</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-blue-100 tracking-wide">{getDateDisplay()}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm transition-colors hover:bg-white/10">
              <p className="text-[11px] text-slate-300 uppercase tracking-widest font-bold">Total Detections</p>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-4xl font-black text-white leading-none">{total}</p>
                <TrendingUp size={18} className="text-blue-400 mb-1" />
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm transition-colors hover:bg-white/10">
              <p className="text-[11px] text-slate-300 uppercase tracking-widest font-bold">Critical Alerts</p>
              <p className="text-4xl font-black text-rose-400 mt-2 leading-none">
                {filteredCracks.filter(c => c.status === 'CRITICAL_DEFECT' || c.status === 'CRACK' || c.severity === 'HIGH').length}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm md:col-span-2 flex flex-col justify-center transition-colors hover:bg-white/10">
              <p className="text-[11px] text-slate-300 uppercase tracking-widest font-bold mb-3">Fleet Connection Status</p>
              <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-lg border border-white/5">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                <span className="text-sm font-medium text-slate-200">{isConnected ? "System Online & Actively Monitoring Track" : "All Systems Currently Offline"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed List */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 mb-4 px-1">
            <FileText size={18} className="text-muted-foreground" />
            <h4 className="font-bold text-lg text-foreground">Detection Log</h4>
          </div>
          
          {filteredCracks.length > 0 ? (
            <div className="space-y-5">
              {filteredCracks.map((crack, idx) => (
                <div key={crack.id || idx} className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Left: Data */}
                    <div className="flex-1 space-y-5">
                      <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${ 
                            crack.sensorId === 'LEFT'   ? 'bg-blue-100 text-blue-700' :
                            crack.sensorId === 'RIGHT'  ? 'bg-purple-100 text-purple-700' :
                            crack.sensorId === 'CENTER' ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {crack.sensorId === 'LEFT'   ? '◀ LEFT SENSOR' :
                             crack.sensorId === 'RIGHT'  ? '▶ RIGHT SENSOR' :
                             crack.sensorId === 'CENTER' ? '● CENTER SENSOR' :
                             crack.sensorId || 'SENSOR'}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md">
                            <Calendar size={12} />
                            {new Date(crack.timestamp ?? 0).toLocaleString()}
                          </span>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase ${
                          crack.status === 'CRITICAL_DEFECT' || crack.status === 'CRACK' || crack.severity === 'HIGH'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {crack.status || 'DETECTED'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/30 rounded-xl p-3.5 border border-border/50">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                            <MapPin size={12} className="text-blue-500" /> GPS Location
                          </p>
                          <p className="text-sm font-semibold text-foreground">Lat: {crack.latitude ? Number(crack.latitude).toFixed(5) : 'N/A'}</p>
                          <p className="text-sm font-semibold text-foreground">Lng: {crack.longitude ? Number(crack.longitude).toFixed(5) : 'N/A'}</p>
                        </div>
                        <div className="bg-secondary/30 rounded-xl p-3.5 border border-border/50">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Zap size={12} className="text-amber-500" /> System Info
                          </p>
                          <p className="text-sm font-semibold text-foreground">Device: <span className="font-mono text-xs bg-black/5 px-1.5 py-0.5 rounded">{crack.deviceId ?? 'N/A'}</span></p>
                          <p className="text-sm font-semibold text-foreground">Uptime: {crack.uptime ?? 0}s</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Image */}
                    {crack.imageUrl && crack.imageUrl !== 'No Image (Timeout)' && (
                      <div className="w-full md:w-72 flex-shrink-0 flex flex-col">
                        <div className="relative w-full h-40 bg-black rounded-xl overflow-hidden border-2 border-slate-800 shadow-inner group">
                          <img 
                            src={crack.imageUrl} 
                            alt="Detection Evidence" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            crossOrigin="anonymous"
                          />
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[9px] rounded-md font-mono border border-white/20 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                            CAM FEED
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate mt-2 px-1 font-mono text-center">
                          {crack.imageUrl.split('/').pop() || 'evidence_capture.jpg'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-12 border border-border flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">All Clear</h3>
              <p className="text-sm text-muted-foreground max-w-md">No detections were reported during this time period. The track section is clear.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reports;
