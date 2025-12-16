"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-black-deep via-black-charcoal to-black-deep border-2 border-gold/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Glowing top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <AlertTriangle
                  className="w-8 h-8 text-white"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-300 text-center leading-relaxed mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600 text-gray-300 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold border border-gold text-black-deep rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-gold/50"
            >
              {confirmText}
            </button>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent animate-pulse" />
      </div>
    </div>
  );
}
