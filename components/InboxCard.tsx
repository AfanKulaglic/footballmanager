"use client";

import Link from "next/link";
import { Mail, ChevronRight, DollarSign, Eye, FileText, Users, AlertTriangle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import { cn } from "@/lib/utils";

function formatMoney(amount: number): string {
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
}

const typeIcons: Record<string, any> = {
  board: Users,
  match_report: FileText,
  form: Trophy,
  player: AlertTriangle,
  milestone: Trophy,
  news: FileText,
  staff: Mail,
};

const typeColors: Record<string, string> = {
  board: "bg-purple-500/15 text-purple-500",
  match_report: "bg-slate-500/15 text-slate-400",
  form: "bg-emerald-500/15 text-emerald-500",
  player: "bg-orange-500/15 text-orange-500",
  milestone: "bg-indigo-500/15 text-indigo-500",
  news: "bg-yellow-500/15 text-yellow-500",
  staff: "bg-blue-500/15 text-blue-500",
};

const priorityBorder: Record<string, string> = {
  urgent: "border-l-2 border-l-red-500",
  high: "border-l-2 border-l-orange-500",
  normal: "",
  low: "",
};

export default function InboxCard() {
  const { transferOffers, scoutReports, inboxMessages } = useGameStore();
  const { getDisplayName } = useClubNames();

  const pendingOffers = transferOffers.filter(o => o.status === "pending" && o.type === "incoming");
  const pendingScouts = scoutReports.filter(r => r.status === "scouting");
  const completedScouts = scoutReports.filter(r => r.status === "completed").slice(-2);
  
  // Get unread inbox messages (most recent first)
  const unreadInboxMessages = inboxMessages.filter(m => !m.read).slice(0, 3);
  
  // Priority messages (board, urgent)
  const priorityMessages = unreadInboxMessages.filter(m => 
    m.type === "board" || m.priority === "urgent" || m.priority === "high"
  );
  
  // Other unread messages
  const otherMessages = unreadInboxMessages.filter(m => 
    m.type !== "board" && m.priority !== "urgent" && m.priority !== "high"
  );

  const totalUnread = pendingOffers.length + completedScouts.length + unreadInboxMessages.length;

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
            <p className="text-[11px] text-slate-600 mt-1">Play matches to receive messages</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Priority inbox messages (board, urgent) */}
            {priorityMessages.slice(0, 2).map((msg) => {
              const Icon = typeIcons[msg.type] || Mail;
              const colorClass = typeColors[msg.type] || "bg-slate-500/15 text-slate-400";
              
              return (
                <Link key={msg.id} href="/inbox">
                  <div className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/15 transition-colors",
                    priorityBorder[msg.priority]
                  )}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colorClass)}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {msg.subject}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {msg.from} • MD {msg.matchday}
                      </p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                </Link>
              );
            })}
            
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

            {/* Other inbox messages (match reports, form, etc.) */}
            {otherMessages.slice(0, 2).map((msg) => {
              const Icon = typeIcons[msg.type] || FileText;
              const colorClass = typeColors[msg.type] || "bg-slate-500/15 text-slate-400";
              
              return (
                <Link key={msg.id} href="/inbox">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#12121a] hover:bg-white/5 transition-colors">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colorClass)}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-300 truncate">
                        {msg.subject}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {msg.from}
                      </p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                </Link>
              );
            })}

            {/* Scouting in Progress */}
            {pendingScouts.slice(0, 1).map((report) => (
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
            {completedScouts.slice(0, 1).map((report) => (
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
