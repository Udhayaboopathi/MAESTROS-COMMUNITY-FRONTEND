"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Info,
  FileText,
  Gamepad2,
  Calendar,
  Users,
  Mail,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Crown,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useDiscordStats } from "@/lib/hooks/useDiscordStats";
import UserDetailsModal from "@/components/modals/UserDetailsModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, login, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { stats, loading: statsLoading } = useDiscordStats();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Check if user has the MEMBER role (logic performed in backend)
  const showApply = !user?.has_member_role;

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    ...(showApply ? [{ name: "Apply", href: "/apply", icon: FileText }] : []),
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Rules", href: "/rules", icon: Shield },
    { name: "Team", href: "/team", icon: Users },
    { name: "Server Invitation", href: "/rp-invite", icon: Gamepad2 },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const handleUserClick = (clickedUser: any) => {
    setSelectedUser(clickedUser);
    setIsUserModalOpen(true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black-charcoal/95 backdrop-blur-sm border-b border-steel">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="text-xl lg:text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent whitespace-nowrap">
              MAESTROS COMMUNITY
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-gold text-black font-semibold"
                      : "text-gray-300 hover:text-gold hover:bg-gold/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Button */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-3 py-2 text-gold hover:bg-gold/10 rounded-lg transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm max-w-[120px] truncate">
                    {user.display_name || user.username}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-gold text-black font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Login with Discord</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gold hover:bg-gold/10 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-steel bg-black-charcoal max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Discord Stats Section */}
          <div className="px-4 py-4 border-b border-steel">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.png"
                alt="Maestros Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
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
                      <div className="space-y-1">
                        {stats.managers
                          .filter((m: any) => m.permissions?.is_ceo)
                          .map((ceo: any, idx: number) => (
                            <button
                              key={ceo.discord_id || idx}
                              onClick={() => handleUserClick(ceo)}
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
                      <div className="space-y-1">
                        {stats.managers
                          .filter(
                            (m: any) =>
                              m.permissions?.is_manager &&
                              !m.permissions?.is_ceo
                          )
                          .map((manager: any, idx: number) => (
                            <button
                              key={manager.discord_id || idx}
                              onClick={() => handleUserClick(manager)}
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
                    <span className="text-xs text-gray-400">
                      Community Members Online ({stats.members.length})
                    </span>
                    <div className="space-y-1 mt-2">
                      {stats.members
                        .slice(0, 10)
                        .map((member: any, idx: number) => (
                          <button
                            key={member.discord_id || idx}
                            onClick={() => handleUserClick(member)}
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

          {/* Navigation Links */}
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-gold text-black font-semibold"
                      : "text-gray-300 hover:text-gold hover:bg-gold/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Mobile Auth */}
            <div className="pt-3 border-t border-steel mt-3">
              {isLoading ? (
                <div className="flex justify-center py-3">
                  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : user ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gold hover:bg-gold/10 rounded-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span>{user.display_name || user.username}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    login();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-black font-semibold rounded-lg hover:shadow-gold-glow transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login with Discord</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <UserDetailsModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
      />
    </nav>
  );
}
