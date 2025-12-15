"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { useDiscordStats } from "@/lib/hooks/useDiscordStats";
import UserDetailsModal from "@/components/modals/UserDetailsModal";

export default function Sidebar() {
  const { stats, loading: statsLoading } = useDiscordStats();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <aside
      className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-black-charcoal border-r border-steel overflow-y-auto scrollbar-gold"
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
              {stats?.ceo_online && stats.ceo_online.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-3 h-3 text-gold" />
                    <span className="text-xs text-gray-400">
                      CEO Online ({stats.ceo_online.length})
                    </span>
                  </div>
                  <div className="max-h-20 overflow-y-auto scrollbar-gold space-y-1">
                    {stats.ceo_online.map((ceo: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleUserClick(ceo)}
                        className="text-xs pl-5 w-full text-left hover:bg-steel/30 rounded px-2 py-1 transition-colors"
                      >
                        <div className="text-gold font-semibold">
                          {typeof ceo === "string" ? ceo : ceo.display_name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Manager Online */}
              {stats?.manager_online && stats.manager_online.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-3 h-3 text-gold" />
                    <span className="text-xs text-gray-400">
                      Manager Online ({stats.manager_online.length})
                    </span>
                  </div>
                  <div className="max-h-20 overflow-y-auto scrollbar-gold space-y-1">
                    {stats.manager_online.map((manager: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleUserClick(manager)}
                        className="text-xs pl-5 w-full text-left hover:bg-steel/30 rounded px-2 py-1 transition-colors"
                      >
                        <div className="text-gold font-semibold">
                          {typeof manager === "string"
                            ? manager
                            : manager.display_name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Members Online */}
              {stats?.community_member_online &&
                stats.community_member_online.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs text-gray-400">
                      Community Members Online (
                      {stats.community_member_online.length})
                    </span>
                    <div className="max-h-24 overflow-y-auto scrollbar-gold space-y-1 mt-2">
                      {stats.community_member_online
                        .slice(0, 10)
                        .map((member: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleUserClick(member)}
                            className="text-xs pl-2 w-full text-left hover:bg-steel/30 rounded px-2 py-1 transition-colors"
                          >
                            <div className="text-gray-300 font-medium">
                              {typeof member === "string"
                                ? member
                                : member.display_name}
                            </div>
                          </button>
                        ))}
                      {stats.community_member_online.length > 10 && (
                        <div className="text-xs text-gray-500 pl-2">
                          +{stats.community_member_online.length - 10} more
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </aside>
  );
}
