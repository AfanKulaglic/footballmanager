"use client";

import Link from "next/link";
import { Mail, ChevronRight, DollarSign, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";

function formatMoney(amount: number): string {
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
}

export default function InboxCard() {
  const { transferOffers, scoutReports } = useGameStore();
  const { getDisplayName } = useClubNames();

  const pendingOffers = transferOffers.filter(o => o.status === "pending" && o.type === "incoming");
  const pendingScouts = scoutReports.filter(r => r.status === "scouting");
  const completedScouts = scoutReports.filter(r => r.status === "completed").slice(-2);

  const totalUnread = pendingOffers.length + completedScouts.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#14141e] border border-white/[0.06] rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a28] border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-purple-500" />
          <span className="text-xs text-slate-300 font-semibold">Inbox</span>
        </div>
        {totalUnread > 0 && (
          <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {totalUnread}
          </span>
        )}
      </div>

      <div className="p-4">
        {totalUnread === 0 && pendingScouts.length === 0 ? (
          <div className="text-center py-6">
            <Mail size={32} className="mx-auto text-slate-700 mb-2" />
            <p className="text-sm text-slate-500">No new messages</p>
            <p className="text-[11px] text-slate-600 mt-1">Play matches to receive offers</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Transfer Offers */}
            {pendingOffers.slice(0, 2).map((offer) => (
              <Link key={offer.id} href="/inbox">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <DollarSign size={16} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      Offer: {offer.player.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {getDisplayName(offer.fromClub.id, offer.fromClub.name)} • {formatMoney(offer.fee)}
                    </p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </Link>
            ))}

            {/* Scouting in Progress */}
            {pendingScouts.slice(0, 2).map((report) => (
              <div key={report.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#12121a]">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                  <Eye size={16} className="text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">
                    Scouting: {report.player.name}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    Completes MD {report.completesAt}
                  </p>
                </div>
                <span className="text-[9px] text-yellow-500 bg-yellow-500/15 px-1.5 py-0.5 rounded">
                  In Progress
                </span>
              </div>
            ))}

            {/* Completed Scout Reports */}
            {completedScouts.map((report) => (
              <Link key={report.id} href="/transfers">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FileText size={16} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      Report: {report.player.name}
                    </p>
                    <p className={`text-[10px] ${
                      report.recommendation === "highly_recommended" ? "text-green-500" :
                      report.recommendation === "recommended" ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {report.recommendation.replace("_", " ")}
                    </p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Link */}
        <Link href="/inbox">
          <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-white/[0.04] text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
            <span>View All Messages</span>
            <ChevronRight size={12} />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
