"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Star, TrendingUp } from "lucide-react";
import Card from "@/components/Card";
import ClubLogo from "@/components/ClubLogo";
import { useGameStore } from "@/lib/store";

export default function ManagerPage() {
  const { manager, club } = useGameStore();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href="/" className="p-2 -ml-2">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-sm font-semibold uppercase tracking-wider">Manager Profile</span>
      </div>

      <div className="px-4 space-y-4 pb-20">
        {/* Profile header */}
        <Card className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-purpleDark flex items-center justify-center text-2xl font-bold">
            {manager.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold">{manager.name}</p>
            <p className="text-sm text-muted">{club.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-yellow fill-yellow" />
              <span className="text-xs text-yellow">{manager.reputation} Rep</span>
            </div>
          </div>
          <ClubLogo clubId={club.id} size={48} />
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="text-center">
            <Trophy size={20} className="mx-auto text-yellow mb-1" />
            <p className="text-xl font-bold">{manager.trophies}</p>
            <p className="text-[10px] text-muted">Trophies</p>
          </Card>
          <Card className="text-center">
            <TrendingUp size={20} className="mx-auto text-green mb-1" />
            <p className="text-xl font-bold">73%</p>
            <p className="text-[10px] text-muted">Win Rate</p>
          </Card>
          <Card className="text-center">
            <Star size={20} className="mx-auto text-accent mb-1" />
            <p className="text-xl font-bold">2</p>
            <p className="text-[10px] text-muted">Seasons</p>
          </Card>
        </div>

        {/* Career history */}
        <Card>
          <p className="text-[10px] text-muted uppercase tracking-wider mb-3">Career History</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-purple/10 rounded-lg border border-purple/30">
              <ClubLogo clubId={club.id} size={32} />
              <div className="flex-1">
                <p className="text-sm font-medium">{club.name}</p>
                <p className="text-[10px] text-muted">2023 - Present</p>
              </div>
              <span className="text-xs text-green">Current</span>
            </div>
          </div>
        </Card>

        {/* Attributes */}
        <Card>
          <p className="text-[10px] text-muted uppercase tracking-wider mb-3">Manager Attributes</p>
          <div className="space-y-2">
            {[
              { name: "Tactical Knowledge", value: 14 },
              { name: "Man Management", value: 12 },
              { name: "Youth Development", value: 15 },
              { name: "Discipline", value: 11 },
            ].map((attr) => (
              <div key={attr.name} className="flex items-center gap-3">
                <span className="flex-1 text-xs">{attr.name}</span>
                <div className="w-24 h-1.5 bg-panel rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${(attr.value / 20) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold w-6 text-right">{attr.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
