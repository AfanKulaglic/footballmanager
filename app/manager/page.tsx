"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Star, TrendingUp, Award, Calendar, Target } from "lucide-react";
import { motion } from "framer-motion";
import ClubLogo from "@/components/ClubLogo";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <div className="w-1 h-3 bg-green-500 rounded-full" />
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
        {children}
      </span>
    </div>
  );
}

export default function ManagerPage() {
  const { manager, club, seasonHistory, currentSeason, results } = useGameStore();
  const { getDisplayName } = useClubNames();
  
  // Calculate career stats
  const totalSeasons = seasonHistory.length + 1;
  const championships = seasonHistory.filter(s => s.playerStats.champion).length;
  
  // Calculate win rate from all results
  const playerResults = results.filter(r => r.home.id === club.id || r.away.id === club.id);
  const wins = playerResults.filter(r => {
    const isHome = r.home.id === club.id;
    return isHome ? r.homeScore > r.awayScore : r.awayScore > r.homeScore;
  }).length;
  const winRate = playerResults.length > 0 ? Math.round((wins / playerResults.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0c0c12]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/settings">
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
            <h1 className="text-lg font-bold text-white">Manager Profile</h1>
            <p className="text-[10px] text-slate-500">Career Overview</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 pt-4 space-y-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[#14141e] border border-white/[0.06]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {manager.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-white">{manager.name}</p>
              <p className="text-sm text-slate-500">{getDisplayName(club.id, club.name)}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">{manager.reputation} Reputation</span>
              </div>
            </div>
            <ClubLogo clubId={club.id} size={48} />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Trophy, label: "Trophies", value: championships, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { icon: TrendingUp, label: "Win Rate", value: `${winRate}%`, color: "text-green-400", bg: "bg-green-500/10" },
            { icon: Calendar, label: "Seasons", value: totalSeasons, color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-[#14141e] border border-white/[0.06] text-center"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-500 uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Career History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <SectionLabel>Career History</SectionLabel>
          <div className="rounded-xl bg-[#14141e] border border-white/[0.06] overflow-hidden">
            <div className="p-4 flex items-center gap-3 bg-purple-500/10 border-b border-purple-500/20">
              <ClubLogo clubId={club.id} size={36} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{getDisplayName(club.id, club.name)}</p>
                <p className="text-[10px] text-slate-500">{currentSeason} - Present</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-lg bg-green-500/20 text-green-400 font-medium">
                Current
              </span>
            </div>
            
            {seasonHistory.length > 0 && seasonHistory.slice().reverse().map((season, i) => (
              <div key={season.season} className="p-4 flex items-center gap-3 border-b border-white/[0.04] last:border-0">
                <div className="w-9 h-9 rounded-lg bg-[#1a1a28] flex items-center justify-center">
                  {season.playerStats.champion ? (
                    <Trophy size={16} className="text-yellow-400" />
                  ) : (
                    <span className="text-xs font-bold text-slate-500">{season.playerStats.leaguePosition}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Season {season.season}/{(season.season + 1).toString().slice(-2)}</p>
                  <p className="text-[10px] text-slate-500">
                    {season.playerStats.won}W {season.playerStats.drawn}D {season.playerStats.lost}L • {season.playerStats.points} pts
                  </p>
                </div>
                <span className={`text-xs font-bold ${season.playerStats.champion ? "text-yellow-400" : "text-slate-400"}`}>
                  {season.playerStats.champion ? "🏆 Champion" : `${season.playerStats.leaguePosition}${getOrdinal(season.playerStats.leaguePosition)}`}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Manager Attributes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionLabel>Manager Attributes</SectionLabel>
          <div className="rounded-xl bg-[#14141e] border border-white/[0.06] p-4">
            <div className="space-y-3">
              {[
                { name: "Tactical Knowledge", value: 14, color: "bg-blue-500" },
                { name: "Man Management", value: 12, color: "bg-green-500" },
                { name: "Youth Development", value: 15, color: "bg-purple-500" },
                { name: "Discipline", value: 11, color: "bg-orange-500" },
                { name: "Motivation", value: 13, color: "bg-pink-500" },
              ].map((attr, i) => (
                <motion.div 
                  key={attr.name} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <span className="flex-1 text-xs text-slate-300">{attr.name}</span>
                  <div className="w-28 h-2 bg-[#1a1a28] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${attr.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(attr.value / 20) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white w-6 text-right">{attr.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <SectionLabel>Achievements</SectionLabel>
          <div className="rounded-xl bg-[#14141e] border border-white/[0.06] p-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Award, label: "First Win", unlocked: wins > 0, color: "text-green-400" },
                { icon: Trophy, label: "Champion", unlocked: championships > 0, color: "text-yellow-400" },
                { icon: Target, label: "10 Wins", unlocked: wins >= 10, color: "text-blue-400" },
                { icon: Star, label: "50 Rep", unlocked: manager.reputation >= 50, color: "text-purple-400" },
              ].map((achievement) => (
                <div
                  key={achievement.label}
                  className={`p-3 rounded-xl border ${
                    achievement.unlocked 
                      ? "bg-white/5 border-white/10" 
                      : "bg-[#0a0a0f] border-white/[0.04] opacity-40"
                  }`}
                >
                  <achievement.icon size={20} className={achievement.unlocked ? achievement.color : "text-slate-600"} />
                  <p className="text-xs font-medium text-white mt-2">{achievement.label}</p>
                  <p className="text-[9px] text-slate-500">{achievement.unlocked ? "Unlocked" : "Locked"}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
