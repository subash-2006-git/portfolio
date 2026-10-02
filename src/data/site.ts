export const site = {
  name: "Subash S",
  handle: "subash",
  title: "Software Developer",
  tagline: "I build things for the web.",
  email: "iamsubash2006@gmail.com",
  github: "https://github.com/subash-2006-git",
  linkedin: "https://linkedin.com/in/ssubaz", 
  photo: "/profile.jpg", 
  resume: "/resume.pdf", // drop your PDF into /public/resume.pdf
  about: [
    "Hi, I'm Subash, a developer who enjoys turning ideas into clean, fast and useful software.",
    "Replace this with 2-3 sentences about your background, what you're learning, and what you're looking for.",
  ],
  skills: {
    languages: ["TypeScript", "JavaScript", "Python"],
    frontend: ["React", "Next.js", "Tailwind CSS"],
    backend: ["Node.js", "PostgreSQL", "REST"],
    tools: ["Git", "Docker", "Vercel"],
  },
};

export type Project = {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "expense-tracker",
    name: "Expense Tracker",
    description: "Personal expense tracker to log spending and see where money goes.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    repo: "https://github.com/your-username/expense-tracker",
  },
  {
    slug: "project-two",
    name: "Project Two",
    description: "Placeholder: one line on what it does and why it matters.",
    stack: ["React", "Node.js"],
    repo: "https://github.com/your-username/project-two",
    demo: "https://example.com",
  },
  {
    slug: "project-three",
    name: "Project Three",
    description: "Placeholder: swap in your best work here.",
    stack: ["Python", "PostgreSQL"],
  },
];
