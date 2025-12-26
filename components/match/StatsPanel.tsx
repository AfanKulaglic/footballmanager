"use client";

import { useGameStore } from "@/lib/store";
import ClubLogo from "../ClubLogo";

interface StatBarProps {
  label: string;
  home: number;
  away: number;
  isPercentage?: boolean;
}

function StatBar({ label, home, away, isPercentage }: StatBarProps) {
  const total = home + away || 1;
  const homeWidth = (home / total) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-bold">{home}{isPercentage ? "%" : ""}</span>
        <span className="text-muted text-xs">{label}</span>
        <span className="font-bold">{away}{isPercentage ? "%" : ""}</span>
      </div>
      <div className="flex h-2 gap-1">
        <div className="flex-1 bg-white/10 rounded-full overflow-hidden flex justify-end">
          <div 
            className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-full transition-all duration-500"
            style={{ width: `${homeWidth}%` }}
          />
        </div>
        <div className="flex-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
            style={{ width: `${100 - homeWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface StatsPanelProps {
  inline?: boolean;
}

export default function StatsPanel({ inline = false }: StatsPanelProps) {
  const { match, matchStats } = useGameStore();

  if (!match) return null;

  const content = (
    <div className="space-y-4">
      {/* Team Headers */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ClubLogo clubId={match.home.id} size={32} />
          <span className="text-sm font-semibold">{match.home.shortName}</span>
        </div>
        <span className="text-xs text-muted">VS</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{match.away.shortName}</span>
          <ClubLogo clubId={match.away.id} size={32} />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <StatBar label="Possession" home={matchStats.possession[0]} away={matchStats.possession[1]} isPercentage />
        <StatBar label="Shots" home={matchStats.shots[0]} away={matchStats.shots[1]} />
        <StatBar label="On Target" home={matchStats.shotsOnTarget[0]} away={matchStats.shotsOnTarget[1]} />
        <StatBar label="Corners" home={matchStats.corners[0]} away={matchStats.corners[1]} />
        <StatBar label="Fouls" home={matchStats.fouls[0]} away={matchStats.fouls[1]} />
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  // Original floating panel behavior removed - now using inline only
  return null;
}