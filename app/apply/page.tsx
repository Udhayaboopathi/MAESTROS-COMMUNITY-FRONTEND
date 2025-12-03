"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

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
      { name: "age", label: "Age", type: "number", required: true },
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
      {
        name: "rank",
        label: "Current Rank/Level",
        type: "text",
        required: true,
      },
      {
        name: "experience",
        label: "Gaming Experience (describe your skills)",
        type: "textarea",
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
        name: "contribution",
        label: "What can you contribute to the community?",
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
];

export default function ApplyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

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
      // All validation and logic happens server-side
      const response = await api.post("/applications/submit", formData);

      const { score, xp_awarded, level_up, new_level, ai_analysis } =
        response.data;

      toast.success("Application submitted successfully!");

      // Display server-calculated results
      if (score) {
        toast.success(
          `Application Score: ${score.toFixed(1)}/100 | +${xp_awarded} XP`,
          { duration: 5000 }
        );
      }

      if (level_up) {
        toast.success(`🎉 Level Up! You are now Level ${new_level}!`, {
          duration: 6000,
        });
      }

      router.push("/profile");
    } catch (error: any) {
      const detail = error.response?.data?.detail;

      // Handle validation errors from server
      if (detail?.errors) {
        const firstError = Object.values(detail.errors)[0];
        toast.error(firstError as string);
      } else if (typeof detail === "string") {
        toast.error(detail);
      } else {
        toast.error("Failed to submit application");
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
          <button onClick={() => router.push("/")} className="btn-gold">
            Go to Home
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
              disabled={currentStep === 0}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="btn-gold"
            >
              {loading ? (
                <div className="spinner" />
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
