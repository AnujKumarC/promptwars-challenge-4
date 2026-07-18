"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppState, UserRole, EmergencyType } from "@/context/AppStateContext";
import { Search, Eye, Sparkles, AlertTriangle, ShieldCheck, HeartPulse, Settings, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    setUserRole,
    triggerEmergency,
    resolveEmergency,
    highContrast,
    setHighContrast,
    screenReader,
    setScreenReader
  } = useAppState();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Monitor keys for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    setIsOpen(false);
  };

  const executeEmergency = (type: EmergencyType, loc: string) => {
    triggerEmergency(type, loc);
    setIsOpen(false);
  };

  const clearEmergency = () => {
    resolveEmergency();
    setIsOpen(false);
  };

  const commands: CommandItem[] = [
    // Role switches
    { id: "role-admin", category: "Navigation Viewports", title: "Switch to Admin Command Center", subtitle: "Full overview and analytics logs", icon: Settings, action: () => switchRole("admin") },
    { id: "role-fan", category: "Navigation Viewports", title: "Switch to Fan Portal", subtitle: "Food orders, transit tables & routing", icon: Eye, action: () => switchRole("fan") },
    { id: "role-volunteer", category: "Navigation Viewports", title: "Switch to Volunteer Grid", subtitle: "Shifts checklists and points logs", icon: ShieldCheck, action: () => switchRole("volunteer") },
    { id: "role-security", category: "Navigation Viewports", title: "Switch to Security CCTV", subtitle: "Face log checkers and incident triggers", icon: AlertTriangle, action: () => switchRole("security") },
    { id: "role-medical", category: "Navigation Viewports", title: "Switch to Triage Dispatch", subtitle: "Paramedic coordinates & triage cases", icon: HeartPulse, action: () => switchRole("medical") },
    
    // Emergency controls
    { id: "em-fire", category: "Operations Incident Dispatch", title: "Simulate Code Red: Fire", subtitle: "Trigger structural alert at North Stalls", icon: AlertTriangle, action: () => executeEmergency("fire", "North Food Court Stall B") },
    { id: "em-stampede", category: "Operations Incident Dispatch", title: "Simulate Code Red: Stampede", subtitle: "Trigger crowding evacuation panic warning", icon: AlertTriangle, action: () => executeEmergency("stampede", "Gate C Tunnel") },
    { id: "em-clear", category: "Operations Incident Dispatch", title: "Resolve Active Emergency Status", subtitle: "Restore grids to normal stadium parameters", icon: ShieldCheck, action: clearEmergency },
    
    // Accessibility controls
    { id: "a11y-contrast", category: "Accessibility & Themes", title: "Toggle High Contrast Contrast Overlay", subtitle: "Bypass layout graphics for readability", icon: Eye, action: () => { setHighContrast(!highContrast); setIsOpen(false); } },
    { id: "a11y-speech", category: "Accessibility & Themes", title: "Toggle Screen Reader Speech Synthesis", subtitle: "Simulate text-to-speech feedback", icon: Sparkles, action: () => { setScreenReader(!screenReader); setIsOpen(false); } },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  // Arrow key controls
  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };
    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [isOpen, selectedIndex, filteredCommands]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dialog content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg glass bg-zinc-950/80 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col font-sans"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-900">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                placeholder="Search commands (e.g. 'Admin', 'Fire', 'Contrast')..."
                className="bg-transparent border-none outline-none text-xs text-zinc-200 flex-1 placeholder-zinc-500 font-semibold"
              />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide border border-zinc-850 px-2 py-0.5 rounded-lg bg-zinc-900 flex items-center gap-1 font-mono">
                <Terminal className="w-2.5 h-2.5" /> ESC to Close
              </span>
            </div>

            {/* Commands list */}
            <div className="max-h-[300px] overflow-y-auto p-2 flex flex-col gap-1">
              {filteredCommands.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500 font-semibold">No operational commands matched.</div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = selectedIndex === idx;

                  return (
                    <div
                      key={cmd.id}
                      onClick={() => cmd.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        isSelected 
                          ? "bg-indigo-600/10 border border-indigo-500/20 text-white" 
                          : "border border-transparent text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? "bg-indigo-600/20 text-indigo-400" : "bg-zinc-900 text-zinc-500"
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{cmd.title}</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 block font-semibold">{cmd.subtitle}</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest pl-2">
                        {cmd.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick footer helper */}
            <div className="bg-zinc-950/60 px-4 py-2.5 border-t border-zinc-900 flex justify-between items-center text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
              <span>Navigate: ↑↓ • Select: Enter</span>
              <span className="flex items-center gap-1 font-mono lowercase">Press <span className="border border-zinc-850 px-1 py-0.5 rounded bg-zinc-900 font-bold uppercase text-[8px]">ctrl + k</span> to toggle anywhere</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
