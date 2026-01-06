import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Maestros Community - Premium Gaming Community",
  description:
    "Join the elite Maestros gaming community. Experience top-tier gameplay, events, and exclusive benefits.",
  keywords: ["gaming", "community", "esports", "maestros", "discord"],
  authors: [{ name: "Maestros Community" }],
  openGraph: {
    title: "Maestros Community",
    description: "Elite Gaming Community",
    url: "https://maestros.gg",
    siteName: "Maestros",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maestros Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maestros Community",
    description: "Elite Gaming Community",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} font-serif antialiased`}
      >
        <Providers>
          <Navbar />
          <div className="flex min-h-screen bg-black-deep pt-16 relative">
            {/* Animated Background */}
            <div
              className="fixed inset-0 pointer-events-none overflow-hidden"
              style={{ zIndex: 1 }}
            >
              {/* Gradient Orbs */}
              <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gold-light/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-3/4 left-1/3 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
              />

              {/* Animated Grid */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="w-full h-full animate-grid-flow"
                  style={{
                    backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                  }}
                />
              </div>

              {/* Logo Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                <img
                  src="/logo.png"
                  alt="Maestros Logo"
                  className="w-[800px] h-[800px] object-contain animate-pulse"
                  style={{ animationDuration: "8s" }}
                />
              </div>
            </div>

            <Sidebar />
            <main className="flex-1 lg:ml-[180px] relative z-10">
              {children}
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "bg-black-charcoal text-white border border-gold",
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
