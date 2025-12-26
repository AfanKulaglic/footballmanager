"use client";

import { useState, useEffect } from "react";
import { getLogo } from "@/lib/logoStore";

interface ClubLogoProps {
  clubId: number;
  size?: number;
  className?: string;
}

export default function ClubLogo({ clubId, size = 40, className = "" }: ClubLogoProps) {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getLogo(clubId);
    if (stored) {
      setCustomLogo(stored);
    }
  }, [clubId]);

  // If there's a custom uploaded logo, use it
  if (mounted && customLogo) {
    return (
      <img
        src={customLogo}
        alt={`Club ${clubId}`}
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }

  const logos: Record<number, JSX.Element> = {
    // ============ PREMIER LEAGUE ============
    
    // Manchester City - Circular badge, sky blue with eagle and ship
    101: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#6CABDD"/>
        <circle cx="50" cy="50" r="44" fill="#1C2C5B"/>
        <circle cx="50" cy="50" r="40" fill="#6CABDD"/>
        <circle cx="50" cy="50" r="36" fill="#1C2C5B"/>
        {/* Eagle */}
        <path d="M50 18 L54 26 L62 24 L56 30 L60 38 L50 32 L40 38 L44 30 L38 24 L46 26 Z" fill="#6CABDD"/>
        {/* Ship */}
        <path d="M35 52 L65 52 L60 68 L40 68 Z" fill="#6CABDD"/>
        <path d="M50 42 L50 52 M42 48 L58 48" stroke="#6CABDD" strokeWidth="2"/>
        {/* Stars */}
        <circle cx="30" cy="50" r="2" fill="#6CABDD"/>
        <circle cx="70" cy="50" r="2" fill="#6CABDD"/>
        <circle cx="50" cy="78" r="2" fill="#6CABDD"/>
      </svg>
    ),
    
    // Arsenal - Red shield with golden cannon
    102: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#EF0107"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#FFFFFF"/>
        <path d="M50 14 L82 26 L82 52 Q82 78 50 86 Q18 78 18 52 L18 26 Z" fill="#EF0107"/>
        {/* Cannon */}
        <rect x="22" y="48" width="56" height="10" rx="3" fill="#FFCC00"/>
        <circle cx="75" cy="53" r="8" fill="#FFCC00"/>
        <rect x="15" y="50" width="10" height="6" fill="#FFCC00"/>
        <polygon points="15,50 10,47 10,59 15,56" fill="#FFCC00"/>
      </svg>
    ),
    
    // Liverpool - Red shield with Liverbird
    103: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#C8102E"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#C8102E"/>
        {/* Liverbird */}
        <path d="M50 20 Q65 25 62 45 Q60 60 50 75 Q40 60 38 45 Q35 25 50 20" fill="#FFFFFF"/>
        <path d="M50 28 L52 22 L54 28 M48 28 L46 22 L44 28" stroke="#C8102E" strokeWidth="1.5"/>
        <ellipse cx="50" cy="40" rx="6" ry="10" fill="#C8102E"/>
        <path d="M44 50 L50 65 L56 50" fill="#C8102E"/>
        {/* Flames */}
        <path d="M25 35 Q30 25 28 40 Q32 30 30 42" stroke="#FFCC00" strokeWidth="2" fill="none"/>
        <path d="M75 35 Q70 25 72 40 Q68 30 70 42" stroke="#FFCC00" strokeWidth="2" fill="none"/>
        <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">EST 1892</text>
      </svg>
    ),
    
    // Manchester United - Red shield with devil and ship
    104: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#DA291C"/>
        <path d="M50 6 L92 20 L92 54 Q92 86 50 94 Q8 86 8 54 L8 20 Z" fill="#FBE122"/>
        <path d="M50 12 L86 24 L86 52 Q86 80 50 88 Q14 80 14 52 L14 24 Z" fill="#DA291C"/>
        {/* Devil */}
        <circle cx="50" cy="42" r="14" fill="#FBE122"/>
        <path d="M40 35 L36 25 L44 32 M60 35 L64 25 L56 32" fill="#DA291C"/>
        <circle cx="45" cy="40" r="2" fill="#DA291C"/>
        <circle cx="55" cy="40" r="2" fill="#DA291C"/>
        <path d="M44 48 Q50 52 56 48" stroke="#DA291C" strokeWidth="2" fill="none"/>
        {/* Ship below */}
        <path d="M35 62 L65 62 L60 75 L40 75 Z" fill="#FBE122"/>
        <path d="M50 55 L50 62" stroke="#FBE122" strokeWidth="2"/>
      </svg>
    ),
    
    // Chelsea - Circular blue badge with lion
    105: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#034694"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#034694"/>
        {/* Lion holding staff */}
        <path d="M38 30 Q50 20 62 30 L65 45 Q62 60 50 70 Q38 60 35 45 Z" fill="#DBA111"/>
        <circle cx="45" cy="38" r="2" fill="#034694"/>
        <circle cx="55" cy="38" r="2" fill="#034694"/>
        <path d="M45 48 Q50 52 55 48" stroke="#034694" strokeWidth="1.5" fill="none"/>
        {/* Staff */}
        <rect x="48" y="50" width="4" height="25" fill="#DBA111"/>
        <circle cx="50" cy="48" r="4" fill="#C8102E"/>
        {/* Roses */}
        <circle cx="28" cy="50" r="5" fill="#C8102E"/>
        <circle cx="72" cy="50" r="5" fill="#C8102E"/>
        <text x="50" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="5">CHELSEA FC</text>
      </svg>
    ),
    
    // Tottenham - Navy shield with cockerel on ball
    106: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#132257"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#FFFFFF"/>
        {/* Cockerel */}
        <ellipse cx="50" cy="52" rx="12" ry="20" fill="#132257"/>
        <circle cx="50" cy="32" r="10" fill="#132257"/>
        <path d="M50 22 L52 12 L50 18 L48 12 Z" fill="#132257"/>
        <path d="M42 30 L38 28" stroke="#132257" strokeWidth="2"/>
        <circle cx="47" cy="30" r="1.5" fill="#FFFFFF"/>
        {/* Ball */}
        <circle cx="50" cy="78" r="8" fill="#132257"/>
        <path d="M44 78 L56 78 M50 70 L50 86" stroke="#FFFFFF" strokeWidth="1"/>
        {/* Legs */}
        <path d="M46 70 L44 78 M54 70 L56 78" stroke="#132257" strokeWidth="2"/>
      </svg>
    ),
    
    // Newcastle - Black/white stripes with seahorses
    107: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#241F20"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#FFFFFF"/>
        {/* Stripes */}
        <rect x="18" y="22" width="10" height="55" fill="#241F20"/>
        <rect x="38" y="22" width="10" height="55" fill="#241F20"/>
        <rect x="58" y="22" width="10" height="55" fill="#241F20"/>
        <rect x="78" y="22" width="6" height="55" fill="#241F20"/>
        {/* Castle */}
        <rect x="40" y="40" width="20" height="25" fill="#241F20"/>
        <rect x="42" y="35" width="5" height="8" fill="#241F20"/>
        <rect x="53" y="35" width="5" height="8" fill="#241F20"/>
        <path d="M45 55 L45 65 L55 65 L55 55 Q50 50 45 55" fill="#FFFFFF"/>
      </svg>
    ),
    
    // Aston Villa - Claret shield with lion
    108: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#670E36"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#95BFE5"/>
        {/* Lion */}
        <path d="M35 28 L50 18 L65 28 L65 70 L50 82 L35 70 Z" fill="#670E36"/>
        <path d="M42 35 Q50 28 58 35 L58 50 Q50 58 42 50 Z" fill="#FEF200"/>
        <circle cx="46" cy="40" r="2" fill="#670E36"/>
        <circle cx="54" cy="40" r="2" fill="#670E36"/>
        <path d="M46 48 Q50 52 54 48" stroke="#670E36" strokeWidth="1.5" fill="none"/>
        {/* Star */}
        <path d="M50 60 L52 66 L58 66 L53 70 L55 76 L50 72 L45 76 L47 70 L42 66 L48 66 Z" fill="#FEF200"/>
      </svg>
    ),
    
    // Brighton - Seagull on blue
    109: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#0057B8"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#FFFFFF"/>
        {/* Seagull */}
        <path d="M20 45 Q35 25 50 40 Q65 25 80 45 Q65 38 50 48 Q35 38 20 45" fill="#0057B8"/>
        <circle cx="35" cy="38" r="2" fill="#0057B8"/>
        <path d="M28 42 L22 45" stroke="#0057B8" strokeWidth="2"/>
        {/* Waves */}
        <path d="M20 65 Q35 58 50 65 Q65 72 80 65" stroke="#0057B8" strokeWidth="2" fill="none"/>
        <path d="M20 72 Q35 65 50 72 Q65 79 80 72" stroke="#0057B8" strokeWidth="2" fill="none"/>
        <text x="50" y="88" textAnchor="middle" fill="#0057B8" fontSize="5" fontWeight="bold">ALBION</text>
      </svg>
    ),
    
    // West Ham - Claret shield with crossed hammers
    110: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#7A263A"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#1BB1E7"/>
        {/* Castle */}
        <rect x="35" y="20" width="30" height="8" fill="#7A263A"/>
        <rect x="38" y="15" width="6" height="8" fill="#7A263A"/>
        <rect x="48" y="15" width="6" height="8" fill="#7A263A"/>
        <rect x="58" y="15" width="6" height="8" fill="#7A263A"/>
        {/* Crossed Hammers */}
        <rect x="25" y="42" width="50" height="8" rx="2" fill="#7A263A" transform="rotate(-30 50 50)"/>
        <rect x="25" y="50" width="50" height="8" rx="2" fill="#7A263A" transform="rotate(30 50 50)"/>
        <rect x="18" y="32" width="12" height="18" rx="2" fill="#7A263A" transform="rotate(-30 50 50)"/>
        <rect x="70" y="50" width="12" height="18" rx="2" fill="#7A263A" transform="rotate(30 50 50)"/>
      </svg>
    ),
    
    // Crystal Palace - Eagle on red/blue
    111: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#1B458F"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#C4122E"/>
        {/* Eagle */}
        <path d="M50 20 L60 35 L78 32 L62 48 L70 70 L50 55 L30 70 L38 48 L22 32 L40 35 Z" fill="#1B458F" stroke="#FFFFFF" strokeWidth="2"/>
        <circle cx="50" cy="38" r="3" fill="#FFFFFF"/>
        <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">CPFC</text>
      </svg>
    ),
    
    // Fulham - Black/white with FFC
    112: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#000000"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#FFFFFF"/>
        <path d="M50 16 L80 28 L80 50 Q80 74 50 84 Q20 74 20 50 L20 28 Z" fill="#000000"/>
        <text x="50" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">FFC</text>
        <text x="50" y="70" textAnchor="middle" fill="#CC0000" fontSize="10">1879</text>
      </svg>
    ),
    
    // Wolves - Gold wolf head on black hexagon
    113: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" fill="#FDB913"/>
        <polygon points="50,8 88,28 88,72 50,92 12,72 12,28" fill="#231F20"/>
        {/* Wolf head */}
        <path d="M30 35 L50 20 L70 35 L65 65 L50 75 L35 65 Z" fill="#FDB913"/>
        <path d="M35 40 L45 35 L50 40 L55 35 L65 40" stroke="#231F20" strokeWidth="2" fill="none"/>
        <ellipse cx="40" cy="45" rx="4" ry="5" fill="#231F20"/>
        <ellipse cx="60" cy="45" rx="4" ry="5" fill="#231F20"/>
        <circle cx="40" cy="44" r="1.5" fill="#FFFFFF"/>
        <circle cx="60" cy="44" r="1.5" fill="#FFFFFF"/>
        <path d="M45 55 L50 62 L55 55" fill="#231F20"/>
        <ellipse cx="50" cy="58" rx="3" ry="2" fill="#231F20"/>
      </svg>
    ),
    
    // Bournemouth - Red/black stripes
    114: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#DA291C"/>
        <circle cx="50" cy="50" r="44" fill="#000000"/>
        <circle cx="50" cy="50" r="40" fill="#DA291C"/>
        {/* Head silhouette */}
        <ellipse cx="50" cy="45" rx="18" ry="22" fill="#000000"/>
        <text x="50" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">AFC</text>
        <text x="50" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="5">BOURNEMOUTH</text>
      </svg>
    ),
    
    // Brentford - Red/white stripes with bee
    115: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#E30613"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#FFFFFF"/>
        {/* Stripes */}
        <rect x="22" y="22" width="8" height="55" fill="#E30613"/>
        <rect x="38" y="22" width="8" height="55" fill="#E30613"/>
        <rect x="54" y="22" width="8" height="55" fill="#E30613"/>
        <rect x="70" y="22" width="8" height="55" fill="#E30613"/>
        {/* Bee */}
        <ellipse cx="50" cy="50" rx="12" ry="8" fill="#FFD700" stroke="#000" strokeWidth="1"/>
        <ellipse cx="50" cy="50" rx="10" ry="6" fill="#FFD700"/>
        <rect x="44" y="46" width="3" height="8" fill="#000"/>
        <rect x="50" y="46" width="3" height="8" fill="#000"/>
        <circle cx="38" cy="50" r="4" fill="#000"/>
      </svg>
    ),
    
    // Everton - Blue shield with tower
    116: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#003399"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#FFFFFF"/>
        {/* Tower (Prince Rupert's Tower) */}
        <rect x="40" y="25" width="20" height="50" fill="#003399"/>
        <rect x="38" y="20" width="24" height="8" fill="#003399"/>
        <rect x="42" y="15" width="5" height="8" fill="#003399"/>
        <rect x="53" y="15" width="5" height="8" fill="#003399"/>
        {/* Door */}
        <path d="M45 65 L45 75 L55 75 L55 65 Q50 58 45 65" fill="#FFFFFF"/>
        {/* Windows */}
        <rect x="44" y="35" width="5" height="6" fill="#FFFFFF"/>
        <rect x="51" y="35" width="5" height="6" fill="#FFFFFF"/>
        <rect x="44" y="48" width="5" height="6" fill="#FFFFFF"/>
        <rect x="51" y="48" width="5" height="6" fill="#FFFFFF"/>
        {/* Wreaths */}
        <circle cx="28" cy="50" r="8" fill="none" stroke="#003399" strokeWidth="3"/>
        <circle cx="72" cy="50" r="8" fill="none" stroke="#003399" strokeWidth="3"/>
      </svg>
    ),
    
    // Nottingham Forest - Red with tree
    117: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#DD0000"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#DD0000"/>
        {/* Tree */}
        <path d="M50 18 L62 35 L55 35 L65 50 L55 50 L68 68 L32 68 L45 50 L35 50 L45 35 L38 35 Z" fill="#FFFFFF"/>
        {/* Trunk */}
        <rect x="46" y="68" width="8" height="12" fill="#FFFFFF"/>
        {/* Wavy lines (River Trent) */}
        <path d="M25 82 Q37 78 50 82 Q63 86 75 82" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
      </svg>
    ),
    
    // Leicester - Blue with fox
    118: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#003090"/>
        <circle cx="50" cy="50" r="44" fill="#FDBE11"/>
        <circle cx="50" cy="50" r="40" fill="#003090"/>
        {/* Fox head */}
        <path d="M30 40 L50 20 L70 40 L65 70 L50 80 L35 70 Z" fill="#FDBE11"/>
        <path d="M35 45 L50 30 L65 45" fill="#FFFFFF"/>
        <ellipse cx="40" cy="48" rx="4" ry="5" fill="#003090"/>
        <ellipse cx="60" cy="48" rx="4" ry="5" fill="#003090"/>
        <circle cx="40" cy="47" r="1.5" fill="#FFFFFF"/>
        <circle cx="60" cy="47" r="1.5" fill="#FFFFFF"/>
        <ellipse cx="50" cy="60" rx="5" ry="4" fill="#003090"/>
        <path d="M50 64 L50 72" stroke="#003090" strokeWidth="2"/>
      </svg>
    ),
    
    // Ipswich - Blue with horse
    119: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 2 L95 18 L95 55 Q95 90 50 98 Q5 90 5 55 L5 18 Z" fill="#0033A0"/>
        <path d="M50 8 L88 22 L88 54 Q88 84 50 92 Q12 84 12 54 L12 22 Z" fill="#FFFFFF"/>
        {/* Suffolk Punch horse */}
        <path d="M35 35 L45 25 L55 28 L60 35 L58 50 L65 65 L55 68 L50 55 L45 68 L35 65 L40 50 Z" fill="#0033A0"/>
        <circle cx="52" cy="32" r="2" fill="#FFFFFF"/>
        <path d="M55 28 L62 22 L58 30" fill="#0033A0"/>
        <text x="50" y="85" textAnchor="middle" fill="#0033A0" fontSize="6" fontWeight="bold">ITFC</text>
      </svg>
    ),
    
    // Southampton - Red/white with halo and tree
    120: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#D71920"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#D71920"/>
        {/* Halo */}
        <ellipse cx="50" cy="28" rx="12" ry="4" fill="none" stroke="#FFFFFF" strokeWidth="3"/>
        {/* Tree */}
        <path d="M50 32 L58 45 L54 45 L60 58 L54 58 L62 72 L38 72 L46 58 L40 58 L46 45 L42 45 Z" fill="#FFFFFF"/>
        {/* Football */}
        <circle cx="50" cy="82" r="6" fill="#FFFFFF"/>
        <path d="M46 82 L54 82 M50 76 L50 88" stroke="#D71920" strokeWidth="1"/>
      </svg>
    ),

    // ============ LA LIGA ============
    
    // Real Madrid - White with crown and purple stripe
    201: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#FFFFFF" stroke="#00529F" strokeWidth="2"/>
        {/* Crown */}
        <path d="M28 18 L32 8 L40 16 L50 5 L60 16 L68 8 L72 18 Z" fill="#FEBE10" stroke="#00529F" strokeWidth="1"/>
        {/* Purple diagonal */}
        <path d="M8 22 L50 60 L50 97 Q8 90 8 60 Z" fill="#6A2E91" opacity="0.9"/>
        {/* MFC letters */}
        <text x="50" y="55" textAnchor="middle" fill="#00529F" fontSize="18" fontWeight="bold">RM</text>
        <text x="50" y="75" textAnchor="middle" fill="#00529F" fontSize="6">CF</text>
      </svg>
    ),
    
    // Barcelona - Blaugrana quarters with cross
    202: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#A50044" stroke="#FEBE10" strokeWidth="3"/>
        {/* Quarters */}
        <path d="M50 5 L92 22 L92 50 L50 50 Z" fill="#004D98"/>
        <path d="M8 50 L50 50 L50 97 Q8 90 8 60 Z" fill="#004D98"/>
        {/* Stripes in red quarters */}
        <rect x="52" y="52" width="5" height="35" fill="#FEBE10"/>
        <rect x="62" y="52" width="5" height="35" fill="#FEBE10"/>
        <rect x="72" y="52" width="5" height="30" fill="#FEBE10"/>
        {/* Cross of St George */}
        <rect x="12" y="25" width="35" height="4" fill="#FFFFFF"/>
        <rect x="28" y="12" width="4" height="30" fill="#FFFFFF"/>
        <circle cx="30" cy="27" r="8" fill="#A50044"/>
        {/* Ball */}
        <circle cx="50" cy="75" r="10" fill="#FEBE10"/>
        <text x="50" y="79" textAnchor="middle" fill="#A50044" fontSize="8" fontWeight="bold">FCB</text>
      </svg>
    ),
    
    // Atletico Madrid - Red/white stripes with bear and tree
    203: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#272E61" stroke="#FFFFFF" strokeWidth="2"/>
        {/* Red/white stripes */}
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        <rect x="18" y="25" width="7" height="55" fill="#CB3524"/>
        <rect x="32" y="25" width="7" height="55" fill="#CB3524"/>
        <rect x="46" y="25" width="7" height="55" fill="#CB3524"/>
        <rect x="60" y="25" width="7" height="55" fill="#CB3524"/>
        <rect x="74" y="25" width="7" height="50" fill="#CB3524"/>
        {/* Bear and tree (Madrid symbol) */}
        <circle cx="50" cy="55" r="15" fill="#272E61"/>
        <path d="M45 48 L45 65 M50 45 L50 68 M55 48 L55 65" stroke="#CB3524" strokeWidth="2"/>
        <ellipse cx="42" cy="58" rx="5" ry="8" fill="#CB3524"/>
      </svg>
    ),
    
    // Sevilla - Red circular with SFC
    204: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#D4021D"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#D4021D"/>
        <circle cx="50" cy="50" r="35" fill="#FFFFFF"/>
        {/* SFC monogram */}
        <text x="50" y="45" textAnchor="middle" fill="#D4021D" fontSize="14" fontWeight="bold">SFC</text>
        <text x="50" y="62" textAnchor="middle" fill="#D4021D" fontSize="8">1890</text>
        {/* Decorative elements */}
        <circle cx="50" cy="50" r="28" fill="none" stroke="#D4021D" strokeWidth="1"/>
      </svg>
    ),
    
    // Real Sociedad - Blue/white with crown
    205: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#0067B1"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#0067B1"/>
        {/* Crown */}
        <path d="M32 25 L35 18 L42 24 L50 15 L58 24 L65 18 L68 25 L68 32 L32 32 Z" fill="#FEBE10"/>
        {/* RS letters */}
        <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="bold">RS</text>
        <text x="50" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="6">1909</text>
      </svg>
    ),
    
    // Real Betis - Green/white with crown
    206: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#00954C"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#00954C"/>
        {/* Crown */}
        <path d="M35 22 L38 15 L44 20 L50 12 L56 20 L62 15 L65 22 L65 28 L35 28 Z" fill="#FEBE10"/>
        {/* Diagonal stripes */}
        <path d="M25 45 L75 45 L70 55 L30 55 Z" fill="#FFFFFF"/>
        <text x="50" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">BETIS</text>
      </svg>
    ),
    
    // Villarreal - Yellow submarine
    207: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#005187"/>
        <circle cx="50" cy="50" r="44" fill="#FFE114"/>
        <circle cx="50" cy="50" r="40" fill="#005187"/>
        {/* Submarine */}
        <ellipse cx="50" cy="55" rx="28" ry="14" fill="#FFE114"/>
        <rect x="45" y="38" width="10" height="14" fill="#FFE114"/>
        <rect x="47" y="32" width="6" height="8" fill="#FFE114"/>
        {/* Portholes */}
        <circle cx="35" cy="55" r="5" fill="#005187" stroke="#FFE114" strokeWidth="2"/>
        <circle cx="50" cy="55" r="5" fill="#005187" stroke="#FFE114" strokeWidth="2"/>
        <circle cx="65" cy="55" r="5" fill="#005187" stroke="#FFE114" strokeWidth="2"/>
        {/* Propeller */}
        <ellipse cx="78" cy="55" rx="3" ry="8" fill="#FFE114"/>
        <text x="50" y="82" textAnchor="middle" fill="#FFE114" fontSize="5" fontWeight="bold">VILLARREAL CF</text>
      </svg>
    ),
    
    // Athletic Bilbao - Red/white stripes
    208: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#EE2523" stroke="#000" strokeWidth="1"/>
        {/* White stripes */}
        <rect x="18" y="18" width="10" height="65" fill="#FFFFFF"/>
        <rect x="38" y="18" width="10" height="65" fill="#FFFFFF"/>
        <rect x="58" y="18" width="10" height="65" fill="#FFFFFF"/>
        <rect x="78" y="18" width="8" height="60" fill="#FFFFFF"/>
        {/* Lions and tree (simplified) */}
        <circle cx="50" cy="50" r="12" fill="#EE2523" stroke="#000" strokeWidth="1"/>
        <path d="M46 45 L50 40 L54 45 L54 55 L50 60 L46 55 Z" fill="#FFFFFF"/>
      </svg>
    ),
    
    // Valencia - White with bat
    209: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#FFFFFF" stroke="#000" strokeWidth="2"/>
        {/* Orange/red sections */}
        <path d="M8 22 L50 22 L50 60 L8 60 Z" fill="#EE3524"/>
        <path d="M50 60 L92 60 L92 60 Q92 90 50 97 Z" fill="#EE3524"/>
        {/* Bat */}
        <path d="M30 30 Q42 18 50 28 Q58 18 70 30 L65 45 Q50 55 35 45 Z" fill="#000"/>
        <circle cx="42" cy="32" r="2" fill="#EE3524"/>
        <circle cx="58" cy="32" r="2" fill="#EE3524"/>
        {/* VCF */}
        <text x="50" y="80" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">VCF</text>
      </svg>
    ),
    
    // Girona - Red/white stripes
    210: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#CD2534" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        <rect x="20" y="25" width="8" height="52" fill="#CD2534"/>
        <rect x="36" y="25" width="8" height="52" fill="#CD2534"/>
        <rect x="52" y="25" width="8" height="52" fill="#CD2534"/>
        <rect x="68" y="25" width="8" height="48" fill="#CD2534"/>
        {/* Crown */}
        <path d="M40 18 L43 12 L50 16 L57 12 L60 18" fill="#FEBE10" stroke="#FEBE10" strokeWidth="2"/>
      </svg>
    ),
    
    // Celta Vigo - Sky blue
    211: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#8AC3EE" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        {/* Celtic cross */}
        <rect x="46" y="25" width="8" height="50" fill="#8AC3EE"/>
        <rect x="30" y="40" width="40" height="8" fill="#8AC3EE"/>
        <circle cx="50" cy="44" r="12" fill="none" stroke="#8AC3EE" strokeWidth="4"/>
        <text x="50" y="88" textAnchor="middle" fill="#8AC3EE" fontSize="6" fontWeight="bold">RC CELTA</text>
      </svg>
    ),
    
    // Osasuna - Red with chains
    212: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#D91A21" stroke="#0A1E3C" strokeWidth="3"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#0A1E3C"/>
        {/* Chains of Navarra */}
        <path d="M30 35 L70 35 M30 50 L70 50 M30 65 L70 65 M40 35 L40 65 M50 35 L50 65 M60 35 L60 65" stroke="#D91A21" strokeWidth="3"/>
        <circle cx="50" cy="50" r="8" fill="#00954C"/>
      </svg>
    ),
    
    // Getafe - Blue
    213: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#005999" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        <path d="M50 20 L78 32 L78 55 Q78 75 50 83 Q22 75 22 55 L22 32 Z" fill="#005999"/>
        <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">G</text>
      </svg>
    ),
    
    // Rayo Vallecano - White with red diagonal
    214: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#FFFFFF" stroke="#E31E24" strokeWidth="3"/>
        {/* Red lightning bolt diagonal */}
        <path d="M20 85 L45 50 L35 50 L60 15 L55 45 L65 45 L40 80 Z" fill="#E31E24"/>
        <text x="70" y="75" textAnchor="middle" fill="#E31E24" fontSize="8" fontWeight="bold">RVM</text>
      </svg>
    ),
    
    // Mallorca - Red/black
    215: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#CE1126" stroke="#000" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#000"/>
        {/* Windmill */}
        <circle cx="50" cy="50" r="15" fill="#CE1126"/>
        <path d="M50 35 L55 50 L50 50 Z M65 50 L50 55 L50 50 Z M50 65 L45 50 L50 50 Z M35 50 L50 45 L50 50 Z" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="4" fill="#000"/>
        <text x="50" y="82" textAnchor="middle" fill="#CE1126" fontSize="6" fontWeight="bold">RCD MALLORCA</text>
      </svg>
    ),
    
    // Las Palmas - Yellow/blue
    216: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#FFD700"/>
        <circle cx="50" cy="50" r="44" fill="#003DA5"/>
        <circle cx="50" cy="50" r="40" fill="#FFD700"/>
        {/* Palm tree */}
        <rect x="47" y="50" width="6" height="25" fill="#003DA5"/>
        <path d="M50 50 L35 35 M50 50 L65 35 M50 50 L30 45 M50 50 L70 45 M50 50 L40 30 M50 50 L60 30" stroke="#003DA5" strokeWidth="3"/>
        <text x="50" y="88" textAnchor="middle" fill="#003DA5" fontSize="6" fontWeight="bold">UD LAS PALMAS</text>
      </svg>
    ),
    
    // Alavés - Blue/white
    217: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#003DA5" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        {/* A letter */}
        <path d="M35 75 L50 25 L65 75 M40 60 L60 60" stroke="#003DA5" strokeWidth="6" fill="none"/>
      </svg>
    ),
    
    // Espanyol - Blue/white
    218: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#007FC8" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        {/* Crown */}
        <path d="M35 20 L38 12 L45 18 L50 10 L55 18 L62 12 L65 20" fill="#FEBE10"/>
        {/* Stripes */}
        <rect x="20" y="30" width="60" height="6" fill="#007FC8"/>
        <rect x="20" y="42" width="60" height="6" fill="#007FC8"/>
        <rect x="20" y="54" width="60" height="6" fill="#007FC8"/>
        <rect x="20" y="66" width="55" height="6" fill="#007FC8"/>
      </svg>
    ),
    
    // Leganés - Blue
    219: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#003DA5" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        {/* Cucumber (pepino) */}
        <ellipse cx="50" cy="50" rx="12" ry="25" fill="#00954C"/>
        <path d="M50 25 L55 20 L50 28 L45 20 Z" fill="#00954C"/>
        <text x="50" y="88" textAnchor="middle" fill="#003DA5" fontSize="6" fontWeight="bold">CD LEGANÉS</text>
      </svg>
    ),
    
    // Valladolid - Purple/white
    220: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#6B2D7B" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        {/* Castle */}
        <rect x="35" y="35" width="30" height="35" fill="#6B2D7B"/>
        <rect x="38" y="28" width="8" height="10" fill="#6B2D7B"/>
        <rect x="54" y="28" width="8" height="10" fill="#6B2D7B"/>
        <path d="M42 60 L42 70 L50 70 L50 60 Q46 55 42 60" fill="#FFFFFF"/>
        <rect x="40" y="42" width="6" height="8" fill="#FFFFFF"/>
        <rect x="54" y="42" width="6" height="8" fill="#FFFFFF"/>
      </svg>
    ),

    // ============ BOSNIAN PREMIER LEAGUE ============
    
    // FK Sarajevo - Maroon with star
    301: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#800020"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#800020"/>
        {/* Star */}
        <path d="M50 20 L54 35 L70 35 L57 45 L62 60 L50 50 L38 60 L43 45 L30 35 L46 35 Z" fill="#FFFFFF"/>
        <text x="50" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">FK SARAJEVO</text>
        <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="5">1946</text>
      </svg>
    ),
    
    // FK Željezničar - Blue with locomotive
    302: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#0033A0"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#0033A0"/>
        {/* Ž letter stylized */}
        <path d="M30 30 L70 30 L40 50 L70 50 L30 70 L70 70" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
        <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">ŽELJEZNIČAR</text>
      </svg>
    ),
    
    // FK Borac Banja Luka - Red with star
    303: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#E31E24"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#E31E24"/>
        {/* Five-pointed star */}
        <path d="M50 18 L55 38 L75 38 L59 50 L65 70 L50 58 L35 70 L41 50 L25 38 L45 38 Z" fill="#FFFFFF"/>
        <text x="50" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">FK BORAC</text>
      </svg>
    ),
    
    // HŠK Zrinjski Mostar - Red hexagon
    304: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="#E31E24" stroke="#FFFFFF" strokeWidth="2"/>
        <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="#FFFFFF"/>
        {/* Z letter */}
        <path d="M30 35 L70 35 L30 65 L70 65" stroke="#E31E24" strokeWidth="6" fill="none"/>
        <text x="50" y="80" textAnchor="middle" fill="#E31E24" fontSize="5" fontWeight="bold">ZRINJSKI</text>
      </svg>
    ),
    
    // FK Velež Mostar - Red with V
    305: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#D52B1E"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#D52B1E"/>
        {/* V letter */}
        <path d="M25 25 L50 70 L75 25" stroke="#FFFFFF" strokeWidth="8" fill="none"/>
        {/* Star */}
        <path d="M50 15 L52 22 L60 22 L54 27 L56 35 L50 30 L44 35 L46 27 L40 22 L48 22 Z" fill="#FFFFFF"/>
        <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">FK VELEŽ</text>
      </svg>
    ),
    
    // NK Široki Brijeg - Blue/white
    306: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#003DA5" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        {/* Cross */}
        <rect x="46" y="25" width="8" height="50" fill="#003DA5"/>
        <rect x="30" y="42" width="40" height="8" fill="#003DA5"/>
        <text x="50" y="88" textAnchor="middle" fill="#003DA5" fontSize="5" fontWeight="bold">NK ŠIROKI BRIJEG</text>
      </svg>
    ),
    
    // FK Tuzla City - Navy modern
    307: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#1E3A5F"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#1E3A5F"/>
        {/* TC letters */}
        <text x="50" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">TUZLA</text>
        <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">CITY</text>
        <text x="50" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="5">FC</text>
      </svg>
    ),
    
    // FK Sloboda Tuzla - Red/white
    308: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#E31E24"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#E31E24"/>
        {/* Torch/flame */}
        <rect x="46" y="45" width="8" height="25" fill="#FFFFFF"/>
        <path d="M50 45 Q40 35 50 20 Q60 35 50 45" fill="#FFFFFF"/>
        <text x="50" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">FK SLOBODA</text>
      </svg>
    ),
    
    // NK Posušje - Blue
    309: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#003DA5" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFFFFF"/>
        <text x="50" y="45" textAnchor="middle" fill="#003DA5" fontSize="12" fontWeight="bold">NK</text>
        <text x="50" y="65" textAnchor="middle" fill="#003DA5" fontSize="10" fontWeight="bold">POSUŠJE</text>
      </svg>
    ),
    
    // FK Igman Konjic - Green
    310: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#006633"/>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF"/>
        <circle cx="50" cy="50" r="40" fill="#006633"/>
        {/* Mountain */}
        <path d="M20 70 L50 25 L80 70 Z" fill="#FFFFFF"/>
        <path d="M35 70 L50 45 L65 70 Z" fill="#006633"/>
        <text x="50" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">FK IGMAN</text>
      </svg>
    ),
    
    // FK Radnik Bijeljina - Red/blue
    311: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="48" fill="#E31E24"/>
        <circle cx="50" cy="50" r="44" fill="#003DA5"/>
        <circle cx="50" cy="50" r="40" fill="#E31E24"/>
        {/* Worker symbol */}
        <path d="M35 55 L50 35 L65 55 L55 55 L55 70 L45 70 L45 55 Z" fill="#FFFFFF"/>
        <circle cx="50" cy="28" r="8" fill="#FFFFFF"/>
        <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">FK RADNIK</text>
      </svg>
    ),
    
    // NK GOŠK Gabela - Blue/yellow
    312: (
      <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
        <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#003DA5" stroke="#FFD700" strokeWidth="3"/>
        <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#FFD700"/>
        <text x="50" y="48" textAnchor="middle" fill="#003DA5" fontSize="12" fontWeight="bold">GOŠK</text>
        <text x="50" y="68" textAnchor="middle" fill="#003DA5" fontSize="8">GABELA</text>
      </svg>
    ),
  };

  // Default logo
  const defaultLogo = (
    <svg viewBox="0 0 100 100" className={className} style={{ width: size, height: size }}>
      <path d="M50 5 L92 22 L92 60 Q92 90 50 97 Q8 90 8 60 L8 22 Z" fill="#333" stroke="#555" strokeWidth="2"/>
      <path d="M50 12 L85 25 L85 58 Q85 82 50 90 Q15 82 15 58 L15 25 Z" fill="#555"/>
      <text x="50" y="55" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">FC</text>
    </svg>
  );

  return logos[clubId] || defaultLogo;
}
