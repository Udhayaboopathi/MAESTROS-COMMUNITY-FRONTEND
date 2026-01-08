"use client";

import { useState } from "react";
import { Crown, Shield, Users } from "lucide-react";
import { useDiscordStats } from "@/lib/hooks/useDiscordStats";
import UserDetailsModal from "@/components/modals/UserDetailsModal";

export default function Sidebar() {
  const { stats, loading: statsLoading } = useDiscordStats();
  const [selectedSidebarUser, setSelectedSidebarUser] = useState<any>(null);
  const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);

  const handleSidebarUserClick = (user: any) => {
    setSelectedSidebarUser(user);
    setIsSidebarModalOpen(true);
  };

  return (
    <aside className="hidden lg:block fixed top-0 left-0 h-screen w-[180px] bg-black-charcoal overflow-y-auto scrollbar-gold z-30">
      <div className="p-4 pt-4 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-4 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Maestros Logo"
            className="w-24 h-24 object-contain"
          />
          <h1 className="text-gold font-bold text-xs tracking-wider mt-1 text-center uppercase">
            Maestros Community
          </h1>
        </div>

        {/* Divider */}
        <div className="h-px bg-gold/20 mb-4" />

        {/* Discord Stats Section */}
        <div className="flex-1 flex flex-col min-h-0">
          {statsLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-steel rounded animate-pulse" />
              <div className="h-4 bg-steel rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Stats Row */}
              <div className="space-y-1 text-xs mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Members</span>
                  <span className="text-gold font-semibold">
                    {stats?.total || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Online</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 font-semibold">
                      {stats?.online || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Members Area */}
              <div className="flex-1 overflow-y-auto scrollbar-gold space-y-3 min-h-0">
                {/* CEO Online */}
                {stats?.managers &&
                  stats.managers.filter((m: any) => m.permissions?.is_ceo)
                    .length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5 sticky top-0 bg-black-charcoal py-1">
                        <Crown className="w-3 h-3 text-yellow-500" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                          CEO (
                          {
                            stats.managers.filter(
                              (m: any) => m.permissions?.is_ceo
                            ).length
                          }
                          )
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {stats.managers
                          .filter((m: any) => m.permissions?.is_ceo)
                          .map((ceo: any, idx: number) => (
                            <button
                              key={ceo.discord_id || idx}
                              onClick={() => handleSidebarUserClick(ceo)}
                              className="text-xs w-full text-left hover:bg-gold/10 rounded px-2 py-1 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                                <div className="text-yellow-500 font-semibold truncate text-[11px]">
                                  {ceo.display_name || ceo.username}
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Manager Online */}
                {stats?.managers &&
                  stats.managers.filter(
                    (m: any) =>
                      m.permissions?.is_manager && !m.permissions?.is_ceo
                  ).length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5 sticky top-0 bg-black-charcoal py-1">
                        <Shield className="w-3 h-3 text-gold" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                          Manager (
                          {
                            stats.managers.filter(
                              (m: any) =>
                                m.permissions?.is_manager &&
                                !m.permissions?.is_ceo
                            ).length
                          }
                          )
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {stats.managers
                          .filter(
                            (m: any) =>
                              m.permissions?.is_manager &&
                              !m.permissions?.is_ceo
                          )
                          .map((manager: any, idx: number) => (
                            <button
                              key={manager.discord_id || idx}
                              onClick={() => handleSidebarUserClick(manager)}
                              className="text-xs w-full text-left hover:bg-gold/10 rounded px-2 py-1 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                                <div className="text-gold font-medium truncate text-[11px]">
                                  {manager.display_name || manager.username}
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Community Members Online */}
                {stats?.members && stats.members.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 sticky top-0 bg-black-charcoal py-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Members ({stats.members.length})
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {stats.members
                        .slice(0, 15)
                        .map((member: any, idx: number) => (
                          <button
                            key={member.discord_id || idx}
                            onClick={() => handleSidebarUserClick(member)}
                            className="text-xs w-full text-left hover:bg-steel/20 rounded px-2 py-1 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                              <div className="text-gray-300 truncate text-[11px]">
                                {member.display_name || member.username}
                              </div>
                            </div>
                          </button>
                        ))}
                      {stats.members.length > 15 && (
                        <div className="text-[10px] text-gray-500 pl-2 py-1">
                          +{stats.members.length - 15} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <UserDetailsModal
        isOpen={isSidebarModalOpen}
        onClose={() => setIsSidebarModalOpen(false)}
        user={selectedSidebarUser}
      />
    </aside>
  );
}
