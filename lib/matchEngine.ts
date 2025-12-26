import { Club } from "./types";
import { getSquadForClub } from "./mock";

export interface BallPosition {
  x: number;
  y: number;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "chance" | "save" | "corner" | "foul" | "pass" | "shot";
  team: "home" | "away";
  player?: string;
  description: string;
  ballPath?: BallPosition[]; // Path the ball takes during this event
}

// Player positions for simulation
export interface PlayerPosition {
  id: number;
  number: number;
  x: number;
  y: number;
  team: "home" | "away";
}

// Get random player from a club's squad
function getRandomPlayerFromClub(club: Club): string {
  const squad = getSquadForClub(club);
  const startingXI = squad.slice(0, 11);
  const player = startingXI[Math.floor(Math.random() * startingXI.length)];
  return player.name;
}

// Generate ball path for goal
function generateGoalPath(team: "home" | "away"): BallPosition[] {
  const isHome = team === "home";
  // Home attacks upward (toward y=0), Away attacks downward (toward y=100)
  const targetY = isHome ? 5 : 95;
  const startY = isHome ? 70 : 30;
  
  return [
    { x: 50, y: 50 }, // Midfield
    { x: 30 + Math.random() * 40, y: isHome ? 40 : 60 }, // Build up
    { x: 25 + Math.random() * 50, y: isHome ? 25 : 75 }, // Attack
    { x: 40 + Math.random() * 20, y: isHome ? 15 : 85 }, // Final third
    { x: 50, y: targetY }, // GOAL!
  ];
}

// Generate ball path for chance/shot
function generateChancePath(team: "home" | "away"): BallPosition[] {
  const isHome = team === "home";
  const targetY = isHome ? 8 : 92;
  
  return [
    { x: 50, y: 50 },
    { x: 30 + Math.random() * 40, y: isHome ? 35 : 65 },
    { x: 35 + Math.random() * 30, y: isHome ? 20 : 80 },
    { x: 45 + Math.random() * 10, y: targetY }, // Shot
  ];
}

// Generate ball path for corner
function generateCornerPath(team: "home" | "away"): BallPosition[] {
  const isHome = team === "home";
  const cornerX = Math.random() > 0.5 ? 5 : 95;
  const cornerY = isHome ? 5 : 95;
  
  return [
    { x: cornerX, y: cornerY },
    { x: 50, y: isHome ? 15 : 85 }, // Into the box
  ];
}

// Generate random ball movement for normal play
function generatePassPath(): BallPosition[] {
  const startX = 20 + Math.random() * 60;
  const startY = 30 + Math.random() * 40;
  return [
    { x: startX, y: startY },
    { x: startX + (Math.random() - 0.5) * 30, y: startY + (Math.random() - 0.5) * 20 },
  ];
}

function generateMatchEvents(home: Club, away: Club): MatchEvent[] {
  const events: MatchEvent[] = [];
  const homeStrength = home.reputation;
  const awayStrength = away.reputation;
  
  // Track opponent substitutions (3-5 subs typically)
  const opponentSubMinutes: number[] = [];
  const numOpponentSubs = 3 + Math.floor(Math.random() * 3); // 3-5 subs
  
  // Generate random minutes for opponent subs (usually after 55')
  for (let i = 0; i < numOpponentSubs; i++) {
    const subMinute = 55 + Math.floor(Math.random() * 30); // Between 55-85
    opponentSubMinutes.push(subMinute);
  }
  opponentSubMinutes.sort((a, b) => a - b);
  
  for (let minute = 1; minute <= 90; minute++) {
    const rand = Math.random();
    
    // Check for opponent substitution at this minute
    if (opponentSubMinutes.includes(minute)) {
      const playerOut = getRandomPlayerFromClub(away);
      const playerIn = `Sub ${opponentSubMinutes.indexOf(minute) + 1}`;
      events.push({
        minute,
        type: "substitution",
        team: "away",
        player: playerIn,
        description: `🔄 ${away.shortName} substitution: ${playerOut} ➜ ${playerIn}`,
      });
    }
    
    // Goal chance (~3-4 goals per match on average)
    if (rand < 0.025) {
      const isHome = Math.random() < (homeStrength / (homeStrength + awayStrength));
      const team = isHome ? "home" : "away";
      const player = getRandomPlayerFromClub(isHome ? home : away);
      events.push({
        minute,
        type: "goal",
        team,
        player,
        description: `⚽ GOAL! ${player} scores!`,
        ballPath: generateGoalPath(team),
      });
    }
    // Chance/shot
    else if (rand < 0.08) {
      const isHome = Math.random() < 0.55;
      const team = isHome ? "home" : "away";
      const player = getRandomPlayerFromClub(isHome ? home : away);
      const outcomes = [
        `${player} shoots but it goes wide`,
        `${player} with a shot, saved by the keeper!`,
        `${player} hits the post!`,
        `Great chance for ${player}, but blocked!`
      ];
      events.push({
        minute,
        type: "chance",
        team,
        player,
        description: outcomes[Math.floor(Math.random() * outcomes.length)],
        ballPath: generateChancePath(team),
      });
    }
    // Yellow card
    else if (rand < 0.095) {
      const isHome = Math.random() < 0.5;
      const team = isHome ? "home" : "away";
      const player = getRandomPlayerFromClub(isHome ? home : away);
      events.push({
        minute,
        type: "yellow_card",
        team,
        player,
        description: `🟨 Yellow card for ${player}`,
      });
    }
    // Corner
    else if (rand < 0.12) {
      const team = Math.random() < 0.55 ? "home" : "away";
      events.push({
        minute,
        type: "corner",
        team,
        description: `Corner kick for ${team === "home" ? "home" : "away"} team`,
        ballPath: generateCornerPath(team),
      });
    }
    // Foul
    else if (rand < 0.15) {
      const isHome = Math.random() < 0.5;
      const team = isHome ? "home" : "away";
      const player = getRandomPlayerFromClub(isHome ? home : away);
      events.push({
        minute,
        type: "foul",
        team,
        player,
        description: `Foul by ${player}`,
      });
    }
  }
  
  return events.sort((a, b) => a.minute - b.minute);
}

export function simulateMatch(home: Club, away: Club): { events: MatchEvent[], finalScore: [number, number] } {
  const events = generateMatchEvents(home, away);
  
  const homeGoals = events.filter(e => e.type === "goal" && e.team === "home").length;
  const awayGoals = events.filter(e => e.type === "goal" && e.team === "away").length;
  
  return {
    events,
    finalScore: [homeGoals, awayGoals]
  };
}

export function calculateMatchStats(events: MatchEvent[], minute: number): {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
} {
  const relevantEvents = events.filter(e => e.minute <= minute);
  
  const homeShots = relevantEvents.filter(e => (e.type === "goal" || e.type === "chance") && e.team === "home").length;
  const awayShots = relevantEvents.filter(e => (e.type === "goal" || e.type === "chance") && e.team === "away").length;
  
  const homeGoals = relevantEvents.filter(e => e.type === "goal" && e.team === "home").length;
  const awayGoals = relevantEvents.filter(e => e.type === "goal" && e.team === "away").length;
  
  const homeCorners = relevantEvents.filter(e => e.type === "corner" && e.team === "home").length;
  const awayCorners = relevantEvents.filter(e => e.type === "corner" && e.team === "away").length;
  
  const homeFouls = relevantEvents.filter(e => e.type === "foul" && e.team === "home").length;
  const awayFouls = relevantEvents.filter(e => e.type === "foul" && e.team === "away").length;
  
  const basePossession = 50 + (homeShots - awayShots) * 2;
  const possession = Math.min(70, Math.max(30, basePossession));
  
  return {
    possession: [Math.round(possession), Math.round(100 - possession)],
    shots: [homeShots, awayShots],
    shotsOnTarget: [homeGoals + Math.floor(homeShots * 0.4), awayGoals + Math.floor(awayShots * 0.4)],
    corners: [homeCorners, awayCorners],
    fouls: [homeFouls, awayFouls]
  };
}

// Generate initial player positions for both teams
export function getInitialPlayerPositions(): PlayerPosition[] {
  // Home team (plays bottom half, attacks upward) - Dark jerseys
  const homePositions: PlayerPosition[] = [
    { id: 1, number: 1, x: 50, y: 92, team: "home" },   // GK
    { id: 2, number: 2, x: 80, y: 78, team: "home" },   // RB
    { id: 3, number: 4, x: 60, y: 82, team: "home" },   // CB
    { id: 4, number: 5, x: 40, y: 82, team: "home" },   // CB
    { id: 5, number: 3, x: 20, y: 78, team: "home" },   // LB
    { id: 6, number: 6, x: 50, y: 65, team: "home" },   // CDM
    { id: 7, number: 7, x: 75, y: 55, team: "home" },   // RM
    { id: 8, number: 8, x: 50, y: 52, team: "home" },   // CM
    { id: 9, number: 11, x: 25, y: 55, team: "home" },  // LM
    { id: 10, number: 10, x: 50, y: 40, team: "home" }, // CAM
    { id: 11, number: 9, x: 50, y: 28, team: "home" },  // ST
  ];

  // Away team (plays top half, attacks downward) - Red jerseys
  const awayPositions: PlayerPosition[] = [
    { id: 12, number: 1, x: 50, y: 8, team: "away" },   // GK
    { id: 13, number: 2, x: 20, y: 22, team: "away" },  // RB
    { id: 14, number: 4, x: 40, y: 18, team: "away" },  // CB
    { id: 15, number: 5, x: 60, y: 18, team: "away" },  // CB
    { id: 16, number: 3, x: 80, y: 22, team: "away" },  // LB
    { id: 17, number: 6, x: 50, y: 35, team: "away" },  // CDM
    { id: 18, number: 7, x: 25, y: 45, team: "away" },  // RM
    { id: 19, number: 8, x: 50, y: 48, team: "away" },  // CM
    { id: 20, number: 11, x: 75, y: 45, team: "away" }, // LM
    { id: 21, number: 10, x: 50, y: 60, team: "away" }, // CAM
    { id: 22, number: 9, x: 50, y: 72, team: "away" },  // ST
  ];

  return [...homePositions, ...awayPositions];
}