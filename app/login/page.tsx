"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Plus, Trash2, ChevronRight, Trophy, Globe, Users, Cloud, Loader2 } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { useClubNames } from "@/lib/useClubName";
import { leagues, countries } from "@/lib/mock";
import { Club } from "@/lib/types";
import ClubLogo from "@/components/ClubLogo";

type Step = "profiles" | "create";

export default function LoginPage() {
  const router = useRouter();
  const { 
    profiles, 
    isLoggedIn, 
    isLoading,
    selectProfile, 
    createProfile, 
    deleteProfile,
    loadProfilesFromCloud 
  } = useGameStore();
  const [step, setStep] = useState<Step>("profiles");
  const [mounted, setMounted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const { getDisplayName } = useClubNames();

  useEffect(() => {
    setMounted(true);
    // Load profiles from Firebase on mount
    loadProfilesFromCloud();
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn && !isSelecting) {
      router.push("/");
    }
  }, [isLoggedIn, router, mounted, isSelecting]);

  useEffect(() => {
    if (mounted && profiles.length === 0 && !isLoading) {
      setStep("create");
    }
  }, [profiles.length, mounted, isLoading]);

  const handleSelectProfile = async (profileId: string) => {
    setIsSelecting(true);
    await selectProfile(profileId);
    setIsSelecting(false);
    router.push("/");
  };

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !country || !selectedClub) return;
    
    setIsCreating(true);
    await createProfile({
      firstName,
      lastName,
      country,
      club: selectedClub,
    });
    setIsCreating(false);
    router.push("/");
  };

  const handleDeleteProfile = async (e: React.MouseEvent<HTMLDivElement>, profileId: string) => {
    e.stopPropagation();
    await deleteProfile(profileId);
  };

  const availableClubs = selectedLeague 
    ? leagues.find(l => l.id === selectedLeague)?.clubs || []
    : [];

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <div className="flex items-center gap-2 text-gray-400">
          <Cloud size={16} />
          <span className="text-sm">Loading from cloud...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-xl"
            style={{ boxShadow: "0 8px 32px rgba(124, 58, 237, 0.4)" }}
          >
            <Trophy size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Football Manager
          </h1>
          <p className="text-gray-500 mt-2">Select or create your manager profile</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-green-400 text-xs">
            <Cloud size={12} />
            <span>Cloud sync enabled</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "profiles" && profiles.length > 0 ? (
            <motion.div
              key="profiles"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4 px-1">
                Saved Profiles ({profiles.length})
              </h2>
              
              {profiles.map((profile) => (
                <motion.button
                  key={profile.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectProfile(profile.id)}
                  disabled={isSelecting}
                  className="w-full rounded-2xl p-5 flex items-center gap-4 text-left group bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <ClubLogo clubId={profile.club.id} size={40} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-white">{profile.firstName} {profile.lastName}</p>
                    <p className="text-sm text-gray-400 truncate">{getDisplayName(profile.club.id, profile.club.name)}</p>
                    <p className="text-xs text-purple-400 mt-1">{profile.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={(e) => handleDeleteProfile(e, profile.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors hover:scale-110 active:scale-95"
                    >
                      <Trash2 size={18} />
                    </div>
                    {isSelecting ? (
                      <Loader2 size={20} className="text-purple-400 animate-spin" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                    )}
                  </div>
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("create")}
                className="w-full rounded-2xl p-5 flex items-center gap-4 border-2 border-dashed border-white/10 hover:border-purple-500/50 transition-colors bg-white/5"
              >
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/30">
                  <Plus size={24} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">Create New Profile</p>
                  <p className="text-sm text-gray-500">Start a new career</p>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl p-6 space-y-6 bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Create Manager Profile</h2>
                {profiles.length > 0 && (
                  <button
                    onClick={() => setStep("profiles")}
                    className="text-sm text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    Back to profiles
                  </button>
                )}
              </div>

              {/* Name inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Country select */}
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                  <Globe size={12} className="inline mr-1" />
                  Country of Origin
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a2e]">Select country...</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name} className="bg-[#1a1a2e]">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* League select */}
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                  <Trophy size={12} className="inline mr-1" />
                  League
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {leagues.map((league) => (
                    <motion.button
                      key={league.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedLeague(league.id);
                        setSelectedClub(null);
                      }}
                      className={`p-4 rounded-xl border transition-all text-center ${
                        selectedLeague === league.id
                          ? "bg-purple-500/20 border-purple-500 text-purple-400"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-white"
                      }`}
                    >
                      <p className="text-2xl mb-1">
                        {league.country === "England" ? "🏴󠁧󠁢󠁥󠁮󠁧󠁿" : league.country === "Spain" ? "🇪🇸" : "🇧🇦"}
                      </p>
                      <p className="text-xs font-semibold truncate">{league.name}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Club select */}
              {selectedLeague && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                    <Users size={12} className="inline mr-1" />
                    Select Club
                  </label>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {availableClubs.map((club) => (
                      <motion.button
                        key={club.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedClub(club)}
                        className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          selectedClub?.id === club.id
                            ? "bg-purple-500/20 border-purple-500"
                            : "bg-white/5 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                          <ClubLogo clubId={club.id} size={32} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-sm text-white">{getDisplayName(club.id, club.name)}</p>
                          <p className="text-xs text-gray-500">Rep: {club.reputation}</p>
                        </div>
                        <div className="text-xs text-green-400">
                          €{(club.balance / 1000000).toFixed(0)}M
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Create button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateProfile}
                disabled={!firstName || !lastName || !country || !selectedClub || isCreating}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 py-4 rounded-xl font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white flex items-center justify-center gap-2"
                style={{ boxShadow: firstName && lastName && country && selectedClub && !isCreating ? "0 8px 32px rgba(124, 58, 237, 0.4)" : "none" }}
              >
                {isCreating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving to Cloud...
                  </>
                ) : (
                  <>
                    <Cloud size={20} />
                    Start Career
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
