"use client";

import { ArrowLeft, Home, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LiveMatch from "@/components/match/LiveMatch";
import StatsPanel from "@/components/match/StatsPanel";
import { useGameStore } from "@/lib/store";

export default function LiveMatchPage() {
  const router = useRouter();
  const { matchMinute, resetMatchState, completeMatchAndAdvance, match, currentScore } = useGameStore();
  const [showStats, setShowStats] = useState(false);
  const isFinished = matchMinute >= 90;

  const handleBack = () => {
    if (isFinished) {
      completeMatchAndAdvance(currentScore[0], currentScore[1]);
    } else {
      resetMatchState();
    }
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0c0c12] border-b border-white/[0.06] z-40">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isFinished 
              ? "bg-green-600 text-white" 
              : "bg-[#14141e] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-[#1a1a28]"
          }`}
        >
          {isFinished ? <Home size={16} /> : <ArrowLeft size={16} />}
          <span className="hidden sm:inline">{isFinished ? "Continue" : "Exit"}</span>
        </motion.button>

        <div className="flex items-center gap-2">
          {match && (
            <span className="text-xs text-slate-500">
              {match.home.shortName} vs {match.away.shortName}
            </span>
          )}
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
            isFinished ? "bg-yellow-500/15 text-yellow-500" : "bg-green-500/15 text-green-500"
          }`}>
            {isFinished ? "Full Time" : "Live"}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#14141e] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-[#1a1a28] transition-colors"
        >
          <BarChart2 size={16} />
          <span className="hidden sm:inline text-sm">Stats</span>
        </motion.button>
      </header>

      {/* Main Content */}
      <LiveMatch />

      {/* Stats Panel Overlay */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setShowStats(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#14141e] rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto border-t border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Match Statistics</h3>
              <button 
                onClick={() => setShowStats(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <StatsPanel inline />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
