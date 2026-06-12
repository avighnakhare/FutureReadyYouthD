"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Navigation, Info } from "lucide-react";
import "./Contact.css";

interface ContactClientProps {
  email: string;
  phone: string;
  address: string;
}

export default function ContactClient({ email, phone, address }: ContactClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [mapZoom, setMapZoom] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      alert("Please fill in all form fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        alert("Server failed to receive contact details. Please try again.");
      }
    } catch {
      alert("Network error. Please try again later.");
    }
    setIsSubmitting(false);
  };

  // Helper to extract a cleaner tel string if needed
  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  return (
    <div className="contact-page animate-fade-in">
      
      {/* Hero Header */}
      <section className="contact-hero-section">
        <div className="container text-center">
          <span className="contact-badge">Get In Touch</span>
          <h1 className="section-title">Contact Our Team</h1>
          <p className="subtitle">Have questions about student enrollment, sponsor programs, or volunteer guidelines? Reach out today.</p>
        </div>
      </section>

      {/* Main Grid: Form & Info Panel */}
      <section className="contact-main-section">
        <div className="container contact-grid-layout">
          
          {/* LEFT: Form */}
          <div className="contact-form-wrapper">
            {sent ? (
              <div className="contact-success-screen text-center animate-fade-in">
                <CheckCircle className="success-check-icon" size={60} />
                <h2>Message Sent Successfully!</h2>
                <p className="success-desc">
                  Thank you for reaching out to Future Ready Youth, <strong>{formData.name}</strong>.
                </p>
                <p className="success-details">
                  Our administrative desk has successfully received your message regarding <strong>"{formData.subject}"</strong>. A confirmation slip has been sent to <strong>{formData.email}</strong>, and a representative will reply within 24 hours.
                </p>
                <button 
                  onClick={() => {
                    setSent(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }} 
                  className="btn btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="contact-form-card">
                <h3>Send Direct Inquiry</h3>
                <p className="form-subtext">Fill out our rapid response form. Required fields are marked with *</p>
                
                <form onSubmit={handleSubmit} className="contact-form-element">
                  <div className="form-group row">
                    <div>
                      <label htmlFor="name">Your Name *</label>
                      <input 
                        type="text" 
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Jane Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email">Email Address *</label>
                      <input 
                        type="email" 
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="jane@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input 
                      type="text" 
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="e.g. Corporate Sponsorship / Volunteer Hours Verification"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message *</label>
                    <textarea 
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="How can our program coordinators assist you today..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-accent btn-large submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"} <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT: Info Card Details & Map */}
          <div className="contact-info-wrapper">
            
            {/* Direct Details Card */}
            <div className="info-details-card">
              <h3>Office Information</h3>
              <p className="details-card-desc">Reach our administrative coordinators directly via phone or email.</p>
              
              <div className="info-links-list">
                <div className="info-link-item">
                  <div className="info-link-icon blue"><Mail size={18} /></div>
                  <div>
                    <strong>Administrative Email</strong>
                    {email ? <a href={`mailto:${email}`}>{email}</a> : <span style={{ color: "var(--color-text-light)" }}>Information Required From Organization</span>}
                  </div>
                </div>

                <div className="info-link-item">
                  <div className="info-link-icon green"><Phone size={18} /></div>
                  <div>
                    <strong>Call Central Desk</strong>
                    {phone ? <a href={`tel:${cleanPhone}`}>{phone}</a> : <span style={{ color: "var(--color-text-light)" }}>Information Required From Organization</span>}
                  </div>
                </div>

                <div className="info-link-item">
                  <div className="info-link-icon orange"><MapPin size={18} /></div>
                  <div>
                    <strong>Office Location</strong>
                    {address ? <span>{address}</span> : <span style={{ color: "var(--color-text-light)" }}>Information Required From Organization</span>}
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="contact-social-row">
                <strong>Connect with us:</strong>
                <div className="social-links-circle">
                  <a href="https://instagram.com/futurereadyyouth.today" target="_blank" rel="noreferrer" className="social-btn instagram" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                </div>
              </div>
            </div>

            {/* Interactive SVG Map Placeholder */}
            <div className="interactive-map-card">
              <div className="map-card-header">
                <div className="map-title-row">
                  <Navigation size={16} className="map-nav-icon" />
                  <h4>Office Coordinates</h4>
                </div>
              </div>

              <div className="map-canvas-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "240px", background: "var(--color-surface-hover)", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)", padding: "2rem" }}>
                <Navigation size={36} style={{ color: "var(--color-text-light)", marginBottom: "1rem" }} />
                <h5 style={{ margin: "0 0 0.5rem", color: "var(--color-text)", fontWeight: 600, fontSize: "1.05rem" }}>Location Coordinates Unavailable</h5>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                  Future Ready Youth does not maintain a physical office address. Program cohorts are held directly at municipal schools and local community libraries.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
