"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Apply", href: "/apply", icon: FileText },
  { name: "Games", href: "/games", icon: Gamepad2 },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Team", href: "/team", icon: Users },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, login, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-gold hover:bg-gold/10 rounded-lg transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.username}</span>
                </Link>
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
        <div className="md:hidden border-t border-steel bg-black-charcoal">
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
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gold hover:bg-gold/10 rounded-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span>{user.username}</span>
                  </Link>
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
    </nav>
  );
}
