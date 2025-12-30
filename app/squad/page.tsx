"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Users, List, ChevronDown, RefreshCw, Shield, Star, TrendingUp, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClubLogo from "@/components/ClubLogo";
import { PlayerInfoModal, getFlag, positionColors } from "@/components/PlayerCard";
import { generateSquadForClub } from "@/lib/mock";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import { Player } from "@/lib/types";

// Formation definitions
const formations: Record<string, { positions: { role: string; x: number; y: number }[] }> = {
  "4-3-3": {
    positions: [
      { role: "GK", x: 50, y: 7 }, { role: "LB", x: 15, y: 25 }, { role: "CB", x: 38, y: 20 },
      { role: "CB", x: 62, y: 20 }, { role: "RB", x: 85, y: 25 }, { role: "CM", x: 28, y: 45 },
      { role: "CDM", x: 50, y: 40 }, { role: "CM", x: 72, y: 45 }, { role: "LW", x: 18, y: 72 },
      { role: "ST", x: 50, y: 82 }, { role: "RW", x: 82, y: 72 },
    ],
  },
  "4-4-2": {
    positions: [
      { role: "GK", x: 50, y: 7 }, { role: "LB", x: 15, y: 25 }, { role: "CB", x: 38, y: 20 },
      { role: "CB", x: 62, y: 20 }, { role: "RB", x: 85, y: 25 }, { role: "LM", x: 15, y: 50 },
      { role: "CM", x: 38, y: 45 }, { role: "CM", x: 62, y: 45 }, { role: "RM", x: 85, y: 50 },
      { role: "ST", x: 38, y: 80 }, { role: "ST", x: 62, y: 80 },
    ],
  },
  "4-2-3-1": {
    positions: [
      { role: "GK", x: 50, y: 7 }, { role: "LB", x: 15, y: 25 }, { role: "CB", x: 38, y: 20 },
      { role: "CB", x: 62, y: 20 }, { role: "RB", x: 85, y: 25 }, { role: "CDM", x: 38, y: 40 },
      { role: "CDM", x: 62, y: 40 }, { role: "LW", x: 20, y: 60 }, { role: "CAM", x: 50, y: 62 },
      { role: "RW", x: 80, y: 60 }, { role: "ST", x: 50, y: 82 },
    ],
  },
  "3-5-2": {
    positions: [
      { role: "GK", x: 50, y: 7 }, { role: "CB", x: 28, y: 20 }, { role: "CB", x: 50, y: 17 },
      { role: "CB", x: 72, y: 20 }, { role: "LM", x: 10, y: 50 }, { role: "CM", x: 32, y: 45 },
      { role: "CDM", x: 50, y: 40 }, { role: "CM", x: 68, y: 45 }, { role: "RM", x: 90, y: 50 },
      { role: "ST", x: 38, y: 80 }, { role: "ST", x: 62, y: 80 },
    ],
  },
  "5-3-2": {
    positions: [
      { role: "GK", x: 50, y: 7 }, { role: "LB", x: 10, y: 30 }, { role: "CB", x: 30, y: 20 },
      { role: "CB", x: 50, y: 17 }, { role: "CB", x: 70, y: 20 }, { role: "RB", x: 90, y: 30 },
      { role: "CM", x: 30, y: 48 }, { role: "CM", x: 50, y: 45 }, { role: "CM", x: 70, y: 48 },
      { role: "ST", x: 38, y: 80 }, { role: "ST", x: 62, y: 80 },
    ],
  },
  "4-1-4-1": {
    positions: [
      { role: "GK", x: 50, y: 7 }, { role: "LB", x: 15, y: 25 }, { role: "CB", x: 38, y: 20 },
      { role: "CB", x: 62, y: 20 }, { role: "RB", x: 85, y: 25 }, { role: "CDM", x: 50, y: 38 },
      { role: "LM", x: 15, y: 55 }, { role: "CM", x: 38, y: 52 }, { role: "CM", x: 62, y: 52 },
      { role: "RM", x: 85, y: 55 }, { role: "ST", x: 50, y: 80 },
    ],
  },
};

// Football Pitch Component
function FootballPitch({ 
  players, 
  formation, 
  selectedPlayer, 
  onSelectPlayer,
  swapMode,
  onShowInfo,
}: {
  players: Player[];
  formation: string;
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player | null) => void;
  swapMode: boolean;
  onShowInfo: (player: Player) => void;
}) {
  const formationData = formations[formation];
  const startingXI = players.slice(0, 11);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
      {/* Pitch SVG */}
      <svg viewBox="0 0 300 400" className="w-full h-full">
        <defs>
          <pattern id="grass" patternUnits="userSpaceOnUse" width="300" height="33.33">
            <rect width="300" height="16.67" fill="#2d7a47" />
            <rect y="16.67" width="300" height="16.67" fill="#348a52" />
          </pattern>
        </defs>
        
        <rect width="300" height="400" fill="url(#grass)" />
        <rect x="10" y="10" width="280" height="380" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <line x1="10" y1="200" x2="290" y2="200" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <circle cx="150" cy="200" r="40" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <circle cx="150" cy="200" r="3" fill="rgba(255,255,255,0.5)" />
        
        {/* Top penalty area */}
        <rect x="60" y="10" width="180" height="65" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <rect x="100" y="10" width="100" height="25" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <circle cx="150" cy="50" r="3" fill="rgba(255,255,255,0.5)" />
        <path d="M 110 75 A 40 40 0 0 0 190 75" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        
        {/* Bottom penalty area */}
        <rect x="60" y="325" width="180" height="65" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <rect x="100" y="365" width="100" height="25" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <circle cx="150" cy="350" r="3" fill="rgba(255,255,255,0.5)" />
        <path d="M 110 325 A 40 40 0 0 1 190 325" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        
        {/* Corner arcs */}
        <path d="M 10 18 A 8 8 0 0 0 18 10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <path d="M 282 10 A 8 8 0 0 0 290 18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <path d="M 10 382 A 8 8 0 0 1 18 390" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <path d="M 290 382 A 8 8 0 0 0 282 390" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        
        {/* Goals */}
        <rect x="120" y="2" width="60" height="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="120" y="390" width="60" height="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </svg>
      
      {/* Players overlay */}
      <div className="absolute inset-0">
        {startingXI.map((player, index) => {
          const pos = formationData.positions[index];
          const isSelected = selectedPlayer?.id === player.id;
          
          return (
            <motion.div
              key={`${formation}-${player.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.03 }}
              className="absolute flex flex-col items-center cursor-pointer"
              style={{
                left: `${pos.x}%`,
                top: `${100 - pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }} 
                className="relative"
                onClick={() => onSelectPlayer(isSelected ? null : player)}
                onDoubleClick={() => onShowInfo(player)}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -inset-1.5 rounded-full bg-white/30"
                  />
                )}
                
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-xl transition-all ${
                    isSelected 
                      ? "bg-white text-purple-600 ring-2 ring-white" 
                      : swapMode 
                        ? "bg-purple-500 text-white ring-2 ring-purple-300/50" 
                        : "bg-purple-600 text-white"
                  }`}
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
                >
                  {player.number}
                </div>
                
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                  <span className="text-[9px] font-bold text-green-400">{player.rating}</span>
                </div>
              </motion.div>
              
              <div className={`mt-1 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold ${
                isSelected ? "bg-white text-gray-900" : "bg-black/70 text-white"
              }`}>
                {player.name.split(". ")[1] || player.name}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Player Row Component (for list view and subs)
function PlayerRow({ 
  player, 
  isSelected, 
  onSelect, 
  canSwap,
  onSwap,
  onShowInfo,
  compact = false,
}: { 
  player: Player; 
  isSelected: boolean; 
  onSelect: () => void;
  canSwap?: boolean;
  onSwap?: () => void;
  onShowInfo: () => void;
  compact?: boolean;
}) {
  const posColor = positionColors[player.position] || "#666";
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative p-3 rounded-xl border transition-all ${
        isSelected 
          ? "bg-green-500/20 border-green-500/50" 
          : "bg-[#14141e] border-white/[0.06] hover:bg-[#1a1a28]"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Player number badge */}
        <div 
          className={`${compact ? "w-10 h-10" : "w-12 h-12"} rounded-xl flex items-center justify-center font-bold shadow-lg cursor-pointer transition-transform hover:scale-105`}
          style={{ backgroundColor: `${posColor}15`, border: `1px solid ${posColor}30` }}
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onShowInfo(); }}
        >
          <span style={{ color: posColor }} className={compact ? "text-sm" : "text-base"}>{player.number}</span>
        </div>
        
        {/* Player info */}
        <div className="flex-1 min-w-0" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onShowInfo(); }}>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{getFlag(player.nationality)}</span>
            <p className={`${compact ? "text-sm" : "text-sm"} font-semibold text-white truncate`}>{player.name}</p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span 
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: `${posColor}20`, color: posColor }}
            >
              {player.position}
            </span>
            {player.age && (
              <span className="text-[10px] text-gray-500">{player.age} yrs</span>
            )}
          </div>
        </div>
        
        {/* Rating */}
        <div className="text-right">
          <span className={`${compact ? "text-xl" : "text-2xl"} font-black text-green-400`}>{player.rating}</span>
          {!compact && <p className="text-[9px] text-gray-500 uppercase">OVR</p>}
        </div>
        
        {/* Swap button */}
        {canSwap && onSwap && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSwap(); }}
            className="p-2.5 rounded-xl bg-green-500 text-white shadow-lg"
          >
            <RefreshCw size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Squad Stats Summary
function SquadSummary({ squad }: { squad: Player[] }) {
  const stats = useMemo(() => {
    const starters = squad.slice(0, 11);
    const avgRating = starters.length > 0 
      ? Math.round(starters.reduce((sum, p) => sum + p.rating, 0) / starters.length)
      : 0;
    
    const positions = {
      GK: squad.filter(p => p.position === "GK").length,
      DEF: squad.filter(p => ["CB", "LB", "RB", "LWB", "RWB"].includes(p.position)).length,
      MID: squad.filter(p => ["CM", "CDM", "CAM", "LM", "RM"].includes(p.position)).length,
      FWD: squad.filter(p => ["ST", "CF", "LW", "RW"].includes(p.position)).length,
    };
    
    const topRated = [...squad].sort((a, b) => b.rating - a.rating)[0];
    
    return { avgRating, positions, topRated, total: squad.length };
  }, [squad]);
  
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="p-3 rounded-xl bg-[#14141e] border border-white/[0.06] text-center">
        <Users size={14} className="mx-auto mb-1 text-purple-400" />
        <p className="text-lg font-bold text-white">{stats.total}</p>
        <p className="text-[9px] text-gray-500 uppercase">Players</p>
      </div>
      <div className="p-3 rounded-xl bg-[#14141e] border border-white/[0.06] text-center">
        <Star size={14} className="mx-auto mb-1 text-yellow-400" />
        <p className="text-lg font-bold text-white">{stats.avgRating}</p>
        <p className="text-[9px] text-gray-500 uppercase">AVG OVR</p>
      </div>
      <div className="p-3 rounded-xl bg-[#14141e] border border-white/[0.06] text-center">
        <Shield size={14} className="mx-auto mb-1 text-blue-400" />
        <p className="text-lg font-bold text-white">{stats.positions.DEF}</p>
        <p className="text-[9px] text-gray-500 uppercase">Defenders</p>
      </div>
      <div className="p-3 rounded-xl bg-[#14141e] border border-white/[0.06] text-center">
        <TrendingUp size={14} className="mx-auto mb-1 text-green-400" />
        <p className="text-lg font-bold text-white">{stats.topRated?.rating || 0}</p>
        <p className="text-[9px] text-gray-500 uppercase">Best</p>
      </div>
    </div>
  );
}

// Main Page Component
export default function SquadPage() {
  const { club, formation, setFormation, squad: storeSquad, updateSquad } = useGameStore();
  const { getDisplayName } = useClubNames();
  const [viewMode, setViewMode] = useState<"formation" | "list">("formation");
  const [showFormationPicker, setShowFormationPicker] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerInfoModal, setPlayerInfoModal] = useState<Player | null>(null);
  const [positionFilter, setPositionFilter] = useState<string>("all");
  
  // Use store squad, or generate if empty
  const [localSquad, setLocalSquad] = useState<Player[]>([]);
  
  useEffect(() => {
    if (storeSquad && storeSquad.length > 0) {
      setLocalSquad(storeSquad);
    } else {
      const generated = generateSquadForClub(club);
      setLocalSquad(generated);
      updateSquad(generated);
    }
  }, [storeSquad, club, updateSquad]);
  
  const avgRating = localSquad.length > 0 
    ? Math.round(localSquad.slice(0, 11).reduce((sum, p) => sum + p.rating, 0) / 11)
    : 0;
  
  const selectedIsStarter = selectedPlayer 
    ? localSquad.findIndex(p => p.id === selectedPlayer.id) < 11 && localSquad.findIndex(p => p.id === selectedPlayer.id) >= 0
    : false;
  
  const handleSwap = (subPlayer: Player) => {
    if (!selectedPlayer || !selectedIsStarter) return;
    
    const starterIndex = localSquad.findIndex(p => p.id === selectedPlayer.id);
    const subIndex = localSquad.findIndex(p => p.id === subPlayer.id);
    
    if (starterIndex === -1 || subIndex === -1) return;
    
    const newSquad = [...localSquad];
    newSquad[starterIndex] = subPlayer;
    newSquad[subIndex] = selectedPlayer;
    
    setLocalSquad(newSquad);
    updateSquad(newSquad);
    setSelectedPlayer(null);
  };
  
  const handleShowPlayerInfo = (player: Player) => {
    setPlayerInfoModal(player);
  };
  
  // Filter players for list view
  const filteredPlayers = useMemo(() => {
    if (positionFilter === "all") return localSquad;
    
    const positionGroups: Record<string, string[]> = {
      gk: ["GK"],
      def: ["CB", "LB", "RB", "LWB", "RWB"],
      mid: ["CM", "CDM", "CAM", "LM", "RM"],
      fwd: ["ST", "CF", "LW", "RW"],
    };
    
    return localSquad.filter(p => positionGroups[positionFilter]?.includes(p.position));
  }, [localSquad, positionFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0c0c12]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
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
              <h1 className="text-lg font-bold text-white">Squad</h1>
              <p className="text-[10px] text-gray-400">{localSquad.length} Players • {avgRating} AVG</p>
            </div>
          </div>
          
          {/* View toggle */}
          <div className="flex items-center p-1 bg-[#14141e] rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setViewMode("formation")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "formation" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Users size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 pt-4 space-y-4">
        {/* Squad Summary Stats */}
        <SquadSummary squad={localSquad} />
        
        {viewMode === "formation" ? (
          <>
            {/* Formation selector */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFormationPicker(!showFormationPicker)}
                className="w-full flex items-center justify-between p-3.5 bg-[#14141e] rounded-xl border border-white/[0.06] hover:bg-[#1a1a28] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-purple-400" />
                  <span className="text-sm text-gray-300">Formation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-purple-400">{formation}</span>
                  <motion.div animate={{ rotate: showFormationPicker ? 180 : 0 }}>
                    <ChevronDown size={16} className="text-gray-400" />
                  </motion.div>
                </div>
              </motion.button>
              
              <AnimatePresence>
                {showFormationPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#14141e] rounded-xl border border-white/[0.06] overflow-hidden shadow-2xl"
                  >
                    <div className="p-2 grid grid-cols-3 gap-1.5">
                      {Object.keys(formations).map((f) => (
                        <button
                          key={f}
                          onClick={() => { setFormation(f); setShowFormationPicker(false); }}
                          className={`p-2.5 rounded-lg text-sm font-semibold transition-all ${
                            formation === f
                              ? "bg-green-500 text-white"
                              : "bg-[#1a1a28] text-slate-400 hover:bg-[#222232] hover:text-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Swap instruction */}
            {selectedIsStarter && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20"
              >
                <RefreshCw size={16} className="text-green-400" />
                <span className="text-xs text-green-300">
                  Tap a substitute to swap with <span className="font-bold">{selectedPlayer?.name}</span>
                </span>
              </motion.div>
            )}
            
            {/* Football Pitch */}
            <FootballPitch
              players={localSquad}
              formation={formation}
              selectedPlayer={selectedPlayer}
              onSelectPlayer={setSelectedPlayer}
              swapMode={selectedIsStarter}
              onShowInfo={handleShowPlayerInfo}
            />
            
            {/* Substitutes */}
            <div className="bg-[#14141e] rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#1a1a28] border-b border-white/[0.04]">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">Substitutes</span>
              </div>
              <div className="p-3 space-y-2">
                {localSquad.slice(11).map((player) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    isSelected={selectedPlayer?.id === player.id}
                    onSelect={() => setSelectedPlayer(selectedPlayer?.id === player.id ? null : player)}
                    canSwap={selectedIsStarter}
                    onSwap={() => handleSwap(player)}
                    onShowInfo={() => handleShowPlayerInfo(player)}
                    compact
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Position Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { id: "all", label: "All" },
                { id: "gk", label: "GK" },
                { id: "def", label: "DEF" },
                { id: "mid", label: "MID" },
                { id: "fwd", label: "FWD" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setPositionFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    positionFilter === filter.id
                      ? "bg-green-500 text-white"
                      : "bg-[#14141e] text-slate-400 hover:bg-[#1a1a28] border border-white/[0.06]"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {/* Player List */}
            <div className="bg-[#14141e] rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#1a1a28] border-b border-white/[0.04] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
                  {positionFilter === "all" ? "Full Squad" : positionFilter.toUpperCase()}
                </span>
                <span className="text-[10px] text-gray-500">{filteredPlayers.length} players</span>
              </div>
              <div className="p-3 space-y-2">
                {filteredPlayers.map((player, index) => {
                  const isStarter = localSquad.indexOf(player) < 11;
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <PlayerRow
                        player={player}
                        isSelected={selectedPlayer?.id === player.id}
                        onSelect={() => setSelectedPlayer(selectedPlayer?.id === player.id ? null : player)}
                        onShowInfo={() => handleShowPlayerInfo(player)}
                      />
                      {isStarter && (
                        <div className="mt-1 ml-14">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium">
                            Starting XI
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Player Info Modal */}
      <PlayerInfoModal
        player={playerInfoModal!}
        isOpen={!!playerInfoModal}
        onClose={() => setPlayerInfoModal(null)}
        clubName={getDisplayName(club.id, club.name)}
      />
    </div>
  );
}
