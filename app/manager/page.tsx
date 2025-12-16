"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  FileText,
  Gamepad2,
  Calendar,
  Shield,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Check,
} from "lucide-react";

type Tab = "applications" | "games" | "events" | "rules";

export default function ManagerPanel() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("applications");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user && !user.permissions?.can_manage_applications) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

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

  const tabs = [
    { id: "applications" as Tab, label: "Applications", icon: FileText },
    { id: "games" as Tab, label: "Games", icon: Gamepad2 },
    { id: "events" as Tab, label: "Events", icon: Calendar },
    { id: "rules" as Tab, label: "Rules", icon: Shield },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
            Manager Panel
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Manage applications, games, events, and community rules
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-gradient-gold text-black"
                    : "bg-black-charcoal text-gray-400 hover:text-gold-light border border-steel"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-black-charcoal border border-steel rounded-lg p-6">
          {activeTab === "applications" && <ApplicationsTab />}
          {activeTab === "games" && <GamesTab />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "rules" && <RulesTab />}
        </div>
      </div>
    </div>
  );
}

// Games Tab Component
function GamesTab() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    category: "",
    platform: "",
    clan: "",
    active: true,
  });

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await api.get("/games");
      setGames(response.data.games);
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGame) {
        await api.put(`/games/${editingGame._id}`, formData);
      } else {
        await api.post("/games", formData);
      }
      setShowForm(false);
      setEditingGame(null);
      setFormData({
        name: "",
        description: "",
        image_url: "",
        category: "",
        platform: "",
        clan: "",
        active: true,
      });
      loadGames();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to save game");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    try {
      await api.delete(`/games/${id}`);
      loadGames();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete game");
    }
  };

  const handleEdit = (game: any) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      description: game.description,
      image_url: game.image_url || "",
      category: game.category || "",
      platform: game.platform || "",
      clan: game.clan || "",
      active: game.active,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gold-light">Games Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingGame(null);
            setFormData({
              name: "",
              description: "",
              image_url: "",
              category: "",
              platform: "",
              clan: "",
              active: true,
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-black font-bold rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Add Game
        </button>
      </div>

      {showForm && (
        <div className="bg-black-deep border border-steel rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gold-light mb-4">
            {editingGame ? "Edit Game" : "Add New Game"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Game Name*</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Description*</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white h-24"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                >
                  <option value="">Select Platform</option>
                  <option value="Mobile">Mobile</option>
                  <option value="PC">PC</option>
                  <option value="Console">Console</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Clan/Crew</label>
                <input
                  type="text"
                  value={formData.clan}
                  onChange={(e) =>
                    setFormData({ ...formData, clan: e.target.value })
                  }
                  placeholder="e.g., Maestros, Crow"
                  className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Clan/Crew</label>
                <input
                  type="text"
                  value={formData.clan}
                  onChange={(e) =>
                    setFormData({ ...formData, clan: e.target.value })
                  }
                  placeholder="e.g., Maestros, Crow"
                  className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-400">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-gold text-black font-bold rounded-lg hover:opacity-90"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading games...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <div
              key={game._id}
              className="bg-black-deep border border-steel rounded-lg p-4"
            >
              {game.image_url && (
                <img
                  src={game.image_url}
                  alt={game.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-bold text-gold-light mb-2">
                {game.name}
              </h3>
              <p className="text-gray-400 text-sm mb-2">{game.description}</p>
              <div className="flex gap-2 text-xs text-gray-500 mb-3">
                {game.category && (
                  <span className="px-2 py-1 bg-steel rounded">
                    {game.category}
                  </span>
                )}
                {game.platform && (
                  <span className="px-2 py-1 bg-steel rounded">
                    {game.platform}
                  </span>
                )}
                {game.clan && (
                  <span className="px-2 py-1 bg-gold/20 text-gold rounded">
                    {game.clan}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(game)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(game._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Applications Tab Component
function ApplicationsTab() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [acceptNotes, setAcceptNotes] = useState("");

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const response = await api.get(`/applications/manager/all${params}`);
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appId: string) => {
    try {
      await api.post(`/applications/manager/accept/${appId}`, {
        notes: acceptNotes,
      });
      setSelectedApp(null);
      setAcceptNotes("");
      loadApplications();
      alert("Application accepted successfully!");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to accept application");
    }
  };

  const handleReject = async () => {
    if (!selectedApp || rejectReason.length < 10) {
      alert("Rejection reason must be at least 10 characters");
      return;
    }
    try {
      await api.post(`/applications/manager/reject/${selectedApp._id}`, {
        reason: rejectReason,
      });
      setShowRejectModal(false);
      setSelectedApp(null);
      setRejectReason("");
      loadApplications();
      alert("Application rejected");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to reject application");
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.delete(`/applications/manager/${appId}`);
      loadApplications();
      alert("Application deleted");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete application");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gold-light">
          Applications Management
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === "all"
                ? "bg-gradient-gold text-black"
                : "bg-black-deep text-gray-400 border border-steel hover:text-gold-light"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === "pending"
                ? "bg-gradient-gold text-black"
                : "bg-black-deep text-gray-400 border border-steel hover:text-gold-light"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("accepted")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === "accepted"
                ? "bg-gradient-gold text-black"
                : "bg-black-deep text-gray-400 border border-steel hover:text-gold-light"
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === "rejected"
                ? "bg-gradient-gold text-black"
                : "bg-black-deep text-gray-400 border border-steel hover:text-gold-light"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No applications found
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-black-deep border border-steel rounded-lg p-6 hover:border-gold-light/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      app.user_info?.avatar
                        ? (() => {
                            const avatar = app.user_info.avatar;
                            // If avatar is already a full URL, extract the hash
                            if (avatar.includes("cdn.discordapp.com")) {
                              const match = avatar.match(
                                /avatars\/\d+\/([a-f0-9]+)\./
                              );
                              if (match) {
                                return `https://cdn.discordapp.com/avatars/${app.user_id}/${match[1]}.png?size=128`;
                              }
                            }
                            // Otherwise use the hash directly
                            return `https://cdn.discordapp.com/avatars/${app.user_id}/${avatar}.png?size=128`;
                          })()
                        : `https://cdn.discordapp.com/embed/avatars/${
                            (parseInt(app.user_info?.discriminator || "0") ||
                              parseInt(app.user_id)) % 5
                          }.png`
                    }
                    alt={app.user_info?.username || "User"}
                    className="w-12 h-12 rounded-full bg-gray-700"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes("embed/avatars")) {
                        target.src = `https://cdn.discordapp.com/embed/avatars/${
                          (parseInt(app.user_info?.discriminator || "0") ||
                            parseInt(app.user_id)) % 5
                        }.png`;
                      }
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {app.in_game_name || app.user_info?.username}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {app.user_info?.username} • Level{" "}
                      {app.user_info?.level || 1}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded border ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status.toUpperCase()}
                  </div>
                  {app.score !== undefined && (
                    <div
                      className={`text-2xl font-bold ${getScoreColor(
                        app.score
                      )}`}
                    >
                      {app.score}%
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Primary Game:</span>
                  <span className="text-white ml-2">{app.primary_game}</span>
                </div>
                <div>
                  <span className="text-gray-500">Gameplay Hours:</span>
                  <span className="text-white ml-2">
                    {app.gameplay_hours} hrs
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Rank:</span>
                  <span className="text-white ml-2">{app.rank}</span>
                </div>
                <div>
                  <span className="text-gray-500">Availability:</span>
                  <span className="text-white ml-2">
                    {app.availability} hrs/week
                  </span>
                </div>
              </div>

              {selectedApp?._id === app._id && (
                <div className="mt-4 p-4 bg-black-charcoal rounded-lg border border-steel space-y-3">
                  {/* Discord Account Details */}
                  <div className="border-b border-steel pb-3">
                    <h4 className="text-gold-light font-bold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Discord Account Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Discord Tag:</span>
                        <span className="text-white ml-2">
                          {app.user_info?.username}
                          {app.user_info?.discriminator !== "0" &&
                            `#${app.user_info?.discriminator}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Discord ID:</span>
                        <span className="text-white ml-2 font-mono text-xs">
                          {app.user_id}
                        </span>
                      </div>
                      {app.user_info?.email && (
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="text-white ml-2">
                            {app.user_info.email}
                          </span>
                        </div>
                      )}
                      {app.user_info?.account_created && (
                        <div>
                          <span className="text-gray-500">
                            Account Created:
                          </span>
                          <span className="text-white ml-2">
                            {new Date(
                              app.user_info.account_created
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {app.user_info?.joined_at && (
                        <div>
                          <span className="text-gray-500">Server Joined:</span>
                          <span className="text-white ml-2">
                            {new Date(
                              app.user_info.joined_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {app.user_info?.last_login && (
                        <div>
                          <span className="text-gray-500">Last Login:</span>
                          <span className="text-white ml-2">
                            {new Date(
                              app.user_info.last_login
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">XP:</span>
                        <span className="text-gold-light ml-2 font-bold">
                          {app.user_info?.xp || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Level:</span>
                        <span className="text-gold-light ml-2 font-bold">
                          {app.user_info?.level || 1}
                        </span>
                      </div>
                    </div>
                    {app.user_info?.badges &&
                      app.user_info.badges.length > 0 && (
                        <div className="mt-2">
                          <span className="text-gray-500">Badges:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.user_info.badges.map(
                              (badge: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-gold-light/10 text-gold-light rounded text-xs"
                                >
                                  {badge}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    {app.user_info?.guild_roles &&
                      app.user_info.guild_roles.length > 0 && (
                        <div className="mt-2">
                          <span className="text-gray-500">Server Roles:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.user_info.guild_roles.map(
                              (role: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs"
                                >
                                  {role}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Application Content */}
                  <div>
                    <h4 className="text-gold-light font-semibold mb-1">
                      Experience:
                    </h4>
                    <p className="text-gray-300 text-sm">{app.experience}</p>
                  </div>
                  <div>
                    <h4 className="text-gold-light font-semibold mb-1">
                      Why Join:
                    </h4>
                    <p className="text-gray-300 text-sm">{app.reason}</p>
                  </div>
                  <div>
                    <h4 className="text-gold-light font-semibold mb-1">
                      Contribution:
                    </h4>
                    <p className="text-gray-300 text-sm">{app.contribution}</p>
                  </div>
                  {app.ai_analysis?.strengths && (
                    <div>
                      <h4 className="text-green-400 font-semibold mb-1">
                        Strengths:
                      </h4>
                      <ul className="list-disc list-inside text-gray-300 text-sm">
                        {app.ai_analysis.strengths.map(
                          (s: string, i: number) => (
                            <li key={i}>{s}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {app.ai_analysis?.weaknesses && (
                    <div>
                      <h4 className="text-red-400 font-semibold mb-1">
                        Weaknesses:
                      </h4>
                      <ul className="list-disc list-inside text-gray-300 text-sm">
                        {app.ai_analysis.weaknesses.map(
                          (w: string, i: number) => (
                            <li key={i}>{w}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    setSelectedApp(selectedApp?._id === app._id ? null : app)
                  }
                  className="flex items-center gap-1 px-3 py-2 bg-steel text-white rounded hover:bg-steel/80"
                >
                  <FileText className="w-4 h-4" />
                  {selectedApp?._id === app._id
                    ? "Hide Details"
                    : "View Details"}
                </button>
                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        const notes = prompt("Optional notes for acceptance:");
                        if (notes !== null) {
                          setAcceptNotes(notes);
                          handleAccept(app._id);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setShowRejectModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(app._id)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-800 text-white rounded hover:bg-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black-charcoal border border-steel rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gold-light mb-4">
              Reject Application
            </h3>
            <p className="text-gray-400 mb-4">
              Please provide a reason for rejecting {selectedApp.in_game_name}'s
              application (min 10 characters):
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2 bg-black-deep border border-steel rounded-lg text-white h-32 mb-4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedApp(null);
                }}
                className="px-4 py-2 bg-steel text-white rounded hover:bg-steel/80"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Events Tab Component
function EventsTab() {
  return <div className="text-gray-400">Events Management - Coming Soon</div>;
}

// Rules Tab Component
function RulesTab() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    rules: [""],
    active: true,
  });

  useEffect(() => {
    loadRules();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get("/rules/categories/channels");
      setCategories(response.data.channels || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadRules = async () => {
    try {
      const response = await api.get("/rules");
      setRules(response.data.rules || []);
    } catch (error) {
      console.error("Failed to load rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty rules
    const filteredRules = formData.rules.filter((r) => r.trim() !== "");
    if (filteredRules.length === 0) {
      alert("Please add at least one rule");
      return;
    }

    try {
      const submitData = {
        title: formData.title,
        category: formData.category,
        rule_content: filteredRules.join("\n"),
        active: formData.active,
      };

      if (editingRule) {
        await api.put(`/rules/${editingRule._id}`, submitData);
      } else {
        await api.post("/rules", submitData);
      }
      setShowForm(false);
      setEditingRule(null);
      setFormData({
        title: "",
        category: "",
        rules: [""],
        active: true,
      });
      loadRules();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to save rule");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rule section?")) return;
    try {
      await api.delete(`/rules/${id}`);
      loadRules();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete rule");
    }
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    const rulesArray = rule.rule_content
      .split("\n")
      .filter((r: string) => r.trim() !== "");
    setFormData({
      title: rule.title,
      category: rule.category || "",
      rules: rulesArray.length > 0 ? rulesArray : [""],
      active: rule.active,
    });
    setShowForm(true);
  };

  const addRuleField = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, ""],
    });
  };

  const removeRuleField = (index: number) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      rules: newRules.length > 0 ? newRules : [""],
    });
  };

  const updateRuleField = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({
      ...formData,
      rules: newRules,
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gold-light">
          Rules Management
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingRule(null);
            setFormData({
              title: "",
              category: "",
              rules: [""],
              active: true,
            });
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-gold text-black font-bold rounded-lg hover:opacity-90 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm sm:text-base">Add Rule Section</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-black-deep border border-steel rounded-lg p-4 sm:p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gold-light mb-4">
            {editingRule ? "Edit Rule Section" : "Add New Rule Section"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">
                  Section Title*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., General Rules"
                  className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Category*</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.display_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <label className="block text-gray-400">Rules*</label>
                <button
                  type="button"
                  onClick={addRuleField}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gold/20 text-gold rounded hover:bg-gold/30 text-sm w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>
              <div className="space-y-3">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-center justify-center w-7 sm:w-8 h-10 bg-gradient-gold rounded text-black font-bold text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRuleField(index, e.target.value)}
                      placeholder={`Rule ${index + 1}`}
                      className="flex-1 px-3 sm:px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white text-sm sm:text-base"
                    />
                    {formData.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRuleField(index)}
                        className="px-2 sm:px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                Active
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-gold text-black font-bold rounded-lg hover:opacity-90 w-full sm:w-auto"
              >
                <Save className="w-5 h-5" />
                <span className="text-sm sm:text-base">Save</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 w-full sm:w-auto text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading rules...</div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => {
            const rulesList = rule.rule_content
              .split("\n")
              .filter((r: string) => r.trim() !== "");
            return (
              <div
                key={rule._id}
                className="bg-black-deep border border-steel rounded-lg p-4 sm:p-6 hover:border-gold-light/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gold-light">
                        {rule.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gradient-gold text-black text-xs font-bold rounded-full">
                          {rule.category}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            rule.active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {rule.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(rule)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {rulesList.map((ruleText: string, index: number) => (
                    <div key={index} className="flex gap-2 sm:gap-3">
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gradient-gold rounded text-black font-bold text-xs sm:text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed flex-1 pt-1">
                        {ruleText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {rules.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No rules added yet. Create your first rule section to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
