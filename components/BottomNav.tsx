"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Repeat, BarChart3, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/squad", icon: Users, label: "Squad" },
  { href: "/transfers", icon: Repeat, label: "Transfers" },
  { href: "/stats", icon: BarChart3, label: "Stats" },
  { href: "/settings", icon: Menu, label: "More" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0c0c12] border-t border-white/[0.06] flex justify-around items-center px-2 z-40">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-lg transition-all min-w-[64px]",
              isActive 
                ? "text-green-500" 
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <tab.icon 
              size={20} 
              strokeWidth={isActive ? 2.5 : 2}
              className={isActive ? "drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]" : ""} 
            />
            <span className={cn(
              "text-[10px] font-medium",
              isActive && "font-semibold"
            )}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-green-500" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
