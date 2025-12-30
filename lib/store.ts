import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Club, Match, Manager, Profile, Player, Transfer, Scout, ScoutReport, TransferOffer, SeasonHistory, InboxMessage } from "./types";
import { mockClubs, mockManager, leagues, generateSquadForClub, generateRandomPlayer } from "./mock";
import { MatchEvent, simulateMatch, calculateMatchStats } from "./matchEngine";
import { 
  saveProfileToFirebase, 
  loadProfileFromFirebase, 
  loadAllProfilesFromFirebase,
  updateProfileGameState,
  deleteProfileFromFirebase,
  FirebaseProfile 
} from "./firebase";
import { getDeviceId } from "./deviceId";

// Fixture type for upcoming matches
interface Fixture {
  id: number;
  home: Club;
  away: Club;
  matchday: number;
  isHome: boolean;
}

// League fixture (for all teams)
interface LeagueFixture {
  id: number;
  home: Club;
  away: Club;
  matchday: number;
}

// Match result type
interface MatchResult {
  id: number;
  home: Club;
  away: Club;
  homeScore: number;
  awayScore: number;
  matchday: number;
}

interface GameState {
  // Profile state
  profiles: Profile[];
  currentProfile: Profile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  
  club: Club;
  match: Match | null;
  manager: Manager;
  
  // Season state
  currentSeason: number;
  currentMatchday: number;
  fixtures: Fixture[]; // Player's fixtures
  leagueFixtures: LeagueFixture[]; // All league fixtures
  results: MatchResult[]; // All results (player + AI)
  seasonHistory: SeasonHistory[]; // Past seasons
  totalMatchdays: number; // Total matchdays in a season
  
  // Squad & Transfers state
  squad: Player[];
  transfers: Transfer[];
  scouts: Scout[];
  scoutReports: ScoutReport[];
  transferOffers: TransferOffer[];
  clubBalance: number;
  
  // Inbox state
  inboxMessages: InboxMessage[];
  
  // Custom surnames for user's club
  customSurnames: string[];
  
  // Tactics state
  formation: string;
  
  // Match simulation state
  isMatchRunning: boolean;
  matchMinute: number;
  matchEvents: MatchEvent[];
  currentScore: [number, number];
  matchStats: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
    fouls: [number, number];
  };
  displayedEvents: MatchEvent[];
  matchSpeed: number;
  isPaused: boolean;
  
  // Live scores from other matches
  liveOtherMatches: {
    id: number;
    home: Club;
    away: Club;
    homeScore: number;
    awayScore: number;
    events: { minute: number; type: string; team: "home" | "away"; description: string }[];
  }[];
  
  // Profile actions
  createProfile: (profile: Omit<Profile, "id" | "createdAt" | "deviceId">) => Promise<void>;
  selectProfile: (profileId: string) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
  logout: () => void;
  loadProfilesFromCloud: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  
  // Squad actions
  updateSquad: (squad: Player[]) => void;
  
  // Transfer & Scouting actions
  hireScout: (scout: Scout) => void;
  fireScout: (scoutId: number) => void;
  startScouting: (player: Player, club: Club, scoutId: number) => void;
  makeTransferOffer: (player: Player, club: Club, offerAmount: number) => void;
  respondToOffer: (offerId: string, accept: boolean) => void;
  getTransferMarketPlayers: () => { player: Player; club: Club; askingPrice: number }[];
  
  // Actions
  setClub: (club: Club) => void;
  setMatch: (match: Match | null) => void;
  setFormation: (formation: string) => void;
  setFormationDuringMatch: (formation: string) => void;
  addMatchEvent: (event: MatchEvent) => void;
  startMatch: () => void;
  updateMatchMinute: (minute: number) => void;
  setMatchSpeed: (speed: number) => void;
  togglePause: () => void;
  resetMatchState: () => void;
  completeMatchAndAdvance: (homeScore: number, awayScore: number) => Promise<void>;
  updateOtherMatchesMinute: (minute: number) => void;
  startNewSeason: () => Promise<void>;
  
  // Inbox actions
  markMessageRead: (messageId: string) => void;
  clearReadMessages: () => void;
  deleteMessage: (messageId: string) => void;
  
  // Custom surnames actions
  setCustomSurnames: (surnames: string[]) => void;
}

// Simulate a match between two AI teams and return the score
function simulateAIMatch(home: Club, away: Club): { homeScore: number; awayScore: number } {
  // Base expected goals based on reputation difference
  const repDiff = (home.reputation - away.reputation) / 100;
  const homeAdvantage = 0.3; // Home team advantage
  
  // Expected goals (Poisson-like distribution)
  const homeExpected = Math.max(0.5, 1.5 + repDiff + homeAdvantage);
  const awayExpected = Math.max(0.5, 1.5 - repDiff);
  
  // Generate goals using simplified Poisson
  const generateGoals = (expected: number): number => {
    let goals = 0;
    const L = Math.exp(-expected);
    let p = 1;
    
    do {
      goals++;
      p *= Math.random();
    } while (p > L);
    
    return goals - 1;
  };
  
  return {
    homeScore: generateGoals(homeExpected),
    awayScore: generateGoals(awayExpected),
  };
}

// Generate events for other matches (simplified version for live ticker)
function generateOtherMatchEvents(home: Club, away: Club): { minute: number; type: string; team: "home" | "away"; description: string }[] {
  const events: { minute: number; type: string; team: "home" | "away"; description: string }[] = [];
  const homeStrength = home.reputation;
  const awayStrength = away.reputation;
  
  for (let minute = 1; minute <= 90; minute++) {
    const rand = Math.random();
    
    // Goal chance (~3-4 goals per match on average)
    if (rand < 0.025) {
      const isHome = Math.random() < (homeStrength / (homeStrength + awayStrength));
      const team = isHome ? "home" : "away";
      const clubName = isHome ? home.shortName : away.shortName;
      events.push({
        minute,
        type: "goal",
        team,
        description: `⚽ GOAL! ${clubName} scores!`,
      });
    }
    // Yellow card
    else if (rand < 0.04) {
      const isHome = Math.random() < 0.5;
      const team = isHome ? "home" : "away";
      const clubName = isHome ? home.shortName : away.shortName;
      events.push({
        minute,
        type: "yellow_card",
        team,
        description: `🟨 Yellow card (${clubName})`,
      });
    }
    // Red card (rare)
    else if (rand < 0.042) {
      const isHome = Math.random() < 0.5;
      const team = isHome ? "home" : "away";
      const clubName = isHome ? home.shortName : away.shortName;
      events.push({
        minute,
        type: "red_card",
        team,
        description: `🟥 Red card (${clubName})`,
      });
    }
  }
  
  return events.sort((a, b) => a.minute - b.minute);
}

// Generate full league fixtures using round-robin algorithm
function generateLeagueFixtures(leagueClubs: Club[]): LeagueFixture[] {
  const fixtures: LeagueFixture[] = [];
  const clubs = [...leagueClubs];
  const numTeams = clubs.length;
  
  // If odd number of teams, add a "bye" team
  if (numTeams % 2 !== 0) {
    clubs.push({ id: -1, name: "BYE", shortName: "BYE", balance: 0, reputation: 0 });
  }
  
  const n = clubs.length;
  const rounds = n - 1;
  const matchesPerRound = n / 2;
  
  let fixtureId = Date.now();
  
  // First half of season (home games)
  for (let round = 0; round < rounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = (round + match) % (n - 1);
      let away = (n - 1 - match + round) % (n - 1);
      
      // Last team stays fixed, others rotate
      if (match === 0) {
        away = n - 1;
      }
      
      const homeClub = clubs[home];
      const awayClub = clubs[away];
      
      // Skip bye matches
      if (homeClub.id === -1 || awayClub.id === -1) continue;
      
      fixtures.push({
        id: fixtureId++,
        home: homeClub,
        away: awayClub,
        matchday: round + 1,
      });
    }
  }
  
  // Second half of season (reverse fixtures)
  const firstHalfLength = fixtures.length;
  for (let i = 0; i < firstHalfLength; i++) {
    const original = fixtures[i];
    fixtures.push({
      id: fixtureId++,
      home: original.away,
      away: original.home,
      matchday: original.matchday + rounds,
    });
  }
  
  return fixtures;
}

// Generate player's fixtures from league fixtures
function generatePlayerFixtures(leagueFixtures: LeagueFixture[], playerClub: Club): Fixture[] {
  return leagueFixtures
    .filter(f => f.home.id === playerClub.id || f.away.id === playerClub.id)
    .map(f => ({
      ...f,
      isHome: f.home.id === playerClub.id,
    }))
    .sort((a, b) => a.matchday - b.matchday);
}

// Create match from fixture
function createMatchFromFixture(fixture: Fixture): Match {
  return {
    id: fixture.id,
    home: fixture.home,
    away: fixture.away,
    homeScore: 0,
    awayScore: 0,
    minute: 0,
    status: "upcoming",
    possession: [50, 50],
    xg: [0, 0],
    shots: [0, 0],
    shotsOnTarget: [0, 0],
    corners: [0, 0],
    fouls: [0, 0],
  };
}

// Generate inbox messages after a match
function generatePostMatchMessages(
  club: Club,
  opponent: Club,
  isHome: boolean,
  playerScore: number,
  opponentScore: number,
  matchday: number,
  results: MatchResult[],
  squad: Player[],
  leagueClubs: Club[],
  maxMatchdays: number
): InboxMessage[] {
  const messages: InboxMessage[] = [];
  const now = new Date().toISOString();
  
  // Determine match result
  const isWin = playerScore > opponentScore;
  const isDraw = playerScore === opponentScore;
  const isLoss = playerScore < opponentScore;
  const goalDiff = playerScore - opponentScore;
  
  // Calculate current form (last 5 results including this one)
  const playerResults = results.filter(r => r.home.id === club.id || r.away.id === club.id);
  const recentResults = playerResults.slice(-5);
  const recentWins = recentResults.filter(r => {
    const isH = r.home.id === club.id;
    return isH ? r.homeScore > r.awayScore : r.awayScore > r.homeScore;
  }).length;
  const recentLosses = recentResults.filter(r => {
    const isH = r.home.id === club.id;
    return isH ? r.homeScore < r.awayScore : r.awayScore < r.homeScore;
  }).length;
  
  // Calculate league position
  const standings: Record<number, { points: number; gd: number; gf: number }> = {};
  leagueClubs.forEach(c => standings[c.id] = { points: 0, gd: 0, gf: 0 });
  
  results.forEach(r => {
    if (standings[r.home.id]) {
      standings[r.home.id].gf += r.homeScore;
      standings[r.home.id].gd += r.homeScore - r.awayScore;
      if (r.homeScore > r.awayScore) standings[r.home.id].points += 3;
      else if (r.homeScore === r.awayScore) standings[r.home.id].points += 1;
    }
    if (standings[r.away.id]) {
      standings[r.away.id].gf += r.awayScore;
      standings[r.away.id].gd += r.awayScore - r.homeScore;
      if (r.awayScore > r.homeScore) standings[r.away.id].points += 3;
      else if (r.homeScore === r.awayScore) standings[r.away.id].points += 1;
    }
  });
  
  const sortedTeams = leagueClubs
    .map(c => ({ id: c.id, ...standings[c.id] }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
  
  const position = sortedTeams.findIndex(t => t.id === club.id) + 1;
  const isTopHalf = position <= Math.ceil(leagueClubs.length / 2);
  const isTitle = position <= 3;
  const isRelegation = position > leagueClubs.length - 3;
  
  // 1. Match Report (always)
  const matchReportSubjects = isWin 
    ? [`Victory! ${club.shortName} ${playerScore}-${opponentScore} ${opponent.shortName}`, 
       `${club.shortName} triumph over ${opponent.shortName}`,
       `Impressive win against ${opponent.shortName}`]
    : isDraw 
    ? [`${club.shortName} held to draw by ${opponent.shortName}`,
       `Points shared: ${club.shortName} ${playerScore}-${opponentScore} ${opponent.shortName}`,
       `Stalemate against ${opponent.shortName}`]
    : [`Defeat: ${club.shortName} ${playerScore}-${opponentScore} ${opponent.shortName}`,
       `${opponent.shortName} overcome ${club.shortName}`,
       `Disappointing loss to ${opponent.shortName}`];
  
  const matchReportContent = isWin
    ? goalDiff >= 3 
      ? `A dominant performance saw ${club.name} cruise to a ${playerScore}-${opponentScore} victory over ${opponent.name}. The team showed excellent form throughout the match.`
      : `${club.name} secured all three points with a ${playerScore}-${opponentScore} win against ${opponent.name}. A solid performance from the squad.`
    : isDraw
    ? `${club.name} had to settle for a point after a ${playerScore}-${opponentScore} draw with ${opponent.name}. The team will look to bounce back in the next fixture.`
    : goalDiff <= -3
      ? `A difficult day for ${club.name} as they fell to a heavy ${playerScore}-${opponentScore} defeat against ${opponent.name}. Questions will be asked about the performance.`
      : `${club.name} suffered a ${playerScore}-${opponentScore} loss to ${opponent.name}. The team will need to regroup ahead of the next match.`;
  
  messages.push({
    id: `match_${matchday}_${Date.now()}`,
    from: "Match Report",
    subject: matchReportSubjects[Math.floor(Math.random() * matchReportSubjects.length)],
    content: matchReportContent,
    preview: matchReportContent.substring(0, 80) + "...",
    date: now,
    matchday,
    read: false,
    type: "match_report",
    priority: "normal",
  });
  
  // 2. Form-based messages (good or bad run)
  if (recentResults.length >= 3) {
    // Winning streak
    if (recentWins >= 3) {
      messages.push({
        id: `form_win_${matchday}_${Date.now()}`,
        from: "Club News",
        subject: `${recentWins} wins in a row! Excellent form`,
        content: `The team is on fire! ${club.name} has won ${recentWins} consecutive matches, showing tremendous form. The players are full of confidence and the fans are delighted with the recent performances.`,
        preview: `${recentWins} consecutive wins - the team is in excellent form`,
        date: now,
        matchday,
        read: false,
        type: "form",
        priority: "normal",
      });
    }
    
    // Losing streak
    if (recentLosses >= 3) {
      messages.push({
        id: `form_loss_${matchday}_${Date.now()}`,
        from: "Board",
        subject: `Concerning run of results`,
        content: `The board is concerned about the recent run of ${recentLosses} consecutive defeats. We understand football has its ups and downs, but we expect to see improvement in the coming matches. The fans are growing restless.`,
        preview: `${recentLosses} losses in a row - the board expects improvement`,
        date: now,
        matchday,
        read: false,
        type: "board",
        priority: "high",
      });
    }
  }
  
  // 3. Big match messages (against top teams or rivals)
  const opponentPosition = sortedTeams.findIndex(t => t.id === opponent.id) + 1;
  const isBigMatch = opponentPosition <= 5 || opponent.reputation >= 80;
  
  if (isBigMatch && isWin) {
    messages.push({
      id: `big_win_${matchday}_${Date.now()}`,
      from: "Board",
      subject: `Fantastic result against ${opponent.shortName}!`,
      content: `The board is thrilled with the victory against ${opponent.name}. This is exactly the kind of result that shows our ambition. Keep up the excellent work!`,
      preview: `The board congratulates you on the big win`,
      date: now,
      matchday,
      read: false,
      type: "board",
      priority: "high",
    });
  } else if (isBigMatch && isLoss && goalDiff <= -2) {
    messages.push({
      id: `big_loss_${matchday}_${Date.now()}`,
      from: "Board",
      subject: `Disappointing performance against ${opponent.shortName}`,
      content: `While we understand ${opponent.name} is a strong opponent, the manner of the defeat was concerning. We expect the team to show more fight in these big matches.`,
      preview: `The board is disappointed with the heavy defeat`,
      date: now,
      matchday,
      read: false,
      type: "board",
      priority: "normal",
    });
  }
  
  // 4. League position messages
  if (matchday >= 5) {
    if (isTitle && position === 1) {
      messages.push({
        id: `position_top_${matchday}_${Date.now()}`,
        from: "Club News",
        subject: `Top of the table!`,
        content: `${club.name} sits at the top of the league table! The fans are dreaming of the title. Keep the momentum going and glory could be ours.`,
        preview: `We're top of the league!`,
        date: now,
        matchday,
        read: false,
        type: "news",
        priority: "high",
      });
    } else if (isRelegation) {
      messages.push({
        id: `position_danger_${matchday}_${Date.now()}`,
        from: "Board",
        subject: `Relegation concerns`,
        content: `The board is worried about our league position. We are currently in ${position}${getOrdinalSuffix(position)} place, dangerously close to the relegation zone. Immediate improvement is required.`,
        preview: `We're in the relegation zone - urgent action needed`,
        date: now,
        matchday,
        read: false,
        type: "board",
        priority: "urgent",
      });
    }
  }
  
  // 5. Player unhappiness (substitutes not playing)
  const starters = squad.slice(0, 11);
  const subs = squad.slice(11);
  const unhappySubs = subs.filter(p => p.rating >= 72 && Math.random() < 0.15);
  
  if (unhappySubs.length > 0 && matchday >= 5) {
    const unhappyPlayer = unhappySubs[0];
    messages.push({
      id: `player_unhappy_${matchday}_${Date.now()}`,
      from: "Staff",
      subject: `${unhappyPlayer.name} wants more playing time`,
      content: `${unhappyPlayer.name} has expressed frustration about their lack of playing time. The ${unhappyPlayer.position} believes they deserve more opportunities in the starting lineup. You may want to consider giving them a chance soon.`,
      preview: `${unhappyPlayer.name} is unhappy with limited playing time`,
      date: now,
      matchday,
      read: false,
      type: "player",
      priority: "normal",
      data: { playerId: unhappyPlayer.id, playerName: unhappyPlayer.name },
    });
  }
  
  // 6. Season milestones
  if (matchday === Math.floor(maxMatchdays / 2)) {
    const totalWins = playerResults.filter(r => {
      const isH = r.home.id === club.id;
      return isH ? r.homeScore > r.awayScore : r.awayScore > r.homeScore;
    }).length;
    const totalPoints = standings[club.id]?.points || 0;
    
    messages.push({
      id: `milestone_half_${matchday}_${Date.now()}`,
      from: "Board",
      subject: `Mid-season review`,
      content: `We've reached the halfway point of the season. ${club.name} has accumulated ${totalPoints} points from ${playerResults.length} matches, with ${totalWins} wins. ${isTopHalf ? "We're pleased with the progress so far." : "We expect improvement in the second half of the season."}`,
      preview: `Mid-season: ${totalPoints} points, ${position}${getOrdinalSuffix(position)} place`,
      date: now,
      matchday,
      read: false,
      type: "milestone",
      priority: "high",
    });
  }
  
  // 7. Clean sheet or defensive concerns
  if (opponentScore === 0 && isWin) {
    if (Math.random() < 0.3) {
      messages.push({
        id: `clean_sheet_${matchday}_${Date.now()}`,
        from: "Staff",
        subject: `Solid defensive display`,
        content: `The defense was excellent today, keeping a clean sheet against ${opponent.name}. The backline is looking more organized and confident.`,
        preview: `Clean sheet - defense looking solid`,
        date: now,
        matchday,
        read: false,
        type: "staff",
        priority: "low",
      });
    }
  } else if (opponentScore >= 3) {
    messages.push({
      id: `defense_concern_${matchday}_${Date.now()}`,
      from: "Staff",
      subject: `Defensive concerns`,
      content: `Conceding ${opponentScore} goals is worrying. The coaching staff will work on defensive organization in training this week.`,
      preview: `${opponentScore} goals conceded - defense needs work`,
      date: now,
      matchday,
      read: false,
      type: "staff",
      priority: "normal",
    });
  }
  
  return messages;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// Convert store state to Firebase profile
function stateToFirebaseProfile(
  profile: Profile,
  fixtures: Fixture[],
  leagueFixtures: LeagueFixture[],
  results: MatchResult[],
  currentMatchday: number,
  formation: string,
  manager: Manager,
  squad: Player[],
  transfers: Transfer[],
  scouts: Scout[],
  scoutReports: ScoutReport[],
  transferOffers: TransferOffer[],
  clubBalance: number,
  currentSeason: number,
  seasonHistory: SeasonHistory[],
  inboxMessages: InboxMessage[]
): FirebaseProfile {
  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    country: profile.country,
    club: profile.club,
    createdAt: profile.createdAt,
    deviceId: profile.deviceId,
    currentMatchday,
    formation,
    manager: {
      name: manager.name,
      reputation: manager.reputation,
      trophies: manager.trophies,
    },
    squad,
    transfers,
    scouts,
    scoutReports,
    transferOffers,
    clubBalance,
    fixtures,
    leagueFixtures,
    results,
    currentSeason,
    seasonHistory,
    inboxMessages,
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Profile state
      profiles: [],
      currentProfile: null,
      isLoggedIn: false,
      isLoading: false,
      isSyncing: false,
      
      club: mockClubs[0],
      match: null,
      manager: mockManager,
      
      // Season state
      currentSeason: new Date().getFullYear(),
      currentMatchday: 1,
      fixtures: [],
      leagueFixtures: [],
      results: [],
      seasonHistory: [],
      totalMatchdays: 38, // Will be calculated based on league size
      
      // Squad & Transfers state
      squad: [],
      transfers: [],
      scouts: [],
      scoutReports: [],
      transferOffers: [],
      clubBalance: 0,
      
      // Inbox state
      inboxMessages: [],
      
      // Custom surnames for user's club
      customSurnames: [],
      
      // Tactics state
      formation: "4-3-3",
      
      // Match simulation state
      isMatchRunning: false,
      matchMinute: 0,
      matchEvents: [],
      currentScore: [0, 0],
      matchStats: {
        possession: [50, 50],
        shots: [0, 0],
        shotsOnTarget: [0, 0],
        corners: [0, 0],
        fouls: [0, 0],
      },
      displayedEvents: [],
      matchSpeed: 1,
      isPaused: false,
      
      // Live scores from other matches
      liveOtherMatches: [],
      
      // Load profiles from Firebase (only for this device)
      loadProfilesFromCloud: async () => {
        set({ isLoading: true });
        try {
          const deviceId = getDeviceId();
          const cloudProfiles = await loadAllProfilesFromFirebase(deviceId);
          if (cloudProfiles.length > 0) {
            const profiles: Profile[] = cloudProfiles.map(cp => ({
              id: cp.id,
              firstName: cp.firstName,
              lastName: cp.lastName,
              country: cp.country,
              club: cp.club,
              createdAt: cp.createdAt,
              deviceId: cp.deviceId,
            }));
            set({ profiles });
          }
        } catch (error) {
          console.error("Failed to load profiles from cloud:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Sync current state to Firebase
      syncToCloud: async () => {
        const { currentProfile, fixtures, leagueFixtures, results, currentMatchday, formation, manager, squad, transfers, scouts, scoutReports, transferOffers, clubBalance, currentSeason, seasonHistory, inboxMessages } = get();
        if (!currentProfile) return;
        
        set({ isSyncing: true });
        try {
          const firebaseProfile = stateToFirebaseProfile(
            currentProfile,
            fixtures,
            leagueFixtures,
            results,
            currentMatchday,
            formation,
            manager,
            squad,
            transfers,
            scouts,
            scoutReports,
            transferOffers,
            clubBalance,
            currentSeason,
            seasonHistory,
            inboxMessages
          );
          await saveProfileToFirebase(firebaseProfile);
        } catch (error) {
          console.error("Failed to sync to cloud:", error);
        } finally {
          set({ isSyncing: false });
        }
      },
      
      // Profile actions
      createProfile: async (profileData) => {
        const deviceId = getDeviceId();
        const newProfile: Profile = {
          ...profileData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          deviceId, // Associate profile with this device
        };
        
        // Find the league for this club
        const playerLeague = leagues.find(l => l.clubs.some(c => c.id === newProfile.club.id));
        const leagueClubs = playerLeague?.clubs || [];
        
        // Generate all league fixtures
        const leagueFixtures = generateLeagueFixtures(leagueClubs);
        
        // Generate player's fixtures from league fixtures
        const fixtures = generatePlayerFixtures(leagueFixtures, newProfile.club);
        
        // Generate squad for the club
        const squad = generateSquadForClub(newProfile.club);
        
        const firstFixture = fixtures[0];
        const manager = {
          name: `${newProfile.firstName} ${newProfile.lastName}`,
          club: newProfile.club,
          reputation: 50,
          trophies: 0,
        };
        
        set({
          profiles: [...get().profiles, newProfile],
          currentProfile: newProfile,
          isLoggedIn: true,
          club: newProfile.club,
          manager,
          fixtures,
          leagueFixtures,
          currentMatchday: 1,
          results: [],
          squad,
          transfers: [],
          scouts: [],
          scoutReports: [],
          transferOffers: [],
          clubBalance: newProfile.club.balance,
          match: firstFixture ? createMatchFromFixture(firstFixture) : null,
        });
        
        // Save to Firebase
        try {
          const firebaseProfile = stateToFirebaseProfile(
            newProfile,
            fixtures,
            leagueFixtures,
            [],
            1,
            "4-3-3",
            manager,
            squad,
            [],
            [],
            [],
            [],
            newProfile.club.balance,
            new Date().getFullYear(),
            [],
            []
          );
          await saveProfileToFirebase(firebaseProfile);
          console.log("Profile saved to Firebase successfully");
        } catch (error) {
          console.error("Failed to save profile to Firebase:", error);
        }
      },
      
      selectProfile: async (profileId) => {
        set({ isLoading: true });
        
        try {
          // Try to load from Firebase first
          const cloudProfile = await loadProfileFromFirebase(profileId);
          
          if (cloudProfile) {
            // Verify this profile belongs to this device
            const deviceId = getDeviceId();
            if (cloudProfile.deviceId && cloudProfile.deviceId !== deviceId) {
              console.error("Profile does not belong to this device");
              set({ isLoading: false });
              return;
            }
            
            // Use cloud data
            const profile: Profile = {
              id: cloudProfile.id,
              firstName: cloudProfile.firstName,
              lastName: cloudProfile.lastName,
              country: cloudProfile.country,
              club: cloudProfile.club,
              createdAt: cloudProfile.createdAt,
              deviceId: cloudProfile.deviceId || deviceId,
            };
            
            // Get fixtures - regenerate if not in cloud data
            let leagueFixtures = cloudProfile.leagueFixtures || [];
            let fixtures = cloudProfile.fixtures || [];
            
            if (leagueFixtures.length === 0) {
              const playerLeague = leagues.find(l => l.clubs.some(c => c.id === cloudProfile.club.id));
              const leagueClubs = playerLeague?.clubs || [];
              leagueFixtures = generateLeagueFixtures(leagueClubs);
              fixtures = generatePlayerFixtures(leagueFixtures, cloudProfile.club);
            }
            
            // Get squad - regenerate if not in cloud data
            let squad = cloudProfile.squad || [];
            if (squad.length === 0) {
              squad = generateSquadForClub(cloudProfile.club);
            }
            
            const currentFixture = fixtures.find(
              f => f.matchday === cloudProfile.currentMatchday
            );
            
            set({
              currentProfile: profile,
              isLoggedIn: true,
              club: cloudProfile.club,
              manager: {
                name: cloudProfile.manager.name,
                club: cloudProfile.club,
                reputation: cloudProfile.manager.reputation,
                trophies: cloudProfile.manager.trophies,
              },
              fixtures,
              leagueFixtures,
              currentMatchday: cloudProfile.currentMatchday,
              results: cloudProfile.results || [],
              formation: cloudProfile.formation,
              squad,
              transfers: cloudProfile.transfers || [],
              scouts: cloudProfile.scouts || [],
              scoutReports: cloudProfile.scoutReports || [],
              transferOffers: cloudProfile.transferOffers || [],
              clubBalance: cloudProfile.clubBalance || cloudProfile.club.balance,
              currentSeason: cloudProfile.currentSeason || new Date().getFullYear(),
              seasonHistory: cloudProfile.seasonHistory || [],
              inboxMessages: cloudProfile.inboxMessages || [],
              match: currentFixture ? createMatchFromFixture(currentFixture as Fixture) : null,
            });
          } else {
            // Fallback to local profile
            const { profiles } = get();
            const profile = profiles.find(p => p.id === profileId);
            
            if (profile) {
              const playerLeague = leagues.find(l => l.clubs.some(c => c.id === profile.club.id));
              const leagueClubs = playerLeague?.clubs || [];
              const leagueFixtures = generateLeagueFixtures(leagueClubs);
              const fixtures = generatePlayerFixtures(leagueFixtures, profile.club);
              const squad = generateSquadForClub(profile.club);
              const firstFixture = fixtures[0];
              
              set({
                currentProfile: profile,
                isLoggedIn: true,
                club: profile.club,
                manager: {
                  name: `${profile.firstName} ${profile.lastName}`,
                  club: profile.club,
                  reputation: 50,
                  trophies: 0,
                },
                fixtures,
                leagueFixtures,
                currentMatchday: 1,
                results: [],
                squad,
                transfers: [],
                scouts: [],
                scoutReports: [],
                transferOffers: [],
                clubBalance: profile.club.balance,
                match: firstFixture ? createMatchFromFixture(firstFixture) : null,
              });
            }
          }
        } catch (error) {
          console.error("Error selecting profile:", error);
          
          // Fallback to local
          const { profiles } = get();
          const profile = profiles.find(p => p.id === profileId);
          
          if (profile) {
            const playerLeague = leagues.find(l => l.clubs.some(c => c.id === profile.club.id));
            const leagueClubs = playerLeague?.clubs || [];
            const leagueFixtures = generateLeagueFixtures(leagueClubs);
            const fixtures = generatePlayerFixtures(leagueFixtures, profile.club);
            const squad = generateSquadForClub(profile.club);
            const firstFixture = fixtures[0];
            
            set({
              currentProfile: profile,
              isLoggedIn: true,
              club: profile.club,
              manager: {
                name: `${profile.firstName} ${profile.lastName}`,
                club: profile.club,
                reputation: 50,
                trophies: 0,
              },
              fixtures,
              leagueFixtures,
              currentMatchday: 1,
              results: [],
              squad,
              transfers: [],
              scouts: [],
              scoutReports: [],
              transferOffers: [],
              clubBalance: profile.club.balance,
              match: firstFixture ? createMatchFromFixture(firstFixture) : null,
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteProfile: async (profileId) => {
        set((state) => ({
          profiles: state.profiles.filter(p => p.id !== profileId),
        }));
        
        // Delete from Firebase
        try {
          await deleteProfileFromFirebase(profileId);
          console.log("Profile deleted from Firebase");
        } catch (error) {
          console.error("Failed to delete profile from Firebase:", error);
        }
      },
      
      logout: () => {
        // Sync before logout
        const { currentProfile, fixtures, leagueFixtures, results, currentMatchday, formation, manager, squad, transfers, scouts, scoutReports, transferOffers, clubBalance, currentSeason, seasonHistory, inboxMessages } = get();
        if (currentProfile) {
          const firebaseProfile = stateToFirebaseProfile(
            currentProfile,
            fixtures,
            leagueFixtures,
            results,
            currentMatchday,
            formation,
            manager,
            squad,
            transfers,
            scouts,
            scoutReports,
            transferOffers,
            clubBalance,
            currentSeason,
            seasonHistory,
            inboxMessages
          );
          saveProfileToFirebase(firebaseProfile).catch(console.error);
        }
        
        set({
          currentProfile: null,
          isLoggedIn: false,
          match: null,
          fixtures: [],
          leagueFixtures: [],
          results: [],
          currentMatchday: 1,
          squad: [],
          transfers: [],
          scouts: [],
          scoutReports: [],
          transferOffers: [],
          clubBalance: 0,
        });
      },
      
      setClub: (club) => set({ club }),
      setMatch: (match) => set({ match }),
      
      setFormation: (formation) => {
        set({ formation });
        // Sync formation change to cloud
        const { currentProfile } = get();
        if (currentProfile) {
          updateProfileGameState(currentProfile.id, { formation }).catch(console.error);
        }
      },
      
      // Formation change during match - adds event to feed
      setFormationDuringMatch: (formation) => {
        const { matchMinute, club, displayedEvents, matchEvents } = get();
        const newEvent: MatchEvent = {
          minute: matchMinute,
          type: "substitution",
          team: "home",
          description: `📋 ${club.shortName} changes formation to ${formation}`,
        };
        
        set({ 
          formation,
          matchEvents: [...matchEvents, newEvent],
          displayedEvents: [...displayedEvents, newEvent],
        });
        
        // Sync formation change to cloud
        const { currentProfile } = get();
        if (currentProfile) {
          updateProfileGameState(currentProfile.id, { formation }).catch(console.error);
        }
      },
      
      // Add a custom event to the match feed
      addMatchEvent: (event) => {
        const { matchEvents, displayedEvents, matchMinute } = get();
        const eventWithMinute = { ...event, minute: event.minute || matchMinute };
        set({
          matchEvents: [...matchEvents, eventWithMinute],
          displayedEvents: [...displayedEvents, eventWithMinute],
        });
      },
      
      updateSquad: (squad) => {
        set({ squad });
        // Sync squad change to cloud
        const { currentProfile } = get();
        if (currentProfile) {
          updateProfileGameState(currentProfile.id, { squad }).catch(console.error);
        }
      },
      
      // Transfer & Scouting actions
      hireScout: (scout) => {
        const { scouts, currentProfile } = get();
        const newScouts = [...scouts, scout];
        set({ scouts: newScouts });
        if (currentProfile) {
          updateProfileGameState(currentProfile.id, { scouts: newScouts }).catch(console.error);
        }
      },
      
      fireScout: (scoutId) => {
        const { scouts, scoutReports, currentProfile } = get();
        const newScouts = scouts.filter(s => s.id !== scoutId);
        // Also remove any pending scout reports from this scout
        const newReports = scoutReports.filter(r => r.scoutId !== scoutId);
        set({ scouts: newScouts, scoutReports: newReports });
        if (currentProfile) {
          updateProfileGameState(currentProfile.id, { scouts: newScouts, scoutReports: newReports }).catch(console.error);
        }
      },
      
      startScouting: (player, club, scoutId) => {
        const { scoutReports, currentMatchday, currentProfile, scouts } = get();
        const scout = scouts.find(s => s.id === scoutId);
        if (!scout) return;
        
        // Scouting takes 1-3 matchdays depending on scout rating
        const scoutingTime = Math.max(1, 4 - Math.floor(scout.rating / 7));
        
        const newReport: ScoutReport = {
          id: Date.now(),
          scoutId,
          player,
          club,
          estimatedValue: player.value || Math.floor(player.rating * 100000),
          recommendation: player.rating >= 75 ? "highly_recommended" : player.rating >= 65 ? "recommended" : "not_recommended",
          date: new Date().toISOString(),
          status: "scouting",
          completesAt: currentMatchday + scoutingTime,
        };
        
        const newReports = [...scoutReports, newReport];
        set({ scoutReports: newReports });
        if (currentProfile) {
          updateProfileGameState(currentProfile.id, { scoutReports: newReports }).catch(console.error);
        }
      },
      
      makeTransferOffer: (player, fromClub, offerAmount) => {
        const { transferOffers, club, currentMatchday, currentProfile } = get();
        
        const newOffer: TransferOffer = {
          id: crypto.randomUUID(),
          player,
          fromClub,
          toClub: club,
          fee: offerAmount,
          status: "pending",
          type: "outgoing",
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          matchday: currentMatchday,
        };
        
        const newOffers = [...transferOffers, newOffer];
        set({ transferOffers: newOffers });
        if (currentProfile) {
          updateProfileGameState(currentProfile.id, { transferOffers: newOffers }).catch(console.error);
        }
      },
      
      respondToOffer: (offerId, accept) => {
        const { transferOffers, squad, transfers, clubBalance, currentProfile, club } = get();
        const offer = transferOffers.find(o => o.id === offerId);
        if (!offer) return;
        
        const updatedOffers = transferOffers.map(o => 
          o.id === offerId ? { ...o, status: accept ? "accepted" as const : "rejected" as const } : o
        );
        
        if (accept) {
          if (offer.type === "incoming") {
            // Someone bought our player - remove from squad, add money
            const newSquad = squad.filter(p => p.id !== offer.player.id);
            const newBalance = clubBalance + offer.fee;
            const newTransfer: Transfer = {
              id: Date.now(),
              player: offer.player,
              fromClub: club,
              toClub: offer.fromClub,
              fee: offer.fee,
              date: new Date().toISOString(),
              type: "sell",
            };
            const newTransfers = [...transfers, newTransfer];
            
            set({ 
              transferOffers: updatedOffers, 
              squad: newSquad, 
              clubBalance: newBalance,
              transfers: newTransfers,
            });
            if (currentProfile) {
              updateProfileGameState(currentProfile.id, { 
                transferOffers: updatedOffers, 
                squad: newSquad, 
                clubBalance: newBalance,
                transfers: newTransfers,
              }).catch(console.error);
            }
          } else {
            // We bought a player - add to squad, subtract money
            const newPlayer = { ...offer.player, id: Date.now() };
            const newSquad = [...squad, newPlayer];
            const newBalance = clubBalance - offer.fee;
            const newTransfer: Transfer = {
              id: Date.now(),
              player: newPlayer,
              fromClub: offer.fromClub,
              toClub: club,
              fee: offer.fee,
              date: new Date().toISOString(),
              type: "buy",
            };
            const newTransfers = [...transfers, newTransfer];
            
            set({ 
              transferOffers: updatedOffers, 
              squad: newSquad, 
              clubBalance: newBalance,
              transfers: newTransfers,
            });
            if (currentProfile) {
              updateProfileGameState(currentProfile.id, { 
                transferOffers: updatedOffers, 
                squad: newSquad, 
                clubBalance: newBalance,
                transfers: newTransfers,
              }).catch(console.error);
            }
          }
        } else {
          set({ transferOffers: updatedOffers });
          if (currentProfile) {
            updateProfileGameState(currentProfile.id, { transferOffers: updatedOffers }).catch(console.error);
          }
        }
      },
      
      getTransferMarketPlayers: () => {
        const { club } = get();
        // Get players from other clubs in the same league
        const playerLeague = leagues.find(l => l.clubs.some(c => c.id === club.id));
        if (!playerLeague) return [];
        
        const marketPlayers: { player: Player; club: Club; askingPrice: number }[] = [];
        
        for (const otherClub of playerLeague.clubs) {
          if (otherClub.id === club.id) continue;
          
          const clubSquad = generateSquadForClub(otherClub);
          // Pick 2-3 random players from each club to be available
          const availableCount = Math.floor(Math.random() * 2) + 2;
          const shuffled = [...clubSquad].sort(() => Math.random() - 0.5);
          
          for (let i = 0; i < Math.min(availableCount, shuffled.length); i++) {
            const player = shuffled[i];
            const baseValue = player.rating * player.rating * 1000;
            const askingPrice = Math.floor(baseValue * (1 + Math.random() * 0.3));
            marketPlayers.push({ player, club: otherClub, askingPrice });
          }
        }
        
        return marketPlayers.sort((a, b) => b.player.rating - a.player.rating);
      },
      
      startMatch: () => {
        const { match, isMatchRunning, leagueFixtures, currentMatchday, club } = get();
        if (!match) return;
        if (isMatchRunning) return;
        
        const { events } = simulateMatch(match.home, match.away);
        
        // Get other matches for this matchday and pre-generate their events
        const otherMatchdayFixtures = leagueFixtures.filter(
          f => f.matchday === currentMatchday && 
               f.home.id !== club.id && 
               f.away.id !== club.id
        );
        
        // Initialize other matches with pre-generated events
        const liveOtherMatches = otherMatchdayFixtures.map(fixture => {
          const matchEvents = generateOtherMatchEvents(fixture.home, fixture.away);
          return {
            id: fixture.id,
            home: fixture.home,
            away: fixture.away,
            homeScore: 0,
            awayScore: 0,
            events: matchEvents,
          };
        });
        
        set({
          isMatchRunning: true,
          matchMinute: 0,
          matchEvents: events,
          currentScore: [0, 0],
          displayedEvents: [],
          isPaused: false,
          matchStats: {
            possession: [50, 50],
            shots: [0, 0],
            shotsOnTarget: [0, 0],
            corners: [0, 0],
            fouls: [0, 0],
          },
          liveOtherMatches,
        });
      },
      
      updateMatchMinute: (minute) => {
        const { matchEvents, match } = get();
        if (!match) return;
        
        const eventsToShow = matchEvents.filter(e => e.minute <= minute);
        const homeGoals = eventsToShow.filter(e => e.type === "goal" && e.team === "home").length;
        const awayGoals = eventsToShow.filter(e => e.type === "goal" && e.team === "away").length;
        const stats = calculateMatchStats(matchEvents, minute);
        
        set({
          matchMinute: minute,
          currentScore: [homeGoals, awayGoals],
          displayedEvents: eventsToShow,
          matchStats: stats,
          isMatchRunning: minute < 90,
        });
      },
      
      setMatchSpeed: (speed) => set({ matchSpeed: speed }),
      
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      
      updateOtherMatchesMinute: (minute) => {
        const { liveOtherMatches } = get();
        
        const updatedMatches = liveOtherMatches.map(match => {
          const eventsUpToMinute = match.events.filter(e => e.minute <= minute);
          const homeGoals = eventsUpToMinute.filter(e => e.type === "goal" && e.team === "home").length;
          const awayGoals = eventsUpToMinute.filter(e => e.type === "goal" && e.team === "away").length;
          
          return {
            ...match,
            homeScore: homeGoals,
            awayScore: awayGoals,
          };
        });
        
        set({ liveOtherMatches: updatedMatches });
      },
      
      resetMatchState: () => {
        set({
          isMatchRunning: false,
          matchMinute: 0,
          matchEvents: [],
          currentScore: [0, 0],
          displayedEvents: [],
          isPaused: false,
          matchStats: {
            possession: [50, 50],
            shots: [0, 0],
            shotsOnTarget: [0, 0],
            corners: [0, 0],
            fouls: [0, 0],
          },
          liveOtherMatches: [],
        });
      },
      
      // Complete match and advance to next fixture
      completeMatchAndAdvance: async (homeScore, awayScore) => {
        const { match, fixtures, leagueFixtures, currentMatchday, results, currentProfile, club, squad, scoutReports, transferOffers } = get();
        if (!match) return;
        
        // Player's match result
        const playerResult: MatchResult = {
          id: match.id,
          home: match.home,
          away: match.away,
          homeScore,
          awayScore,
          matchday: currentMatchday,
        };
        
        // Simulate all other matches for this matchday
        const otherMatchResults: MatchResult[] = [];
        const matchdayFixtures = leagueFixtures.filter(f => f.matchday === currentMatchday);
        
        for (const fixture of matchdayFixtures) {
          // Skip player's match (already have result)
          if (fixture.home.id === club.id || fixture.away.id === club.id) {
            continue;
          }
          
          // Simulate AI match
          const aiResult = simulateAIMatch(fixture.home, fixture.away);
          
          otherMatchResults.push({
            id: fixture.id,
            home: fixture.home,
            away: fixture.away,
            homeScore: aiResult.homeScore,
            awayScore: aiResult.awayScore,
            matchday: currentMatchday,
          });
        }
        
        const newMatchday = currentMatchday + 1;
        const nextFixture = fixtures.find(f => f.matchday === newMatchday);
        const newResults = [...results, playerResult, ...otherMatchResults];
        
        // Update scouting reports - complete any that are ready
        const updatedScoutReports = scoutReports.map(report => {
          if (report.status === "scouting" && report.completesAt <= newMatchday) {
            return { ...report, status: "completed" as const };
          }
          return report;
        });
        
        // Generate random incoming transfer offers (10% chance per match for good players)
        const newTransferOffers = [...transferOffers];
        const goodPlayers = squad.filter(p => p.rating >= 70);
        
        if (goodPlayers.length > 0 && Math.random() < 0.15) {
          const targetPlayer = goodPlayers[Math.floor(Math.random() * goodPlayers.length)];
          const playerLeague = leagues.find(l => l.clubs.some(c => c.id === club.id));
          const otherClubs = playerLeague?.clubs.filter(c => c.id !== club.id) || [];
          
          if (otherClubs.length > 0) {
            // Higher reputation clubs more likely to make offers
            const interestedClubs = otherClubs.filter(c => c.reputation >= club.reputation - 10);
            if (interestedClubs.length > 0) {
              const buyingClub = interestedClubs[Math.floor(Math.random() * interestedClubs.length)];
              const baseValue = targetPlayer.rating * targetPlayer.rating * 1000;
              const offerAmount = Math.floor(baseValue * (0.8 + Math.random() * 0.4));
              
              const incomingOffer: TransferOffer = {
                id: crypto.randomUUID(),
                player: targetPlayer,
                fromClub: buyingClub,
                toClub: club,
                fee: offerAmount,
                status: "pending",
                type: "incoming",
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                matchday: newMatchday,
              };
              
              newTransferOffers.push(incomingOffer);
            }
          }
        }
        
        // Process outgoing offers - AI decides (70% reject, 20% accept, 10% counter)
        const processedOffers = newTransferOffers.map(offer => {
          if (offer.type === "outgoing" && offer.status === "pending" && offer.matchday < newMatchday) {
            const rand = Math.random();
            if (rand < 0.25) {
              return { ...offer, status: "accepted" as const };
            } else {
              return { ...offer, status: "rejected" as const };
            }
          }
          return offer;
        });
        
        // Generate inbox messages after the match
        const playerLeague = leagues.find(l => l.clubs.some(c => c.id === club.id));
        const leagueClubs = playerLeague?.clubs || [];
        const maxMatchdays = (leagueClubs.length - 1) * 2;
        
        const isHome = match.home.id === club.id;
        const opponent = isHome ? match.away : match.home;
        const playerScore = isHome ? homeScore : awayScore;
        const opponentScore = isHome ? awayScore : homeScore;
        
        const { inboxMessages } = get();
        const newMessages = generatePostMatchMessages(
          club,
          opponent,
          isHome,
          playerScore,
          opponentScore,
          currentMatchday,
          newResults,
          squad,
          leagueClubs,
          maxMatchdays
        );
        const updatedInboxMessages = [...newMessages, ...inboxMessages];
        
        set({
          results: newResults,
          currentMatchday: newMatchday,
          match: nextFixture ? createMatchFromFixture(nextFixture) : null,
          isMatchRunning: false,
          matchMinute: 0,
          matchEvents: [],
          currentScore: [0, 0],
          displayedEvents: [],
          isPaused: false,
          matchStats: {
            possession: [50, 50],
            shots: [0, 0],
            shotsOnTarget: [0, 0],
            corners: [0, 0],
            fouls: [0, 0],
          },
          scoutReports: updatedScoutReports,
          transferOffers: processedOffers,
          inboxMessages: updatedInboxMessages,
        });
        
        // Sync to Firebase after match
        if (currentProfile) {
          try {
            await updateProfileGameState(currentProfile.id, {
              currentMatchday: newMatchday,
              results: newResults,
              scoutReports: updatedScoutReports,
              transferOffers: processedOffers,
              inboxMessages: updatedInboxMessages,
            });
            console.log("Match results synced to Firebase (player + AI matches)");
          } catch (error) {
            console.error("Failed to sync match results to Firebase:", error);
          }
        }
      },
      
      // Start a new season after the current one ends
      startNewSeason: async () => {
        const { currentSeason, results, club, leagueFixtures, currentProfile, seasonHistory } = get();
        
        // Calculate final standings from results
        const playerLeague = leagues.find(l => l.clubs.some(c => c.id === club.id));
        const leagueClubs = playerLeague?.clubs || [];
        
        // Calculate standings
        const standings: Record<number, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number }> = {};
        
        leagueClubs.forEach(c => {
          standings[c.id] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
        });
        
        results.forEach(result => {
          // Home team
          if (standings[result.home.id]) {
            standings[result.home.id].played++;
            standings[result.home.id].gf += result.homeScore;
            standings[result.home.id].ga += result.awayScore;
            if (result.homeScore > result.awayScore) {
              standings[result.home.id].won++;
              standings[result.home.id].points += 3;
            } else if (result.homeScore === result.awayScore) {
              standings[result.home.id].drawn++;
              standings[result.home.id].points += 1;
            } else {
              standings[result.home.id].lost++;
            }
          }
          
          // Away team
          if (standings[result.away.id]) {
            standings[result.away.id].played++;
            standings[result.away.id].gf += result.awayScore;
            standings[result.away.id].ga += result.homeScore;
            if (result.awayScore > result.homeScore) {
              standings[result.away.id].won++;
              standings[result.away.id].points += 3;
            } else if (result.awayScore === result.homeScore) {
              standings[result.away.id].drawn++;
              standings[result.away.id].points += 1;
            } else {
              standings[result.away.id].lost++;
            }
          }
        });
        
        // Sort standings
        const finalStandings = leagueClubs
          .map(c => ({
            position: 0,
            club: c,
            ...standings[c.id],
          }))
          .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const gdA = a.gf - a.ga;
            const gdB = b.gf - b.ga;
            if (gdB !== gdA) return gdB - gdA;
            return b.gf - a.gf;
          })
          .map((s, i) => ({ ...s, position: i + 1 }));
        
        // Find player's position
        const playerStanding = finalStandings.find(s => s.club.id === club.id);
        const playerPosition = playerStanding?.position || 0;
        
        // Create season history entry
        const seasonEntry: SeasonHistory = {
          season: currentSeason,
          results: results.map(r => ({
            id: r.id,
            home: r.home,
            away: r.away,
            homeScore: r.homeScore,
            awayScore: r.awayScore,
            matchday: r.matchday,
          })),
          finalStandings,
          playerStats: {
            season: currentSeason,
            leaguePosition: playerPosition,
            played: playerStanding?.played || 0,
            won: playerStanding?.won || 0,
            drawn: playerStanding?.drawn || 0,
            lost: playerStanding?.lost || 0,
            goalsFor: playerStanding?.gf || 0,
            goalsAgainst: playerStanding?.ga || 0,
            points: playerStanding?.points || 0,
            champion: playerPosition === 1,
          },
        };
        
        // Generate new fixtures for next season
        const newLeagueFixtures = generateLeagueFixtures(leagueClubs);
        const newFixtures = generatePlayerFixtures(newLeagueFixtures, club);
        const totalMatchdays = (leagueClubs.length - 1) * 2;
        
        const newSeason = currentSeason + 1;
        const newSeasonHistory = [...seasonHistory, seasonEntry];
        
        set({
          currentSeason: newSeason,
          currentMatchday: 1,
          leagueFixtures: newLeagueFixtures,
          fixtures: newFixtures,
          results: [],
          seasonHistory: newSeasonHistory,
          totalMatchdays,
          match: newFixtures[0] ? createMatchFromFixture(newFixtures[0]) : null,
        });
        
        // Sync to Firebase
        if (currentProfile) {
          try {
            await updateProfileGameState(currentProfile.id, {
              currentSeason: newSeason,
              currentMatchday: 1,
              results: [],
              seasonHistory: newSeasonHistory,
            });
            console.log("New season started and synced to Firebase");
          } catch (error) {
            console.error("Failed to sync new season to Firebase:", error);
          }
        }
      },
      
      // Inbox actions
      markMessageRead: (messageId) => {
        const { inboxMessages } = get();
        const updatedMessages = inboxMessages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        );
        set({ inboxMessages: updatedMessages });
      },
      
      clearReadMessages: () => {
        const { inboxMessages } = get();
        const unreadMessages = inboxMessages.filter(msg => !msg.read);
        set({ inboxMessages: unreadMessages });
      },
      
      deleteMessage: (messageId) => {
        const { inboxMessages } = get();
        const updatedMessages = inboxMessages.filter(msg => msg.id !== messageId);
        set({ inboxMessages: updatedMessages });
      },
      
      setCustomSurnames: (surnames) => {
        set({ customSurnames: surnames });
      },
    }),
    {
      name: "football-manager-storage",
      partialize: (state) => ({
        profiles: state.profiles,
        currentProfile: state.currentProfile,
        isLoggedIn: state.isLoggedIn,
        club: state.club,
        currentSeason: state.currentSeason,
        currentMatchday: state.currentMatchday,
        fixtures: state.fixtures,
        leagueFixtures: state.leagueFixtures,
        results: state.results,
        seasonHistory: state.seasonHistory,
        totalMatchdays: state.totalMatchdays,
        formation: state.formation,
        squad: state.squad,
        transfers: state.transfers,
        scouts: state.scouts,
        scoutReports: state.scoutReports,
        transferOffers: state.transferOffers,
        clubBalance: state.clubBalance,
        inboxMessages: state.inboxMessages,
        customSurnames: state.customSurnames,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.isLoggedIn && state.club && state.currentProfile) {
          // Regenerate fixtures if empty
          if (!state.leagueFixtures || state.leagueFixtures.length === 0) {
            const playerLeague = leagues.find(l => l.clubs.some(c => c.id === state.club.id));
            const leagueClubs = playerLeague?.clubs || [];
            state.leagueFixtures = generateLeagueFixtures(leagueClubs);
            state.fixtures = generatePlayerFixtures(state.leagueFixtures, state.club);
          }
          
          // Regenerate squad if empty
          if (!state.squad || state.squad.length === 0) {
            state.squad = generateSquadForClub(state.club);
          }
          
          // Set current match from fixtures
          const currentFixture = state.fixtures.find(f => f.matchday === state.currentMatchday);
          if (currentFixture) {
            state.match = createMatchFromFixture(currentFixture);
          }
          
          state.manager = {
            name: `${state.currentProfile.firstName} ${state.currentProfile.lastName}`,
            club: state.club,
            reputation: 50,
            trophies: 0,
          };
        }
      },
    }
  )
);
