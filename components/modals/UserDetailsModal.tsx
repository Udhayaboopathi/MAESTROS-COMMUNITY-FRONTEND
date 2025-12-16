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
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 10000000 }}
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
        zIndex: 10000000,
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
          zIndex: 9999998,
          pointerEvents: "auto",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-black-charcoal border-2 border-gold rounded-lg shadow-2xl max-h-[calc(100vh-160px)] overflow-y-auto"
        style={{
          zIndex: 9999999,
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
                      // Show all role names in Discord server order (highest first)
                      const roleNames =
                        userDetails.guild_roles
                          ?.filter((role) => !/^\d+$/.test(role))
                          .reverse() || [];

                      const getRoleColor = (roleName: string) => {
                        // Find the role color from role_colors array
                        const roleColor = userDetails.role_colors?.find(
                          (rc) => rc.name === roleName
                        );
                        return roleColor?.color || "#99AAB5";
                      };

                      const getTextColor = (bgColor: string) => {
                        // Convert hex to RGB and calculate luminance
                        const hex = bgColor.replace("#", "");
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);
                        const luminance =
                          (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        return luminance > 0.5 ? "#000000" : "#FFFFFF";
                      };

                      if (roleNames.length > 0) {
                        return roleNames.map((role, index) => {
                          const bgColor = getRoleColor(role);
                          const textColor = getTextColor(bgColor);
                          return (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm font-medium rounded border"
                              style={{
                                backgroundColor: bgColor,
                                color: textColor,
                                borderColor: bgColor,
                              }}
                            >
                              {role}
                            </span>
                          );
                        });
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
            </div>
            {/* 7. Highest Role Display */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">7.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">
                    Highest Role Display
                  </h4>
                  <div className="inline-block">
                    <div
                      className="px-2 py-1 rounded-lg font-bold text-lg shadow-lg animate-pulse"
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
                        }66, 0 0 40px ${
                          userDetails.highest_role?.color || "#99AAB5"
                        }33`,
                        border: `2px solid ${
                          userDetails.highest_role?.color || "#99AAB5"
                        }`,
                      }}
                    >
                      {userDetails.highest_role?.name || "No Role"}
                    </div>
                  </div>
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
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3 h-3 rounded-full"
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
                    />
                    <p className="text-white text-sm font-medium">
                      {userDetails.discord_details?.status === "online"
                        ? "Online"
                        : userDetails.discord_details?.status === "idle"
                        ? "Idle"
                        : userDetails.discord_details?.status === "dnd"
                        ? "Do Not Disturb"
                        : "Offline"}
                    </p>
                  </div>
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
                  {userDetails.discord_details?.activity_data ? (
                    <div className="bg-black border border-steel rounded-lg p-3 mt-2">
                      {/* Spotify/Listening Activity */}
                      {userDetails.discord_details.activity_data.type ===
                        "listening" && (
                        <div className="flex gap-3">
                          {userDetails.discord_details.activity_data
                            .large_image && (
                            <img
                              src={
                                userDetails.discord_details.activity_data
                                  .large_image
                              }
                              alt="Album"
                              className="w-16 h-16 rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-1">
                              Listening to Spotify
                            </p>
                            <p className="text-white font-semibold text-sm truncate">
                              {userDetails.discord_details.activity_data.name}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                              by{" "}
                              {userDetails.discord_details.activity_data
                                .details || "Unknown Artist"}
                            </p>
                            {userDetails.discord_details.activity_data
                              .state && (
                              <p className="text-gray-400 text-xs truncate">
                                on{" "}
                                {
                                  userDetails.discord_details.activity_data
                                    .state
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Game/Playing Activity */}
                      {userDetails.discord_details.activity_data.type ===
                        "playing" && (
                        <div className="flex gap-3">
                          {userDetails.discord_details.activity_data
                            .large_image && (
                            <img
                              src={
                                userDetails.discord_details.activity_data
                                  .large_image
                              }
                              alt="Game"
                              className="w-16 h-16 rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-1">
                              Playing
                            </p>
                            <p className="text-white font-semibold text-sm truncate">
                              {userDetails.discord_details.activity_data.name}
                            </p>
                            {userDetails.discord_details.activity_data
                              .details && (
                              <p className="text-gray-400 text-xs truncate">
                                {
                                  userDetails.discord_details.activity_data
                                    .details
                                }
                              </p>
                            )}
                            {userDetails.discord_details.activity_data
                              .state && (
                              <p className="text-gray-400 text-xs truncate">
                                {
                                  userDetails.discord_details.activity_data
                                    .state
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Other Activities */}
                      {(userDetails.discord_details.activity_data.type ===
                        "streaming" ||
                        userDetails.discord_details.activity_data.type ===
                          "watching") && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            {userDetails.discord_details.activity_data.type ===
                            "streaming"
                              ? "Streaming"
                              : "Watching"}
                          </p>
                          <p className="text-white font-semibold text-sm">
                            {userDetails.discord_details.activity_data.name}
                          </p>
                          {userDetails.discord_details.activity_data
                            .details && (
                            <p className="text-gray-400 text-xs">
                              {
                                userDetails.discord_details.activity_data
                                  .details
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-white text-sm mb-1">No activity</p>
                  )}
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
            {/* 11. Discord Account Created */}
            <div className="bg-black-deep border border-steel rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-gold-light font-bold text-lg">11.</span>
                <div className="flex-1">
                  <h4 className="text-gold-light font-bold mb-1">
                    Discord Account Created
                  </h4>
                  <p className="text-white text-sm mb-1">
                    {userDetails.account_created_at
                      ? new Date(
                          userDetails.account_created_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not available"}
                  </p>
                  {userDetails.account_created_at && (
                    <>
                      <p className="text-gray-400 text-xs mb-2">
                        {new Date(
                          userDetails.account_created_at
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                      <div className="mt-2 pt-2 border-t border-steel">
                        <p className="text-gray-400 text-xs">
                          Account Age:{" "}
                          {(() => {
                            const created = new Date(
                              userDetails.account_created_at
                            );
                            const now = new Date();
                            const diffTime = Math.abs(
                              now.getTime() - created.getTime()
                            );
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );
                            const years = Math.floor(diffDays / 365);
                            const months = Math.floor((diffDays % 365) / 30);
                            const days = Math.floor((diffDays % 365) % 30);

                            const parts = [];
                            if (years > 0)
                              parts.push(
                                `${years} year${years !== 1 ? "s" : ""}`
                              );
                            if (months > 0)
                              parts.push(
                                `${months} month${months !== 1 ? "s" : ""}`
                              );
                            if (days > 0 || parts.length === 0)
                              parts.push(`${days} day${days !== 1 ? "s" : ""}`);

                            return parts.join(", ");
                          })()}
                        </p>
                      </div>
                    </>
                  )}
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
