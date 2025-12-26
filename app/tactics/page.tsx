"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Swords, Users, Target, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ClubLogo from "@/components/ClubLogo";
import { useGameStore } from "@/lib/store";
import { generateSquadForClub } from "@/lib/mock";
import { Player } from "@/lib/types";

// Formation definitions
const formations: Record<string, { style: string; positions: { x: number; y: number }[] }> = {
  "4-3-3": {
    style: "Attacking",
    positions: [
      { x: 50, y: 8 }, { x: 15, y: 28 }, { x: 38, y: 22 }, { x: 62, y: 22 }, { x: 85, y: 28 },
      { x: 28, y: 48 }, { x: 50, y: 42 }, { x: 72, y: 48 },
      { x: 18, y: 72 }, { x: 50, y: 82 }, { x: 82, y: 72 },
    ],
  },
  "4-4-2": {
    style: "Balanced",
    positions: [
      { x: 50, y: 8 }, { x: 15, y: 28 }, { x: 38, y: 22 }, { x: 62, y: 22 }, { x: 85, y: 28 },
      { x: 15, y: 52 }, { x: 38, y: 48 }, { x: 62, y: 48 }, { x: 85, y: 52 },
      { x: 38, y: 80 }, { x: 62, y: 80 },
    ],
  },
  "4-2-3-1": {
    style: "Control",
    positions: [
      { x: 50, y: 8 }, { x: 15, y: 28 }, { x: 38, y: 22 }, { x: 62, y: 22 }, { x: 85, y: 28 },
      { x: 38, y: 42 }, { x: 62, y: 42 },
      { x: 20, y: 62 }, { x: 50, y: 65 }, { x: 80, y: 62 }, { x: 50, y: 85 },
    ],
  },
  "3-5-2": {
    style: "Wing Play",
    positions: [
      { x: 50, y: 8 }, { x: 28, y: 22 }, { x: 50, y: 18 }, { x: 72, y: 22 },
      { x: 10, y: 52 }, { x: 32, y: 48 }, { x: 50, y: 42 }, { x: 68, y: 48 }, { x: 90, y: 52 },
      { x: 38, y: 80 }, { x: 62, y: 80 },
    ],
  },
  "5-3-2": {
    style: "Defensive",
    positions: [
      { x: 50, y: 8 }, { x: 10, y: 32 }, { x: 30, y: 22 }, { x: 50, y: 18 }, { x: 70, y: 22 }, { x: 90, y: 32 },
      { x: 30, y: 50 }, { x: 50, y: 48 }, { x: 70, y: 50 },
      { x: 38, y: 80 }, { x: 62, y: 80 },
    ],
  },
  "4-1-4-1": {
    style: "Compact",
    positions: [
      { x: 50, y: 8 }, { x: 15, y: 28 }, { x: 38, y: 22 }, { x: 62, y: 22 }, { x: 85, y: 28 },
      { x: 50, y: 40 },
      { x: 15, y: 58 }, { x: 38, y: 55 }, { x: 62, y: 55 }, { x: 85, y: 58 },
      { x: 50, y: 82 },
    ],
  },
};

// Mini Pitch Component
function MiniPitch({ formation, players }: { formation: string; players: Player[] }) {
  const formationData = formations[formation];
  const startingXI = players.slice(0, 11);

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
      <svg viewBox="0 0 200 150" className="w-full h-full">
        <defs>
          <pattern id="miniGrass" patternUnits="userSpaceOnUse" width="200" height="25">
            <rect width="200" height="12.5" fill="#3a9d5c" />
            <rect y="12.5" width="200" height="12.5" fill="#45b068" />
          </pattern>
        </defs>
        
        <rect width="200" height="150" fill="url(#miniGrass)" />
        <rect x="5" y="5" width="190" height="140" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <line x1="5" y1="75" x2="195" y2="75" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <circle cx="100" cy="75" r="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <rect x="50" y="5" width="100" height="30" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <rect x="50" y="115" width="100" height="30" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        
        {startingXI.map((player, index) => {
          const pos = formationData.positions[index];
          const scaledX = (pos.x / 100) * 200;
          const scaledY = 150 - (pos.y / 100) * 150;
          
          return (
            <g key={`${formation}-${player.id}`}>
              <circle cx={scaledX} cy={scaledY} r="8" fill="#8B5CF6" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
              <text x={scaledX} y={scaledY + 3} textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">
                {player.number}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function TacticsPage() {
  const { club, formation, setFormation, squad: storeSquad, updateSquad } = useGameStore();
  const [mentality, setMentality] = useState<"Defensive" | "Balanced" | "Attacking">("Balanced");
  const [pressing, setPressing] = useState<"Low" | "Medium" | "High">("Medium");
  const [tempo, setTempo] = useState<"Slow" | "Normal" | "Fast">("Normal");
  const [players, setPlayers] = useState<Player[]>([]);
  
  // Use store squad, or generate if empty
  React.useEffect(() => {
    if (storeSquad && storeSquad.length > 0) {
      setPlayers(storeSquad);
    } else {
      const generated = generateSquadForClub(club);
      setPlayers(generated);
      updateSquad(generated);
    }
  }, [storeSquad, club, updateSquad]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-[#1a1a2e] to-transparent backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ArrowLeft size={18} />
            </motion.button>
          </Link>
          <ClubLogo clubId={club.id} size={36} />
          <div>
            <h1 className="text-lg font-bold text-white">Tactics</h1>
            <p className="text-[10px] text-gray-400">Formation & Strategy</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 space-y-4 pt-4">
        {/* Current Formation Preview */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-purple-400" />
              <span className="text-sm font-semibold text-white">Current Formation</span>
            </div>
            <span className="text-xl font-black text-purple-400">{formation}</span>
          </div>
          <MiniPitch formation={formation} players={players} />
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Style: {formations[formation]?.style || "Balanced"}
          </p>
        </div>

        {/* Formation Selection */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2 px-1">Choose Formation</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(formations).map(([key, data]) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormation(key)}
                className={`p-3 rounded-xl border transition-all ${
                  formation === key
                    ? "bg-purple-500/20 border-purple-500/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <span className="text-sm font-bold text-white block">{key}</span>
                <span className="text-[9px] text-gray-400">{data.style}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Team Instructions */}
        <div className="space-y-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold px-1">Team Instructions</p>
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Swords size={14} className="text-rose-400" />
              <span className="text-xs font-semibold text-white">Mentality</span>
            </div>
            <div className="flex gap-2">
              {(["Defensive", "Balanced", "Attacking"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMentality(m)}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-semibold transition-all border ${
                    mentality === m
                      ? m === "Defensive" ? "bg-sky-500/20 text-sky-300 border-sky-500/50"
                      : m === "Attacking" ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-white">Pressing</span>
            </div>
            <div className="flex gap-2">
              {(["Low", "Medium", "High"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPressing(p)}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-semibold transition-all border ${
                    pressing === p
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-violet-400" />
              <span className="text-xs font-semibold text-white">Tempo</span>
            </div>
            <div className="flex gap-2">
              {(["Slow", "Normal", "Fast"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTempo(t)}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-semibold transition-all border ${
                    tempo === t
                      ? "bg-violet-500/20 text-violet-300 border-violet-500/50"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Link to Squad */}
        <Link href="/squad">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">View Full Squad</p>
                <p className="text-[10px] text-gray-400">See formation with player details</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </Link>
      </div>
    </div>
  );
}