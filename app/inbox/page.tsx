"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Briefcase, Newspaper, Users, DollarSign, Eye, Trophy, AlertTriangle, User, FileText, Trash2, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClubLogo from "@/components/ClubLogo";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useClubNames } from "@/lib/useClubName";

const typeIcons: Record<string, any> = {
  board: Users,
  transfer: Briefcase,
  news: Newspaper,
  staff: Mail,
  offer: DollarSign,
  scout: Eye,
  match_report: FileText,
  player: User,
  form: Trophy,
  milestone: Trophy,
};

const typeColors: Record<string, string> = {
  board: "from-purple-500 to-purple-700",
  transfer: "from-green-500 to-emerald-700",
  news: "from-yellow-500 to-amber-600",
  staff: "from-blue-500 to-blue-700",
  offer: "from-amber-500 to-orange-600",
  scout: "from-cyan-500 to-blue-600",
  match_report: "from-slate-500 to-slate-700",
  player: "from-pink-500 to-rose-600",
  form: "from-emerald-500 to-green-700",
  milestone: "from-indigo-500 to-purple-700",
};

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  normal: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  low: "bg-slate-600/20 text-slate-500 border-slate-600/30",
};

function formatMoney(amount: number): string {
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
}

export default function InboxPage() {
  const { club, transferOffers, scoutReports, respondToOffer, inboxMessages, markMessageRead, clearReadMessages, deleteMessage } = useGameStore();
  const { getDisplayName } = useClubNames();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  // Create messages from transfer offers, scout reports, and inbox messages
  const messages = [
    // Post-match and system messages
    ...inboxMessages.map(msg => ({
      id: msg.id,
      from: msg.from,
      subject: msg.subject,
      preview: msg.preview,
      content: msg.content,
      date: msg.matchday ? `MD ${msg.matchday}` : new Date(msg.date).toLocaleDateString(),
      read: msg.read,
      type: msg.type,
      priority: msg.priority,
      data: msg.data,
      isInboxMessage: true,
    })),
    // Transfer offers
    ...transferOffers.filter(o => o.type === "incoming").map(offer => ({
      id: offer.id,
      from: getDisplayName(offer.fromClub.id, offer.fromClub.name),
      subject: `Transfer Offer: ${offer.player.name}`,
      preview: `${formatMoney(offer.fee)} bid for your player`,
      content: `${getDisplayName(offer.fromClub.id, offer.fromClub.name)} wants to sign ${offer.player.name} for ${formatMoney(offer.fee)}.`,
      date: offer.status === "pending" ? "Pending" : offer.status === "accepted" ? "Accepted" : "Rejected",
      read: offer.status !== "pending",
      type: "offer" as const,
      priority: "high" as const,
      data: offer,
      isInboxMessage: false,
    })),
    ...transferOffers.filter(o => o.type === "outgoing").map(offer => ({
      id: offer.id,
      from: getDisplayName(offer.fromClub.id, offer.fromClub.name),
      subject: `Your Bid: ${offer.player.name}`,
      preview: `${formatMoney(offer.fee)} offer ${offer.status}`,
      content: `Your offer of ${formatMoney(offer.fee)} for ${offer.player.name} is ${offer.status}.`,
      date: offer.status === "pending" ? "Pending" : offer.status === "accepted" ? "Accepted" : "Rejected",
      read: offer.status !== "pending",
      type: "transfer" as const,
      priority: "normal" as const,
      data: offer,
      isInboxMessage: false,
    })),
    // Scout reports
    ...scoutReports.map(report => ({
      id: String(report.id),
      from: "Scout Team",
      subject: `Scout Report: ${report.player.name}`,
      preview: report.status === "completed" 
        ? `${report.recommendation.replace("_", " ")} - ${formatMoney(report.estimatedValue)}`
        : `Scouting in progress...`,
      content: report.status === "completed"
        ? `Our scouts have completed their assessment of ${report.player.name}. Recommendation: ${report.recommendation.replace("_", " ")}. Estimated value: ${formatMoney(report.estimatedValue)}.`
        : `Scouting ${report.player.name} - report will be ready on matchday ${report.completesAt}.`,
      date: report.status === "completed" ? "Complete" : `MD ${report.completesAt}`,
      read: report.status === "completed",
      type: "scout" as const,
      priority: "normal" as const,
      data: report,
      isInboxMessage: false,
    })),
  ];

  // Filter messages
  const filterTypes: Record<string, string[]> = {
    "All": [],
    "Match": ["match_report"],
    "Board": ["board", "milestone"],
    "Transfers": ["offer", "transfer"],
    "Scouts": ["scout"],
    "Players": ["player", "staff"],
    "News": ["news", "form"],
  };

  const filteredMessages = filter === "All" 
    ? messages 
    : messages.filter(m => filterTypes[filter]?.includes(m.type));

  const unreadCount = messages.filter(m => !m.read).length;
  const readCount = messages.filter(m => m.read).length;

  const handleMessageClick = (message: any) => {
    if (selectedMessage === message.id) {
      setSelectedMessage(null);
    } else {
      setSelectedMessage(message.id);
      if (message.isInboxMessage && !message.read) {
        markMessageRead(message.id);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0c0c12]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl bg-[#14141e] border border-white/[0.06] hover:bg-[#1a1a28] transition-colors">
                <ArrowLeft size={18} className="text-slate-400" />
              </motion.button>
            </Link>
            <ClubLogo clubId={club.id} size={36} />
            <div>
              <h1 className="text-lg font-bold text-white">Inbox</h1>
              <p className="text-[10px] text-slate-500">{unreadCount} unread • {messages.length} total</p>
            </div>
          </div>
          {readCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearReadMessages}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
              title="Clear read messages"
            >
              <Trash2 size={16} className="text-red-400" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 pt-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {Object.keys(filterTypes).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                filter === f
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              )}>
              {f}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="space-y-2">
          {filteredMessages.length === 0 ? (
            <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
              <Mail size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-sm text-gray-400">No messages</p>
              <p className="text-xs text-gray-500 mt-1">Play matches to receive messages</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredMessages.map((message, index) => {
                const Icon = typeIcons[message.type] || Mail;
                const colorClass = typeColors[message.type] || "from-slate-500 to-slate-700";
                const isSelected = selectedMessage === message.id;
                const isOffer = message.type === "offer" && message.data && "status" in message.data && message.data.status === "pending";
                
                return (
                  <motion.div key={message.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleMessageClick(message)}
                    className={cn(
                      "relative p-4 rounded-xl border cursor-pointer transition-all",
                      isSelected ? "bg-purple-500/10 border-purple-500/30"
                        : !message.read ? "bg-white/5 border-purple-500/30 border-l-2"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg",
                        colorClass
                      )}>
                        <Icon size={18} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{message.from}</span>
                          <div className="flex items-center gap-2">
                            {message.priority && message.priority !== "normal" && (
                              <span className={cn("text-[9px] px-1.5 py-0.5 rounded border", priorityColors[message.priority])}>
                                {message.priority}
                              </span>
                            )}
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full", 
                              message.date === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                              message.date === "Accepted" ? "bg-green-500/20 text-green-400" :
                              message.date === "Rejected" ? "bg-red-500/20 text-red-400" :
                              "text-gray-500"
                            )}>{message.date}</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-200">{message.subject}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{message.preview}</p>
                        
                        {/* Expanded content */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-white/10">
                              <p className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">
                                {message.content}
                              </p>
                              
                              {/* Action buttons for offers */}
                              {isOffer && (
                                <div className="flex items-center gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); respondToOffer(message.id, true); }}
                                    className="px-4 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors">
                                    Accept
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); respondToOffer(message.id, false); }}
                                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30">
                                    Reject
                                  </button>
                                </div>
                              )}
                              
                              {/* Delete button for inbox messages */}
                              {message.isInboxMessage && (
                                <div className="flex items-center justify-end mt-2">
                                  <button onClick={(e) => { e.stopPropagation(); deleteMessage(message.id); }}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors">
                                    <Trash2 size={12} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {!message.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0 mt-1.5 animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
