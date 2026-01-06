"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useSystemUI } from "@/lib/contexts/SystemUIContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Shield, Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function RulesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const systemUI = useSystemUI();
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    rules: [""],
    active: true,
  });

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

  useEffect(() => {
    if (permissionChecked && user?.permissions?.can_manage_applications) {
      loadRules();
      loadCategories();
    }
  }, [permissionChecked, user]);

  const loadCategories = async () => {
    try {
      const response = await api.get("/rules/categories/channels");
      setCategories(response.data.channels || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadRules = async () => {
    try {
      const response = await api.get("/rules");
      setRules(response.data.rules || []);
    } catch (error) {
      console.error("Failed to load rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredRules = formData.rules.filter((r) => r.trim() !== "");
    if (filteredRules.length === 0) {
      systemUI.showAlert({
        type: "error",
        message: "Please add at least one rule",
      });
      return;
    }

    try {
      const submitData = {
        title: formData.title,
        category: formData.category,
        rule_content: filteredRules.join("\n"),
        active: formData.active,
      };

      if (editingRule) {
        await api.put(`/rules/${editingRule._id}`, submitData);
      } else {
        await api.post("/rules", submitData);
      }
      setShowForm(false);
      setEditingRule(null);
      setFormData({
        title: "",
        category: "",
        rules: [""],
        active: true,
      });
      loadRules();
      systemUI.showAlert({
        type: "success",
        title: editingRule ? "Rule Updated!" : "Rule Created!",
        message: "The rule section has been saved successfully.",
        autoDismiss: 5000,
      });
    } catch (error: any) {
      systemUI.showAlert({
        type: "error",
        message: error.response?.data?.detail || "Failed to save rule",
      });
    }
  };

  const handleDelete = async (id: string) => {
    systemUI.showConfirm({
      type: "delete",
      title: "Delete Rule Section",
      message: "Are you sure you want to delete this rule section?",
      onConfirm: async () => {
        try {
          await api.delete(`/rules/${id}`);
          loadRules();
          systemUI.showNotification({
            type: "toast",
            title: "Rule Deleted",
            message: "The rule section has been deleted successfully.",
            autoDismiss: 5000,
          });
        } catch (error: any) {
          systemUI.showAlert({
            type: "error",
            message: error.response?.data?.detail || "Failed to delete rule",
          });
        }
      },
    });
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    const rulesArray = rule.rule_content
      .split("\n")
      .filter((r: string) => r.trim() !== "");
    setFormData({
      title: rule.title,
      category: rule.category || "",
      rules: rulesArray.length > 0 ? rulesArray : [""],
      active: rule.active,
    });
    setShowForm(true);
  };

  const addRuleField = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, ""],
    });
  };

  const removeRuleField = (index: number) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      rules: newRules.length > 0 ? newRules : [""],
    });
  };

  const updateRuleField = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({
      ...formData,
      rules: newRules,
    });
  };

  if (isLoading || !user || !permissionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen
          message="Loading Rules Management..."
          fullScreen={false}
        />
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
            You don't have permission to access Rules Management
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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 backdrop-blur-sm bg-black-charcoal/50 rounded-2xl p-4 sm:p-6 border border-gold/20 shadow-lg shadow-gold/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gold-light mb-1">
                Rules Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Create and manage community rules
              </p>
            </div>
            <button
              onClick={() => router.push("/manager")}
              className="px-4 py-2 bg-steel/50 text-gold-light border border-gold/30 rounded-lg hover:bg-steel/70 transition-all text-sm"
            >
              ← Back to Manager
            </button>
          </div>
        </div>

        <div className="bg-black-charcoal/50 backdrop-blur-sm border border-steel/50 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <h2 className="text-xl font-bold text-gold-light">Rules</h2>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingRule(null);
                setFormData({
                  title: "",
                  category: "",
                  rules: [""],
                  active: true,
                });
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-gold text-black font-bold rounded-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-gold/20 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add Rule Section</span>
            </button>
          </div>

          {showForm && (
            <div className="bg-black-deep/80 backdrop-blur-sm border border-gold/30 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl">
              <h3 className="text-lg sm:text-xl font-bold text-gold-light mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {editingRule ? "Edit Rule Section" : "Add New Rule Section"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title*
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., General Rules"
                      className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category (Discord Channel)
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                    >
                      <option value="">Select category...</option>
                      {categories.map((channel: any) => (
                        <option key={channel.id} value={channel.id}>
                          {channel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      Rules*
                    </label>
                    <button
                      type="button"
                      onClick={addRuleField}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      <Plus className="w-3 h-3" />
                      Add Rule
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.rules.map((rule, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) =>
                            updateRuleField(index, e.target.value)
                          }
                          placeholder={`Rule ${index + 1}`}
                          className="flex-1 px-4 py-2 bg-black-charcoal border border-steel rounded-lg text-white"
                        />
                        {formData.rules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRuleField(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-400">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    Active
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-gold text-black font-bold rounded-lg hover:opacity-90 w-full sm:w-auto"
                  >
                    <Save className="w-5 h-5" />
                    {editingRule ? "Update Rule" : "Create Rule"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 w-full sm:w-auto text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading rules...</div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => {
                const rulesList = rule.rule_content
                  .split("\n")
                  .filter((r: string) => r.trim() !== "");
                return (
                  <div
                    key={rule._id}
                    className="bg-black-deep border border-steel rounded-lg p-4 sm:p-6 hover:border-gold-light/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gold-light mb-1">
                          {rule.title}
                        </h3>
                        {rule.category && (
                          <p className="text-sm text-gray-400">
                            Category: {rule.category}
                          </p>
                        )}
                        <span
                          className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                            rule.active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {rule.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(rule)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      {rulesList.map((r: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm sm:text-base"
                        >
                          <span className="text-gold font-bold">
                            {idx + 1}.
                          </span>
                          <p className="text-gray-300">{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {rules.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No rules added yet. Create your first rule section to get
                  started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
