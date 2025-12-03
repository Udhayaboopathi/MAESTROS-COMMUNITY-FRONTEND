import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Navbar />
          <div className="flex min-h-screen bg-black-deep pt-16">
            <Sidebar />
            <main className="flex-1 lg:ml-64">{children}</main>
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
