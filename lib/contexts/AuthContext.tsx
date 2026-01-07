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
  joined_at: string;
  last_login: string;
  is_member?: boolean;
  has_member_role?: boolean;
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
    // Handle token from URL (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      sessionStorage.setItem("auth_token", token);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    checkAuth();

    // Set up token expiration check interval (check every 5 minutes)
    const tokenCheckInterval = setInterval(() => {
      const currentToken = sessionStorage.getItem("auth_token");
      if (currentToken) {
        try {
          const tokenParts = currentToken.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expirationTime = payload.exp * 1000;

            // If token expires in less than 5 minutes, try to refresh
            if (Date.now() >= expirationTime - 300000) {
              console.log("Token expiring soon or expired, logging out");
              logout();
            }
          }
        } catch (e) {
          console.error("Error checking token expiration:", e);
        }
      }
    }, 300000); // Check every 5 minutes

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const checkAuth = async () => {
    try {
      const token = sessionStorage.getItem("auth_token");
      if (token) {
        // Check if token is expired by decoding JWT
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const expirationTime = payload.exp * 1000; // Convert to milliseconds

          // If token is expired, clear it
          if (Date.now() >= expirationTime) {
            console.log("Token expired, logging out");
            sessionStorage.removeItem("auth_token");
            setUser(null);
            setIsLoading(false);
            return;
          }
        }

        const response = await api.get("/auth/me");
        // Ensure permissions object exists, even if empty
        if (response.data && !response.data.permissions) {
          response.data.permissions = {
            is_admin: false,
            is_ceo: false,
            is_manager: false,
            can_manage_applications: false,
          };
        }
        setUser(response.data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      sessionStorage.removeItem("auth_token");
      setUser(null);
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
      sessionStorage.removeItem("auth_token");
      setUser(null);
      window.location.href = "/";
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      // Ensure permissions object exists, even if empty
      if (response.data && !response.data.permissions) {
        response.data.permissions = {
          is_admin: false,
          is_ceo: false,
          is_manager: false,
          can_manage_applications: false,
        };
      }
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
