"use client";

import { useState, useEffect } from "react";
import { getStoredClubNames, ClubNameData } from "./logoStore";

// Hook to get custom club names with reactivity
export function useClubNames() {
  const [customNames, setCustomNames] = useState<ClubNameData>({});

  useEffect(() => {
    // Load on mount
    setCustomNames(getStoredClubNames());

    // Listen for storage changes (in case admin page updates)
    const handleStorage = () => {
      setCustomNames(getStoredClubNames());
    };

    window.addEventListener("storage", handleStorage);
    
    // Also poll periodically for same-tab updates
    const interval = setInterval(() => {
      setCustomNames(getStoredClubNames());
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const getDisplayName = (clubId: number, originalName: string): string => {
    const custom = customNames[clubId];
    return custom ? custom.name : originalName;
  };

  const getDisplayShortName = (clubId: number, originalShortName: string): string => {
    const custom = customNames[clubId];
    return custom ? custom.shortName : originalShortName;
  };

  return { customNames, getDisplayName, getDisplayShortName };
}
