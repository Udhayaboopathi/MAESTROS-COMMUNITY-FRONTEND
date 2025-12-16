"use client";

import { Check, X } from "lucide-react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className="mb-6 relative">
      <div
        className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-sm animate-in slide-in-from-top duration-500 ${
          type === "success"
            ? "bg-gradient-to-br from-black-deep/95 via-black-charcoal/95 to-black-deep/95 border-green-500/30"
            : "bg-gradient-to-br from-black-deep/95 via-black-charcoal/95 to-black-deep/95 border-red-500/30"
        }`}
      >
        {/* Glowing edge effect */}
        <div
          className={`absolute inset-0 opacity-20 ${
            type === "success"
              ? "bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
              : "bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
          }`}
        />

        {/* Left accent bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
            type === "success"
              ? "bg-gradient-to-b from-green-400 via-green-500 to-green-600"
              : "bg-gradient-to-b from-red-400 via-red-500 to-red-600"
          }`}
        />

        <div className="relative p-6 pl-8">
          <div className="flex items-start gap-4">
            {/* Icon with animated ring */}
            <div className="relative flex-shrink-0">
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                  type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <div
                className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                  type === "success"
                    ? "bg-gradient-to-br from-green-500 to-green-600"
                    : "bg-gradient-to-br from-red-500 to-red-600"
                }`}
              >
                {type === "success" ? (
                  <Check className="w-7 h-7 text-white" strokeWidth={3} />
                ) : (
                  <X className="w-7 h-7 text-white" strokeWidth={3} />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <h3
                className={`text-xl font-bold mb-2 tracking-wide ${
                  type === "success"
                    ? "bg-gradient-to-r from-green-300 via-green-400 to-green-300 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-red-300 via-red-400 to-red-300 bg-clip-text text-transparent"
                }`}
              >
                {type === "success" ? "✨ Success" : "⚠️ Error"}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                {message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                type === "success"
                  ? "hover:bg-green-500/20 text-green-400 hover:rotate-90"
                  : "hover:bg-red-500/20 text-red-400 hover:rotate-90"
              }`}
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom animated progress bar */}
        <div
          className={`h-1.5 animate-pulse ${
            type === "success"
              ? "bg-gradient-to-r from-transparent via-green-500 to-transparent"
              : "bg-gradient-to-r from-transparent via-red-500 to-transparent"
          }`}
        />
      </div>
    </div>
  );
}
