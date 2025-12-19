"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useSystemUI } from "@/lib/contexts/SystemUIContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { ArrowLeft, Send, Plus, X } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Guild {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface Role {
  id: string;
  name: string;
}

interface Member {
  user: {
    id: string;
    username: string;
    discriminator: string;
    display_name: string;
  };
}

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface Embed {
  title: string;
  description: string;
  color: string;
  thumbnail?: { url: string };
  image?: { url: string };
  footer?: { text: string };
  author?: { name: string };
  fields: EmbedField[];
}

export default function AnnouncementsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const systemUI = useSystemUI();
  const [permissionChecked, setPermissionChecked] = useState(false);

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string>("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [mentionEveryone, setMentionEveryone] = useState(false);
  const [mentionHere, setMentionHere] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [useEmbed, setUseEmbed] = useState(false);
  const [embed, setEmbed] = useState<Embed>({
    title: "",
    description: "",
    color: "#FFD700",
    fields: [],
  });
  const [sending, setSending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
    if (user && permissionChecked) {
      fetchGuilds();
    }
  }, [user, permissionChecked]);

  useEffect(() => {
    if (selectedGuild) {
      fetchChannels(selectedGuild);
      fetchRoles(selectedGuild);
      fetchMembers(selectedGuild);
    }
  }, [selectedGuild]);

  const fetchGuilds = async () => {
    try {
      const response = await api.get("/discord/guilds");
      setGuilds(response.data);
      if (response.data.length > 0) {
        setSelectedGuild(response.data[0].id);
      }
    } catch (error) {
      systemUI.showAlert({
        type: "error",
        message: "Failed to fetch Discord guilds",
      });
    }
  };

  const fetchChannels = async (guildId: string) => {
    try {
      const response = await api.get(`/discord/guilds/${guildId}/channels`);
      setChannels(response.data.filter((ch: Channel) => ch.type === 0));
    } catch (error) {
      systemUI.showAlert({
        type: "error",
        message: "Failed to fetch channels",
      });
    }
  };

  const fetchRoles = async (guildId: string) => {
    try {
      const response = await api.get(`/discord/guilds/${guildId}/roles`);
      setRoles(response.data.filter((r: Role) => r.name !== "@everyone"));
    } catch (error) {
      systemUI.showAlert({ type: "error", message: "Failed to fetch roles" });
    }
  };

  const fetchMembers = async (guildId: string) => {
    try {
      const response = await api.get(`/discord/guilds/${guildId}/members`);
      setMembers(response.data);
    } catch (error) {
      systemUI.showAlert({ type: "error", message: "Failed to fetch members" });
    }
  };

  const addField = () => {
    setEmbed({
      ...embed,
      fields: [...embed.fields, { name: "", value: "", inline: false }],
    });
  };

  const updateField = (
    index: number,
    key: keyof EmbedField,
    value: string | boolean
  ) => {
    const newFields = [...embed.fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setEmbed({ ...embed, fields: newFields });
  };

  const removeField = (index: number) => {
    setEmbed({
      ...embed,
      fields: embed.fields.filter((_, i) => i !== index),
    });
  };

  const handleSend = async () => {
    if (!selectedChannel) {
      systemUI.showAlert({ type: "error", message: "Please select a channel" });
      return;
    }

    if (!messageContent && !useEmbed) {
      systemUI.showAlert({
        type: "error",
        message: "Please enter a message or enable embed",
      });
      return;
    }

    const hasMassMention =
      mentionEveryone || mentionHere || selectedRoles.length > 0;

    if (hasMassMention) {
      setShowConfirmDialog(true);
      return;
    }

    await sendAnnouncement();
  };

  const sendAnnouncement = async () => {
    setSending(true);
    setShowConfirmDialog(false);

    try {
      const payload: any = {
        channel_id: selectedChannel,
        content: messageContent,
      };

      if (mentionEveryone) payload.mention_everyone = true;
      if (mentionHere) payload.mention_here = true;
      if (selectedRoles.length > 0) payload.mention_roles = selectedRoles;
      if (selectedMembers.length > 0) payload.mention_users = selectedMembers;

      if (useEmbed && (embed.title || embed.description)) {
        payload.embed = {
          title: embed.title || undefined,
          description: embed.description || undefined,
          color: parseInt(embed.color.replace("#", ""), 16),
          thumbnail: embed.thumbnail?.url
            ? { url: embed.thumbnail.url }
            : undefined,
          image: embed.image?.url ? { url: embed.image.url } : undefined,
          footer: embed.footer?.text ? { text: embed.footer.text } : undefined,
          author: embed.author?.name ? { name: embed.author.name } : undefined,
          fields: embed.fields.filter((f) => f.name && f.value),
        };
      }

      await api.post("/discord/send-announcement", payload);
      systemUI.showAlert({
        type: "success",
        message: "Announcement sent successfully!",
      });

      // Reset form
      setMessageContent("");
      setUseEmbed(false);
      setEmbed({
        title: "",
        description: "",
        color: "#FFD700",
        fields: [],
      });
      setSelectedRoles([]);
      setSelectedMembers([]);
      setMentionEveryone(false);
      setMentionHere(false);
    } catch (error: any) {
      systemUI.showAlert({
        type: "error",
        message: error.response?.data?.detail || "Failed to send announcement",
      });
    } finally {
      setSending(false);
    }
  };

  if (isLoading || !user || !permissionChecked) {
    return <LoadingScreen message="Loading Announcements..." />;
  }

  if (!user.permissions?.can_manage_applications) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gold-light mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400 mb-4">
            You don't have permission to manage announcements
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
        {/* Header */}
        <div className="mb-6 backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-6 border border-gold/20 shadow-lg shadow-gold/5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/manager")}
              className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Manager</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gold-light mb-2">
            Announcements
          </h1>
          <p className="text-sm text-gray-400">
            Send announcements to Discord channels
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Server & Channel Selection */}
            <div className="backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-6 border border-steel/50">
              <h2 className="text-xl font-bold text-gold-light mb-4">
                Destination
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Server
                  </label>
                  <select
                    value={selectedGuild}
                    onChange={(e) => setSelectedGuild(e.target.value)}
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 focus:border-gold focus:outline-none"
                  >
                    {guilds.map((guild) => (
                      <option key={guild.id} value={guild.id}>
                        {guild.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Channel *
                  </label>
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 focus:border-gold focus:outline-none"
                  >
                    <option value="">Select a channel</option>
                    {channels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        #{channel.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mentions */}
            <div className="backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-6 border border-steel/50">
              <h2 className="text-xl font-bold text-gold-light mb-4">
                Mentions
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mentionEveryone}
                      onChange={(e) => setMentionEveryone(e.target.checked)}
                      className="w-4 h-4 rounded border-steel/50 bg-black-deep text-gold focus:ring-gold focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300">@everyone</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mentionHere}
                      onChange={(e) => setMentionHere(e.target.checked)}
                      className="w-4 h-4 rounded border-steel/50 bg-black-deep text-gold focus:ring-gold focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300">@here</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Roles
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          if (selectedRoles.includes(role.id)) {
                            setSelectedRoles(
                              selectedRoles.filter((id) => id !== role.id)
                            );
                          } else {
                            setSelectedRoles([...selectedRoles, role.id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedRoles.includes(role.id)
                            ? "bg-gold text-black"
                            : "bg-black-deep border border-steel/50 text-gray-300 hover:border-gold/50"
                        }`}
                      >
                        @{role.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Members
                  </label>
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search members..."
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 placeholder-gray-600 focus:border-gold focus:outline-none mb-2"
                  />
                  {selectedMembers.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-400 mb-1">Selected:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMembers.map((memberId) => {
                          const member = members.find(
                            (m) => m.user.id === memberId
                          );
                          if (!member) return null;
                          return (
                            <button
                              key={memberId}
                              type="button"
                              onClick={() => {
                                setSelectedMembers(
                                  selectedMembers.filter(
                                    (id) => id !== memberId
                                  )
                                );
                              }}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gold text-black hover:opacity-80 transition-all"
                            >
                              @{member.user.display_name} ✕
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {members
                      .filter((member) => {
                        const search = memberSearch.toLowerCase();
                        return (
                          !selectedMembers.includes(member.user.id) &&
                          (member.user.username
                            .toLowerCase()
                            .includes(search) ||
                            member.user.display_name
                              .toLowerCase()
                              .includes(search))
                        );
                      })
                      .slice(0, 20)
                      .map((member) => (
                        <button
                          key={member.user.id}
                          type="button"
                          onClick={() => {
                            setSelectedMembers([
                              ...selectedMembers,
                              member.user.id,
                            ]);
                            setMemberSearch("");
                          }}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-black-deep border border-steel/50 text-gray-300 hover:border-gold/50"
                        >
                          @{member.user.display_name}
                          {member.user.display_name !==
                            member.user.username && (
                            <span className="text-gray-500 text-xs ml-1">
                              ({member.user.username})
                            </span>
                          )}
                        </button>
                      ))}
                  </div>
                  {memberSearch &&
                    members.filter((m) => {
                      const search = memberSearch.toLowerCase();
                      return (
                        !selectedMembers.includes(m.user.id) &&
                        (m.user.username.toLowerCase().includes(search) ||
                          m.user.display_name.toLowerCase().includes(search))
                      );
                    }).length === 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        No members found
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-6 border border-steel/50">
              <h2 className="text-xl font-bold text-gold-light mb-4">
                Message
              </h2>

              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message content..."
                rows={4}
                className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 placeholder-gray-600 focus:border-gold focus:outline-none resize-none"
              />
            </div>

            {/* Embed Toggle */}
            <div className="backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-6 border border-steel/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useEmbed}
                  onChange={(e) => setUseEmbed(e.target.checked)}
                  className="w-4 h-4 rounded border-steel/50 bg-black-deep text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="text-sm font-medium text-gray-300">
                  Use Embed
                </span>
              </label>
            </div>

            {/* Embed Builder */}
            {useEmbed && (
              <div className="backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-6 border border-steel/50 space-y-4">
                <h2 className="text-xl font-bold text-gold-light">
                  Embed Builder
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={embed.title}
                    onChange={(e) =>
                      setEmbed({ ...embed, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={embed.description}
                    onChange={(e) =>
                      setEmbed({ ...embed, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={embed.color}
                    onChange={(e) =>
                      setEmbed({ ...embed, color: e.target.value })
                    }
                    className="h-10 w-20 rounded cursor-pointer bg-black-deep border border-steel/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={embed.author?.name || ""}
                    onChange={(e) =>
                      setEmbed({
                        ...embed,
                        author: e.target.value
                          ? { name: e.target.value }
                          : undefined,
                      })
                    }
                    placeholder="Author name (optional)"
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 placeholder-gray-600 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="text"
                    value={embed.thumbnail?.url || ""}
                    onChange={(e) =>
                      setEmbed({
                        ...embed,
                        thumbnail: e.target.value
                          ? { url: e.target.value }
                          : undefined,
                      })
                    }
                    placeholder="https://example.com/image.png"
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 placeholder-gray-600 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={embed.image?.url || ""}
                    onChange={(e) =>
                      setEmbed({
                        ...embed,
                        image: e.target.value
                          ? { url: e.target.value }
                          : undefined,
                      })
                    }
                    placeholder="https://example.com/image.png"
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 placeholder-gray-600 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={embed.footer?.text || ""}
                    onChange={(e) =>
                      setEmbed({
                        ...embed,
                        footer: e.target.value
                          ? { text: e.target.value }
                          : undefined,
                      })
                    }
                    placeholder="Footer text (optional)"
                    className="w-full px-4 py-2 bg-black-deep border border-steel/50 rounded-lg text-gray-200 placeholder-gray-600 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fields
                  </label>
                  <div className="space-y-2 mb-2">
                    {embed.fields.map((field, index) => (
                      <div
                        key={index}
                        className="bg-black-deep/50 p-3 rounded-lg space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) =>
                              updateField(index, "name", e.target.value)
                            }
                            placeholder="Field name"
                            className="flex-1 px-3 py-1.5 bg-black-deep border border-steel/50 rounded text-gray-200 text-sm focus:border-gold focus:outline-none"
                          />
                          <button
                            onClick={() => removeField(index)}
                            className="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={field.value}
                          onChange={(e) =>
                            updateField(index, "value", e.target.value)
                          }
                          placeholder="Field value"
                          rows={2}
                          className="w-full px-3 py-1.5 bg-black-deep border border-steel/50 rounded text-gray-200 text-sm focus:border-gold focus:outline-none resize-none"
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.inline}
                            onChange={(e) =>
                              updateField(index, "inline", e.target.checked)
                            }
                            className="w-3 h-3 rounded border-steel/50 bg-black-deep text-gold"
                          />
                          <span className="text-xs text-gray-400">Inline</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addField}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold border border-gold/30 rounded-lg hover:bg-gold/20 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sending || !selectedChannel}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
              {sending ? "Sending..." : "Send Announcement"}
            </button>
          </div>

          {/* Right Column - Preview */}
          <div className="backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-6 border border-steel/50 lg:sticky lg:top-6 h-fit">
            <h2 className="text-xl font-bold text-gold-light mb-4">Preview</h2>

            <div className="bg-[#36393f] rounded-lg p-4 space-y-2">
              {/* Show mentions */}
              {(mentionEveryone ||
                mentionHere ||
                selectedRoles.length > 0 ||
                selectedMembers.length > 0) && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {mentionEveryone && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#5865f2] text-white">
                      @everyone
                    </span>
                  )}
                  {mentionHere && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#5865f2] text-white">
                      @here
                    </span>
                  )}
                  {selectedRoles.map((roleId) => {
                    const role = roles.find((r) => r.id === roleId);
                    if (!role) return null;
                    return (
                      <span
                        key={roleId}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#5865f2] text-white"
                      >
                        @{role.name}
                      </span>
                    );
                  })}
                  {selectedMembers.map((memberId) => {
                    const member = members.find((m) => m.user.id === memberId);
                    if (!member) return null;
                    return (
                      <span
                        key={memberId}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#5865f2] text-white"
                      >
                        @{member.user.display_name}
                      </span>
                    );
                  })}
                </div>
              )}

              {messageContent && (
                <p className="text-gray-200 text-sm whitespace-pre-wrap">
                  {messageContent}
                </p>
              )}

              {useEmbed && (
                <div
                  className="border-l-4 rounded relative overflow-hidden"
                  style={{
                    borderColor: embed.color,
                    backgroundColor: "rgba(47,49,54,0.6)",
                  }}
                >
                  <div className={`p-3 ${embed.thumbnail?.url ? "pr-24" : ""}`}>
                    {embed.author?.name && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white text-xs font-semibold">
                          {embed.author.name}
                        </span>
                      </div>
                    )}
                    {embed.title && (
                      <div className="text-white font-semibold text-sm mb-2">
                        {embed.title}
                      </div>
                    )}
                    {embed.description && (
                      <div className="text-[#dcddde] text-sm mb-2 leading-relaxed whitespace-pre-wrap">
                        {embed.description}
                      </div>
                    )}
                    {embed.fields.filter((f) => f.name && f.value).length >
                      0 && (
                      <div className="mt-2">
                        {embed.fields.map(
                          (field, index) =>
                            field.name &&
                            field.value && (
                              <div
                                key={index}
                                className={
                                  field.inline
                                    ? "inline-block align-top mb-3 mr-3"
                                    : "block mb-3 w-full"
                                }
                                style={
                                  field.inline
                                    ? {
                                        width: "calc(33.33% - 12px)",
                                        minWidth: "150px",
                                      }
                                    : {}
                                }
                              >
                                <div className="text-white text-xs font-semibold mb-1">
                                  {field.name}
                                </div>
                                <div className="text-[#dcddde] text-xs leading-relaxed whitespace-pre-wrap break-words">
                                  {field.value}
                                </div>
                              </div>
                            )
                        )}
                        <div className="clear-both"></div>
                      </div>
                    )}
                    {embed.image?.url && (
                      <div className="mt-4">
                        <img
                          src={embed.image.url}
                          alt="Embed"
                          className="max-w-full rounded cursor-pointer"
                          style={{ maxHeight: "300px", maxWidth: "400px" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    {embed.footer?.text && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[#72767d] text-xs">
                          {embed.footer.text}
                        </span>
                      </div>
                    )}
                    {!embed.title &&
                      !embed.description &&
                      !embed.author?.name &&
                      !embed.footer?.text &&
                      !embed.image?.url &&
                      !embed.thumbnail?.url &&
                      embed.fields.filter((f) => f.name && f.value).length ===
                        0 && (
                        <p className="text-gray-500 text-sm italic">
                          Fill in embed fields to see preview
                        </p>
                      )}
                  </div>
                  {embed.thumbnail?.url && (
                    <div className="absolute top-3 right-3">
                      <img
                        src={embed.thumbnail.url}
                        alt="Thumbnail"
                        className="w-20 h-20 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {!messageContent && !useEmbed && (
                <p className="text-gray-500 text-sm italic">
                  Your message preview will appear here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog for Mass Mentions */}
      {showConfirmDialog && (
        <ConfirmDialog
          title="Confirm Mass Mention"
          message="You are about to send an announcement with mass mentions (@everyone, @here, or role mentions). This will notify many users. Are you sure?"
          onConfirm={sendAnnouncement}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
}
