"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface UserDetails {
  display_name?: string;
  username?: string;
  discriminator?: string | null;
  discord_id?: string;
  avatar?: string;
  email?: string;
  level?: number;
  xp?: number;
  badges?: string[];
  guild_roles?: string[];
  permissions?: {
    is_admin?: boolean;
    is_ceo?: boolean;
    is_manager?: boolean;
    can_manage_applications?: boolean;
  };
  discord_details?: {
    global_name?: string;
    avatar_hash?: string;
    banner?: string;
    banner_color?: string;
    accent_color?: number;
    bot?: boolean;
    public_flags?: number;
    server_nickname?: string;
    server_avatar?: string;
    joined_at?: string;
    premium_since?: string;
    pending?: boolean;
    communication_disabled_until?: string | null;
  };
  created_at?: string;
  joined_at?: string;
  last_seen?: string;
  last_login?: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetails | string;
}

function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // If user is an object with discord_id, fetch full details
      const userId = typeof user === "string" ? null : user.discord_id;

      if (userId) {
        setIsLoading(true);
        // Fetch complete user details from API
        fetch(`http://localhost:8000/users/${userId}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            setUserDetails(data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch user details:", err);
            // Fallback to provided data
            setUserDetails(
              typeof user === "string" ? { username: user } : user
            );
            setIsLoading(false);
          });
      } else {
        // Use provided data if no user ID
        setUserDetails(typeof user === "string" ? { username: user } : user);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  if (isLoading || !userDetails) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 999999 }}
      >
        <div className="fixed inset-0 bg-black opacity-80" onClick={onClose} />
        <div className="relative bg-black-charcoal border-2 border-gold rounded-lg p-8 text-center">
          <div className="text-gold-light">Loading user details...</div>
        </div>
      </div>
    );
  }

  const displayName =
    userDetails.discord_details?.global_name ||
    userDetails.display_name ||
    userDetails.username ||
    "Unknown User";
  const username = userDetails.username || "";
  const discriminator = userDetails.discriminator;
  const hasAvatar = Boolean(userDetails.avatar && userDetails.discord_id);

  const avatarUrl = hasAvatar
    ? `https://cdn.discordapp.com/avatars/${userDetails.discord_id}/${userDetails.avatar}.png?size=128`
    : null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 py-8 md:py-12"
      style={{
        zIndex: 999999,
        pointerEvents: "auto",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#000000",
          opacity: 1,
          zIndex: 999998,
          pointerEvents: "auto",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-black-charcoal border-2 border-gold rounded-lg shadow-2xl max-h-[calc(100vh-160px)] overflow-y-auto"
        style={{
          zIndex: 999999,
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-steel">
          <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gold-light transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar and Display Name */}
          <div className="flex items-center space-x-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-20 h-20 rounded-full border-2 border-gold"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-steel flex items-center justify-center border-2 border-gold">
                <span className="text-3xl font-bold text-gold-light">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-gold-light">
                {displayName}
              </h3>
              {username && username !== displayName && (
                <p className="text-gray-400 text-sm mt-1">
                  @{username}
                  {discriminator && discriminator !== "0"
                    ? `#${discriminator}`
                    : ""}
                </p>
              )}
            </div>
          </div>

          {/* Comprehensive Discord Information */}
          <div className="space-y-4">
            {/* 1. Username */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">1.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">Username</h4>
                  <p className="text-white text-sm mb-1">
                    @{userDetails.username || "N/A"}
                  </p>
                  <div className="mt-2 pt-2 border-t border-steel">
                    <p className="text-gray-400 text-xs mb-1">
                      Global Discord Name:
                    </p>
                    <p className="text-white text-sm">
                      {userDetails.discord_details?.global_name || "Not set"}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Shown in chat and member list
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* 2. User ID */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">2.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">User ID</h4>
                  <p className="text-white font-mono text-sm mb-1">
                    {userDetails.discord_id}
                  </p>
                </div>
              </div>
            </div>
            {/* 3. Avatar (Profile Picture) */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">3.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-2">
                    Avatar (Profile Picture)
                  </h4>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full border-2 border-gold mb-2"
                    />
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No custom avatar set
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    Global profile picture • Visible everywhere
                  </p>
                </div>
              </div>
            </div>
            {/* 4. Server Nickname */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">4.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">
                    Server Nickname
                  </h4>
                  <p className="text-white text-sm mb-1">
                    {userDetails.discord_details?.server_nickname || "Not set"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Custom name in this server • Visible in this server only
                  </p>
                </div>
              </div>
            </div>
            {/* 5. Server Avatar (If Set) */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">5.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">
                    Server Avatar
                  </h4>
                  <p className="text-white text-sm mb-1">
                    {userDetails.discord_details?.server_avatar || "Not set"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Per-server profile picture • Visible in this server
                  </p>
                </div>
              </div>
            </div>
            {/* 6. Server Roles (Names & Colors) */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">6.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-2">
                    Server Roles
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(() => {
                      // Filter out role IDs (numeric strings) and keep only role names
                      const roleNames =
                        userDetails.guild_roles?.filter(
                          (role) => !/^\d+$/.test(role)
                        ) || [];

                      if (roleNames.length > 0) {
                        return roleNames.map((role, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-steel text-white text-sm font-medium rounded border border-gold-light"
                          >
                            {role}
                          </span>
                        ));
                      } else if (
                        userDetails.guild_roles &&
                        userDetails.guild_roles.length > 0
                      ) {
                        // If all roles are IDs, show count but not the IDs
                        return (
                          <span className="text-white text-sm">
                            {userDetails.guild_roles.length} role
                            {userDetails.guild_roles.length !== 1
                              ? "s"
                              : ""}{" "}
                            (names not available)
                          </span>
                        );
                      } else {
                        return (
                          <span className="text-gray-400 text-sm">
                            No roles assigned
                          </span>
                        );
                      }
                    })()}
                  </div>
                  <p className="text-white text-sm mb-1">
                    {userDetails.guild_roles?.length || 0} role
                    {userDetails.guild_roles?.length !== 1 ? "s" : ""} assigned
                  </p>
                  <p className="text-gray-500 text-xs">
                    Role names & display color • Visible via member list
                  </p>
                </div>
              </div>
            </div>
            {/* 7. Highest Role Display */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">7.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">
                    Highest Role Display
                  </h4>
                  <p
                    className={`text-sm mb-1 font-bold ${
                      userDetails.permissions?.is_ceo
                        ? "text-yellow-400"
                        : userDetails.permissions?.is_manager
                        ? "text-blue-400"
                        : userDetails.permissions?.is_admin
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {userDetails.permissions?.is_ceo
                      ? "CEO (Highest Role)"
                      : userDetails.permissions?.is_manager
                      ? "Manager (Highest Role)"
                      : userDetails.permissions?.is_admin
                      ? "Admin (Highest Role)"
                      : "Member"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Determines name color & position in member list
                  </p>
                </div>
              </div>
            </div>
            {/* 8. Online Status */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">8.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">
                    Online Status
                  </h4>
                  <p className="text-white text-sm mb-1">
                    {userDetails.last_seen
                      ? "Recently Active"
                      : "Status not available"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Online / Idle / Do Not Disturb / Offline • User can hide
                    offline status
                  </p>
                </div>
              </div>
            </div>
            {/* 9. Activity */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">9.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">
                    Activity (Game / App Name)
                  </h4>
                  <p className="text-white text-sm mb-1">
                    Activity not available
                  </p>
                  <p className="text-gray-500 text-xs">
                    Example: "Playing Minecraft" • Visible if user allows
                    activity status
                  </p>
                </div>
              </div>
            </div>
            {/* 10. Join Date (Server Only) */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">10.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">
                    Join Date (Server Only)
                  </h4>
                  <p className="text-white text-sm mb-1">
                    {userDetails.discord_details?.joined_at
                      ? new Date(
                          userDetails.discord_details.joined_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : userDetails.joined_at
                      ? new Date(userDetails.joined_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Not available"}
                  </p>
                  {userDetails.discord_details?.joined_at && (
                    <p className="text-gray-400 text-xs mb-1">
                      {new Date(
                        userDetails.discord_details.joined_at
                      ).toLocaleTimeString()}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs">
                    When the user joined this server • Visible to
                    moderators/bots
                  </p>
                  <div className="mt-2 pt-2 border-t border-steel">
                    <p
                      className={
                        userDetails.discord_details?.premium_since
                          ? "text-pink-400 text-sm"
                          : "text-gray-400 text-sm"
                      }
                    >
                      {userDetails.discord_details?.premium_since
                        ? `🚀 Server Booster since ${new Date(
                            userDetails.discord_details.premium_since
                          ).toLocaleDateString()}`
                        : "Not a server booster"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-steel">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gradient-gold text-black-deep font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;
