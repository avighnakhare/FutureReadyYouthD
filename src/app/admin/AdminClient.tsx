"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { 
  Volunteer, 
  SystemMetric, 
  Content, 
  Program, 
  Faq, 
  Event, 
  EventRegistration, 
  Resource 
} from "@prisma/client";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  Download, 
  HelpCircle, 
  LogOut, 
  Key, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle,
  FileText,
  Lock,
  PlusCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  UserCheck
} from "lucide-react";
import VolunteerTable from "./VolunteerTable";
import "./Admin.css";

// Include registrations inside Event type for dashboard purposes
type EventWithReg = Event & {
  registration: EventRegistration[];
};

interface AdminClientProps {
  user: { username: string; mustChangePassword: boolean };
  initialMetrics: SystemMetric;
  initialContent: Content[];
  initialVolunteers: Volunteer[];
  initialEvents: EventWithReg[];
  initialResources: Resource[];
  initialFaqs: Faq[];
  initialPrograms: Program[];
}

export default function AdminClient({
  user,
  initialMetrics,
  initialContent,
  initialVolunteers,
  initialEvents,
  initialResources,
  initialFaqs,
  initialPrograms
}: AdminClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"metrics_content" | "programs" | "volunteers" | "events" | "resources" | "faqs">("metrics_content");
  
  // State for Password Change Gate
  const [mustChangePassword, setMustChangePassword] = useState(user.mustChangePassword);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  // Core CMS Data States
  const [metrics, setMetrics] = useState<SystemMetric>(initialMetrics);
  const [contentList, setContentList] = useState<Content[]>(initialContent);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [events, setEvents] = useState<EventWithReg[]>(initialEvents);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);

  // Forms / Modals States
  const [isSubmittingMetrics, setIsSubmittingMetrics] = useState(false);
  const [metricsSuccessMsg, setMetricsSuccessMsg] = useState("");

  const [isSubmittingContent, setIsSubmittingContent] = useState<string | null>(null);
  const [contentSuccessMsg, setContentSuccessMsg] = useState<string | null>(null);

  // Selected Program for Edit
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(initialPrograms[0] || null);
  const [isSubmittingProgram, setIsSubmittingProgram] = useState(false);
  const [programSuccessMsg, setProgramSuccessMsg] = useState("");

  // Dashboard Change Password Modal State
  const [changePwdModalOpen, setChangePwdModalOpen] = useState(false);
  const [dashboardNewPwd, setDashboardNewPwd] = useState("");
  const [dashboardConfirmPwd, setDashboardConfirmPwd] = useState("");
  const [dashboardPwdError, setDashboardPwdError] = useState("");
  const [dashboardPwdSuccess, setDashboardPwdSuccess] = useState("");
  const [isSubmittingDashboardPwd, setIsSubmittingDashboardPwd] = useState(false);

  // FAQ Modal / Form
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "General" });
  const [isSavingFaq, setIsSavingFaq] = useState(false);

  // Resource Modal / Form
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [resourceForm, setResourceForm] = useState({ title: "", category: "Technology", type: "Curriculum Syllabus Guide", description: "", content: "" });
  const [isSavingResource, setIsSavingResource] = useState(false);

  // Event Modal / Form
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventWithReg | null>(null);
  const [eventForm, setEventForm] = useState({ title: "", category: "Youth Workshop", date: "", time: "", location: "", description: "", host: "", capacity: 20 });
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // General Logout Action
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      alert("Error logging out.");
    }
  };

  // Enforced Password Reset Submission
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess(false);

    if (newPassword.trim().length < 6) {
      setPwdError("The new password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("New password confirmation does not match.");
      return;
    }

    setIsChangingPwd(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwdSuccess(true);
        setTimeout(() => {
          setMustChangePassword(false);
          router.refresh();
        }, 1500);
      } else {
        setPwdError(data.error || "Failed to update password.");
      }
    } catch {
      setPwdError("Network error. Please try again.");
    } finally {
      setIsChangingPwd(false);
    }
  };

  // Dashboard Password Reset Submission
  const handleDashboardPasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDashboardPwdError("");
    setDashboardPwdSuccess("");

    if (dashboardNewPwd.trim().length < 6) {
      setDashboardPwdError("Password must be at least 6 characters long.");
      return;
    }
    if (dashboardNewPwd !== dashboardConfirmPwd) {
      setDashboardPwdError("Passwords do not match.");
      return;
    }

    setIsSubmittingDashboardPwd(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: dashboardNewPwd })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardPwdSuccess("Password updated successfully!");
        setDashboardNewPwd("");
        setDashboardConfirmPwd("");
        setTimeout(() => {
          setChangePwdModalOpen(false);
          setDashboardPwdSuccess("");
        }, 1500);
      } else {
        setDashboardPwdError(data.error || "Failed to update password.");
      }
    } catch {
      setDashboardPwdError("Network error. Please try again.");
    } finally {
      setIsSubmittingDashboardPwd(false);
    }
  };

  // Update System Metrics
  const handleMetricsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMetrics(true);
    setMetricsSuccessMsg("");

    try {
      const res = await fetch("/api/admin/metrics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metrics)
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setMetricsSuccessMsg("Metrics updated successfully! Real values will render instantly on public boards.");
        setTimeout(() => setMetricsSuccessMsg(""), 3000);
      } else {
        alert(data.error || "Failed to save metrics.");
      }
    } catch {
      alert("Network error updating metrics.");
    } finally {
      setIsSubmittingMetrics(false);
    }
  };

  // Update CMS Site text blocks
  const handleContentSubmit = async (key: string, value: string) => {
    setIsSubmittingContent(key);
    setContentSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "site_content", key, value })
      });
      const data = await res.json();
      if (data.success) {
        setContentList(prev => 
          prev.map(c => c.key === key ? { ...c, value } : c)
        );
        setContentSuccessMsg(key);
        setTimeout(() => setContentSuccessMsg(null), 3000);
      } else {
        alert(data.error || "Failed to save content block.");
      }
    } catch {
      alert("Network error saving content block.");
    } finally {
      setIsSubmittingContent(null);
    }
  };

  // Helper to read current state values for content keys
  const getContentValue = (key: string) => {
    return contentList.find(c => c.key === key)?.value || "";
  };

  // Handle local state updates for CMS inputs
  const handleContentLocalChange = (key: string, val: string) => {
    setContentList(prev => {
      const exists = prev.some(c => c.key === key);
      if (exists) {
        return prev.map(c => c.key === key ? { ...c, value: val } : c);
      } else {
        return [...prev, { key, value: val }];
      }
    });
  };

  // Update Program Spec
  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    setIsSubmittingProgram(true);
    setProgramSuccessMsg("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "program",
          ...selectedProgram
        })
      });
      const data = await res.json();
      if (data.success) {
        setPrograms(prev => 
          prev.map(p => p.id === selectedProgram.id ? data.program : p)
        );
        setProgramSuccessMsg("Program syllabus updated successfully! Changes reflect on the public tabs.");
        setTimeout(() => setProgramSuccessMsg(""), 3000);
      } else {
        alert(data.error || "Failed to update program.");
      }
    } catch {
      alert("Network error updating program.");
    } finally {
      setIsSubmittingProgram(false);
    }
  };

  // FAQ CRUD Functions
  const openFaqModal = (faq: Faq | null = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category });
    } else {
      setEditingFaq(null);
      setFaqForm({ question: "", answer: "", category: "General" });
    }
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    setIsSavingFaq(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "faq_upsert",
          id: editingFaq?.id,
          ...faqForm
        })
      });
      const data = await res.json();
      if (data.success) {
        if (editingFaq) {
          setFaqs(prev => prev.map(f => f.id === editingFaq.id ? data.faq : f));
        } else {
          setFaqs(prev => [data.faq, ...prev]);
        }
        setFaqModalOpen(false);
      } else {
        alert(data.error || "Failed to save FAQ.");
      }
    } catch {
      alert("Network error saving FAQ.");
    } finally {
      setIsSavingFaq(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ entry permanently?")) return;

    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "faq_delete",
          id
        })
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(prev => prev.filter(f => f.id !== id));
      } else {
        alert(data.error || "Failed to delete FAQ.");
      }
    } catch {
      alert("Network error deleting FAQ.");
    }
  };

  // Resources CRUD Functions
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceForm.title.trim() || !resourceForm.description.trim() || !resourceForm.content.trim()) return;

    setIsSavingResource(true);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resourceForm)
      });
      const data = await res.json();
      if (data.success) {
        setResources(prev => [data.resource, ...prev]);
        setResourceModalOpen(false);
        setResourceForm({ title: "", category: "Technology", type: "Curriculum Syllabus Guide", description: "", content: "" });
      } else {
        alert(data.error || "Failed to create resource.");
      }
    } catch {
      alert("Network error creating resource.");
    } finally {
      setIsSavingResource(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this downloadable guide?")) return;

    try {
      const res = await fetch(`/api/admin/resources?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setResources(prev => prev.filter(r => r.id !== id));
      } else {
        alert(data.error || "Failed to delete resource.");
      }
    } catch {
      alert("Network error deleting resource.");
    }
  };

  // Events CRUD Functions
  const openEventModal = (event: EventWithReg | null = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        category: event.category,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        host: event.host,
        capacity: event.capacity
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: "",
        category: "Youth Workshop",
        date: "",
        time: "",
        location: "",
        description: "",
        host: "",
        capacity: 20
      });
    }
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.location.trim() || !eventForm.date.trim() || !eventForm.time.trim()) return;

    setIsSavingEvent(true);
    try {
      const method = editingEvent ? "PUT" : "POST";
      const bodyData = editingEvent ? { id: editingEvent.id, ...eventForm } : eventForm;

      const res = await fetch("/api/admin/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      if (data.success) {
        if (editingEvent) {
          // Keep existing registrations when mapping back
          const updatedEvent: EventWithReg = {
            ...data.event,
            registration: editingEvent.registration
          };
          setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updatedEvent : ev));
        } else {
          setEvents(prev => [{ ...data.event, registration: [] }, ...prev]);
        }
        setEventModalOpen(false);
      } else {
        alert(data.error || "Failed to save event schedule.");
      }
    } catch {
      alert("Network error saving event.");
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This will also remove all candidate registrations.")) return;

    try {
      const res = await fetch(`/api/admin/events?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.filter(ev => ev.id !== id));
      } else {
        alert(data.error || "Failed to delete event.");
      }
    } catch {
      alert("Network error deleting event.");
    }
  };


  // ----------------------------------------------------
  // FORCE PASSWORD CHANGE RENDER (OVERLAY LOCK)
  // ----------------------------------------------------
  if (mustChangePassword) {
    return (
      <div className="admin-login-page">
        <div className="login-card-container" style={{ maxWidth: "520px" }}>
          <div className="login-glass-card">
            <div className="login-header-group">
              <div className="login-logo-placeholder" style={{ background: "linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)" }}>
                <Key size={28} />
              </div>
              <h2>Enforced Password Reset</h2>
              <p>For high-security compliance, you must change your temporary administrative password before entering the CMS dashboard panel.</p>
            </div>

            {pwdError && (
              <div className="login-alert-box animate-fade-in">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{pwdError}</span>
              </div>
            )}

            {pwdSuccess && (
              <div className="login-alert-box animate-fade-in" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#A7F3D0" }}>
                <Check size={18} style={{ flexShrink: 0 }} />
                <span>Credentials updated! Unlocking dashboard...</span>
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="login-form-group">
              <div className="login-field">
                <label htmlFor="newpwd">New Master Password *</label>
                <div className="login-input-wrapper">
                  <Lock size={16} className="login-input-icon" />
                  <input 
                    type="password" 
                    id="newpwd"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 secure characters..."
                    disabled={isChangingPwd || pwdSuccess}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="confpwd">Confirm New Password *</label>
                <div className="login-input-wrapper">
                  <Lock size={16} className="login-input-icon" />
                  <input 
                    type="password" 
                    id="confpwd"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password to verify..."
                    disabled={isChangingPwd || pwdSuccess}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="login-submit-btn" 
                style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}
                disabled={isChangingPwd || pwdSuccess}
              >
                {isChangingPwd ? "Updating Security Credentials..." : "Update & Unlock Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FULL ACTIVE CMS CONTROL PANEL RENDER
  // ----------------------------------------------------
  return (
    <div className="admin-page animate-fade-in" style={{ background: "var(--color-back)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1400px" }}>
        
        {/* Main Dashboard Navigation Header */}
        <header className="admin-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "2rem", marginBottom: "3rem" }}>
          <div>
            <span className="admin-badge" style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>CMS Central Hub</span>
            <h1 className="section-title left-aligned" style={{ margin: "0.25rem 0 0" }}>Control Panel Dashboard</h1>
            <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.95rem" }}>
              Administrator Session: <strong>{user.username}</strong>
            </p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => setChangePwdModalOpen(true)} className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginRight: "1rem" }}>
              <Key size={16} /> Reset Password
            </button>
            <button onClick={handleLogout} className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <LogOut size={16} /> Logout Session
            </button>
          </div>
        </header>

        {/* Dynamic Nav Tabs */}
        <nav className="dashboard-nav-tabs" style={{ display: "flex", gap: "1rem", borderBottom: "2px solid var(--color-border)", marginBottom: "3rem", paddingBottom: "0.5rem", overflowX: "auto" }}>
          <button 
            onClick={() => setActiveTab("metrics_content")} 
            className={`dashboard-tab ${activeTab === "metrics_content" ? "active" : ""}`}
          >
            <LayoutDashboard size={16} /> Metrics & Site Text
          </button>
          
          <button 
            onClick={() => setActiveTab("programs")} 
            className={`dashboard-tab ${activeTab === "programs" ? "active" : ""}`}
          >
            <BookOpen size={16} /> Cohort Programs
          </button>

          <button 
            onClick={() => setActiveTab("volunteers")} 
            className={`dashboard-tab ${activeTab === "volunteers" ? "active" : ""}`}
          >
            <Users size={16} /> Volunteers Review ({initialVolunteers.length})
          </button>

          <button 
            onClick={() => setActiveTab("events")} 
            className={`dashboard-tab ${activeTab === "events" ? "active" : ""}`}
          >
            <Calendar size={16} /> Events Calendar ({events.length})
          </button>

          <button 
            onClick={() => setActiveTab("resources")} 
            className={`dashboard-tab ${activeTab === "resources" ? "active" : ""}`}
          >
            <Download size={16} /> Resources Cabinet
          </button>

          <button 
            onClick={() => setActiveTab("faqs")} 
            className={`dashboard-tab ${activeTab === "faqs" ? "active" : ""}`}
          >
            <HelpCircle size={16} /> FAQ Management
          </button>
        </nav>

        {/* ----------------------------------------------------
            TAB 1: SYSTEM METRICS & SITE TEXT CMS
            ---------------------------------------------------- */}
        {activeTab === "metrics_content" && (
          <div className="cms-grid-layout" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "3rem", alignItems: "start" }}>
            
            {/* LEFT Column: Real Metric Sliders/Inputs */}
            <div className="cms-form-card" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.25rem" }}>Startup Metrics Configuration</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", margin: 0 }}>Values are used to draw zero lines, calculate progress, and report live impact stats.</p>
              </div>

              {metricsSuccessMsg && (
                <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", color: "#065F46", fontSize: "0.85rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Check size={16} /> <span>{metricsSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleMetricsSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                 {[
                  { field: "studentsReached", label: "Students Reached", color: "#3B82F6" },
                  { field: "volunteersEngaged", label: "Volunteers Engaged", color: "#EF4444" },
                  { field: "serviceHours", label: "Service Hours", color: "#10B981" },
                  { field: "communityProjects", label: "Community Projects", color: "#F59E0B" },
                  { field: "eventsHosted", label: "Events Hosted", color: "#6366F1" },
                  { field: "mentors", label: "Mentors Active", color: "#EC4899" },
                  { field: "resourcesDistributed", label: "Resources Downloaded", color: "#8B5CF6" },
                  { field: "partnerships", label: "Partners & Sponsors", color: "#F43F5E" }
                ].map(({ field, label, color }) => (
                  <div className="form-group" key={field} style={{ margin: 0 }}>
                    <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.35rem" }}>
                      <span>{label}</span>
                      <strong style={{ color }}>
                        {metrics[field as keyof SystemMetric]}
                      </strong>
                    </label>
                    <input 
                      type="number" 
                      min={0}
                      step="1"
                      value={metrics[field as keyof SystemMetric] ?? 0}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value) || 0;
                        setMetrics({ ...metrics, [field]: parsed });
                      }}
                      style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                ))}

                <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={isSubmittingMetrics}>
                  {isSubmittingMetrics ? "Updating Metrics..." : "Save Metrics Board"}
                </button>
              </form>
            </div>

            {/* RIGHT Column: Site content Key-Values */}
            <div className="cms-content-editor-grid" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "1rem" }}>Homepage Text Blocks</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.35rem" }}>Homepage Main Headline</label>
                    <input 
                      type="text" 
                      value={getContentValue("home_headline")}
                      onChange={(e) => handleContentLocalChange("home_headline", e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.95rem" }}
                    />
                    <button 
                      onClick={() => handleContentSubmit("home_headline", getContentValue("home_headline"))}
                      className="btn btn-secondary btn-small"
                      style={{ marginTop: "0.5rem" }}
                      disabled={isSubmittingContent === "home_headline"}
                    >
                      {isSubmittingContent === "home_headline" ? "Saving..." : "Save Headline"}
                      {contentSuccessMsg === "home_headline" && <Check size={12} style={{ marginLeft: "0.35rem", color: "#10B981" }} />}
                    </button>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.35rem" }}>Homepage Startup & Tagline Subtitle</label>
                    <textarea 
                      rows={4}
                      value={getContentValue("home_subheadline")}
                      onChange={(e) => handleContentLocalChange("home_subheadline", e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", lineHeight: 1.5 }}
                    ></textarea>
                    <button 
                      onClick={() => handleContentSubmit("home_subheadline", getContentValue("home_subheadline"))}
                      className="btn btn-secondary btn-small"
                      style={{ marginTop: "0.5rem" }}
                      disabled={isSubmittingContent === "home_subheadline"}
                    >
                      {isSubmittingContent === "home_subheadline" ? "Saving..." : "Save Subheading"}
                      {contentSuccessMsg === "home_subheadline" && <Check size={12} style={{ marginLeft: "0.35rem", color: "#10B981" }} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "1rem" }}>About Us Values</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.35rem" }}>Founding Vision Statement</label>
                    <input 
                      type="text" 
                      value={getContentValue("about_vision")}
                      onChange={(e) => handleContentLocalChange("about_vision", e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.95rem" }}
                    />
                    <button 
                      onClick={() => handleContentSubmit("about_vision", getContentValue("about_vision"))}
                      className="btn btn-secondary btn-small"
                      style={{ marginTop: "0.5rem" }}
                      disabled={isSubmittingContent === "about_vision"}
                    >
                      {isSubmittingContent === "about_vision" ? "Saving..." : "Save Vision"}
                      {contentSuccessMsg === "about_vision" && <Check size={12} style={{ marginLeft: "0.35rem", color: "#10B981" }} />}
                    </button>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.35rem" }}>Master Mission Statement</label>
                    <textarea 
                      rows={4}
                      value={getContentValue("about_mission")}
                      onChange={(e) => handleContentLocalChange("about_mission", e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", lineHeight: 1.5 }}
                    ></textarea>
                    <button 
                      onClick={() => handleContentSubmit("about_mission", getContentValue("about_mission"))}
                      className="btn btn-secondary btn-small"
                      style={{ marginTop: "0.5rem" }}
                      disabled={isSubmittingContent === "about_mission"}
                    >
                      {isSubmittingContent === "about_mission" ? "Saving..." : "Save Mission"}
                      {contentSuccessMsg === "about_mission" && <Check size={12} style={{ marginLeft: "0.35rem", color: "#10B981" }} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "1rem" }}>Contact coordinates</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.35rem" }}>Office Email Address</label>
                    <input 
                      type="email" 
                      value={getContentValue("contact_email")}
                      onChange={(e) => handleContentLocalChange("contact_email", e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.95rem" }}
                    />
                    <button 
                      onClick={() => handleContentSubmit("contact_email", getContentValue("contact_email"))}
                      className="btn btn-secondary btn-small"
                      style={{ marginTop: "0.5rem" }}
                      disabled={isSubmittingContent === "contact_email"}
                    >
                      {isSubmittingContent === "contact_email" ? "Saving..." : "Save Email"}
                      {contentSuccessMsg === "contact_email" && <Check size={12} style={{ marginLeft: "0.35rem", color: "#10B981" }} />}
                    </button>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.35rem" }}>Central Office Line</label>
                    <input 
                      type="text" 
                      value={getContentValue("contact_phone")}
                      onChange={(e) => handleContentLocalChange("contact_phone", e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.95rem" }}
                    />
                    <button 
                      onClick={() => handleContentSubmit("contact_phone", getContentValue("contact_phone"))}
                      className="btn btn-secondary btn-small"
                      style={{ marginTop: "0.5rem" }}
                      disabled={isSubmittingContent === "contact_phone"}
                    >
                      {isSubmittingContent === "contact_phone" ? "Saving..." : "Save Phone"}
                      {contentSuccessMsg === "contact_phone" && <Check size={12} style={{ marginLeft: "0.35rem", color: "#10B981" }} />}
                    </button>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.35rem" }}>Physical Office Location Address</label>
                    <input 
                      type="text" 
                      value={getContentValue("contact_address")}
                      onChange={(e) => handleContentLocalChange("contact_address", e.target.value)}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.95rem" }}
                    />
                    <button 
                      onClick={() => handleContentSubmit("contact_address", getContentValue("contact_address"))}
                      className="btn btn-secondary btn-small"
                      style={{ marginTop: "0.5rem" }}
                      disabled={isSubmittingContent === "contact_address"}
                    >
                      {isSubmittingContent === "contact_address" ? "Saving..." : "Save Address"}
                      {contentSuccessMsg === "contact_address" && <Check size={12} style={{ marginLeft: "0.35rem", color: "#10B981" }} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: COHORT PROGRAMS PORTAL
            ---------------------------------------------------- */}
        {activeTab === "programs" && (
          <div className="cms-grid-layout" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>
            
            {/* List selector */}
            <div className="cms-sidebar-list" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "1.5rem", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", padding: "0 0.5rem 0.5rem", borderBottom: "1px solid var(--color-border)", marginBottom: "0.5rem" }}>Syllabus Cohorts</h3>
              {programs.map((prog) => (
                <button 
                  key={prog.id}
                  onClick={() => setSelectedProgram(prog)}
                  className={`sidebar-list-btn ${selectedProgram?.id === prog.id ? "active" : ""}`}
                  style={{ 
                    padding: "0.75rem 1rem", 
                    borderRadius: "var(--radius-sm)", 
                    border: "none", 
                    textAlign: "left", 
                    cursor: "pointer", 
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: selectedProgram?.id === prog.id ? "var(--color-primary-light)" : "transparent",
                    color: selectedProgram?.id === prog.id ? "var(--color-primary)" : "var(--color-text)"
                  }}
                >
                  <span>{prog.title}</span>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", background: "rgba(0,0,0,0.05)", padding: "0.2rem 0.4rem", borderRadius: "3px" }}>{prog.themeClass}</span>
                </button>
              ))}
            </div>

            {/* Editor Detail */}
            {selectedProgram && (
              <div className="cms-form-card" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "2rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Configure program: {selectedProgram.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", margin: 0 }}>{selectedProgram.subtitle}</p>
                  </div>
                </div>

                {programSuccessMsg && (
                  <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", color: "#065F46", fontSize: "0.85rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Check size={16} /> <span>{programSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleProgramSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="form-group row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>Program Title</label>
                      <input 
                        type="text"
                        value={selectedProgram.title}
                        onChange={(e) => setSelectedProgram({ ...selectedProgram, title: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>Subtitle Tagline</label>
                      <input 
                        type="text"
                        value={selectedProgram.subtitle}
                        onChange={(e) => setSelectedProgram({ ...selectedProgram, subtitle: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>Full Description Statement</label>
                    <textarea 
                      rows={4}
                      value={selectedProgram.description}
                      onChange={(e) => setSelectedProgram({ ...selectedProgram, description: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", lineHeight: 1.5 }}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>Cohort Learning Objectives (One per line)</label>
                      <textarea 
                        rows={5}
                        value={selectedProgram.objectives}
                        onChange={(e) => setSelectedProgram({ ...selectedProgram, objectives: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", fontFamily: "monospace" }}
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>Student & Volunteer Benefits (One per line)</label>
                      <textarea 
                        rows={5}
                        value={selectedProgram.benefits}
                        onChange={(e) => setSelectedProgram({ ...selectedProgram, benefits: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", fontFamily: "monospace" }}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>Future Development Roadmap Goal</label>
                    <input 
                      type="text"
                      value={selectedProgram.futureGoals}
                      onChange={(e) => setSelectedProgram({ ...selectedProgram, futureGoals: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem" }}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isSubmittingProgram} style={{ alignSelf: "flex-end", minWidth: "180px" }}>
                    {isSubmittingProgram ? "Saving Syllabus..." : "Save Program Info"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: VOLUNTEERS REVIEW BOARD
            ---------------------------------------------------- */}
        {activeTab === "volunteers" && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", margin: "0 0 0.5rem" }}>Active Volunteer Registries</h2>
              <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.9rem" }}>
                Browse incoming applicants, review motivation essays, update status marks, and dispatch emails directly.
              </p>
            </div>
            
            <VolunteerTable data={initialVolunteers} />
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: SCHEDULED EVENTS CALENDAR
            ---------------------------------------------------- */}
        {activeTab === "events" && (
          <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", margin: "0 0 0.25rem" }}>Events Schedule Coordinator</h2>
                <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.9rem" }}>Coordinate active workshops and check local registration limits.</p>
              </div>
              <button onClick={() => openEventModal(null)} className="btn btn-accent btn-large" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <PlusCircle size={18} /> Schedule New Event
              </button>
            </div>

            <div className="events-admin-list" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {events.length > 0 ? events.map((ev) => (
                <div key={ev.id} className="event-admin-card" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-sm)", display: "grid", gridTemplateColumns: "2.5fr 1.5fr", gap: "2rem" }}>
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span className="role-badge" style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>{ev.category}</span>
                      <span className="role-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}><Clock size={12} /> {ev.date} at {ev.time}</span>
                    </div>
                    <h3 style={{ fontSize: "1.25rem", color: "var(--color-text)", margin: "0 0 0.5rem" }}>{ev.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: "0 0 1rem", lineHeight: 1.5 }}>{ev.description}</p>
                    
                    <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                      <span><strong>Location:</strong> {ev.location}</span>
                      <span><strong>Host:</strong> {ev.host}</span>
                      <span><strong>Available Capacity:</strong> {ev.spotsLeft} / {ev.capacity} left</span>
                    </div>
                  </div>

                  {/* Registrants section */}
                  <div style={{ borderLeft: "1px solid var(--color-border)", paddingLeft: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-primary)" }}>Registrants ({ev.registration.length})</h4>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => openEventModal(ev)} className="btn btn-outline btn-small" title="Edit Event Details"><Edit3 size={12} /></button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="btn btn-secondary btn-small" style={{ color: "#EF4444" }} title="Delete Event Permanently"><Trash2 size={12} /></button>
                      </div>
                    </div>

                    <div className="registrants-list-box" style={{ maxHeight: "140px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {ev.registration.length > 0 ? ev.registration.map((reg) => (
                        <div key={reg.id} style={{ display: "flex", justifyContent: "space-between", background: "var(--color-back)", padding: "0.4rem 0.65rem", borderRadius: "3px", fontSize: "0.75rem" }}>
                          <strong>{reg.fullName}</strong>
                          <span style={{ color: "var(--color-text-light)" }}>{reg.email}</span>
                        </div>
                      )) : (
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)", fontStyle: "italic", margin: "1rem 0" }}>No candidates registered for this event yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "4rem", textAlign: "center", color: "var(--color-text-light)" }}>
                  No scheduled events scheduled. Click "Schedule New Event" to set up your first cohort workshop.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 5: DOWNLOADABLE RESOURCES CABINET
            ---------------------------------------------------- */}
        {activeTab === "resources" && (
          <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", margin: "0 0 0.25rem" }}>Educational Resources Cabinet</h2>
                <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.9rem" }}>Store core curriculum sheets, facilitator booklets, and study manuals as text downloads.</p>
              </div>
              <button onClick={() => setResourceModalOpen(true)} className="btn btn-accent btn-large" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <PlusCircle size={18} /> Compile New Resource
              </button>
            </div>

            <div className="resources-grid-cabinet" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
              {resources.length > 0 ? resources.map((res) => (
                <div key={res.id} className="resource-cabinet-card" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span className="role-badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>{res.category}</span>
                      <button onClick={() => handleDeleteResource(res.id)} className="btn btn-secondary btn-small" style={{ padding: "0.3rem 0.5rem", color: "#EF4444" }} title="Delete Resource Guide"><Trash2 size={12} /></button>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <FileText size={24} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "0.25rem" }} />
                      <div>
                        <h3 style={{ fontSize: "1.1rem", color: "var(--color-text)", margin: 0 }}>{res.title}</h3>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>{res.filename} ({res.size})</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5, margin: "0 0 1.5rem" }}>{res.description}</p>
                  </div>
                  
                  <div style={{ background: "var(--color-back)", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: "0.75rem", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {res.content.substring(0, 100)}...
                  </div>
                </div>
              )) : (
                <div style={{ gridColumn: "1 / -1", background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "4rem", textAlign: "center", color: "var(--color-text-light)" }}>
                  No dynamic guide resources found in cabinet. Tap "Compile New Resource" to draft text documents.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 6: COLLAPSIBLE FAQ ACCORDION DESK
            ---------------------------------------------------- */}
        {activeTab === "faqs" && (
          <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)", margin: "0 0 0.25rem" }}>FAQ Accordion Desk</h2>
                <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.9rem" }}>Add or rewrite quick answers for student questions and volunteer guides.</p>
              </div>
              <button onClick={() => openFaqModal(null)} className="btn btn-accent btn-large" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <PlusCircle size={18} /> Add New FAQ Card
              </button>
            </div>

            <div className="faq-dashboard-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq) => (
                <div key={faq.id} className="faq-admin-card animate-fade-in" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "1.5rem", boxShadow: "var(--shadow-sm)", display: "flex", justifyContent: "space-between", gap: "2rem", alignItems: "start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span className="role-badge" style={{ background: "rgba(0,0,0,0.05)", border: "none" }}>{faq.category}</span>
                    </div>
                    <strong style={{ fontSize: "1.05rem", color: "var(--color-text)" }}>{faq.question}</strong>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>{faq.answer}</p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button onClick={() => openFaqModal(faq)} className="btn btn-outline btn-small" title="Edit FAQ card"><Edit3 size={12} /></button>
                    <button onClick={() => handleDeleteFaq(faq.id)} className="btn btn-secondary btn-small" style={{ color: "#EF4444" }} title="Delete FAQ Card"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ----------------------------------------------------
          MODAL OVERLAYS (FAQ, Resource, Event forms)
          ---------------------------------------------------- */}
      
      {/* FAQ MODAL */}
      {faqModalOpen && (
        <div className="modal-overlay" onClick={() => setFaqModalOpen(false)}>
          <div className="modal-card register-modal animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: "560px" }}>
            <button className="modal-close-btn" onClick={() => setFaqModalOpen(false)}>&times;</button>
            <div className="modal-header">
              <h2>{editingFaq ? "Edit FAQ Specifications" : "Compose New FAQ Card"}</h2>
              <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.85rem" }}>Fills public FAQ accordions dynamically.</p>
            </div>
            <form onSubmit={handleSaveFaq} className="register-event-form" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div className="form-group">
                <label>Question Prompt *</label>
                <input 
                  type="text" 
                  value={faqForm.question} 
                  onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} 
                  placeholder="e.g. Can I volunteer during school holidays?"
                  required 
                />
              </div>
              <div className="form-group">
                <label>FAQ Category Group *</label>
                <select 
                  value={faqForm.category} 
                  onChange={e => setFaqForm({ ...faqForm, category: e.target.value })}
                  style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}
                >
                  <option value="General">General</option>
                  <option value="Programs">Programs</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Parents & Sponsors">Parents & Sponsors</option>
                </select>
              </div>
              <div className="form-group">
                <label>Detailed Answer *</label>
                <textarea 
                  rows={4} 
                  value={faqForm.answer} 
                  onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} 
                  placeholder="Provide a comprehensive response..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-accent btn-large" disabled={isSavingFaq} style={{ width: "100%" }}>
                {isSavingFaq ? "Saving FAQ details..." : "Save FAQ Card"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESOURCE MODAL */}
      {resourceModalOpen && (
        <div className="modal-overlay" onClick={() => setResourceModalOpen(false)}>
          <div className="modal-card register-modal animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <button className="modal-close-btn" onClick={() => setResourceModalOpen(false)}>&times;</button>
            <div className="modal-header">
              <h2>Draft Dynamic Guide Resource</h2>
              <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.85rem" }}>Uploads a custom text document file automatically sized and named.</p>
            </div>
            <form onSubmit={handleSaveResource} className="register-event-form" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div className="form-group row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Document Title *</label>
                  <input 
                    type="text" 
                    value={resourceForm.title} 
                    onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} 
                    placeholder="Beginners Python Study Manual"
                    required 
                  />
                </div>
                <div>
                  <label>Resource Topic *</label>
                  <select 
                    value={resourceForm.category} 
                    onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })}
                    style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Community">Community</option>
                    <option value="Sponsor Packet">Sponsor Packet</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Document Type Descriptor *</label>
                <input 
                  type="text" 
                  value={resourceForm.type} 
                  onChange={e => setResourceForm({ ...resourceForm, type: e.target.value })} 
                  placeholder="e.g. PDF Syllabus Guide / Curriculum Guide"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Short Description *</label>
                <input 
                  type="text" 
                  value={resourceForm.description} 
                  onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })} 
                  placeholder="Summarize guide details..."
                  required 
                />
              </div>
              <div className="form-group">
                <label>File Content (Raw Text Blob) *</label>
                <textarea 
                  rows={6} 
                  value={resourceForm.content} 
                  onChange={e => setResourceForm({ ...resourceForm, content: e.target.value })} 
                  placeholder="Write the full document text guidelines here..."
                  style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-accent btn-large" disabled={isSavingResource} style={{ width: "100%" }}>
                {isSavingResource ? "Uploading..." : "Save Resource File"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EVENT MODAL */}
      {eventModalOpen && (
        <div className="modal-overlay" onClick={() => setEventModalOpen(false)}>
          <div className="modal-card register-modal animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <button className="modal-close-btn" onClick={() => setEventModalOpen(false)}>&times;</button>
            <div className="modal-header">
              <h2>{editingEvent ? "Edit Event Details" : "Schedule New Workshop Event"}</h2>
              <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.85rem" }}>Creates calendar nodes and reserves seat space counts.</p>
            </div>
            <form onSubmit={handleSaveEvent} className="register-event-form" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div className="form-group row" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Workshop Title *</label>
                  <input 
                    type="text" 
                    value={eventForm.title} 
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })} 
                    placeholder="Greenway Park Cleanup Drive"
                    required 
                  />
                </div>
                <div>
                  <label>Event Topic *</label>
                  <select 
                    value={eventForm.category} 
                    onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
                    style={{ width: "100%", padding: "0.65rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}
                  >
                    <option value="Youth Workshop">Youth Workshop</option>
                    <option value="Community Initiative">Community Initiative</option>
                    <option value="Parent Meeting">Parent Meeting</option>
                    <option value="Coding Bootcamp">Coding Bootcamp</option>
                  </select>
                </div>
              </div>

              <div className="form-group row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Calendar Date *</label>
                  <input 
                    type="text" 
                    value={eventForm.date} 
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })} 
                    placeholder="e.g. 2026-07-15"
                    required 
                  />
                </div>
                <div>
                  <label>Hours/Timing *</label>
                  <input 
                    type="text" 
                    value={eventForm.time} 
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })} 
                    placeholder="e.g. 2:00 PM - 5:00 PM"
                    required 
                  />
                </div>
              </div>

              <div className="form-group row" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Location Coordinates *</label>
                  <input 
                    type="text" 
                    value={eventForm.location} 
                    onChange={e => setEventForm({ ...eventForm, location: e.target.value })} 
                    placeholder="123 Greenway Park St, NY"
                    required 
                  />
                </div>
                <div>
                  <label>Instructor Host *</label>
                  <input 
                    type="text" 
                    value={eventForm.host} 
                    onChange={e => setEventForm({ ...eventForm, host: e.target.value })} 
                    placeholder="Marcus Vance"
                    required 
                  />
                </div>
              </div>

              <div className="form-group row" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1rem" }}>
                <div>
                  <label>Max Seat Capacity *</label>
                  <input 
                    type="number" 
                    min={1}
                    value={eventForm.capacity} 
                    onChange={e => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) || 20 })} 
                    required 
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", fontSize: "0.75rem", color: "var(--color-text-light)", padding: "1.5rem 0 0" }}>
                  <span>Adjusting capacity resets seats remaining based on existing registrants.</span>
                </div>
              </div>

              <div className="form-group">
                <label>Event Description Statement *</label>
                <textarea 
                  rows={3} 
                  value={eventForm.description} 
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })} 
                  placeholder="Provide study or coordinator guidelines for participants..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-accent btn-large" disabled={isSavingEvent} style={{ width: "100%" }}>
                {isSavingEvent ? "Scheduling..." : "Save Event Details"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {changePwdModalOpen && (
        <div className="modal-overlay" onClick={() => setChangePwdModalOpen(false)}>
          <div className="modal-card register-modal animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: "460px" }}>
            <button className="modal-close-btn" onClick={() => setChangePwdModalOpen(false)}>&times;</button>
            <div className="modal-header">
              <h2>Reset Administrative Password</h2>
              <p className="subtitle" style={{ margin: 0, textAlign: "left", fontSize: "0.85rem" }}>Update your secure master password for future logins.</p>
            </div>
            
            {dashboardPwdError && (
              <div className="login-alert-box animate-fade-in" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{dashboardPwdError}</span>
              </div>
            )}

            {dashboardPwdSuccess && (
              <div className="login-alert-box animate-fade-in" style={{ marginTop: "1rem", marginBottom: "1rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#A7F3D0" }}>
                <Check size={18} style={{ flexShrink: 0 }} />
                <span>{dashboardPwdSuccess}</span>
              </div>
            )}

            <form onSubmit={handleDashboardPasswordChangeSubmit} className="register-event-form" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div className="form-group">
                <label>New Master Password *</label>
                <input 
                  type="password" 
                  value={dashboardNewPwd}
                  onChange={e => setDashboardNewPwd(e.target.value)}
                  placeholder="Min 6 characters..."
                  disabled={isSubmittingDashboardPwd || !!dashboardPwdSuccess}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input 
                  type="password" 
                  value={dashboardConfirmPwd}
                  onChange={e => setDashboardConfirmPwd(e.target.value)}
                  placeholder="Re-enter to verify..."
                  disabled={isSubmittingDashboardPwd || !!dashboardPwdSuccess}
                  required
                />
              </div>
              <button type="submit" className="btn btn-accent btn-large" disabled={isSubmittingDashboardPwd || !!dashboardPwdSuccess} style={{ width: "100%" }}>
                {isSubmittingDashboardPwd ? "Updating Security Credentials..." : "Update Master Password"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
