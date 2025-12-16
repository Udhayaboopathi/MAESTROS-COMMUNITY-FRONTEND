"use client";

import { createContext, useContext, useState, useCallback } from "react";
import SystemUI, {
  SystemUIMode,
  SystemUIAction,
  SystemUIInput,
} from "@/components/ui/SystemUI";

// =====================================================
// CONTEXT TYPES
// =====================================================

interface SystemUIState {
  isOpen: boolean;
  mode?: SystemUIMode;
  type?:
    | "input"
    | "button"
    | "form"
    | "progress"
    | "section"
    | "error"
    | "exit"
    | "page"
    | "inline"
    | "success"
    | "disabled"
    | "password"
    | "system"
    | "app"
    | "api"
    | "warning"
    | "info"
    | "critical"
    | "delete"
    | "save"
    | "permission"
    | "destructive"
    | "401"
    | "403"
    | "404"
    | "500"
    | "network"
    | "unknown"
    | "no-data"
    | "no-results"
    | "no-notifications"
    | "first-time"
    | "payment"
    | "setup"
    | "action"
    | "toast"
    | "snackbar"
    | "inapp"
    | "otp";
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actions?: SystemUIAction[];
  inputs?: SystemUIInput[];
  progress?: number;
  logo?: boolean | string;
  backdrop?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "guild" | "minimal";
  autoDismiss?: number;
}

interface SystemUIContextType {
  // Show methods
  showLoading: (params: {
    type?: string;
    title?: string;
    message?: string;
    progress?: number;
    logo?: boolean | string;
    variant?: "default" | "guild" | "minimal";
  }) => void;

  showAlert: (params: {
    type: "success" | "error" | "warning" | "info" | "critical";
    title?: string;
    message: string;
    autoDismiss?: number;
  }) => void;

  showConfirm: (params: {
    type?: "delete" | "exit" | "save" | "permission" | "destructive";
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => void;

  showError: (params: {
    type?: "401" | "403" | "404" | "500" | "network" | "unknown";
    title?: string;
    message?: string;
    onRetry?: () => void;
  }) => void;

  showEmpty: (params: {
    type?: "no-data" | "no-results" | "no-notifications" | "first-time";
    title: string;
    message?: string;
    action?: SystemUIAction;
  }) => void;

  showSuccess: (params: {
    type?: "form" | "payment" | "setup" | "action";
    title: string;
    message?: string;
    onContinue?: () => void;
    autoDismiss?: number;
  }) => void;

  showNotification: (params: {
    type?: "toast" | "snackbar" | "inapp" | "system";
    title?: string;
    message: string;
    autoDismiss?: number;
  }) => void;

  showPrompt: (params: {
    type?: "input" | "password" | "otp" | "info";
    title: string;
    message?: string;
    inputs: SystemUIInput[];
    onSubmit: () => void;
    onCancel?: () => void;
  }) => void;

  // Control methods
  hide: () => void;
  updateProgress: (progress: number) => void;
}

// =====================================================
// CONTEXT
// =====================================================

const SystemUIContext = createContext<SystemUIContextType | undefined>(
  undefined
);

export const useSystemUI = () => {
  const context = useContext(SystemUIContext);
  if (!context) {
    throw new Error("useSystemUI must be used within SystemUIProvider");
  }
  return context;
};

// =====================================================
// PROVIDER
// =====================================================

export function SystemUIProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemUIState>({
    isOpen: false,
  });

  const hide = useCallback(() => {
    setState({ isOpen: false });
  }, []);

  const showLoading = useCallback(
    ({
      type = "page",
      title,
      message,
      progress,
      logo = "/logo.png",
      variant = "guild",
    }: any) => {
      setState({
        isOpen: true,
        mode: "loading",
        type,
        title,
        message,
        progress,
        logo,
        backdrop: false,
        variant,
      });
    },
    []
  );

  const showAlert = useCallback(
    ({ type, title, message, autoDismiss }: any) => {
      setState({
        isOpen: true,
        mode: "alert",
        type,
        title,
        message,
        actions: [{ label: "OK", onClick: hide, variant: "primary" }],
        autoDismiss,
        backdrop: true,
        size: "md",
      });
    },
    [hide]
  );

  const showConfirm = useCallback(
    ({
      type = "delete",
      title,
      message,
      onConfirm,
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
    }: any) => {
      setState({
        isOpen: true,
        mode: "confirm",
        type,
        title,
        message,
        actions: [
          { label: cancelLabel, onClick: hide, variant: "secondary" },
          {
            label: confirmLabel,
            onClick: () => {
              onConfirm();
              hide();
            },
            variant:
              type === "delete" || type === "destructive"
                ? "danger"
                : "primary",
          },
        ],
        backdrop: true,
        size: "md",
      });
    },
    [hide]
  );

  const showError = useCallback(
    ({ type = "unknown", title, message, onRetry }: any) => {
      const errorTitles: Record<string, string> = {
        "401": "Unauthorized",
        "403": "Access Denied",
        "404": "Not Found",
        "500": "Server Error",
        network: "Network Error",
        unknown: "Something Went Wrong",
      };

      const errorMessages: Record<string, string> = {
        "401": "You need to log in to access this resource.",
        "403": "You don't have permission to access this resource.",
        "404": "The page or resource you're looking for doesn't exist.",
        "500": "Our server encountered an error. Please try again later.",
        network: "Unable to connect. Please check your internet connection.",
        unknown: "An unexpected error occurred. Please try again.",
      };

      const actions: SystemUIAction[] = [
        { label: "Close", onClick: hide, variant: "secondary" },
      ];

      if (onRetry) {
        actions.push({
          label: "Retry",
          onClick: () => {
            onRetry();
            hide();
          },
          variant: "primary",
        });
      }

      setState({
        isOpen: true,
        mode: "error",
        type,
        title: title || errorTitles[type],
        message: message || errorMessages[type],
        actions,
        backdrop: true,
        size: "md",
      });
    },
    [hide]
  );

  const showEmpty = useCallback(
    ({ type = "no-data", title, message, action }: any) => {
      const actions: SystemUIAction[] = [];
      if (action) {
        actions.push(action);
      } else {
        actions.push({ label: "Close", onClick: hide, variant: "secondary" });
      }

      setState({
        isOpen: true,
        mode: "empty",
        type,
        title,
        message,
        actions,
        backdrop: true,
        size: "md",
      });
    },
    [hide]
  );

  const showSuccess = useCallback(
    ({
      type = "action",
      title,
      message,
      onContinue,
      autoDismiss = 5000,
    }: any) => {
      setState({
        isOpen: true,
        mode: "success",
        type,
        title,
        message,
        actions: [
          {
            label: "Continue",
            onClick: () => {
              if (onContinue) onContinue();
              hide();
            },
            variant: "primary",
          },
        ],
        autoDismiss,
        backdrop: true,
        size: "md",
      });
    },
    [hide]
  );

  const showNotification = useCallback(
    ({ type = "toast", title, message, autoDismiss = 5000 }: any) => {
      setState({
        isOpen: true,
        mode: "notification",
        type,
        title,
        message,
        autoDismiss,
        backdrop: false,
      });
    },
    []
  );

  const showPrompt = useCallback(
    ({ type = "input", title, message, inputs, onSubmit, onCancel }: any) => {
      setState({
        isOpen: true,
        mode: "prompt",
        type,
        title,
        message,
        inputs,
        actions: [
          {
            label: "Cancel",
            onClick: () => {
              if (onCancel) onCancel();
              hide();
            },
            variant: "secondary",
          },
          {
            label: "Submit",
            onClick: () => {
              onSubmit();
              hide();
            },
            variant: "primary",
          },
        ],
        backdrop: true,
        size: "md",
      });
    },
    [hide]
  );

  const updateProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  return (
    <SystemUIContext.Provider
      value={{
        showLoading,
        showAlert,
        showConfirm,
        showError,
        showEmpty,
        showSuccess,
        showNotification,
        showPrompt,
        hide,
        updateProgress,
      }}
    >
      {children}
      {state.isOpen && (
        <SystemUI
          mode={state.mode!}
          type={state.type}
          title={state.title}
          message={state.message}
          icon={state.icon}
          actions={state.actions}
          onClose={hide}
          inputs={state.inputs}
          progress={state.progress}
          logo={state.logo}
          backdrop={state.backdrop}
          size={state.size}
          variant={state.variant}
          autoDismiss={state.autoDismiss}
        />
      )}
    </SystemUIContext.Provider>
  );
}
