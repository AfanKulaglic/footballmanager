"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Trophy, Filter, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClubLogo from "@/components/ClubLogo";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import { leagues } from "@/lib/mock";

// Helper function for ordinal suffix
function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default function HistoryPage() {
  const { results, club, currentMatchday, currentSeason, seasonHistory, startNewSeason } = useGameStore();
  const { getDisplayName, getDisplayShortName } = useClubNames();
  
  const [selectedSeason, setSelectedSeason] = useState<number | "current">("current");
  const [selectedMatchday, setSelectedMatchday] = useState<number | "all">("all");
  const [selectedTeam, setSelectedTeam] = useState<number | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Get league clubs
  const leagueClubs = useMemo(() => {
    const playerLeague = leagues.find(l => l.clubs.some(c => c.id === club.id));
    return playerLeague?.clubs || [];
  }, [club.id]);
  
  // Calculate total matchdays for the league (each team plays every other team twice)
  const maxMatchdays = useMemo(() => {
    return (leagueClubs.length - 1) * 2;
  }, [leagueClubs.length]);
  
  // Check if season is complete
  const isSeasonComplete = currentMatchday > maxMatchdays;
  
  // Get results for selected season
  const seasonResults = useMemo(() => {
    if (selectedSeason === "current") {
      return results;
    }
    const historySeason = seasonHistory.find(s => s.season === selectedSeason);
    return historySeason?.results || [];
  }, [selectedSeason, results, seasonHistory]);
  
  // Get all played matchdays for selected season
  const playedMatchdays = useMemo(() => {
    const matchdays = new Set(seasonResults.map(r => r.matchday));
    return Array.from(matchdays).sort((a, b) => b - a);
  }, [seasonResults]);

  // Filter results
  const filteredResults = useMemo(() => {
    let filtered = [...seasonResults];
    
    if (selectedMatchday !== "all") {
      filtered = filtered.filter(r => r.matchday === selectedMatchday);
    }
    
    if (selectedTeam !== "all") {
      filtered = filtered.filter(r => r.home.id === selectedTeam || r.away.id === selectedTeam);
    }
    
    return filtered.sort((a, b) => {
      if (b.matchday !== a.matchday) return b.matchday - a.matchday;
      return b.id - a.id;
    });
  }, [seasonResults, selectedMatchday, selectedTeam]);
  
  // Group results by matchday
  const resultsByMatchday = useMemo(() => {
    const grouped: Record<number, typeof seasonResults> = {};
    
    filteredResults.forEach(result => {
      if (!grouped[result.matchday]) {
        grouped[result.matchday] = [];
      }
      grouped[result.matchday].push(result);
    });
    
    return grouped;
  }, [filteredResults]);
  
  // Calculate team stats for selected season
  const teamStats = useMemo(() => {
    const stats: Record<number, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number }> = {};
    
    leagueClubs.forEach(c => {
      stats[c.id] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
    });
    
    seasonResults.forEach(result => {
      if (stats[result.home.id]) {
        stats[result.home.id].played++;
        stats[result.home.id].gf += result.homeScore;
        stats[result.home.id].ga += result.awayScore;
        if (result.homeScore > result.awayScore) {
          stats[result.home.id].won++;
          stats[result.home.id].points += 3;
        } else if (result.homeScore === result.awayScore) {
          stats[result.home.id].drawn++;
          stats[result.home.id].points += 1;
        } else {
          stats[result.home.id].lost++;
        }
      }
      
      if (stats[result.away.id]) {
        stats[result.away.id].played++;
        stats[result.away.id].gf += result.awayScore;
        stats[result.away.id].ga += result.homeScore;
        if (result.awayScore > result.homeScore) {
          stats[result.away.id].won++;
          stats[result.away.id].points += 3;
        } else if (result.awayScore === result.homeScore) {
          stats[result.away.id].drawn++;
          stats[result.away.id].points += 1;
        } else {
          stats[result.away.id].lost++;
        }
      }
    });
    
    return stats;
  }, [seasonResults, leagueClubs]);
  
  // Get season summary for past seasons
  const selectedSeasonData = useMemo(() => {
    if (selectedSeason === "current") return null;
    return seasonHistory.find(s => s.season === selectedSeason);
  }, [selectedSeason, seasonHistory]);
  
  // All available seasons
  const availableSeasons = useMemo(() => {
    const seasons = seasonHistory.map(s => s.season);
    return [...seasons, currentSeason].sort((a, b) => b - a);
  }, [seasonHistory, currentSeason]);

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
              <h1 className="text-lg font-bold text-white">Match History</h1>
              <p className="text-[10px] text-slate-500">{seasonResults.length} matches • Season {selectedSeason === "current" ? currentSeason : selectedSeason}</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showFilters ? "bg-purple-500/20 border-purple-500/50 text-purple-400" : "bg-[#14141e] border-white/[0.06] text-slate-400"
            }`}
          >
            <Filter size={18} />
          </motion.button>
        </div>
        
        {/* Season Selector */}
        {availableSeasons.length > 1 && (
          <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {availableSeasons.map(season => (
                <button
                  key={season}
                  onClick={() => {
                    setSelectedSeason(season === currentSeason ? "current" : season);
                    setSelectedMatchday("all");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    (selectedSeason === "current" && season === currentSeason) || selectedSeason === season
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {season}/{(season + 1).toString().slice(-2)}
                  {seasonHistory.find(s => s.season === season)?.playerStats.champion && (
                    <Trophy size={10} className="inline ml-1 text-yellow-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-3 border-b border-white/5 bg-white/5"
            >
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Matchday</label>
                  <select
                    value={selectedMatchday}
                    onChange={(e) => setSelectedMatchday(e.target.value === "all" ? "all" : Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all" className="bg-[#1a1a2e]">All Matchdays</option>
                    {playedMatchdays.map(md => (
                      <option key={md} value={md} className="bg-[#1a1a2e]">Matchday {md}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Team</label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value === "all" ? "all" : Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all" className="bg-[#1a1a2e]">All Teams</option>
                    {leagueClubs.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#1a1a2e]">
                        {getDisplayName(c.id, c.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 px-4 pb-24 pt-4">
        {/* Season Complete Banner */}
        {selectedSeason === "current" && isSeasonComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Trophy size={24} className="text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Season {currentSeason} Complete!</p>
                <p className="text-xs text-gray-400">All {maxMatchdays} matchdays have been played</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startNewSeason()}
                className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-bold"
              >
                Start {currentSeason + 1}
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* Past Season Summary */}
        {selectedSeasonData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              {selectedSeasonData.playerStats.champion && (
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Trophy size={24} className="text-yellow-400" />
                </div>
              )}
              <div>
                <p className="text-lg font-bold text-white">
                  Season {selectedSeasonData.season}/{(selectedSeasonData.season + 1).toString().slice(-2)}
                </p>
                <p className="text-xs text-gray-400">
                  Finished {selectedSeasonData.playerStats.leaguePosition === 1 ? "🏆 Champions!" : `${selectedSeasonData.playerStats.leaguePosition}${getOrdinalSuffix(selectedSeasonData.playerStats.leaguePosition)} Place`}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-2 rounded-lg bg-white/5">
                <p className="text-lg font-bold text-white">{selectedSeasonData.playerStats.played}</p>
                <p className="text-[9px] text-gray-500 uppercase">Played</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-green-500/10">
                <p className="text-lg font-bold text-green-400">{selectedSeasonData.playerStats.won}</p>
                <p className="text-[9px] text-gray-500 uppercase">Won</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-yellow-500/10">
                <p className="text-lg font-bold text-yellow-400">{selectedSeasonData.playerStats.drawn}</p>
                <p className="text-[9px] text-gray-500 uppercase">Drawn</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-red-500/10">
                <p className="text-lg font-bold text-red-400">{selectedSeasonData.playerStats.lost}</p>
                <p className="text-[9px] text-gray-500 uppercase">Lost</p>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-400">Goals: <span className="text-white font-bold">{selectedSeasonData.playerStats.goalsFor}</span> - <span className="text-white font-bold">{selectedSeasonData.playerStats.goalsAgainst}</span></span>
              <span className="text-purple-400 font-bold">{selectedSeasonData.playerStats.points} pts</span>
            </div>
          </motion.div>
        )}

        {seasonResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg font-medium">No matches played yet</p>
            <p className="text-gray-600 text-sm mt-1">Play your first match to see results here</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg font-medium">No matches found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(resultsByMatchday)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([matchday, matchdayResults]) => (
                <motion.div
                  key={matchday}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold">{matchday}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Matchday {matchday}</p>
                      <p className="text-[10px] text-gray-500">{matchdayResults.length} matches</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {matchdayResults.map((result, index) => {
                      const isPlayerMatch = result.home.id === club.id || result.away.id === club.id;
                      const isPlayerHome = result.home.id === club.id;
                      const playerWon = isPlayerMatch && (
                        (isPlayerHome && result.homeScore > result.awayScore) ||
                        (!isPlayerHome && result.awayScore > result.homeScore)
                      );
                      const playerLost = isPlayerMatch && (
                        (isPlayerHome && result.homeScore < result.awayScore) ||
                        (!isPlayerHome && result.awayScore < result.homeScore)
                      );
                      
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`p-3 rounded-xl border transition-all ${
                            isPlayerMatch
                              ? playerWon
                                ? "bg-green-500/10 border-green-500/30"
                                : playerLost
                                  ? "bg-red-500/10 border-red-500/30"
                                  : "bg-yellow-500/10 border-yellow-500/30"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className={`text-sm font-medium text-right ${
                                result.home.id === club.id ? "text-purple-400" : "text-white"
                              }`}>
                                {getDisplayShortName(result.home.id, result.home.shortName)}
                              </span>
                              <ClubLogo clubId={result.home.id} size={28} />
                            </div>
                            
                            <div className="flex items-center gap-2 px-3">
                              <span className={`text-xl font-bold ${
                                result.homeScore > result.awayScore ? "text-green-400" : 
                                result.homeScore < result.awayScore ? "text-red-400" : "text-white"
                              }`}>
                                {result.homeScore}
                              </span>
                              <span className="text-gray-600">-</span>
                              <span className={`text-xl font-bold ${
                                result.awayScore > result.homeScore ? "text-green-400" : 
                                result.awayScore < result.homeScore ? "text-red-400" : "text-white"
                              }`}>
                                {result.awayScore}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-1">
                              <ClubLogo clubId={result.away.id} size={28} />
                              <span className={`text-sm font-medium ${
                                result.away.id === club.id ? "text-purple-400" : "text-white"
                              }`}>
                                {getDisplayShortName(result.away.id, result.away.shortName)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
        
        {/* Team Stats Summary */}
        {selectedTeam !== "all" && teamStats[selectedTeam] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <ClubLogo clubId={selectedTeam} size={40} />
              <div>
                <p className="text-sm font-bold text-white">
                  {getDisplayName(selectedTeam, leagueClubs.find(c => c.id === selectedTeam)?.name || "")}
                </p>
                <p className="text-[10px] text-gray-500">Season Statistics</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-white">{teamStats[selectedTeam].played}</p>
                <p className="text-[10px] text-gray-500 uppercase">Played</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-green-500/10">
                <p className="text-2xl font-bold text-green-400">{teamStats[selectedTeam].won}</p>
                <p className="text-[10px] text-gray-500 uppercase">Won</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-yellow-500/10">
                <p className="text-2xl font-bold text-yellow-400">{teamStats[selectedTeam].drawn}</p>
                <p className="text-[10px] text-gray-500 uppercase">Drawn</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-red-500/10">
                <p className="text-2xl font-bold text-red-400">{teamStats[selectedTeam].lost}</p>
                <p className="text-[10px] text-gray-500 uppercase">Lost</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-blue-500/10">
                <p className="text-2xl font-bold text-blue-400">{teamStats[selectedTeam].gf}</p>
                <p className="text-[10px] text-gray-500 uppercase">Goals For</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-orange-500/10">
                <p className="text-2xl font-bold text-orange-400">{teamStats[selectedTeam].ga}</p>
                <p className="text-[10px] text-gray-500 uppercase">Goals Against</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
