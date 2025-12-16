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

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Apply", href: "/apply", icon: FileText },
  { name: "Games", href: "/games", icon: Gamepad2 },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Rules", href: "/rules", icon: Shield },
  { name: "Team", href: "/team", icon: Users },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, login, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { stats, loading: statsLoading } = useDiscordStats();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleUserClick = (clickedUser: any) => {
    setSelectedUser(clickedUser);
    setIsUserModalOpen(true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black-charcoal/95 backdrop-blur-sm border-b border-steel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              MAESTROS
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
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
          <div className="hidden md:flex items-center">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-4 py-2 text-gold hover:bg-gold/10 rounded-lg transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    {user.display_name || user.username}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
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
            className="md:hidden p-2 text-gold hover:bg-gold/10 rounded-lg transition-all"
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
        <div className="md:hidden border-t border-steel bg-black-charcoal max-h-[calc(100vh-4rem)] overflow-y-auto">
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
                {stats?.ceo_online && stats.ceo_online.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-3 h-3 text-gold" />
                      <span className="text-xs text-gray-400">
                        CEO Online ({stats.ceo_online.length})
                      </span>
                    </div>
                    <div className="space-y-1">
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
                    <div className="space-y-1">
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
                      <div className="space-y-1 mt-2">
                        {stats.community_member_online
                          .slice(0, 5)
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
                        {stats.community_member_online.length > 5 && (
                          <div className="text-xs text-gray-500 pl-2">
                            +{stats.community_member_online.length - 5} more
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
