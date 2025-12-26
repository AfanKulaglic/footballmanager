"use client";

import { useState } from "react";
import { X, Star, TrendingUp, Calendar, DollarSign, MapPin, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/lib/types";

// Comprehensive nationality flags mapping
export const nationalityFlags: Record<string, string> = {
  // European
  english: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  spanish: "🇪🇸",
  french: "🇫🇷",
  german: "🇩🇪",
  italian: "🇮🇹",
  portuguese: "🇵🇹",
  dutch: "🇳🇱",
  belgian: "🇧🇪",
  swiss: "🇨🇭",
  austrian: "🇦🇹",
  polish: "🇵🇱",
  czech: "🇨🇿",
  croatian: "🇭🇷",
  serbian: "🇷🇸",
  bosnian: "🇧🇦",
  slovenian: "🇸🇮",
  greek: "🇬🇷",
  turkish: "🇹🇷",
  russian: "🇷🇺",
  ukrainian: "🇺🇦",
  danish: "🇩🇰",
  swedish: "🇸🇪",
  norwegian: "🇳🇴",
  finnish: "🇫🇮",
  scottish: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  welsh: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  irish: "🇮🇪",
  romanian: "🇷🇴",
  hungarian: "🇭🇺",
  slovak: "🇸🇰",
  bulgarian: "🇧🇬",
  albanian: "🇦🇱",
  macedonian: "🇲🇰",
  montenegrin: "🇲🇪",
  kosovar: "🇽🇰",
  icelandic: "🇮🇸",
  
  // South American
  brazilian: "🇧🇷",
  argentine: "🇦🇷",
  uruguayan: "🇺🇾",
  colombian: "🇨🇴",
  chilean: "🇨🇱",
  peruvian: "🇵🇪",
  ecuadorian: "🇪🇨",
  venezuelan: "🇻🇪",
  paraguayan: "🇵🇾",
  bolivian: "🇧🇴",
  
  // North/Central American
  american: "🇺🇸",
  mexican: "🇲🇽",
  canadian: "🇨🇦",
  jamaican: "🇯🇲",
  
  // African
  nigerian: "🇳🇬",
  ghanaian: "🇬🇭",
  senegalese: "🇸🇳",
  ivorian: "🇨🇮",
  cameroonian: "🇨🇲",
  egyptian: "🇪🇬",
  moroccan: "🇲🇦",
  algerian: "🇩🇿",
  tunisian: "🇹🇳",
  malian: "🇲🇱",
  congolese: "🇨🇩",
  southafrican: "🇿🇦",
  
  // Asian
  japanese: "🇯🇵",
  korean: "🇰🇷",
  chinese: "🇨🇳",
  australian: "🇦🇺",
  iranian: "🇮🇷",
  saudi: "🇸🇦",
  
  // Default
  unknown: "🏳️",
};

// Get flag for nationality
export function getFlag(nationality?: string): string {
  if (!nationality) return nationalityFlags.unknown;
  const key = nationality.toLowerCase().replace(/\s+/g, "");
  return nationalityFlags[key] || nationalityFlags.unknown;
}

// Get full nationality name
export function getNationalityName(nationality?: string): string {
  if (!nationality) return "Unknown";
  return nationality.charAt(0).toUpperCase() + nationality.slice(1);
}

// Position colors
export const positionColors: Record<string, string> = {
  GK: "#F59E0B",
  LB: "#3B82F6", RB: "#3B82F6", CB: "#3B82F6", LWB: "#3B82F6", RWB: "#3B82F6",
  CDM: "#10B981", CM: "#10B981", CAM: "#8B5CF6", LM: "#10B981", RM: "#10B981",
  LW: "#EF4444", RW: "#EF4444", ST: "#EF4444", CF: "#EF4444",
};

// Format money
function formatMoney(amount: number): string {
  if (amount >= 1000000000) return `€${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
}

// Get rating color
function getRatingColor(rating: number): string {
  if (rating >= 85) return "text-yellow-400";
  if (rating >= 75) return "text-green-400";
  if (rating >= 65) return "text-blue-400";
  if (rating >= 55) return "text-gray-400";
  return "text-red-400";
}

// Get rating label
function getRatingLabel(rating: number): string {
  if (rating >= 90) return "World Class";
  if (rating >= 85) return "Elite";
  if (rating >= 80) return "Excellent";
  if (rating >= 75) return "Very Good";
  if (rating >= 70) return "Good";
  if (rating >= 65) return "Decent";
  if (rating >= 60) return "Average";
  return "Below Average";
}

interface PlayerInfoModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  clubName?: string;
}

export function PlayerInfoModal({ player, isOpen, onClose, clubName }: PlayerInfoModalProps) {
  if (!isOpen) return null;
  
  const value = player.value || player.rating * player.rating * 1000;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] border border-white/10 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with rating */}
            <div 
              className="relative p-6 pb-8"
              style={{ 
                background: `linear-gradient(135deg, ${positionColors[player.position] || "#666"}40, transparent)` 
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              >
                <X size={16} />
              </button>
              
              <div className="flex items-start gap-4">
                {/* Rating card */}
                <div 
                  className="w-20 h-24 rounded-xl flex flex-col items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${positionColors[player.position] || "#666"}30` }}
                >
                  <span 
                    className="text-4xl font-black"
                    style={{ color: positionColors[player.position] || "#666" }}
                  >
                    {player.rating}
                  </span>
                  <span className="text-xs font-bold text-white/80 mt-1">{player.position}</span>
                </div>
                
                {/* Player info */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getFlag(player.nationality)}</span>
                    <span className="text-xs text-gray-400">{getNationalityName(player.nationality)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{player.name}</h2>
                  {clubName && (
                    <p className="text-sm text-gray-400 mt-1">{clubName}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={12} className="text-yellow-400" />
                    <span className={`text-xs font-medium ${getRatingColor(player.rating)}`}>
                      {getRatingLabel(player.rating)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="px-6 pb-6 space-y-4">
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-white/5 text-center">
                  <User size={16} className="mx-auto text-purple-400 mb-1" />
                  <p className="text-lg font-bold text-white">#{player.number}</p>
                  <p className="text-[9px] text-gray-500 uppercase">Number</p>
                </div>
                {player.age && (
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <Calendar size={16} className="mx-auto text-blue-400 mb-1" />
                    <p className="text-lg font-bold text-white">{player.age}</p>
                    <p className="text-[9px] text-gray-500 uppercase">Age</p>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-white/5 text-center">
                  <DollarSign size={16} className="mx-auto text-green-400 mb-1" />
                  <p className="text-lg font-bold text-white">{formatMoney(value)}</p>
                  <p className="text-[9px] text-gray-500 uppercase">Value</p>
                </div>
              </div>
              
              {/* Position info */}
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Position</p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${positionColors[player.position] || "#666"}30` }}
                  >
                    <span 
                      className="text-sm font-bold"
                      style={{ color: positionColors[player.position] || "#666" }}
                    >
                      {player.position}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{getPositionFullName(player.position)}</p>
                    <p className="text-xs text-gray-500">{getPositionCategory(player.position)}</p>
                  </div>
                </div>
              </div>
              
              {/* Rating breakdown (simulated) */}
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Attributes</p>
                <div className="space-y-2">
                  {getAttributesForPosition(player.position, player.rating).map((attr) => (
                    <div key={attr.name} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-20">{attr.name}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${attr.value}%`,
                            backgroundColor: attr.value >= 80 ? "#22c55e" : attr.value >= 60 ? "#eab308" : "#ef4444"
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-white w-8 text-right">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper functions for position info
function getPositionFullName(position: string): string {
  const names: Record<string, string> = {
    GK: "Goalkeeper",
    LB: "Left Back", RB: "Right Back", CB: "Center Back", LWB: "Left Wing Back", RWB: "Right Wing Back",
    CDM: "Defensive Midfielder", CM: "Central Midfielder", CAM: "Attacking Midfielder",
    LM: "Left Midfielder", RM: "Right Midfielder",
    LW: "Left Winger", RW: "Right Winger", ST: "Striker", CF: "Center Forward",
  };
  return names[position] || position;
}

function getPositionCategory(position: string): string {
  if (position === "GK") return "Goalkeeper";
  if (["LB", "RB", "CB", "LWB", "RWB"].includes(position)) return "Defender";
  if (["CDM", "CM", "CAM", "LM", "RM"].includes(position)) return "Midfielder";
  return "Forward";
}

function getAttributesForPosition(position: string, baseRating: number): { name: string; value: number }[] {
  const variance = () => Math.floor(Math.random() * 15) - 7;
  const clamp = (v: number) => Math.max(40, Math.min(99, v));
  
  if (position === "GK") {
    return [
      { name: "Reflexes", value: clamp(baseRating + variance()) },
      { name: "Diving", value: clamp(baseRating + variance()) },
      { name: "Handling", value: clamp(baseRating + variance()) },
      { name: "Positioning", value: clamp(baseRating + variance()) },
    ];
  }
  
  if (["LB", "RB", "CB", "LWB", "RWB"].includes(position)) {
    return [
      { name: "Defending", value: clamp(baseRating + variance()) },
      { name: "Physical", value: clamp(baseRating + variance()) },
      { name: "Pace", value: clamp(baseRating + variance()) },
      { name: "Passing", value: clamp(baseRating - 5 + variance()) },
    ];
  }
  
  if (["CDM", "CM", "CAM", "LM", "RM"].includes(position)) {
    return [
      { name: "Passing", value: clamp(baseRating + variance()) },
      { name: "Vision", value: clamp(baseRating + variance()) },
      { name: "Dribbling", value: clamp(baseRating + variance()) },
      { name: "Stamina", value: clamp(baseRating + variance()) },
    ];
  }
  
  // Forwards
  return [
    { name: "Finishing", value: clamp(baseRating + variance()) },
    { name: "Pace", value: clamp(baseRating + variance()) },
    { name: "Dribbling", value: clamp(baseRating + variance()) },
    { name: "Shooting", value: clamp(baseRating + variance()) },
  ];
}

// Reusable Player Row Component
interface PlayerRowProps {
  player: Player;
  showRating?: boolean;
  showValue?: boolean;
  showPosition?: boolean;
  showNumber?: boolean;
  onClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function PlayerRow({ 
  player, 
  showRating = true, 
  showValue = false,
  showPosition = true,
  showNumber = true,
  onClick,
  rightContent,
  className = "",
  compact = false,
}: PlayerRowProps) {
  const [showModal, setShowModal] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowModal(true);
    }
  };
  
  return (
    <>
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`flex items-center gap-3 p-${compact ? "2" : "3"} rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all ${className}`}
      >
        {showNumber && (
          <div 
            className={`${compact ? "w-9 h-9" : "w-11 h-11"} rounded-xl flex items-center justify-center font-bold shadow-lg`}
            style={{ backgroundColor: `${positionColors[player.position] || "#666"}20` }}
          >
            <span style={{ color: positionColors[player.position] || "#666" }}>
              {player.number}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={compact ? "text-sm" : "text-base"}>{getFlag(player.nationality)}</span>
            <p className={`${compact ? "text-xs" : "text-sm"} font-semibold text-white truncate`}>{player.name}</p>
          </div>
          {showPosition && (
            <span 
              className="text-[10px] font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block"
              style={{ 
                backgroundColor: `${positionColors[player.position] || "#666"}20`,
                color: positionColors[player.position] || "#666"
              }}
            >
              {player.position}
            </span>
          )}
        </div>
        
        {rightContent ? (
          rightContent
        ) : (
          <div className="flex items-center gap-3">
            {showValue && player.value && (
              <span className="text-xs font-medium text-yellow-400">
                {formatMoney(player.value)}
              </span>
            )}
            {showRating && (
              <span className={`${compact ? "text-lg" : "text-xl"} font-bold ${getRatingColor(player.rating)}`}>
                {player.rating}
              </span>
            )}
          </div>
        )}
      </motion.div>
      
      <PlayerInfoModal 
        player={player} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}

export default PlayerRow;
