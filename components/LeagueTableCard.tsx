"use client";

import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import ClubLogo from "./ClubLogo";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import { leagues } from "@/lib/mock";
import { useMemo } from "react";

interface TeamStanding {
  clubId: number;
  clubName: string;
  shortName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export default function LeagueTableCard() {
  const { club, results } = useGameStore();
  const { getDisplayShortName } = useClubNames();

  const standings = useMemo(() => {
    const playerLeague = leagues.find(league => 
      league.clubs.some(c => c.id === club.id)
    );

    if (!playerLeague) return [];

    const standingsMap = new Map<number, TeamStanding>();
    
    playerLeague.clubs.forEach(c => {
      standingsMap.set(c.id, {
        clubId: c.id,
        clubName: c.name,
        shortName: c.shortName,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    });

    results.forEach(result => {
      const homeStanding = standingsMap.get(result.home.id);
      const awayStanding = standingsMap.get(result.away.id);

      if (homeStanding) {
        homeStanding.played++;
        homeStanding.goalsFor += result.homeScore;
        homeStanding.goalsAgainst += result.awayScore;
        
        if (result.homeScore > result.awayScore) {
          homeStanding.won++;
          homeStanding.points += 3;
        } else if (result.homeScore === result.awayScore) {
          homeStanding.drawn++;
          homeStanding.points += 1;
        } else {
          homeStanding.lost++;
        }
        
        homeStanding.goalDifference = homeStanding.goalsFor - homeStanding.goalsAgainst;
      }

      if (awayStanding) {
        awayStanding.played++;
        awayStanding.goalsFor += result.awayScore;
        awayStanding.goalsAgainst += result.homeScore;
        
        if (result.awayScore > result.homeScore) {
          awayStanding.won++;
          awayStanding.points += 3;
        } else if (result.awayScore === result.homeScore) {
          awayStanding.drawn++;
          awayStanding.points += 1;
        } else {
          awayStanding.lost++;
        }
        
        awayStanding.goalDifference = awayStanding.goalsFor - awayStanding.goalsAgainst;
      }
    });

    const standingsArray = Array.from(standingsMap.values());
    
    standingsArray.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.clubName.localeCompare(b.clubName);
    });

    return standingsArray;
  }, [club.id, results]);

  const playerPosition = standings.findIndex(s => s.clubId === club.id) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#14141e] border border-white/[0.06] rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a28] border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-yellow-500" />
          <span className="text-xs text-slate-300 font-semibold">League Table</span>
        </div>
        {playerPosition > 0 && (
          <span className="text-[11px] text-slate-500">
            Position: <span className="text-green-500 font-bold">{playerPosition}</span>
          </span>
        )}
      </div>

      {/* Table Header */}
      <div className="flex items-center gap-1 px-3 py-2 text-[10px] text-slate-600 uppercase tracking-wider border-b border-white/[0.04] bg-[#12121a]">
        <span className="w-6 text-center">#</span>
        <span className="w-6"></span>
        <span className="flex-1">Team</span>
        <span className="w-6 text-center">P</span>
        <span className="w-6 text-center">W</span>
        <span className="w-6 text-center">D</span>
        <span className="w-6 text-center">L</span>
        <span className="w-8 text-center">GD</span>
        <span className="w-8 text-center font-semibold">Pts</span>
      </div>

      {/* Table Body */}
      <div className="max-h-[300px] overflow-y-auto">
        {standings.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-sm">
            No matches played yet
          </div>
        ) : (
          standings.map((standing, index) => {
            const position = index + 1;
            const isPlayerTeam = standing.clubId === club.id;
            
            return (
              <div
                key={standing.clubId}
                className={`flex items-center gap-1 py-2 px-3 border-b border-white/[0.03] transition-colors ${
                  isPlayerTeam 
                    ? "bg-green-500/10" 
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <span className={`w-6 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                  position === 1 ? "bg-yellow-500/20 text-yellow-500" :
                  position <= 4 ? "bg-green-500/15 text-green-500" :
                  "text-slate-600"
                }`}>
                  {position}
                </span>
                
                <div className="w-6 flex justify-center">
                  <ClubLogo clubId={standing.clubId} size={18} />
                </div>
                
                <span className={`flex-1 text-xs font-medium truncate ${
                  isPlayerTeam ? "text-green-500" : "text-slate-300"
                }`}>
                  {getDisplayShortName(standing.clubId, standing.shortName)}
                </span>
                
                <span className="w-6 text-center text-[11px] text-slate-500">{standing.played}</span>
                <span className="w-6 text-center text-[11px] text-green-500">{standing.won}</span>
                <span className="w-6 text-center text-[11px] text-yellow-500">{standing.drawn}</span>
                <span className="w-6 text-center text-[11px] text-red-500">{standing.lost}</span>
                <span className={`w-8 text-center text-[11px] font-medium ${
                  standing.goalDifference > 0 ? "text-green-500" : 
                  standing.goalDifference < 0 ? "text-red-500" : "text-slate-500"
                }`}>
                  {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                </span>
                <span className="w-8 text-center text-xs font-bold text-white">{standing.points}</span>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
