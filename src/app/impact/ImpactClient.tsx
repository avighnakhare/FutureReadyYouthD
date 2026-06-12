"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Clock, Heart, Compass, TrendingUp, Award, Globe } from "lucide-react";

interface MetricsType {
  studentsReached: number;
  volunteersEngaged: number;
  serviceHours: number;
  communityProjects: number;
  eventsHosted: number;
  mentors: number;
  donationsReceived: number;
  resourcesDistributed: number;
}

export default function ImpactClient({ metrics }: { metrics: MetricsType }) {
  const [chartMetric, setChartMetric] = useState<"students" | "hours">("students");

  // Dynamic Chart Plotting
  // To avoid fictional stats, we trace:
  // 2025: 0 (Founding Prep)
  // 2026: Live metrics from the database!
  const studentsReachedVal = metrics.studentsReached;
  const serviceHoursVal = metrics.serviceHours;

  const chartPoints = chartMetric === "students"
    ? [
        { year: "2025 (Founding)", value: 0, x: 50, y: 220 },
        { year: "2026 (Summer)", value: studentsReachedVal, x: 440, y: studentsReachedVal === 0 ? 220 : 40 }
      ]
    : [
        { year: "2025 (Founding)", value: 0, x: 50, y: 220 },
        { year: "2026 (Summer)", value: serviceHoursVal, x: 440, y: serviceHoursVal === 0 ? 220 : 30 }
      ];

  const polylinePath = chartPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="impact-page animate-fade-in">
      
      {/* Page Header */}
      <section className="impact-hero-section">
        <div className="container text-center">
          <span className="impact-badge">Our Footprint</span>
          <h1 className="section-title">Measurable Community Impact</h1>
          <p className="subtitle">Track our real, authenticated statistics as we launch our initiatives and build our community support systems.</p>
        </div>
      </section>

      {/* Primary Statistics Counter Banner */}
      <section className="impact-banners-section">
        <div className="container banners-grid">
          <div className="banner-card">
            <Users className="banner-icon blue" size={36} />
            <div>
              <h3>{metrics.studentsReached}</h3>
              <p>Students Reached</p>
            </div>
          </div>
          <div className="banner-card">
            <Clock className="banner-icon green" size={36} />
            <div>
              <h3>{metrics.serviceHours}</h3>
              <p>Service Hours</p>
            </div>
          </div>
          <div className="banner-card">
            <Heart className="banner-icon orange" size={36} />
            <div>
              <h3>{metrics.volunteersEngaged}</h3>
              <p>Volunteers Engaged</p>
            </div>
          </div>
          <div className="banner-card">
            <Compass className="banner-icon purple" size={36} />
            <div>
              <h3>{metrics.communityProjects}</h3>
              <p>Community Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auxiliary Statistics Block */}
      <section className="impact-auxiliary-section" style={{ padding: "2rem 0 4rem" }}>
        <div className="container banners-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div className="banner-card" style={{ borderLeft: "4px solid var(--color-primary)" }}>
            <Award className="banner-icon blue" size={30} />
            <div>
              <h3>{metrics.mentors}</h3>
              <p>Active Mentors</p>
            </div>
          </div>
          <div className="banner-card" style={{ borderLeft: "4px solid var(--color-secondary)" }}>
            <Globe className="banner-icon green" size={30} />
            <div>
              <h3>{metrics.resourcesDistributed}</h3>
              <p>Resources Distributed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Growth Statistics Chart section */}
      <section className="growth-charts-section">
        <div className="container chart-card-outer">
          <div className="chart-card-inner">
            <div className="chart-header-row">
              <div>
                <h2>Real-Time Organization Growth</h2>
                <p>No estimates or demo statistics. Displays our actual verified database values.</p>
              </div>

              {/* Chart Toggle Navigation */}
              <div className="chart-nav-toggles">
                <button 
                  className={`chart-nav-btn ${chartMetric === 'students' ? 'active' : ''}`}
                  onClick={() => setChartMetric('students')}
                >
                  <Users size={16} /> Students Cohorts
                </button>
                <button 
                  className={`chart-nav-btn ${chartMetric === 'hours' ? 'active' : ''}`}
                  onClick={() => setChartMetric('hours')}
                >
                  <TrendingUp size={16} /> Service Hours
                </button>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="svg-chart-container">
              <svg viewBox="0 0 500 270" width="100%" height="100%">
                {/* Horizontal grid lines */}
                <line x1="40" y1="220" x2="480" y2="220" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="40" y1="160" x2="480" y2="160" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="40" y1="40" x2="480" y2="40" stroke="#E2E8F0" strokeWidth="1" />

                {/* Y-Axis scale text */}
                <text x="15" y="225" fill="#94A3B8" fontSize="10">0</text>
                <text x="10" y="165" fill="#94A3B8" fontSize="10">
                  {chartMetric === 'students' 
                    ? Math.max(1, Math.floor(studentsReachedVal * 0.5)).toLocaleString() 
                    : Math.max(1, Math.floor(serviceHoursVal * 0.5)).toLocaleString()}
                </text>
                <text x="10" y="45" fill="#94A3B8" fontSize="10">
                  {chartMetric === 'students' ? studentsReachedVal.toLocaleString() : serviceHoursVal.toLocaleString()}
                </text>

                {/* Animated Line Path */}
                <polyline 
                  fill="none" 
                  stroke="var(--color-primary)" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  points={polylinePath} 
                />

                {/* Plot circle points & numerical markers */}
                {chartPoints.map((pt, i) => (
                  <g key={i} className="chart-group-node">
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="6" 
                      fill="var(--color-secondary)" 
                      stroke="#FFFFFF" 
                      strokeWidth="2" 
                    />
                    <rect 
                      x={pt.x - 30} 
                      y={pt.y - 32} 
                      width="60" 
                      height="20" 
                      rx="4" 
                      fill="#0F172A" 
                      opacity="0.9" 
                    />
                    <text 
                      x={pt.x} 
                      y={pt.y - 18} 
                      fill="#FFFFFF" 
                      fontSize="9" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      {pt.value.toLocaleString()}
                    </text>
                    <text 
                      x={pt.x} 
                      y="250" 
                      fill="#475569" 
                      fontSize="11" 
                      fontWeight="600" 
                      textAnchor="middle"
                    >
                      {pt.year}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Future Impact Stories (Replaces Fictional Success Stories) */}
      <section className="student-stories-section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <header className="text-center">
            <h2 className="section-title">Future Impact Stories</h2>
            <p className="subtitle">Documenting our journey from founding steps to structural neighborhood change.</p>
          </header>

          <div className="story-card-item" style={{ padding: "4rem", textAlign: "center" }}>
            <span className="story-quote-symbol" style={{ left: "calc(50% - 2rem)" }}>“</span>
            <p className="story-quote-text" style={{ fontSize: "1.2rem", color: "var(--color-text-muted)", fontStyle: "normal", marginBottom: "1.5rem" }}>
              "As Future Ready Youth grows, this section will showcase the real stories of students, volunteers, and communities positively impacted by our mission."
            </p>
            <span className="badge" style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>Our Promise</span>
          </div>
        </div>
      </section>

      {/* CTA Onward */}
      <section className="impact-cta-onward">
        <div className="container cta-banner text-center">
          <h2>Be Part of Our Founding Story</h2>
          <p>Help us move these counters from zero. Your time, support, and advocacy will shape the leaders of tomorrow.</p>
          <div className="cta-onward-btns">
            <Link href="/volunteer" className="btn btn-accent btn-large">
              Apply to Volunteer
            </Link>
            <Link href="/involved" className="btn btn-outline btn-large" style={{ color: 'var(--color-white)', borderColor: 'var(--color-white)' }}>
              Become a Supporter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
