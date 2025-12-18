"use client";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserDetailsModal from "@/components/modals/UserDetailsModal";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal flex items-center justify-center">
        <LoadingScreen message="Loading Dashboard..." fullScreen={false} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const permissions = user.permissions || {
    is_admin: false,
    is_ceo: false,
    is_manager: false,
    can_manage_applications: false,
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-6 md:mb-8">
          Dashboard
        </h1>

        {/* User Info Card */}
        <div className="bg-black-charcoal border border-steel rounded-lg p-4 sm:p-6 mb-4 md:mb-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user.avatar && (
              <img
                src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
                alt={user.display_name || user.username}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsUserModalOpen(true)}
              />
            )}
            <div>
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="text-xl sm:text-2xl font-bold text-gold-light hover:text-gold transition-colors text-left"
              >
                {user.display_name || user.username}
              </button>
              <p className="text-sm sm:text-base text-gray-400">
                Level {user.level} • {user.xp} XP
              </p>
              {permissions.is_ceo && (
                <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold rounded">
                  CEO
                </span>
              )}
              {permissions.is_manager && !permissions.is_ceo && (
                <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded">
                  MANAGER
                </span>
              )}
              {permissions.is_admin && (
                <span className="inline-block mt-2 ml-2 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded">
                  ADMIN
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-black-charcoal border border-steel rounded-lg p-4 sm:p-6">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-2">Level</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gold-light">
              {user.level}
            </p>
          </div>
          <div className="bg-black-charcoal border border-steel rounded-lg p-4 sm:p-6">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-2">Total XP</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gold-light">
              {user.xp}
            </p>
          </div>
          <div className="bg-black-charcoal border border-steel rounded-lg p-4 sm:p-6">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-2">Badges</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gold-light">
              {user.badges?.length || 0}
            </p>
          </div>
        </div>

        {/* Detailed Discord Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Identity */}
          <div className="bg-black-charcoal border border-steel rounded-lg p-6">
            <h2 className="text-xl font-bold text-gold-light mb-4">
              User Identity
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User ID:</span>
                <span className="text-white font-mono">{user.discord_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Username:</span>
                <span className="text-white">@{user.username}</span>
              </div>
              {user.discord_details?.global_name && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Global Display Name:</span>
                  <span className="text-white">
                    {user.discord_details.global_name}
                  </span>
                </div>
              )}
              {user.discriminator && user.discriminator !== "0" && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Discriminator:</span>
                  <span className="text-white">#{user.discriminator}</span>
                </div>
              )}
              {user.email && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{user.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Bot Account:</span>
                <span className="text-white">
                  {user.discord_details?.bot ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Server-Specific Info */}
          <div className="bg-black-charcoal border border-steel rounded-lg p-6">
            <h2 className="text-xl font-bold text-gold-light mb-4">
              Server Information
            </h2>
            <div className="space-y-3 text-sm">
              {user.discord_details?.server_nickname && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Server Nickname:</span>
                  <span className="text-white">
                    {user.discord_details.server_nickname}
                  </span>
                </div>
              )}
              {user.discord_details?.joined_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined Server:</span>
                  <span className="text-white">
                    {new Date(
                      user.discord_details.joined_at
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {user.joined_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since:</span>
                  <span className="text-white">
                    {new Date(user.joined_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {user.last_login && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Login:</span>
                  <span className="text-white">
                    {new Date(user.last_login).toLocaleString()}
                  </span>
                </div>
              )}
              {user.discord_details?.premium_since && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Server Booster Since:</span>
                  <span className="text-white">
                    {new Date(
                      user.discord_details.premium_since
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Avatar & Profile */}
          <div className="bg-black-charcoal border border-steel rounded-lg p-6">
            <h2 className="text-xl font-bold text-gold-light mb-4">
              Profile Assets
            </h2>
            <div className="space-y-3 text-sm">
              {user.avatar && (
                <div>
                  <span className="text-gray-400">Avatar Hash:</span>
                  <p className="text-white font-mono text-xs mt-1 break-all">
                    {user.avatar}
                  </p>
                </div>
              )}
              {user.discord_details?.server_avatar && (
                <div>
                  <span className="text-gray-400">Server Avatar:</span>
                  <p className="text-white font-mono text-xs mt-1 break-all">
                    {user.discord_details.server_avatar}
                  </p>
                </div>
              )}
              {user.discord_details?.banner && (
                <div>
                  <span className="text-gray-400">Banner Hash:</span>
                  <p className="text-white font-mono text-xs mt-1 break-all">
                    {user.discord_details.banner}
                  </p>
                </div>
              )}
              {user.discord_details?.banner_color && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Banner Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-steel"
                      style={{
                        backgroundColor: user.discord_details.banner_color,
                      }}
                    />
                    <span className="text-white font-mono">
                      {user.discord_details.banner_color}
                    </span>
                  </div>
                </div>
              )}
              {user.discord_details?.accent_color && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Accent Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-steel"
                      style={{
                        backgroundColor: `#${user.discord_details.accent_color
                          .toString(16)
                          .padStart(6, "0")}`,
                      }}
                    />
                    <span className="text-white font-mono">
                      #
                      {user.discord_details.accent_color
                        .toString(16)
                        .padStart(6, "0")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Metadata */}
          <div className="bg-black-charcoal border border-steel rounded-lg p-6">
            <h2 className="text-xl font-bold text-gold-light mb-4">
              Account Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Account Created:</span>
                <p className="text-white mt-1">
                  {new Date(
                    parseInt(user.discord_id) / 4194304 + 1420070400000
                  ).toLocaleString()}
                </p>
              </div>
              {user.discord_details?.public_flags !== undefined &&
                user.discord_details.public_flags > 0 && (
                  <div>
                    <span className="text-gray-400">Public Flags:</span>
                    <p className="text-white mt-1">
                      {user.discord_details.public_flags}
                    </p>
                  </div>
                )}
              {user.discord_details?.pending && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⚠️ Membership Pending</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manager Panel Access */}
        {permissions.can_manage_applications && (
          <div className="bg-gradient-to-r from-gold-dark to-gold-medium border border-gold-light rounded-lg p-4 sm:p-6 mb-6 md:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 md:mb-4">
              Manager Panel
            </h3>
            <p className="text-black mb-4">
              You have access to the application management panel.
            </p>
            <button
              onClick={() => router.push("/manager")}
              className="px-6 py-3 bg-black text-gold-light font-bold rounded hover:bg-black-charcoal transition"
            >
              Open Manager Panel
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-black-charcoal border border-steel rounded-lg p-6">
          <h3 className="text-xl font-bold text-gold-light mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/apply")}
              className="p-4 bg-black-deep border border-steel rounded hover:border-gold-light transition text-left"
            >
              <h4 className="font-bold text-gold-light mb-2">Apply to Join</h4>
              <p className="text-gray-400 text-sm">
                Submit your application to join the community
              </p>
            </button>
            <button
              onClick={() => router.push("/events")}
              className="p-4 bg-black-deep border border-steel rounded hover:border-gold-light transition text-left"
            >
              <h4 className="font-bold text-gold-light mb-2">View Events</h4>
              <p className="text-gray-400 text-sm">
                Check upcoming community events
              </p>
            </button>
            <button
              onClick={() => router.push("/team")}
              className="p-4 bg-black-deep border border-steel rounded hover:border-gold-light transition text-left"
            >
              <h4 className="font-bold text-gold-light mb-2">View Team</h4>
              <p className="text-gray-400 text-sm">
                See our community members and staff
              </p>
            </button>
            <button
              onClick={() => router.push("/games")}
              className="p-4 bg-black-deep border border-steel rounded hover:border-gold-light transition text-left"
            >
              <h4 className="font-bold text-gold-light mb-2">Games</h4>
              <p className="text-gray-400 text-sm">
                Explore the games we play together
              </p>
            </button>
          </div>
        </div>
      </div>

      <UserDetailsModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={user}
      />
    </div>
  );
}
