"use client";

import { Dumbbell, Zap, Shield, Target, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { useGameStore } from "@/lib/store";

const trainingTypes = [
  { id: 1, name: "Physical", desc: "Strength & Stamina", icon: Dumbbell, color: "#f97316", intensity: 80 },
  { id: 2, name: "Technical", desc: "Ball Control & Passing", icon: Target, color: "#3b82f6", intensity: 65 },
  { id: 3, name: "Tactical", desc: "Positioning & Movement", icon: Shield, color: "#8b5cf6", intensity: 70 },
  { id: 4, name: "Set Pieces", desc: "Corners & Free Kicks", icon: Zap, color: "#22c55e", intensity: 50 },
];

const weekDays = [
  { day: "M", status: "done" },
  { day: "T", status: "done" },
  { day: "W", status: "current" },
  { day: "T", status: "upcoming" },
  { day: "F", status: "upcoming" },
  { day: "S", status: "rest" },
  { day: "S", status: "rest" },
];

export default function TrainingPage() {
  const { club } = useGameStore();

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      <PageHeader title="Training" subtitle="Improve your squad" />

      <div className="flex-1 px-4 pb-24 space-y-4 pt-4">
        {/* Weekly Schedule */}
        <div className="p-4 rounded-xl bg-[#14141e] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-green-500" />
            <span className="text-xs font-semibold text-slate-300">This Week</span>
          </div>
          <div className="flex gap-1.5">
            {weekDays.map((item, i) => (
              <div
                key={i}
                className={`flex-1 py-2.5 rounded-lg text-center text-[11px] font-semibold transition-all ${
                  item.status === "current" 
                    ? "bg-green-500 text-white" 
                    : item.status === "done" 
                      ? "bg-green-500/15 text-green-500" 
                      : item.status === "rest"
                        ? "bg-[#12121a] text-slate-700"
                        : "bg-[#1a1a28] text-slate-500"
                }`}
              >
                {item.day}
              </div>
            ))}
          </div>
        </div>

        {/* Squad Fitness */}
        <div className="p-4 rounded-xl bg-[#14141e] border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-xs font-semibold text-slate-300">Squad Fitness</span>
            </div>
            <span className="text-xl font-bold text-green-500">78%</span>
          </div>
          <div className="h-2 bg-[#12121a] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full"
            />
          </div>
        </div>

        {/* Training Focus */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1 h-3 bg-green-500 rounded-full" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Training Focus
            </span>
          </div>
          <div className="space-y-2">
            {trainingTypes.map((training, index) => (
              <motion.div
                key={training.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-[#14141e] border border-white/[0.06] hover:bg-[#1a1a28] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${training.color}15` }}
                  >
                    <training.icon size={20} style={{ color: training.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{training.name}</p>
                    <p className="text-[10px] text-slate-600">{training.desc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-[#12121a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: training.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${training.intensity}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">{training.intensity}%</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-[#1a1a28] border border-white/[0.06] text-[11px] font-medium text-slate-500 hover:bg-[#1f1f2e] hover:text-white transition-colors">
                    Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
