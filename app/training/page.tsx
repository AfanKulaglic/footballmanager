"use client";

import Link from "next/link";
import { ArrowLeft, Dumbbell, Zap, Shield, Target, Calendar, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import ClubLogo from "@/components/ClubLogo";
import { useGameStore } from "@/lib/store";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <div className="w-1 h-3 bg-green-500 rounded-full" />
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
        {children}
      </span>
    </div>
  );
}

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
  const { club, squad } = useGameStore();
  
  // Calculate average squad fitness (mock)
  const avgFitness = 78;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0c0c12]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-[#14141e] border border-white/[0.06] hover:bg-[#1a1a28] transition-colors"
            >
              <ArrowLeft size={18} className="text-slate-400" />
            </motion.button>
          </Link>
          <ClubLogo clubId={club.id} size={36} />
          <div>
            <h1 className="text-lg font-bold text-white">Training</h1>
            <p className="text-[10px] text-slate-500">Improve your squad</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 space-y-4 pt-4">
        {/* Weekly Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>This Week</SectionLabel>
          <div className="p-4 rounded-xl bg-[#14141e] border border-white/[0.06]">
            <div className="flex gap-1.5">
              {weekDays.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex-1 py-2.5 rounded-lg text-center text-[11px] font-semibold transition-all ${
                    item.status === "current" 
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
                      : item.status === "done" 
                        ? "bg-green-500/15 text-green-500" 
                        : item.status === "rest"
                          ? "bg-[#0a0a0f] text-slate-700"
                          : "bg-[#1a1a28] text-slate-500"
                  }`}
                >
                  {item.day}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Squad Fitness */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionLabel>Squad Fitness</SectionLabel>
          <div className="p-4 rounded-xl bg-[#14141e] border border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center">
                  <TrendingUp size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Overall Fitness</p>
                  <p className="text-[10px] text-slate-500">{squad.length} players in squad</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-500">{avgFitness}%</span>
            </div>
            <div className="h-2.5 bg-[#0a0a0f] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${avgFitness}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Training Focus */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <SectionLabel>Training Focus</SectionLabel>
          <div className="space-y-2">
            {trainingTypes.map((training, index) => (
              <motion.div
                key={training.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="p-4 rounded-xl bg-[#14141e] border border-white/[0.06] hover:bg-[#1a1a28] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${training.color}15` }}
                  >
                    <training.icon size={22} style={{ color: training.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{training.name}</p>
                    <p className="text-[10px] text-slate-500">{training.desc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-[#0a0a0f] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: training.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${training.intensity}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">{training.intensity}%</span>
                    </div>
                  </div>
                  <button className="px-3 py-2 rounded-xl bg-[#1a1a28] border border-white/[0.06] text-[11px] font-medium text-slate-400 hover:bg-[#1f1f2e] hover:text-white transition-colors">
                    Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Session */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionLabel>Next Session</SectionLabel>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Clock size={22} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Thursday Training</p>
                <p className="text-[10px] text-slate-400">Technical focus • 2 hours</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-semibold"
              >
                Start
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
