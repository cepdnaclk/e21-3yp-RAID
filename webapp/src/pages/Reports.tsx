import { useState, useRef } from "react";
import { FileText, Calendar, TrendingUp, Download, ShieldCheck, Zap } from "lucide-react";
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
  const total = combinedCracks.length;

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

        {/* Summary */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <h3 className="font-bold text-foreground">Today's Summary</h3>
            </div>
            <span className="text-xs bg-accent/10 text-accent font-medium px-2.5 py-1 rounded-full">Feb 9, 2026</span>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="stat-blue rounded-xl p-3.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Detections</p>
              <p className="text-3xl font-bold text-foreground mt-1">{total}</p>
            </div>
          </div>

          <div className="space-y-4 pt-3 border-t border-border">
            <h4 className="font-bold text-sm text-foreground mb-2">Crack Detection Details</h4>
            {combinedCracks.length > 0 ? (
              <div className="space-y-4">
                {combinedCracks.map((crack, idx) => (
                  <div key={crack.id || idx} className="bg-secondary/30 rounded-lg p-3 border border-border/50 text-xs">
                    {/* Sensor position badge — prominent at the top */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${ 
                        crack.sensorId === 'LEFT'   ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        crack.sensorId === 'RIGHT'  ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        crack.sensorId === 'CENTER' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {crack.sensorId === 'LEFT'   ? '◀ LEFT SENSOR' :
                         crack.sensorId === 'RIGHT'  ? '▶ RIGHT SENSOR' :
                         crack.sensorId === 'CENTER' ? '● CENTER SENSOR' :
                         crack.sensorId || 'SENSOR'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        crack.status === 'CRITICAL_DEFECT' || crack.status === 'CRACK'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {crack.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground font-semibold">Location (GPS)</p>
                        <p className="text-foreground">
                          Lat: {crack.latitude ? Number(crack.latitude).toFixed(4) : 'N/A'},{' '}
                          Lng: {crack.longitude ? Number(crack.longitude).toFixed(4) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-semibold">Device</p>
                        <p className="text-foreground font-mono">{crack.deviceId ?? 'N/A'}</p>
                      </div>
                    </div>
                    {crack.imageUrl && crack.imageUrl !== 'No Image (Timeout)' && (
                      <div className="mt-2">
                        <p className="text-muted-foreground font-semibold mb-1">Evidence Image</p>
                        <img 
                          src={crack.imageUrl} 
                          alt="Crack detection" 
                          className="w-full h-32 object-cover rounded-md border border-border"
                          crossOrigin="anonymous"
                        />
                        <p className="text-[10px] text-primary truncate mt-1">{crack.imageUrl}</p>
                      </div>
                    )}
                    <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
                      <span>Uptime: {crack.uptime ?? 0}s</span>
                      <span>Time: {new Date(crack.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No detections reported in this period.</p>
            )}
            
            <div className="flex justify-between text-sm pt-2 border-t border-border/30">
              <span className="text-muted-foreground">Fleet Status</span>
              <span className="font-semibold text-emerald-500">
                {isConnected ? "1/1 Active" : "0/1 Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reports;
