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
  role_colors?: Array<{ name: string; color: string }>;
  highest_role?: {
    name: string | null;
    color: string;
    priority: number;
  };
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
    status?: string;
    activity_data?: {
      type: string;
      name?: string;
      details?: string;
      state?: string;
      large_image?: string;
      small_image?: string;
      url?: string;
      start?: string;
      end?: string;
      duration?: number;
    };
    pending?: boolean;
    communication_disabled_until?: string | null;
  };
  created_at?: string;
  account_created_at?: string;
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
        className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
        style={{ zIndex: 10000000 }}
      >
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/95 via-black-deep/90 to-black-charcoal/95"
          onClick={onClose}
        />
        <div className="relative text-center">
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold animate-spin" />

            {/* Middle pulsing ring */}
            <div className="absolute inset-3 rounded-full border-2 border-gold/30 animate-pulse" />

            {/* Logo in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Loading..."
                className="w-24 h-24 object-contain animate-pulse"
              />
            </div>

            {/* Inner rotating ring */}
            <div
              className="absolute inset-6 rounded-full border-2 border-transparent border-b-gold-light animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-gold text-xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Loading User Details
            </p>
            <div className="flex justify-center gap-1">
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
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
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
      style={{
        zIndex: 10000000,
        pointerEvents: "auto",
      }}
    >
      {/* Backdrop with animated gradient */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/95 via-black-deep/90 to-black-charcoal/95"
        onClick={onClose}
        style={{
          zIndex: 9999998,
          pointerEvents: "auto",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden border-2 border-gold/30"
        style={{
          zIndex: 9999999,
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-gold/50 rounded-tl-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-gold/50 rounded-br-3xl pointer-events-none" />

        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black-deep/80 hover:bg-gold/20 border border-gold/30 transition-all hover:scale-110"
        >
          <X className="w-6 h-6 text-gold" />
        </button>

        {/* Scrollable Content */}
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Hero Header Section */}
          <div className="relative px-8 pt-12 pb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar with glow effect */}
              <div className="relative group">
                {avatarUrl ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="relative w-32 h-32 rounded-full border-4 border-gold/50 ring-8 ring-gold/10 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-steel to-black-deep flex items-center justify-center border-4 border-gold/50 ring-8 ring-gold/10">
                    <span className="text-5xl font-bold text-gold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Status indicator */}
                <div className="absolute bottom-2 right-2">
                  <div
                    className="w-8 h-8 rounded-full border-4 border-black-charcoal flex items-center justify-center"
                    style={{
                      backgroundColor:
                        userDetails.discord_details?.status === "online"
                          ? "#23A559"
                          : userDetails.discord_details?.status === "idle"
                          ? "#F0B232"
                          : userDetails.discord_details?.status === "dnd"
                          ? "#F23F43"
                          : "#80848E",
                    }}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                  {displayName}
                </h2>
                {username && username !== displayName && (
                  <p className="text-gray-400 text-lg mb-2">
                    @{username}
                    {discriminator && discriminator !== "0"
                      ? `#${discriminator}`
                      : ""}
                  </p>
                )}
                <p className="text-sm text-gold/60 font-mono">
                  ID: {userDetails.discord_id}
                </p>

                {/* Highest Role Badge */}
                {userDetails.highest_role?.name && (
                  <div className="mt-4 inline-flex items-center gap-2">
                    <div
                      className="px-6 py-2 rounded-full font-bold text-lg shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${
                          userDetails.highest_role?.color || "#99AAB5"
                        } 0%, ${
                          userDetails.highest_role?.color || "#99AAB5"
                        }dd 100%)`,
                        color:
                          userDetails.highest_role?.color === "#FFD700" ||
                          userDetails.highest_role?.color === "#00FF00"
                            ? "#000"
                            : "#fff",
                        boxShadow: `0 0 20px ${
                          userDetails.highest_role?.color || "#99AAB5"
                        }66`,
                        border: `2px solid ${
                          userDetails.highest_role?.color || "#99AAB5"
                        }`,
                      }}
                    >
                      {userDetails.highest_role.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="px-8 pb-8 grid md:grid-cols-2 gap-4">
            {/* Username Card */}
            <div className="bg-black-deep/50 backdrop-blur rounded-xl p-5 border border-gold/10 hover:border-gold/30 transition-all hover:transform hover:scale-105">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center border border-gold/30">
                  <span className="text-gold font-bold text-lg">@</span>
                </div>
                <h4 className="text-gold font-bold text-lg">Username</h4>
              </div>
              <p className="text-white text-base mb-2">
                @{userDetails.username || "N/A"}
              </p>
              <div className="mt-3 pt-3 border-t border-gold/10">
                <p className="text-gray-400 text-xs mb-1">Global Name:</p>
                <p className="text-white/80 text-sm">
                  {userDetails.discord_details?.global_name || "Not set"}
                </p>
              </div>
            </div>

            {/* Server Nickname Card */}
            <div className="bg-black-deep/50 backdrop-blur rounded-xl p-5 border border-gold/10 hover:border-gold/30 transition-all hover:transform hover:scale-105">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center border border-gold/30">
                  <span className="text-gold font-bold text-lg">✏️</span>
                </div>
                <h4 className="text-gold font-bold text-lg">Server Nickname</h4>
              </div>
              <p className="text-white text-base">
                {userDetails.discord_details?.server_nickname || "Not set"}
              </p>
            </div>

            {/* Join Date Card */}
            <div className="bg-black-deep/50 backdrop-blur rounded-xl p-5 border border-gold/10 hover:border-gold/30 transition-all hover:transform hover:scale-105">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center border border-gold/30">
                  <span className="text-gold font-bold text-lg">📅</span>
                </div>
                <h4 className="text-gold font-bold text-lg">Joined Server</h4>
              </div>
              <p className="text-white text-base mb-2">
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
              {userDetails.discord_details?.premium_since && (
                <div className="mt-3 pt-3 border-t border-gold/10">
                  <p className="text-pink-400 text-sm flex items-center gap-2">
                    <span>🚀</span>
                    Server Booster
                  </p>
                </div>
              )}
            </div>

            {/* Account Created Card */}
            <div className="bg-black-deep/50 backdrop-blur rounded-xl p-5 border border-gold/10 hover:border-gold/30 transition-all hover:transform hover:scale-105">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center border border-gold/30">
                  <span className="text-gold font-bold text-lg">🎂</span>
                </div>
                <h4 className="text-gold font-bold text-lg">Account Age</h4>
              </div>
              <p className="text-white text-base mb-2">
                {userDetails.account_created_at
                  ? new Date(userDetails.account_created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Not available"}
              </p>
              {userDetails.account_created_at && (
                <div className="mt-3 pt-3 border-t border-gold/10">
                  <p className="text-gray-400 text-sm">
                    {(() => {
                      const created = new Date(userDetails.account_created_at);
                      const now = new Date();
                      const diffTime = Math.abs(
                        now.getTime() - created.getTime()
                      );
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      const years = Math.floor(diffDays / 365);
                      const months = Math.floor((diffDays % 365) / 30);

                      const parts = [];
                      if (years > 0)
                        parts.push(`${years} year${years !== 1 ? "s" : ""}`);
                      if (months > 0)
                        parts.push(`${months} month${months !== 1 ? "s" : ""}`);

                      return parts.join(", ") || "Less than a month";
                    })()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Section */}
          {userDetails.discord_details?.activity_data && (
            <div className="px-8 pb-6">
              <div className="bg-gradient-to-br from-gold/5 via-black-deep/50 to-gold/5 backdrop-blur rounded-2xl p-6 border border-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold-light/30 flex items-center justify-center border border-gold/40">
                    <span className="text-gold font-bold text-xl">🎮</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gold">
                    Current Activity
                  </h3>
                </div>

                {userDetails.discord_details.activity_data.type ===
                  "listening" && (
                  <div className="flex gap-4 items-center">
                    {userDetails.discord_details.activity_data.large_image && (
                      <img
                        src={
                          userDetails.discord_details.activity_data.large_image
                        }
                        alt="Album"
                        className="w-20 h-20 rounded-lg border-2 border-gold/30"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-green-400 mb-2 font-semibold">
                        🎵 LISTENING TO SPOTIFY
                      </p>
                      <p className="text-white font-bold text-lg truncate">
                        {userDetails.discord_details.activity_data.name}
                      </p>
                      <p className="text-gray-300 text-sm truncate">
                        by{" "}
                        {userDetails.discord_details.activity_data.details ||
                          "Unknown Artist"}
                      </p>
                      {userDetails.discord_details.activity_data.state && (
                        <p className="text-gray-400 text-xs truncate mt-1">
                          on {userDetails.discord_details.activity_data.state}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {userDetails.discord_details.activity_data.type ===
                  "playing" && (
                  <div className="flex gap-4 items-center">
                    {userDetails.discord_details.activity_data.large_image && (
                      <img
                        src={
                          userDetails.discord_details.activity_data.large_image
                        }
                        alt="Game"
                        className="w-20 h-20 rounded-lg border-2 border-gold/30"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-purple-400 mb-2 font-semibold">
                        🎮 PLAYING
                      </p>
                      <p className="text-white font-bold text-lg truncate">
                        {userDetails.discord_details.activity_data.name}
                      </p>
                      {userDetails.discord_details.activity_data.details && (
                        <p className="text-gray-300 text-sm truncate">
                          {userDetails.discord_details.activity_data.details}
                        </p>
                      )}
                      {userDetails.discord_details.activity_data.state && (
                        <p className="text-gray-400 text-xs truncate mt-1">
                          {userDetails.discord_details.activity_data.state}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Roles Section */}
          <div className="px-8 pb-8">
            <div className="bg-black-deep/50 backdrop-blur rounded-2xl p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold-light/30 flex items-center justify-center border border-gold/40">
                  <span className="text-gold font-bold text-xl">👑</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gold">Server Roles</h3>
                  <p className="text-gray-400 text-sm">
                    {(() => {
                      const roleNames =
                        userDetails.guild_roles?.filter(
                          (role) => !/^\d+$/.test(role)
                        ) || [];
                      return roleNames.length;
                    })()}{" "}
                    role
                    {(() => {
                      const roleNames =
                        userDetails.guild_roles?.filter(
                          (role) => !/^\d+$/.test(role)
                        ) || [];
                      return roleNames.length !== 1 ? "s" : "";
                    })()}{" "}
                    assigned
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(() => {
                  const roleNames =
                    userDetails.guild_roles
                      ?.filter((role) => !/^\d+$/.test(role))
                      .reverse() || [];

                  const getRoleColor = (roleName: string) => {
                    const roleColor = userDetails.role_colors?.find(
                      (rc) => rc.name === roleName
                    );
                    return roleColor?.color || "#99AAB5";
                  };

                  const getTextColor = (bgColor: string) => {
                    const hex = bgColor.replace("#", "");
                    const r = parseInt(hex.substr(0, 2), 16);
                    const g = parseInt(hex.substr(2, 2), 16);
                    const b = parseInt(hex.substr(4, 2), 16);
                    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    return luminance > 0.5 ? "#000000" : "#FFFFFF";
                  };

                  if (roleNames.length > 0) {
                    return roleNames.map((role, index) => {
                      const bgColor = getRoleColor(role);
                      const textColor = getTextColor(bgColor);
                      return (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold rounded-lg border-2 shadow-lg transition-transform hover:scale-105"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            borderColor: bgColor,
                            boxShadow: `0 0 15px ${bgColor}40`,
                          }}
                        >
                          {role}
                        </span>
                      );
                    });
                  } else {
                    return (
                      <span className="text-gray-400 text-sm py-4">
                        No roles assigned
                      </span>
                    );
                  }
                })()}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-gradient-to-r from-gold via-gold-light to-gold text-black-deep font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-gold/50 transition-all hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;
