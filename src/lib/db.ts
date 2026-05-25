import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./auth";

// Define the Mock Prisma Client, cast as PrismaClient to maintain full compilation type-safety
export const prisma = {
  user: {
    count: async () => 1,
    create: async ({ data }: any) => ({ ...data, id: "admin-id" }),
    findUnique: async ({ where }: any) => {
      if (where.username === "Founder" || where.id === "Founder") {
        return {
          id: "Founder",
          username: "Founder",
          passwordHash: hashPassword("TEMPORARY_PASSWORD_CHANGE_ME"),
          mustChangePassword: false,
          createdAt: new Date(),
        };
      }
      return null;
    },
    update: async ({ where, data }: any) => ({
      id: "Founder",
      username: "Founder",
      passwordHash: data.passwordHash || hashPassword("TEMPORARY_PASSWORD_CHANGE_ME"),
      mustChangePassword: data.mustChangePassword !== undefined ? data.mustChangePassword : false,
      createdAt: new Date(),
    })
  },
  session: {
    create: async ({ data }: any) => ({ ...data, id: "session-" + Math.random().toString(36).substring(2) }),
    findUnique: async ({ where }: any) => ({
      id: where.id,
      userId: "Founder",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date()
    }),
    delete: async ({ where }: any) => ({ id: where.id })
  },
  systemMetric: {
    count: async () => 1,
    create: async ({ data }: any) => data,
    findUnique: async ({ where }: any) => ({
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
    }),
    update: async ({ where, data }: any) => ({
      id: "metrics",
      studentsReached: data.studentsReached !== undefined ? data.studentsReached : 380,
      volunteersEngaged: data.volunteersEngaged !== undefined ? data.volunteersEngaged : 42,
      serviceHours: data.serviceHours !== undefined ? data.serviceHours : 1250,
      communityProjects: data.communityProjects !== undefined ? data.communityProjects : 18,
      eventsHosted: data.eventsHosted !== undefined ? data.eventsHosted : 24,
      mentors: data.mentors !== undefined ? data.mentors : 15,
      donationsReceived: data.donationsReceived !== undefined ? data.donationsReceived : 8500.0,
      resourcesDistributed: data.resourcesDistributed !== undefined ? data.resourcesDistributed : 120,
      partnerships: data.partnerships !== undefined ? data.partnerships : 8,
    })
  },
  content: {
    count: async () => 10,
    createMany: async () => ({ count: 10 }),
    findMany: async (args?: any) => {
      const defaultContent = [
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
      ];

      if (args && args.where && args.where.key && args.where.key.in) {
        return defaultContent.filter(c => args.where.key.in.includes(c.key));
      }
      return defaultContent;
    },
    upsert: async ({ where, update, create }: any) => ({
      key: where.key,
      value: update.value || create.value
    })
  },
  program: {
    count: async () => 6,
    createMany: async () => ({ count: 6 }),
    findMany: async () => getMockPrograms(),
    update: async ({ where, data }: any) => ({
      id: where.id,
      title: data.title || "Program",
      subtitle: data.subtitle || "",
      iconName: data.iconName || "Award",
      description: data.description || "",
      objectives: data.objectives || "",
      benefits: data.benefits || "",
      futureGoals: data.futureGoals || "",
      themeClass: data.themeClass || "blue"
    })
  },
  faq: {
    count: async () => 15,
    createMany: async () => ({ count: 15 }),
    findMany: async (args?: any) => {
      const allFaqs = getMockFaqs();
      if (args && args.orderBy) {
        return allFaqs;
      }
      return allFaqs;
    },
    create: async ({ data }: any) => ({ ...data, id: "faq-" + Math.random().toString(36).substring(2), createdAt: new Date() }),
    update: async ({ where, data }: any) => ({
      id: where.id,
      question: data.question || "",
      answer: data.answer || "",
      category: data.category || "General",
      createdAt: new Date()
    }),
    delete: async ({ where }: any) => ({ id: where.id })
  },
  resource: {
    count: async () => 2,
    createMany: async () => ({ count: 2 }),
    findMany: async (args?: any) => {
      const allResources = getMockResources();
      if (args && args.orderBy) {
        return allResources;
      }
      return allResources;
    },
    create: async ({ data }: any) => ({ ...data, id: "res-" + Math.random().toString(36).substring(2), createdAt: new Date() }),
    delete: async ({ where }: any) => ({ id: where.id })
  },
  event: {
    findMany: async (args?: any) => getMockEvents(),
    findUnique: async ({ where }: any) => getMockEvents().find(e => e.id === where.id) || null,
    create: async ({ data }: any) => ({
      ...data,
      id: "event-" + Math.random().toString(36).substring(2),
      spotsLeft: data.capacity || 20,
      createdAt: new Date()
    }),
    update: async ({ where, data }: any) => {
      const match = getMockEvents().find(e => e.id === where.id) || getMockEvents()[0];
      return {
        ...match,
        ...data,
        spotsLeft: data.spotsLeft !== undefined ? data.spotsLeft : (data.capacity !== undefined ? data.capacity : match.spotsLeft)
      };
    },
    delete: async ({ where }: any) => ({ id: where.id })
  },
  eventRegistration: {
    create: async ({ data }: any) => ({
      ...data,
      id: "reg-" + Math.random().toString(36).substring(2),
      createdAt: new Date()
    })
  },
  volunteer: {
    create: async ({ data }: any) => ({
      ...data,
      id: "vol-" + Math.random().toString(36).substring(2),
      status: "New",
      createdAt: new Date()
    }),
    findMany: async (args?: any) => getMockVolunteers(),
    update: async ({ where, data }: any) => {
      const match = getMockVolunteers().find(v => v.id === where.id) || getMockVolunteers()[0];
      return {
        ...match,
        status: data.status || match.status
      };
    }
  },
  $transaction: async (promises: any[]) => {
    return Promise.all(promises);
  }
} as unknown as PrismaClient;

function getMockPrograms() {
  return [
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
  ];
}

function getMockFaqs() {
  return [
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
    { id: "f15", category: "Parents & Sponsors", question: "Are individual donations tax-deductible?", answer: "Yes. Future Ready Youth is a registered 501(c)(3) nonprofit organization. All individual financial contributions are tax-deductible to the fullest extent permitted by law. You will receive an official tax receipt.", createdAt: new Date() }
  ];
}

function getMockResources() {
  return [
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
  ];
}

function getMockEvents() {
  return [
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
  ];
}

function getMockVolunteers() {
  return [
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
  ];
}
