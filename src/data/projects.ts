export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'AB Institute',
    description:
      'Designed and developed a high-converting landing page for a trading institute, focusing on clear messaging, user engagement, and lead generation.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'TypeScript'],
    github:
      'https://github.com/resourcesgolicit-art/market_research_and_analysis',
    live: 'https://example.com',
    image: '/ab.png',
  },
  {
    id: 2,
    title: 'ABInstitute-Dashboard',
    description:
      'Built a comprehensive client dashboard with seamless integration of Razorpay for payments and Google Meet for live sessions, ensuring a smooth and scalable user experience.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'MongoDB'],
    github: 'https://github.com/resourcesgolicit-art/ABDashboard',
    live: 'https://example.com',
    image: '/ABDDash.png',
  },
  {
    id: 3,
    title: 'Theracure-Dashboard',
    description:
      'Contributed to UI development including prescription management interfaces, role-based authentication, and other core dashboard components to improve usability and workflow.',
    tech: ['Next', 'Chart.js', 'Tailwind CSS', 'MongoDB'],
    github: 'https://github.com/golicit/Theracure-Dashboard',
    live: 'https://example.com',
    image: '/theracure.png',
  },
  {
    id: 4,
    title: 'Golicit Services Pvt Ltd',
    description:
      'Developed a modern, responsive website for a Kolkata-based tech startup, highlighting their services, brand identity, and digital presence.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'JavaScript'],
    github: 'https://github.com/Harshit0209-gif/Websitev2',
    live: 'https://example.com',
    image: '/golicit.png',
  },
];
