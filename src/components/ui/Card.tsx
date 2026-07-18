"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "glass" | "glass-premium" | "glow";
  glowColor?: "indigo" | "emerald" | "rose" | "amber" | "none";
  hoverEffect?: boolean;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "glass",
  glowColor = "none",
  hoverEffect = true,
  className = "",
  children,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "glass":
        return "glass rounded-2xl p-6 transition-all duration-300";
      case "glass-premium":
        return "glass-premium rounded-3xl p-6 transition-all duration-300";
      case "glow":
        return "glass rounded-2xl p-6 border-white/5 transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-tr before:from-indigo-500/5 before:to-purple-500/5 before:pointer-events-none";
      default:
        return "bg-zinc-950/80 border border-zinc-850 rounded-2xl p-6";
    }
  };

  const getGlowClass = () => {
    if (glowColor === "none") return "";
    switch (glowColor) {
      case "indigo":
        return "border-glow-indigo";
      case "emerald":
        return "border-glow-emerald";
      case "rose":
        return "hover:border-rose-500/30 hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)]";
      case "amber":
        return "hover:border-amber-500/30 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]";
      default:
        return "";
    }
  };

  const containerClasses = `${getVariantClass()} ${getGlowClass()} ${className} overflow-hidden`;

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -2, scale: 1.005 } : undefined}
      transition={hoverEffect ? { type: "spring", stiffness: 350, damping: 25 } : undefined}
      className={containerClasses}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
