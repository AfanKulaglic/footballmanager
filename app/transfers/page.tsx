"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Star, Send, Check, X, Eye, Briefcase, Users, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClubLogo from "@/components/ClubLogo";
import { PlayerInfoModal, getFlag, positionColors } from "@/components/PlayerCard";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import { Player, Scout } from "@/lib/types";
import { leagues } from "@/lib/mock";

const defaultScouts: Scout[] = [
  { id: 1, name: "Carlos Mendes", nationality: "portuguese", rating: 15, specialization: "europe", salary: 50000, hiredDate: "" },
  { id: 2, name: "João Silva", nationality: "brazilian", rating: 12, specialization: "south_america", salary: 35000, hiredDate: "" },
  { id: 3, name: "Hans Weber", nationality: "german", rating: 18, specialization: "youth", salary: 75000, hiredDate: "" },
];

function formatMoney(amount: number): string {
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
}

export default function TransfersPage() {
  const { 
    club, clubBalance, scouts, scoutReports, transferOffers, currentMatchday,
    hireScout, fireScout, startScouting, makeTransferOffer, respondToOffer, getTransferMarketPlayers 
  } = useGameStore();
  const { getDisplayName } = useClubNames();
  const [activeTab, setActiveTab] = useState<"market" | "scouts" | "offers" | "history">("market");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeague, setSelectedLeague] = useState<string>("all");
  const [selectedClubId, setSelectedClubId] = useState<number | "all">("all");
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; club: any; askingPrice: number } | null>(null);
  const [offerAmount, setOfferAmount] = useState(0);
  const [playerInfoModal, setPlayerInfoModal] = useState<{ player: Player; clubName: string } | null>(null);

  const marketPlayers = useMemo(() => getTransferMarketPlayers(), [club.id]);
  
  // Get clubs for selected league
  const clubsInSelectedLeague = useMemo(() => {
    if (selectedLeague === "all") {
      return leagues.flatMap(l => l.clubs);
    }
    const league = leagues.find(l => l.id === selectedLeague);
    return league ? league.clubs : [];
  }, [selectedLeague]);
  
  // Reset club filter when league changes
  const handleLeagueChange = (leagueId: string) => {
    setSelectedLeague(leagueId);
    setSelectedClubId("all");
  };
  
  const filteredPlayers = marketPlayers.filter(p => {
    // Search filter
    const matchesSearch = p.player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.club.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // League filter
    let matchesLeague = true;
    if (selectedLeague !== "all") {
      const league = leagues.find(l => l.id === selectedLeague);
      matchesLeague = league ? league.clubs.some(c => c.id === p.club.id) : false;
    }
    
    // Club filter
    const matchesClub = selectedClubId === "all" || p.club.id === selectedClubId;
    
    return matchesSearch && matchesLeague && matchesClub;
  });

  const pendingOffers = transferOffers.filter(o => o.status === "pending");
  const incomingOffers = pendingOffers.filter(o => o.type === "incoming");
  const outgoingOffers = pendingOffers.filter(o => o.type === "outgoing");
  const completedReports = scoutReports.filter(r => r.status === "completed");
  const scoutingReports = scoutReports.filter(r => r.status === "scouting");

  const handleMakeOffer = () => {
    if (!selectedPlayer || offerAmount <= 0) return;
    makeTransferOffer(selectedPlayer.player, selectedPlayer.club, offerAmount);
    setSelectedPlayer(null);
    setOfferAmount(0);
  };

  const handleHireScout = (scout: Scout) => {
    const newScout = { ...scout, id: Date.now(), hiredDate: new Date().toISOString() };
    hireScout(newScout);
  };

  const handleStartScouting = (player: Player, club: any) => {
    if (scouts.length === 0) return;
    startScouting(player, club, scouts[0].id);
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
              <h1 className="text-lg font-bold text-white">Transfers</h1>
              <p className="text-[10px] text-slate-500">Budget: {formatMoney(clubBalance)}</p>
            </div>
          </div>
          {pendingOffers.length > 0 && (
            <div className="px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
              <span className="text-xs font-bold text-red-400">{pendingOffers.length} pending</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 space-y-4 pt-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "market", label: "Market", icon: Briefcase },
            { id: "scouts", label: "Scouts", icon: Eye },
            { id: "offers", label: `Offers${pendingOffers.length > 0 ? ` (${pendingOffers.length})` : ""}`, icon: Send },
            { id: "history", label: "History", icon: Users },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}>
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Market Tab */}
        {activeTab === "market" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <Search size={16} className="text-gray-400" />
                <input type="text" placeholder="Search players..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500" />
              </div>
            </div>
            
            {/* League & Club Filters */}
            <div className="flex gap-2">
              {/* League Filter */}
              <div className="flex-1 relative">
                <select
                  value={selectedLeague}
                  onChange={(e) => handleLeagueChange(e.target.value)}
                  className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="all" className="bg-[#14141e]">All Leagues</option>
                  {leagues.map(league => (
                    <option key={league.id} value={league.id} className="bg-[#14141e]">
                      {league.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Club Filter */}
              <div className="flex-1 relative">
                <select
                  value={selectedClubId}
                  onChange={(e) => setSelectedClubId(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="all" className="bg-[#14141e]">All Clubs</option>
                  {clubsInSelectedLeague
                    .filter(c => c.id !== club.id) // Exclude user's club
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(c => (
                      <option key={c.id} value={c.id} className="bg-[#14141e]">
                        {getDisplayName(c.id, c.name)}
                      </option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Results count */}
            <p className="text-xs text-gray-500">
              {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""} found
            </p>

            {/* Player List */}
            <div className="space-y-2">
              {filteredPlayers.slice(0, 20).map((item, index) => {
                const isBeingScouted = scoutReports.some(r => r.player.id === item.player.id && r.status === "scouting");
                const isScouted = scoutReports.some(r => r.player.id === item.player.id && r.status === "completed");
                
                return (
                  <motion.div key={`${item.player.id}-${item.club.id}`}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-14 h-14 rounded-xl flex flex-col items-center justify-center cursor-pointer"
                        style={{ backgroundColor: `${positionColors[item.player.position] || "#666"}20` }}
                        onClick={() => setPlayerInfoModal({ player: item.player, clubName: getDisplayName(item.club.id, item.club.name) })}
                      >
                        <span className="text-xl font-black" style={{ color: positionColors[item.player.position] || "#666" }}>
                          {item.player.rating}
                        </span>
                        <span className="text-[9px] font-semibold text-gray-400">{item.player.position}</span>
                      </div>
                      
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => setPlayerInfoModal({ player: item.player, clubName: getDisplayName(item.club.id, item.club.name) })}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getFlag(item.player.nationality)}</span>
                          <p className="text-sm font-bold text-white truncate">{item.player.name}</p>
                          {isScouted && <Star size={12} className="text-amber-400 fill-amber-400" />}
                        </div>
                        <p className="text-[10px] text-gray-400">{getDisplayName(item.club.id, item.club.name)}</p>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <span className="text-sm font-bold text-amber-400">{formatMoney(item.askingPrice)}</span>
                        <div className="flex gap-1">
                          {!isBeingScouted && !isScouted && scouts.length > 0 && (
                            <button onClick={() => handleStartScouting(item.player, item.club)}
                              className="px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-[10px] font-semibold text-blue-300 hover:bg-blue-500/30">
                              Scout
                            </button>
                          )}
                          {isBeingScouted && (
                            <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-[10px] font-semibold text-yellow-300">
                              Scouting...
                            </span>
                          )}
                          <button onClick={() => { setSelectedPlayer(item); setOfferAmount(item.askingPrice); }}
                            className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-[10px] font-semibold text-purple-300 hover:bg-purple-500/30">
                            Bid
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scouts Tab */}
        {activeTab === "scouts" && (
          <div className="space-y-4">
            {/* Your Scouts */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Your Scouts ({scouts.length})</p>
              {scouts.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <Eye size={32} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-sm text-gray-400">No scouts hired yet</p>
                  <p className="text-xs text-gray-500">Hire a scout to discover players</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {scouts.map((scout) => (
                    <div key={scout.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{scout.name}</p>
                          <p className="text-xs text-gray-400">
                            {getFlag(scout.nationality)} • Rating: {scout.rating}/20 • {scout.specialization}
                          </p>
                        </div>
                        <button onClick={() => fireScout(scout.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 hover:bg-red-500/30">
                          Fire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Scouting */}
            {scoutingReports.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Active Scouting</p>
                <div className="space-y-2">
                  {scoutingReports.map((report) => (
                    <div key={report.id} className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{report.player.name}</p>
                          <p className="text-xs text-gray-400">{report.club.name}</p>
                        </div>
                        <span className="text-xs text-yellow-400">
                          Completes MD {report.completesAt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Reports */}
            {completedReports.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Scout Reports</p>
                <div className="space-y-2">
                  {completedReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors"
                      onClick={() => setPlayerInfoModal({ player: report.player, clubName: report.club.name })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                          style={{ backgroundColor: `${positionColors[report.player.position] || "#666"}20` }}>
                          <span className="text-lg font-black" style={{ color: positionColors[report.player.position] || "#666" }}>
                            {report.player.rating}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{getFlag(report.player.nationality)}</span>
                            <p className="text-sm font-bold text-white">{report.player.name}</p>
                          </div>
                          <p className="text-xs text-gray-400">{report.club.name} • {report.player.position}</p>
                          <p className={`text-xs font-semibold mt-1 ${
                            report.recommendation === "highly_recommended" ? "text-green-400" :
                            report.recommendation === "recommended" ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {report.recommendation.replace("_", " ").toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-400">{formatMoney(report.estimatedValue)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Scouts to Hire */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Available Scouts</p>
              <div className="space-y-2">
                {defaultScouts.filter(s => !scouts.some(hired => hired.name === s.name)).map((scout) => (
                  <div key={scout.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{scout.name}</p>
                        <p className="text-xs text-gray-400">
                          {getFlag(scout.nationality)} • Rating: {scout.rating}/20 • {scout.specialization}
                        </p>
                        <p className="text-xs text-amber-400 mt-1">Salary: {formatMoney(scout.salary)}/year</p>
                      </div>
                      <button onClick={() => handleHireScout(scout)}
                        className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-xs font-semibold text-green-300 hover:bg-green-500/30">
                        Hire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <div className="space-y-4">
            {/* Incoming Offers */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                Incoming Offers ({incomingOffers.length})
              </p>
              {incomingOffers.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <Send size={32} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-sm text-gray-400">No incoming offers</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {incomingOffers.map((offer) => (
                    <div key={offer.id} className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-3">
                        <ClubLogo clubId={offer.fromClub.id} size={40} />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{offer.player.name}</p>
                          <p className="text-xs text-gray-400">
                            {getDisplayName(offer.fromClub.id, offer.fromClub.name)} wants to buy
                          </p>
                          <p className="text-sm font-bold text-green-400 mt-1">{formatMoney(offer.fee)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => respondToOffer(offer.id, true)}
                            className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
                            <Check size={16} />
                          </button>
                          <button onClick={() => respondToOffer(offer.id, false)}
                            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing Offers */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                Your Offers ({outgoingOffers.length})
              </p>
              {outgoingOffers.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <Briefcase size={32} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-sm text-gray-400">No outgoing offers</p>
                  <p className="text-xs text-gray-500">Make bids in the Market tab</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {outgoingOffers.map((offer) => (
                    <div key={offer.id} className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-center gap-3">
                        <ClubLogo clubId={offer.fromClub.id} size={40} />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{offer.player.name}</p>
                          <p className="text-xs text-gray-400">
                            From {getDisplayName(offer.fromClub.id, offer.fromClub.name)}
                          </p>
                          <p className="text-sm font-bold text-purple-400 mt-1">{formatMoney(offer.fee)}</p>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-xs font-semibold text-yellow-300">
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Processed Offers */}
            {transferOffers.filter(o => o.status !== "pending").length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Recent Decisions</p>
                <div className="space-y-2">
                  {transferOffers.filter(o => o.status !== "pending").slice(-5).map((offer) => (
                    <div key={offer.id} className={`p-4 rounded-xl border ${
                      offer.status === "accepted" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{offer.player.name}</p>
                          <p className="text-xs text-gray-400">{formatMoney(offer.fee)}</p>
                        </div>
                        <span className={`text-xs font-bold ${offer.status === "accepted" ? "text-green-400" : "text-red-400"}`}>
                          {offer.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Transfer History</p>
            {useGameStore.getState().transfers.length === 0 ? (
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <Users size={32} className="mx-auto text-gray-600 mb-2" />
                <p className="text-sm text-gray-400">No transfers yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {useGameStore.getState().transfers.map((transfer) => (
                  <div key={transfer.id} className={`p-4 rounded-xl border ${
                    transfer.type === "buy" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{transfer.player.name}</p>
                        <p className="text-xs text-gray-400">
                          {transfer.type === "buy" ? "Signed from" : "Sold to"} {transfer.type === "buy" ? transfer.fromClub?.name : transfer.toClub.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${transfer.type === "buy" ? "text-red-400" : "text-green-400"}`}>
                          {transfer.type === "buy" ? "-" : "+"}{formatMoney(transfer.fee)}
                        </p>
                        <p className="text-[10px] text-gray-500">{new Date(transfer.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setSelectedPlayer(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-6 rounded-2xl bg-[#1a1a2e] border border-white/10"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-4">Make Offer</h3>
              
              <div 
                className="p-4 rounded-xl bg-white/5 mb-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => {
                  setPlayerInfoModal({ player: selectedPlayer.player, clubName: selectedPlayer.club.name });
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${positionColors[selectedPlayer.player.position] || "#666"}20` }}>
                    <span className="text-lg font-black" style={{ color: positionColors[selectedPlayer.player.position] || "#666" }}>
                      {selectedPlayer.player.rating}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getFlag(selectedPlayer.player.nationality)}</span>
                      <p className="text-sm font-bold text-white">{selectedPlayer.player.name}</p>
                    </div>
                    <p className="text-xs text-gray-400">{selectedPlayer.club.name}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-400 mb-1 block">Your Offer</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">€</span>
                  <input type="number" value={offerAmount} onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Asking price: {formatMoney(selectedPlayer.askingPrice)}</p>
                <p className="text-xs text-gray-500">Your budget: {formatMoney(clubBalance)}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelectedPlayer(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-semibold hover:bg-white/10">
                  Cancel
                </button>
                <button onClick={handleMakeOffer} disabled={offerAmount <= 0 || offerAmount > clubBalance}
                  className="flex-1 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit Offer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Player Info Modal */}
      {playerInfoModal && (
        <PlayerInfoModal
          player={playerInfoModal.player}
          isOpen={!!playerInfoModal}
          onClose={() => setPlayerInfoModal(null)}
          clubName={playerInfoModal.clubName}
        />
      )}
    </div>
  );
}