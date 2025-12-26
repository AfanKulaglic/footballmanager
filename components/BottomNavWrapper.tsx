"use client";

import { usePathname } from "next/navigation";
import { useGameStore } from "@/lib/store";
import BottomNav from "./BottomNav";

export default function BottomNavWrapper() {
  const pathname = usePathname();
  const { isLoggedIn } = useGameStore();

  // Don't show nav on login page or if not logged in
  if (pathname === "/login" || !isLoggedIn) {
    return null;
  }

  return <BottomNav />;
}