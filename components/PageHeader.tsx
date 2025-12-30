"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ClubLogo from "./ClubLogo";
import { useGameStore } from "@/lib/store";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  backHref?: string;
}

export default function PageHeader({ title, subtitle, rightContent, backHref = "/" }: PageHeaderProps) {
  const { club } = useGameStore();

  return (
    <div className="sticky top-0 z-40 bg-[#0c0c12]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={backHref}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-[#14141e] border border-white/[0.06] hover:bg-[#1a1a28] transition-colors"
            >
              <ArrowLeft size={18} className="text-slate-400" />
            </motion.button>
          </Link>
          <ClubLogo clubId={club.id} size={36} />
          <div>
            <h1 className="text-lg font-bold text-white">{title}</h1>
            {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
          </div>
        </div>
        
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
