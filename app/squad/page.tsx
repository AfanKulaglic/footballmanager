"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, List, ChevronDown, RefreshCw } from "lucide-react";
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
}: {
  players: Player[];
  formation: string;
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player | null) => void;
  swapMode: boolean;
}) {
  const formationData = formations[formation];
  const startingXI = players.slice(0, 11);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
      {/* Pitch SVG */}
      <svg viewBox="0 0 300 400" className="w-full h-full">
        <defs>
          <pattern id="grass" patternUnits="userSpaceOnUse" width="300" height="33.33">
            <rect width="300" height="16.67" fill="#3a9d5c" />
            <rect y="16.67" width="300" height="16.67" fill="#45b068" />
          </pattern>
          <linearGradient id="pitchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d8a4a" />
            <stop offset="50%" stopColor="#3a9d5c" />
            <stop offset="100%" stopColor="#2d8a4a" />
          </linearGradient>
        </defs>
        
        {/* Pitch background */}
        <rect width="300" height="400" fill="url(#grass)" />
        
        {/* Pitch border */}
        <rect x="10" y="10" width="280" height="380" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        
        {/* Center line */}
        <line x1="10" y1="200" x2="290" y2="200" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        
        {/* Center circle */}
        <circle cx="150" cy="200" r="40" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <circle cx="150" cy="200" r="3" fill="rgba(255,255,255,0.7)" />
        
        {/* Top penalty area */}
        <rect x="60" y="10" width="180" height="65" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <rect x="100" y="10" width="100" height="25" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <circle cx="150" cy="50" r="3" fill="rgba(255,255,255,0.7)" />
        <path d="M 110 75 A 40 40 0 0 0 190 75" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        
        {/* Bottom penalty area */}
        <rect x="60" y="325" width="180" height="65" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <rect x="100" y="365" width="100" height="25" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <circle cx="150" cy="350" r="3" fill="rgba(255,255,255,0.7)" />
        <path d="M 110 325 A 40 40 0 0 1 190 325" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        
        {/* Corner arcs */}
        <path d="M 10 18 A 8 8 0 0 0 18 10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <path d="M 282 10 A 8 8 0 0 0 290 18" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <path d="M 10 382 A 8 8 0 0 1 18 390" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <path d="M 290 382 A 8 8 0 0 0 282 390" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        
        {/* Goals */}
        <rect x="120" y="2" width="60" height="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <rect x="120" y="390" width="60" height="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
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
              onClick={() => onSelectPlayer(isSelected ? null : player)}
              className="absolute flex flex-col items-center cursor-pointer"
              style={{
                left: `${pos.x}%`,
                top: `${100 - pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -inset-1 rounded-full bg-white/30"
                  />
                )}
                
                {/* Player circle - all same purple color */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-xl transition-all ${
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
                
                {/* Rating badge */}
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                  <span className="text-[9px] font-bold text-green-400">{player.rating}</span>
                </div>
              </motion.div>
              
              {/* Player name */}
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

// Substitute Card Component
function SubstituteCard({ 
  player, 
  isSelected, 
  onSelect, 
  canSwap,
  onSwap,
  onShowInfo,
}: { 
  player: Player; 
  isSelected: boolean; 
  onSelect: () => void;
  canSwap: boolean;
  onSwap: () => void;
  onShowInfo: () => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative p-3 rounded-xl border transition-all ${
        isSelected 
          ? "bg-purple-500/20 border-purple-500/50" 
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Player number */}
        <div 
          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-lg cursor-pointer`}
          style={{ backgroundColor: `${positionColors[player.position] || "#666"}20` }}
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onShowInfo(); }}
        >
          <span style={{ color: positionColors[player.position] || "#666" }}>{player.number}</span>
        </div>
        
        {/* Player info */}
        <div className="flex-1 min-w-0" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onShowInfo(); }}>
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{getFlag(player.nationality)}</span>
            <p className="text-sm font-semibold truncate">{player.name}</p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span 
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ 
                backgroundColor: `${positionColors[player.position] || "#666"}20`,
                color: positionColors[player.position] || "#666"
              }}
            >
              {player.position}
            </span>
            <span className="text-[10px] font-bold text-green-400">{player.rating}</span>
          </div>
        </div>
        
        {/* Swap button */}
        {canSwap && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSwap(); }}
            className="p-2 rounded-lg bg-green-500 text-white shadow-lg"
          >
            <RefreshCw size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Player List View
function PlayerListView({ 
  players, 
  selectedPlayer, 
  onSelectPlayer,
  onShowPlayerInfo,
}: {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player | null) => void;
  onShowPlayerInfo: (player: Player) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold px-1">Starting XI</p>
      {players.slice(0, 11).map((player, index) => {
        const isSelected = selectedPlayer?.id === player.id;
        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => onSelectPlayer(isSelected ? null : player)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              isSelected ? "bg-purple-500/20 border-purple-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg cursor-pointer"
                style={{ backgroundColor: `${positionColors[player.position] || "#666"}20` }}
                onClick={(e) => { e.stopPropagation(); onShowPlayerInfo(player); }}
              >
                <span style={{ color: positionColors[player.position] || "#666" }}>{player.number}</span>
              </div>
              <div className="flex-1" onClick={(e) => { e.stopPropagation(); onShowPlayerInfo(player); }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getFlag(player.nationality)}</span>
                  <p className="text-sm font-bold">{player.name}</p>
                </div>
                <span 
                  className="text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block font-medium"
                  style={{ 
                    backgroundColor: `${positionColors[player.position] || "#666"}20`,
                    color: positionColors[player.position] || "#666"
                  }}
                >
                  {player.position}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-green-400">{player.rating}</span>
                <p className="text-[9px] text-gray-500 uppercase">OVR</p>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold px-1 mt-4">Substitutes</p>
      {players.slice(11).map((player, index) => {
        const isSelected = selectedPlayer?.id === player.id;
        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 11) * 0.02 }}
            onClick={() => onSelectPlayer(isSelected ? null : player)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              isSelected ? "bg-purple-500/20 border-purple-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg cursor-pointer"
                style={{ backgroundColor: `${positionColors[player.position] || "#666"}20` }}
                onClick={(e) => { e.stopPropagation(); onShowPlayerInfo(player); }}
              >
                <span style={{ color: positionColors[player.position] || "#666" }}>{player.number}</span>
              </div>
              <div className="flex-1" onClick={(e) => { e.stopPropagation(); onShowPlayerInfo(player); }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{getFlag(player.nationality)}</span>
                  <p className="text-sm font-semibold">{player.name}</p>
                </div>
                <span 
                  className="text-[10px] font-medium"
                  style={{ color: positionColors[player.position] || "#666" }}
                >
                  {player.position}
                </span>
              </div>
              <span className="text-xl font-bold text-green-400/80">{player.rating}</span>
            </div>
          </motion.div>
        );
      })}
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
  
  // Use store squad, or generate if empty (fallback)
  const [localSquad, setLocalSquad] = useState<Player[]>([]);
  
  useEffect(() => {
    if (storeSquad && storeSquad.length > 0) {
      setLocalSquad(storeSquad);
    } else {
      // Fallback: generate squad if store is empty
      const generated = generateSquadForClub(club);
      setLocalSquad(generated);
      updateSquad(generated);
    }
  }, [storeSquad, club, updateSquad]);
  
  const avgRating = localSquad.length > 0 
    ? Math.round(localSquad.slice(0, 11).reduce((sum, p) => sum + p.rating, 0) / 11)
    : 0;
  
  // Check if selected player is a starter (for swap functionality)
  const selectedIsStarter = selectedPlayer 
    ? localSquad.findIndex(p => p.id === selectedPlayer.id) < 11 && localSquad.findIndex(p => p.id === selectedPlayer.id) >= 0
    : false;
  
  // Swap players
  const handleSwap = (subPlayer: Player) => {
    if (!selectedPlayer || !selectedIsStarter) return;
    
    const starterIndex = localSquad.findIndex(p => p.id === selectedPlayer.id);
    const subIndex = localSquad.findIndex(p => p.id === subPlayer.id);
    
    if (starterIndex === -1 || subIndex === -1) return;
    
    // Create new array with swapped players
    const newSquad = [...localSquad];
    newSquad[starterIndex] = subPlayer;
    newSquad[subIndex] = selectedPlayer;
    
    setLocalSquad(newSquad);
    updateSquad(newSquad); // Sync to store and Firebase
    setSelectedPlayer(null);
  };
  
  const handleShowPlayerInfo = (player: Player) => {
    setPlayerInfoModal(player);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-[#1a1a2e] to-transparent backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
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
              <h1 className="text-lg font-bold text-white">Squad</h1>
              <p className="text-[10px] text-gray-400">{localSquad.length} Players • {avgRating} AVG</p>
            </div>
          </div>
          
          {/* View toggle */}
          <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10">
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

      <div className="flex-1 px-4 pb-24">
        {viewMode === "formation" ? (
          <div className="space-y-4 pt-4">
            {/* Formation selector */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFormationPicker(!showFormationPicker)}
                className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="text-sm text-gray-300">Formation</span>
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
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1e1e3f] rounded-xl border border-white/10 overflow-hidden shadow-2xl"
                  >
                    <div className="p-2 grid grid-cols-3 gap-1.5">
                      {Object.keys(formations).map((f) => (
                        <button
                          key={f}
                          onClick={() => { setFormation(f); setShowFormationPicker(false); }}
                          className={`p-2.5 rounded-lg text-sm font-semibold transition-all ${
                            formation === f
                              ? "bg-purple-500 text-white"
                              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
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
                className="flex items-center gap-2 p-3 bg-green-500/20 rounded-xl border border-green-500/30"
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
            />
            
            {/* Substitutes */}
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2 px-1">
                Substitutes
              </p>
              <div className="space-y-2">
                {localSquad.slice(11).map((player) => (
                  <SubstituteCard
                    key={player.id}
                    player={player}
                    isSelected={selectedPlayer?.id === player.id}
                    onSelect={() => setSelectedPlayer(selectedPlayer?.id === player.id ? null : player)}
                    canSwap={selectedIsStarter}
                    onSwap={() => handleSwap(player)}
                    onShowInfo={() => handleShowPlayerInfo(player)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <PlayerListView
              players={localSquad}
              selectedPlayer={selectedPlayer}
              onSelectPlayer={setSelectedPlayer}
              onShowPlayerInfo={handleShowPlayerInfo}
            />
          </div>
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