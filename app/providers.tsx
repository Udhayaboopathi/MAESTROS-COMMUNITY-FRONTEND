"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { SystemUIProvider } from "@/lib/contexts/SystemUIContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <SystemUIProvider>{children}</SystemUIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
