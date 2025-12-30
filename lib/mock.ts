import { Club, Player, LeagueStanding, InboxMessage, Manager, Country, League } from "./types";
import { defaultClubSurnames } from "./clubSurnames";
import { getSurnames } from "./logoStore";

// Countries
export const countries: Country[] = [
  { code: "GB-ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
];

// Name pools by nationality
const namesByNationality: Record<string, { first: string[]; last: string[] }> = {
  english: {
    first: ["James", "Harry", "Jack", "Oliver", "George", "Charlie", "Thomas", "William", "Daniel", "Ben", "Marcus", "Kyle", "Jordan", "Aaron", "Mason", "Declan", "Phil", "John", "Raheem", "Bukayo"],
    last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Wilson", "Taylor", "Davies", "Evans", "Walker", "Wright", "Robinson", "Thompson", "White", "Hall", "Clarke", "King", "Green", "Hill", "Scott"],
  },
  spanish: {
    first: ["Carlos", "Miguel", "Sergio", "Pablo", "Alejandro", "David", "Javier", "Álvaro", "Iker", "Dani", "Marcos", "Raúl", "Fernando", "Andrés", "Pedro", "Jordi", "Marc", "Gerard", "Rodri", "Gavi"],
    last: ["García", "Rodríguez", "Martínez", "López", "González", "Hernández", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Ruiz", "Jiménez"],
  },
  bosnian: {
    first: ["Edin", "Miralem", "Sead", "Amer", "Haris", "Adnan", "Senad", "Vedad", "Ermin", "Kenan", "Muhamed", "Amar", "Jasmin", "Eldin", "Nermin", "Damir", "Samir", "Emir", "Armin", "Mirza"],
    last: ["Džeko", "Pjanić", "Kolašinac", "Bešić", "Begović", "Lulić", "Hadžić", "Ibišević", "Višća", "Ahmedhodžić", "Demirović", "Kovačević", "Mehmedović", "Salihović", "Mujdža", "Spahić", "Sušić", "Muslimović", "Rahimić", "Bajramović"],
  },
  brazilian: {
    first: ["Gabriel", "Lucas", "Matheus", "Rafael", "Felipe", "Bruno", "Vinicius", "Neymar", "Thiago", "Casemiro", "Richarlison", "Raphinha", "Rodrygo", "Antony", "Marquinhos", "Fabinho", "Alisson", "Ederson", "Danilo", "Alex"],
    last: ["Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Costa", "Ferreira", "Rodrigues", "Almeida", "Nascimento", "Araújo", "Ribeiro", "Carvalho", "Gomes", "Martins", "Rocha", "Barbosa", "Moreira", "Teixeira"],
  },
  french: {
    first: ["Antoine", "Kylian", "Olivier", "Hugo", "Paul", "N'Golo", "Ousmane", "Karim", "Adrien", "Theo", "Jules", "Aurélien", "Eduardo", "Dayot", "Ibrahima", "Moussa", "Kingsley", "Presnel", "Lucas", "Randal"],
    last: ["Dupont", "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent"],
  },
  german: {
    first: ["Manuel", "Thomas", "Joshua", "Leon", "Kai", "Timo", "Leroy", "Serge", "Antonio", "Florian", "Niklas", "Jamal", "Julian", "Marco", "Ilkay", "Robin", "Jonas", "Maximilian", "Lukas", "Matthias"],
    last: ["Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schröder", "Neumann", "Schwarz", "Zimmermann"],
  },
  portuguese: {
    first: ["Cristiano", "Bruno", "Bernardo", "Diogo", "João", "Rúben", "Nuno", "Rafael", "Gonçalo", "Vitinha", "Pedro", "André", "Ricardo", "Pepe", "Danilo", "Renato", "Francisco", "Otávio", "Matheus", "William"],
    last: ["Silva", "Santos", "Ferreira", "Pereira", "Oliveira", "Costa", "Rodrigues", "Martins", "Fernandes", "Gonçalves", "Gomes", "Lopes", "Marques", "Alves", "Almeida", "Ribeiro", "Pinto", "Carvalho", "Teixeira", "Sousa"],
  },
  dutch: {
    first: ["Virgil", "Frenkie", "Memphis", "Matthijs", "Denzel", "Steven", "Daley", "Cody", "Wout", "Xavi", "Jurriën", "Micky", "Teun", "Jeremie", "Nathan", "Donyell", "Tijjani", "Kenneth", "Luuk", "Ryan"],
    last: ["de Jong", "van Dijk", "de Ligt", "Depay", "Dumfries", "Bergwijn", "Blind", "Gakpo", "Weghorst", "Simons", "Timber", "van de Ven", "Koopmeiners", "Frimpong", "Aké", "Malen", "Reijnders", "Taylor", "de Vrij", "Gravenberch"],
  },
  italian: {
    first: ["Gianluigi", "Leonardo", "Marco", "Federico", "Lorenzo", "Nicolò", "Sandro", "Alessandro", "Giacomo", "Matteo", "Gianluca", "Andrea", "Ciro", "Domenico", "Jorginho", "Bryan", "Davide", "Simone", "Stefano", "Riccardo"],
    last: ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Costa", "Giordano", "Mancini", "Rizzo", "Lombardi", "Moretti"],
  },
  argentine: {
    first: ["Lionel", "Ángel", "Paulo", "Lautaro", "Julián", "Emiliano", "Rodrigo", "Nicolás", "Leandro", "Alejandro", "Gonzalo", "Sergio", "Cristian", "Lisandro", "Enzo", "Alexis", "Giovani", "Nahuel", "Germán", "Exequiel"],
    last: ["González", "Rodríguez", "Gómez", "Fernández", "López", "Díaz", "Martínez", "Pérez", "García", "Sánchez", "Romero", "Sosa", "Torres", "Álvarez", "Ruiz", "Ramírez", "Flores", "Acuña", "Medina", "Herrera"],
  },
};

// Generate a random player for transfer market
export function generateRandomPlayer(
  id: number,
  position: string,
  nationality: string,
  baseRating: number,
  clubSurnames?: string[]
): Player {
  const names = namesByNationality[nationality] || namesByNationality.english;
  const firstName = names.first[Math.floor(Math.random() * names.first.length)];
  
  // Use club-specific surnames if provided, otherwise use nationality-based surnames
  let lastName: string;
  if (clubSurnames && clubSurnames.length > 0) {
    lastName = clubSurnames[Math.floor(Math.random() * clubSurnames.length)];
  } else {
    lastName = names.last[Math.floor(Math.random() * names.last.length)];
  }
  
  const ratingVariance = Math.floor(Math.random() * 10) - 5;
  const rating = Math.max(50, Math.min(99, baseRating + ratingVariance));
  const age = Math.floor(Math.random() * 15) + 18; // 18-32
  const value = rating * rating * 1000;
  
  return {
    id,
    name: `${firstName[0]}. ${lastName}`,
    number: Math.floor(Math.random() * 40) + 1,
    position,
    rating,
    x: 50,
    y: 50,
    nationality,
    age,
    value,
  };
}

// Position coordinates for 4-3-3 formation
const formationPositions: Record<string, { x: number; y: number }> = {
  GK: { x: 50, y: 8 },
  LB: { x: 15, y: 25 },
  CB1: { x: 35, y: 20 },
  CB2: { x: 65, y: 20 },
  RB: { x: 85, y: 25 },
  CDM: { x: 50, y: 40 },
  CM1: { x: 30, y: 50 },
  CM2: { x: 70, y: 50 },
  LW: { x: 15, y: 70 },
  RW: { x: 85, y: 70 },
  ST: { x: 50, y: 85 },
};

// Get nationality for a club based on league
function getClubNationality(clubId: number): string {
  if (clubId >= 101 && clubId <= 120) return "english";
  if (clubId >= 201 && clubId <= 220) return "spanish";
  if (clubId >= 301 && clubId <= 312) return "bosnian";
  return "english";
}

// Get mixed nationalities for top clubs (they have more foreign players)
function getMixedNationalities(clubId: number, reputation: number): string[] {
  const primary = getClubNationality(clubId);
  const allNationalities = Object.keys(namesByNationality);
  
  // Higher reputation = more foreign players
  if (reputation >= 90) {
    return [primary, primary, primary, "brazilian", "french", "portuguese", "dutch", "german", "argentine"];
  } else if (reputation >= 80) {
    return [primary, primary, primary, primary, "brazilian", "french", "portuguese"];
  } else if (reputation >= 70) {
    return [primary, primary, primary, primary, primary, "brazilian"];
  }
  return [primary, primary, primary, primary, primary, primary];
}

// Generate a random player
function generatePlayer(
  id: number,
  position: string,
  posKey: string,
  nationality: string,
  baseRating: number,
  clubSurnames?: string[]
): Player {
  const names = namesByNationality[nationality] || namesByNationality.english;
  const firstName = names.first[Math.floor(Math.random() * names.first.length)];
  
  // Use club-specific surnames if provided, otherwise use nationality-based surnames
  let lastName: string;
  if (clubSurnames && clubSurnames.length > 0) {
    lastName = clubSurnames[Math.floor(Math.random() * clubSurnames.length)];
  } else {
    lastName = names.last[Math.floor(Math.random() * names.last.length)];
  }
  
  // Rating variance based on position importance
  const ratingVariance = Math.floor(Math.random() * 10) - 5;
  const rating = Math.max(50, Math.min(99, baseRating + ratingVariance));
  
  const coords = formationPositions[posKey] || { x: 50, y: 50 };
  
  // Generate squad number based on position
  const positionNumbers: Record<string, number[]> = {
    GK: [1, 13, 25],
    LB: [3, 12, 26],
    CB1: [4, 5, 14],
    CB2: [5, 6, 15],
    RB: [2, 22, 27],
    CDM: [6, 16, 28],
    CM1: [8, 17, 29],
    CM2: [10, 18, 30],
    LW: [11, 19, 31],
    RW: [7, 20, 32],
    ST: [9, 21, 33],
  };
  const numbers = positionNumbers[posKey] || [Math.floor(Math.random() * 30) + 1];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  
  // Map position key to actual position
  const positionMap: Record<string, string> = {
    GK: "GK",
    LB: "LB",
    CB1: "CB",
    CB2: "CB",
    RB: "RB",
    CDM: "CDM",
    CM1: "CM",
    CM2: "CAM",
    LW: "LM",
    RW: "RM",
    ST: "ST",
  };
  
  return {
    id,
    name: `${firstName[0]}. ${lastName}`,
    number,
    position: positionMap[posKey] || position,
    rating,
    x: coords.x,
    y: coords.y,
    nationality,
  };
}

// Generate full squad for a club
export function generateSquadForClub(club: Club, customSurnames?: string[]): Player[] {
  const nationalities = getMixedNationalities(club.id, club.reputation);
  const positions = ["GK", "LB", "CB1", "CB2", "RB", "CDM", "CM1", "CM2", "LW", "RW", "ST"];
  
  // Get surnames for this club
  // Priority: customSurnames param > localStorage > default
  let clubSurnames: string[] | undefined;
  if (customSurnames && customSurnames.length > 0) {
    clubSurnames = customSurnames;
  } else {
    // Try localStorage (for non-user clubs)
    const storedSurnames = getSurnames(club.id);
    if (storedSurnames && storedSurnames.length > 0) {
      clubSurnames = storedSurnames;
    } else {
      // Use default club surnames
      clubSurnames = defaultClubSurnames[club.id];
    }
  }
  
  // Base rating depends on club reputation
  const baseRating = Math.floor(club.reputation * 0.8);
  
  const squad: Player[] = [];
  let playerId = club.id * 100;
  
  // Track used surnames to avoid duplicates in the same squad
  const usedSurnames = new Set<string>();
  
  // Helper to get unique surname
  const getUniqueSurname = (): string | undefined => {
    if (!clubSurnames || clubSurnames.length === 0) return undefined;
    
    // Filter out already used surnames
    const available = clubSurnames.filter(s => !usedSurnames.has(s));
    if (available.length === 0) {
      // If all surnames used, allow repeats
      return clubSurnames[Math.floor(Math.random() * clubSurnames.length)];
    }
    const surname = available[Math.floor(Math.random() * available.length)];
    usedSurnames.add(surname);
    return surname;
  };
  
  // Generate starting 11
  positions.forEach((posKey, index) => {
    const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
    const surname = getUniqueSurname();
    squad.push(generatePlayer(playerId++, posKey, posKey, nationality, baseRating, surname ? [surname] : clubSurnames));
  });
  
  // Generate substitutes (7 more players)
  const subPositions = ["GK", "CB1", "CM1", "CM2", "LW", "RW", "ST"];
  subPositions.forEach((posKey) => {
    const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
    const subRating = baseRating - 5; // Subs are slightly lower rated
    const surname = getUniqueSurname();
    squad.push(generatePlayer(playerId++, posKey, posKey, nationality, subRating, surname ? [surname] : clubSurnames));
  });
  
  // Assign unique squad numbers
  const usedNumbers = new Set<number>();
  squad.forEach((player, index) => {
    let num = player.number;
    while (usedNumbers.has(num)) {
      num = Math.floor(Math.random() * 40) + 1;
    }
    usedNumbers.add(num);
    player.number = num;
  });
  
  return squad;
}

// Cache for generated squads
const squadCache: Map<number, Player[]> = new Map();

// Get squad for a club (cached)
export function getSquadForClub(club: Club, customSurnames?: string[]): Player[] {
  // If custom surnames provided, don't use cache (regenerate)
  if (customSurnames && customSurnames.length > 0) {
    return generateSquadForClub(club, customSurnames);
  }
  
  if (!squadCache.has(club.id)) {
    squadCache.set(club.id, generateSquadForClub(club));
  }
  return squadCache.get(club.id)!;
}

// Clear squad cache (useful when starting new game or when surnames change)
export function clearSquadCache(clubId?: number) {
  if (clubId !== undefined) {
    squadCache.delete(clubId);
  } else {
    squadCache.clear();
  }
}

// English Premier League clubs
export const englishClubs: Club[] = [
  { id: 101, name: "Manchester City", shortName: "MCI", balance: 200000000, reputation: 95 },
  { id: 102, name: "Arsenal", shortName: "ARS", balance: 150000000, reputation: 90 },
  { id: 103, name: "Liverpool", shortName: "LIV", balance: 180000000, reputation: 92 },
  { id: 104, name: "Manchester United", shortName: "MUN", balance: 170000000, reputation: 88 },
  { id: 105, name: "Chelsea", shortName: "CHE", balance: 160000000, reputation: 87 },
  { id: 106, name: "Tottenham Hotspur", shortName: "TOT", balance: 120000000, reputation: 85 },
  { id: 107, name: "Newcastle United", shortName: "NEW", balance: 140000000, reputation: 82 },
  { id: 108, name: "Aston Villa", shortName: "AVL", balance: 80000000, reputation: 78 },
  { id: 109, name: "Brighton", shortName: "BHA", balance: 60000000, reputation: 75 },
  { id: 110, name: "West Ham United", shortName: "WHU", balance: 70000000, reputation: 76 },
  { id: 111, name: "Crystal Palace", shortName: "CRY", balance: 50000000, reputation: 72 },
  { id: 112, name: "Fulham", shortName: "FUL", balance: 45000000, reputation: 70 },
  { id: 113, name: "Wolverhampton", shortName: "WOL", balance: 55000000, reputation: 73 },
  { id: 114, name: "Bournemouth", shortName: "BOU", balance: 40000000, reputation: 68 },
  { id: 115, name: "Brentford", shortName: "BRE", balance: 45000000, reputation: 70 },
  { id: 116, name: "Everton", shortName: "EVE", balance: 50000000, reputation: 74 },
  { id: 117, name: "Nottingham Forest", shortName: "NFO", balance: 55000000, reputation: 71 },
  { id: 118, name: "Leicester City", shortName: "LEI", balance: 60000000, reputation: 73 },
  { id: 119, name: "Ipswich Town", shortName: "IPS", balance: 30000000, reputation: 65 },
  { id: 120, name: "Southampton", shortName: "SOU", balance: 35000000, reputation: 67 },
];

// Spanish La Liga clubs
export const spanishClubs: Club[] = [
  { id: 201, name: "Real Madrid", shortName: "RMA", balance: 250000000, reputation: 98 },
  { id: 202, name: "Barcelona", shortName: "BAR", balance: 180000000, reputation: 95 },
  { id: 203, name: "Atlético Madrid", shortName: "ATM", balance: 120000000, reputation: 88 },
  { id: 204, name: "Sevilla", shortName: "SEV", balance: 70000000, reputation: 80 },
  { id: 205, name: "Real Sociedad", shortName: "RSO", balance: 60000000, reputation: 78 },
  { id: 206, name: "Real Betis", shortName: "BET", balance: 55000000, reputation: 76 },
  { id: 207, name: "Villarreal", shortName: "VIL", balance: 65000000, reputation: 79 },
  { id: 208, name: "Athletic Bilbao", shortName: "ATH", balance: 50000000, reputation: 77 },
  { id: 209, name: "Valencia", shortName: "VAL", balance: 45000000, reputation: 75 },
  { id: 210, name: "Girona", shortName: "GIR", balance: 35000000, reputation: 72 },
  { id: 211, name: "Celta Vigo", shortName: "CEL", balance: 30000000, reputation: 70 },
  { id: 212, name: "Osasuna", shortName: "OSA", balance: 25000000, reputation: 68 },
  { id: 213, name: "Getafe", shortName: "GET", balance: 25000000, reputation: 67 },
  { id: 214, name: "Rayo Vallecano", shortName: "RAY", balance: 20000000, reputation: 66 },
  { id: 215, name: "Mallorca", shortName: "MLL", balance: 22000000, reputation: 67 },
  { id: 216, name: "Las Palmas", shortName: "LPA", balance: 18000000, reputation: 64 },
  { id: 217, name: "Alavés", shortName: "ALA", balance: 15000000, reputation: 62 },
  { id: 218, name: "Espanyol", shortName: "ESP", balance: 20000000, reputation: 65 },
  { id: 219, name: "Leganés", shortName: "LEG", balance: 12000000, reputation: 60 },
  { id: 220, name: "Valladolid", shortName: "VLL", balance: 14000000, reputation: 61 },
];

// Bosnian Premier League clubs
export const bosnianClubs: Club[] = [
  { id: 301, name: "FK Sarajevo", shortName: "SAR", balance: 3000000, reputation: 65 },
  { id: 302, name: "FK Željezničar", shortName: "ZEL", balance: 2500000, reputation: 63 },
  { id: 303, name: "FK Borac Banja Luka", shortName: "BOR", balance: 2000000, reputation: 60 },
  { id: 304, name: "HŠK Zrinjski Mostar", shortName: "ZRI", balance: 2800000, reputation: 64 },
  { id: 305, name: "FK Velež Mostar", shortName: "VEL", balance: 1800000, reputation: 58 },
  { id: 306, name: "NK Široki Brijeg", shortName: "SIR", balance: 1500000, reputation: 55 },
  { id: 307, name: "FK Tuzla City", shortName: "TUZ", balance: 1200000, reputation: 52 },
  { id: 308, name: "FK Sloboda Tuzla", shortName: "SLO", balance: 1000000, reputation: 50 },
  { id: 309, name: "NK Posušje", shortName: "POS", balance: 800000, reputation: 48 },
  { id: 310, name: "FK Igman Konjic", shortName: "IGM", balance: 600000, reputation: 45 },
  { id: 311, name: "FK Radnik Bijeljina", shortName: "RAD", balance: 900000, reputation: 49 },
  { id: 312, name: "NK GOŠK Gabela", shortName: "GOS", balance: 500000, reputation: 44 },
];

// All leagues
export const leagues: League[] = [
  { id: "eng", name: "Premier League", country: "England", clubs: englishClubs },
  { id: "esp", name: "La Liga", country: "Spain", clubs: spanishClubs },
  { id: "bih", name: "Premijer Liga BiH", country: "Bosnia", clubs: bosnianClubs },
];

// Legacy clubs for compatibility
export const mockClubs: Club[] = [
  { id: 1, name: "FK Partizan", shortName: "PAR", balance: 5000000, reputation: 75 },
  { id: 2, name: "Crvena Zvezda", shortName: "CZV", balance: 8000000, reputation: 80 },
  { id: 3, name: "Vojvodina", shortName: "VOJ", balance: 2500000, reputation: 65 },
  { id: 4, name: "TSC Bačka Topola", shortName: "TSC", balance: 3000000, reputation: 60 },
  { id: 5, name: "Čukarički", shortName: "CUK", balance: 1500000, reputation: 55 },
];

// Legacy mockPlayers - now generated dynamically
export const mockPlayers: Player[] = [
  { id: 1, name: "Popović", number: 1, position: "GK", rating: 72, x: 50, y: 8, nationality: "bosnian" },
  { id: 2, name: "Živković", number: 2, position: "RB", rating: 70, x: 85, y: 25, nationality: "bosnian" },
  { id: 3, name: "Vujačić", number: 4, position: "CB", rating: 74, x: 35, y: 20, nationality: "bosnian" },
  { id: 4, name: "Saldaña", number: 5, position: "CB", rating: 73, x: 65, y: 20, nationality: "spanish" },
  { id: 5, name: "Urošević", number: 3, position: "LB", rating: 71, x: 15, y: 25, nationality: "bosnian" },
  { id: 6, name: "Natcho", number: 6, position: "CDM", rating: 76, x: 50, y: 40, nationality: "bosnian" },
  { id: 7, name: "Menig", number: 7, position: "RM", rating: 72, x: 85, y: 70, nationality: "dutch" },
  { id: 8, name: "Severina", number: 8, position: "CM", rating: 71, x: 30, y: 50, nationality: "bosnian" },
  { id: 9, name: "Lazarević", number: 11, position: "LM", rating: 70, x: 15, y: 70, nationality: "bosnian" },
  { id: 10, name: "Gomes", number: 10, position: "CAM", rating: 78, x: 70, y: 50, nationality: "portuguese" },
  { id: 11, name: "Nathael", number: 9, position: "ST", rating: 75, x: 50, y: 85, nationality: "brazilian" },
];

export const mockStandings: LeagueStanding[] = [
  { position: 1, club: mockClubs[1], played: 15, won: 12, drawn: 2, lost: 1, gf: 35, ga: 10, gd: 25, points: 38 },
  { position: 2, club: mockClubs[0], played: 15, won: 11, drawn: 3, lost: 1, gf: 28, ga: 8, gd: 20, points: 36 },
  { position: 3, club: mockClubs[3], played: 15, won: 8, drawn: 4, lost: 3, gf: 22, ga: 14, gd: 8, points: 28 },
  { position: 4, club: mockClubs[2], played: 15, won: 6, drawn: 5, lost: 4, gf: 18, ga: 15, gd: 3, points: 23 },
  { position: 5, club: mockClubs[4], played: 15, won: 5, drawn: 4, lost: 6, gf: 15, ga: 20, gd: -5, points: 19 },
];

export const mockInbox: InboxMessage[] = [
  { 
    id: "mock_1", 
    from: "Board", 
    subject: "Season Objectives", 
    content: "The board expects a top 3 finish this season. We believe in your abilities to lead the team to success.",
    preview: "The board expects a top 3 finish...", 
    date: new Date().toISOString(), 
    matchday: 1,
    read: false, 
    type: "board",
    priority: "high"
  },
  { 
    id: "mock_2", 
    from: "Scout", 
    subject: "Player Report: M. Silva", 
    content: "Our scouts have identified a promising young striker from Brazil. He shows excellent potential.",
    preview: "Promising young striker from Brazil...", 
    date: new Date().toISOString(), 
    matchday: 1,
    read: true, 
    type: "transfer",
    priority: "normal"
  },
  { 
    id: "mock_3", 
    from: "News", 
    subject: "Derby Preview", 
    content: "All eyes on the upcoming derby match. The fans are expecting a big performance from the team.",
    preview: "All eyes on the upcoming derby match...", 
    date: new Date().toISOString(), 
    matchday: 1,
    read: true, 
    type: "news",
    priority: "normal"
  },
];

export const mockManager: Manager = {
  name: "You",
  club: mockClubs[0],
  reputation: 65,
  trophies: 0,
};
