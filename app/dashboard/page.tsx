"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gold-light">Loading...</div>
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
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-8">
          Dashboard
        </h1>

        {/* User Info Card */}
        <div className="bg-black-charcoal border border-steel rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            {user.avatar && (
              <img
                src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
                alt={user.username}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gold-light">
                {user.username}
              </h2>
              <p className="text-gray-400">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black-charcoal border border-steel rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Level</h3>
            <p className="text-3xl font-bold text-gold-light">{user.level}</p>
          </div>
          <div className="bg-black-charcoal border border-steel rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total XP</h3>
            <p className="text-3xl font-bold text-gold-light">{user.xp}</p>
          </div>
          <div className="bg-black-charcoal border border-steel rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Badges</h3>
            <p className="text-3xl font-bold text-gold-light">
              {user.badges?.length || 0}
            </p>
          </div>
        </div>

        {/* Manager Panel Access */}
        {permissions.can_manage_applications && (
          <div className="bg-gradient-to-r from-gold-dark to-gold-medium border border-gold-light rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-black mb-4">
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
    </div>
  );
}
