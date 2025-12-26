"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, RefreshCw, X, ArrowRightLeft } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { Player } from "@/lib/types";

const formations = ["4-3-3", "4-4-2", "4-2-3-1", "3-5-2", "5-3-2", "4-1-4-1"];

export default function MatchTactics() {
  const { squad, formation, setFormationDuringMatch, updateSquad, addMatchEvent, matchMinute, isPaused, togglePause, club } = useGameStore();
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<"formation" | "subs">("subs");
  const [selectedStarter, setSelectedStarter] = useState<Player | null>(null);
  const [subsUsed, setSubsUsed] = useState(0);
  const maxSubs = 5;

  const starters = squad.slice(0, 11);
  const subs = squad.slice(11);

  const handleSubstitution = (subPlayer: Player) => {
    if (!selectedStarter || subsUsed >= maxSubs) return;
    
    const starterIndex = squad.findIndex(p => p.id === selectedStarter.id);
    const subIndex = squad.findIndex(p => p.id === subPlayer.id);
    
    if (starterIndex === -1 || subIndex === -1) return;
    
    // Swap players
    const newSquad = [...squad];
    newSquad[starterIndex] = subPlayer;
    newSquad[subIndex] = selectedStarter;
    
    updateSquad(newSquad);
    
    // Add substitution event to match feed
    addMatchEvent({
      minute: matchMinute,
      type: "substitution",
      team: "home",
      player: subPlayer.name,
      description: `🔄 ${club.shortName} substitution: ${selectedStarter.name} ➜ ${subPlayer.name}`,
    });
    
    setSubsUsed(prev => prev + 1);
    setSelectedStarter(null);
  };

  const handleFormationChange = (newFormation: string) => {
    if (newFormation !== formation) {
      setFormationDuringMatch(newFormation);
    }
  };

  const openPanel = () => {
    // Auto-pause when opening tactics
    if (!isPaused) {
      togglePause();
    }
    setShowPanel(true);
  };

  const closePanel = () => {
    setShowPanel(false);
    setSelectedStarter(null);
  };

  return (
    <>
      {/* Tactics Button - Large and Prominent */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={openPanel}
        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-purple-500/20 border border-purple-500/40 hover:from-purple-600/40 hover:to-purple-500/30 hover:border-purple-400/50 transition-all shadow-lg shadow-purple-500/10"
      >
        <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
          <Users size={18} className="text-purple-300" />
        </div>
        <div className="text-left">
          <span className="text-sm font-bold text-purple-200 block">Tactics</span>
          <span className="text-[10px] text-purple-400/80">{subsUsed}/{maxSubs} subs</span>
        </div>
      </motion.button>

      {/* Tactics Panel Overlay */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={closePanel}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#14141e] rounded-t-2xl max-h-[85vh] overflow-hidden border-t border-white/[0.06]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white">Match Tactics</h3>
                  <span className="text-xs text-slate-500">{matchMinute}'</span>
                </div>
                <button 
                  onClick={closePanel}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/[0.06]">
                <button
                  onClick={() => setActiveTab("subs")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === "subs" 
                      ? "text-green-400 border-b-2 border-green-400" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ArrowRightLeft size={14} />
                    <span>Substitutions</span>
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">
                      {subsUsed}/{maxSubs}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("formation")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === "formation" 
                      ? "text-purple-400 border-b-2 border-purple-400" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users size={14} />
                    <span>Formation</span>
                  </div>
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {activeTab === "subs" ? (
                  <div className="space-y-4">
                    {subsUsed >= maxSubs ? (
                      <div className="text-center py-6">
                        <p className="text-yellow-500 text-sm font-medium">All substitutions used</p>
                        <p className="text-slate-500 text-xs mt-1">You've made {maxSubs} substitutions</p>
                      </div>
                    ) : (
                      <>
                        {/* Instruction */}
                        <div className="text-center py-2">
                          <p className="text-xs text-slate-400">
                            {selectedStarter 
                              ? `Select a substitute to replace ${selectedStarter.name}`
                              : "Select a player on the pitch to substitute"}
                          </p>
                        </div>

                        {/* Starters */}
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                            On Pitch
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {starters.map((player) => (
                              <motion.button
                                key={player.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedStarter(
                                  selectedStarter?.id === player.id ? null : player
                                )}
                                className={`p-2.5 rounded-xl border text-left transition-all ${
                                  selectedStarter?.id === player.id
                                    ? "bg-green-500/20 border-green-500/50"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                    selectedStarter?.id === player.id
                                      ? "bg-green-500 text-white"
                                      : "bg-slate-700 text-white"
                                  }`}>
                                    {player.number}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-white truncate">
                                      {player.name.split(". ")[1] || player.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500">{player.position}</p>
                                  </div>
                                  <span className="text-xs font-bold text-green-400">{player.rating}</span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Substitutes */}
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                            Substitutes
                          </p>
                          <div className="space-y-2">
                            {subs.map((player) => (
                              <motion.button
                                key={player.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectedStarter && handleSubstitution(player)}
                                disabled={!selectedStarter}
                                className={`w-full p-3 rounded-xl border text-left transition-all ${
                                  selectedStarter
                                    ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 cursor-pointer"
                                    : "bg-white/5 border-white/10 opacity-60 cursor-not-allowed"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-sm text-white">
                                    {player.number}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{player.name}</p>
                                    <p className="text-[10px] text-slate-500">{player.position}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-green-400">{player.rating}</span>
                                    {selectedStarter && (
                                      <RefreshCw size={14} className="text-purple-400" />
                                    )}
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      <p className="text-xs text-slate-400">
                        Current formation: <span className="text-purple-400 font-bold">{formation}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {formations.map((f) => (
                        <motion.button
                          key={f}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleFormationChange(f)}
                          className={`p-3 rounded-xl border transition-all ${
                            formation === f
                              ? "bg-purple-500/20 border-purple-500/50"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <span className={`text-sm font-bold ${
                            formation === f ? "text-purple-400" : "text-white"
                          }`}>
                            {f}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                        Formation Info
                      </p>
                      <p className="text-xs text-slate-400">
                        {formation === "4-3-3" && "Attacking formation with 3 forwards. Great for pressing high."}
                        {formation === "4-4-2" && "Balanced formation with 2 strikers. Solid defensively."}
                        {formation === "4-2-3-1" && "Control-focused with a single striker and attacking midfielders."}
                        {formation === "3-5-2" && "Wing-back heavy formation. Dominates the midfield."}
                        {formation === "5-3-2" && "Defensive formation with 5 at the back. Hard to break down."}
                        {formation === "4-1-4-1" && "Compact midfield with a holding midfielder. Good for counter-attacks."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/[0.06]">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={closePanel}
                  className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm"
                >
                  Continue Match
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
