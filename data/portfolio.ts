// ============================================================================
// CENTRAL PORTFOLIO CONFIGURATION
// ----------------------------------------------------------------------------
// Edit this file to make the entire site yours. No component logic needs to
// change — everything on the page is rendered from the data below.
//
// Anything wrapped in [BRACKETS] is a placeholder. Replace it with your own
// information before deploying. Nothing here has been invented on your
// behalf: empty arrays / falsy fields simply hide that part of the UI.
// ============================================================================

export type Skill = {
  name: string;
  /** 0-100, used for the animated proficiency bar. Optional. */
  level?: number;
};

export type SkillGroup = {
  category: string;
  skills: Skill[];
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  role?: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
};

export type ExperienceEntry = {
  role: string;
  organization: string;
  date: string;
  location?: string;
  type: "work" | "project" | "education";
  responsibilities: string[];
  technologies?: string[];
};

export type SocialLink = {
  label: string;
  url: string;
  icon: "github" | "linkedin" | "mail" | "globe" | "twitter";
};

export const personal = {
  name: "VIGNESH",
  initials: "N",
  title: "DEVELOPER, DATA SCIENTIST, ASSISTANT PROFESSOR",
  location: "TRICHY",
  email: "vigneshnprofessional@gmail.com",
  availableForWork: true,
  heroGreeting: "Hi, I'm VIGNESH N 👋",
  heroHeadline: "Building digital experiences that solve real problems.",
  heroSubtext:
    "I'm a passionate software developer focused on building scalable, user-friendly applications and exploring modern web technologies, AI, and automation.",
  aboutIntro:
    "[Write 2–3 sentences introducing yourself professionally — who you are, what you build, and what drives you as a developer.]",
  aboutStory:
    "[Add a short personal story: how you got into software development, a turning point, or what keeps you motivated. Keep it authentic and specific to you.]",
  currentFocus:
    "[e.g. Deepening my knowledge of distributed systems and shipping side projects with AI-assisted tooling.]",
  careerInterests:
    "[e.g. Full-stack product engineering, developer tools, applied AI.]",
  education: [
    {
      school: "[YOUR SCHOOL / UNIVERSITY]",
      degree: "[YOUR DEGREE]",
      date: "[YEAR – YEAR]",
    },
  ],
  resumeUrl: "/resume.pdf",
};

export const socialLinks: SocialLink[] = [
  { label: "GitHub", url: "https://github.com/[YOUR_GITHUB]", icon: "github" },
  { label: "LinkedIn", url: "https://linkedin.com/in/[YOUR_LINKEDIN]", icon: "linkedin" },
  { label: "Email", url: "mailto:[YOUR_EMAIL]", icon: "mail" },
  // { label: "Portfolio", url: "https://[YOUR_DOMAIN]", icon: "globe" },
  // { label: "X / Twitter", url: "https://x.com/[YOUR_HANDLE]", icon: "twitter" },
];

export const github = {
  username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "[YOUR_GITHUB_USERNAME]",
  profileUrl: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || "[YOUR_GITHUB_USERNAME]"}`,
};

// Remove any group / skill you don't actually use.
export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Python" },
      { name: "Java" },
      { name: "C++" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "REST APIs" },
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "MongoDB" },
      { name: "MySQL" },
      { name: "PostgreSQL" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Docker" },
      { name: "VS Code" },
    ],
  },
];

// Replace with your real projects. Structure is kept realistic on purpose —
// swap in your own screenshots, links, and descriptions.
export const projects: Project[] = [
  {
    slug: "ai-voice-assistant",
    name: "[AI Voice Assistant Project]",
    tagline: "A conversational voice interface built with the Web Speech API.",
    description:
      "[Describe what the project does in 2–3 sentences: the core feature, who it's for, and what makes it interesting.]",
    problem:
      "[Describe the specific problem this project solves, in one or two sentences.]",
    technologies: ["Next.js", "TypeScript", "Web Speech API", "Node.js"],
    githubUrl: "https://github.com/[YOUR_GITHUB]/[REPO_NAME]",
    liveUrl: "",
    featured: true,
  },
  {
    slug: "full-stack-web-app",
    name: "[Full-Stack Web Application]",
    tagline: "An end-to-end application with auth, a database, and a REST API.",
    description:
      "[Describe the application: what users can do, the main features you built, and any interesting technical decisions.]",
    problem:
      "[What problem does this solve for its users?]",
    technologies: ["React", "Node.js", "Express", "PostgreSQL"],
    githubUrl: "https://github.com/[YOUR_GITHUB]/[REPO_NAME]",
    liveUrl: "",
    featured: true,
  },
  {
    slug: "developer-automation-tool",
    name: "[Developer / Automation Project]",
    tagline: "A CLI or script that automates a repetitive developer workflow.",
    description:
      "[Describe the tool: what it automates, how it's used, and the impact it had (time saved, fewer errors, etc. — only if true).]",
    problem:
      "[What manual/repetitive task did this remove?]",
    technologies: ["Python", "Git", "GitHub Actions"],
    githubUrl: "https://github.com/[YOUR_GITHUB]/[REPO_NAME]",
    liveUrl: "",
    featured: true,
  },
];

// If you have no professional experience yet, keep entries of type
// "project" / "education" only — the UI will label the section
// "Projects & Learning Journey" automatically.
export const experience: ExperienceEntry[] = [
  {
    role: "[Your Role]",
    organization: "[Company / Organization]",
    date: "[Month Year] – [Month Year / Present]",
    location: "[City, Country / Remote]",
    type: "work",
    responsibilities: [
      "[Describe a key responsibility or contribution.]",
      "[Describe another concrete outcome you worked on.]",
    ],
    technologies: ["TypeScript", "React", "Node.js"],
  },
  {
    role: "[Degree / Program]",
    organization: "[School / University]",
    date: "[Year] – [Year]",
    location: "[City, Country]",
    type: "education",
    responsibilities: [
      "[Relevant coursework, honors, or activities.]",
    ],
  },
];

export const assistantKnowledgeBase = {
  name: personal.name,
  title: personal.title,
  intro: personal.aboutIntro,
  skills: skillGroups.flatMap((g) => g.skills.map((s) => s.name)),
  projects: projects.map((p) => ({ name: p.name, tagline: p.tagline, tech: p.technologies })),
  experience: experience.map((e) => `${e.role} at ${e.organization}`),
  contact: personal.email,
  availableForWork: personal.availableForWork,
  github: github.profileUrl,
};

export const siteConfig = {
  title: `${personal.name} | Software Developer`,
  description: personal.heroSubtext,
  // Set NEXT_PUBLIC_SITE_URL once you have a real domain (see .env.example).
  // Falls back to a syntactically valid placeholder so builds never break
  // just because you haven't deployed yet.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-portfolio.vercel.app",
};
