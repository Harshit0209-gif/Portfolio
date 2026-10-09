/**
 * Technologies, grouped for the "technology universe".
 *
 * There are deliberately no proficiency bars or years-of-experience claims. Depth is
 * shown honestly instead: each technology lists the projects it appears in, derived
 * from `projects.ts`, so the evidence travels with the claim.
 */

export type TechGroupId = 'frontend' | 'motion' | 'backend' | 'tools';

export const techGroups: { id: TechGroupId; label: string; description: string }[] = [
  { id: 'frontend', label: 'Frontend', description: 'Structure, styling and the components people touch.' },
  { id: 'motion', label: 'Motion & creative', description: 'Movement that explains, and the occasional third dimension.' },
  { id: 'backend', label: 'Backend & data', description: 'APIs, databases, queues and payments behind the interface.' },
  { id: 'tools', label: 'Tools & workflow', description: 'Design, version control, containers and tests.' },
];

export interface Technology {
  id: string;
  name: string;
  group: TechGroupId;
  /** One honest sentence about how I have used it. */
  note: string;
  /** True when this portfolio itself is the evidence. */
  usedHere?: boolean;
  /** For foundations that are in everything: shown instead of a project list. */
  everywhere?: string;
}

export const technologies: Technology[] = [
  // Frontend
  { id: 'html', name: 'HTML', group: 'frontend', note: 'Semantic structure underneath every site and dashboard here.', usedHere: true, everywhere: 'Part of every web project on this page.' },
  { id: 'css', name: 'CSS', group: 'frontend', note: 'Layout, responsive behaviour and hand-written styles alongside utility classes.', usedHere: true, everywhere: 'Part of every web project on this page.' },
  { id: 'javascript', name: 'JavaScript', group: 'frontend', note: 'The language most of my client work started in.', usedHere: true },
  { id: 'typescript', name: 'TypeScript', group: 'frontend', note: 'Typed props, API contracts and data models in most recent projects.', usedHere: true },
  { id: 'react', name: 'React', group: 'frontend', note: 'My main tool for interfaces — from marketing sites to role-based portals.', usedHere: true },
  { id: 'nextjs', name: 'Next.js', group: 'frontend', note: 'App Router sites and applications, including server actions and route groups.' },
  { id: 'tailwind', name: 'Tailwind CSS', group: 'frontend', note: 'Design tokens and utility styling, in both v3 and v4 projects.', usedHere: true },
  { id: 'react-native', name: 'React Native', group: 'frontend', note: 'Cross-platform mobile UI for the Pet Care app.' },
  { id: 'vite', name: 'Vite', group: 'frontend', note: 'The build tool behind most of my React projects.', usedHere: true },

  // Motion & creative
  { id: 'gsap', name: 'GSAP', group: 'motion', note: 'Scroll-driven timelines and choreography, including this site’s chapters.', usedHere: true },
  { id: 'framer-motion', name: 'Framer Motion', group: 'motion', note: 'Page transitions, reveals and gesture-driven carousels in React.' },
  { id: 'lenis', name: 'Lenis', group: 'motion', note: 'Smooth scrolling kept in sync with GSAP ScrollTrigger.', usedHere: true },
  { id: 'threejs', name: 'Three.js', group: 'motion', note: 'Real-time 3D — the orbit you are looking at is built with it.', usedHere: true },

  // Backend & data
  { id: 'nodejs', name: 'Node.js', group: 'backend', note: 'Runtime for the APIs, workers and scripts behind several projects.' },
  { id: 'express', name: 'Express', group: 'backend', note: 'REST APIs with authentication, rate limiting and file uploads.' },
  { id: 'nestjs', name: 'NestJS', group: 'backend', note: 'A modular backend split into API, worker, scheduler and CLI processes.' },
  { id: 'django', name: 'Django', group: 'backend', note: 'Server-rendered pages, models and PayPal checkout in an early project.' },
  { id: 'postgresql', name: 'PostgreSQL', group: 'backend', note: 'Relational models, row-level security, functions and full-text search.' },
  { id: 'supabase', name: 'Supabase', group: 'backend', note: 'Auth, Postgres and storage for client sites with admin panels.' },
  { id: 'prisma', name: 'Prisma', group: 'backend', note: 'Schema, migrations and typed queries on PostgreSQL.' },
  { id: 'mongodb', name: 'MongoDB', group: 'backend', note: 'Document data for course platforms and the pet-care API.' },
  { id: 'redis-bullmq', name: 'Redis & BullMQ', group: 'backend', note: 'Background queues for crawling, indexing and scheduled jobs.' },
  { id: 'razorpay', name: 'Razorpay', group: 'backend', note: 'Payment flows with server-side verification — and safe fallbacks when switched off.' },

  // Tools & workflow
  { id: 'figma', name: 'Figma', group: 'tools', note: 'Where interface decisions start, before they become components.' },
  { id: 'git', name: 'Git & GitHub', group: 'tools', note: 'Version control and collaboration, from solo builds to team repositories.', usedHere: true, everywhere: 'Used across the projects on this page.' },
  { id: 'docker', name: 'Docker', group: 'tools', note: 'Local stacks with Postgres, Redis and app processes via Compose.' },
  { id: 'vitest', name: 'Vitest', group: 'tools', note: 'Unit and end-to-end test suites, plus the content checks for this site.', usedHere: true },
  { id: 'playwright', name: 'Playwright', group: 'tools', note: 'Browser smoke tests and automated accessibility checks.' },
];

export const techById = Object.fromEntries(technologies.map((t) => [t.id, t])) as Record<string, Technology>;
