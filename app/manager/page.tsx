"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import { FileText, Gamepad2, Shield, Megaphone } from "lucide-react";

export default function ManagerHub() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
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

  if (isLoading || !user || !permissionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen message="Loading Manager Hub..." fullScreen={false} />
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
            You don't have permission to access the Manager Hub
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

  const sections = [
    {
      id: "applications",
      title: "Applications",
      description: "Review and manage member applications",
      icon: FileText,
      color: "from-blue-600 to-blue-800",
      href: "/manager/applications",
    },
    {
      id: "games",
      title: "Games",
      description: "Add and manage community games",
      icon: Gamepad2,
      color: "from-purple-600 to-purple-800",
      href: "/manager/games",
    },
    {
      id: "rules",
      title: "Rules",
      description: "Create and manage community rules",
      icon: Shield,
      color: "from-green-600 to-green-800",
      href: "/manager/rules",
    },
    {
      id: "announcements",
      title: "Announcements",
      description: "Send announcements to Discord",
      icon: Megaphone,
      color: "from-gold to-gold-light",
      href: "/manager/announcements",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black-deep to-black-charcoal">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8 backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-6 sm:p-8 border border-gold/20 shadow-lg shadow-gold/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gold-light mb-2">
                Manager Hub
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Manage all aspects of the community
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-gold/10 border border-gold/30 rounded-lg">
              <Shield className="w-5 h-5 text-gold" />
              <span className="text-sm font-bold text-gold-light">Manager</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => router.push(section.href)}
              className="group bg-black-charcoal/50 backdrop-blur-sm border border-steel/50 rounded-2xl p-6 sm:p-8 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 text-left"
            >
              <div
                className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${section.color} mb-4 group-hover:scale-110 transition-transform`}
              >
                <section.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gold-light mb-2 group-hover:text-gold transition-colors">
                {section.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                {section.description}
              </p>
              <div className="mt-4 flex items-center text-gold text-sm font-medium">
                <span>Manage {section.title}</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
