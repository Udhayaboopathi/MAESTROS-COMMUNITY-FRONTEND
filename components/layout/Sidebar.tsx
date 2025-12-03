"use client";

import { Crown } from "lucide-react";
import { useDiscordStats } from "@/lib/hooks/useDiscordStats";

export default function Sidebar() {
  const { stats, loading: statsLoading } = useDiscordStats();

  return (
    <aside className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-black-charcoal border-r border-steel overflow-y-auto scrollbar-gold">
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
                    {stats.ceo_online.map((ceo: string, idx: number) => (
                      <div key={idx} className="text-xs text-gold pl-5">
                        {ceo}
                      </div>
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
                    {stats.manager_online.map(
                      (manager: string, idx: number) => (
                        <div key={idx} className="text-xs text-gold pl-5">
                          {manager}
                        </div>
                      )
                    )}
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
                        .map((member: string, idx: number) => (
                          <div key={idx} className="text-xs text-gray-300 pl-2">
                            {member}
                          </div>
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
    </aside>
  );
}
