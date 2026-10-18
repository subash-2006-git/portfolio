export type Profile = {
  name: string;
  handle: string;
  title: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  photo_url: string;
  resume_url: string;
  about: string[];
};

export type SkillGroup = {
  id: string;
  name: string;
  items: string[];
  position: number;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string;
  stack: string[];
  repo: string;
  demo: string;
  image_url: string;
  year: string;
  role: string;
  problem: string;
  approach: string[];
  outcome: string[];
  featured: boolean;
  published: boolean;
  position: number;
};

export type Experience = {
  id: string;
  kind: "work" | "education";
  role: string;
  org: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  published: boolean;
  position: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  published: boolean;
  updated_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};
