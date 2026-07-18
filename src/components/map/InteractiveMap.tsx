"use client";

import React, { useState, useEffect } from "react";
import { useAppState, RouteType } from "@/context/AppStateContext";
import { motion } from "framer-motion";
import { Navigation, Accessibility, Flame, Users, MapPin } from "lucide-react";

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "entrance" | "exit" | "seat" | "food" | "washroom" | "metro" | "medical" | "parking";
}

const NODES: Node[] = [
  { id: "ent_a", name: "Entrance A (North)", x: 250, y: 45, type: "entrance" },
  { id: "ent_b", name: "Entrance B (South)", x: 250, y: 455, type: "entrance" },
  { id: "metro", name: "Metro Station Terminal", x: 55, y: 250, type: "metro" },
  { id: "parking", name: "VIP Parking Lot A", x: 445, y: 250, type: "parking" },
  { id: "food_n", name: "North Food Court", x: 250, y: 125, type: "food" },
  { id: "food_s", name: "South Food Court", x: 250, y: 375, type: "food" },
  { id: "wash_n", name: "North Washrooms", x: 125, y: 155, type: "washroom" },
  { id: "wash_s", name: "South Washrooms", x: 375, y: 345, type: "washroom" },
  { id: "medical", name: "Concourse Medical Station", x: 125, y: 335, type: "medical" },
  { id: "exit_e", name: "Emergency Exit East", x: 445, y: 125, type: "exit" },
  { id: "seat_101", name: "Seat Section 101", x: 195, y: 205, type: "seat" },
  { id: "seat_102", name: "Seat Section 102", x: 305, y: 205, type: "seat" },
  { id: "seat_103", name: "Seat Section 103", x: 195, y: 295, type: "seat" },
  { id: "seat_104", name: "Seat Section 104", x: 305, y: 295, type: "seat" },
];

const PATHS: Record<string, string[]> = {
  // Entrance A to Seat 102
  "ent_a-seat_102-shortest": ["ent_a", "food_n", "seat_102"],
  "ent_a-seat_102-wheelchair": ["ent_a", "parking", "seat_102"],
  "ent_a-seat_102-low_crowd": ["ent_a", "wash_n", "seat_101", "seat_102"],
  "ent_a-seat_102-evacuation": ["seat_102", "food_n", "exit_e"],

  // Entrance B to Seat 104
  "ent_b-seat_104-shortest": ["ent_b", "food_s", "seat_104"],
  "ent_b-seat_104-wheelchair": ["ent_b", "parking", "seat_104"],
  "ent_b-seat_104-low_crowd": ["ent_b", "medical", "seat_103", "seat_104"],
  "ent_b-seat_104-evacuation": ["seat_104", "food_s", "ent_b"],

  // Metro to Seat 101
  "metro-seat_101-shortest": ["metro", "wash_n", "seat_101"],
  "metro-seat_101-wheelchair": ["metro", "medical", "seat_103", "seat_101"],
  "metro-seat_101-low_crowd": ["metro", "food_s", "seat_103", "seat_101"],
  "metro-seat_101-evacuation": ["seat_101", "wash_n", "ent_a"],

  // Parking to Seat 102
  "parking-seat_102-shortest": ["parking", "seat_102"],
  "parking-seat_102-wheelchair": ["parking", "seat_102"],
  "parking-seat_102-low_crowd": ["parking", "wash_s", "seat_104", "seat_102"],
  "parking-seat_102-evacuation": ["seat_102", "exit_e"],

  default: ["ent_a", "food_n", "seat_101"],
};

export const InteractiveMap: React.FC = () => {
  const {
    navStart,
    setNavStart,
    navEnd,
    setNavEnd,
    routeType,
    setRouteType,
    activeEmergency,
    metrics
  } = useAppState();

  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [activePath, setActivePath] = useState<string[]>([]);

  useEffect(() => {
    const startNode = NODES.find(n => n.name === navStart || n.id === navStart)?.id || "ent_a";
    const endNode = NODES.find(n => n.name === navEnd || n.id === navEnd)?.id || "seat_102";
    
    let routeKey = `${startNode}-${endNode}-${routeType}`;
    if (activeEmergency !== "none" || routeType === "evacuation") {
      routeKey = `${startNode}-${endNode}-evacuation`;
    }

    const path = PATHS[routeKey] || PATHS[`${startNode}-seat_102-shortest`] || PATHS["default"];
    setActivePath(path);
  }, [navStart, navEnd, routeType, activeEmergency]);

  const handleNodeClick = (node: Node) => {
    if (node.type === "entrance" || node.type === "metro" || node.type === "parking") {
      setNavStart(node.name);
    } else {
      setNavEnd(node.name);
    }
  };

  const getCrowdColor = (density: number) => {
    if (density < 50) return "rgba(16, 185, 129, 0.2)";
    if (density < 75) return "rgba(245, 158, 11, 0.25)";
    return "rgba(239, 68, 68, 0.3)";
  };

  const getPolylinePoints = () => {
    return activePath
      .map(id => {
        const node = NODES.find(n => n.id === id);
        return node ? `${node.x},${node.y}` : "";
      })
      .filter(p => p !== "")
      .join(" ");
  };

  // Generate coordinate arrays for particle animation keyframes
  const getParticleKeyframesX = () => {
    return activePath.map(id => NODES.find(n => n.id === id)?.x || 250);
  };

  const getParticleKeyframesY = () => {
    return activePath.map(id => NODES.find(n => n.id === id)?.y || 250);
  };

  const pathPointsCount = activePath.length;

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* Map Card */}
      <div className="flex-1 glass rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden min-h-[480px]">
        <div className="flex items-center justify-between mb-4 z-10">
          <div>
            <h3 className="text-xs font-black tracking-wider uppercase text-zinc-400 flex items-center gap-2">
              <Navigation className={`w-4.5 h-4.5 ${activeEmergency !== "none" ? "text-red-500 animate-pulse" : "text-indigo-400"}`} />
              Spatial Guidance Matrix
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
              {activeEmergency !== "none" 
                ? "CRITICAL: Rerouting emergency evacuation paths." 
                : "Optimized route parameters computed via Gemini spatial matrix."}
            </p>
          </div>
          
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
              showHeatmap 
                ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-300 shadow-md shadow-indigo-500/5" 
                : "glass border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {showHeatmap ? "Overlay Off" : "Overlay On"}
          </button>
        </div>

        {/* Stadium Layout */}
        <div className="relative flex-1 w-full flex items-center justify-center py-4 bg-zinc-950/60 rounded-2xl border border-white/[0.02]">
          <svg
            viewBox="0 0 500 500"
            className="w-full max-w-[440px] aspect-square drop-shadow-[0_0_35px_rgba(0,0,0,0.6)]"
          >
            {/* Outer Rings */}
            <circle
              cx="250"
              cy="250"
              r="225"
              fill="none"
              stroke={activeEmergency !== "none" ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.02)"}
              strokeWidth="10"
            />
            <circle
              cx="250"
              cy="250"
              r="200"
              fill="none"
              stroke="rgba(255, 255, 255, 0.015)"
              strokeWidth="18"
            />
            
            {/* Field Turf */}
            <rect
              x="170"
              y="200"
              width="160"
              height="100"
              rx="6"
              fill="rgba(16, 185, 129, 0.04)"
              stroke="rgba(16, 185, 129, 0.2)"
              strokeWidth="1.5"
            />
            <line x1="250" y1="200" x2="250" y2="300" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="1" />
            <circle cx="250" cy="250" r="22" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="1" />

            {/* Stand Labels */}
            <text x="250" y="80" textAnchor="middle" fill="rgba(255, 255, 255, 0.1)" fontSize="9" fontWeight="900" letterSpacing="0.2em">NORTH STAND</text>
            <text x="250" y="430" textAnchor="middle" fill="rgba(255, 255, 255, 0.1)" fontSize="9" fontWeight="900" letterSpacing="0.2em">SOUTH STAND</text>
            <text x="95" y="253" textAnchor="middle" fill="rgba(255, 255, 255, 0.1)" fontSize="9" fontWeight="900" letterSpacing="0.2em" transform="rotate(-90 95 253)">WEST WING</text>
            <text x="405" y="253" textAnchor="middle" fill="rgba(255, 255, 255, 0.1)" fontSize="9" fontWeight="900" letterSpacing="0.2em" transform="rotate(90 405 253)">EAST WING</text>

            {/* Heatmap Overlays */}
            {showHeatmap && (
              <>
                <path d="M 250 250 L 50 150 A 220 220 0 0 1 250 30 Z" fill={getCrowdColor(metrics.crowdDensity + 10)} />
                <path d="M 250 250 L 250 30 A 220 220 0 0 1 450 150 Z" fill={getCrowdColor(metrics.crowdDensity - 15)} />
                <path d="M 250 250 L 50 350 A 220 220 0 0 0 250 470 Z" fill={getCrowdColor(metrics.crowdDensity + 5)} />
                <path d="M 250 250 L 250 470 A 220 220 0 0 0 450 350 Z" fill={getCrowdColor(metrics.crowdDensity - 5)} />
              </>
            )}

            {/* Node connections */}
            <line x1="250" y1="45" x2="250" y2="125" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="250" y1="455" x2="250" y2="375" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="55" y1="250" x2="195" y2="205" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="445" y1="250" x2="305" y2="205" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

            {/* Static polyline route */}
            {pathPointsCount > 1 && (
              <polyline
                points={getPolylinePoints()}
                fill="none"
                stroke={activeEmergency !== "none" || routeType === "evacuation" ? "#f43f5e" : "#6366f1"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              />
            )}

            {/* Glowing moving particles flow along path */}
            {pathPointsCount > 1 && (
              <>
                <motion.circle
                  r="5"
                  fill={activeEmergency !== "none" || routeType === "evacuation" ? "#f43f5e" : "#818cf8"}
                  animate={{
                    cx: getParticleKeyframesX(),
                    cy: getParticleKeyframesY()
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="shadow-lg shadow-indigo-500/50"
                  style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
                />
                <motion.circle
                  r="4"
                  fill={activeEmergency !== "none" || routeType === "evacuation" ? "#f43f5e" : "#67e8f9"}
                  animate={{
                    cx: getParticleKeyframesX(),
                    cy: getParticleKeyframesY()
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1 // staggered particle
                  }}
                  style={{ filter: "drop-shadow(0 0 3px currentColor)" }}
                />
              </>
            )}

            {/* Nodes */}
            {NODES.map((node) => {
              const isSelectedStart = node.name === navStart || node.id === navStart;
              const isSelectedEnd = node.name === navEnd || node.id === navEnd;
              const isInPath = activePath.includes(node.id);
              
              let fill = "rgba(9, 9, 11, 0.9)";
              let stroke = "rgba(255, 255, 255, 0.1)";
              let size = 6;
              
              if (isSelectedStart) {
                fill = "#10b981";
                stroke = "#ffffff";
                size = 8;
              } else if (isSelectedEnd) {
                fill = activeEmergency !== "none" ? "#ef4444" : "#6366f1";
                stroke = "#ffffff";
                size = 8;
              } else if (isInPath) {
                stroke = activeEmergency !== "none" ? "rgba(239, 68, 68, 0.6)" : "rgba(99, 102, 241, 0.6)";
                fill = "rgba(10, 10, 15, 0.9)";
              }

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer group"
                  onClick={() => handleNodeClick(node)}
                >
                  <circle r="12" fill="transparent" />
                  
                  {(isSelectedStart || isSelectedEnd) && (
                    <circle
                      r="14"
                      fill="none"
                      stroke={isSelectedStart ? "#10b981" : (activeEmergency !== "none" ? "#ef4444" : "#6366f1")}
                      strokeWidth="1.5"
                      className="animate-ping opacity-60"
                    />
                  )}

                  <circle
                    r={size}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2"
                    className="transition-all duration-300 group-hover:r-7 group-hover:stroke-white"
                  />
                  
                  <text
                    y="-12"
                    textAnchor="middle"
                    fill="#a1a1aa"
                    fontSize="6"
                    fontWeight="bold"
                    className="opacity-0 group-hover:opacity-100 transition-opacity font-sans tracking-tight"
                    style={{ pointerEvents: "none" }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-4 border-t border-white/[0.02] text-[9px] text-zinc-500 justify-center font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Start Terminal</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Destination</div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-0.5 bg-indigo-500/40" /> Optimize Path</div>
          {showHeatmap && (
            <div className="flex items-center gap-2 ml-2">
              <span className="w-10 h-1.5 rounded bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-red-500/20" />
              <span>Crowd density</span>
            </div>
          )}
        </div>
      </div>

      {/* Side Selector Control Column */}
      <div className="w-full xl:w-80 flex flex-col gap-4">
        {/* Route selector card */}
        <div className="glass rounded-3xl p-5 flex flex-col gap-4">
          <h4 className="text-xs font-black tracking-wider uppercase text-zinc-400">Pathfinder Matrix</h4>
          
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" /> Location Origin
            </label>
            <select
              value={navStart}
              onChange={(e) => setNavStart(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-full font-semibold"
            >
              <option value="Entrance A (North)">Entrance A (North)</option>
              <option value="Entrance B (South)">Entrance B (South)</option>
              <option value="Metro Station Terminal">Metro Terminal</option>
              <option value="VIP Parking Lot A">VIP Parking Lot A</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" /> Stand Destination
            </label>
            <select
              value={navEnd}
              onChange={(e) => setNavEnd(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-full font-semibold"
            >
              <option value="Seat Section 101">Seat Block 101</option>
              <option value="Seat Section 102">Seat Block 102</option>
              <option value="Seat Section 103">Seat Block 103</option>
              <option value="Seat Section 104">Seat Block 104</option>
              <option value="North Food Court">North Food Court</option>
              <option value="South Food Court">South Food Court</option>
              <option value="North Washrooms">North Restrooms</option>
              <option value="South Washrooms">South Restrooms</option>
              <option value="Concourse Medical Station">Concourse Medical</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.02]">
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Reroute Optimization criteria</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "shortest", label: "Shortest", icon: Navigation, danger: false },
                  { id: "wheelchair", label: "Accessible", icon: Accessibility, danger: false },
                  { id: "low_crowd", label: "Low Crowd", icon: Users, danger: false },
                  { id: "evacuation", label: "Evac Exit", icon: Flame, danger: true },
                ] as { id: RouteType; label: string; icon: any; danger: boolean }[]
              ).map((mode) => {
                const Icon = mode.icon;
                const isSelected = routeType === mode.id || (activeEmergency !== "none" && mode.id === "evacuation");
                const isDanger = mode.danger;

                return (
                  <button
                    key={mode.id}
                    disabled={activeEmergency !== "none" && mode.id !== "evacuation"}
                    onClick={() => setRouteType(mode.id as RouteType)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-left text-[10px] font-bold border transition-all ${
                      isSelected
                        ? isDanger
                          ? "bg-red-950/20 border-red-500/30 text-red-300 shadow-md shadow-red-500/5"
                          : "bg-indigo-600/10 border-indigo-500/30 text-indigo-300 shadow-md shadow-indigo-500/5"
                        : "glass border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Analytics diagnostic stats */}
        <div className="glass rounded-3xl p-5 flex flex-col gap-3">
          <h4 className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Route Telemetry</h4>
          
          <div className="flex flex-col gap-2 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Total Distance:</span>
              <span className="text-zinc-300 font-mono">
                {routeType === "shortest" ? "210m" : routeType === "wheelchair" ? "280m" : routeType === "low_crowd" ? "340m" : "190m"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Estimated Walking:</span>
              <span className="text-zinc-300 font-mono">
                {routeType === "shortest" ? "3.2 mins" : routeType === "wheelchair" ? "4.5 mins" : routeType === "low_crowd" ? "4.9 mins" : "2.5 mins"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Terminal Delay:</span>
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                routeType === "low_crowd" ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10" : "bg-amber-950/20 text-amber-400 border border-amber-500/10"
              }`}>
                {routeType === "low_crowd" ? "Minimal (-80%)" : "Normal (+15%)"}
              </span>
            </div>
            {activeEmergency !== "none" && (
              <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-xl text-[10px] text-red-300 flex gap-2 items-start mt-2">
                <Flame className="w-4 h-4 text-red-500 flex-shrink-0 animate-pulse" />
                <div>
                  <span className="font-bold block uppercase text-[8px] tracking-wider text-red-400">Reroute Active</span>
                  Proceed towards Exit East. High speed corridors are unlocked.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
