"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/lib/api";

interface User {
  id: string;
  discord_id: string;
  username: string;
  display_name?: string;
  discriminator: string;
  avatar: string;
  email?: string;
  roles: string[];
  guild_roles: string[];
  xp: number;
  level: number;
  badges: string[];
  joined_at: string;
  last_login: string;
  permissions?: {
    is_admin: boolean;
    is_ceo: boolean;
    is_manager: boolean;
    can_manage_applications: boolean;
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
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const response = await api.get("/auth/me");
        setUser(response.data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // Redirect to backend login endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    window.location.href = `${apiUrl}/auth/login`;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
      window.location.href = "/";
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
