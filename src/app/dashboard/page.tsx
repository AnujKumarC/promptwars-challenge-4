"use client";

import React, { useState } from "react";
import { useAppState, UserRole } from "@/context/AppStateContext";
import { AdminView } from "@/components/dashboard/AdminView";
import { FanView } from "@/components/dashboard/FanView";
import { VolunteerView } from "@/components/dashboard/VolunteerView";
import { SecurityView } from "@/components/dashboard/SecurityView";
import { MedicalView } from "@/components/dashboard/MedicalView";
import { 
  Users, UserCheck, ShieldAlert, HeartPulse, LayoutDashboard, 
  Bell, Sun, Flame, LogOut, Menu, X 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { 
    userRole, 
    setUserRole, 
    userName, 
    isLoggedIn, 
    logout, 
    activeEmergency, 
    notifications
  } = useAppState();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }, [isLoggedIn, router]);

  const renderDashboardContent = () => {
    switch (userRole) {
      case "fan":
        return <FanView />;
      case "volunteer":
        return <VolunteerView />;
      case "security":
        return <SecurityView />;
      case "medical":
        return <MedicalView />;
      case "organizer":
      case "admin":
      default:
        return <AdminView />;
    }
  };

  const getRoleHeader = () => {
    switch (userRole) {
      case "fan":
        return { title: "Fan Operations Portal", tag: "Guest Hub" };
      case "volunteer":
        return { title: "Volunteer Task Command", tag: "Staff Grid" };
      case "security":
        return { title: "Security Command Deck", tag: "Surveillance Active" };
      case "medical":
        return { title: "Triage Dispatch Hub", tag: "ER Direct" };
      case "admin":
      default:
        return { title: "Global Command Center", tag: "Admin Grid" };
    }
  };

  const menuItems: { role: UserRole; label: string; icon: any }[] = [
    { role: "admin", label: "Admin Console", icon: LayoutDashboard },
    { role: "fan", label: "Fan Portal", icon: Users },
    { role: "volunteer", label: "Volunteer Grid", icon: UserCheck },
    { role: "security", label: "Security CCTV", icon: ShieldAlert },
    { role: "medical", label: "Triage Dispatch", icon: HeartPulse },
  ];

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const unreadNotifs = notifications.length;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex relative font-sans">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden absolute top-4 left-4 z-50 p-2 rounded-xl glass border-zinc-800 text-zinc-300"
      >
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass border-r border-white/[0.03] flex flex-col justify-between p-6 z-40 transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-600 to-rose-500 flex items-center justify-center font-black text-white text-xs">
              FN
            </div>
            <div>
              <span className="font-extrabold text-xs tracking-wide block uppercase">FIFA Nexus AI</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">World Cup 2026</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5">
            <span className="text-[8px] uppercase font-bold tracking-wider text-zinc-500 mb-2 pl-3">Dashboard viewports</span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = userRole === item.role;

              return (
                <button
                  key={item.role}
                  onClick={() => {
                    setUserRole(item.role);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                    isActive
                      ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-300 shadow-sm"
                      : "border-transparent text-zinc-400 hover:bg-white/[0.02] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context card */}
        <div className="flex flex-col gap-3">
          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.02] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 font-black text-xs text-zinc-300">
              {userName ? userName.charAt(0) : "U"}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-zinc-200 block truncate">{userName || "Alex Rivera"}</span>
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block mt-0.5 truncate">{userRole}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-h-screen flex flex-col p-4 sm:p-8 lg:p-10 lg:pl-6 overflow-x-hidden">
        
        {/* Top Operations Panel */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pt-10 lg:pt-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-850 text-indigo-400">
                {getRoleHeader().tag}
              </span>
              {activeEmergency !== "none" && (
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950/40 border border-red-500/20 text-red-400 animate-pulse flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 animate-bounce" /> Evacuation route active
                </span>
              )}
            </div>
            <h1 className="text-xl font-black tracking-tight text-white mt-1.5 uppercase">{getRoleHeader().title}</h1>
          </div>

          <div className="flex items-center gap-3 justify-end self-end sm:self-auto font-mono">
            {/* Weather */}
            <div className="glass px-3.5 py-2 rounded-xl border-white/5 flex items-center gap-2 text-[10px] font-bold text-zinc-300 uppercase">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span>Clear Sky • 24°C</span>
            </div>

            {/* Notification alert dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl glass border-zinc-800 text-zinc-300 hover:text-white relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center animate-pulse border border-[#09090b]">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-50">
                  <div className="bg-zinc-900/60 p-3.5 border-b border-white/5 flex justify-between items-center text-xs font-bold">
                    <span className="text-zinc-200">Alert Center</span>
                    <span className="text-zinc-500">{unreadNotifs} active</span>
                  </div>
                  <div className="flex flex-col max-h-[250px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500">No active alerts.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-3 border-b border-white/5 hover:bg-white/5 flex gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            notif.type === "error" ? "bg-red-500 animate-ping" : notif.type === "warning" ? "bg-orange-500" : "bg-indigo-500"
                          }`} />
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">{notif.title}</span>
                            <span className="text-[10px] text-zinc-400 mt-0.5 block leading-relaxed font-semibold">{notif.message}</span>
                            <span className="text-[8px] text-zinc-500 mt-1 block font-mono font-bold">{notif.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick switcher preview tool */}
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-indigo-500 outline-none font-bold cursor-pointer"
            >
              <option value="admin">Preview Admin</option>
              <option value="fan">Preview Fan</option>
              <option value="volunteer">Preview Volunteer</option>
              <option value="security">Preview Security</option>
              <option value="medical">Preview Medical</option>
            </select>
          </div>
        </header>

        {/* Dynamic viewport view render */}
        <div className="flex-1 flex flex-col">
          {renderDashboardContent()}
        </div>

      </main>
    </div>
  );
}
