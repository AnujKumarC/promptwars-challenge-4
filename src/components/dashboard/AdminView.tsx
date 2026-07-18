"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { PremiumLineChart, PremiumBarChart, PremiumDonutChart } from "@/components/analytics/PremiumCharts";
import { 
  Users, Activity, Flame, Cpu, 
  Leaf, Thermometer, Droplet, Navigation, AlertTriangle 
} from "lucide-react";

export const AdminView: React.FC = () => {
  const { metrics, triggerEmergency, activeEmergency, resolveEmergency } = useAppState();
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const stats = [
    { label: "Total Capacity", value: metrics.totalFans.toLocaleString(), icon: Users, color: "text-blue-400" },
    { label: "Live Attendance", value: metrics.liveAttendance.toLocaleString(), icon: Activity, color: "text-emerald-400" },
    { label: "Crowd Density", value: `${metrics.crowdDensity}%`, icon: Cpu, color: metrics.crowdDensity > 75 ? "text-red-400" : "text-indigo-400" },
    { label: "Parking Occupancy", value: `${metrics.parkingStatus}%`, icon: Navigation, color: "text-yellow-400" },
  ];

  const sustainabilityData = [
    { label: "Energy Usage", value: `${metrics.energyConsumption} kWh`, icon: Thermometer, trend: "Optimal (Eco-Save active)" },
    { label: "Water Rate", value: `${metrics.waterUsage} Gal`, icon: Droplet, trend: "Auto-recycled (72%)" },
    { label: "Carbon Offset", value: `${metrics.carbonFootprint} kg`, icon: Leaf, trend: "Net Zero Path" },
  ];

  const handleSimulateIncident = () => {
    triggerEmergency("fire", "North Food Court Stall B");
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* AI Recommendation Alert Banner */}
      <Card variant="glow" hoverEffect={false} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">AI Intelligent Dispatch System</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeEmergency !== "none"
                  ? `CRITICAL: Active Code Red emergency [${activeEmergency.toUpperCase()}] detected. AI is rerouting flows.`
                  : "Stadium is operating at 94% efficiency. Suggesting 3 optimization dispatches to volunteers."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeEmergency !== "none" ? (
              <Button variant="danger" size="sm" onClick={resolveEmergency}>
                Resolve Emergency Status
              </Button>
            ) : (
              <>
                <Button variant="danger" size="sm" onClick={handleSimulateIncident} className="flex gap-1.5 items-center">
                  <Flame className="w-3.5 h-3.5 animate-bounce" /> Simulate Code Red
                </Button>
                <Button 
                  variant="gradient" 
                  size="sm" 
                  isLoading={aiLoading} 
                  onClick={() => {
                    setAiLoading(true);
                    setTimeout(() => setAiLoading(false), 800);
                  }}
                >
                  Regenerate Recommendations
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} variant="glass" className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">{s.label}</span>
                <span className="text-2xl font-black tracking-tight text-white mt-1.5 block">{s.value}</span>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Interactive Stadium Map */}
      <InteractiveMap />

      {/* Analytics Dashboard Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PremiumLineChart title="Crowd Entrance Velocity" subtitle="Flow dynamics across all terminals in real-time" />
        <PremiumBarChart title="Stadium Utilities Efficiency" subtitle="Real-time electricity, water and waste tracking" />
        <PremiumDonutChart title="Gate Flow Distribution" subtitle="Fan queue division at gates A, B, C and D" />
      </div>

      {/* Sustainability and Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Utilities Sustainability */}
        <Card variant="glass" hoverEffect={false} className="flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Smart Utilities & Sustainability Report
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Real-time green metrics computed for carbon impact reduction.</p>
          </div>
          <div className="flex flex-col gap-3">
            {sustainabilityData.map((sust, idx) => {
              const Icon = sust.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-300 block">{sust.label}</span>
                      <span className="text-[10px] text-slate-500">{sust.trend}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-200">{sust.value}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Live Recommendation Dispatch Panel */}
        <Card variant="glass" hoverEffect={false}>
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-indigo-400" />
              Operations AI Suggestions
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">AI engine predictions based on live stadium crowd tracking.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/20 text-xs text-orange-200">
              <span className="font-bold block">Gate C Crowding Prediction</span>
              Density at Gate C expected to exceed 85% in 12 mins. Dispatch 3 volunteers to guide flows to Gate D.
            </div>
            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200">
              <span className="font-bold block">Energy Conservation Notice</span>
              Concourse lighting is at 100%. Natural light levels allow a 20% dimmer schedule. Adjusting automatic grids.
            </div>
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
              <span className="font-bold block">Metro Departure Spike</span>
              Next Match ends in 45 mins. Requesting 2 additional metro trains from transit dispatch to prevent terminal bottlenecks.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminView;
