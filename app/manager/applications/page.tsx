"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useSystemUI } from "@/lib/contexts/SystemUIContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { FileText, Check, X, CheckCircle, Trash2 } from "lucide-react";

export default function ApplicationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const systemUI = useSystemUI();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [acceptNotes, setAcceptNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

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
      loadApplications();
    }
  }, [statusFilter, permissionChecked, user]);

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

  const handleAccept = async () => {
    if (!selectedApp) return;

    if (acceptNotes.trim().length < 10) {
      systemUI.showAlert({
        type: "error",
        message: "Please provide acceptance notes (min 10 characters)",
      });
      return;
    }

    setProcessing(true);
    try {
      await api.post(`/applications/manager/accept/${selectedApp._id}`, {
        notes: acceptNotes,
      });
      setShowAcceptModal(false);
      setSelectedApp(null);
      setAcceptNotes("");
      loadApplications();
      systemUI.showAlert({
        type: "success",
        title: "Application Accepted!",
        message: "The application has been accepted successfully.",
        autoDismiss: 5000,
      });
    } catch (error: any) {
      systemUI.showAlert({
        type: "error",
        message: error.response?.data?.detail || "Failed to accept application",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;

    if (rejectReason.trim().length < 10) {
      systemUI.showAlert({
        type: "error",
        message: "Please provide a rejection reason (min 10 characters)",
      });
      return;
    }

    setProcessing(true);
    try {
      await api.post(`/applications/manager/reject/${selectedApp._id}`, {
        reason: rejectReason,
      });
      setShowRejectModal(false);
      setSelectedApp(null);
      setRejectReason("");
      loadApplications();
      systemUI.showAlert({
        type: "success",
        title: "Application Rejected",
        message: "The application has been rejected.",
        autoDismiss: 5000,
      });
    } catch (error: any) {
      systemUI.showAlert({
        type: "error",
        message: error.response?.data?.detail || "Failed to reject application",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (appId: string) => {
    systemUI.showConfirm({
      type: "delete",
      title: "Delete Application",
      message: "Are you sure you want to delete this application?",
      onConfirm: async () => {
        try {
          await api.delete(`/applications/manager/${appId}`);
          loadApplications();
          systemUI.showNotification({
            type: "toast",
            title: "Application Deleted",
            message: "The application has been deleted successfully.",
            autoDismiss: 5000,
          });
        } catch (error: any) {
          systemUI.showAlert({
            type: "error",
            message:
              error.response?.data?.detail || "Failed to delete application",
          });
        }
      },
    });
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

  if (isLoading || !user || !permissionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen message="Loading Applications..." fullScreen={false} />
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
            You don't have permission to access Applications Management
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-4 sm:p-6 border border-gold/20 shadow-lg shadow-gold/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gold-light mb-1">
                Applications Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Review and manage member applications
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
              <FileText className="w-5 h-5 text-gold" />
              <h2 className="text-xl font-bold text-gold-light">
                Applications
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-medium transition-all text-xs sm:text-sm ${
                  statusFilter === "all"
                    ? "bg-gradient-gold text-black shadow-lg shadow-gold/20"
                    : "bg-black-deep/80 text-gray-400 border border-steel/50 hover:text-gold-light hover:border-gold/50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-medium transition-all text-xs sm:text-sm ${
                  statusFilter === "pending"
                    ? "bg-gradient-gold text-black shadow-lg shadow-gold/20"
                    : "bg-black-deep/80 text-gray-400 border border-steel/50 hover:text-gold-light hover:border-gold/50"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("accepted")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-medium transition-all text-xs sm:text-sm ${
                  statusFilter === "accepted"
                    ? "bg-gradient-gold text-black shadow-lg shadow-gold/20"
                    : "bg-black-deep/80 text-gray-400 border border-steel/50 hover:text-gold-light hover:border-gold/50"
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setStatusFilter("rejected")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-medium transition-all text-xs sm:text-sm ${
                  statusFilter === "rejected"
                    ? "bg-gradient-gold text-black shadow-lg shadow-gold/20"
                    : "bg-black-deep/80 text-gray-400 border border-steel/50 hover:text-gold-light hover:border-gold/50"
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
            <div className="space-y-3 sm:space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-black-deep/80 backdrop-blur-sm border border-steel/50 rounded-2xl p-4 sm:p-6 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          app.user_info?.avatar
                            ? (() => {
                                const avatar = app.user_info.avatar;
                                if (avatar.includes("cdn.discordapp.com")) {
                                  const match = avatar.match(
                                    /avatars\/\d+\/([a-f0-9]+)\./
                                  );
                                  if (match) {
                                    return `https://cdn.discordapp.com/avatars/${app.user_id}/${match[1]}.png?size=128`;
                                  }
                                }
                                return `https://cdn.discordapp.com/avatars/${app.user_id}/${avatar}.png?size=128`;
                              })()
                            : `https://cdn.discordapp.com/embed/avatars/${
                                (parseInt(
                                  app.user_info?.discriminator || "0"
                                ) || parseInt(app.user_id)) % 5
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
                          {app.user_info?.username}
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
                      <span className="text-white ml-2">
                        {app.primary_game}
                      </span>
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
                      <div>
                        <h4 className="text-gold-light font-semibold mb-1">
                          Experience:
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {app.experience}
                        </p>
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
                        <p className="text-gray-300 text-sm">
                          {app.contribution}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() =>
                        setSelectedApp(
                          selectedApp?._id === app._id ? null : app
                        )
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
                            setShowAcceptModal(true);
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
        </div>
      </div>

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black-charcoal border-2 border-gold rounded-lg p-8 text-center max-w-md">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold animate-spin" />
              <div className="absolute inset-3 rounded-full border-2 border-gold/30 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-gold animate-pulse" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gold mb-2">
              Processing Decision
            </h3>
            <p className="text-gray-400 mb-4">
              Updating application status and notifying applicant...
            </p>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {showAcceptModal && selectedApp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black-charcoal border border-steel rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              Accept Application
            </h3>
            <p className="text-gray-400 mb-4">
              Why are you accepting{" "}
              {selectedApp.in_game_name || selectedApp.user_info?.username}'s
              application? (min 10 characters):
            </p>
            <textarea
              value={acceptNotes}
              onChange={(e) => setAcceptNotes(e.target.value)}
              className="w-full px-4 py-2 bg-black-deep border border-steel rounded-lg text-white h-32 mb-4"
              placeholder="e.g., Great experience, positive attitude, would be a good fit for the community..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowAcceptModal(false);
                  setAcceptNotes("");
                  setSelectedApp(null);
                }}
                disabled={processing}
                className="px-4 py-2 bg-steel text-white rounded hover:bg-steel/80 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={processing}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Confirm Accept
              </button>
            </div>
          </div>
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
                disabled={processing}
                className="px-4 py-2 bg-steel text-white rounded hover:bg-steel/80 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
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
