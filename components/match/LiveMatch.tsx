"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { useGameStore } from "@/lib/store";
import Pitch from "./Pitch";
import MatchActions from "./MatchActions";
import EventFeed from "./EventFeed";
import LiveScores from "./LiveScores";
import ClubLogo from "../ClubLogo";

export default function LiveMatch() {
  const {
    match,
    isMatchRunning,
    matchMinute,
    currentScore,
    matchStats,
    matchSpeed,
    isPaused,
    startMatch,
    updateOtherMatchesMinute,
  } = useGameStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!hasStartedRef.current && match && !isMatchRunning) {
      hasStartedRef.current = true;
      startMatch();
    }
  }, [startMatch, match, isMatchRunning]);

  useEffect(() => {
    return () => {
      hasStartedRef.current = false;
    };
  }, [match?.id]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const state = useGameStore.getState();
    if (!state.isMatchRunning || state.isPaused || state.matchMinute >= 90) return;

    intervalRef.current = setInterval(() => {
      const s = useGameStore.getState();
      if (s.matchMinute < 90 && !s.isPaused) {
        const newMinute = s.matchMinute + 1;
        s.updateMatchMinute(newMinute);
        s.updateOtherMatchesMinute(newMinute);
      } else if (s.matchMinute >= 90 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000 / matchSpeed);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isMatchRunning, isPaused, matchSpeed]);

  if (!match) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <Zap size={48} className="mx-auto mb-4 text-slate-700" />
          <p className="text-slate-500">No match available</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-green-600 rounded-lg text-sm font-semibold">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const isFinished = matchMinute >= 90;

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0f]">
      {/* Scoreboard */}
      <div className="bg-[#14141e] border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-1">
              <ClubLogo clubId={match.home.id} size={48} />
              <div className="hidden sm:block">
                <p className="font-semibold text-sm text-white">{match.home.name}</p>
                <p className="text-[10px] text-slate-600 uppercase">Home</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 px-6">
              <motion.span
                key={`h-${currentScore[0]}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl sm:text-5xl font-bold text-white font-display"
              >
                {currentScore[0]}
              </motion.span>
              
              <div className="flex flex-col items-center">
                <span className="text-slate-600 text-lg">-</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                  isFinished ? "bg-yellow-500/15 text-yellow-500" : "bg-green-500/15 text-green-500"
                }`}>
                  <Clock size={10} />
                  <span>{isFinished ? "FT" : `${matchMinute}'`}</span>
                </div>
              </div>
              
              <motion.span
                key={`a-${currentScore[1]}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl sm:text-5xl font-bold text-white font-display"
              >
                {currentScore[1]}
              </motion.span>
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="hidden sm:block text-right">
                <p className="font-semibold text-sm text-white">{match.away.name}</p>
                <p className="text-[10px] text-slate-600 uppercase">Away</p>
              </div>
              <ClubLogo clubId={match.away.id} size={48} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mt-4 pt-3 border-t border-white/[0.04]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold text-white">{matchStats.possession[0]}%</span>
                <div className="w-16 h-1.5 bg-[#1a1a28] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${matchStats.possession[0]}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-white">{matchStats.possession[1]}%</span>
              </div>
              <p className="text-[9px] text-slate-600 mt-1 uppercase">Possession</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{matchStats.shots[0]} - {matchStats.shots[1]}</p>
              <p className="text-[9px] text-slate-600 uppercase">Shots</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{matchStats.corners[0]} - {matchStats.corners[1]}</p>
              <p className="text-[9px] text-slate-600 uppercase">Corners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Pitch */}
          <div className="min-h-[280px]">
            <Pitch key={match?.id} />
          </div>

          {/* Match Controls - Prominent Section */}
          {!isFinished && (
            <div className="bg-gradient-to-r from-[#1a1a28] via-[#1e1e30] to-[#1a1a28] rounded-2xl border border-white/[0.08] p-4">
              <MatchActions />
            </div>
          )}

          {/* Event Feed */}
          <div className="h-[280px]">
            <EventFeed />
          </div>

          {/* Live Scores - Last Section */}
          <LiveScores />
        </div>
      </div>
    </div>
  );
}
