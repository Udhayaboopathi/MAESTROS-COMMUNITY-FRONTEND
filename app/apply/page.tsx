"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { CheckCircle, ArrowRight, ArrowLeft, FileText } from "lucide-react";
import { title } from "process";

const steps = [
  {
    title: "Personal Information",
    fields: [
      {
        name: "in_game_name",
        label: "In-Game Name",
        type: "text",
        required: true,
      },
      {
        name: "date_of_birth",
        label: "Date of Birth",
        type: "date",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: false,
        placeholder: "+1234567890",
      },
      { name: "country", label: "Country", type: "text", required: true },
    ],
  },
  {
    title: "Gaming Experience",
    fields: [
      {
        name: "primary_game",
        label: "Primary Game",
        type: "text",
        required: true,
      },
      {
        name: "gameplay_hours",
        label: "Total Gameplay Hours",
        type: "number",
        required: true,
      },
    ],
  },
  {
    title: "Why Maestros?",
    fields: [
      {
        name: "reason",
        label: "Why do you want to join Maestros?",
        type: "textarea",
        required: true,
      },
      {
        name: "availability",
        label: "How many hours per week can you participate?",
        type: "number",
        required: true,
      },
    ],
  },

  {
    title: "Social Media Links",
    fields: [
      {
        name: "Instagram",
        label: "Instagram link",
        type: "text",
        required: false,
        placeholder: "https://instagram.com/yourprofile",
      },
      {
        name: "YouTube",
        label: "YouTube Channel",
        type: "text",
        required: false,
        placeholder: "https://youtube.com/yourchannel",
      },
    ],
  },
];

export default function ApplyPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState<any>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  useEffect(() => {
    if (user) {
      checkEligibility();
    }
  }, [user]);

  const checkEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const response = await api.post("/application-manager/check-eligibility");
      setEligibility(response.data);
    } catch (error: any) {
      console.error("Eligibility check failed:", error);
      toast.error("Failed to check eligibility");
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    // Simple client-side check only - all validation happens server-side
    const currentFields = steps[currentStep].fields;
    const missingFields = currentFields.filter(
      (field) =>
        field.required && !formData[field.name as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields`);
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit an application");
      return;
    }

    setLoading(true);
    try {
      // Use new Discord-integrated endpoint
      const response = await api.post(
        "/application-manager/submit-with-discord",
        formData
      );

      const { success, assigned_manager, dm_sent, score } = response.data;

      if (success) {
        toast.success("Application submitted successfully!");

        if (score) {
          toast.success(`Application Score: ${score.toFixed(1)}/100`, {
            duration: 5000,
          });
        }

        if (assigned_manager) {
          toast.success(`Assigned to: ${assigned_manager}`, { duration: 5000 });
        }

        if (!dm_sent) {
          toast.error(
            "Could not send DM. Please check your Discord privacy settings.",
            { duration: 7000 }
          );
        }

        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Application submission error:", error.response?.data);
      const detail = error.response?.data?.detail;

      if (typeof detail === "object" && detail.reason) {
        // Eligibility error
        toast.error(detail.message || "Application cannot be submitted");
      } else if (typeof detail === "string") {
        toast.error(detail);
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gold text-center max-w-md"
        >
          <h2 className="text-2xl font-bold text-gold mb-4">Login Required</h2>
          <p className="text-gray-300 mb-6">
            You need to be logged in to submit an application.
          </p>
          <button onClick={login} className="btn-gold">
            Login with Discord
          </button>
        </motion.div>
      </div>
    );
  }

  if (checkingEligibility) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gold text-center max-w-md"
        >
          <div className="spinner mb-4"></div>
          <p className="text-gray-300">Checking eligibility...</p>
        </motion.div>
      </div>
    );
  }

  if (eligibility && !eligibility.eligible) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gold text-center max-w-md"
        >
          <h2 className="text-2xl font-bold text-gold mb-4">
            {eligibility.reason === "ALREADY_MEMBER"
              ? "Already a Member"
              : eligibility.reason === "PENDING"
              ? "Application Pending"
              : eligibility.reason === "COOLDOWN"
              ? "Cooldown Active"
              : "Cannot Apply"}
          </h2>
          <p className="text-gray-300 mb-6">{eligibility.message}</p>

          {eligibility.days_remaining && (
            <p className="text-gray-400 mb-4">
              Days remaining: {eligibility.days_remaining}
            </p>
          )}

          <button
            onClick={() => router.push("/dashboard")}
            className="btn-gold"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6"
          >
            <FileText className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-semibold">
              Membership Application
            </span>
          </motion.div>

          <h1 className="text-5xl font-bold text-gold mb-4">
            Apply to Maestros
          </h1>
          <p className="text-gray-300">
            Join our elite gaming community. Fill out the application form
            below.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${
                        index <= currentStep
                          ? "bg-gradient-gold text-black"
                          : "bg-steel text-gray-500"
                      }
                    `}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-2
                        ${index < currentStep ? "bg-gold" : "bg-steel"}
                      `}
                    />
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-2 text-center">
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card-gold"
        >
          <h2 className="text-2xl font-bold text-gold mb-6">
            {steps[currentStep].title}
          </h2>

          <div className="space-y-6">
            {steps[currentStep].fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name as keyof typeof formData] || ""}
                    onChange={handleChange}
                    required={field.required}
                    rows={4}
                    className="input w-full"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData] || ""}
                    onChange={handleChange}
                    required={field.required}
                    className="input w-full"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="btn-gold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : currentStep === steps.length - 1 ? (
                "Submit Application"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-black-charcoal border-2 border-gold rounded-lg p-8 text-center max-w-md">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold animate-spin" />
                <div className="absolute inset-3 rounded-full border-2 border-gold/30 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gold animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gold mb-2">
                Submitting Application
              </h3>
              <p className="text-gray-400 mb-4">
                Processing your application and notifying managers...
              </p>
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
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Applications are reviewed within 24-48 hours.</p>
          <p>
            Your application will be scored by our AI system and reviewed by our
            team.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
