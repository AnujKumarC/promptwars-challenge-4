"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "success" | "glass" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "glass",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  children,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/20 shadow-md shadow-indigo-600/10";
      case "secondary":
        return "bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800";
      case "danger":
        return "bg-rose-600 hover:bg-rose-500 text-white border border-rose-500/20 shadow-md shadow-rose-600/10";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/20 shadow-md shadow-emerald-600/10";
      case "gradient":
        return "bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-500 text-white border border-white/10 hover:opacity-90 shadow-md shadow-purple-500/10";
      case "glass":
      default:
        return "glass text-zinc-300 hover:bg-white/[0.06] hover:text-white border-white/5";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-xs rounded-lg font-bold tracking-tight";
      case "lg":
        return "px-6 py-3.5 text-sm rounded-xl font-bold tracking-tight uppercase tracking-wider";
      case "md":
      default:
        return "px-4 py-2.5 text-xs rounded-xl font-bold tracking-tight";
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.015 }}
      whileTap={isDisabled ? {} : { scale: 0.985 }}
      disabled={isDisabled}
      className={`relative inline-flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClass()} ${getSizeClass()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
