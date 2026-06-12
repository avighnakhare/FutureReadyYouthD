import { Award, Compass, Heart, Shield, Users, BookOpen, User, Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { initializeDatabase } from "@/lib/init";
import "./About.css";

export const dynamic = "force-dynamic";

export default async function About() {
  // Guarantee DB initialized
  await initializeDatabase();

  // Load CMS Content keys
  const contents = await prisma.content.findMany({
    where: {
      key: { in: ["about_story", "about_mission", "about_vision"] }
    }
  });

  const contentMap = contents.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const coreValues = [
    {
      title: "Leadership",
      desc: "Guiding students to take initiative, inspire others, and lead with empathy, confidence, and purpose.",
      icon: <Award size={24} />,
      colorClass: "blue"
    },
    {
      title: "Innovation",
      desc: "Encouraging creativity, experimental thinking, and hands-on exposure to modern technologies.",
      icon: <Compass size={24} />,
      colorClass: "green"
    },
    {
      title: "Service",
      desc: "Instilling a deep sense of civic duty, community empathy, and active participation in local service.",
      icon: <Heart size={24} />,
      colorClass: "orange"
    },
    {
      title: "Integrity",
      desc: "Fostering absolute honesty, ethical choices, transparency, and responsibility in every endeavor.",
      icon: <Shield size={24} />,
      colorClass: "purple"
    },
    {
      title: "Inclusion",
      desc: "Ensuring every single young person, regardless of background, enjoys supportive learning access.",
      icon: <Users size={24} />,
      colorClass: "pink"
    },
    {
      title: "Lifelong Learning",
      desc: "Cultivating a perpetual curiosity, self-development drive, and constructive problem-solving skills.",
      icon: <BookOpen size={24} />,
      colorClass: "yellow"
    }
  ];

  return (
    <div className="about-page animate-fade-in">
      {/* Page Header */}
      <section className="about-hero-section">
        <div className="container text-center">
          <span className="about-badge">Who We Are</span>
          <h1 className="section-title">About Future Ready Youth</h1>
          <p className="subtitle">Learn about our story, foundational values, and our commitment to the next generation.</p>
        </div>
      </section>

      {/* Story, Vision, Mission */}
      <section className="story-vision-mission-section">
        <div className="container grid-container">
          <div className="about-main-card story-card">
            <span className="card-tag">Our Story</span>
            <h2>How We Started</h2>
            <p>
              {contentMap.about_story || "Future Ready Youth was created to help students gain practical, real-world skills often not taught in traditional classrooms."}
            </p>
          </div>

          <div className="mv-cards-wrapper">
            <div className="sub-mv-card mission">
              <h3>Our Mission</h3>
              <p>
                {contentMap.about_mission || "Future Ready Youth empowers students with leadership skills, technology exposure, community service opportunities, and real-world experiences that prepare them to become future leaders, innovators, and changemakers."}
              </p>
            </div>

            <div className="sub-mv-card vision">
              <h3>Our Vision</h3>
              <p>
                {contentMap.about_vision || "To create a generation of confident, skilled, and service-minded leaders."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values-section">
        <div className="container">
          <header className="text-center">
            <h2 className="section-title">Our Core Values</h2>
            <p className="subtitle">These pillars anchor every program, workshop, and community interaction we coordinate.</p>
          </header>

          <div className="values-grid">
            {coreValues.map((val, idx) => (
              <div key={idx} className="value-card">
                <div className={`value-icon-box ${val.colorClass}`}>
                  {val.icon}
                </div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Co-Founders (Actual Leadership Area) */}
      <section className="founder-section">
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          <div className="founder-info-side text-center" style={{ alignItems: "center", width: "100%", maxWidth: "100%", gap: "1rem" }}>
            <span className="card-tag">Leadership Team</span>
            <h2>Meet Our Co-Founders</h2>
            <p className="founder-quote" style={{ borderLeft: "none", paddingLeft: 0, textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
              "Every young person carries a spark of genius. Our job is to give them the tools, the tech, the mentors, and the space to let that spark burn bright."
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", marginTop: "1rem" }}>
            {/* Co-Founder 1: Avighna Khare */}
            <div className="founder-photo-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="founder-photo-avatar" style={{ background: "var(--color-primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                <User size={48} />
              </div>
              <div className="founder-photo-details">
                <h3>Avighna Khare</h3>
                <p className="founder-title">Co-Founder & Director</p>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  Information Required From Organization
                </p>
                <div className="founder-socials">
                  <a href="mailto:futurereadyyouth6@gmail.com" className="founder-social-link" aria-label="Email">
                    <Mail size={16} style={{marginRight: '4px'}} /> Email
                  </a>
                </div>
              </div>
            </div>

            {/* Co-Founder 2: Sourish Kura */}
            <div className="founder-photo-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="founder-photo-avatar" style={{ background: "var(--color-primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                <User size={48} />
              </div>
              <div className="founder-photo-details">
                <h3>Sourish Kura</h3>
                <p className="founder-title">Co-Founder & Director</p>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  Information Required From Organization
                </p>
                <div className="founder-socials">
                  <a href="mailto:futurereadyyouth6@gmail.com" className="founder-social-link" aria-label="Email">
                    <Mail size={16} style={{marginRight: '4px'}} /> Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
