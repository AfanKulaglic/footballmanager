"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGameStore } from "@/lib/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoggedIn, pathname, router, mounted]);

  // Show loading while checking auth
  if (!mounted) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in and not on login page, show loading (redirect will happen)
  if (!isLoggedIn && pathname !== "/login") {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}