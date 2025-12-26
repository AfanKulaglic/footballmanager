"use client";

import TopStatusBar from "@/components/TopStatusBar";
import QuickActions from "@/components/QuickActions";
import NextMatchCard from "@/components/NextMatchCard";
import LeagueTableCard from "@/components/LeagueTableCard";
import InboxCard from "@/components/InboxCard";
import FixturesCard from "@/components/FixturesCard";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      <TopStatusBar />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 pb-24 space-y-5 max-w-6xl mx-auto w-full"
      >
        {/* Quick Actions */}
        <section>
          <SectionHeader title="Quick Actions" />
          <QuickActions />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section>
            <SectionHeader title="Next Match" />
            <NextMatchCard />
          </section>

          <section>
            <SectionHeader title="Fixtures & Results" />
            <FixturesCard />
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section>
            <SectionHeader title="League Table" />
            <LeagueTableCard />
          </section>

          <section>
            <SectionHeader title="Inbox" />
            <InboxCard />
          </section>
        </div>
      </motion.div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <div className="w-1 h-4 bg-green-500 rounded-full" />
      <h2 className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
        {title}
      </h2>
    </div>
  );
}
