"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useSystemUI } from "@/lib/contexts/SystemUIContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Gamepad2, Plus, Edit, Trash2, Save } from "lucide-react";

export default function GamesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const systemUI = useSystemUI();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
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
    if (!isLoading) {
      if (!user) {
        router.push("/");
      } else if (user.permissions) {
        setPermissionChecked(true);
        if (!user.permissions.can_manage_applications) {
          router.push("/dashboard");
        }
      } else {
        setPermissionChecked(false);
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (permissionChecked && user?.permissions?.can_manage_applications) {
      loadGames();
    }
  }, [permissionChecked, user]);

  const loadGames = async () => {
    try {
      const response = await api.get("/games");
      setGames(response.data.games);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load games:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingGame) {
        await api.put(`/games/${editingGame._id}`, formData);
        systemUI.showAlert({
          type: "success",
          title: "Game Updated!",
          message: "Game information updated successfully.",
          autoDismiss: 5000,
        });
      } else {
        const response = await api.post("/games", formData);
        const discordCreated = response.data.discord_created;
        systemUI.showAlert({
          type: "success",
          title: "Game Created!",
          message: discordCreated
            ? "Discord category, role, and channels have been created successfully."
            : "Game created successfully! (Discord setup skipped)",
          autoDismiss: 5000,
        });
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
      systemUI.showAlert({
        type: "error",
        message:
          error.response?.data?.detail ||
          "Failed to save game. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, gameName: string) => {
    systemUI.showConfirm({
      type: "delete",
      title: "Delete Game",
      message: `Are you sure you want to delete "${gameName}"? This will remove it from the database but you must manually delete Discord channels.`,
      onConfirm: async () => {
        try {
          await api.delete(`/games/${id}`);
          systemUI.showNotification({
            type: "toast",
            title: "Game Deleted",
            message: `"${gameName}" deleted successfully! Remember to manually delete Discord category and role.`,
            autoDismiss: 7000,
          });
          loadGames();
        } catch (error: any) {
          systemUI.showAlert({
            type: "error",
            message:
              error.response?.data?.detail ||
              "Failed to delete game. Please try again.",
          });
        }
      },
    });
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

  if (isLoading || !user || !permissionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen
          message="Loading Games Management..."
          fullScreen={false}
        />
      </div>
    );
  }

  if (!user.permissions?.can_manage_applications) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gold-light mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400 mb-4">
            You don't have permission to access Games Management
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-gradient-gold text-black font-bold rounded-lg hover:opacity-90"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black-deep to-black-charcoal">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-4 sm:p-6 border border-gold/20 shadow-lg shadow-gold/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gold-light mb-1">
                Games Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Add and manage community games
              </p>
            </div>
            <button
              onClick={() => router.push("/manager")}
              className="px-4 py-2 bg-steel/50 text-gold-light border border-gold/30 rounded-lg hover:bg-steel/70 transition-all text-sm"
            >
              ← Back to Manager
            </button>
          </div>
        </div>

        <div className="bg-black-charcoal/50 backdrop-blur-sm border border-steel/50 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-gold" />
              <h2 className="text-xl font-bold text-gold-light">Games</h2>
            </div>
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
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-gold text-black font-bold rounded-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-gold/20"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add Game</span>
            </button>
          </div>

          {showForm && (
            <div className="bg-black-deep/80 backdrop-blur-sm border border-gold/30 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl">
              <h3 className="text-lg sm:text-xl font-bold text-gold-light mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                {editingGame ? "Edit Game" : "Add New Game"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Game Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black-charcoal/80 border border-steel/50 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm sm:text-base"
                    placeholder="Enter game name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description*
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black-charcoal/80 border border-steel/50 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none text-sm sm:text-base"
                    rows={4}
                    placeholder="Describe the game..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image URL
                    </label>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                    >
                      <option value="">Select platform...</option>
                      <option value="PC">PC</option>
                      <option value="Console">Console</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Cross-platform">Cross-platform</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Clan Tag
                    </label>
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
                    <label className="flex items-center gap-2 text-gray-300">
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
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-gold text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>
                          {editingGame ? "Update Game" : "Create Game"}
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                    className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Loading games...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {games.map((game) => (
                <div
                  key={game._id}
                  className="group bg-black-deep/80 backdrop-blur-sm border border-steel/50 rounded-2xl p-4 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300"
                >
                  {game.image_url && (
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-36 sm:h-40 object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg font-bold text-gold-light mb-2 group-hover:text-gold transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
                    {game.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs mb-3">
                    {game.category && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {game.category}
                      </span>
                    )}
                    {game.platform && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
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
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600/80 text-white rounded-xl hover:bg-blue-600 transition-all text-xs sm:text-sm font-medium"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(game._id, game.name)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600/80 text-white rounded-xl hover:bg-red-600 transition-all text-xs sm:text-sm font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
