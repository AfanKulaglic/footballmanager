export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  rating: number;
  x: number;
  y: number;
  nationality?: string;
  age?: number;
  value?: number;
}

export interface Club {
  id: number;
  name: string;
  shortName: string;
  logo?: string;
  balance: number;
  reputation: number;
}

export interface Transfer {
  id: number;
  player: Player;
  fromClub: Club | null; // null if free agent
  toClub: Club;
  fee: number;
  date: string;
  type: "buy" | "sell" | "loan_in" | "loan_out" | "free";
}

export interface TransferOffer {
  id: string;
  player: Player;
  fromClub: Club;
  toClub: Club;
  fee: number;
  status: "pending" | "accepted" | "rejected" | "expired";
  type: "incoming" | "outgoing"; // incoming = someone wants to buy your player, outgoing = you want to buy
  createdAt: string;
  expiresAt: string;
  matchday: number;
}

export interface Scout {
  id: number;
  name: string;
  nationality: string;
  rating: number; // 1-20 skill level
  specialization: "youth" | "europe" | "south_america" | "africa" | "asia" | "general";
  salary: number;
  hiredDate: string;
}

export interface ScoutReport {
  id: number;
  scoutId: number;
  player: Player;
  club: Club;
  estimatedValue: number;
  recommendation: "highly_recommended" | "recommended" | "not_recommended";
  date: string;
  status: "scouting" | "completed";
  completesAt: number; // matchday when scouting completes
}

export interface TransferTarget {
  player: Player;
  club: Club;
  askingPrice: number;
  interest: "low" | "medium" | "high";
  scouted: boolean;
}

export interface Match {
  id: number;
  home: Club;
  away: Club;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: "upcoming" | "live" | "finished";
  possession: [number, number];
  xg: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
}

export interface LeagueStanding {
  position: number;
  club: Club;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export interface InboxMessage {
  id: string;
  from: string;
  subject: string;
  content: string;
  preview: string;
  date: string;
  matchday: number;
  read: boolean;
  type: "match_report" | "board" | "news" | "player" | "form" | "milestone" | "transfer" | "staff";
  priority: "low" | "normal" | "high" | "urgent";
  data?: any;
}

export interface Manager {
  name: string;
  club: Club;
  reputation: number;
  trophies: number;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  club: Club;
  createdAt: string;
  deviceId: string; // Unique device identifier - only this device can access this profile
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  clubs: Club[];
}


// Season history types
export interface SeasonResult {
  season: number; // e.g., 2024
  leaguePosition: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  champion: boolean;
}

export interface SeasonHistory {
  season: number;
  results: {
    id: number;
    home: Club;
    away: Club;
    homeScore: number;
    awayScore: number;
    matchday: number;
  }[];
  finalStandings: {
    position: number;
    club: Club;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    points: number;
  }[];
  playerStats: SeasonResult;
}
