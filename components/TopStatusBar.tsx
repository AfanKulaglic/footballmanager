"use client";

import Link from "next/link";
import { Wallet, Trophy, Settings, Cloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import ClubLogo from "./ClubLogo";

function formatMoney(amount: number): string {
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
}

export default function TopStatusBar() {
  const { club, manager, isSyncing, clubBalance, currentMatchday } = useGameStore();
  const { getDisplayName } = useClubNames();
  
  const displayBalance = clubBalance > 0 ? clubBalance : club.balance;

  return (
    <div className="sticky top-0 z-30 bg-[#0c0c12]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Club Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <ClubLogo clubId={club.id} size={44} />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#14141e] border border-white/10 flex items-center justify-center">
              <span className="text-[9px] font-bold text-green-500">{currentMatchday}</span>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              {getDisplayName(club.id, club.name)}
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[11px] text-slate-500">
                Rep: <span className="text-slate-400 font-medium">{club.reputation}</span>
              </span>
              <span className="text-[11px] text-slate-500">
                MD: <span className="text-green-500 font-semibold">{currentMatchday}</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats & Actions */}
        <div className="flex items-center gap-2">
          {/* Sync Status */}
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium",
            isSyncing 
              ? "bg-blue-500/10 text-blue-400" 
              : "bg-green-500/10 text-green-500"
          )}>
            {isSyncing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Cloud size={12} />
            )}
            <span className="hidden sm:inline">{isSyncing ? "Syncing" : "Saved"}</span>
          </div>
          
          {/* Balance */}
          <Link href="/transfers">
            <div className="flex items-center gap-1.5 bg-[#14141e] border border-white/[0.06] px-3 py-1.5 rounded-md hover:bg-[#1a1a28] transition-colors">
              <Wallet size={14} className="text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">{formatMoney(displayBalance)}</span>
            </div>
          </Link>
          
          {/* Trophies */}
          <div className="flex items-center gap-1.5 bg-[#14141e] border border-white/[0.06] px-3 py-1.5 rounded-md">
            <Trophy size={14} className="text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-500">{manager.trophies}</span>
          </div>

          {/* Settings */}
          <Link href="/settings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-md bg-[#14141e] border border-white/[0.06] hover:bg-[#1a1a28] transition-colors"
            >
              <Settings size={16} className="text-slate-400" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
