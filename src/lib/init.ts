import { prisma } from "./db";
import { hashPassword } from "./auth";

export async function initializeDatabase() {
  try {
    // 1. Initialize Admin User
    const adminCount = await prisma.user.count();
    if (adminCount === 0) {
      await prisma.user.create({
        data: {
          username: "FutureReadyYouth",
          passwordHash: hashPassword("AvighnaSourish123"),
          mustChangePassword: false
        }
      });
      console.log("Database initialized: Admin account seeded successfully.");
    }

    // 2. Initialize System Metrics starting exactly at 0
    const metricsCount = await prisma.systemMetric.count();
    if (metricsCount === 0) {
      await prisma.systemMetric.create({
        data: {
          id: "metrics",
          studentsReached: 0,
          volunteersEngaged: 0,
          serviceHours: 0,
          communityProjects: 0,
          eventsHosted: 0,
          mentors: 0,
          donationsReceived: 0,
          resourcesDistributed: 0,
          partnerships: 0
        }
      });
      console.log("Database initialized: Startup metrics set to 0.");
    }

    // 3. Initialize Site CMS Key-Value Contents
    const contentCount = await prisma.content.count();
    if (contentCount === 0) {
      const defaultContent = [
        { key: "home_headline", value: "Building Tomorrow's Leaders Today" },
        { key: "home_subheadline", value: "Future Ready Youth is currently in its founding stage. We are actively building our volunteer network, developing programs, and preparing our first initiatives. Every volunteer, supporter, and community member who joins now becomes part of our founding story." },
        
        { key: "about_story", value: "Future Ready Youth was created to help students gain practical skills often not taught in traditional classrooms." },
        { key: "about_vision", value: "To create a generation of confident, skilled, and service-minded leaders." },
        { key: "about_mission", value: "Future Ready Youth empowers students with leadership skills, technology exposure, community service opportunities, and real-world experiences that prepare them to become future leaders, innovators, and changemakers. Our goal is to help young people develop confidence, creativity, collaboration, communication skills, and a passion for making a positive impact in their communities." },
        
        { key: "contact_email", value: "futurereadyyouth6@gmail.com" },
        { key: "contact_phone", value: "+1 (828) 767-8094" },
        { key: "contact_address", value: "" },
        
        { key: "footer_tagline", value: "Empowering Students. Inspiring Change." },
        { key: "footer_description", value: "Building tomorrow's leaders today by providing student-led technology, leadership, and service opportunities." }
      ];
 
      await prisma.content.createMany({
        data: defaultContent
      });
      console.log("Database initialized: CMS Site text seeded.");
    }
 
    // 4. Initialize Core Programs (6 Cohorts)
    const programsCount = await prisma.program.count();
    if (programsCount === 0) {
      const defaultPrograms = [
        {
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
 
      await prisma.program.createMany({
        data: defaultPrograms
      });
      console.log("Database initialized: Programs seeded.");
    }
 
    // 5. Initialize FAQs
    const faqCount = await prisma.faq.count();
    if (faqCount === 0) {
      const defaultFaqs = [
        { category: "General", question: "What is Future Ready Youth?", answer: "Future Ready Youth is a registered regional nonprofit organization dedicated to empowering middle and high school students. We run immersive summer programs centered on leadership skills, technology exposure, hands-on community service, and professional career readiness." },
        { category: "General", question: "Are your programs free for students?", answer: "Yes! Every single educational cohort, workshop, community event, and material kit provided by Future Ready Youth is 100% free of charge for participating students. We are fully funded by corporate sponsors, foundation grants, and community partnerships." },
        { category: "General", question: "Where are you located?", answer: "Future Ready Youth does not maintain a physical office location at this time. However, we operate physical summer program cohorts across multiple school districts and community hubs." },
        { category: "Programs", question: "What age groups or grades do you accept?", answer: "We offer programs tailored for elementary cohorts (grades 3-5), middle school cohorts (grades 6-8), and high school cohorts (grades 9-12). Our Leadership Academy and Career Readiness modules focus heavily on high school students preparing for college or professional internships." },
        { category: "Programs", question: "What is the Technology For Tomorrow program?", answer: "It is our digital literacy initiative. We introduce students to fundamental logical frameworks, Scratch block coding, python script editors, hardware kits (like Raspberry Pi), responsive UI wireframes, and website creation." },
        { category: "Programs", question: "What are the Innovation Challenges?", answer: "Innovation Challenges are problem-solving tournaments. Student teams collaborate to design, build physical or digital prototypes, and pitch structural solutions addressing local or global issues like green space optimization, food storage, or recycling." },
        { category: "Programs", question: "How long do the summer cohorts last?", answer: "Our standard summer initiative cohort runs for four consecutive weeks, typically starting in early July and concluding with our annual Closing Ceremony and Innovation Pitch Summit in late August." },
        { category: "Volunteering", question: "Who can apply to volunteer with Future Ready Youth?", answer: "We welcome high school seniors, college undergraduates, graduate students, industry professionals, and passionate community members. We require a positive attitude, reliability, a passion for supporting students, and a clean background check." },
        { category: "Volunteering", question: "What is the time commitment for volunteers?", answer: "We offer flexible scheduling options ranging from 5-10 hours, 10-20 hours, to 40+ hours monthly. You can choose to lead weekday afternoon workshops, weekend community cleanups, or commit to regular weekday morning cohorts." },
        { category: "Volunteering", question: "Do you validate or sign off on community service hours?", answer: "Absolutely! We provide fully certified, signed community service hours validation slips that satisfy high school graduation mandates, college honors requirements, or corporate matching incentives." },
        { category: "Volunteering", question: "What is the application and onboarding process?", answer: "After submitting your online Volunteer Form, our Volunteer Coordinator reviews it. Qualified candidates are contacted for a brief 15-minute video interview, followed by background screening and a comprehensive training seminar in late June." },
        { category: "Parents & Sponsors", question: "How can parents register their children for your summer cohorts?", answer: "Parent registration portals typically open on our website around late April. You can select your district's closest partner community center or library and fill out our simplified student enrollment form." },
        { category: "Parents & Sponsors", question: "What safety guidelines do you enforce during field service events?", answer: "Safety is our paramount priority. We maintain a strict 1-to-5 supervisor-to-student ratio. All students wear visible, custom-colored Future Ready Youth cohort shirts, and we strictly operate within municipal-approved park or library zones." },
        { category: "Parents & Sponsors", question: "How can my corporation sponsor or partner with Future Ready Youth?", answer: "We offer various sponsorship tiers. Companies can sponsor a full neighborhood coding cohort, fund innovation prize awards, or coordinate corporate employee volunteer days. Please fill out our Partner Form on the 'Get Involved' page." },
        { category: "General", question: "Who can I contact if I have further questions?", answer: "Please navigate to our Contact page to send our administrative desk an instant message, email us directly at futurereadyyouth6@gmail.com, or dial our central office line at +1 (828) 767-8094." }
      ];

      await prisma.faq.createMany({
        data: defaultFaqs
      });
      console.log("Database initialized: FAQs seeded.");
    }

    // 6. Initialize Resources
    const resourceCount = await prisma.resource.count();
    if (resourceCount === 0) {
      const defaultResources = [
        {
          title: "Summer Code Camp: Beginners Python & Scratch Guide",
          category: "Technology",
          type: "Curriculum Syllabus Guide",
          size: "24 KB",
          filename: "fry_coding_curriculum_2026.txt",
          description: "A comprehensive weekly breakdown of our summer technology classes. Includes Scratch logic puzzles, Python syntax games, and responsive layout templates.",
          content: "FUTURE READY YOUTH - BEGINNERS TECHNOLOGY COHORT CURRICULUM\n===========================================================\nCategory: Technology & Coding Basics\nInitiative: Technology For Tomorrow\nTarget Cohort: Grades 5-8..."
        },
        {
          title: "Youth Leadership: Core Value Workshops Manual",
          category: "Leadership",
          type: "Instructor Facilitator Guide",
          size: "18 KB",
          filename: "fry_leadership_workshop_guide.txt",
          description: "An instructor manual containing group communication tasks, conflict resolution games, and public speaking coaching worksheets.",
          content: "FUTURE READY YOUTH - LEADERSHIP ACADEMY WORKSHOP MANUAL\n=============================================================\nCategory: Leadership Development & Public Speaking\nTarget Cohort: Grades 8-12..."
        }
      ];

      await prisma.resource.createMany({
        data: defaultResources
      });
      console.log("Database initialized: Downloadable Resources seeded.");
    }

  } catch (error) {
    console.error("Critical error in database initialization", error);
  }
}
