"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { 
  Utensils, MapPin, Bus, Navigation, Star, 
  Accessibility, Check, Sparkles, UserCheck 
} from "lucide-react";

export const FanView: React.FC = () => {
  const {
    foodItems,
    foodOrders,
    placeFoodOrder,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    screenReader,
    setScreenReader,
    theme,
    setTheme
  } = useAppState();

  const [dietFilter, setDietFilter] = useState<string>("All");
  const [selectedFood, setSelectedFood] = useState<any>(null);

  const diets = ["All", "Veg", "Vegan", "Halal", "Jain"];
  
  const filteredFood = dietFilter === "All" 
    ? foodItems 
    : foodItems.filter(item => item.category === dietFilter);

  // Transit schedules
  const transitSchedules = [
    { type: "Metro", route: "Red Line Terminal West", wait: "4 mins", status: "On Time", accessibility: "Ramp Active" },
    { type: "Bus Shuttle", route: "Parking Block B to Entrance A", wait: "7 mins", status: "Minor Delay", accessibility: "Low Floor" },
    { type: "Express Ride", route: "VIP Taxi Bay", wait: "2 mins", status: "Available", accessibility: "Assistive Boarding" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Welcome Fan Banner */}
      <Card variant="glow" hoverEffect={false} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-indigo-900/20 -z-10" />
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              FIFA Nexus Fan Portal
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Your personalized match guide for USA vs England at FIFA Nexus Arena.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-950/40 border border-blue-500/20 text-blue-300">
              Seat: Sector 102
            </span>
          </div>
        </div>
      </Card>

      {/* Embedded Map */}
      <InteractiveMap />

      {/* Grid of Food AI and Transit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Food AI Stalls */}
        <Card variant="glass" hoverEffect={false} className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-400" />
                  Food AI Stall Recommendations
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Crowd-optimized menu order. Quick delivery stalls.</p>
              </div>
            </div>

            {/* Diet Filters */}
            <div className="flex gap-1.5 overflow-x-auto mb-4 pb-2 scrollbar-none">
              {diets.map((d) => (
                <button
                  key={d}
                  onClick={() => setDietFilter(d)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    dietFilter === d
                      ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "glass border-slate-700 text-slate-300 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Food Items List */}
            <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {filteredFood.map((food) => (
                <div
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedFood?.id === food.id
                      ? "bg-orange-950/20 border-orange-500/40"
                      : "glass border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{food.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {food.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">{food.stall}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-200 block">${food.price}</span>
                      <span className="text-[10px] text-slate-400 block">{food.waitTime}m wait</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-yellow-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {food.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Place Order Block */}
          {selectedFood && (
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Selected: <span className="font-bold text-white">{selectedFood.name}</span>
              </div>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => {
                  placeFoodOrder(selectedFood.name, selectedFood.price, selectedFood.waitTime);
                  setSelectedFood(null);
                }}
              >
                Place Order (${selectedFood.price})
              </Button>
            </div>
          )}

          {/* Active Orders List */}
          {foodOrders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">My Orders</span>
              <div className="flex flex-col gap-2">
                {foodOrders.map((ord) => (
                  <div key={ord.id} className="p-2.5 rounded-lg glass border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white block">{ord.name}</span>
                      <span className="text-[10px] text-slate-500">Order ID: #{ord.id.slice(-4)}</span>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        ord.status === "ready" ? "bg-emerald-950 text-emerald-300" : "bg-orange-950 text-orange-300"
                      }`}>
                        {ord.status === "ready" ? "Ready" : "Preparing"}
                      </span>
                      {ord.status === "preparing" && (
                        <span className="block text-[10px] text-slate-400 mt-1">{ord.waitTime} mins left</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Live Transit & Transport */}
        <Card variant="glass" hoverEffect={false} className="flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-1">
              <Bus className="w-4 h-4 text-blue-400" />
              Live Transit Schedules
            </h4>
            <p className="text-xs text-slate-400 mb-4">Optimized transit times for crowd safety departures.</p>

            <div className="flex flex-col gap-3">
              {transitSchedules.map((tr, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/20 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{tr.type}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{tr.route}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-black text-slate-100">{tr.wait}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      tr.status === "On Time" || tr.status === "Available" 
                        ? "bg-emerald-950 text-emerald-300" 
                        : "bg-red-950 text-red-300"
                    }`}>
                      {tr.status}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold">{tr.accessibility}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Settings Quick Panel */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Accessibility className="w-3.5 h-3.5 text-indigo-400" />
              Accessibility Assistive Controls
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-2 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                  highContrast 
                    ? "bg-indigo-600 border-indigo-500 text-white" 
                    : "glass border-slate-700 text-slate-300"
                }`}
              >
                High Contrast: {highContrast ? "ON" : "OFF"}
              </button>
              <button
                onClick={() => setScreenReader(!screenReader)}
                className={`p-2 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                  screenReader 
                    ? "bg-indigo-600 border-indigo-500 text-white animate-pulse" 
                    : "glass border-slate-700 text-slate-300"
                }`}
              >
                Screen Reader Speech: {screenReader ? "ON" : "OFF"}
              </button>
              
              <div className="col-span-2 flex items-center justify-between mt-1 gap-2">
                <span className="text-[10px] text-slate-400 font-bold">FONT SCALING:</span>
                <div className="flex gap-1.5">
                  {(["normal", "large", "xlarge"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase border transition-all ${
                        fontSize === sz 
                          ? "bg-blue-600 border-blue-500 text-white" 
                          : "glass border-slate-700 text-slate-400"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FanView;
