"use client";

import { useMemo } from "react";

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface EmbedData {
  title: string;
  description: string;
  color: string;
  thumbnail_url: string;
  image_url: string;
  footer_text: string;
  footer_icon_url: string;
  author_name: string;
  author_icon_url: string;
  timestamp: boolean;
  fields: EmbedField[];
}

interface MentionConfig {
  role_ids: string[];
  user_ids: string[];
  everyone: boolean;
  here: boolean;
}

interface Props {
  embed: EmbedData;
  mentions: MentionConfig;
  content?: string;
}

export default function DiscordEmbedPreview({
  embed,
  mentions,
  content,
}: Props) {
  // Format description with basic markdown support
  const formattedDescription = useMemo(() => {
    if (!embed.description) return "";
    return embed.description
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\_\_(.+?)\_\_/g, "<u>$1</u>")
      .replace(/\~\~(.+?)\~\~/g, "<s>$1</s>")
      .replace(/\`(.+?)\`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");
  }, [embed.description]);

  // Generate mention preview
  const mentionPreview = useMemo(() => {
    const parts = [];
    if (mentions.everyone) parts.push("@everyone");
    if (mentions.here) parts.push("@here");
    if (mentions.role_ids.length > 0)
      parts.push(`${mentions.role_ids.length} role(s)`);
    if (mentions.user_ids.length > 0)
      parts.push(`${mentions.user_ids.length} user(s)`);
    return parts.join(", ");
  }, [mentions]);

  return (
    <div className="bg-[#36393f] rounded-lg p-4 font-['Whitney','Helvetica_Neue',Helvetica,Arial,sans-serif]">
      {/* Message Content */}
      {(content || mentionPreview) && (
        <div className="mb-3">
          {mentionPreview && (
            <div className="text-[#7289da] font-medium mb-1 text-sm">
              📢 Mentions: {mentionPreview}
            </div>
          )}
          {content && <div className="text-[#dcddde] text-sm">{content}</div>}
        </div>
      )}

      {/* Embed */}
      <div className="bg-[#2f3136] rounded overflow-hidden">
        <div
          className="pl-3 py-2 border-l-4"
          style={{ borderLeftColor: embed.color || "#5865F2" }}
        >
          <div className="px-3 py-2">
            {/* Author */}
            {embed.author_name && (
              <div className="flex items-center gap-2 mb-2">
                {embed.author_icon_url && (
                  <img
                    src={embed.author_icon_url}
                    alt=""
                    className="w-6 h-6 rounded-full"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="text-white text-sm font-semibold">
                  {embed.author_name}
                </div>
              </div>
            )}

            {/* Title */}
            {embed.title && (
              <div className="text-white text-lg font-semibold mb-2">
                {embed.title}
              </div>
            )}

            {/* Description */}
            {embed.description && (
              <div
                className="text-[#dcddde] text-sm mb-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedDescription }}
                style={{
                  wordBreak: "break-word",
                }}
              />
            )}

            {/* Fields */}
            {embed.fields.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {embed.fields.map((field, index) => (
                  <div
                    key={index}
                    className={
                      field.inline ? "inline-block w-1/3 pr-3" : "block"
                    }
                  >
                    <div className="text-white text-sm font-semibold mb-1">
                      {field.name}
                    </div>
                    <div className="text-[#dcddde] text-sm">{field.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Image */}
            {embed.image_url && (
              <div className="mt-3">
                <img
                  src={embed.image_url}
                  alt=""
                  className="max-w-full rounded"
                  style={{ maxHeight: "300px" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            {/* Thumbnail */}
            {embed.thumbnail_url && (
              <div className="float-right ml-3">
                <img
                  src={embed.thumbnail_url}
                  alt=""
                  className="rounded"
                  style={{ maxWidth: "80px", maxHeight: "80px" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            {/* Footer */}
            {(embed.footer_text || embed.timestamp) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                {embed.footer_icon_url && (
                  <img
                    src={embed.footer_icon_url}
                    alt=""
                    className="w-5 h-5 rounded-full"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="text-[#72767d] text-xs">
                  {embed.footer_text}
                  {embed.footer_text && embed.timestamp && " • "}
                  {embed.timestamp && new Date().toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!embed.title && !embed.description && !content && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg">Preview will appear here</p>
          <p className="text-sm mt-2">Start building your announcement!</p>
        </div>
      )}
    </div>
  );
}
