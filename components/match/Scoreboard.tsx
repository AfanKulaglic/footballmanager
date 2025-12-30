"use client";

import { motion } from "framer-motion";
import { Clock, Activity } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import ClubLogo from "../ClubLogo";

export default function Scoreboard() {
  const { match } = useGameStore();
  const { getDisplayName } = useClubNames();

  if (!match) return null;

  return (
    <div className="bg-gradient-to-b from-panel to-transparent px-6 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Match info */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Activity size={14} className="text-green" />
          <span className="text-xs text-muted uppercase tracking-widest">Super Liga • Matchday 16</span>
        </div>

        <div className="flex items-center justify-between">
          {/* Home Team */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 flex-1"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 shadow-xl">
              <ClubLogo clubId={match.home.id} size={48} />
            </div>
            <div>
              <p className="text-lg font-bold">{getDisplayName(match.home.id, match.home.name)}</p>
              <p className="text-xs text-muted">Home</p>
            </div>
          </motion.div>

          {/* Score */}
          <div className="flex flex-col items-center px-8">
            <div className="flex items-center gap-6">
              <motion.span
                key={match.homeScore}
                initial={{ scale: 1.5, color: "#22C55E" }}
                animate={{ scale: 1, color: "#E5E7EB" }}
                className="text-6xl font-extrabold"
              >
                {match.homeScore}
              </motion.span>
              <div className="flex flex-col items-center">
                <span className="text-2xl text-muted">:</span>
              </div>
              <motion.span
                key={match.awayScore}
                initial={{ scale: 1.5, color: "#22C55E" }}
                animate={{ scale: 1, color: "#E5E7EB" }}
                className="text-6xl font-extrabold"
              >
                {match.awayScore}
              </motion.span>
            </div>
            
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2 mt-3 bg-green/20 border border-green/30 px-4 py-1.5 rounded-full"
            >
              <span className="w-2 h-2 bg-green rounded-full" />
              <Clock size={14} className="text-green" />
              <span className="text-sm font-bold text-green">{match.minute}&apos;</span>
            </motion.div>
          </div>

          {/* Away Team */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 flex-1 justify-end"
          >
            <div className="text-right">
              <p className="text-lg font-bold">{getDisplayName(match.away.id, match.away.name)}</p>
              <p className="text-xs text-muted">Away</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center border border-white/10 shadow-xl">
              <ClubLogo clubId={match.away.id} size={48} />
            </div>
          </motion.div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-white/5">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{match.possession[0]}%</p>
            <p className="text-[10px] text-muted uppercase tracking-wider">Possession</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold">{match.xg[0].toFixed(2)}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider">xG</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold">{match.shots[0]}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider">Shots</p>
          </div>
        </div>
      </div>
    </div>
  );
}
