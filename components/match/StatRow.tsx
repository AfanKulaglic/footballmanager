"use client";

import { motion } from "framer-motion";

interface StatRowProps {
  label: string;
  home: number;
  away: number;
  isPercentage?: boolean;
}

export default function StatRow({ label, home, away, isPercentage = false }: StatRowProps) {
  const total = home + away;
  const homePercent = total > 0 ? (home / total) * 100 : 50;
  const awayPercent = total > 0 ? (away / total) * 100 : 50;
  
  const homeWinning = home > away;
  const awayWinning = away > home;

  const formatValue = (val: number) => {
    if (isPercentage) return `${val}%`;
    if (Number.isInteger(val)) return val;
    return val.toFixed(2);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${homeWinning ? 'text-purple' : 'text-text'}`}>
          {formatValue(home)}
        </span>
        <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-bold ${awayWinning ? 'text-red' : 'text-text'}`}>
          {formatValue(away)}
        </span>
      </div>
      <div className="flex h-2 gap-1 rounded-full overflow-hidden bg-panelLight">
        <motion.div
          className={`rounded-l-full ${homeWinning ? 'bg-gradient-to-r from-purple to-accent' : 'bg-gray-600'}`}
          initial={{ width: 0 }}
          animate={{ width: `${homePercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className={`rounded-r-full ${awayWinning ? 'bg-gradient-to-l from-red to-red/60' : 'bg-gray-600'}`}
          initial={{ width: 0 }}
          animate={{ width: `${awayPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
