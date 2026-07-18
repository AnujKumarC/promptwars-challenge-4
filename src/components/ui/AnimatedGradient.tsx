"use client";

import React from "react";

export const AnimatedGradient: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-grid-mesh gradient-mask-top opacity-60">
      {/* Mesh Orbs */}
      <div className="absolute top-[5%] left-[20%] w-[35%] h-[35%] rounded-full bg-indigo-900/10 blur-[130px] animate-[pulseGlow_14s_infinite]" />
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[140px] animate-[pulseGlow_18s_infinite_3s]" />
      <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-purple-900/5 blur-[120px] animate-[pulseGlow_12s_infinite_1.5s]" />
    </div>
  );
};

export default AnimatedGradient;
