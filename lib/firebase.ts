import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, set, get, remove, update } from "firebase/database";
import { Player, Transfer, Scout, ScoutReport, TransferOffer } from "./types";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKwNynNfG3RuQRslHzFhE7Ovn_e-OGUlQ",
  authDomain: "appsphere-labs.firebaseapp.com",
  databaseURL: "https://appsphere-labs-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "appsphere-labs",
  storageBucket: "appsphere-labs.firebasestorage.app",
  messagingSenderId: "58791944992",
  appId: "1:58791944992:web:d85db442c33b29ddac2d45"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

// Types for Firebase data
export interface FirebaseProfile {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  club: {
    id: number;
    name: string;
    shortName: string;
    balance: number;
    reputation: number;
  };
  createdAt: string;
  
  // Game state
  currentMatchday: number;
  formation: string;
  
  // Manager stats
  manager: {
    name: string;
    reputation: number;
    trophies: number;
  };
  
  // Squad data - User's club players
  squad: Player[];
  
  // Transfer history
  transfers: Transfer[];
  
  // Scouts
  scouts: Scout[];
  scoutReports: ScoutReport[];
  
  // Transfer offers
  transferOffers: TransferOffer[];
  
  // Club balance
  clubBalance: number;
  
  // Season data - Player's fixtures
  fixtures: Array<{
    id: number;
    home: { id: number; name: string; shortName: string; balance: number; reputation: number };
    away: { id: number; name: string; shortName: string; balance: number; reputation: number };
    matchday: number;
    isHome: boolean;
  }>;
  
  // All league fixtures
  leagueFixtures: Array<{
    id: number;
    home: { id: number; name: string; shortName: string; balance: number; reputation: number };
    away: { id: number; name: string; shortName: string; balance: number; reputation: number };
    matchday: number;
  }>;
  
  // All results (player + AI)
  results: Array<{
    id: number;
    home: { id: number; name: string; shortName: string; balance: number; reputation: number };
    away: { id: number; name: string; shortName: string; balance: number; reputation: number };
    homeScore: number;
    awayScore: number;
    matchday: number;
  }>;
  
  // Season tracking
  currentSeason?: number;
  seasonHistory?: Array<{
    season: number;
    results: Array<{
      id: number;
      home: { id: number; name: string; shortName: string; balance: number; reputation: number };
      away: { id: number; name: string; shortName: string; balance: number; reputation: number };
      homeScore: number;
      awayScore: number;
      matchday: number;
    }>;
    finalStandings: Array<{
      position: number;
      club: { id: number; name: string; shortName: string; balance: number; reputation: number };
      played: number;
      won: number;
      drawn: number;
      lost: number;
      gf: number;
      ga: number;
      points: number;
    }>;
    playerStats: {
      season: number;
      leaguePosition: number;
      played: number;
      won: number;
      drawn: number;
      lost: number;
      goalsFor: number;
      goalsAgainst: number;
      points: number;
      champion: boolean;
    };
  }>;
}

// Save a profile to Firebase
export async function saveProfileToFirebase(profile: FirebaseProfile): Promise<void> {
  try {
    const profileRef = ref(database, `profiles/${profile.id}`);
    await set(profileRef, profile);
    console.log("Profile saved to Firebase:", profile.id);
  } catch (error) {
    console.error("Error saving profile to Firebase:", error);
    throw error;
  }
}

// Load a profile from Firebase
export async function loadProfileFromFirebase(profileId: string): Promise<FirebaseProfile | null> {
  try {
    const profileRef = ref(database, `profiles/${profileId}`);
    const snapshot = await get(profileRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as FirebaseProfile;
    }
    return null;
  } catch (error) {
    console.error("Error loading profile from Firebase:", error);
    throw error;
  }
}

// Load all profiles from Firebase
export async function loadAllProfilesFromFirebase(): Promise<FirebaseProfile[]> {
  try {
    const profilesRef = ref(database, "profiles");
    const snapshot = await get(profilesRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data) as FirebaseProfile[];
    }
    return [];
  } catch (error) {
    console.error("Error loading profiles from Firebase:", error);
    throw error;
  }
}

// Update profile game state (after match, etc.)
export async function updateProfileGameState(
  profileId: string, 
  updates: Partial<Pick<FirebaseProfile, 
    "currentMatchday" | "fixtures" | "results" | "formation" | "manager" | 
    "squad" | "transfers" | "scouts" | "scoutReports" | "club" | "transferOffers" | "clubBalance" |
    "currentSeason" | "seasonHistory"
  >>
): Promise<void> {
  try {
    const profileRef = ref(database, `profiles/${profileId}`);
    await update(profileRef, updates);
    console.log("Profile game state updated:", profileId);
  } catch (error) {
    console.error("Error updating profile game state:", error);
    throw error;
  }
}

// Delete a profile from Firebase
export async function deleteProfileFromFirebase(profileId: string): Promise<void> {
  try {
    const profileRef = ref(database, `profiles/${profileId}`);
    await remove(profileRef);
    console.log("Profile deleted from Firebase:", profileId);
  } catch (error) {
    console.error("Error deleting profile from Firebase:", error);
    throw error;
  }
}

// Check if profile exists in Firebase
export async function profileExistsInFirebase(profileId: string): Promise<boolean> {
  try {
    const profileRef = ref(database, `profiles/${profileId}`);
    const snapshot = await get(profileRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking profile existence:", error);
    return false;
  }
}

export { database };
