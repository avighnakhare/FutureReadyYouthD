"use client";

import Link from "next/link";
import { Award, Heart, HelpCircle, Users, Sparkles } from "lucide-react";
import "./Involved.css";

export default function InvolvedPage() {
  return (
    <div className="involved-page animate-fade-in">
      
      {/* Hero Header */}
      <section className="involved-hero-section">
        <div className="container text-center">
          <span className="involved-badge">Make an Impact</span>
          <h1 className="section-title">Get Involved Today</h1>
          <p className="subtitle">Join our collaborative network. Whether you contribute hours, mentorship, or local business venues, you belong here.</p>
        </div>
      </section>

      {/* 4 Core Subsections Cards Grid */}
      <section className="involved-options-section">
        <div className="container involved-options-grid">
          
          {/* 1. VOLUNTEER */}
          <div className="involved-option-card hover-lift">
            <div className="option-icon-badge blue">
              <Users size={28} />
            </div>
            <h3>Become a Volunteer</h3>
            <p>Directly lead cohort workshops, coordinate reading buddy circles, or assist in tech labs. Certified service hours are fully signed off.</p>
            <Link href="/volunteer" className="btn btn-primary btn-small">
              Apply to Volunteer
            </Link>
          </div>

          {/* 2. BECOME A MENTOR */}
          <div className="involved-option-card hover-lift">
            <div className="option-icon-badge green">
              <Award size={28} />
            </div>
            <h3>Become a Mentor</h3>
            <p>Establish consistent peer-to-peer relationships with younger middle school students, providing academic tutoring and life guidance.</p>
            <Link href="/volunteer?role=mentor" className="btn btn-secondary btn-small">
              Sign Up as Mentor
            </Link>
          </div>

          {/* 3. SPONSOR PROGRAMS */}
          <div className="involved-option-card hover-lift">
            <div className="option-icon-badge purple">
              <Sparkles size={28} />
            </div>
            <h3>Sponsor Programs</h3>
            <p>Are you a corporate business? Fund entire regional cohort classes, sponsor annual pitch summits, or coordinate employee days.</p>
            <Link href="/contact?subject=Corporate%20Program%20Sponsorship" className="btn btn-outline btn-small">
              Partner & Sponsor
            </Link>
          </div>

          {/* 4. COMMUNITY PARTNERSHIPS */}
          <div className="involved-option-card hover-lift">
            <div className="option-icon-badge yellow">
              <HelpCircle size={28} />
            </div>
            <h3>Community Partnerships</h3>
            <p>Are you a school administrator or municipal library lead? Partner with us to bring our summer cohorts directly to your neighborhood.</p>
            <Link href="/contact?subject=Municipal%20School%20Partnership" className="btn btn-outline btn-small">
              Establish Partnership
            </Link>
          </div>

        </div>
      </section>

      {/* FAQ shortcut CTA */}
      <section className="involved-footer-banner">
        <div className="container text-center banner-box">
          <h2>Have Questions About Helping?</h2>
          <p>Read our extensive guide answers regarding volunteer hours, background screenings, and application steps.</p>
          <Link href="/faq" className="btn btn-primary">
            Visit FAQ Help Center
          </Link>
        </div>
      </section>

    </div>
  );
}
