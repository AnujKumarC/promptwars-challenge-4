"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ChartProps {
  title: string;
  subtitle?: string;
  className?: string;
}

// 1. Interactive Line Chart with Hover tooltips
export const PremiumLineChart: React.FC<ChartProps> = ({ title, subtitle, className = "" }) => {
  const data = [45, 52, 68, 62, 74, 85, 78, 64, 72, 80, 92, 85];
  const labels = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];
  
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 500;
  const height = 200;
  const padding = 30;

  const points = data.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (val * (height - padding * 2)) / 100;
    return { x, y, val };
  });

  const pathD = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `
    ${pathD} 
    L ${points[points.length - 1].x} ${height - padding} 
    L ${points[0].x} ${height - padding} Z
  `;

  return (
    <div className={`glass rounded-2xl p-5 flex flex-col justify-between ${className}`}>
      <div className="mb-3 flex justify-between items-start">
        <div>
          <h4 className="text-xs font-black tracking-wider uppercase text-zinc-400">{title}</h4>
          {subtitle && <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{subtitle}</p>}
        </div>
        {hoveredIdx !== null && (
          <div className="text-right">
            <span className="text-[9px] font-bold text-zinc-500 block uppercase">{labels[hoveredIdx]}</span>
            <span className="text-sm font-black text-indigo-400 block mt-0.5">{data[hoveredIdx]}% Load</span>
          </div>
        )}
      </div>

      <div className="relative flex-1 w-full mt-2 min-h-[140px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 50, 100].map((grid, idx) => {
            const y = height - padding - (grid * (height - padding * 2)) / 100;
            return (
              <g key={idx}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="1"
                />
                <text
                  x={padding - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="rgba(255, 255, 255, 0.25)"
                  fontSize="7"
                  fontWeight="bold"
                >
                  {grid}%
                </text>
              </g>
            );
          })}

          {/* Area */}
          <motion.path
            d={areaD}
            fill="url(#lineGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Vertical indicator line on hover */}
          {hoveredIdx !== null && (
            <line
              x1={points[hoveredIdx].x}
              y1={padding}
              x2={points[hoveredIdx].x}
              y2={height - padding}
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {/* Interactive Nodes */}
          {points.map((p, idx) => (
            <g key={idx}>
              {/* Invisible larger hover catcher */}
              <circle
                cx={p.x}
                cy={p.y}
                r="14"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? "5" : "3"}
                fill="#ffffff"
                stroke="#6366f1"
                strokeWidth={hoveredIdx === idx ? "3" : "1.5"}
                animate={{ scale: hoveredIdx === idx ? 1.2 : 1 }}
                style={{ pointerEvents: "none" }}
              />
              {idx % 2 === 0 && (
                <text
                  x={p.x}
                  y={height - 10}
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.25)"
                  fontSize="7"
                  fontWeight="bold"
                >
                  {labels[idx]}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// 2. Interactive Bar Chart with Hover Tooltips
export const PremiumBarChart: React.FC<ChartProps> = ({ title, subtitle, className = "" }) => {
  const data = [65, 82, 54, 71, 93];
  const labels = ["Electricity", "Water", "Gas", "Waste", "Carbon"];
  const colors = ["#f43f5e", "#0ea5e9", "#eab308", "#10b981", "#6366f1"];
  
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 400;
  const height = 200;
  const padding = 30;
  const barWidth = 30;
  const gap = (width - padding * 2 - barWidth * data.length) / (data.length - 1);

  return (
    <div className={`glass rounded-2xl p-5 flex flex-col justify-between ${className}`}>
      <div className="mb-3 flex justify-between items-start">
        <div>
          <h4 className="text-xs font-black tracking-wider uppercase text-zinc-400">{title}</h4>
          {subtitle && <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{subtitle}</p>}
        </div>
        {hoveredIdx !== null && (
          <div className="text-right">
            <span className="text-[9px] font-bold text-zinc-500 block uppercase">{labels[hoveredIdx]}</span>
            <span className="text-sm font-black text-slate-200 block mt-0.5" style={{ color: colors[hoveredIdx] }}>
              {data[hoveredIdx]}% Optimal
            </span>
          </div>
        )}
      </div>

      <div className="relative flex-1 w-full mt-2 min-h-[140px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {[0, 50, 100].map((grid, idx) => {
            const y = height - padding - (grid * (height - padding * 2)) / 100;
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1"
              />
            );
          })}

          {data.map((val, idx) => {
            const x = padding + idx * (barWidth + gap);
            const barHeight = (val * (height - padding * 2)) / 100;
            const y = height - padding - barHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g 
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background bar */}
                <rect
                  x={x}
                  y={padding}
                  width={barWidth}
                  height={height - padding * 2}
                  rx="4"
                  fill="rgba(255,255,255,0.01)"
                />
                {/* Foreground bar */}
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill={colors[idx]}
                  opacity={isHovered ? 1 : 0.75}
                  initial={{ height: 0, y: height - padding }}
                  animate={{ height: barHeight, y }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* Value text on hover */}
                {isHovered && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {val}%
                  </text>
                )}
                {/* Axis Labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fill={isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.25)"}
                  fontSize="7"
                  fontWeight="bold"
                >
                  {labels[idx]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// 3. Interactive Donut Chart with Hover Slices
export const PremiumDonutChart: React.FC<ChartProps> = ({ title, subtitle, className = "" }) => {
  const slices = [
    { value: 40, color: "#6366f1", label: "Gate A" },
    { value: 25, color: "#10b981", label: "Gate B" },
    { value: 20, color: "#eab308", label: "Gate C" },
    { value: 15, color: "#f43f5e", label: "Gate D" },
  ];

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className={`glass rounded-2xl p-5 flex flex-col justify-between ${className}`}>
      <div>
        <h4 className="text-xs font-black tracking-wider uppercase text-zinc-400">{title}</h4>
        {subtitle && <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex flex-row items-center gap-6 mt-3 flex-1 justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {slices.map((slice, idx) => {
              const strokeDashoffset = circumference - (slice.value / 100) * circumference;
              const strokeDasharray = circumference;
              const offsetAngle = (accumulatedPercent / 100) * circumference;
              accumulatedPercent += slice.value;
              const isHovered = hoveredIdx === idx;

              return (
                <motion.circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transformOrigin: "center",
                    transform: `rotate(${(offsetAngle / circumference) * 360}deg)`,
                  }}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1 }}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black tracking-tight text-white">
              {hoveredIdx !== null ? `${slices[hoveredIdx].value}%` : "100%"}
            </span>
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold block mt-0.5">
              {hoveredIdx !== null ? slices[hoveredIdx].label : "Flow Grid"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 font-mono">
          {slices.map((slice, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2 text-[10px] cursor-pointer transition-all ${
                hoveredIdx === idx ? "text-white translate-x-1" : "text-zinc-400"
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="font-bold">{slice.label}:</span>
              <span>{slice.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
