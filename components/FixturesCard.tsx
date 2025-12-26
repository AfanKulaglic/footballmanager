"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, ChevronDown, Users, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClubLogo from "./ClubLogo";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";

export default function FixturesCard() {
  const { fixtures, currentMatchday, results, club } = useGameStore();
  const { getDisplayShortName } = useClubNames();
  const [showAllResults, setShowAllResults] = useState(false);
  
  const upcomingFixtures = fixtures
    .filter(f => f.matchday >= currentMatchday)
    .slice(0, 5);
  
  const playerResults = results
    .filter(r => r.home.id === club.id || r.away.id === club.id)
    .slice(-3)
    .reverse();
  
  const lastMatchday = currentMatchday - 1;
  const lastMatchdayResults = results.filter(r => r.matchday === lastMatchday);
  const otherResults = lastMatchdayResults.filter(r => r.home.id !== club.id && r.away.id !== club.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#14141e] border border-white/[0.06] rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a28] border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" />
          <span className="text-xs text-slate-300 font-semibold">Schedule</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 bg-[#12121a] px-2 py-0.5 rounded">
            MD {currentMatchday}
          </span>
          <Link href="/history">
            <button className="p-1.5 rounded bg-[#12121a] hover:bg-[#1a1a28] transition-colors">
              <History size={12} className="text-slate-500" />
            </button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Your Recent Results */}
        {playerResults.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 font-medium">Your Results</p>
            <div className="space-y-1.5">
              {playerResults.map((result) => {
                const isHome = result.home.id === club.id;
                const playerScore = isHome ? result.homeScore : result.awayScore;
                const opponentScore = isHome ? result.awayScore : result.homeScore;
                const won = playerScore > opponentScore;
                const draw = playerScore === opponentScore;
                
                return (
                  <div key={result.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#12121a]">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                      won ? "bg-green-500/20 text-green-500" : 
                      draw ? "bg-yellow-500/20 text-yellow-500" : 
                      "bg-red-500/20 text-red-500"
                    }`}>
                      {won ? "W" : draw ? "D" : "L"}
                    </span>
                    <div className="flex items-center gap-1.5 flex-1">
                      <ClubLogo clubId={result.home.id} size={16} />
                      <span className={`text-[11px] font-medium ${result.home.id === club.id ? "text-green-500" : "text-slate-400"}`}>
                        {getDisplayShortName(result.home.id, result.home.shortName)}
                      </span>
                      <span className="text-xs font-bold text-white mx-1 font-display">
                        {result.homeScore} - {result.awayScore}
                      </span>
                      <span className={`text-[11px] font-medium ${result.away.id === club.id ? "text-green-500" : "text-slate-400"}`}>
                        {getDisplayShortName(result.away.id, result.away.shortName)}
                      </span>
                      <ClubLogo clubId={result.away.id} size={16} />
                    </div>
                    <span className="text-[9px] text-slate-600">MD{result.matchday}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Results */}
        {otherResults.length > 0 && (
          <div>
            <button
              onClick={() => setShowAllResults(!showAllResults)}
              className="w-full flex items-center justify-between text-[10px] text-slate-600 uppercase tracking-wider mb-2 hover:text-slate-400 transition-colors"
            >
              <span className="flex items-center gap-1 font-medium">
                <Users size={10} />
                Other Results (MD {lastMatchday})
              </span>
              <motion.div animate={{ rotate: showAllResults ? 180 : 0 }}>
                <ChevronDown size={12} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showAllResults && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  {otherResults.map((result) => (
                    <div key={result.id} className="flex items-center gap-2 p-1.5 rounded bg-[#12121a]">
                      <div className="flex items-center gap-1.5 flex-1">
                        <ClubLogo clubId={result.home.id} size={14} />
                        <span className="text-[10px] text-slate-500">
                          {getDisplayShortName(result.home.id, result.home.shortName)}
                        </span>
                        <span className="text-[11px] font-bold text-white mx-1">
                          {result.homeScore} - {result.awayScore}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {getDisplayShortName(result.away.id, result.away.shortName)}
                        </span>
                        <ClubLogo clubId={result.away.id} size={14} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            {!showAllResults && (
              <p className="text-[10px] text-slate-600 text-center py-1">
                {otherResults.length} match{otherResults.length !== 1 ? "es" : ""} played
              </p>
            )}
          </div>
        )}

        {/* Upcoming Fixtures */}
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 font-medium">Upcoming</p>
          <div className="space-y-1.5">
            {upcomingFixtures.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-4">Season complete!</p>
            ) : (
              upcomingFixtures.map((fixture) => {
                const isNext = fixture.matchday === currentMatchday;
                
                return (
                  <div 
                    key={fixture.id}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      isNext ? "bg-green-500/10 border border-green-500/20" : "bg-[#12121a]"
                    }`}
                  >
                    <span className={`text-[10px] font-bold w-5 text-center ${
                      isNext ? "text-green-500" : "text-slate-600"
                    }`}>
                      {fixture.matchday}
                    </span>
                    
                    <div className="flex items-center gap-1.5 flex-1">
                      <ClubLogo clubId={fixture.home.id} size={18} />
                      <span className={`text-[11px] font-medium ${fixture.home.id === club.id ? "text-green-500" : "text-slate-400"}`}>
                        {getDisplayShortName(fixture.home.id, fixture.home.shortName)}
                      </span>
                      
                      <span className="text-slate-600 text-[10px] mx-1">vs</span>
                      
                      <span className={`text-[11px] font-medium ${fixture.away.id === club.id ? "text-green-500" : "text-slate-400"}`}>
                        {getDisplayShortName(fixture.away.id, fixture.away.shortName)}
                      </span>
                      <ClubLogo clubId={fixture.away.id} size={18} />
                    </div>
                    
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                      fixture.isHome 
                        ? "bg-green-500/15 text-green-500" 
                        : "bg-orange-500/15 text-orange-500"
                    }`}>
                      {fixture.isHome ? "H" : "A"}
                    </span>
                    
                    {isNext && <ChevronRight size={12} className="text-green-500" />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-2 border-t border-white/[0.04]">
          <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
            <span>Season Progress</span>
            <span>{currentMatchday - 1} / {fixtures.length}</span>
          </div>
          <div className="h-1 bg-[#12121a] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentMatchday - 1) / Math.max(fixtures.length, 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
