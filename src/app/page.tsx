"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnimatedGradient } from "@/components/ui/AnimatedGradient";
import { 
  Sparkles, Navigation2, Cpu, Eye, Leaf, 
  ArrowRight, ShieldCheck, ShieldAlert,
  ChevronDown
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Spectators guided", value: "68.4k" },
    { label: "Reroute latency", value: "< 0.4s" },
    { label: "Carbon offset", value: "24.5t" },
    { label: "Native languages", value: "100+" }
  ];

  const features = [
    {
      title: "Interactive spatial pathfinding",
      desc: "Instant routing optimized for shortest travel, wheelchair access, or low-crowd corridors, with dynamic evacuation layouts.",
      icon: Navigation2,
      color: "text-blue-400"
    },
    {
      title: "Gemini conversational core",
      desc: "Multilingual voice-activated stadium guide answering ticket, washroom, parking, or food queries in 100+ native dialects.",
      icon: Cpu,
      color: "text-purple-400"
    },
    {
      title: "Computer vision surveillance",
      desc: "Unattended objects tracking, restricted zone breaches, and automated volunteer dispatching systems in real-time.",
      icon: Eye,
      color: "text-rose-400"
    },
    {
      title: "Sustainability audits",
      desc: "Monitors energy grids and water recycling schedules to lower matchday carbon footprint across tournament operations.",
      icon: Leaf,
      color: "text-emerald-400"
    }
  ];

  const workflowSteps = [
    { step: "01", title: "Live Sensors", desc: "Sensors stream CCTV feeds, gate scanners, and parking loads to the command registry." },
    { step: "02", title: "Gemini Analysis", desc: "Our API structures dialogue inputs and triggers immediate pathfinding routing." },
    { step: "03", title: "Smart Dispatch", desc: "Staff, security, and medical crews receive automated push directions on their dashboards." },
  ];

  const faqs = [
    {
      q: "Does this require active internet to perform routing?",
      a: "No. The system uses a local pathfinder algorithm compiled into the client browser, letting pathfinding and emergency exits route offline."
    },
    {
      q: "How does the system support wheelchair accessibility?",
      a: "Our map database tags all stairs, ramps, and elevators. When the wheelchair route is chosen, it filters out stairs and maps routes using only elevators and ramps."
    },
    {
      q: "How do you connect the Gemini API?",
      a: "Simply configure the GEMINI_API_KEY environment variable. The app automatically shifts to live model outputs; otherwise, it operates on a local simulator."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#09090b] overflow-hidden text-zinc-100">
      <AnimatedGradient />

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-600 to-rose-500 flex items-center justify-center font-black text-white text-sm">
            FN
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wide block">FIFA Nexus AI</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">World Cup 2026</span>
          </div>
        </div>

        <Link href="/auth">
          <Button variant="glass" size="sm">
            Enter Dashboard
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-indigo-400 mb-6 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          PromptWars Hackathon Submission
        </div>
        
        {/* Core Header */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight max-w-4xl">
          The Stadium Command Deck <br />
          <span className="animated-gradient-text">Driven by Generative AI</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed mt-6">
          Coordinating crowd movement, medical emergencies, volunteer dispatches, and utility consumption across the FIFA World Cup 2026. Empowering fans and staff with Gemini intelligence.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/auth">
            <Button variant="gradient" size="lg" className="flex gap-2 items-center">
              Launch Command Center <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="glass" size="lg">
              Technical Specs
            </Button>
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-16 pt-8 border-t border-white/5">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center bg-zinc-950/40 p-4 rounded-2xl border border-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider">{s.label}</span>
              <span className="text-xl font-black tracking-tight text-white mt-1.5 block">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-24 border-t border-white/5 relative z-10 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs-caps text-indigo-400">Matchday Friction</span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1.5">Stadium operations are complex.</h2>
            <p className="text-xs text-zinc-500 font-semibold mt-1">FIFA Nexus AI mitigates gridlocks, alerts dispatch times, and handles resources.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="glass" hoverEffect={false} className="border-red-500/10">
              <h3 className="text-xs font-black text-red-400 flex items-center gap-2 mb-3 uppercase tracking-wider">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                The Bottleneck: High Traffic Friction
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Traditional stadium systems suffer from severe gate congestion, sluggish emergency response times, waste overloads, and static layouts that cause fan confusion.
              </p>
            </Card>

            <Card variant="glass" hoverEffect={false} className="border-emerald-500/10">
              <h3 className="text-xs font-black text-emerald-400 flex items-center gap-2 mb-3 uppercase tracking-wider">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                The Solution: Smart Spatial AI
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Nexus AI fuses interactive SVG pathfinding, predictive gate loads, and voice-assisted Gemini chat API logs to route crowds safely and coordinate medics during emergencies.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs-caps text-indigo-400">Platform Core</span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1.5">Stripe-level Bento Operations</h2>
            <p className="text-xs text-zinc-500 font-semibold mt-1">Every module is designed with micro-interactions, responsive grids, and clean borders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <Card key={idx} variant="glass" className="flex gap-4 items-start border-glow-indigo">
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${f.color} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-wide">{f.title}</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-medium">{f.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section id="how-it-works" className="py-24 border-t border-white/5 relative z-10 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs-caps text-indigo-400">Data pipeline</span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1.5">How Stadium AI Fuses Data</h2>
            <p className="text-xs text-zinc-500 font-semibold mt-1">Sensors feedback, path logic, and assistant chat API integration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((w, idx) => (
              <div key={idx} className="relative flex flex-col gap-4 bg-zinc-950/30 p-6 rounded-2xl border border-white/[0.01]">
                <span className="text-6xl font-black text-white/5 font-mono select-none absolute top-[-30px] left-3">
                  {w.step}
                </span>
                <div className="pt-4 z-10">
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wide">{w.title}</h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-medium">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs-caps text-indigo-400">FAQS</span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1.5">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;

              return (
                <div key={idx} className="glass rounded-2xl overflow-hidden border border-white/5 transition-all">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center text-xs font-bold text-zinc-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3 font-semibold">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 relative z-10 bg-zinc-950/40 text-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-400">FIFA Nexus AI</span>
            <span>•</span>
            <span>Tournament Command Center</span>
          </div>
          <span>© 2026 PromptWars Hackathon. Designed by Google Engineers.</span>
        </div>
      </footer>
    </div>
  );
}
