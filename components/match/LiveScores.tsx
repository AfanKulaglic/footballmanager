"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import ClubLogo from "../ClubLogo";
import { useState } from "react";
import { ChevronDown, ChevronUp, Radio } from "lucide-react";

export default function LiveScores() {
  const { liveOtherMatches, matchMinute } = useGameStore();
  const [expanded, setExpanded] = useState(true);
  const isFinished = matchMinute >= 90;

  if (liveOtherMatches.length === 0) {
    return null;
  }

  const allRecentEvents = liveOtherMatches
    .flatMap(match => 
      match.events
        .filter(e => e.minute <= matchMinute && e.minute > matchMinute - 5)
        .map(e => ({ ...e, matchId: match.id, home: match.home, away: match.away }))
    )
    .sort((a, b) => b.minute - a.minute)
    .slice(0, 3);

  return (
    <div className="bg-[#14141e] border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#1a1a28] border-b border-white/[0.04] hover:bg-[#1f1f2e] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Radio size={10} className="text-red-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
            Live Scores
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#12121a] text-slate-500">
            {liveOtherMatches.length}
          </span>
        </div>
        {expanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Matches */}
            <div className="p-2 space-y-1 max-h-[180px] overflow-y-auto">
              {liveOtherMatches.map((match) => {
                const recentGoal = match.events.find(
                  e => e.type === "goal" && e.minute <= matchMinute && e.minute > matchMinute - 3
                );
                
                return (
                  <motion.div
                    key={match.id}
                    layout
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      recentGoal ? "bg-green-500/10 ring-1 ring-green-500/30" : "bg-[#12121a]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <ClubLogo clubId={match.home.id} size={16} />
                      <span className="text-[10px] font-medium text-slate-400 truncate">{match.home.shortName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2">
                      <motion.span
                        key={`h-${match.id}-${match.homeScore}`}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold text-white w-4 text-center font-display"
                      >
                        {match.homeScore}
                      </motion.span>
                      <span className="text-slate-600 text-[10px]">-</span>
                      <motion.span
                        key={`a-${match.id}-${match.awayScore}`}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold text-white w-4 text-center font-display"
                      >
                        {match.awayScore}
                      </motion.span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                      <span className="text-[10px] font-medium text-slate-400 truncate">{match.away.shortName}</span>
                      <ClubLogo clubId={match.away.id} size={16} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Events */}
            {allRecentEvents.length > 0 && (
              <div className="border-t border-white/[0.04] p-2">
                <div className="space-y-1">
                  {allRecentEvents.map((event, idx) => (
                    <motion.div
                      key={`${event.matchId}-${event.minute}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-[10px]"
                    >
                      <span className="text-slate-600 font-mono w-4">{event.minute}'</span>
                      <span className="px-1 py-0.5 rounded text-[9px] font-semibold bg-[#1a1a28] text-slate-400">
                        {event.team === "home" ? event.home.shortName : event.away.shortName}
                      </span>
                      <span className="text-slate-500 truncate">{event.description}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="px-3 py-1.5 bg-[#12121a] text-center">
              <span className={`text-[10px] font-semibold ${isFinished ? "text-yellow-500" : "text-green-500"}`}>
                {isFinished ? "FULL TIME" : `${matchMinute}' LIVE`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
