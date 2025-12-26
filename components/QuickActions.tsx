"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Target, Repeat, Dumbbell, BarChart3, History } from "lucide-react";

// Real image URLs from Unsplash (free to use)
const actionImages: Record<string, string> = {
  "/squad": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80", // Team huddle
  "/tactics": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80", // Tactics board
  "/transfers": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80", // Money/contract
  "/training": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80", // Training/gym
  "/stats": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80", // Analytics dashboard
  "/history": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&q=80", // Trophy/history
};

const actions = [
  { href: "/squad", icon: Users, label: "Squad", color: "#3b82f6" },
  { href: "/tactics", icon: Target, label: "Tactics", color: "#8b5cf6" },
  { href: "/transfers", icon: Repeat, label: "Transfers", color: "#22c55e" },
  { href: "/training", icon: Dumbbell, label: "Training", color: "#f97316" },
  { href: "/stats", icon: BarChart3, label: "Stats", color: "#ec4899" },
  { href: "/history", icon: History, label: "History", color: "#06b6d4" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {actions.map((action, index) => (
        <Link key={action.href} href={action.href}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="relative bg-[#14141e] border border-white/[0.06] rounded-xl p-3 flex flex-col items-center gap-2 hover:border-white/[0.15] transition-all cursor-pointer overflow-hidden min-h-[88px]"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url('${actionImages[action.href]}')` }}
            />
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(135deg, ${action.color}15 0%, ${action.color}05 50%, transparent 100%)` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14141e] via-[#14141e]/60 to-transparent" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10"
                style={{ backgroundColor: `${action.color}30` }}
              >
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <span className="text-[11px] font-medium text-slate-200">{action.label}</span>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
