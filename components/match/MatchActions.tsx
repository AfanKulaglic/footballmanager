"use client";

import { motion } from "framer-motion";
import { Play, Pause, SkipForward, Gauge } from "lucide-react";
import { useGameStore } from "@/lib/store";
import MatchTactics from "./MatchTactics";

export default function MatchActions() {
  const { matchSpeed, isPaused, setMatchSpeed, togglePause, updateMatchMinute, updateOtherMatchesMinute, matchMinute } = useGameStore();

  const speeds = [1, 2, 4];

  const handleSpeedChange = () => {
    const currentIndex = speeds.indexOf(matchSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setMatchSpeed(speeds[nextIndex]);
  };

  const handleSkipToEnd = () => {
    updateMatchMinute(90);
    updateOtherMatchesMinute(90);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Match Controls</h3>
        <span className={`text-[10px] font-bold px-2 py-1 rounded ${isPaused ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
          {isPaused ? "⏸ PAUSED" : "▶ PLAYING"}
        </span>
      </div>

      {/* Main Controls Row */}
      <div className="flex items-center justify-center gap-3">
        {/* Tactics - Large Prominent Button */}
        <MatchTactics />

        {/* Speed Control */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSpeedChange}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0f0f18] border border-white/[0.08] hover:bg-[#14141e] hover:border-white/[0.12] transition-all"
        >
          <Gauge size={16} className="text-blue-400" />
          <span className="text-sm font-bold text-blue-400">{matchSpeed}x</span>
        </motion.button>

        {/* Play/Pause - Central Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={togglePause}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isPaused 
              ? "bg-gradient-to-b from-green-500 to-green-600 shadow-green-500/30" 
              : "bg-gradient-to-b from-yellow-500 to-yellow-600 shadow-yellow-500/30"
          }`}
        >
          {isPaused ? (
            <Play size={22} fill="white" className="ml-0.5 text-white" />
          ) : (
            <Pause size={22} className="text-white" />
          )}
        </motion.button>

        {/* Skip to End */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSkipToEnd}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0f0f18] border border-white/[0.08] hover:bg-[#14141e] hover:border-white/[0.12] transition-all"
        >
          <SkipForward size={16} className="text-slate-400" />
          <span className="text-sm text-slate-400">End</span>
        </motion.button>
      </div>
    </div>
  );
}
