"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  HeartPulse, Ambulance, MapPin, 
  AlertCircle, Send, CheckCircle2 
} from "lucide-react";

export const MedicalView: React.FC = () => {
  const { medicalQueue, updateMedicalStatus, requestMedicalHelp } = useAppState();

  // New request state
  const [symptom, setSymptom] = useState<string>("Heat Stroke / Fatigue");
  const [location, setLocation] = useState<string>("Stand Block 110 Row E");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");

  // Ambulance tracking coordinates simulation
  const [ambulanceProgress] = useState<number>(64); // 0 to 100

  const handleTriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestMedicalHelp(symptom, location, priority);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "critical":
        return "bg-red-950 text-red-300 border border-red-500/20";
      case "high":
        return "bg-orange-950 text-orange-300 border border-orange-500/20";
      case "medium":
        return "bg-yellow-950 text-yellow-300 border border-yellow-500/20";
      default:
        return "bg-slate-900 text-slate-400";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Medical command headers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Medical Queue */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card variant="glass" hoverEffect={false}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
                  Stadium Triage Case Queue
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Real-time patient classification and medic routing.</p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/20 text-rose-300">
                Live case count: {medicalQueue.filter(m => m.status !== "discharged").length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {medicalQueue.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-950/20 border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <AlertCircle className={`w-4 h-4 ${c.priority === "critical" ? "text-red-500 animate-ping" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{c.patientName}</span>
                        <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded font-black ${getPriorityColor(c.priority)}`}>
                          {c.priority}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300 mt-1 block">Symptom: {c.symptom}</span>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location}</span>
                        <span>Medic: {c.assignedMedic}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {c.status === "waiting" && (
                      <Button variant="primary" size="sm" onClick={() => updateMedicalStatus(c.id, "ambulance_enroute")} className="text-[10px] py-1 px-2.5">
                        Dispatch Medic
                      </Button>
                    )}
                    {c.status === "ambulance_enroute" && (
                      <Button variant="gradient" size="sm" onClick={() => updateMedicalStatus(c.id, "being_treated")} className="text-[10px] py-1 px-2.5">
                        Start Treatment
                      </Button>
                    )}
                    {c.status === "being_treated" && (
                      <Button variant="success" size="sm" onClick={() => updateMedicalStatus(c.id, "discharged")} className="text-[10px] py-1 px-2.5">
                        Discharge Patient
                      </Button>
                    )}
                    {c.status === "discharged" && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Discharged
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Telemetry and Dispatch Case Form */}
        <div className="flex flex-col gap-4">
          {/* Dispatch request form */}
          <Card variant="glass" hoverEffect={false}>
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-indigo-400" />
                Dispatch Field Medic
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Report spectator medical distress to the triage grid.</p>
            </div>

            <form onSubmit={handleTriageSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Symptom Details</label>
                <select
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none w-full"
                >
                  <option value="Severe Dehydration / Heat exhaustion">Dehydration / Fatigue</option>
                  <option value="Chest Pain / Angina">Chest Pain / Shortness of breath</option>
                  <option value="Fracture / Ankle Sprain">Fracture / Ankle Sprain</option>
                  <option value="Asthma attack">Asthma attack</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Seat / Stand Block</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Block 102, Row G"
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Priority Classification</label>
                <div className="flex gap-2">
                  {(["medium", "high", "critical"] as const).map((pri) => (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setPriority(pri)}
                      className={`flex-1 py-1.5 rounded text-[10px] font-extrabold uppercase border transition-all ${
                        priority === pri
                          ? pri === "critical"
                            ? "bg-red-600 border-red-500 text-white"
                            : "bg-orange-600 border-orange-500 text-white"
                          : "glass border-slate-800 text-slate-400"
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2 text-xs flex gap-1.5 justify-center items-center">
                <Send className="w-3.5 h-3.5" /> File Distress Report
              </Button>
            </form>
          </Card>

          {/* Ambulance telemetry tracking */}
          <Card variant="glass" hoverEffect={false}>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Ambulance className="w-4 h-4 text-cyan-400" />
              Live Trauma Ambulance telemetry
            </h4>
            
            <div className="p-3 bg-slate-950/30 rounded-xl border border-white/5 mt-3">
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span>AMBULANCE ID: MED-88</span>
                <span>En-route to Hospital B</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 rounded bg-slate-900 overflow-hidden mt-1">
                <div className="h-full bg-cyan-500 rounded transition-all duration-1000" style={{ width: `${ambulanceProgress}%` }} />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
                <span>ETA: 4.8 Mins</span>
                <span>Speed: 64 km/h</span>
              </div>
            </div>
            
            <div className="mt-3 bg-indigo-950/20 p-2.5 rounded-lg text-[9px] text-indigo-300 leading-relaxed border border-indigo-500/20">
              <span className="font-bold block">Hospital Coordination Engine</span>
              St. Jude Trauma ER notified. Reserving Trauma Bay 3.
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default MedicalView;
