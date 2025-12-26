"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Bell, Volume2, Palette, Info, ChevronRight, LogOut, Image, Shield, Globe, Cloud, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { useGameStore } from "@/lib/store";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Manager Profile", href: "/manager", color: "#8b5cf6" },
      { icon: Bell, label: "Notifications", href: "#", color: "#3b82f6" },
    ],
  },
  {
    title: "Game",
    items: [
      { icon: Volume2, label: "Sound & Music", href: "#", color: "#22c55e" },
      { icon: Palette, label: "Display", href: "#", color: "#ec4899" },
      { icon: Globe, label: "Language", href: "#", color: "#06b6d4" },
    ],
  },
  {
    title: "Admin",
    items: [
      { icon: Image, label: "Logo CMS", href: "/admin/logos", color: "#f97316" },
      { icon: Shield, label: "Privacy", href: "#", color: "#64748b" },
    ],
  },
  {
    title: "About",
    items: [
      { icon: Info, label: "About Game", href: "#", color: "#6366f1" },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { logout, currentProfile, club, isSyncing, syncToCloud } = useGameStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSync = async () => {
    await syncToCloud();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      <PageHeader title="Settings" subtitle="Customize your experience" />

      <div className="flex-1 px-4 pb-24 pt-4 space-y-5">
        {/* Current Profile */}
        {currentProfile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#14141e] border border-white/[0.06]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center">
                <User size={22} className="text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{currentProfile.firstName} {currentProfile.lastName}</p>
                <p className="text-xs text-slate-500">{currentProfile.club.name}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cloud Sync */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <SectionLabel>Cloud Sync</SectionLabel>
          <div className="rounded-xl bg-[#14141e] border border-white/[0.06] overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isSyncing ? "bg-blue-500/15" : "bg-green-500/15"
              }`}>
                {isSyncing ? (
                  <Loader2 size={18} className="text-blue-500 animate-spin" />
                ) : (
                  <Cloud size={18} className="text-green-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {isSyncing ? "Syncing..." : "Cloud Connected"}
                </p>
                <p className="text-[11px] text-slate-600">Progress saved to cloud</p>
              </div>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="p-2 rounded-lg bg-[#1a1a28] border border-white/[0.06] hover:bg-[#1f1f2e] transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={`text-slate-400 ${isSyncing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05 }}
          >
            <SectionLabel>{group.title}</SectionLabel>
            <div className="rounded-xl bg-[#14141e] border border-white/[0.06] overflow-hidden">
              {group.items.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 p-4 hover:bg-[#1a1a28] transition-colors ${
                    index !== group.items.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon size={16} style={{ color: item.color }} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-slate-300">{item.label}</span>
                  <ChevronRight size={16} className="text-slate-600" />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionLabel>Session</SectionLabel>
          <div className="rounded-xl bg-[#14141e] border border-white/[0.06] overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 hover:bg-red-500/10 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center">
                <LogOut size={16} className="text-red-500" />
              </div>
              <span className="flex-1 text-sm font-medium text-red-400 text-left">Switch Profile / Logout</span>
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </div>
        </motion.div>

        {/* Version */}
        <div className="text-center pt-4">
          <p className="text-[11px] text-slate-700">Football Manager v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <div className="w-1 h-3 bg-green-500 rounded-full" />
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
        {children}
      </span>
    </div>
  );
}
