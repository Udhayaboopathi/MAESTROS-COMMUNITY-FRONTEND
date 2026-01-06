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
    <aside
      className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-[180px] bg-black-charcoal border-r border-steel overflow-y-auto scrollbar-gold"
      style={{ zIndex: 1000000 }}
    >
      <div className="p-4">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="/logo.png"
            alt="Maestros Logo"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Discord Stats Section */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            Discord Live
          </h3>
          {statsLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-steel rounded animate-pulse" />
              <div className="h-4 bg-steel rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Members</span>
                <span className="text-gold font-semibold">
                  {stats?.total || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Online</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 font-semibold">
                    {stats?.online || 0}
                  </span>
                </div>
              </div>

              {/* CEO Online */}
              {stats?.managers &&
                stats.managers.filter((m: any) => m.permissions?.is_ceo)
                  .length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-3 h-3 text-gold" />
                      <span className="text-xs text-gray-400">
                        CEO Online (
                        {
                          stats.managers.filter(
                            (m: any) => m.permissions?.is_ceo
                          ).length
                        }
                        )
                      </span>
                    </div>
                    <div className="max-h-32 lg:max-h-20 overflow-y-auto scrollbar-gold space-y-1">
                      {stats.managers
                        .filter((m: any) => m.permissions?.is_ceo)
                        .map((ceo: any, idx: number) => (
                          <button
                            key={ceo.discord_id || idx}
                            onClick={() => handleSidebarUserClick(ceo)}
                            className="text-xs pl-5 w-full text-left hover:bg-steel/30 rounded px-2 py-1 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                              <div className="text-gold font-semibold truncate">
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
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-3 h-3 text-gold" />
                      <span className="text-xs text-gray-400">
                        Manager Online (
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
                    <div className="max-h-32 lg:max-h-20 overflow-y-auto scrollbar-gold space-y-1">
                      {stats.managers
                        .filter(
                          (m: any) =>
                            m.permissions?.is_manager && !m.permissions?.is_ceo
                        )
                        .map((manager: any, idx: number) => (
                          <button
                            key={manager.discord_id || idx}
                            onClick={() => handleSidebarUserClick(manager)}
                            className="text-xs pl-5 w-full text-left hover:bg-steel/30 rounded px-2 py-1 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                              <div className="text-gold font-semibold truncate">
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
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-3 h-3 text-gold" />
                    <span className="text-xs text-gray-400">
                      Members Online ({stats.members.length})
                    </span>
                  </div>
                  <div className="max-h-48 lg:max-h-24 overflow-y-auto scrollbar-gold space-y-1 mt-2">
                    {stats.members
                      .slice(0, 10)
                      .map((member: any, idx: number) => (
                        <button
                          key={member.discord_id || idx}
                          onClick={() => handleSidebarUserClick(member)}
                          className="text-xs pl-2 w-full text-left hover:bg-steel/30 rounded px-2 py-1 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                            <div className="text-gray-300 font-medium truncate">
                              {member.display_name || member.username}
                            </div>
                          </div>
                        </button>
                      ))}
                    {stats.members.length > 10 && (
                      <div className="text-xs text-gray-500 pl-2">
                        +{stats.members.length - 10} more
                      </div>
                    )}
                  </div>
                </div>
              )}
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
