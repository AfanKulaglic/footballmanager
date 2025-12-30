// Logo and club name storage utilities - stores in localStorage

const LOGO_STORAGE_KEY = "football-manager-logos";
const NAMES_STORAGE_KEY = "football-manager-club-names";
const SURNAMES_STORAGE_KEY = "football-manager-club-surnames";

export interface LogoData {
  [clubId: number]: string; // base64 encoded image
}

export interface ClubNameData {
  [clubId: number]: {
    name: string;
    shortName: string;
  };
}

export interface ClubSurnamesData {
  [clubId: number]: string[]; // array of surnames
}

// Logo functions
export function getStoredLogos(): LogoData {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(LOGO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveLogo(clubId: number, base64Image: string): void {
  if (typeof window === "undefined") return;
  
  const logos = getStoredLogos();
  logos[clubId] = base64Image;
  localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(logos));
}

export function removeLogo(clubId: number): void {
  if (typeof window === "undefined") return;
  
  const logos = getStoredLogos();
  delete logos[clubId];
  localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(logos));
}

export function getLogo(clubId: number): string | null {
  const logos = getStoredLogos();
  return logos[clubId] || null;
}

export function clearAllLogos(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOGO_STORAGE_KEY);
}

// Club name functions
export function getStoredClubNames(): ClubNameData {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(NAMES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveClubName(clubId: number, name: string, shortName: string): void {
  if (typeof window === "undefined") return;
  
  const names = getStoredClubNames();
  names[clubId] = { name, shortName };
  localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(names));
}

export function removeClubName(clubId: number): void {
  if (typeof window === "undefined") return;
  
  const names = getStoredClubNames();
  delete names[clubId];
  localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(names));
}

export function getClubName(clubId: number): { name: string; shortName: string } | null {
  const names = getStoredClubNames();
  return names[clubId] || null;
}

export function clearAllClubNames(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(NAMES_STORAGE_KEY);
}

// Clear all customizations
export function clearAllCustomizations(): void {
  clearAllLogos();
  clearAllClubNames();
  clearAllSurnames();
}

// Surname functions (for non-user clubs - stored in localStorage only)
export function getStoredSurnames(): ClubSurnamesData {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(SURNAMES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveSurnames(clubId: number, surnames: string[]): void {
  if (typeof window === "undefined") return;
  
  const allSurnames = getStoredSurnames();
  allSurnames[clubId] = surnames;
  localStorage.setItem(SURNAMES_STORAGE_KEY, JSON.stringify(allSurnames));
}

export function removeSurnames(clubId: number): void {
  if (typeof window === "undefined") return;
  
  const allSurnames = getStoredSurnames();
  delete allSurnames[clubId];
  localStorage.setItem(SURNAMES_STORAGE_KEY, JSON.stringify(allSurnames));
}

export function getSurnames(clubId: number): string[] | null {
  const allSurnames = getStoredSurnames();
  return allSurnames[clubId] || null;
}

export function clearAllSurnames(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SURNAMES_STORAGE_KEY);
}

// Helper to get display name for a club (custom or original)
export function getClubDisplayName(clubId: number, originalName: string): string {
  const custom = getClubName(clubId);
  return custom ? custom.name : originalName;
}

export function getClubDisplayShortName(clubId: number, originalShortName: string): string {
  const custom = getClubName(clubId);
  return custom ? custom.shortName : originalShortName;
}
