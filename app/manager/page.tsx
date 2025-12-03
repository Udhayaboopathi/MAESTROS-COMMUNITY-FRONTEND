"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Application {
  _id: string;
  user_id: string;
  in_game_name: string;
  age: number;
  country: string;
  primary_game: string;
  gameplay_hours: number;
  rank: string;
  experience: string;
  reason: string;
  contribution: string;
  availability: number;
  status: string;
  submitted_at: string;
  score?: number;
  user_info?: {
    username: string;
    avatar: string;
    level: number;
    xp: number;
  };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  recent_week: number;
  approval_rate: number;
}

export default function ManagerPanel() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user && !user.permissions?.can_manage_applications) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.permissions?.can_manage_applications) {
      loadApplications();
      loadStats();
    }
  }, [user, filter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const endpoint =
        filter === "all"
          ? `/applications/manager/all`
          : `/applications/manager/all?status=${filter}`;
      const response = await api.get(endpoint);
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get("/applications/manager/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleAccept = async (appId: string) => {
    if (!confirm("Are you sure you want to accept this application?")) return;

    try {
      await api.post(`/applications/manager/accept/${appId}`);
      alert("Application accepted successfully!");
      loadApplications();
      loadStats();
      setSelectedApp(null);
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to accept application");
    }
  };

  const handleReject = async (appId: string) => {
    if (!rejectReason || rejectReason.trim().length < 10) {
      alert("Please provide a rejection reason (at least 10 characters)");
      return;
    }

    if (!confirm("Are you sure you want to reject this application?")) return;

    try {
      await api.post(`/applications/manager/reject/${appId}`, {
        reason: rejectReason,
      });
      alert("Application rejected successfully!");
      loadApplications();
      loadStats();
      setSelectedApp(null);
      setRejectReason("");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to reject application");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gold-light">Loading...</div>
      </div>
    );
  }

  if (!user.permissions?.can_manage_applications) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
            Manager Panel
          </h1>
          <p className="text-gray-400">Review and manage member applications</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-black-charcoal border border-steel rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-gold-light">
                {stats.total}
              </p>
            </div>
            <div className="bg-black-charcoal border border-yellow-500 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">
                {stats.pending}
              </p>
            </div>
            <div className="bg-black-charcoal border border-green-500 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-500">
                {stats.approved}
              </p>
            </div>
            <div className="bg-black-charcoal border border-red-500 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-500">
                {stats.rejected}
              </p>
            </div>
            <div className="bg-black-charcoal border border-blue-500 rounded-lg p-4">
              <p className="text-gray-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-blue-500">
                {stats.recent_week}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${
              filter === "pending"
                ? "bg-yellow-500 text-black font-bold"
                : "bg-black-charcoal text-gray-400 border border-steel"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded ${
              filter === "approved"
                ? "bg-green-500 text-black font-bold"
                : "bg-black-charcoal text-gray-400 border border-steel"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded ${
              filter === "rejected"
                ? "bg-red-500 text-white font-bold"
                : "bg-black-charcoal text-gray-400 border border-steel"
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-gold-light text-black font-bold"
                : "bg-black-charcoal text-gray-400 border border-steel"
            }`}
          >
            All
          </button>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No applications found
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-black-charcoal border border-steel rounded-lg p-6 hover:border-gold-light transition cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {app.user_info?.avatar && (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${app.user_id}/${app.user_info.avatar}.png`}
                        alt={app.user_info.username}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gold-light">
                        {app.in_game_name}
                      </h3>
                      <p className="text-gray-400">
                        {app.user_info?.username} • Level {app.user_info?.level}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.primary_game} • {app.gameplay_hours}h played
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                        app.status === "pending"
                          ? "bg-yellow-500 text-black"
                          : app.status === "approved"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </span>
                    {app.score && (
                      <p className="text-gold-light font-bold mt-2">
                        Score: {app.score}/100
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(app.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApp && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedApp(null)}
          >
            <div
              className="bg-black-charcoal border border-gold-light rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-6">
                Application Details
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-gold-light font-bold mb-2">
                    Personal Info
                  </h3>
                  <p className="text-gray-300">
                    IGN: {selectedApp.in_game_name}
                  </p>
                  <p className="text-gray-300">Age: {selectedApp.age}</p>
                  <p className="text-gray-300">
                    Country: {selectedApp.country}
                  </p>
                </div>

                <div>
                  <h3 className="text-gold-light font-bold mb-2">Gaming</h3>
                  <p className="text-gray-300">
                    Game: {selectedApp.primary_game}
                  </p>
                  <p className="text-gray-300">
                    Hours: {selectedApp.gameplay_hours}
                  </p>
                  <p className="text-gray-300">Rank: {selectedApp.rank}</p>
                  <p className="text-gray-300">
                    Availability: {selectedApp.availability}h/week
                  </p>
                </div>

                <div>
                  <h3 className="text-gold-light font-bold mb-2">Experience</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedApp.experience}
                  </p>
                </div>

                <div>
                  <h3 className="text-gold-light font-bold mb-2">Why Join?</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedApp.reason}
                  </p>
                </div>

                <div>
                  <h3 className="text-gold-light font-bold mb-2">
                    Contribution
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedApp.contribution}
                  </p>
                </div>

                {selectedApp.status === "pending" && (
                  <div className="pt-6 border-t border-steel space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        Rejection Reason (optional, but required if rejecting)
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full bg-black-deep border border-steel rounded p-3 text-gray-300"
                        rows={3}
                        placeholder="Provide a reason for rejection..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAccept(selectedApp._id)}
                        className="flex-1 px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => handleReject(selectedApp._id)}
                        className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-full px-6 py-3 bg-black-deep border border-steel text-gray-400 rounded hover:border-gold-light transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
