"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, UserRole } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnimatedGradient } from "@/components/ui/AnimatedGradient";
import { 
  Lock, Mail, ArrowRight, ShieldCheck, 
  Users, ShieldAlert, HeartPulse, User, 
  Settings, KeyRound, Smartphone 
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAppState();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter a valid email address");
      return;
    }
    setStep(2);
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val !== "" && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleStep2Verify = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleRoleSubmit = () => {
    login(email || "alex.rivera@nexus.ai", selectedRole);
    router.push("/dashboard");
  };

  const rolesList: { role: UserRole; title: string; desc: string; icon: any; color: string }[] = [
    { role: "fan", title: "Match Fan", desc: "Access food orders, wheelchair routes, seats & maps.", icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { role: "volunteer", title: "Field Volunteer", desc: "Track tasks, register attendance & collect performance scores.", icon: User, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { role: "security", title: "Security Officer", desc: "Report incidents, view restricted area cameras & face logs.", icon: ShieldAlert, color: "text-red-400 bg-red-500/10 border-red-500/20" },
    { role: "medical", title: "Medical Staff", desc: "Manage triage emergency queues & dispatch ambulance tracking.", icon: HeartPulse, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { role: "admin", title: "Global Administrator", desc: "Command center overview, statistics, sustainability tracker.", icon: Settings, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#09090b]">
      <AnimatedGradient />

      {/* Auth Container Card */}
      <Card variant="glass-premium" hoverEffect={false} className="w-full max-w-lg shadow-2xl relative border-white/5 p-8 sm:p-10 bg-zinc-950/60 backdrop-blur-2xl">
        
        {/* Step Indicator */}
        <div className="flex justify-center gap-1.5 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all duration-300 ${
                step === s ? "w-6 bg-indigo-500" : "w-1.5 bg-zinc-800"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Login Credentials */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-black tracking-tight text-white uppercase">Initialize Neural Link</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">FIFA World Cup 2026 Operations Console</p>
            </div>

            {forgotPassword ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-zinc-400 font-semibold">Enter your email and we will send a password reset code.</p>
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 items-center gap-2.5">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="Enter registration email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs text-zinc-200 flex-1 w-full font-semibold"
                  />
                </div>
                <Button variant="primary" onClick={() => setForgotPassword(false)}>
                  Send Reset Code
                </Button>
                <button onClick={() => setForgotPassword(false)} className="text-xs text-zinc-500 hover:text-zinc-300 mt-1 text-center font-bold">
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Email Address</label>
                  <div className="flex bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2.5 items-center gap-2.5 focus-within:border-indigo-500/40 transition-colors">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="alex.rivera@nexus.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-zinc-200 flex-1 w-full font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Credentials Password</label>
                    <button type="button" onClick={() => setForgotPassword(true)} className="text-[10px] text-indigo-400 font-bold hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <div className="flex bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2.5 items-center gap-2.5 focus-within:border-indigo-500/40 transition-colors">
                    <Lock className="w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-zinc-200 flex-1 w-full font-semibold"
                    />
                  </div>
                </div>

                <Button type="submit" variant="gradient" className="w-full mt-2 py-3 flex gap-2 justify-center items-center">
                  Request Access Key <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Google Sign-in Mock */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-zinc-600 font-bold uppercase tracking-wider">or authenticate with</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <Button
                  type="button"
                  variant="glass"
                  className="w-full flex items-center justify-center gap-2 py-2.5"
                  onClick={() => {
                    setEmail("google.rivera@gmail.com");
                    setStep(2);
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Connect Google SSO
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                Dual-Factor OTP
              </h2>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-1">We sent a 4-digit verification code to your device</p>
            </div>

            <form onSubmit={handleStep2Verify} className="flex flex-col gap-6">
              {/* Digit fields */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-lg font-black text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <Button type="submit" variant="primary" className="w-full py-3 flex gap-2 justify-center items-center">
                  Verify Credentials <KeyRound className="w-4 h-4" />
                </Button>
                <button
                  type="button"
                  onClick={() => setOtp(["1", "2", "3", "4"])}
                  className="text-xs text-zinc-500 hover:text-zinc-300 font-bold text-center mt-1"
                >
                  Resend code (Simulate Fill "1234")
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Profile Setup & Role Selection */}
        {step === 3 && (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-xl font-black tracking-tight text-white uppercase">Define Operations Role</h2>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Select permission layer to initialize the command dashboard</p>
            </div>

            {/* Profile display */}
            <div className="mb-4 bg-zinc-900/60 border border-zinc-850 rounded-2xl px-4 py-3 flex items-center gap-3">
              <User className="w-4.5 h-4.5 text-zinc-400" />
              <div>
                <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">ACTIVE USER PROFILE</span>
                <span className="text-xs font-bold text-zinc-200">{email ? email.split("@")[0] : "Alex Rivera"}</span>
              </div>
            </div>

            {/* Roles list */}
            <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {rolesList.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.role;

                return (
                  <div
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                      isSelected
                        ? "bg-indigo-950/20 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                        : "glass border-zinc-850 hover:border-zinc-800"
                    }`}
                  >
                    <div className={`p-2 rounded-xl border ${r.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-200 flex items-center gap-2 uppercase tracking-tight">
                        {r.title}
                        {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-0.5 leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleRoleSubmit} variant="gradient" className="w-full mt-5 py-3.5 flex gap-2 justify-center items-center font-bold">
              Enter Operations Command <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

      </Card>
    </div>
  );
}
