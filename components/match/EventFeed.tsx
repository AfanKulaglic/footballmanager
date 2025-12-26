"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";

const eventConfig: Record<string, { icon: string; color: string; bg: string }> = {
  goal: { icon: "⚽", color: "text-green-500", bg: "bg-green-500/10 border-green-500/20" },
  yellow_card: { icon: "🟨", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  red_card: { icon: "🟥", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
  chance: { icon: "🎯", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  corner: { icon: "🚩", color: "text-slate-400", bg: "bg-[#1a1a28] border-white/[0.04]" },
  foul: { icon: "⚠️", color: "text-slate-400", bg: "bg-[#1a1a28] border-white/[0.04]" },
  save: { icon: "🧤", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
};

export default function EventFeed() {
  const { displayedEvents, match, matchMinute } = useGameStore();
  const events = [...displayedEvents].reverse().slice(0, 15);

  return (
    <div className="h-full flex flex-col bg-[#14141e] border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a28] border-b border-white/[0.04]">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">Events</span>
        <span className="text-[11px] font-bold text-green-500">{matchMinute}'</span>
      </div>

      {/* Events */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence mode="popLayout">
          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-8"
            >
              <span className="text-3xl mb-2">⚽</span>
              <p className="text-sm text-slate-500">Match starting...</p>
              <p className="text-[11px] text-slate-600 mt-1">Events will appear here</p>
            </motion.div>
          ) : (
            events.map((event, idx) => {
              const config = eventConfig[event.type] || { icon: "📋", color: "text-slate-400", bg: "bg-[#1a1a28] border-white/[0.04]" };
              const isGoal = event.type === "goal";
              
              return (
                <motion.div
                  key={`${event.minute}-${event.type}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border ${config.bg} ${isGoal ? "ring-1 ring-green-500/30" : ""}`}
                >
                  <span className="text-lg flex-shrink-0">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isGoal ? "bg-green-500 text-white" : "bg-[#12121a] text-slate-400"
                      }`}>
                        {event.minute}'
                      </span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                        event.team === "home" ? "bg-slate-700 text-slate-300" : "bg-red-900/50 text-red-300"
                      }`}>
                        {event.team === "home" ? match?.home.shortName : match?.away.shortName}
                      </span>
                    </div>
                    <p className="text-[11px] leading-tight text-slate-400">{event.description}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
