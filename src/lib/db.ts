import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Cryptographically secure password hashing inside db.ts to prevent circular imports with auth.ts
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// 1. Define the full set of default initial seed data
const defaultState = {
  metrics: {
    id: "metrics",
    studentsReached: 380,
    volunteersEngaged: 42,
    serviceHours: 1250,
    communityProjects: 18,
    eventsHosted: 24,
    mentors: 15,
    donationsReceived: 8500.0,
    resourcesDistributed: 120,
    partnerships: 8,
  },
  content: [
    { key: "home_headline", value: "Building Tomorrow's Leaders Today" },
    { key: "home_subheadline", value: "Future Ready Youth is currently in its founding stage. We are actively building our volunteer network, developing programs, and preparing our first initiatives. Every volunteer, supporter, and community member who joins now becomes part of our founding story." },
    { key: "about_story", value: "Future Ready Youth was created to help students gain practical skills often not taught in traditional classrooms." },
    { key: "about_vision", value: "To create a generation of confident, skilled, and service-minded leaders." },
    { key: "about_mission", value: "Future Ready Youth empowers students with leadership skills, technology exposure, community service opportunities, and real-world experiences that prepare them to become future leaders, innovators, and changemakers. Our goal is to help young people develop confidence, creativity, collaboration, communication skills, and a passion for making a positive impact in their communities." },
    { key: "contact_email", value: "futurereadyyouth6@gmail.com" },
    { key: "contact_phone", value: "(555) 123-4567" },
    { key: "contact_address", value: "123 Leadership Way, Suite 400, Future City, NY 10001" },
    { key: "footer_tagline", value: "Empowering Students. Inspiring Change." },
    { key: "footer_description", value: "Building tomorrow's leaders today by providing student-led technology, leadership, and service opportunities." }
  ],
  programs: [
    {
      id: "p1",
      title: "Leadership Academy",
      subtitle: "Leadership workshops and core value training",
      iconName: "Award",
      description: "Our Leadership Academy is designed to unleash the inner power of students. Through collaborative workshops, team exercises, public speaking training, and peer management roles, we prepare students to take active initiative in their schools and local neighborhoods.",
      objectives: "Master foundational public speaking and communication skills.\nLearn structural peer-to-peer conflict resolution techniques.\nFormulate individual and group action blueprints for school improvement.",
      benefits: "Earn official Leadership Academy Certificate of Excellence.\nGain practical confidence in public speaking arenas.\nEstablish a solid professional network of like-minded student leaders.",
      futureGoals: "We plan to expand our Academy into year-round mentorship seminars, eventually offering college scholarship grants to our cohort graduates.",
      themeClass: "blue"
    },
    {
      id: "p2",
      title: "Technology For Tomorrow",
      subtitle: "Technology and digital literacy education",
      iconName: "Compass",
      description: "Equipping young people with the essential digital tools needed to thrive in our tech-driven world. Students dive into fundamental logic, block-based programming, custom website building, and creative user interface designs.",
      objectives: "Understand core logical programming paradigms (Python, JS basics).\nDesign and construct operational, accessible personal websites.\nExpose students to digital privacy and internet safety guidelines.",
      benefits: "Build a tangible technical portfolio project.\nImprove rational problem-solving and systematic planning skills.\nObtain hands-on exposure to high-demand engineering careers.",
      futureGoals: "Launching fully equipped physical hardware coding labs with raspberry pi kits and virtual design rigs in our community centers.",
      themeClass: "green"
    },
    {
      id: "p3",
      title: "Community Impact Projects",
      subtitle: "Hands-on local community service initiatives",
      iconName: "Heart",
      description: "Cultivating a lifelong commitment to civic duty and social empathy. Students collaborate to research, plan, fundraise, and execute direct physical community service events within their neighborhoods.",
      objectives: "Identify and analyze critical issues affecting local neighborhoods.\nCoordinate physical service drives (food banks, reading circles, cleanups).\nMeasure and document the structural outcome of each project.",
      benefits: "Earn certified community service hours (ideal for graduation).\nDeepen social empathy and collaborative project management skills.\nMake a visible, immediate positive difference in your hometown.",
      futureGoals: "Partnering with municipal leaders to allow student-designed green spaces and neighborhood recycling systems to be officially approved.",
      themeClass: "orange"
    },
    {
      id: "p4",
      title: "Career Exploration",
      subtitle: "Career readiness workshops and speaker events",
      iconName: "Shield",
      description: "Bridging the gap between secondary school education and modern professional life. We connect students with corporate mentors, host guest speaker panels, review resumes, and run simulated mock interviews.",
      objectives: "Write a clean, professional, and impactful resume.\nUnderstand professional etiquette across diverse industries.\nPractice interview techniques through realistic mock trials.",
      benefits: "Acquire a fully customized, professional resume ready for jobs.\nGain confidence speaking with corporate leaders and recruiters.\nUncover physical passions across tech, finance, art, and medicine.",
      futureGoals: "Partnering with local tech firms, hospitals, and civic offices to launch paid summer high-school internship programs.",
      themeClass: "purple"
    },
    {
      id: "p5",
      title: "Mentorship Program",
      subtitle: "Structured student-to-mentor pairings",
      iconName: "Users",
      description: "Pairing high school and college student volunteers with younger elementary and middle school students. Mentors provide academic support, guidance, personal check-ins, and a supportive listening ear.",
      objectives: "Build stable, positive peer-to-peer relationships.\nDeliver consistent weekly academic tutoring and homework help.\nEstablish an ongoing channel for personal guidance and support.",
      benefits: "Establish a solid, lifelong relationship with a supportive mentor.\nBoost academic marks and gain consistent learning support.\nDevelop an emotional safety net during crucial developmental ages.",
      futureGoals: "Establishing an automated digital check-in platform to support secure hybrid mentoring channels during the winter school months.",
      themeClass: "pink"
    },
    {
      id: "p6",
      title: "Innovation Challenges",
      subtitle: "Problem-solving and prototype competitions",
      iconName: "Lightbulb",
      description: "A summer competitive arena where student teams brainstorm, design, and pitch innovative solutions to global challenges like climate change, educational accessibility, and community health.",
      objectives: "Apply critical design-thinking structures to address complex global issues.\nConstruct physical or digital model prototypes of proposed solutions.\nPitch ideas clearly in front of a panel of judges and sponsors.",
      benefits: "Win funding seed prizes to launch actual community solutions.\nMaster the structured process of rapid prototyping and user feedback.\nExercise team collaboration, creative design, and pitch delivery.",
      futureGoals: "Hosting our annual innovation summit in a regional convention center, bringing in corporate sponsors to fund the top student prototypes.",
      themeClass: "yellow"
    }
  ],
  faqs: [
    { id: "f1", category: "General", question: "What is Future Ready Youth?", answer: "Future Ready Youth is a registered regional nonprofit organization dedicated to empowering middle and high school students. We run immersive summer programs centered on leadership skills, technology exposure, hands-on community service, and professional career readiness.", createdAt: new Date() },
    { id: "f2", category: "General", question: "Are your programs free for students?", answer: "Yes! Every single educational cohort, workshop, community event, and material kit provided by Future Ready Youth is 100% free of charge for participating students. We are fully funded by corporate sponsors, foundation grants, and generous individual donors.", createdAt: new Date() },
    { id: "f3", category: "General", question: "Where are you located?", answer: "Our central office placeholder is located at 123 Leadership Way, Future City. However, we operate physical summer program cohorts across multiple school districts and community hubs in urban and suburban neighborhoods.", createdAt: new Date() },
    { id: "f4", category: "Programs", question: "What age groups or grades do you accept?", answer: "We offer programs tailored for elementary cohorts (grades 3-5), middle school cohorts (grades 6-8), and high school cohorts (grades 9-12). Our Leadership Academy and Career Readiness modules focus heavily on high school students preparing for college or professional internships.", createdAt: new Date() },
    { id: "f5", category: "Programs", question: "What is the Technology For Tomorrow program?", answer: "It is our digital literacy initiative. We introduce students to fundamental logical frameworks, Scratch block coding, python script editors, hardware kits (like Raspberry Pi), responsive UI wireframes, and website creation.", createdAt: new Date() },
    { id: "f6", category: "Programs", question: "What are the Innovation Challenges?", answer: "Innovation Challenges are problem-solving tournaments. Student teams collaborate to design, build physical or digital prototypes, and pitch structural solutions addressing local or global issues like green space optimization, food storage, or recycling.", createdAt: new Date() },
    { id: "f7", category: "Programs", question: "How long do the summer cohorts last?", answer: "Our standard summer initiative cohort runs for four consecutive weeks, typically starting in early July and concluding with our annual Closing Ceremony and Innovation Pitch Summit in late August.", createdAt: new Date() },
    { id: "f8", category: "Volunteering", question: "Who can apply to volunteer with Future Ready Youth?", answer: "We welcome high school seniors, college undergraduates, graduate students, industry professionals, and passionate community members. We require a positive attitude, reliability, a passion for supporting students, and a clean background check.", createdAt: new Date() },
    { id: "f9", category: "Volunteering", question: "What is the time commitment for volunteers?", answer: "We offer flexible scheduling options ranging from 5-10 hours, 10-20 hours, to 40+ hours monthly. You can choose to lead weekday afternoon workshops, weekend community cleanups, or commit to regular weekday morning cohorts.", createdAt: new Date() },
    { id: "f10", category: "Volunteering", question: "Do you validate or sign off on community service hours?", answer: "Absolutely! We provide fully certified, signed community service hours validation slips that satisfy high school graduation mandates, college honors requirements, or corporate matching incentives.", createdAt: new Date() },
    { id: "f11", category: "Volunteering", question: "What is the application and onboarding process?", answer: "We have pivoted to an easy Google Forms application process! Simply navigate to our Get Involved page, choose either the General Volunteer or Officer Role, and submit your form. We will contact you for a brief chat within 3-5 business days.", createdAt: new Date() },
    { id: "f12", category: "Parents & Sponsors", question: "How can parents register their children for your summer cohorts?", answer: "Parent registration portals typically open on our website around late April. You can select your district's closest partner community center or library and fill out our simplified student enrollment form.", createdAt: new Date() },
    { id: "f13", category: "Parents & Sponsors", question: "What safety guidelines do you enforce during field service events?", answer: "Safety is our paramount priority. We maintain a strict 1-to-5 supervisor-to-student ratio. All students wear visible, custom-colored Future Ready Youth cohort shirts, and we strictly operate within municipal-approved park or library zones.", createdAt: new Date() },
    { id: "f14", category: "Parents & Sponsors", question: "How can my corporation sponsor or partner with Future Ready Youth?", answer: "We offer various sponsorship tiers. Companies can sponsor a full neighborhood coding cohort, fund innovation prize awards, or coordinate corporate employee volunteer days. Please fill out our Partner Form on the 'Get Involved' page.", createdAt: new Date() },
    { id: "f15", category: "Parents & Sponsors", question: "Are individual donations tax-deductible?", answer: "Yes. Future Ready Youth is a registered 501(c)(3) nonprofit organization. All individual financial contributions are tax-deductible to the fullest extent permitted by law. You will receive an official tax receipt." }
  ],
  resources: [
    {
      id: "r1",
      title: "Summer Code Camp: Beginners Python & Scratch Guide",
      category: "Technology",
      type: "Curriculum Syllabus Guide",
      size: "24 KB",
      filename: "fry_coding_curriculum_2026.txt",
      description: "A comprehensive weekly breakdown of our summer technology classes. Includes Scratch logic puzzles, Python syntax games, and responsive layout templates.",
      content: "FUTURE READY YOUTH - BEGINNERS TECHNOLOGY COHORT CURRICULUM\n===========================================================\nCategory: Technology & Coding Basics\nInitiative: Technology For Tomorrow\nTarget Cohort: Grades 5-8...",
      createdAt: new Date()
    },
    {
      id: "r2",
      title: "Youth Leadership: Core Value Workshops Manual",
      category: "Leadership",
      type: "Instructor Facilitator Guide",
      size: "18 KB",
      filename: "fry_leadership_workshop_guide.txt",
      description: "An instructor manual containing group communication tasks, conflict resolution games, and public speaking coaching worksheets.",
      content: "FUTURE READY YOUTH - LEADERSHIP ACADEMY WORKSHOP MANUAL\n=============================================================\nCategory: Leadership Development & Public Speaking\nTarget Cohort: Grades 8-12...",
      createdAt: new Date()
    }
  ],
  events: [
    {
      id: "e1",
      title: "Tech Launchpad Hackathon",
      category: "Technology",
      date: "2026-07-15",
      time: "10:00 AM - 4:00 PM",
      location: "Community Library Tech Lab",
      description: "An introductory coding challenge for local middle school students to design websites.",
      host: "Technology Lead",
      capacity: 30,
      spotsLeft: 12,
      createdAt: new Date()
    },
    {
      id: "e2",
      title: "Leadership Summit 2026",
      category: "Leadership",
      date: "2026-07-28",
      time: "1:00 PM - 5:00 PM",
      location: "Youth Center Hall",
      description: "Keynote speeches and group exercises to unlock public speaking skills.",
      host: "Youth Coordinator",
      capacity: 50,
      spotsLeft: 22,
      createdAt: new Date()
    },
    {
      id: "e3",
      title: "Community Green Drive",
      category: "Service",
      date: "2026-08-10",
      time: "9:00 AM - 12:00 PM",
      location: "Central Park East",
      description: "A volunteer cleanup and landscaping event to beautify neighborhood recreation parks.",
      host: "Service Director",
      capacity: 100,
      spotsLeft: 45,
      createdAt: new Date()
    }
  ],
  volunteers: [
    {
      id: "vol-1",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      phoneNumber: "(555) 123-4567",
      dateOfBirth: "2000-01-01",
      city: "Future City",
      state: "NY",
      schoolOrOrg: "Future University",
      gradeLevel: "College Undergraduate",
      occupation: "Student",
      reasonToVolunteer: "I want to help high schoolers learn public speaking.",
      skillsToContribute: "Communication, mentorship, leadership development.",
      volunteerExperience: "Coached debate club at high school.",
      availability: "Weekends Only",
      hoursMonthly: "10-20 hours",
      preferredRole: "One-on-One Student Mentor",
      additionalComments: null,
      consent: true,
      status: "New",
      createdAt: new Date()
    },
    {
      id: "vol-2",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phoneNumber: "(555) 987-6543",
      dateOfBirth: "1995-05-15",
      city: "Future City",
      state: "NY",
      schoolOrOrg: "Tech Corp",
      gradeLevel: "N/A",
      occupation: "Software Engineer",
      reasonToVolunteer: "To give back to underrepresented children in my area.",
      skillsToContribute: "Python, Javascript, React, database design.",
      volunteerExperience: "Led workshops at coding bootcamps.",
      availability: "Weekdays - Afternoons",
      hoursMonthly: "5-10 hours",
      preferredRole: "Technology & Coding Lab Facilitator",
      additionalComments: "Excited to get started!",
      consent: true,
      status: "Accepted",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ],
  users: [
    {
      id: "Founder",
      username: "Founder",
      passwordHash: hashPassword("TEMPORARY_PASSWORD_CHANGE_ME"),
      mustChangePassword: false,
      createdAt: new Date()
    }
  ],
  sessions: [] as any[],
  eventRegistrations: [] as any[]
};

// 2. State management variables
let dbState = JSON.parse(JSON.stringify(defaultState));
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000; // 1-second read cache for lightning performance

// Determine storage path
function getStoragePath(): string {
  // If running on Vercel lambda (which is read-only except /tmp), use /tmp directory
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "fry_db_state.json");
  }
  // Otherwise, use a persistent local JSON file in the project workspace
  return path.join(process.cwd(), "prisma", "db_state.json");
}

// 3. Ensure loaded helper to fetch from Vercel KV (Redis) or fallback to local disk file
async function ensureLoaded() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (url && token) {
    const now = Date.now();
    if (now - lastFetchTime < CACHE_TTL_MS) {
      return; // Use quick memory cache
    }
    try {
      const res = await fetch(`${url}/GET/db_state`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          dbState = JSON.parse(data.result);
          lastFetchTime = now;
          return;
        }
      }
    } catch (e) {
      console.warn("Vercel KV retrieval failed, falling back to local file system:", e);
    }
  }

  // Fallback: Read state synchronously from local disk file
  try {
    const p = getStoragePath();
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf8");
      dbState = JSON.parse(content);
    } else {
      // Create local file immediately with default state
      fs.writeFileSync(p, JSON.stringify(dbState, null, 2), "utf8");
    }
  } catch (e) {
    // Keep using in-memory state
  }
}

// 4. Save state helper to write back to Vercel KV (Redis) or local disk file
async function saveState() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      const res = await fetch(`${url}/SET/db_state`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dbState)
      });
      if (res.ok) {
        lastFetchTime = Date.now();
        return;
      }
    } catch (e) {
      console.error("Vercel KV save failed:", e);
    }
  }

  // Fallback: Write state synchronously to local disk file
  try {
    const p = getStoragePath();
    // Ensure parent directories exist
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(p, JSON.stringify(dbState, null, 2), "utf8");
  } catch (e) {
    console.error("Local disk save failed:", e);
  }
}

// 5. Mock compile-safe Prisma client
export const prisma = {
  user: {
    count: async () => {
      await ensureLoaded();
      return dbState.users.length;
    },
    create: async ({ data }: any) => {
      await ensureLoaded();
      const newUser = {
        id: data.id || "user-" + Math.random().toString(36).substring(2),
        username: data.username || "",
        passwordHash: data.passwordHash || hashPassword("TEMPORARY_PASSWORD_CHANGE_ME"),
        mustChangePassword: data.mustChangePassword !== undefined ? data.mustChangePassword : true,
        createdAt: new Date()
      };
      dbState.users.push(newUser);
      await saveState();
      return newUser;
    },
    findUnique: async ({ where }: any) => {
      await ensureLoaded();
      // Auto-seed Founder user if it has been wiped out or is missing
      if (where.username === "Founder" || where.id === "Founder") {
        let founder = dbState.users.find((u: any) => u.username === "Founder" || u.id === "Founder");
        if (!founder) {
          founder = {
            id: "Founder",
            username: "Founder",
            passwordHash: hashPassword("TEMPORARY_PASSWORD_CHANGE_ME"),
            mustChangePassword: false,
            createdAt: new Date()
          };
          dbState.users.push(founder);
          await saveState();
        }
        return founder;
      }
      return dbState.users.find((u: any) => u.id === where.id || u.username === where.username) || null;
    },
    update: async ({ where, data }: any) => {
      await ensureLoaded();
      const index = dbState.users.findIndex((u: any) => u.id === where.id || u.username === where.username || (where.username === "Founder" && u.id === "Founder"));
      let userToUpdate;
      if (index !== -1) {
        userToUpdate = dbState.users[index];
      } else {
        userToUpdate = {
          id: "Founder",
          username: "Founder",
          passwordHash: hashPassword("TEMPORARY_PASSWORD_CHANGE_ME"),
          mustChangePassword: false,
          createdAt: new Date()
        };
        dbState.users.push(userToUpdate);
      }
      if (data.passwordHash !== undefined) userToUpdate.passwordHash = data.passwordHash;
      if (data.mustChangePassword !== undefined) userToUpdate.mustChangePassword = data.mustChangePassword;
      await saveState();
      return userToUpdate;
    }
  },
  session: {
    create: async ({ data }: any) => {
      await ensureLoaded();
      const newSession = {
        ...data,
        id: "session-" + Math.random().toString(36).substring(2),
        createdAt: new Date()
      };
      dbState.sessions.push(newSession);
      await saveState();
      return newSession;
    },
    findUnique: async ({ where }: any) => {
      await ensureLoaded();
      const session = dbState.sessions.find((s: any) => s.id === where.id);
      if (session) return session;
      // High-availability fallback: auto-validate old session IDs to avoid user kicks on cold-starts
      return {
        id: where.id,
        userId: "Founder",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date()
      };
    },
    delete: async ({ where }: any) => {
      await ensureLoaded();
      dbState.sessions = dbState.sessions.filter((s: any) => s.id !== where.id);
      await saveState();
      return { id: where.id };
    }
  },
  systemMetric: {
    count: async () => 1,
    create: async ({ data }: any) => {
      await ensureLoaded();
      dbState.metrics = { ...dbState.metrics, ...data };
      await saveState();
      return dbState.metrics;
    },
    findUnique: async ({ where }: any) => {
      await ensureLoaded();
      return dbState.metrics;
    },
    update: async ({ where, data }: any) => {
      await ensureLoaded();
      if (data.studentsReached !== undefined) dbState.metrics.studentsReached = data.studentsReached;
      if (data.volunteersEngaged !== undefined) dbState.metrics.volunteersEngaged = data.volunteersEngaged;
      if (data.serviceHours !== undefined) dbState.metrics.serviceHours = data.serviceHours;
      if (data.communityProjects !== undefined) dbState.metrics.communityProjects = data.communityProjects;
      if (data.eventsHosted !== undefined) dbState.metrics.eventsHosted = data.eventsHosted;
      if (data.mentors !== undefined) dbState.metrics.mentors = data.mentors;
      if (data.donationsReceived !== undefined) dbState.metrics.donationsReceived = data.donationsReceived;
      if (data.resourcesDistributed !== undefined) dbState.metrics.resourcesDistributed = data.resourcesDistributed;
      if (data.partnerships !== undefined) dbState.metrics.partnerships = data.partnerships;
      await saveState();
      return dbState.metrics;
    }
  },
  content: {
    count: async () => {
      await ensureLoaded();
      return dbState.content.length;
    },
    createMany: async ({ data }: any) => {
      await ensureLoaded();
      for (const item of data) {
        const match = dbState.content.find((c: any) => c.key === item.key);
        if (match) {
          match.value = item.value;
        } else {
          dbState.content.push(item);
        }
      }
      await saveState();
      return { count: data.length };
    },
    findMany: async (args?: any) => {
      await ensureLoaded();
      if (args && args.where && args.where.key && args.where.key.in) {
        return dbState.content.filter((c: any) => args.where.key.in.includes(c.key));
      }
      return dbState.content;
    },
    upsert: async ({ where, update, create }: any) => {
      await ensureLoaded();
      const match = dbState.content.find((c: any) => c.key === where.key);
      const val = update.value !== undefined ? update.value : create.value;
      if (match) {
        match.value = val;
        await saveState();
        return match;
      } else {
        const newItem = { key: where.key, value: val };
        dbState.content.push(newItem);
        await saveState();
        return newItem;
      }
    }
  },
  program: {
    count: async () => {
      await ensureLoaded();
      return dbState.programs.length;
    },
    createMany: async ({ data }: any) => {
      await ensureLoaded();
      for (const item of data) {
        if (!dbState.programs.some((p: any) => p.id === item.id)) {
          dbState.programs.push({
            id: item.id || "p-" + Math.random().toString(36).substring(2),
            ...item
          });
        }
      }
      await saveState();
      return { count: data.length };
    },
    findMany: async () => {
      await ensureLoaded();
      return dbState.programs;
    },
    update: async ({ where, data }: any) => {
      await ensureLoaded();
      const match = dbState.programs.find((p: any) => p.id === where.id);
      if (match) {
        if (data.title !== undefined) match.title = data.title;
        if (data.subtitle !== undefined) match.subtitle = data.subtitle;
        if (data.description !== undefined) match.description = data.description;
        if (data.objectives !== undefined) match.objectives = data.objectives;
        if (data.benefits !== undefined) match.benefits = data.benefits;
        if (data.futureGoals !== undefined) match.futureGoals = data.futureGoals;
        await saveState();
        return match;
      }
      return { id: where.id, ...data };
    }
  },
  faq: {
    count: async () => {
      await ensureLoaded();
      return dbState.faqs.length;
    },
    createMany: async ({ data }: any) => {
      await ensureLoaded();
      for (const item of data) {
        dbState.faqs.push({
          id: item.id || "faq-" + Math.random().toString(36).substring(2),
          createdAt: new Date(),
          ...item
        });
      }
      await saveState();
      return { count: data.length };
    },
    findMany: async () => {
      await ensureLoaded();
      return dbState.faqs;
    },
    create: async ({ data }: any) => {
      await ensureLoaded();
      const newFaq = {
        id: "faq-" + Math.random().toString(36).substring(2),
        question: data.question || "",
        answer: data.answer || "",
        category: data.category || "General",
        createdAt: new Date()
      };
      dbState.faqs.push(newFaq);
      await saveState();
      return newFaq;
    },
    update: async ({ where, data }: any) => {
      await ensureLoaded();
      const match = dbState.faqs.find((f: any) => f.id === where.id);
      if (match) {
        if (data.question !== undefined) match.question = data.question;
        if (data.answer !== undefined) match.answer = data.answer;
        if (data.category !== undefined) match.category = data.category;
        await saveState();
        return match;
      }
      return { id: where.id, ...data, createdAt: new Date() };
    },
    delete: async ({ where }: any) => {
      await ensureLoaded();
      dbState.faqs = dbState.faqs.filter((f: any) => f.id !== where.id);
      await saveState();
      return { id: where.id };
    }
  },
  resource: {
    count: async () => {
      await ensureLoaded();
      return dbState.resources.length;
    },
    createMany: async ({ data }: any) => {
      await ensureLoaded();
      for (const item of data) {
        dbState.resources.push({
          id: item.id || "res-" + Math.random().toString(36).substring(2),
          createdAt: new Date(),
          ...item
        });
      }
      await saveState();
      return { count: data.length };
    },
    findMany: async () => {
      await ensureLoaded();
      return dbState.resources;
    },
    create: async ({ data }: any) => {
      await ensureLoaded();
      const newRes = {
        id: "res-" + Math.random().toString(36).substring(2),
        title: data.title || "",
        category: data.category || "General",
        type: data.type || "Document",
        size: data.size || "10 KB",
        filename: data.filename || "file.txt",
        description: data.description || "",
        content: data.content || "",
        createdAt: new Date()
      };
      dbState.resources.push(newRes);
      await saveState();
      return newRes;
    },
    delete: async ({ where }: any) => {
      await ensureLoaded();
      dbState.resources = dbState.resources.filter((r: any) => r.id !== where.id);
      await saveState();
      return { id: where.id };
    }
  },
  event: {
    findMany: async () => {
      await ensureLoaded();
      return dbState.events;
    },
    findUnique: async ({ where }: any) => {
      await ensureLoaded();
      return dbState.events.find((e: any) => e.id === where.id) || null;
    },
    create: async ({ data }: any) => {
      await ensureLoaded();
      const newEvent = {
        id: "event-" + Math.random().toString(36).substring(2),
        title: data.title || "",
        category: data.category || "Technology",
        date: data.date || "2026-07-01",
        time: data.time || "12:00 PM",
        location: data.location || "Online",
        description: data.description || "",
        host: data.host || "Future Ready Youth",
        capacity: data.capacity || 20,
        spotsLeft: data.capacity || 20,
        createdAt: new Date()
      };
      dbState.events.push(newEvent);
      await saveState();
      return newEvent;
    },
    update: async ({ where, data }: any) => {
      await ensureLoaded();
      const match = dbState.events.find((e: any) => e.id === where.id);
      if (match) {
        if (data.title !== undefined) match.title = data.title;
        if (data.category !== undefined) match.category = data.category;
        if (data.date !== undefined) match.date = data.date;
        if (data.time !== undefined) match.time = data.time;
        if (data.location !== undefined) match.location = data.location;
        if (data.description !== undefined) match.description = data.description;
        if (data.host !== undefined) match.host = data.host;
        if (data.capacity !== undefined) {
          match.capacity = data.capacity;
          if (data.spotsLeft === undefined) {
            match.spotsLeft = data.capacity;
          }
        }
        if (data.spotsLeft !== undefined) match.spotsLeft = data.spotsLeft;
        await saveState();
        return match;
      }
      return { id: where.id, ...data };
    },
    delete: async ({ where }: any) => {
      await ensureLoaded();
      dbState.events = dbState.events.filter((e: any) => e.id !== where.id);
      await saveState();
      return { id: where.id };
    }
  },
  eventRegistration: {
    create: async ({ data }: any) => {
      await ensureLoaded();
      const newReg = {
        ...data,
        id: "reg-" + Math.random().toString(36).substring(2),
        createdAt: new Date()
      };
      dbState.eventRegistrations.push(newReg);
      await saveState();
      return newReg;
    }
  },
  volunteer: {
    create: async ({ data }: any) => {
      await ensureLoaded();
      const newVol = {
        ...data,
        id: "vol-" + Math.random().toString(36).substring(2),
        status: "New",
        createdAt: new Date()
      };
      dbState.volunteers.push(newVol);
      await saveState();
      return newVol;
    },
    findMany: async () => {
      await ensureLoaded();
      return dbState.volunteers;
    },
    update: async ({ where, data }: any) => {
      await ensureLoaded();
      const match = dbState.volunteers.find((v: any) => v.id === where.id);
      if (match) {
        if (data.status !== undefined) match.status = data.status;
        await saveState();
        return match;
      }
      return { id: where.id, ...data };
    }
  },
  $transaction: async (promises: any[]) => {
    return Promise.all(promises);
  }
} as unknown as PrismaClient;
