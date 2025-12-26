"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Trophy, Target, Shield, TrendingUp, TrendingDown,
  Users, DollarSign, Award, BarChart3, Activity,
  Star, Flame, Home, Plane, ChevronDown, Goal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClubLogo from "@/components/ClubLogo";
import { PlayerInfoModal, getFlag } from "@/components/PlayerCard";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import { leagues } from "@/lib/mock";

type TabType = "overview" | "team" | "squad" | "league" | "records" | "finances";

export default function StatsPage() {
  const { 
    club, results, squad, transfers, currentSeason, seasonHistory, 
    currentMatchday, clubBalance, scouts, scoutReports
  } = useGameStore();
  const { getDisplayName, getDisplayShortName } = useClubNames();
  
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Get league clubs
  const leagueClubs = useMemo(() => {
    const playerLeague = leagues.find(l => l.clubs.some(c => c.id === club.id));
    return playerLeague?.clubs || [];
  }, [club.id]);
  
  // Calculate total matchdays
  const maxMatchdays = (leagueClubs.length - 1) * 2;
  
  // ===== TEAM STATS =====
  const teamStats = useMemo(() => {
    const playerResults = results.filter(r => r.home.id === club.id || r.away.id === club.id);
    
    const wins = playerResults.filter(r => {
      const isHome = r.home.id === club.id;
      return isHome ? r.homeScore > r.awayScore : r.awayScore > r.homeScore;
    }).length;
    
    const draws = playerResults.filter(r => r.homeScore === r.awayScore).length;
    const losses = playerResults.length - wins - draws;
    
    const goalsScored = playerResults.reduce((sum, r) => {
      const isHome = r.home.id === club.id;
      return sum + (isHome ? r.homeScore : r.awayScore);
    }, 0);
    
    const goalsConceded = playerResults.reduce((sum, r) => {
      const isHome = r.home.id === club.id;
      return sum + (isHome ? r.awayScore : r.homeScore);
    }, 0);
    
    const cleanSheets = playerResults.filter(r => {
      const isHome = r.home.id === club.id;
      return isHome ? r.awayScore === 0 : r.homeScore === 0;
    }).length;
    
    const failedToScore = playerResults.filter(r => {
      const isHome = r.home.id === club.id;
      return isHome ? r.homeScore === 0 : r.awayScore === 0;
    }).length;
    
    // Home/Away splits
    const homeResults = playerResults.filter(r => r.home.id === club.id);
    const awayResults = playerResults.filter(r => r.away.id === club.id);
    
    const homeWins = homeResults.filter(r => r.homeScore > r.awayScore).length;
    const homeDraws = homeResults.filter(r => r.homeScore === r.awayScore).length;
    const homeLosses = homeResults.length - homeWins - homeDraws;
    const homeGoalsFor = homeResults.reduce((sum, r) => sum + r.homeScore, 0);
    const homeGoalsAgainst = homeResults.reduce((sum, r) => sum + r.awayScore, 0);
    
    const awayWins = awayResults.filter(r => r.awayScore > r.homeScore).length;
    const awayDraws = awayResults.filter(r => r.homeScore === r.awayScore).length;
    const awayLosses = awayResults.length - awayWins - awayDraws;
    const awayGoalsFor = awayResults.reduce((sum, r) => sum + r.awayScore, 0);
    const awayGoalsAgainst = awayResults.reduce((sum, r) => sum + r.homeScore, 0);
    
    // Form (last 5)
    const last5 = playerResults.slice(-5).map(r => {
      const isHome = r.home.id === club.id;
      const scored = isHome ? r.homeScore : r.awayScore;
      const conceded = isHome ? r.awayScore : r.homeScore;
      if (scored > conceded) return "W";
      if (scored < conceded) return "L";
      return "D";
    });
    
    // Streaks
    let currentStreak = { type: "", count: 0 };
    let longestWinStreak = 0;
    let longestUnbeatenStreak = 0;
    let longestLossStreak = 0;
    let tempWinStreak = 0;
    let tempUnbeatenStreak = 0;
    let tempLossStreak = 0;
    
    playerResults.forEach((r, i) => {
      const isHome = r.home.id === club.id;
      const scored = isHome ? r.homeScore : r.awayScore;
      const conceded = isHome ? r.awayScore : r.homeScore;
      const result = scored > conceded ? "W" : scored < conceded ? "L" : "D";
      
      if (result === "W") {
        tempWinStreak++;
        tempUnbeatenStreak++;
        tempLossStreak = 0;
      } else if (result === "D") {
        tempWinStreak = 0;
        tempUnbeatenStreak++;
        tempLossStreak = 0;
      } else {
        tempWinStreak = 0;
        tempUnbeatenStreak = 0;
        tempLossStreak++;
      }
      
      longestWinStreak = Math.max(longestWinStreak, tempWinStreak);
      longestUnbeatenStreak = Math.max(longestUnbeatenStreak, tempUnbeatenStreak);
      longestLossStreak = Math.max(longestLossStreak, tempLossStreak);
      
      if (i === playerResults.length - 1) {
        if (tempWinStreak > 0) currentStreak = { type: "W", count: tempWinStreak };
        else if (tempLossStreak > 0) currentStreak = { type: "L", count: tempLossStreak };
        else if (tempUnbeatenStreak > 0) currentStreak = { type: "U", count: tempUnbeatenStreak };
      }
    });
    
    // Biggest wins/losses
    let biggestWin = { margin: 0, match: null as typeof playerResults[0] | null };
    let biggestLoss = { margin: 0, match: null as typeof playerResults[0] | null };
    let highestScoring = { total: 0, match: null as typeof playerResults[0] | null };
    
    playerResults.forEach(r => {
      const isHome = r.home.id === club.id;
      const scored = isHome ? r.homeScore : r.awayScore;
      const conceded = isHome ? r.awayScore : r.homeScore;
      const margin = scored - conceded;
      const total = r.homeScore + r.awayScore;
      
      if (margin > biggestWin.margin) {
        biggestWin = { margin, match: r };
      }
      if (margin < -biggestLoss.margin) {
        biggestLoss = { margin: -margin, match: r };
      }
      if (total > highestScoring.total) {
        highestScoring = { total, match: r };
      }
    });
    
    // Points
    const points = wins * 3 + draws;
    const pointsPerGame = playerResults.length > 0 ? (points / playerResults.length).toFixed(2) : "0.00";
    const goalsPerGame = playerResults.length > 0 ? (goalsScored / playerResults.length).toFixed(2) : "0.00";
    const concededPerGame = playerResults.length > 0 ? (goalsConceded / playerResults.length).toFixed(2) : "0.00";
    
    return {
      played: playerResults.length,
      wins, draws, losses,
      goalsScored, goalsConceded,
      goalDifference: goalsScored - goalsConceded,
      cleanSheets, failedToScore,
      points, pointsPerGame, goalsPerGame, concededPerGame,
      winRate: playerResults.length > 0 ? Math.round((wins / playerResults.length) * 100) : 0,
      home: { played: homeResults.length, wins: homeWins, draws: homeDraws, losses: homeLosses, gf: homeGoalsFor, ga: homeGoalsAgainst },
      away: { played: awayResults.length, wins: awayWins, draws: awayDraws, losses: awayLosses, gf: awayGoalsFor, ga: awayGoalsAgainst },
      form: last5,
      currentStreak,
      longestWinStreak,
      longestUnbeatenStreak,
      longestLossStreak,
      biggestWin,
      biggestLoss,
      highestScoring,
    };
  }, [results, club.id]);

  // ===== SQUAD STATS =====
  const squadStats = useMemo(() => {
    const positions = squad.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const avgRating = squad.length > 0 
      ? (squad.reduce((sum, p) => sum + p.rating, 0) / squad.length).toFixed(1)
      : "0.0";
    
    const avgAge = squad.length > 0 && squad.some(p => p.age)
      ? (squad.filter(p => p.age).reduce((sum, p) => sum + (p.age || 0), 0) / squad.filter(p => p.age).length).toFixed(1)
      : "N/A";
    
    const totalValue = squad.reduce((sum, p) => sum + (p.value || p.rating * 100000), 0);
    
    const topRated = [...squad].sort((a, b) => b.rating - a.rating).slice(0, 5);
    const lowestRated = [...squad].sort((a, b) => a.rating - b.rating).slice(0, 5);
    const mostValuable = [...squad].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 5);
    const youngest = [...squad].filter(p => p.age).sort((a, b) => (a.age || 99) - (b.age || 99)).slice(0, 5);
    const oldest = [...squad].filter(p => p.age).sort((a, b) => (b.age || 0) - (a.age || 0)).slice(0, 5);
    
    // Position groups
    const goalkeepers = squad.filter(p => p.position === "GK");
    const defenders = squad.filter(p => ["CB", "LB", "RB", "LWB", "RWB"].includes(p.position));
    const midfielders = squad.filter(p => ["CM", "CDM", "CAM", "LM", "RM"].includes(p.position));
    const forwards = squad.filter(p => ["ST", "CF", "LW", "RW"].includes(p.position));
    
    // Nationality breakdown
    const nationalities = squad.reduce((acc, p) => {
      const nat = p.nationality || "Unknown";
      acc[nat] = (acc[nat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: squad.length,
      positions,
      avgRating,
      avgAge,
      totalValue,
      topRated,
      lowestRated,
      mostValuable,
      youngest,
      oldest,
      goalkeepers: goalkeepers.length,
      defenders: defenders.length,
      midfielders: midfielders.length,
      forwards: forwards.length,
      nationalities,
      avgRatingByPosition: {
        GK: goalkeepers.length > 0 ? (goalkeepers.reduce((s, p) => s + p.rating, 0) / goalkeepers.length).toFixed(1) : "N/A",
        DEF: defenders.length > 0 ? (defenders.reduce((s, p) => s + p.rating, 0) / defenders.length).toFixed(1) : "N/A",
        MID: midfielders.length > 0 ? (midfielders.reduce((s, p) => s + p.rating, 0) / midfielders.length).toFixed(1) : "N/A",
        FWD: forwards.length > 0 ? (forwards.reduce((s, p) => s + p.rating, 0) / forwards.length).toFixed(1) : "N/A",
      }
    };
  }, [squad]);
  
  // ===== LEAGUE STATS =====
  const leagueStats = useMemo(() => {
    // Calculate standings
    const standings: Record<number, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number }> = {};
    
    leagueClubs.forEach(c => {
      standings[c.id] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
    });
    
    results.forEach(result => {
      if (standings[result.home.id]) {
        standings[result.home.id].played++;
        standings[result.home.id].gf += result.homeScore;
        standings[result.home.id].ga += result.awayScore;
        if (result.homeScore > result.awayScore) {
          standings[result.home.id].won++;
          standings[result.home.id].points += 3;
        } else if (result.homeScore === result.awayScore) {
          standings[result.home.id].drawn++;
          standings[result.home.id].points += 1;
        } else {
          standings[result.home.id].lost++;
        }
      }
      
      if (standings[result.away.id]) {
        standings[result.away.id].played++;
        standings[result.away.id].gf += result.awayScore;
        standings[result.away.id].ga += result.homeScore;
        if (result.awayScore > result.homeScore) {
          standings[result.away.id].won++;
          standings[result.away.id].points += 3;
        } else if (result.awayScore === result.homeScore) {
          standings[result.away.id].drawn++;
          standings[result.away.id].points += 1;
        } else {
          standings[result.away.id].lost++;
        }
      }
    });
    
    const sortedStandings = leagueClubs
      .map(c => ({ club: c, ...standings[c.id] }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.gf - a.ga;
        const gdB = b.gf - b.ga;
        if (gdB !== gdA) return gdB - gdA;
        return b.gf - a.gf;
      });
    
    const playerPosition = sortedStandings.findIndex(s => s.club.id === club.id) + 1;
    const leader = sortedStandings[0];
    const pointsOffTop = leader ? leader.points - (standings[club.id]?.points || 0) : 0;
    
    // Top scorers (teams)
    const topScorers = [...sortedStandings].sort((a, b) => b.gf - a.gf).slice(0, 5);
    const bestDefense = [...sortedStandings].sort((a, b) => a.ga - b.ga).slice(0, 5);
    
    // League totals
    const totalGoals = results.reduce((sum, r) => sum + r.homeScore + r.awayScore, 0);
    const avgGoalsPerGame = results.length > 0 ? (totalGoals / results.length).toFixed(2) : "0.00";
    const homeWins = results.filter(r => r.homeScore > r.awayScore).length;
    const awayWins = results.filter(r => r.awayScore > r.homeScore).length;
    const draws = results.filter(r => r.homeScore === r.awayScore).length;
    
    return {
      position: playerPosition,
      totalTeams: leagueClubs.length,
      standings: sortedStandings,
      leader,
      pointsOffTop,
      topScorers,
      bestDefense,
      totalGoals,
      avgGoalsPerGame,
      homeWins,
      awayWins,
      draws,
      matchesPlayed: results.length,
    };
  }, [results, leagueClubs, club.id]);
  
  // ===== TRANSFER STATS =====
  const transferStats = useMemo(() => {
    const buys = transfers.filter(t => t.type === "buy");
    const sells = transfers.filter(t => t.type === "sell");
    
    const totalSpent = buys.reduce((sum, t) => sum + t.fee, 0);
    const totalReceived = sells.reduce((sum, t) => sum + t.fee, 0);
    const netSpend = totalSpent - totalReceived;
    
    const biggestBuy = buys.length > 0 ? buys.reduce((max, t) => t.fee > max.fee ? t : max, buys[0]) : null;
    const biggestSale = sells.length > 0 ? sells.reduce((max, t) => t.fee > max.fee ? t : max, sells[0]) : null;
    
    return {
      totalTransfers: transfers.length,
      buys: buys.length,
      sells: sells.length,
      totalSpent,
      totalReceived,
      netSpend,
      biggestBuy,
      biggestSale,
      currentBalance: clubBalance,
      scouts: scouts.length,
      scoutReports: scoutReports.length,
      completedReports: scoutReports.filter(r => r.status === "completed").length,
    };
  }, [transfers, clubBalance, scouts, scoutReports]);
  
  // ===== CAREER STATS (All seasons) =====
  const careerStats = useMemo(() => {
    const allSeasons = [...seasonHistory, {
      season: currentSeason,
      playerStats: {
        season: currentSeason,
        leaguePosition: leagueStats.position,
        played: teamStats.played,
        won: teamStats.wins,
        drawn: teamStats.draws,
        lost: teamStats.losses,
        goalsFor: teamStats.goalsScored,
        goalsAgainst: teamStats.goalsConceded,
        points: teamStats.points,
        champion: leagueStats.position === 1 && currentMatchday > maxMatchdays,
      }
    }];
    
    const totalPlayed = allSeasons.reduce((sum, s) => sum + s.playerStats.played, 0);
    const totalWins = allSeasons.reduce((sum, s) => sum + s.playerStats.won, 0);
    const totalDraws = allSeasons.reduce((sum, s) => sum + s.playerStats.drawn, 0);
    const totalLosses = allSeasons.reduce((sum, s) => sum + s.playerStats.lost, 0);
    const totalGoalsFor = allSeasons.reduce((sum, s) => sum + s.playerStats.goalsFor, 0);
    const totalGoalsAgainst = allSeasons.reduce((sum, s) => sum + s.playerStats.goalsAgainst, 0);
    const totalPoints = allSeasons.reduce((sum, s) => sum + s.playerStats.points, 0);
    const championships = allSeasons.filter(s => s.playerStats.champion).length;
    
    const bestFinish = Math.min(...allSeasons.map(s => s.playerStats.leaguePosition));
    const worstFinish = Math.max(...allSeasons.map(s => s.playerStats.leaguePosition));
    
    return {
      seasonsManaged: allSeasons.length,
      totalPlayed,
      totalWins,
      totalDraws,
      totalLosses,
      totalGoalsFor,
      totalGoalsAgainst,
      totalPoints,
      championships,
      bestFinish,
      worstFinish,
      winRate: totalPlayed > 0 ? Math.round((totalWins / totalPlayed) * 100) : 0,
      avgPointsPerSeason: allSeasons.length > 0 ? (totalPoints / allSeasons.length).toFixed(1) : "0",
    };
  }, [seasonHistory, currentSeason, leagueStats.position, teamStats, currentMatchday, maxMatchdays]);

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "team", label: "Team", icon: Activity },
    { id: "squad", label: "Squad", icon: Users },
    { id: "league", label: "League", icon: Trophy },
    { id: "records", label: "Records", icon: Award },
    { id: "finances", label: "Finances", icon: DollarSign },
  ];

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
              <h1 className="text-lg font-bold text-white">Statistics</h1>
              <p className="text-[10px] text-gray-400">Season {currentSeason}/{(currentSeason + 1).toString().slice(-2)} • MD {currentMatchday}/{maxMatchdays}</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-2 py-2 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 pt-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Position", value: `${leagueStats.position}${getOrdinal(leagueStats.position)}`, icon: Trophy, color: "text-yellow-400" },
                  { label: "Points", value: teamStats.points, icon: Star, color: "text-purple-400" },
                  { label: "Win Rate", value: `${teamStats.winRate}%`, icon: Target, color: "text-green-400" },
                  { label: "GD", value: teamStats.goalDifference >= 0 ? `+${teamStats.goalDifference}` : teamStats.goalDifference, icon: Goal, color: teamStats.goalDifference >= 0 ? "text-green-400" : "text-red-400" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-center"
                  >
                    <stat.icon size={16} className={`mx-auto mb-1 ${stat.color}`} />
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-[9px] text-gray-500 uppercase">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Form */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel>Current Form</SectionLabel>
                  {teamStats.currentStreak.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      teamStats.currentStreak.type === "W" ? "bg-green-500/20 text-green-400" :
                      teamStats.currentStreak.type === "L" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {teamStats.currentStreak.count} {teamStats.currentStreak.type === "W" ? "wins" : teamStats.currentStreak.type === "L" ? "losses" : "unbeaten"}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {teamStats.form.length > 0 ? teamStats.form.map((result, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                        result === "W" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        result === "L" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {result}
                    </div>
                  )) : (
                    <p className="text-gray-500 text-sm">No matches played yet</p>
                  )}
                </div>
              </div>
              
              {/* Season Progress */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Season Progress</SectionLabel>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Matchday {currentMatchday - 1} of {maxMatchdays}</span>
                    <span>{Math.round(((currentMatchday - 1) / maxMatchdays) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${((currentMatchday - 1) / maxMatchdays) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold text-white">{teamStats.played}</p>
                    <p className="text-[9px] text-gray-500">Played</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold text-white">{maxMatchdays - (currentMatchday - 1)}</p>
                    <p className="text-[9px] text-gray-500">Remaining</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold text-purple-400">{teamStats.pointsPerGame}</p>
                    <p className="text-[9px] text-gray-500">PPG</p>
                  </div>
                </div>
              </div>
              
              {/* Goals Overview */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Goals</SectionLabel>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <p className="text-2xl font-bold text-green-400">{teamStats.goalsScored}</p>
                    <p className="text-[9px] text-gray-500">Scored</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-500/10">
                    <p className="text-2xl font-bold text-red-400">{teamStats.goalsConceded}</p>
                    <p className="text-[9px] text-gray-500">Conceded</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-500/10">
                    <p className="text-2xl font-bold text-blue-400">{teamStats.cleanSheets}</p>
                    <p className="text-[9px] text-gray-500">Clean Sheets</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-500/10">
                    <p className="text-2xl font-bold text-orange-400">{teamStats.goalsPerGame}</p>
                    <p className="text-[9px] text-gray-500">Per Game</p>
                  </div>
                </div>
              </div>
              
              {/* Career Summary */}
              {seasonHistory.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <SectionLabel>Career Summary</SectionLabel>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center p-2 rounded-lg bg-white/5">
                      <p className="text-lg font-bold text-white">{careerStats.seasonsManaged}</p>
                      <p className="text-[9px] text-gray-500">Seasons</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-yellow-500/10">
                      <p className="text-lg font-bold text-yellow-400">{careerStats.championships}</p>
                      <p className="text-[9px] text-gray-500">Titles</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-green-500/10">
                      <p className="text-lg font-bold text-green-400">{careerStats.winRate}%</p>
                      <p className="text-[9px] text-gray-500">Win Rate</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TEAM TAB */}
          {activeTab === "team" && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* W/D/L Breakdown */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Results Breakdown</SectionLabel>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-3xl font-bold text-green-400">{teamStats.wins}</p>
                    <p className="text-xs text-gray-400 mt-1">Wins</p>
                    <p className="text-[10px] text-green-400/60">{teamStats.played > 0 ? Math.round((teamStats.wins / teamStats.played) * 100) : 0}%</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-3xl font-bold text-yellow-400">{teamStats.draws}</p>
                    <p className="text-xs text-gray-400 mt-1">Draws</p>
                    <p className="text-[10px] text-yellow-400/60">{teamStats.played > 0 ? Math.round((teamStats.draws / teamStats.played) * 100) : 0}%</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-3xl font-bold text-red-400">{teamStats.losses}</p>
                    <p className="text-xs text-gray-400 mt-1">Losses</p>
                    <p className="text-[10px] text-red-400/60">{teamStats.played > 0 ? Math.round((teamStats.losses / teamStats.played) * 100) : 0}%</p>
                  </div>
                </div>
              </div>
              
              {/* Home vs Away */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Home vs Away</SectionLabel>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {/* Home */}
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Home size={16} className="text-blue-400" />
                      <span className="text-sm font-medium text-white">Home</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Played</span>
                        <span className="text-white font-medium">{teamStats.home.played}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">W-D-L</span>
                        <span className="text-white font-medium">{teamStats.home.wins}-{teamStats.home.draws}-{teamStats.home.losses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Goals</span>
                        <span className="text-white font-medium">{teamStats.home.gf}-{teamStats.home.ga}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Points</span>
                        <span className="text-blue-400 font-medium">{teamStats.home.wins * 3 + teamStats.home.draws}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Away */}
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Plane size={16} className="text-orange-400" />
                      <span className="text-sm font-medium text-white">Away</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Played</span>
                        <span className="text-white font-medium">{teamStats.away.played}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">W-D-L</span>
                        <span className="text-white font-medium">{teamStats.away.wins}-{teamStats.away.draws}-{teamStats.away.losses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Goals</span>
                        <span className="text-white font-medium">{teamStats.away.gf}-{teamStats.away.ga}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Points</span>
                        <span className="text-orange-400 font-medium">{teamStats.away.wins * 3 + teamStats.away.draws}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Streaks */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Streaks</SectionLabel>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <Flame size={18} className="mx-auto text-green-400 mb-1" />
                    <p className="text-xl font-bold text-green-400">{teamStats.longestWinStreak}</p>
                    <p className="text-[9px] text-gray-500">Best Win Streak</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-500/10">
                    <Shield size={18} className="mx-auto text-blue-400 mb-1" />
                    <p className="text-xl font-bold text-blue-400">{teamStats.longestUnbeatenStreak}</p>
                    <p className="text-[9px] text-gray-500">Best Unbeaten</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-500/10">
                    <TrendingDown size={18} className="mx-auto text-red-400 mb-1" />
                    <p className="text-xl font-bold text-red-400">{teamStats.longestLossStreak}</p>
                    <p className="text-[9px] text-gray-500">Worst Loss Streak</p>
                  </div>
                </div>
              </div>
              
              {/* Scoring Stats */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Scoring Stats</SectionLabel>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Goals Per Game</p>
                    <p className="text-xl font-bold text-green-400">{teamStats.goalsPerGame}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Conceded Per Game</p>
                    <p className="text-xl font-bold text-red-400">{teamStats.concededPerGame}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Clean Sheets</p>
                    <p className="text-xl font-bold text-blue-400">{teamStats.cleanSheets}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Failed to Score</p>
                    <p className="text-xl font-bold text-orange-400">{teamStats.failedToScore}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SQUAD TAB */}
          {activeTab === "squad" && (
            <motion.div
              key="squad"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Squad Overview */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Squad Overview</SectionLabel>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="text-center p-3 rounded-lg bg-purple-500/10">
                    <p className="text-2xl font-bold text-purple-400">{squadStats.total}</p>
                    <p className="text-[9px] text-gray-500">Players</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <p className="text-2xl font-bold text-green-400">{squadStats.avgRating}</p>
                    <p className="text-[9px] text-gray-500">Avg Rating</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-500/10">
                    <p className="text-2xl font-bold text-blue-400">{squadStats.avgAge}</p>
                    <p className="text-[9px] text-gray-500">Avg Age</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                    <p className="text-lg font-bold text-yellow-400">€{formatMoney(squadStats.totalValue)}</p>
                    <p className="text-[9px] text-gray-500">Total Value</p>
                  </div>
                </div>
              </div>
              
              {/* Position Breakdown */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Position Breakdown</SectionLabel>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                    <p className="text-xl font-bold text-yellow-400">{squadStats.goalkeepers}</p>
                    <p className="text-[9px] text-gray-500">GK</p>
                    <p className="text-[8px] text-yellow-400/60">Avg: {squadStats.avgRatingByPosition.GK}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-500/10">
                    <p className="text-xl font-bold text-blue-400">{squadStats.defenders}</p>
                    <p className="text-[9px] text-gray-500">DEF</p>
                    <p className="text-[8px] text-blue-400/60">Avg: {squadStats.avgRatingByPosition.DEF}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <p className="text-xl font-bold text-green-400">{squadStats.midfielders}</p>
                    <p className="text-[9px] text-gray-500">MID</p>
                    <p className="text-[8px] text-green-400/60">Avg: {squadStats.avgRatingByPosition.MID}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-500/10">
                    <p className="text-xl font-bold text-red-400">{squadStats.forwards}</p>
                    <p className="text-[9px] text-gray-500">FWD</p>
                    <p className="text-[8px] text-red-400/60">Avg: {squadStats.avgRatingByPosition.FWD}</p>
                  </div>
                </div>
              </div>
              
              {/* Top Rated */}
              <CollapsibleSection
                title="Top Rated Players"
                icon={Star}
                expanded={expandedSection === "topRated"}
                onToggle={() => setExpandedSection(expandedSection === "topRated" ? null : "topRated")}
              >
                <div className="space-y-2">
                  {squadStats.topRated.map((player, i) => (
                    <StatsPlayerRow key={player.id} player={player} rank={i + 1} highlight="rating" />
                  ))}
                </div>
              </CollapsibleSection>
              
              {/* Most Valuable */}
              <CollapsibleSection
                title="Most Valuable"
                icon={DollarSign}
                expanded={expandedSection === "valuable"}
                onToggle={() => setExpandedSection(expandedSection === "valuable" ? null : "valuable")}
              >
                <div className="space-y-2">
                  {squadStats.mostValuable.map((player, i) => (
                    <StatsPlayerRow key={player.id} player={player} rank={i + 1} highlight="value" />
                  ))}
                </div>
              </CollapsibleSection>
              
              {/* Youngest */}
              {squadStats.youngest.length > 0 && (
                <CollapsibleSection
                  title="Youngest Players"
                  icon={TrendingUp}
                  expanded={expandedSection === "youngest"}
                  onToggle={() => setExpandedSection(expandedSection === "youngest" ? null : "youngest")}
                >
                  <div className="space-y-2">
                    {squadStats.youngest.map((player, i) => (
                      <StatsPlayerRow key={player.id} player={player} rank={i + 1} highlight="age" />
                    ))}
                  </div>
                </CollapsibleSection>
              )}
              
              {/* Nationalities */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Nationalities</SectionLabel>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(squadStats.nationalities)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([nat, count]) => (
                      <span key={nat} className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-300">
                        {nat}: <span className="text-purple-400 font-medium">{count}</span>
                      </span>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* LEAGUE TAB */}
          {activeTab === "league" && (
            <motion.div
              key="league"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Your Position */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Current Position</p>
                    <p className="text-4xl font-bold text-white">{leagueStats.position}<span className="text-lg text-gray-400">{getOrdinal(leagueStats.position)}</span></p>
                  </div>
                  <div className="text-right">
                    {leagueStats.pointsOffTop > 0 ? (
                      <>
                        <p className="text-xs text-gray-400">Points off top</p>
                        <p className="text-2xl font-bold text-red-400">-{leagueStats.pointsOffTop}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="text-lg font-bold text-green-400">🏆 Leader</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* League Overview */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>League Overview</SectionLabel>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Total Goals</p>
                    <p className="text-xl font-bold text-white">{leagueStats.totalGoals}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Avg Goals/Game</p>
                    <p className="text-xl font-bold text-purple-400">{leagueStats.avgGoalsPerGame}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Matches Played</p>
                    <p className="text-xl font-bold text-white">{leagueStats.matchesPlayed}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-400">Teams</p>
                    <p className="text-xl font-bold text-white">{leagueStats.totalTeams}</p>
                  </div>
                </div>
              </div>
              
              {/* Home/Away/Draw Distribution */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Result Distribution</SectionLabel>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-3 rounded-lg bg-blue-500/10">
                    <Home size={16} className="mx-auto text-blue-400 mb-1" />
                    <p className="text-xl font-bold text-blue-400">{leagueStats.homeWins}</p>
                    <p className="text-[9px] text-gray-500">Home Wins</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                    <p className="text-xl font-bold text-yellow-400">{leagueStats.draws}</p>
                    <p className="text-[9px] text-gray-500">Draws</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-500/10">
                    <Plane size={16} className="mx-auto text-orange-400 mb-1" />
                    <p className="text-xl font-bold text-orange-400">{leagueStats.awayWins}</p>
                    <p className="text-[9px] text-gray-500">Away Wins</p>
                  </div>
                </div>
              </div>
              
              {/* Top Scorers (Teams) */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Top Scoring Teams</SectionLabel>
                <div className="space-y-2 mt-3">
                  {leagueStats.topScorers.map((team, i) => (
                    <div key={team.club.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                        i === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-white/10 text-gray-400"
                      }`}>{i + 1}</span>
                      <ClubLogo clubId={team.club.id} size={24} />
                      <span className={`flex-1 text-sm ${team.club.id === club.id ? "text-purple-400 font-medium" : "text-white"}`}>
                        {getDisplayShortName(team.club.id, team.club.shortName)}
                      </span>
                      <span className="text-green-400 font-bold">{team.gf}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Best Defense */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Best Defense</SectionLabel>
                <div className="space-y-2 mt-3">
                  {leagueStats.bestDefense.map((team, i) => (
                    <div key={team.club.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                        i === 0 ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-gray-400"
                      }`}>{i + 1}</span>
                      <ClubLogo clubId={team.club.id} size={24} />
                      <span className={`flex-1 text-sm ${team.club.id === club.id ? "text-purple-400 font-medium" : "text-white"}`}>
                        {getDisplayShortName(team.club.id, team.club.shortName)}
                      </span>
                      <span className="text-blue-400 font-bold">{team.ga}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* RECORDS TAB */}
          {activeTab === "records" && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Biggest Win */}
              {teamStats.biggestWin.match && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy size={18} className="text-green-400" />
                    <SectionLabel>Biggest Win</SectionLabel>
                  </div>
                  <MatchCard match={teamStats.biggestWin.match} clubId={club.id} getDisplayShortName={getDisplayShortName} />
                  <p className="text-center text-xs text-green-400 mt-2">+{teamStats.biggestWin.margin} goal margin</p>
                </div>
              )}
              
              {/* Biggest Loss */}
              {teamStats.biggestLoss.match && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown size={18} className="text-red-400" />
                    <SectionLabel>Biggest Loss</SectionLabel>
                  </div>
                  <MatchCard match={teamStats.biggestLoss.match} clubId={club.id} getDisplayShortName={getDisplayShortName} />
                  <p className="text-center text-xs text-red-400 mt-2">-{teamStats.biggestLoss.margin} goal margin</p>
                </div>
              )}
              
              {/* Highest Scoring */}
              {teamStats.highestScoring.match && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame size={18} className="text-yellow-400" />
                    <SectionLabel>Highest Scoring Match</SectionLabel>
                  </div>
                  <MatchCard match={teamStats.highestScoring.match} clubId={club.id} getDisplayShortName={getDisplayShortName} />
                  <p className="text-center text-xs text-yellow-400 mt-2">{teamStats.highestScoring.total} total goals</p>
                </div>
              )}
              
              {/* Season Records */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Season Records</SectionLabel>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <p className="text-xs text-gray-400">Best Win Streak</p>
                    <p className="text-xl font-bold text-green-400">{teamStats.longestWinStreak} games</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <p className="text-xs text-gray-400">Best Unbeaten Run</p>
                    <p className="text-xl font-bold text-blue-400">{teamStats.longestUnbeatenStreak} games</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <p className="text-xs text-gray-400">Clean Sheets</p>
                    <p className="text-xl font-bold text-purple-400">{teamStats.cleanSheets}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500/10">
                    <p className="text-xs text-gray-400">Goals Scored</p>
                    <p className="text-xl font-bold text-yellow-400">{teamStats.goalsScored}</p>
                  </div>
                </div>
              </div>
              
              {/* Career Records */}
              {seasonHistory.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <SectionLabel>Career Records</SectionLabel>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-gray-400">Best Finish</p>
                      <p className="text-xl font-bold text-green-400">{careerStats.bestFinish}{getOrdinal(careerStats.bestFinish)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-gray-400">Worst Finish</p>
                      <p className="text-xl font-bold text-red-400">{careerStats.worstFinish}{getOrdinal(careerStats.worstFinish)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-gray-400">Total Wins</p>
                      <p className="text-xl font-bold text-white">{careerStats.totalWins}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-gray-400">Total Goals</p>
                      <p className="text-xl font-bold text-white">{careerStats.totalGoalsFor}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-500/10 col-span-2">
                      <p className="text-xs text-gray-400">Championships</p>
                      <p className="text-2xl font-bold text-yellow-400">{careerStats.championships} 🏆</p>
                    </div>
                  </div>
                </div>
              )}
              
              {results.length === 0 && (
                <div className="text-center py-12">
                  <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No matches played yet</p>
                  <p className="text-gray-600 text-sm">Play matches to see your records</p>
                </div>
              )}
            </motion.div>
          )}

          {/* FINANCES TAB */}
          {activeTab === "finances" && (
            <motion.div
              key="finances"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Balance */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Current Balance</p>
                    <p className="text-3xl font-bold text-green-400">€{formatMoney(transferStats.currentBalance)}</p>
                  </div>
                  <DollarSign size={32} className="text-green-400/30" />
                </div>
              </div>
              
              {/* Transfer Summary */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Transfer Summary</SectionLabel>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-xl font-bold text-white">{transferStats.totalTransfers}</p>
                    <p className="text-[9px] text-gray-500">Total Transfers</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <p className="text-xl font-bold text-green-400">{transferStats.buys}</p>
                    <p className="text-[9px] text-gray-500">Signings</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-500/10">
                    <p className="text-xl font-bold text-red-400">{transferStats.sells}</p>
                    <p className="text-[9px] text-gray-500">Sales</p>
                  </div>
                </div>
              </div>
              
              {/* Spending */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Transfer Spending</SectionLabel>
                <div className="space-y-3 mt-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10">
                    <span className="text-sm text-gray-400">Total Spent</span>
                    <span className="text-lg font-bold text-red-400">€{formatMoney(transferStats.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10">
                    <span className="text-sm text-gray-400">Total Received</span>
                    <span className="text-lg font-bold text-green-400">€{formatMoney(transferStats.totalReceived)}</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 rounded-lg ${
                    transferStats.netSpend > 0 ? "bg-red-500/10" : "bg-green-500/10"
                  }`}>
                    <span className="text-sm text-gray-400">Net Spend</span>
                    <span className={`text-lg font-bold ${transferStats.netSpend > 0 ? "text-red-400" : "text-green-400"}`}>
                      {transferStats.netSpend > 0 ? "-" : "+"}€{formatMoney(Math.abs(transferStats.netSpend))}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Record Transfers */}
              {(transferStats.biggestBuy || transferStats.biggestSale) && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <SectionLabel>Record Transfers</SectionLabel>
                  <div className="space-y-3 mt-3">
                    {transferStats.biggestBuy && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Record Signing</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-white">{transferStats.biggestBuy.player.name}</p>
                            <p className="text-[10px] text-gray-400">{transferStats.biggestBuy.player.position} • {transferStats.biggestBuy.player.rating} OVR</p>
                          </div>
                          <p className="text-lg font-bold text-green-400">€{formatMoney(transferStats.biggestBuy.fee)}</p>
                        </div>
                      </div>
                    )}
                    {transferStats.biggestSale && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Record Sale</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-white">{transferStats.biggestSale.player.name}</p>
                            <p className="text-[10px] text-gray-400">{transferStats.biggestSale.player.position} • {transferStats.biggestSale.player.rating} OVR</p>
                          </div>
                          <p className="text-lg font-bold text-red-400">€{formatMoney(transferStats.biggestSale.fee)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Squad Value */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Squad Value</SectionLabel>
                <div className="mt-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10">
                    <span className="text-sm text-gray-400">Total Squad Value</span>
                    <span className="text-lg font-bold text-purple-400">€{formatMoney(squadStats.totalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 mt-2">
                    <span className="text-sm text-gray-400">Avg Player Value</span>
                    <span className="text-lg font-bold text-white">€{formatMoney(squadStats.total > 0 ? squadStats.totalValue / squadStats.total : 0)}</span>
                  </div>
                </div>
              </div>
              
              {/* Scouting */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <SectionLabel>Scouting Department</SectionLabel>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-3 rounded-lg bg-blue-500/10">
                    <p className="text-xl font-bold text-blue-400">{transferStats.scouts}</p>
                    <p className="text-[9px] text-gray-500">Scouts</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                    <p className="text-xl font-bold text-yellow-400">{transferStats.scoutReports}</p>
                    <p className="text-[9px] text-gray-500">Reports</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <p className="text-xl font-bold text-green-400">{transferStats.completedReports}</p>
                    <p className="text-[9px] text-gray-500">Completed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


// Helper Components
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
      {children}
    </span>
  );
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function formatMoney(amount: number): string {
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return amount.toString();
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon: Icon, expanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-purple-400" />
          <SectionLabel>{title}</SectionLabel>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StatsPlayerRowProps {
  player: { id: number; name: string; position: string; rating: number; value?: number; age?: number; nationality?: string; number: number; x: number; y: number };
  rank: number;
  highlight: "rating" | "value" | "age";
}

function StatsPlayerRow({ player, rank, highlight }: StatsPlayerRowProps) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <div 
        className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
        onClick={() => setShowModal(true)}
      >
        <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
          rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
          rank === 2 ? "bg-gray-400/20 text-gray-400" :
          rank === 3 ? "bg-orange-600/20 text-orange-500" :
          "bg-white/10 text-gray-500"
        }`}>
          {rank}
        </span>
        <span className="text-base">{getFlag(player.nationality)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{player.name}</p>
          <p className="text-[10px] text-gray-500">{player.position}</p>
        </div>
        {highlight === "rating" && (
          <span className="text-lg font-bold text-green-400">{player.rating}</span>
        )}
        {highlight === "value" && (
          <span className="text-sm font-bold text-yellow-400">€{formatMoney(player.value || 0)}</span>
        )}
        {highlight === "age" && (
          <span className="text-lg font-bold text-blue-400">{player.age || "?"}</span>
        )}
      </div>
      
      <PlayerInfoModal
        player={player}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

interface MatchCardProps {
  match: {
    home: { id: number; shortName: string };
    away: { id: number; shortName: string };
    homeScore: number;
    awayScore: number;
    matchday: number;
  };
  clubId: number;
  getDisplayShortName: (id: number, name: string) => string;
}

function MatchCard({ match, clubId, getDisplayShortName }: MatchCardProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-3 rounded-lg bg-white/5">
      <div className="flex items-center gap-2">
        <ClubLogo clubId={match.home.id} size={28} />
        <span className={`text-sm font-medium ${match.home.id === clubId ? "text-purple-400" : "text-white"}`}>
          {getDisplayShortName(match.home.id, match.home.shortName)}
        </span>
      </div>
      <div className="flex items-center gap-2 px-3">
        <span className="text-xl font-bold text-white">{match.homeScore}</span>
        <span className="text-gray-600">-</span>
        <span className="text-xl font-bold text-white">{match.awayScore}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${match.away.id === clubId ? "text-purple-400" : "text-white"}`}>
          {getDisplayShortName(match.away.id, match.away.shortName)}
        </span>
        <ClubLogo clubId={match.away.id} size={28} />
      </div>
    </div>
  );
}
