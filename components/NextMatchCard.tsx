"use client";

import { Play, Calendar, Home, Plane } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ClubLogo from "./ClubLogo";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";

export default function NextMatchCard() {
  const router = useRouter();
  const { match, resetMatchState, currentMatchday, club } = useGameStore();
  const { getDisplayName } = useClubNames();

  if (!match) {
    return (
      <div className="bg-[#14141e] border border-white/[0.06] rounded-xl p-6">
        <div className="text-center py-8">
          <p className="text-slate-400 font-medium">Season Complete!</p>
          <p className="text-sm text-slate-600 mt-1">No more matches scheduled</p>
        </div>
      </div>
    );
  }

  const handlePlayMatch = () => {
    resetMatchState();
    router.push("/match/live");
  };

  const isHome = match.home.id === club.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#14141e] border border-white/[0.06] rounded-xl overflow-hidden"
    >
      {/* Stadium Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#14141e] via-[#14141e]/80 to-[#14141e]/40" />
      
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a28]/80 backdrop-blur-sm border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            {isHome ? (
              <Home size={12} className="text-green-500" />
            ) : (
              <Plane size={12} className="text-orange-500" />
            )}
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
              {isHome ? "Home" : "Away"} Match
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-bold">
            <Calendar size={10} />
            MD {currentMatchday}
          </div>
        </div>

        {/* Match Info */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <ClubLogo clubId={match.home.id} size={56} />
              <span className={`text-sm font-semibold text-center leading-tight ${
                match.home.id === club.id ? "text-green-500" : "text-white"
              }`}>
                {getDisplayName(match.home.id, match.home.name)}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">Home</span>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-2xl font-bold text-slate-400 font-display">VS</span>
              <span className="text-[10px] text-slate-500 bg-[#1a1a28]/80 px-2 py-0.5 rounded">
                Today 20:00
              </span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <ClubLogo clubId={match.away.id} size={56} />
              <span className={`text-sm font-semibold text-center leading-tight ${
                match.away.id === club.id ? "text-green-500" : "text-white"
              }`}>
                {getDisplayName(match.away.id, match.away.name)}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">Away</span>
            </div>
          </div>

          {/* Play Button */}
          <motion.button 
            onClick={handlePlayMatch}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="mt-5 w-full bg-gradient-to-r from-green-600 to-green-500 py-3.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all"
          >
            <Play size={18} fill="white" />
            Play Match
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
