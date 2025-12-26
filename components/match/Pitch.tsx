"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { getSquadForClub } from "@/lib/mock";

interface PitchPlayer {
  id: number;
  num: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  team: "home" | "away";
  role: "GK" | "DEF" | "MID" | "ATT";
}

// Base positions for 4-3-3 formation
const homeBasePositions = [
  { baseX: 50, baseY: 94, role: "GK" as const },
  { baseX: 80, baseY: 82, role: "DEF" as const },
  { baseX: 60, baseY: 85, role: "DEF" as const },
  { baseX: 40, baseY: 85, role: "DEF" as const },
  { baseX: 20, baseY: 82, role: "DEF" as const },
  { baseX: 50, baseY: 65, role: "MID" as const },
  { baseX: 70, baseY: 55, role: "MID" as const },
  { baseX: 30, baseY: 55, role: "MID" as const },
  { baseX: 78, baseY: 35, role: "ATT" as const },
  { baseX: 50, baseY: 30, role: "ATT" as const },
  { baseX: 22, baseY: 35, role: "ATT" as const },
];

const awayBasePositions = [
  { baseX: 50, baseY: 6, role: "GK" as const },
  { baseX: 20, baseY: 18, role: "DEF" as const },
  { baseX: 40, baseY: 15, role: "DEF" as const },
  { baseX: 60, baseY: 15, role: "DEF" as const },
  { baseX: 80, baseY: 18, role: "DEF" as const },
  { baseX: 50, baseY: 35, role: "MID" as const },
  { baseX: 30, baseY: 45, role: "MID" as const },
  { baseX: 70, baseY: 45, role: "MID" as const },
  { baseX: 22, baseY: 65, role: "ATT" as const },
  { baseX: 50, baseY: 70, role: "ATT" as const },
  { baseX: 78, baseY: 65, role: "ATT" as const },
];

export default function Pitch() {
  const { displayedEvents, matchMinute, isMatchRunning, isPaused, squad, match } = useGameStore();
  const [players, setPlayers] = useState<PitchPlayer[]>([]);
  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(50);
  const [ballHolder, setBallHolder] = useState<number | null>(10); // Home striker starts
  const [possession, setPossession] = useState<"home" | "away">("home");
  const [passTarget, setPassTarget] = useState<{ x: number; y: number } | null>(null);
  const [isShot, setIsShot] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [goalTeam, setGoalTeam] = useState<"home" | "away">("home");
  
  const lastEvent = useRef(0);
  const simInterval = useRef<NodeJS.Timeout | null>(null);

  // Create players from actual squad data
  const createPlayers = useCallback((): PitchPlayer[] => {
    const homePlayers: PitchPlayer[] = [];
    const awayPlayers: PitchPlayer[] = [];
    
    // Home team - use actual squad numbers (first 11)
    const homeSquad = squad.slice(0, 11);
    homeSquad.forEach((player, index) => {
      const pos = homeBasePositions[index];
      homePlayers.push({
        id: index + 1,
        num: player.number,
        x: pos.baseX,
        y: pos.baseY,
        baseX: pos.baseX,
        baseY: pos.baseY,
        team: "home",
        role: pos.role,
      });
    });
    
    // Away team - get opponent squad
    if (match) {
      const awayClub = match.away;
      const awaySquad = getSquadForClub(awayClub).slice(0, 11);
      awaySquad.forEach((player, index) => {
        const pos = awayBasePositions[index];
        awayPlayers.push({
          id: index + 12,
          num: player.number,
          x: pos.baseX,
          y: pos.baseY,
          baseX: pos.baseX,
          baseY: pos.baseY,
          team: "away",
          role: pos.role,
        });
      });
    } else {
      // Fallback if no match
      awayBasePositions.forEach((pos, index) => {
        awayPlayers.push({
          id: index + 12,
          num: index + 1,
          x: pos.baseX,
          y: pos.baseY,
          baseX: pos.baseX,
          baseY: pos.baseY,
          team: "away",
          role: pos.role,
        });
      });
    }
    
    return [...homePlayers, ...awayPlayers];
  }, [squad, match]);

  // Initialize players when squad changes
  useEffect(() => {
    if (squad.length > 0) {
      setPlayers(createPlayers());
    }
  }, [squad, createPlayers]);

  // Get player by ID
  const getPlayer = useCallback((id: number) => players.find(p => p.id === id), [players]);

  // Check if opponent is nearby (for tackle)
  const checkTackle = useCallback((holder: PitchPlayer): PitchPlayer | null => {
    const opponents = players.filter(p => p.team !== holder.team);
    for (const opp of opponents) {
      const dist = Math.sqrt(Math.pow(opp.x - holder.x, 2) + Math.pow(opp.y - holder.y, 2));
      if (dist < 8 && Math.random() < 0.15) {
        return opp; // Tackle successful
      }
    }
    return null;
  }, [players]);

  // Find best pass target
  const findPassTarget = useCallback((holder: PitchPlayer): PitchPlayer | null => {
    const teammates = players.filter(p => p.team === holder.team && p.id !== holder.id);
    // Prefer forward passes
    const forward = teammates.filter(p => 
      holder.team === "home" ? p.y < holder.y : p.y > holder.y
    );
    const candidates = forward.length > 0 ? forward : teammates;
    return candidates[Math.floor(Math.random() * candidates.length)] || null;
  }, [players]);

  // Execute pass
  const doPass = useCallback((_from: PitchPlayer, to: PitchPlayer) => {
    setPassTarget({ x: to.x, y: to.y });
    
    // Animate ball
    setTimeout(() => {
      setBallX(to.x);
      setBallY(to.y);
      setBallHolder(to.id);
      setPassTarget(null);
    }, 250);
  }, []);

  // Execute shot
  const doShot = useCallback((shooter: PitchPlayer, isGoal: boolean) => {
    const goalY = shooter.team === "home" ? 2 : 98;
    const goalX = 45 + Math.random() * 10;
    
    setIsShot(true);
    setPassTarget({ x: goalX, y: goalY });
    setBallHolder(null);
    
    setTimeout(() => {
      setBallX(goalX);
      setBallY(goalY);
      setPassTarget(null);
      setIsShot(false);
      
      if (isGoal) {
        setGoalTeam(shooter.team);
        setShowGoal(true);
        setTimeout(() => {
          setShowGoal(false);
          // Reset - team that conceded kicks off
          setBallX(50);
          setBallY(50);
          setPlayers(createPlayers());
          // If home scored, away kicks off (and vice versa)
          const kickOffTeam = shooter.team === "home" ? "away" : "home";
          setBallHolder(kickOffTeam === "home" ? 10 : 21);
          setPossession(kickOffTeam);
        }, 2500);
      } else {
        // Saved - give to opponent GK
        const gk = players.find(p => p.role === "GK" && p.team !== shooter.team);
        if (gk) {
          setBallX(gk.x);
          setBallY(gk.y);
          setBallHolder(gk.id);
          setPossession(gk.team);
        }
      }
    }, 400);
  }, [players, createPlayers]);

  // Main simulation loop
  useEffect(() => {
    if (!isMatchRunning || isPaused) {
      if (simInterval.current) clearInterval(simInterval.current);
      return;
    }

    simInterval.current = setInterval(() => {
      const holder = ballHolder !== null ? getPlayer(ballHolder) : null;
      
      if (holder && !passTarget && !showGoal) {
        // Check for tackle first
        const tackler = checkTackle(holder);
        if (tackler) {
          // Possession lost - give ball to tackler
          setBallHolder(tackler.id);
          setBallX(tackler.x);
          setBallY(tackler.y);
          setPossession(tackler.team);
          return;
        }

        // Chance to pass or shoot
        const rand = Math.random();
        const inShootingRange = holder.team === "home" ? holder.y < 25 : holder.y > 75;
        
        if (inShootingRange && rand < 0.08 && holder.role !== "GK") {
          // Shoot (miss)
          doShot(holder, false);
        } else if (rand < 0.4) {
          // Pass
          const target = findPassTarget(holder);
          if (target) doPass(holder, target);
        }
      }

      // Move players
      setPlayers(prev => prev.map(p => {
        const isHolder = p.id === ballHolder;
        let nx = p.x, ny = p.y;

        if (isHolder) {
          // Move toward goal
          const goalDir = p.team === "home" ? -1 : 1;
          ny += goalDir * (1 + Math.random() * 2);
          nx += (Math.random() - 0.5) * 3;
        } else if (p.team === possession) {
          // Support attack
          const shift = possession === "home" ? -5 : 5;
          ny += ((p.baseY + shift) - ny) * 0.08;
          nx += (Math.random() - 0.5) * 2;
        } else {
          // Defend - return to base
          ny += (p.baseY - ny) * 0.1;
          nx += (p.baseX - nx) * 0.08;
        }

        // Bounds
        const minY = p.role === "GK" ? (p.team === "home" ? 88 : 3) : 8;
        const maxY = p.role === "GK" ? (p.team === "home" ? 97 : 12) : 92;
        nx = Math.max(8, Math.min(92, nx));
        ny = Math.max(minY, Math.min(maxY, ny));

        return { ...p, x: nx, y: ny };
      }));

      // Ball follows holder
      if (ballHolder !== null && !passTarget) {
        const h = getPlayer(ballHolder);
        if (h) {
          setBallX(h.x);
          setBallY(h.y);
        }
      }
    }, 300);

    return () => { if (simInterval.current) clearInterval(simInterval.current); };
  }, [isMatchRunning, isPaused, ballHolder, possession, getPlayer, findPassTarget, doPass, doShot, passTarget, checkTackle, showGoal]);

  // Handle events
  useEffect(() => {
    const ev = displayedEvents[displayedEvents.length - 1];
    if (!ev || ev.minute === lastEvent.current) return;
    lastEvent.current = ev.minute;

    setPossession(ev.team);
    
    if (ev.type === "goal") {
      const attackers = players.filter(p => p.team === ev.team && p.role === "ATT");
      const shooter = attackers[Math.floor(Math.random() * attackers.length)];
      if (shooter) {
        setBallHolder(shooter.id);
        setBallX(shooter.x);
        setBallY(shooter.y);
        setTimeout(() => doShot(shooter, true), 500);
      }
    } else if (ev.type === "chance") {
      const attackers = players.filter(p => p.team === ev.team && (p.role === "ATT" || p.role === "MID"));
      const shooter = attackers[Math.floor(Math.random() * attackers.length)];
      if (shooter) {
        setBallHolder(shooter.id);
        setTimeout(() => doShot(shooter, false), 300);
      }
    } else if (ev.type === "corner") {
      const cx = Math.random() > 0.5 ? 5 : 95;
      const cy = ev.team === "home" ? 5 : 95;
      setBallX(cx);
      setBallY(cy);
      setBallHolder(null);
    } else {
      // Give ball to random player of that team
      const team = players.filter(p => p.team === ev.team && p.role !== "GK");
      const newHolder = team[Math.floor(Math.random() * team.length)];
      if (newHolder) {
        setBallHolder(newHolder.id);
        setBallX(newHolder.x);
        setBallY(newHolder.y);
      }
    }
  }, [displayedEvents, players, doShot]);

  const holder = ballHolder !== null ? getPlayer(ballHolder) : null;

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-xl overflow-hidden border border-white/20 shadow-2xl">
      {/* Pitch SVG */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="turf" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d8a4e"/>
            <stop offset="50%" stopColor="#34a058"/>
            <stop offset="100%" stopColor="#2d8a4e"/>
          </linearGradient>
          <pattern id="stripes" width="100" height="10" patternUnits="userSpaceOnUse">
            <rect width="100" height="5" fill="rgba(0,0,0,0.04)"/>
            <rect y="5" width="100" height="5" fill="rgba(255,255,255,0.02)"/>
          </pattern>
        </defs>
        
        <rect width="100" height="100" fill="url(#turf)"/>
        <rect width="100" height="100" fill="url(#stripes)"/>
        
        {/* Lines */}
        <g stroke="rgba(255,255,255,0.85)" strokeWidth="0.35" fill="none">
          <rect x="5" y="5" width="90" height="90" rx="0.5"/>
          <line x1="5" y1="50" x2="95" y2="50"/>
          <circle cx="50" cy="50" r="9"/>
          <circle cx="50" cy="50" r="0.6" fill="rgba(255,255,255,0.85)"/>
          
          {/* Top penalty */}
          <rect x="27" y="5" width="46" height="14"/>
          <rect x="37" y="5" width="26" height="5"/>
          <path d="M 37 19 Q 50 22 63 19"/>
          <circle cx="50" cy="12" r="0.4" fill="rgba(255,255,255,0.85)"/>
          
          {/* Top goal */}
          <rect x="42" y="2" width="16" height="3" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5"/>
          
          {/* Bottom penalty */}
          <rect x="27" y="81" width="46" height="14"/>
          <rect x="37" y="90" width="26" height="5"/>
          <path d="M 37 81 Q 50 78 63 81"/>
          <circle cx="50" cy="88" r="0.4" fill="rgba(255,255,255,0.85)"/>
          
          {/* Bottom goal */}
          <rect x="42" y="95" width="16" height="3" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5"/>
          
          {/* Corners */}
          <path d="M 5 7 A 2 2 0 0 0 7 5"/>
          <path d="M 93 5 A 2 2 0 0 0 95 7"/>
          <path d="M 5 93 A 2 2 0 0 1 7 95"/>
          <path d="M 93 95 A 2 2 0 0 1 95 93"/>
        </g>

        {/* Pass/Shot line */}
        {passTarget && holder && (
          <motion.line
            x1={holder.x} y1={holder.y}
            x2={passTarget.x} y2={passTarget.y}
            stroke={isShot ? "#f87171" : "#fcd34d"}
            strokeWidth={isShot ? "0.7" : "0.4"}
            strokeDasharray={isShot ? "0" : "1.5 1"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </svg>

      {/* Players */}
      {players.map(p => (
        <motion.div
          key={p.id}
          animate={{ left: `${p.x}%`, top: `${p.y}%` }}
          transition={{ type: "tween", duration: 0.28, ease: "linear" }}
          className="absolute flex flex-col items-center"
          style={{ transform: "translate(-50%, -50%)", zIndex: p.id === ballHolder ? 20 : 10 }}
        >
          {/* Player circle */}
          <div className={`
            w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold
            border-2 shadow-md transition-all duration-150
            ${p.team === "home" 
              ? "bg-gradient-to-b from-gray-700 to-gray-900 border-white text-white" 
              : "bg-gradient-to-b from-red-500 to-red-700 border-white text-white"}
            ${p.id === ballHolder ? "ring-2 ring-yellow-400 scale-110" : ""}
          `}>
            {p.num}
          </div>
        </motion.div>
      ))}

      {/* Ball */}
      <motion.div
        animate={{ 
          left: passTarget ? `${passTarget.x}%` : `${ballX}%`,
          top: passTarget ? `${passTarget.y}%` : `${ballY}%`,
          scale: isShot ? 1.3 : 1
        }}
        transition={{ 
          type: "tween", 
          duration: isShot ? 0.35 : 0.22,
          ease: isShot ? "easeIn" : "linear"
        }}
        className="absolute w-3.5 h-3.5 rounded-full z-30"
        style={{ 
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle at 35% 35%, #ffffff, #d1d5db)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(0,0,0,0.2)"
        }}
      />

      {/* Goal overlay */}
      <AnimatePresence>
        {showGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-center"
            >
              <div className="text-6xl mb-3">⚽</div>
              <div className="text-4xl font-black text-green-400 tracking-wider">GOAL!</div>
              <div className={`mt-2 text-lg font-semibold ${goalTeam === "home" ? "text-gray-300" : "text-red-400"}`}>
                {goalTeam === "home" ? "Home" : "Away"} scores!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info HUD */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
        <div className="bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-2">
          <span className="text-green-400 font-bold text-xs">{matchMinute}'</span>
        </div>
        <div className={`px-2.5 py-1 rounded-md text-xs font-bold ${
          possession === "home" ? "bg-gray-700/90" : "bg-red-600/90"
        }`}>
          {possession.toUpperCase()}
        </div>
      </div>
    </div>
  );
}