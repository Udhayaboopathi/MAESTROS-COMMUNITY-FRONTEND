"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Shield,
  Crown,
  Users,
  X,
  Calendar,
  Trophy,
  Award,
  Clock,
  Activity,
  TrendingUp,
} from "lucide-react";
import UserDetailsModal from "@/components/modals/UserDetailsModal";

interface TeamMember {
  discord_id: string;
  username: string;
  display_name?: string;
  avatar?: string;
  level?: number;
  xp?: number;
  badges?: string[];
  guild_roles?: string[];
  joined_at?: string;
  last_login?: string;
  is_online?: boolean;
  permissions?: {
    is_ceo?: boolean;
    is_manager?: boolean;
    is_admin?: boolean;
    can_manage_applications?: boolean;
  };
}

interface DiscordStats {
  total: number;
  online: number;
  managers: TeamMember[];
  members: TeamMember[];
  all_members?: TeamMember[];
  last_update: string | null;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "CEO":
      return <Crown className="w-6 h-6" />;
    case "Manager":
      return <Shield className="w-6 h-6" />;
    default:
      return <Users className="w-6 h-6" />;
  }
};

const MemberCard = ({
  member,
  role,
  index,
  onClick,
}: {
  member: TeamMember;
  role: string;
  index: number;
  onClick: () => void;
}) => {
  const avatarUrl = member.avatar
    ? `https://cdn.discordapp.com/avatars/${member.discord_id}/${member.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${
        parseInt(member.discord_id) % 5
      }.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Animated glow border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gold via-gold-light to-gold rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

      <div className="relative bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-2xl p-6 border border-gold/20 overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/40 rounded-br-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center space-y-4">
          {/* Avatar with role icon badge */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/50 ring-4 ring-gold/10">
              <img
                src={avatarUrl}
                alt={member.username}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Online status indicator */}
            <div className="absolute top-0 right-0">
              <div
                className={`w-6 h-6 rounded-full border-4 border-black-charcoal ${
                  member.is_online ? "bg-green-500" : "bg-gray-500"
                }`}
                title={member.is_online ? "Online" : "Offline"}
              >
                <span className="sr-only">
                  {member.is_online ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {/* Role badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold via-gold-light to-gold p-2 rounded-full shadow-lg">
              <div className="text-black-deep">{getRoleIcon(role)}</div>
            </div>
          </div>

          {/* Username */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gold mb-1">
              {member.display_name || member.username}
            </h3>
            <p className="text-sm text-gold/60 font-medium">{role}</p>
          </div>

          {/* Level badge */}
          {member.level !== undefined && (
            <div className="flex items-center gap-2 bg-black-deep/50 px-4 py-2 rounded-full border border-gold/20">
              <span className="text-xs text-gold/60">Level</span>
              <span className="text-sm font-bold text-gold">
                {member.level}
              </span>
            </div>
          )}

          {/* Badges */}
          {member.badges && member.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {member.badges.slice(0, 3).map((badge, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-gold/10 text-gold rounded-full border border-gold/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamPage() {
  const [stats, setStats] = useState<DiscordStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Fetch ALL guild members with roles (regardless of online status)
        const guildMembersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/discord/guild/members`
        );

        let allMembers: TeamMember[] = [];

        if (guildMembersResponse.ok) {
          const guildData = await guildMembersResponse.json();
          console.log("👥 Guild Members Data:", guildData);

          // Use all guild members directly
          allMembers = guildData.members.map((member: any) => ({
            discord_id: member.discord_id,
            username: member.username || member.display_name,
            display_name: member.display_name,
            avatar: member.avatar,
            level: member.level || 1,
            xp: member.xp || 0,
            badges: member.badges || [],
            guild_roles: member.guild_roles || [],
            joined_at: member.joined_at,
            last_login: member.last_login,
            is_online: member.is_online,
            permissions: member.permissions || {
              is_ceo: false,
              is_manager: false,
              is_admin: false,
              can_manage_applications: false,
            },
          }));

          console.log("✅ All Guild Members:", allMembers.length, allMembers);
        } else {
          console.error(
            "❌ Failed to fetch guild members:",
            guildMembersResponse.status
          );
          throw new Error("Failed to fetch guild members");
        }

        // Fetch online stats for server status display
        const statsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/discord/stats`
        );

        let statsData = {
          total: 0,
          online: 0,
          last_update: null,
        };

        if (statsResponse.ok) {
          statsData = await statsResponse.json();
          console.log("📊 Stats Data:", statsData);
        }

        setStats({
          total: statsData.total || allMembers.length,
          online:
            statsData.online || allMembers.filter((m) => m.is_online).length,
          managers: [],
          members: [],
          all_members: allMembers,
          last_update: statsData.last_update,
        });

        console.log("📋 Final stats with all_members:", {
          total: statsData.total || allMembers.length,
          online:
            statsData.online ||
            allMembers.filter((m: TeamMember) => m.is_online).length,
          all_members_count: allMembers.length,
        });
      } catch (err) {
        console.error("❌ Error fetching team members:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();

    // Refresh every 30 seconds
    const interval = setInterval(fetchTeamMembers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal flex items-center justify-center">
        <div className="text-center">
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
              Loading Team Members
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gold text-black-deep rounded-lg hover:bg-gold-light transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use all_members if available, otherwise combine online members
  const allMembers = stats?.all_members || [
    ...(stats?.managers || []),
    ...(stats?.members || []),
  ];

  // Separate members by permissions from backend
  const ceoMembers = allMembers.filter((m) => m.permissions?.is_ceo);

  const managerMembers = allMembers.filter(
    (m) => m.permissions?.is_manager && !m.permissions?.is_ceo
  );

  const regularMembers = allMembers.filter(
    (m) => !m.permissions?.is_manager && !m.permissions?.is_ceo
  );

  // Count online members in each category
  const onlineCeoCount = ceoMembers.filter((m) => m.is_online).length;
  const onlineManagerCount = managerMembers.filter((m) => m.is_online).length;
  const onlineMemberCount = regularMembers.filter((m) => m.is_online).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal p-6 sm:p-8 lg:p-12">
      {/* Member Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
        user={selectedMember ?? ""}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="lg:fixed lg:top-24 lg:w-80 space-y-6">
              {/* Overall Stats Card */}
              <div className="bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-2xl p-6 border border-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-bold text-gold">Server Stats</h3>
                </div>

                <div className="space-y-3">
                  {/* Total Members */}
                  <div className="flex items-center justify-between p-3 bg-black-deep/50 rounded-lg border border-gold/10">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gold" />
                      <span className="text-gray-400">Total Members</span>
                    </div>
                    <span className="text-2xl font-bold text-gold">
                      {allMembers.length}
                    </span>
                  </div>

                  {/* Online Members */}
                  <div className="flex items-center justify-between p-3 bg-black-deep/50 rounded-lg border border-gold/10">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-gray-400">Online Now</span>
                    </div>
                    <span className="text-2xl font-bold text-green-500">
                      {allMembers.filter((m) => m.is_online).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Distribution Card */}
              <div className="bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-2xl p-6 border border-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-bold text-gold">Distribution</h3>
                </div>

                <div className="space-y-3">
                  {/* CEO Count */}
                  <div className="p-3 bg-black-deep/50 rounded-lg border border-gold/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-gold" />
                        <span className="text-gray-400">Leadership</span>
                      </div>
                      <span className="text-lg font-bold text-gold">
                        {ceoMembers.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Online
                      </span>
                      <span className="text-green-500 font-semibold">
                        {onlineCeoCount}
                      </span>
                    </div>
                  </div>

                  {/* Manager Count */}
                  <div className="p-3 bg-black-deep/50 rounded-lg border border-gold/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-gold" />
                        <span className="text-gray-400">Managers</span>
                      </div>
                      <span className="text-lg font-bold text-gold">
                        {managerMembers.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Online
                      </span>
                      <span className="text-green-500 font-semibold">
                        {onlineManagerCount}
                      </span>
                    </div>
                  </div>

                  {/* Member Count */}
                  <div className="p-3 bg-black-deep/50 rounded-lg border border-gold/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gold" />
                        <span className="text-gray-400">Members</span>
                      </div>
                      <span className="text-lg font-bold text-gold">
                        {regularMembers.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Online
                      </span>
                      <span className="text-green-500 font-semibold">
                        {onlineMemberCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6"
              >
                <Users className="w-4 h-4 text-gold" />
                <span className="text-sm text-gold font-semibold">Our Team</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Our Team
              </h1>
              <p className="text-gray-400 text-lg">
                Meet the amazing people behind Maestros Community
              </p>
            </motion.div>

            {/* CEO Section */}
            {ceoMembers.length > 0 && (
              <div className="mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <Crown className="w-8 h-8 text-gold" />
                  <h2 className="text-3xl font-bold text-gold">Leadership</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent ml-4" />
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {ceoMembers.map((member, index) => (
                    <MemberCard
                      key={member.discord_id}
                      member={member}
                      role="CEO"
                      index={index}
                      onClick={() => {
                        setSelectedMember(member);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Managers Section */}
            {managerMembers.length > 0 && (
              <div className="mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <Shield className="w-8 h-8 text-gold" />
                  <h2 className="text-3xl font-bold text-gold">Managers</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent ml-4" />
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {managerMembers.map((member, index) => (
                    <MemberCard
                      key={member.discord_id}
                      member={member}
                      role="Manager"
                      index={index}
                      onClick={() => {
                        setSelectedMember(member);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Members Section */}
            {regularMembers.length > 0 && (
              <div className="mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <Users className="w-8 h-8 text-gold" />
                  <h2 className="text-3xl font-bold text-gold">Members</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent ml-4" />
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {regularMembers.map((member, index) => (
                    <MemberCard
                      key={member.discord_id}
                      member={member}
                      role="Member"
                      index={index}
                      onClick={() => {
                        setSelectedMember(member);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!ceoMembers.length &&
              !managerMembers.length &&
              !regularMembers.length && (
                <div className="text-center py-20">
                  <Users className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No team members found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Team data will appear here once the Discord bot is connected
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
