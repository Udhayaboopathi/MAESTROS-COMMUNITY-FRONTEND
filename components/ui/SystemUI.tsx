"use client";

import { useEffect } from "react";
import {
  Check,
  X,
  AlertTriangle,
  Info,
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff,
  Lock,
  ShieldAlert,
  FileX,
  Search,
  Inbox,
  AlertOctagon,
  CheckCircle2,
  Construction,
  Ban,
  Eye,
  UserX,
  Gamepad2,
} from "lucide-react";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type SystemUIMode =
  | "loading"
  | "alert"
  | "confirm"
  | "error"
  | "empty"
  | "system"
  | "success"
  | "notification"
  | "prompt"
  | "status";

export type LoadingType =
  | "app"
  | "page"
  | "section"
  | "button"
  | "api"
  | "inline";
export type AlertType = "success" | "error" | "warning" | "info" | "critical";
export type ConfirmType =
  | "delete"
  | "exit"
  | "save"
  | "permission"
  | "destructive";
export type ErrorType = "401" | "403" | "404" | "500" | "network" | "unknown";
export type EmptyType =
  | "no-data"
  | "no-results"
  | "no-notifications"
  | "first-time";
export type SystemType =
  | "offline"
  | "maintenance"
  | "disabled"
  | "readonly"
  | "suspended";
export type SuccessType = "form" | "payment" | "setup" | "action";
export type NotificationType = "toast" | "snackbar" | "inapp" | "system";
export type PromptType = "input" | "password" | "otp" | "info";
export type StatusType =
  | "spinner"
  | "progress"
  | "skeleton"
  | "shimmer"
  | "processing";

export interface SystemUIAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export interface SystemUIInput {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface SystemUIProps {
  // Core props
  mode: SystemUIMode;
  type?:
    | LoadingType
    | AlertType
    | ConfirmType
    | ErrorType
    | EmptyType
    | SystemType
    | SuccessType
    | NotificationType
    | PromptType
    | StatusType;

  // Content
  title?: string;
  message?: string;
  icon?: React.ReactNode;

  // Actions
  actions?: SystemUIAction[];
  onClose?: () => void;

  // Inputs (for prompts)
  inputs?: SystemUIInput[];

  // Progress (for loading)
  progress?: number;

  // Visual
  logo?: boolean | string; // true for default icon, or path to custom logo
  backdrop?: boolean;
  theme?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "guild" | "minimal"; // New visual variants

  // Auto-dismiss
  autoDismiss?: number; // milliseconds
}

// =====================================================
// ICON MAPPING
// =====================================================

const getIconForType = (mode: SystemUIMode, type?: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    // Alert icons
    "alert-success": <Check className="w-8 h-8" strokeWidth={3} />,
    "alert-error": <X className="w-8 h-8" strokeWidth={3} />,
    "alert-warning": <AlertTriangle className="w-8 h-8" strokeWidth={3} />,
    "alert-info": <Info className="w-8 h-8" strokeWidth={3} />,
    "alert-critical": <AlertOctagon className="w-8 h-8" strokeWidth={3} />,

    // Confirm icons
    "confirm-delete": <AlertTriangle className="w-8 h-8" strokeWidth={2.5} />,
    "confirm-exit": <AlertCircle className="w-8 h-8" strokeWidth={2.5} />,
    "confirm-save": <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />,
    "confirm-permission": <Lock className="w-8 h-8" strokeWidth={2.5} />,
    "confirm-destructive": (
      <AlertOctagon className="w-8 h-8" strokeWidth={2.5} />
    ),

    // Error icons
    "error-401": <Lock className="w-16 h-16" strokeWidth={1.5} />,
    "error-403": <ShieldAlert className="w-16 h-16" strokeWidth={1.5} />,
    "error-404": <FileX className="w-16 h-16" strokeWidth={1.5} />,
    "error-500": <AlertOctagon className="w-16 h-16" strokeWidth={1.5} />,
    "error-network": <WifiOff className="w-16 h-16" strokeWidth={1.5} />,
    "error-unknown": <AlertCircle className="w-16 h-16" strokeWidth={1.5} />,

    // Empty icons
    "empty-no-data": <Inbox className="w-16 h-16" strokeWidth={1.5} />,
    "empty-no-results": <Search className="w-16 h-16" strokeWidth={1.5} />,
    "empty-no-notifications": <Inbox className="w-16 h-16" strokeWidth={1.5} />,
    "empty-first-time": <Info className="w-16 h-16" strokeWidth={1.5} />,

    // System icons
    "system-offline": <WifiOff className="w-16 h-16" strokeWidth={1.5} />,
    "system-maintenance": (
      <Construction className="w-16 h-16" strokeWidth={1.5} />
    ),
    "system-disabled": <Ban className="w-16 h-16" strokeWidth={1.5} />,
    "system-readonly": <Eye className="w-16 h-16" strokeWidth={1.5} />,
    "system-suspended": <UserX className="w-16 h-16" strokeWidth={1.5} />,

    // Success icons
    "success-form": <CheckCircle2 className="w-16 h-16" strokeWidth={2} />,
    "success-payment": <CheckCircle2 className="w-16 h-16" strokeWidth={2} />,
    "success-setup": <CheckCircle2 className="w-16 h-16" strokeWidth={2} />,
    "success-action": <CheckCircle2 className="w-16 h-16" strokeWidth={2} />,
  };

  const key = `${mode}-${type}`;
  return iconMap[key] || <AlertCircle className="w-8 h-8" strokeWidth={2.5} />;
};

// =====================================================
// COLOR SCHEMES
// =====================================================

const getColorScheme = (mode: SystemUIMode, type?: string) => {
  const colorMap: Record<
    string,
    {
      bg: string;
      border: string;
      icon: string;
      iconBg: string;
      text: string;
      gradient: string;
    }
  > = {
    "alert-success": {
      bg: "from-green-500/10 via-green-400/10 to-green-500/10",
      border: "border-green-500/30",
      icon: "text-white",
      iconBg: "from-green-500 to-green-600",
      text: "text-green-300",
      gradient: "from-green-500 via-green-400 to-green-500",
    },
    "alert-error": {
      bg: "from-red-500/10 via-red-400/10 to-red-500/10",
      border: "border-red-500/30",
      icon: "text-white",
      iconBg: "from-red-500 to-red-600",
      text: "text-red-300",
      gradient: "from-red-500 via-red-400 to-red-500",
    },
    "alert-warning": {
      bg: "from-yellow-500/10 via-yellow-400/10 to-yellow-500/10",
      border: "border-yellow-500/30",
      icon: "text-white",
      iconBg: "from-yellow-500 to-orange-600",
      text: "text-yellow-300",
      gradient: "from-yellow-500 via-yellow-400 to-yellow-500",
    },
    "alert-info": {
      bg: "from-blue-500/10 via-blue-400/10 to-blue-500/10",
      border: "border-blue-500/30",
      icon: "text-white",
      iconBg: "from-blue-500 to-blue-600",
      text: "text-blue-300",
      gradient: "from-blue-500 via-blue-400 to-blue-500",
    },
    "alert-critical": {
      bg: "from-red-600/10 via-red-500/10 to-red-600/10",
      border: "border-red-600/50",
      icon: "text-white",
      iconBg: "from-red-600 to-red-700",
      text: "text-red-200",
      gradient: "from-red-600 via-red-500 to-red-600",
    },
    "confirm-delete": {
      bg: "from-black-deep/95 via-black-charcoal/95 to-black-deep/95",
      border: "border-gold/30",
      icon: "text-white",
      iconBg: "from-yellow-500 to-orange-500",
      text: "text-gold",
      gradient: "from-gold via-gold-light to-gold",
    },
  };

  const key = `${mode}-${type}`;
  return (
    colorMap[key] || {
      bg: "from-black-deep/95 via-black-charcoal/95 to-black-deep/95",
      border: "border-gold/30",
      icon: "text-white",
      iconBg: "from-gold to-gold-light",
      text: "text-gold",
      gradient: "from-gold via-gold-light to-gold",
    }
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function SystemUI({
  mode,
  type,
  title,
  message,
  icon,
  actions = [],
  onClose,
  inputs = [],
  progress,
  logo = true,
  backdrop = true,
  theme = "dark",
  size = "md",
  variant = "guild",
  autoDismiss,
}: SystemUIProps) {
  // Auto-dismiss timer
  useEffect(() => {
    if (autoDismiss && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const colors = getColorScheme(mode, type);
  const defaultIcon = icon || getIconForType(mode, type);

  // Size mapping
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-full",
  };

  // =====================================================
  // LOADING MODE
  // =====================================================
  if (mode === "loading") {
    const isInline = type === "inline" || type === "button";

    if (isInline) {
      return (
        <div className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-gold" />
          {title && <span className="text-sm text-gray-300">{title}</span>}
        </div>
      );
    }

    return (
      <div className="min-h-[400px] bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal flex items-center justify-center rounded-xl relative overflow-hidden">
        {/* Guild-style background pattern */}
        {variant === "guild" && (
          <>
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-light rounded-full blur-3xl" />
            </div>
          </>
        )}

        <div className="text-center relative z-10">
          {variant === "guild" ? (
            // Guild-themed loading
            <div className="relative w-48 h-48 mx-auto mb-8">
              {/* Outer hexagonal ring */}
              <div className="absolute inset-0">
                <svg
                  className="w-full h-full animate-spin"
                  style={{ animationDuration: "3s" }}
                  viewBox="0 0 100 100"
                >
                  <polygon
                    points="50,5 85,25 85,65 50,85 15,65 15,25"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="2"
                    className="opacity-60"
                  />
                  <defs>
                    <linearGradient
                      id="goldGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#F4E5B0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Inner rotating ring */}
              <div className="absolute inset-6 rounded-full border-4 border-transparent border-t-gold border-r-gold-light animate-spin" />

              {/* Guild logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {typeof logo === "string" ? (
                    <img
                      src={logo}
                      alt="Guild Logo"
                      className="w-28 h-28 object-contain animate-pulse drop-shadow-2xl"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center backdrop-blur-sm border-2 border-gold/50 animate-pulse">
                      <Gamepad2 className="w-16 h-16 text-gold" />
                    </div>
                  )}
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
                </div>
              </div>

              {/* Orbiting particles */}
              <div className="absolute inset-0">
                {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-2 h-2"
                    style={{
                      animation: `orbit 4s linear infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    <div className="w-2 h-2 bg-gold rounded-full shadow-lg shadow-gold/50" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Default loading
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold animate-spin" />
              <div className="absolute inset-3 rounded-full border-2 border-gold/30 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                {typeof logo === "string" ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-24 h-24 object-contain animate-pulse"
                  />
                ) : logo ? (
                  <Gamepad2 className="w-24 h-24 text-gold animate-pulse" />
                ) : (
                  <Loader2 className="w-24 h-24 text-gold animate-spin" />
                )}
              </div>
              <div
                className="absolute inset-6 rounded-full border-2 border-transparent border-b-gold-light animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              />
            </div>
          )}

          <div className="space-y-3">
            <p className="text-gold text-xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              {title || "Loading..."}
            </p>
            {message && (
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                {message}
              </p>
            )}
            {progress !== undefined && (
              <div className="w-64 mx-auto">
                <div className="h-2 bg-black-deep rounded-full overflow-hidden border border-gold/20">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gold text-xs mt-2">{progress}%</p>
              </div>
            )}
            <div className="flex justify-center gap-1">
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STATUS MODE (Small inline indicators)
  // =====================================================
  if (mode === "status") {
    if (type === "spinner") {
      return <Loader2 className="w-5 h-5 animate-spin text-gold" />;
    }
    if (type === "progress" && progress !== undefined) {
      return (
        <div className="w-full h-1 bg-black-deep rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      );
    }
    return <Loader2 className="w-5 h-5 animate-spin text-gold" />;
  }

  // =====================================================
  // NOTIFICATION MODE (Toast/Snackbar)
  // =====================================================
  if (mode === "notification") {
    return (
      <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
        <div
          className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-sm bg-gradient-to-br ${colors.bg} ${colors.border} max-w-md`}
        >
          <div
            className={`absolute inset-0 opacity-20 bg-gradient-to-r ${colors.bg}`}
          />
          <div
            className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${colors.gradient}`}
          />

          <div className="relative p-4 pl-6">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <div
                  className={`absolute inset-0 rounded-full animate-ping opacity-20 bg-gradient-to-br ${colors.iconBg}`}
                />
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br ${colors.iconBg}`}
                >
                  {defaultIcon}
                </div>
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                {title && (
                  <h4 className={`text-base font-bold mb-1 ${colors.text}`}>
                    {title}
                  </h4>
                )}
                {message && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {message}
                  </p>
                )}
              </div>

              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 transition-all"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div
            className={`h-1 animate-pulse bg-gradient-to-r ${colors.gradient}`}
          />
        </div>
      </div>
    );
  }

  // =====================================================
  // MODAL-BASED MODES (Alert, Confirm, Error, Empty, System, Success, Prompt)
  // =====================================================
  const isModal =
    mode === "alert" ||
    mode === "confirm" ||
    mode === "error" ||
    mode === "empty" ||
    mode === "system" ||
    mode === "success" ||
    mode === "prompt";

  if (!isModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      {backdrop && (
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div
        className={`relative w-full ${sizeClasses[size]} ${
          variant === "guild"
            ? "bg-gradient-to-br from-black-deep via-black-charcoal to-black-deep"
            : `bg-gradient-to-br ${colors.bg}`
        } border-2 ${
          colors.border
        } rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300`}
        role="dialog"
        aria-modal="true"
      >
        {/* Guild-style decorative elements */}
        {variant === "guild" && (
          <>
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-gold/30 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-gold/30 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-gold/30 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-gold/30 rounded-br-2xl" />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-gold/5 pointer-events-none" />
          </>
        )}

        {/* Glowing top edge */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            variant === "guild"
              ? "bg-gradient-to-r from-transparent via-gold to-transparent"
              : `bg-gradient-to-r ${colors.gradient}`
          }`}
        />

        <div className="p-6 relative z-10">
          {/* Icon with Guild logo option */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {variant === "guild" && typeof logo === "string" ? (
                <>
                  {/* Guild logo display */}
                  <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-black-charcoal to-black-deep border-2 border-gold/50 flex items-center justify-center overflow-hidden">
                    <img
                      src={logo}
                      alt="Guild Logo"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  {/* Rotating ring around logo */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </>
              ) : (
                <>
                  <div
                    className={`absolute inset-0 rounded-full animate-ping opacity-20 bg-gradient-to-br ${colors.iconBg}`}
                  />
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br ${colors.iconBg}`}
                  >
                    {defaultIcon}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          {title && (
            <h3
              className={`text-2xl font-bold text-center mb-3 ${
                variant === "guild"
                  ? "bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent"
                  : `bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`
              }`}
            >
              {title}
            </h3>
          )}

          {/* Message */}
          {message && (
            <p className="text-gray-300 text-center leading-relaxed mb-6">
              {message}
            </p>
          )}

          {/* Inputs (for prompts) */}
          {inputs.length > 0 && (
            <div className="space-y-3 mb-6">
              {inputs.map((input, index) => (
                <input
                  key={index}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={(e) => input.onChange?.(e.target.value)}
                  className="w-full px-4 py-3 bg-black-deep border border-steel rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              ))}
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div
              className={`flex gap-3 ${
                actions.length === 1 ? "justify-center" : ""
              }`}
            >
              {actions.map((action, index) => {
                const isSecondary = action.variant === "secondary";
                const isDanger = action.variant === "danger";

                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    disabled={action.loading}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 ${
                      isSecondary
                        ? "bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600 text-gray-300"
                        : isDanger
                        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-600/50"
                        : "bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold border border-gold text-black-deep shadow-lg hover:shadow-gold/50"
                    }`}
                  >
                    {action.loading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom accent */}
        <div
          className={`h-1.5 animate-pulse bg-gradient-to-r ${colors.gradient}`}
        />
      </div>
    </div>
  );
}
