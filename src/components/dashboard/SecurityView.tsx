"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  ShieldAlert, Shield, ShieldCheck, Eye, EyeOff, 
  MapPin, AlertTriangle, Send, UserCheck, Flame 
} from "lucide-react";

export const SecurityView: React.FC = () => {
  const { incidents, reportIncident, updateIncidentStatus } = useAppState();
  
  // Incident Form state
  const [incType, setIncType] = useState<string>("Suspicious Object");
  const [incLoc, setIncLoc] = useState<string>("Gate D Concourse");
  const [incSev, setIncSev] = useState<"low" | "medium" | "critical">("medium");

  const [camGrid, setCamGrid] = useState<boolean>(true);

  // Simulated Face Detection logs
  const faceLogs = [
    { time: "15:32:04", id: "MATCH-8422", score: "99.2%", match: "Clear Check", status: "ok" },
    { time: "15:31:50", id: "VIP-9912", score: "97.4%", match: "Staff Escort Requested", status: "warning" },
    { time: "15:30:11", id: "ALERT-0023", score: "98.9%", match: "Restricted Area intrusion", status: "danger" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportIncident(incType, incLoc, incSev);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Live CCTV surveillance grid mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CCTV stream feeds */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card variant="glass" hoverEffect={false} className="flex-1 flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Security CCTV Scanner Grid
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time object recognition and boundary breach feeds.</p>
                </div>
                <Button variant="glass" size="sm" onClick={() => setCamGrid(!camGrid)} className="text-[10px]">
                  {camGrid ? "Disable CCTV Grid" : "Enable CCTV Grid"}
                </Button>
              </div>

              {camGrid ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Camera 1 */}
                  <div className="aspect-[4/3] rounded-xl bg-slate-950 border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-600 text-white text-[8px] font-bold tracking-widest animate-pulse uppercase">
                      Live: Gate C
                    </span>
                    {/* Visual scanned overlay lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(139,92,246,0.1)_50%)] bg-[size:100%_4px] pointer-events-none" />
                    <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] border-2 border-dashed border-red-500/60 rounded-lg flex flex-col items-center justify-center text-[10px] text-red-200 bg-red-950/20 pointer-events-none">
                      <AlertTriangle className="w-4 h-4 text-red-500 mb-1 animate-bounce" />
                      <span>HEAVY CROWDING</span>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase font-mono">CAM 01 - NORTH ENTRY</span>
                  </div>

                  {/* Camera 2 */}
                  <div className="aspect-[4/3] rounded-xl bg-slate-950 border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[8px] font-bold tracking-widest uppercase">
                      Live: VIP Box
                    </span>
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(16,185,129,0.05)_50%)] bg-[size:100%_4px] pointer-events-none" />
                    <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] border-2 border-emerald-500/40 rounded-full flex flex-col items-center justify-center text-[9px] text-emerald-300 pointer-events-none">
                      <span>SECURE ZONE</span>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase font-mono">CAM 02 - SUITE ENTRANCE</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 rounded-xl bg-slate-950/40 border border-white/5">
                  CCTV cameras offline. Privacy shielding toggled.
                </div>
              )}
            </div>

            {/* Simulated Face Recognition Alerts */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Neural Face Scan Feed</span>
              <div className="flex flex-col gap-2">
                {faceLogs.map((face, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        face.status === "ok" ? "bg-emerald-500" : face.status === "warning" ? "bg-yellow-500" : "bg-red-500 animate-ping"
                      }`} />
                      <span className="text-slate-400">[{face.time}]</span>
                      <span className="text-slate-200 font-bold">{face.id}</span>
                    </div>
                    <span className="text-slate-400">Match: {face.match}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      face.status === "ok" ? "bg-emerald-950/30 text-emerald-300" : "bg-red-950/30 text-red-300"
                    }`}>
                      {face.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Dispatch incident form */}
        <div className="flex flex-col gap-4">
          <Card variant="glass" hoverEffect={false}>
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Dispatch Security Alert
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Alert AI control center of live boundary breaches or security risks.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Incident Type</label>
                <select
                  value={incType}
                  onChange={(e) => setIncType(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none w-full"
                >
                  <option value="Suspicious Object">Suspicious Object</option>
                  <option value="Restricted Area breach">Restricted Area breach</option>
                  <option value="Physical altercation">Physical altercation</option>
                  <option value="Crowd Bottleneck">Crowd Bottleneck</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Location Sector</label>
                <input
                  type="text"
                  value={incLoc}
                  onChange={(e) => setIncLoc(e.target.value)}
                  placeholder="e.g. Block 102 Corridors"
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Triage Severity</label>
                <div className="flex gap-2">
                  {(["low", "medium", "critical"] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setIncSev(sev)}
                      className={`flex-1 py-1 rounded text-[10px] font-extrabold uppercase border transition-all ${
                        incSev === sev
                          ? sev === "critical"
                            ? "bg-red-600 border-red-500 text-white"
                            : "bg-orange-600 border-orange-500 text-white"
                          : "glass border-slate-800 text-slate-400"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" variant="danger" className="w-full mt-2 text-xs flex gap-1.5 justify-center items-center">
                <Send className="w-3.5 h-3.5" /> Dispatch Alert
              </Button>
            </form>
          </Card>
        </div>

      </div>

      {/* Incident logs list */}
      <Card variant="glass" hoverEffect={false}>
        <div className="mb-4">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Security Incident Logs
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Logs of active incidents and patrolling dispatches.</p>
        </div>

        <div className="flex flex-col gap-2">
          {incidents.map((inc) => (
            <div key={inc.id} className="p-3.5 rounded-xl bg-slate-950/20 border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <AlertTriangle className={`w-4 h-4 ${inc.severity === "critical" ? "text-red-500 animate-pulse" : "text-yellow-500"}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">{inc.type}</span>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {inc.location}</span>
                    <span>Reported: {inc.reportedAt}</span>
                    <span>Officer: {inc.assignedOfficer}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                  inc.severity === "critical" ? "bg-red-950 text-red-300 border border-red-500/20" : "bg-slate-900 text-slate-400"
                }`}>
                  {inc.severity}
                </span>

                {inc.status !== "resolved" ? (
                  <Button variant="success" size="sm" onClick={() => updateIncidentStatus(inc.id, "resolved")} className="text-[10px] py-1 px-2.5">
                    Resolve
                  </Button>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SecurityView;
