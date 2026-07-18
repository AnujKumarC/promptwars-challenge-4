"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  ClipboardList, CheckCircle2, UserCheck, ShieldAlert, 
  MapPin, Award, Flame, AlertCircle, Calendar 
} from "lucide-react";

export const VolunteerView: React.FC = () => {
  const { tasks, updateTaskStatus, activeEmergency, emergencyLocation } = useAppState();
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string>("02:30 PM");

  const performancePoints = tasks
    .filter(t => t.status === "completed")
    .reduce((acc, curr) => acc + curr.points, 0);

  const completedCount = tasks.filter(t => t.status === "completed").length;

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
    if (!isCheckedIn) {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setCheckInTime(now);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Check In / Out Card */}
      <Card variant="glass" hoverEffect={false} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-indigo-900/20 -z-10" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              Shift Check-In Command
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isCheckedIn 
                ? `Checked in at ${checkInTime}. Active Zone: North Concourse.` 
                : "Checked out. Tap below to begin shift and register presence."}
            </p>
          </div>
          <Button variant={isCheckedIn ? "secondary" : "primary"} size="sm" onClick={handleCheckIn}>
            {isCheckedIn ? "Clock Out of Shift" : "Clock In for Shift"}
          </Button>
        </div>
      </Card>

      {/* Emergency dispatch box */}
      {activeEmergency !== "none" && (
        <Card variant="glow" glowColor="red" hoverEffect={true} className="border-red-500/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-black uppercase text-red-400 tracking-wider block">AI Emergency Reroute Instruction</span>
              <h4 className="text-sm font-bold text-slate-200 mt-1">Assist evacuation near {emergencyLocation}</h4>
              <p className="text-xs text-red-200 mt-1">
                A Code Red [{activeEmergency.toUpperCase()}] is active. Divert crowds from North Food Court towards Emergency Exit East. 
                Keep accessible pathways clear. Report counts to Incident command.
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="danger" size="sm">Acknowledge Dispatch</Button>
                <span className="px-3 py-1.5 rounded-lg border border-red-500/30 text-[10px] text-red-300 font-bold bg-red-950/20">
                  Critical priority +500 points
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tasks & Performance grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Tasks list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card variant="glass" hoverEffect={false}>
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-400" />
                Assigned Operations Checklist
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Task routes optimized based on stadium terminal loads.</p>
            </div>

            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 rounded-xl bg-slate-950/20 border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {task.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className={`w-4 h-4 ${task.priority === "high" ? "text-red-400" : "text-yellow-400"}`} />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{task.title}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">{task.description}</span>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {task.location}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          task.priority === "high" ? "bg-red-950 text-red-300" : "bg-slate-900 text-slate-400"
                        }`}>{task.priority.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {task.status !== "completed" && (
                    <div className="flex gap-2">
                      {task.status === "pending" ? (
                        <Button variant="glass" size="sm" onClick={() => updateTaskStatus(task.id, "in_progress")}>
                          Start Task
                        </Button>
                      ) : (
                        <Button variant="success" size="sm" onClick={() => updateTaskStatus(task.id, "completed")}>
                          Mark Done
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance & Score */}
        <div className="flex flex-col gap-4">
          <Card variant="glass" hoverEffect={false} className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-yellow-400" />
                Performance Scorecard
              </h4>
              
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-center my-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-400 block">Total Earned Points</span>
                <span className="text-4xl font-black text-white block mt-1.5">{performancePoints} PTS</span>
                <span className="text-xs text-slate-400 block mt-2">Rank: Concourse Supervisor Gold</span>
              </div>

              <div className="flex flex-col gap-2 mt-4 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Tasks Completed:</span>
                  <span className="font-bold text-slate-200">{completedCount} / {tasks.length}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Active Shift:</span>
                  <span className="font-bold text-slate-200">02:30 PM - 08:30 PM</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Attendance:</span>
                  <span className="font-bold text-emerald-400">100% Streak</span>
                </div>
              </div>
            </div>

            {/* AI Coaching Tips */}
            <div className="mt-4 pt-4 border-t border-white/5 bg-slate-950/25 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">AI Coaching Tip</span>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                "Crowd counts near the North Food Court are shifting. Directing fans to seat paths early will score you an extra 100 points."
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default VolunteerView;
