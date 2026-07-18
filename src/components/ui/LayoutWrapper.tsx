"use client";

import React from "react";
import { useAppState } from "@/context/AppStateContext";
import FloatingAssistant from "@/components/chat/FloatingAssistant";
import CommandPalette from "@/components/ui/CommandPalette";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { highContrast, fontSize, theme } = useAppState();

  const fontClass =
    fontSize === "large"
      ? "font-scale-large"
      : fontSize === "xlarge"
      ? "font-scale-xlarge"
      : "";

  return (
    <div
      className={`${theme} ${highContrast ? "high-contrast" : ""} ${fontClass} min-h-screen text-white relative transition-colors duration-300`}
    >
      {children}
      <FloatingAssistant />
      <CommandPalette />
    </div>
  );
}
