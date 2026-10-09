/**
 * Who I am — every fact here comes from the existing portfolio (PROFILE.md),
 * the résumé in /public, or my own repositories. Edit freely; nothing else in the
 * codebase hard-codes these values.
 */

export const profile = {
  name: 'Harshit Raj',
  role: 'Frontend Developer',
  positioning: 'I build digital experiences where design, engineering, and motion come together.',
  coreMessage: "I don't just build interfaces. I build experiences.",
  heroHeadline: 'Turning ideas into experiences.',
  heroIntro:
    'I build thoughtful, interactive, and high-performance digital experiences through design, code, and experimentation.',
  location: 'Patna, Bihar, India',
  availability: 'Open to freelance work',
  email: 'harshitrajsingh142@gmail.com',
  resume: {
    href: '/Harshit_Raj_Resume.pdf',
    fileName: 'Harshit_Raj_Resume.pdf',
  },
  socials: [
    { id: 'github', label: 'GitHub', handle: 'Harshit0209-gif', href: 'https://github.com/Harshit0209-gif' },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'Harshit Raj',
      href: 'https://www.linkedin.com/in/harshit-raj-963b99318/',
    },
  ],
  education: {
    degree: 'B.Tech in Computer Science and Engineering',
    school: 'The Neotia University, Kolkata',
    period: '2020 – 2024',
  },
} as const;

export interface ExperienceEntry {
  role: string;
  organisation: string;
  period: string;
  summary: string;
  /** Slug of the matching project world, when there is one. */
  projectSlug?: string;
}

/** Verified freelance roles (résumé + PROFILE.md). */
export const experience: ExperienceEntry[] = [
  {
    role: 'Freelance Front-End Developer',
    organisation: 'AB Institute',
    period: 'Nov 2025 – Jan 2026',
    summary:
      'Built the student learning dashboard: course listing, an e-reader, notifications, and live sessions rendered from the webinar and meeting APIs.',
    projectSlug: 'ab-institute',
  },
  {
    role: 'Freelance Front-End Developer',
    organisation: 'Golicit Services',
    period: 'Sep – Oct 2025',
    summary:
      "Turned the design team's Figma library into a component-based, responsive corporate website for a Kolkata-based technology startup.",
    projectSlug: 'golicit',
  },
  {
    role: 'Freelance Front-End Developer',
    organisation: 'EMA',
    period: 'Feb – May 2025',
    summary:
      'Built a responsive, reusable React component library and interface for a platform active in 45+ countries.',
  },
];

/** How I describe what I bring — qualitative on purpose: no invented metrics. */
export const capabilities = [
  {
    title: 'Interface design',
    body: 'I design in Figma and carry the decisions through to code — hierarchy, states, responsive behaviour and the small details in between.',
  },
  {
    title: 'Frontend engineering',
    body: 'React, Next.js and TypeScript, structured into components that stay readable as a product grows from a landing page into an application.',
  },
  {
    title: 'Application architecture',
    body: 'Role-based portals, booking and credit rules, payment fallbacks, search and data models — the parts of a product that have to be right, not just look right.',
  },
  {
    title: 'Interaction and motion',
    body: 'GSAP, Framer Motion and Three.js, used where movement explains something — and switched off when a visitor asks for less motion.',
  },
] as const;
