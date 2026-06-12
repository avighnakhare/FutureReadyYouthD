"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import "./Login.css";

export default function LoginClient() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Successful login
        // Check if user must change password
        if (data.mustChangePassword) {
          // Redirect to /admin directly, the dashboard will catch mustChangePassword and lock it with a force reset screen
          router.push("/admin");
        } else {
          router.push("/admin");
        }
        router.refresh();
      } else {
        setErrorMsg(data.error || "Invalid administrator credentials.");
      }
    } catch {
      setErrorMsg("A network communication error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card-container">
        <div className="login-glass-card">
          <div className="login-header-group">
            <div className="login-logo-placeholder">
              <Lock size={28} />
            </div>
            <h2>Administrative Desk</h2>
            <p>Sign in to configure metrics, coordinate events, modify site parameters, and view volunteer submissions.</p>
          </div>

          {errorMsg && (
            <div className="login-alert-box animate-fade-in">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="login-form-group">
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <div className="login-input-wrapper">
                <User size={16} className="login-input-icon" />
                <input 
                  type="text" 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="FutureReadyYouth"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input 
                  type="password" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authenticating..." : "Login to Control Panel"}
            </button>
          </form>

          <div className="login-footer-back">
            <Link href="/" className="back-link">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <ArrowLeft size={14} /> Back to Homepage
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
