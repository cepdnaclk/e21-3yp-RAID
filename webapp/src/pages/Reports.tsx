import { useState, useRef } from "react";
import { FileText, Calendar, TrendingUp, Download } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import { useAlerts } from "@/context/AlertContext";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const tabs = ["Daily", "Weekly", "Monthly"] as const;

const Reports = () => {
  const [active, setActive] = useState<typeof tabs[number]>("Daily");
  const { alerts } = useAlerts();
  const reportRef = useRef<HTMLDivElement>(null);

  const confirmed = alerts.filter((a) => a.status === "confirmed").length;
  const ignored = alerts.filter((a) => a.status === "ignored").length;
  const total = alerts.length;
  const accuracy = total > 0 ? Math.round((confirmed / total) * 100) : 0;

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

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="stat-blue rounded-xl p-3.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Alerts</p>
              <p className="text-3xl font-bold text-foreground mt-1">{total}</p>
            </div>
            <div className="stat-green rounded-xl p-3.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Confirmed</p>
              <p className="text-3xl font-bold text-success mt-1">{confirmed}</p>
            </div>
            <div className="stat-red rounded-xl p-3.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ignored</p>
              <p className="text-3xl font-bold text-foreground mt-1">{ignored}</p>
            </div>
            <div className="stat-purple rounded-xl p-3.5">
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className="text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Accuracy</p>
              </div>
              <p className="text-3xl font-bold text-foreground mt-1">{accuracy}%</p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Distance Covered</span>
              <span className="font-semibold text-foreground">23.5 km</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inspection Time</span>
              <span className="font-semibold text-foreground">4h 12m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. Confidence</span>
              <span className="font-semibold text-foreground">
                {Math.round(alerts.reduce((s, a) => s + a.confidence, 0) / total)}%
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
