import { useState, useEffect } from "react";
import api from "@/lib/api";

interface DiscordStats {
  total: number;
  online: number;
  managers: any[];
  members: any[];
  last_update: string | null;
}

export function useDiscordStats() {
  const [stats, setStats] = useState<DiscordStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/discord/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch Discord stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refresh: fetchStats };
}
