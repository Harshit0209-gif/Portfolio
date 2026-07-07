import { Code2, Palette, Zap, Brain, type LucideIcon } from 'lucide-react';

export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  description: string;
}

export const experience: ExperienceEntry[] = [
  {
    title: 'Freelance Front-End Developer',
    company: 'AB Institute',
    period: 'November 2025 – January 2026',
    description:
      'Built a comprehensive client dashboard with seamless integration of Razorpay for payments and Google Meet for live sessions, ensuring a smooth and scalable user experience.',
  },
  {
    title: 'Freelance Front-End Developer',
    company: 'Golicit Services',
    period: 'September 2025 – October 2025',
    description:
      'Developed a modern, responsive website for a Kolkata-based tech startup, highlighting their services, brand identity, and digital presence.',
  },
  {
    title: 'Freelance Front-End Developer',
    company: 'EMA',
    period: 'February 2025 – May 2025',
    description:
      'Architected a responsive and scalable user interface (UI) for a major platform active in 45+ countries.',
  },
];

export const resumeStats = [
  { label: 'Years Exp.', value: '1+' },
  { label: 'Projects', value: '7+' },
  { label: 'Clients', value: '6+' },
];

export const focusAreas: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Code2,
    title: 'Frontend Excellence',
    description: 'Building performant, accessible interfaces with modern frameworks.',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Creating intuitive experiences that delight and engage users.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimizing for speed, ensuring lightning-fast load times.',
  },
  {
    icon: Brain,
    title: 'Design Thinking',
    description: 'Solving complex problems with user-centered approaches.',
  },
];

export const contactInfo = {
  email: 'harshitrajsingh142@gmail.com',
  github: 'https://github.com/Harshit0209-gif',
  githubHandle: 'Harshit0209-gif',
  linkedin: 'https://www.linkedin.com/in/harshit-raj-963b99318/',
  linkedinName: 'Harshit Raj',
  location: 'Patna, Bihar',
};
