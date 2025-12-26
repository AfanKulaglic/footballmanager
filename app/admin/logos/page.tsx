"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Check, Search, X, Image as ImageIcon, Edit2, Save } from "lucide-react";
import { leagues } from "@/lib/mock";
import { 
  getStoredLogos, 
  saveLogo, 
  removeLogo, 
  clearAllLogos,
  getStoredClubNames,
  saveClubName,
  removeClubName,
  clearAllClubNames,
  clearAllCustomizations
} from "@/lib/logoStore";
import ClubLogo from "@/components/ClubLogo";

interface Club {
  id: number;
  name: string;
  shortName: string;
}

interface EditingClub {
  id: number;
  name: string;
  shortName: string;
}

export default function LogoCMSPage() {
  const [logos, setLogos] = useState<Record<number, string>>({});
  const [clubNames, setClubNames] = useState<Record<number, { name: string; shortName: string }>>({});
  const [search, setSearch] = useState("");
  const [selectedLeague, setSelectedLeague] = useState<string>("all");
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [editingClub, setEditingClub] = useState<EditingClub | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stored data on mount
  useEffect(() => {
    setLogos(getStoredLogos());
    setClubNames(getStoredClubNames());
  }, []);

  // Get all clubs from all leagues
  const allClubs: (Club & { league: string })[] = leagues.flatMap(league =>
    league.clubs.map(club => ({ ...club, league: league.name }))
  );

  // Get display name for a club (custom or original)
  const getDisplayName = (club: Club) => {
    const custom = clubNames[club.id];
    return custom ? custom.name : club.name;
  };

  const getDisplayShortName = (club: Club) => {
    const custom = clubNames[club.id];
    return custom ? custom.shortName : club.shortName;
  };

  // Filter clubs
  const filteredClubs = allClubs.filter(club => {
    const displayName = getDisplayName(club);
    const displayShortName = getDisplayShortName(club);
    const matchesSearch = displayName.toLowerCase().includes(search.toLowerCase()) ||
                          displayShortName.toLowerCase().includes(search.toLowerCase()) ||
                          club.name.toLowerCase().includes(search.toLowerCase());
    const matchesLeague = selectedLeague === "all" || club.league === selectedLeague;
    return matchesSearch && matchesLeague;
  });

  const handleFileSelect = (clubId: number) => {
    setUploadingId(clubId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingId) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select an image file");
      return;
    }

    if (file.size > 500 * 1024) {
      showNotification("Image must be less than 500KB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      saveLogo(uploadingId, base64);
      setLogos(prev => ({ ...prev, [uploadingId]: base64 }));
      showNotification("Logo updated!");
      setUploadingId(null);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleRemoveLogo = (clubId: number) => {
    removeLogo(clubId);
    setLogos(prev => {
      const newLogos = { ...prev };
      delete newLogos[clubId];
      return newLogos;
    });
    showNotification("Logo removed");
  };

  const handleEditClub = (club: Club) => {
    const custom = clubNames[club.id];
    setEditingClub({
      id: club.id,
      name: custom?.name || club.name,
      shortName: custom?.shortName || club.shortName,
    });
  };

  const handleSaveClubName = () => {
    if (!editingClub) return;
    
    saveClubName(editingClub.id, editingClub.name, editingClub.shortName);
    setClubNames(prev => ({
      ...prev,
      [editingClub.id]: { name: editingClub.name, shortName: editingClub.shortName }
    }));
    showNotification("Club name updated!");
    setEditingClub(null);
  };

  const handleResetClubName = (clubId: number) => {
    removeClubName(clubId);
    setClubNames(prev => {
      const newNames = { ...prev };
      delete newNames[clubId];
      return newNames;
    });
    showNotification("Club name reset to default");
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to remove all custom logos and names?")) {
      clearAllCustomizations();
      setLogos({});
      setClubNames({});
      showNotification("All customizations removed");
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const uploadedCount = Object.keys(logos).length;
  const customNamesCount = Object.keys(clubNames).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <Check size={16} />
          {notification}
        </div>
      )}

      {/* Edit Modal */}
      {editingClub && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e3f] rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h3 className="text-lg font-bold mb-4">Edit Club Name</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingClub.name}
                  onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Club full name"
                />
              </div>
              
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                  Short Name (3-4 letters)
                </label>
                <input
                  type="text"
                  value={editingClub.shortName}
                  onChange={(e) => setEditingClub({ ...editingClub, shortName: e.target.value.toUpperCase().slice(0, 4) })}
                  maxLength={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors uppercase"
                  placeholder="ABC"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingClub(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClubName}
                className="flex-1 py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ImageIcon className="text-purple-400" />
                Club Customization
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {uploadedCount} custom logo{uploadedCount !== 1 ? "s" : ""} • {customNamesCount} custom name{customNamesCount !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-colors"
              >
                Back to Game
              </a>
              {(uploadedCount > 0 || customNamesCount > 0) && (
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white/5 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search clubs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* League filter */}
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="all" className="bg-[#1a1a2e]">All Leagues</option>
              {leagues.map(league => (
                <option key={league.id} value={league.name} className="bg-[#1a1a2e]">{league.name}</option>
              ))}
            </select>

            <span className="text-sm text-gray-500">
              {filteredClubs.length} club{filteredClubs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Club Grid */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClubs.map(club => {
            const hasCustomLogo = !!logos[club.id];
            const hasCustomName = !!clubNames[club.id];
            const displayName = getDisplayName(club);
            const displayShortName = getDisplayShortName(club);
            
            return (
              <div
                key={club.id}
                className={`rounded-2xl p-4 border transition-all bg-white/5 ${
                  hasCustomLogo || hasCustomName ? "border-purple-500/50" : "border-white/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Logo preview */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                      {hasCustomLogo ? (
                        <img
                          src={logos[club.id]}
                          alt={displayName}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ClubLogo clubId={club.id} size={48} />
                      )}
                    </div>
                    {(hasCustomLogo || hasCustomName) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                  </div>

                  {/* Club info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate text-white">{displayName}</h3>
                    <p className="text-xs text-gray-500">{displayShortName} • ID: {club.id}</p>
                    <p className="text-xs text-purple-400 mt-1">{club.league}</p>
                    {hasCustomName && (
                      <p className="text-[10px] text-gray-600 mt-1">Original: {club.name}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleFileSelect(club.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                      hasCustomLogo
                        ? "bg-white/5 hover:bg-white/10 border border-white/10"
                        : "bg-purple-500 hover:bg-purple-600"
                    }`}
                  >
                    <Upload size={14} />
                    {hasCustomLogo ? "Replace" : "Logo"}
                  </button>
                  
                  <button
                    onClick={() => handleEditClub(club)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                      hasCustomName
                        ? "bg-white/5 hover:bg-white/10 border border-white/10"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    <Edit2 size={14} />
                    {hasCustomName ? "Edit" : "Name"}
                  </button>
                  
                  {(hasCustomLogo || hasCustomName) && (
                    <button
                      onClick={() => {
                        if (hasCustomLogo) handleRemoveLogo(club.id);
                        if (hasCustomName) handleResetClubName(club.id);
                      }}
                      className="py-2 px-3 rounded-xl text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>No clubs found matching your search</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-white/5 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-500">
            <p className="font-medium text-white mb-2">Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Click "Logo" to upload a custom PNG image for a club</li>
              <li>Click "Name" to change the club's display name</li>
              <li>Recommended logo size: 200x200 pixels (square)</li>
              <li>Maximum file size: 500KB</li>
              <li>Customizations are stored in your browser</li>
              <li>Changes will appear throughout the game</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
