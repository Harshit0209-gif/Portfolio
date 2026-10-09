/**
 * Project manifest — the single source of truth for chapters 03, 04 and 05.
 *
 * Accuracy rules this file follows:
 *  - Every entry maps to a repository I inspected (or, for client work without one,
 *    to the résumé). Feature claims come from routes, pages, migrations and commits.
 *  - `stack` lists technologies I worked with directly. `platform` lists other parts of
 *    the system that I did not necessarily write (team or client code).
 *  - `live` is set only when the URL was checked and serves this build. Otherwise it is
 *    null and the UI shows a clear "not available" state instead of a link.
 *  - No usage numbers, performance figures or outcomes are claimed anywhere.
 *
 * Every project is presented with the same layout and weight. Order is chronological
 * by start date (`startedAt`), oldest first — it is a timeline, not a ranking.
 */

export type ProjectStatus = 'live' | 'in-progress' | 'client-build' | 'prototype' | 'archived';

export const statusMeta: Record<ProjectStatus, { label: string; color: string }> = {
  live: { label: 'Live', color: '#8FD3A8' },
  'in-progress': { label: 'In progress', color: '#D8B878' },
  'client-build': { label: 'Built for a client', color: '#A9CBE0' },
  prototype: { label: 'Prototype', color: '#C9A6D8' },
  archived: { label: 'Archived', color: '#8A97AB' },
};

/** Which procedural environment sets the scene behind the project. */
export type Environment =
  | 'street'
  | 'park'
  | 'facade'
  | 'candles'
  | 'clinic'
  | 'operations'
  | 'parade'
  | 'shelves'
  | 'interior'
  | 'constellation'
  | 'shafts'
  | 'industry'
  | 'equestrian'
  | 'terminal';

/** Floors of the building in chapter 03. */
export type Discipline = 'interfaces' | 'motion' | 'data' | 'workflows' | 'operations';

export const disciplines: { id: Discipline; label: string; description: string }[] = [
  { id: 'interfaces', label: 'Interfaces', description: 'Responsive layouts and components people actually use.' },
  { id: 'motion', label: 'Motion and interaction', description: 'Scroll, transitions and gestures that carry meaning.' },
  { id: 'data', label: 'Data, APIs and sign-in', description: 'Models, endpoints and authentication behind the screen.' },
  { id: 'workflows', label: 'Payments, bookings and rules', description: 'The business logic that has to be right.' },
  { id: 'operations', label: 'Admin and operations', description: 'Panels that let a team run the product themselves.' },
];

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Screenshot {
  /** Base path in /public — `-800.webp` and `-1440.webp` are appended. */
  src: string;
  alt: string;
  caption: string;
  /** Text shown in the frame's address bar. Not a link. */
  address: string;
  /** Short name for the switcher when a project has more than one capture. */
  label?: string;
}

export type ProjectMedia =
  | { kind: 'screenshots'; images: Screenshot[] }
  | {
      /** For projects without a UI to show: real routes, read from the code. */
      kind: 'blueprint';
      file: string;
      caption: string;
      lines: { path: string; note: string }[];
    };

export interface Project {
  slug: string;
  name: string;
  year: string;
  /** YYYY-MM, used only for chronological ordering. */
  startedAt: string;
  category: string;
  summary: string;
  context: string;
  status: ProjectStatus;
  role: string;
  /** For team or freelance work: exactly what I did. */
  contribution?: string[];
  stack: string[];
  platform?: string[];
  highlights: string[];
  limitations: string[];
  live: ProjectLink | null;
  /** Shown in place of a live link when there isn't one. */
  liveUnavailable: string;
  source: ProjectLink[];
  sourceUnavailable?: string;
  media: ProjectMedia;
  environment: Environment;
  disciplines: Discipline[];
  /** Set to false to keep an entry in the file without showing it. */
  published: boolean;
}

const all: Project[] = [
  {
    slug: 'foodfetch',
    name: 'Foodfetch',
    year: '2024',
    startedAt: '2024-08',
    category: 'Food ordering web app',
    summary: 'A food ordering site with a menu, cart, one-time-password sign-up, PayPal checkout and delivery updates.',
    context:
      'An early full-stack project: a restaurant menu that customers can browse and order from, with the kitchen accepting or rejecting each incoming order.',
    status: 'archived',
    role: 'Personal project, built end to end',
    stack: ['django', 'html', 'css'],
    highlights: [
      'Menu and dish pages served by Django views and models, on SQLite.',
      'Cart with add and remove, followed by an address and confirmation step.',
      'Sign-up verified with a one-time password.',
      'PayPal checkout with success and cancellation handling.',
      'Delivery updates, with accept and reject actions for incoming orders.',
    ],
    limitations: ['Archived. There is no public deployment.'],
    live: null,
    liveUnavailable: 'No public deployment',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/Harshit0209-gif/Foodfetch' }],
    media: {
      kind: 'blueprint',
      file: 'Foodfetch/urls.py',
      caption: "Routes read from the project's URL configuration.",
      lines: [
        { path: '/dishes/', note: 'browse the menu' },
        { path: '/dish/<id>/', note: 'one dish in detail' },
        { path: '/cart/', note: 'add, remove, review' },
        { path: '/verify_otp/', note: 'confirm sign-up' },
        { path: '/add_address/', note: 'where to deliver' },
        { path: '/paypal/', note: 'checkout' },
        { path: '/delivery/', note: 'order updates' },
        { path: '/accept_order/<id>/', note: 'kitchen accepts' },
      ],
    },
    environment: 'street',
    disciplines: ['interfaces', 'data', 'workflows'],
    published: true,
  },
  {
    slug: 'pet-care',
    name: 'Pet Care App',
    year: '2025',
    startedAt: '2025-05',
    category: 'Mobile app',
    summary:
      'A cross-platform app for pet owners, covering grooming, vet appointments and food supplies. Designed in Figma, built in React Native.',
    context:
      'Looking after a pet is a set of small recurring tasks. The app brings grooming, vet visits and food supplies into one place on the phone.',
    status: 'in-progress',
    role: 'UI/UX design and front end',
    stack: ['react-native', 'figma'],
    platform: ['nodejs', 'express', 'mongodb'],
    highlights: [
      'Interface designed in Figma before any code was written.',
      'Cross-platform front end in React Native.',
      'Modules for grooming, vet appointments and food supplies.',
      'A REST API for accounts, pet profiles and appointments, with hashed passwords and token sign-in.',
    ],
    limitations: ['Still in progress. There is no public build or repository yet.'],
    live: null,
    liveUnavailable: 'No public build yet',
    source: [],
    sourceUnavailable: 'Repository not public',
    media: {
      kind: 'blueprint',
      file: 'Backend_PetCare/Router.js',
      caption: "Endpoints read from the app's API router.",
      lines: [
        { path: 'POST /signup', note: 'create an account' },
        { path: 'POST /login', note: 'sign in' },
        { path: 'POST /createPet', note: 'add a pet profile' },
        { path: 'GET /pets', note: 'list pets' },
        { path: 'PUT /update/:id', note: 'edit a pet' },
        { path: 'POST /createappmt', note: 'book a vet visit' },
        { path: 'GET /getappmts', note: 'upcoming visits' },
      ],
    },
    environment: 'park',
    disciplines: ['interfaces', 'data'],
    published: true,
  },
  {
    slug: 'golicit',
    name: 'Golicit Services',
    year: '2025',
    startedAt: '2025-09',
    category: 'Company website',
    summary:
      "A responsive corporate website for a Kolkata-based technology startup, built from the design team's Figma library.",
    context:
      'Golicit offers software and digital services. The site introduces the company, its services and the industries it works with, and gives prospective clients a direct way to get in touch.',
    status: 'client-build',
    role: 'Freelance front-end developer',
    contribution: [
      'Converted a full Figma library into a component-based React application.',
      'Implemented the corporate website responsively, with cross-browser checks.',
    ],
    stack: ['react', 'typescript', 'vite', 'tailwind', 'figma', 'nextjs', 'gsap'],
    highlights: [
      'Design-to-code from a shared Figma component library.',
      'Sections for services, industries, careers, about and contact.',
      'Responsive layouts checked across browsers.',
      'A later second version rebuilt in Next.js, with a GSAP splash screen, smooth scrolling and a server-action contact form.',
    ],
    limitations: ['The screenshot shows the first version; the public repository holds the Next.js rebuild.'],
    live: null,
    liveUnavailable: 'No verified public URL',
    source: [{ label: 'Source (v2 rebuild)', href: 'https://github.com/Harshit0209-gif/Websitev2' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/golicit',
          alt: 'Golicit Services home page with the headline “Transform Your Digital Future” and a photo of a team at work.',
          caption: 'Home page of the first version.',
          address: 'golicit services',
        },
      ],
    },
    environment: 'facade',
    disciplines: ['interfaces', 'motion'],
    published: true,
  },
  {
    slug: 'ab-institute',
    name: 'AB Institute',
    year: '2025–26',
    startedAt: '2025-11',
    category: 'Learning platform',
    summary:
      "A trading institute's enrolment site and student dashboard: courses, an e-reader, payments and live sessions.",
    context:
      'AB Institute teaches trading through courses and live webinars. The product is a landing page that explains the course and drives enrolment, and a dashboard where students read course material, see upcoming sessions and manage payments.',
    status: 'client-build',
    role: 'Freelance front-end developer',
    contribution: [
      'Built the student dashboard UI in React and Tailwind CSS.',
      'Reusable components for course listing, the e-reader page and notifications.',
      'Upcoming live sessions rendered from the webinar and Zoho Meeting APIs.',
    ],
    stack: ['react', 'typescript', 'vite', 'tailwind'],
    platform: ['nodejs', 'express', 'mongodb', 'razorpay'],
    highlights: [
      'Landing page focused on clear course messaging and enrolment.',
      'Dashboard pages for exploring courses, my courses, the course reader, payment history and profile setup.',
      'Email verification and Google sign-in in the account flow.',
      'Live sessions and webinars shown inside the dashboard.',
      'Payments through Razorpay, with the API on Node, Express and MongoDB.',
    ],
    limitations: ['No verified public URL, so it is shown here through screenshots.'],
    live: null,
    liveUnavailable: 'No verified public URL',
    source: [
      { label: 'Dashboard source', href: 'https://github.com/resourcesgolicit-art/ABDashboard' },
      { label: 'Landing page source', href: 'https://github.com/resourcesgolicit-art/market_research_and_analysis' },
    ],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/ab-institute-landing',
          alt: 'AB Institute landing page promoting a futures and options trading workshop, with Enroll Now and View Course Details buttons.',
          caption: 'Enrolment landing page.',
          address: 'ab institute',
          label: 'Landing page',
        },
        {
          src: '/projects/ab-institute-dashboard',
          alt: 'AB Institute learning portal sign-in card with login, sign-up and Google sign-in options.',
          caption: 'Student portal sign-in.',
          address: 'ab institute / portal',
          label: 'Student portal',
        },
      ],
    },
    environment: 'candles',
    disciplines: ['interfaces', 'data', 'workflows'],
    published: true,
  },
  {
    slug: 'theracure',
    name: 'Theracure Dashboard',
    year: '2025–26',
    startedAt: '2025-12',
    category: 'Clinic management dashboard',
    summary:
      'A role-based dashboard for a physiotherapy clinic: appointments, patients, prescriptions, invoices and content.',
    context:
      'Thera-Cure is a physiotherapy clinic. Admins, therapists, receptionists and content managers each sign in to a view built for their work, from scheduling and consultations to invoices and the clinic blog.',
    status: 'client-build',
    role: 'Team project. I worked on specific modules',
    contribution: [
      'Prescription management UI, and later a prescription-format revamp with draft saving and a 24-hour edit window.',
      'One “today’s consultations and sessions” figure, unified across every dashboard.',
      'Patient payment details: a single finance service, refunds and receipts with over-refund safety, and consolidated statements.',
      'Document sharing over WhatsApp and SMS, behind a permission layer.',
      'A round of functional bug fixes and UX improvements.',
    ],
    stack: ['nextjs', 'typescript', 'prisma', 'postgresql', 'tailwind'],
    platform: ['docker'],
    highlights: [
      'Four roles, each with its own permissions: admin, therapist, receptionist and content manager.',
      'Appointments, consultations, patients, prescriptions, invoices, holidays and staff.',
      'Invoice PDFs regenerated on demand and kept to a single page.',
      'Background workers for SMS and daily therapist schedules.',
    ],
    limitations: [
      'Client work that handles patient data, so only the sign-in screen is shown.',
      'Built by a team. The contributions listed are mine.',
    ],
    live: null,
    liveUnavailable: 'Internal clinic tool',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/Harshit0209-gif/Theracure' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/theracure',
          alt: 'Thera-Cure sign-in screen with email, password and four role options: Admin, Therapist, Receptionist and Content Manager.',
          caption: 'Sign-in with role selection.',
          address: 'thera-cure / login',
        },
      ],
    },
    environment: 'clinic',
    disciplines: ['interfaces', 'data', 'workflows', 'operations'],
    published: true,
  },
  {
    slug: 'ex-serviceman-jobs',
    name: 'Ex-Serviceman Jobs',
    year: '2026',
    startedAt: '2026-06',
    category: 'Recruitment platform',
    summary:
      'A recruitment platform that connects ex-servicemen across Assam and Northeast India with verified employers.',
    context:
      'Veterans and employers need different things from the same platform, so it is built as separate experiences: a candidate portal, an employer portal and an admin panel, each with its own registration flow.',
    status: 'in-progress',
    role: 'Built end to end: front end and API',
    stack: ['react', 'typescript', 'vite', 'tailwind', 'nodejs', 'express', 'postgresql', 'razorpay'],
    highlights: [
      'Candidate and company registration kept as two separate flows.',
      'Candidate portal: a guided profile with autosave, document uploads, a résumé builder, job search, applications, interviews and messages.',
      'Employer portal: post and manage jobs, search the candidate database, review applications and schedule interviews.',
      'Admin panel for candidates, companies, jobs and pending registrations.',
      'Registration fee through Razorpay. The profile is saved first and the payment is verified on the server.',
    ],
    limitations: ['In active development. No public deployment has been verified yet.'],
    live: null,
    liveUnavailable: 'Not publicly deployed yet',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/ashutoshtripaathi-01/ATS_corps' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/esm-jobs',
          alt: 'Ex-Serviceman Jobs landing page with the headline “Connecting Ex-Serviceman Workforce With Trusted Employers” and Find Employment and Hire Talent buttons.',
          caption: 'Landing page, captured from the local production build.',
          address: 'ex-serviceman jobs',
        },
      ],
    },
    environment: 'operations',
    disciplines: ['interfaces', 'data', 'workflows', 'operations'],
    published: true,
  },
  {
    slug: 'ssta',
    name: 'Sainik Surakhsa Training Academy',
    year: '2026',
    startedAt: '2026-06',
    category: 'Training academy website',
    summary:
      'A website for an academy that prepares retired Army personnel for careers in private security across Northeast India.',
    context:
      'The site speaks to veterans considering a second career. It introduces the training programmes and facilities, and leads to an application for training.',
    status: 'live',
    role: 'Built the site',
    stack: ['nextjs', 'typescript', 'tailwind', 'framer-motion'],
    highlights: [
      'About, training programmes, facilities, testimonials and contact in one scrolling page.',
      'A clear route to apply for training from the first screen onward.',
      'Built on Next.js with Framer Motion and deployed on Vercel.',
    ],
    limitations: ['Currently served from a Vercel subdomain.'],
    live: { label: 'Visit the live site', href: 'https://ssta-wine.vercel.app' },
    liveUnavailable: '',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/Harshit0209-gif/SSTA' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/ssta',
          alt: 'SSTA home page with the headline “Transforming Military Experience into Professional Security Excellence” over a parade photograph.',
          caption: 'Home page of the live site.',
          address: 'ssta-wine.vercel.app',
        },
      ],
    },
    environment: 'parade',
    disciplines: ['interfaces', 'motion'],
    published: true,
  },
  {
    slug: 'gobt-medical-erp',
    name: 'GOBT Medical ERP',
    year: '2026',
    startedAt: '2026-06',
    category: 'ERP front end',
    summary:
      'An ERP front end for pharmacies and medical distributors: inventory, billing, suppliers, accounts and reports.',
    context:
      'A prototype to explore how pharmacy operations could feel on one mobile-first interface. It runs on seeded demo data, so the whole workflow can be clicked through without a backend.',
    status: 'prototype',
    role: 'Built the prototype',
    stack: ['react', 'javascript', 'vite', 'tailwind'],
    highlights: [
      'Separate administrator and staff views of the same system.',
      'Dashboard figures, revenue and category charts built with Recharts.',
      'Low-stock and expiry alerts surfaced on the dashboard.',
      'Modules for inventory, sales and billing, suppliers, accounts, reports and settings.',
    ],
    limitations: ['Front end only. The data is seeded and sign-in is a demo session.'],
    live: null,
    liveUnavailable: 'Not publicly deployed',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/Harshit0209-gif/Medicare-ERP' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/gobt-erp',
          alt: 'GOBT ERP administrator dashboard showing revenue, sales, inventory health, a revenue chart and a sales-mix chart.',
          caption: 'Administrator dashboard, running on demo data.',
          address: 'gobt erp / dashboard',
        },
      ],
    },
    environment: 'shelves',
    disciplines: ['interfaces', 'workflows', 'operations'],
    published: true,
  },
  {
    slug: 'navaru-interior',
    name: 'Navaru Interior Solution',
    year: '2026',
    startedAt: '2026-07',
    category: 'Interior design studio website',
    summary:
      'An image-led website for an interior design studio, with an admin panel for portfolio projects, bookings and site content.',
    context:
      'Interior work sells on atmosphere, so the public site leads with photography and quiet typography. Behind it, the studio manages its own portfolio, consultation bookings and page content without touching code.',
    status: 'client-build',
    role: 'Built the site and the admin panel',
    stack: ['react', 'typescript', 'vite', 'tailwind', 'framer-motion', 'supabase'],
    highlights: [
      'Portfolio with an individual page for each project.',
      'Consultation booking available from anywhere on the site.',
      'Admin panel: dashboard, portfolio editor, media library, bookings, enquiries, site content and an activity log.',
      'Supabase for sign-in, data and media.',
    ],
    limitations: ['No verified public URL yet.'],
    live: null,
    liveUnavailable: 'No verified public URL',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/Harshit0209-gif/Navaru_interior' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/navaru',
          alt: 'Navaru Interior Solutions home page with the headline “Interiors shaped by light, texture and quiet luxury” over a living-room photograph.',
          caption: 'Home page, captured from the local production build.',
          address: 'navaru interior solutions',
        },
      ],
    },
    environment: 'interior',
    disciplines: ['interfaces', 'motion', 'data', 'operations'],
    published: true,
  },
  {
    slug: 'atgc-group',
    name: 'ATGC Group',
    year: '2026',
    startedAt: '2026-07',
    category: 'Corporate group website',
    summary:
      'A scroll-driven website that presents a multi-industry group as one connected story, from manpower and equine to defence, AI and life sciences.',
    context:
      'A group with very different businesses needs one identity that still lets each vertical feel distinct. The site moves through the verticals as chapters, with transitions that hand one over to the next.',
    status: 'live',
    role: 'Built the site',
    stack: ['react', 'typescript', 'vite', 'tailwind', 'gsap', 'framer-motion', 'lenis'],
    highlights: [
      'Dedicated transitions between verticals: manpower to equine, equine to defence, and onward.',
      "An orbit and parallax system for presenting the group's companies.",
      'Smooth scrolling with Lenis, choreographed with GSAP.',
      "An ecosystem overview that links the group's businesses.",
    ],
    limitations: [],
    live: { label: 'Visit atgcgroup.in', href: 'https://atgcgroup.in' },
    liveUnavailable: '',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/Harshit0209-gif/atgc-group' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/atgc',
          alt: 'ATGC Group opening screen with the headline “Connecting the Dots. ATGC.” over a network of connected points.',
          caption: 'Opening section of the live site.',
          address: 'atgcgroup.in',
        },
      ],
    },
    environment: 'constellation',
    disciplines: ['interfaces', 'motion'],
    published: true,
  },
  {
    // Kept in the manifest but not shown: a client demo I have not been asked to feature.
    slug: 'bharat-rummy',
    name: 'Bharat Rummy',
    year: '2026',
    startedAt: '2026-07',
    category: 'Game interface prototype',
    summary: 'A front-end prototype of a card-game lobby, table and wallet, running on mock data.',
    context: 'A clickable demo of a rummy product: lobby, tables, tournaments, wallet and support, with age verification and responsible-gaming pages.',
    status: 'prototype',
    role: 'Built the prototype',
    stack: ['react', 'typescript', 'vite'],
    highlights: ['Lobby, table, tournaments, leaderboard, wallet and support screens.', 'Mock services stand in for a backend.'],
    limitations: ['Front end only, on mock data.'],
    live: null,
    liveUnavailable: 'Not publicly deployed',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/Harshit0209-gif/BharatRummy' }],
    media: { kind: 'blueprint', file: 'src/pages', caption: 'Screens in the prototype.', lines: [] },
    environment: 'facade',
    disciplines: ['interfaces'],
    published: false,
  },
  {
    slug: 'oasis-elevators',
    name: 'Oasis Elevators',
    year: '2026',
    startedAt: '2026-08',
    category: 'Manufacturer website',
    summary:
      'A marketing site for an elevator company, covering products, services, industries and clients, with an admin panel to edit it without code.',
    context:
      'Elevators are bought by architects, builders and facility teams who want proof of engineering quality. The site presents products and services clearly, and the company keeps its own content current through a built-in editor.',
    status: 'client-build',
    role: 'Built the site and the admin panel',
    stack: ['react', 'typescript', 'vite', 'tailwind', 'gsap', 'framer-motion', 'supabase'],
    highlights: [
      'Pages for products, services, industries, clients and contact.',
      'Admin editors for the hero, about section, navigation, footer, SEO and site settings.',
      'A media library for managing images.',
      'A consultation request panel available across the site.',
    ],
    limitations: ['The contact form needs a submission endpoint configured before it delivers messages.'],
    live: null,
    liveUnavailable: 'No verified public URL',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/Harshit0209-gif/Oasis-Elevator' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/oasis',
          alt: 'Oasis Elevators home page with the headline “Elevating Architecture. Engineering Vertical Mobility.” and a consultation form.',
          caption: 'Home page with the consultation panel open, from the local production build.',
          address: 'oasis elevators',
        },
      ],
    },
    environment: 'shafts',
    disciplines: ['interfaces', 'motion', 'data', 'operations'],
    published: true,
  },
  {
    slug: 'ats-corporation',
    name: 'ATS Corporation',
    year: '2026',
    startedAt: '2026-08',
    category: 'Company website',
    summary:
      'A website for a veteran-run organisation with three verticals: NEISAC co-working spaces, engineering consultancy and mining manpower.',
    context:
      'Three businesses, one audience of veterans and partners. Each vertical gets its own page, while shared building blocks such as process timelines keep them consistent.',
    status: 'client-build',
    role: 'Built the site',
    stack: ['react', 'javascript', 'vite', 'tailwind', 'framer-motion'],
    highlights: [
      'Home page hero carousel with swipe gestures.',
      'Separate pages for engineering consultancy and mining manpower.',
      'Process-timeline and call-to-action components shared across verticals.',
      'Content kept in data files, separate from layout.',
    ],
    limitations: [
      'Registration and contact forms are front end only.',
      'Featured engagements use placeholder content until real case studies are supplied.',
    ],
    live: null,
    liveUnavailable: 'No verified public URL',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/atsinfra-org/ATS-Corporation' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/ats-corporation',
          alt: 'ATS Corporation home page presenting NEISAC co-working spaces for veterans, with Explore NEISAC and Register Now buttons.',
          caption: 'Home page, captured from the local production build.',
          address: 'ats corporation',
        },
      ],
    },
    environment: 'industry',
    disciplines: ['interfaces', 'motion'],
    published: true,
  },
  {
    slug: 'colonel-horse-riding-club',
    name: 'Colonel Horse Riding Club',
    year: '2026',
    startedAt: '2026-08',
    category: 'Membership, booking and store platform',
    summary:
      "A riding club's public site, member store, class booking and staff admin, with the business rules enforced in the database.",
    context:
      'A riding club sells memberships as class credits, runs sessions with a limited number of horses, and needs staff to confirm payments and attendance. The product connects all of it: register, buy a membership, book classes, and let staff run the day.',
    status: 'in-progress',
    role: 'Built end to end: front end and database',
    stack: [
      'react',
      'javascript',
      'vite',
      'tailwind',
      'supabase',
      'postgresql',
      'gsap',
      'lenis',
      'framer-motion',
      'razorpay',
      'vitest',
    ],
    highlights: [
      'Public site with an enquiry flow and a split-panel sign-in and registration dialog.',
      'Store with Gold (8 classes), Platinum (12 classes) and one-time rides, plus tack for in-store pickup.',
      'Credit-based class booking with rescheduling, on India-time booking windows.',
      'Member area: membership card, upcoming classes, weekly progress, recent activity and order history.',
      'Staff admin: members, schedule and sessions, horses, bookings, attendance, credits, orders, payments, roles and an audit log.',
    ],
    limitations: [
      'Online payment through Razorpay is built but switched off by default. Orders wait for staff to confirm payment.',
      'The café menu is built but hidden from the store for now.',
      'Not publicly deployed yet.',
    ],
    live: null,
    liveUnavailable: 'Not publicly deployed yet',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/atsinfra-org/CHR' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/chr',
          alt: 'Colonel Horse Riding landing page with the headline “The Art of Horse Riding” beside a horse standing in a stable.',
          caption: 'Public landing page, captured from the local production build.',
          address: 'colonel horse riding',
        },
      ],
    },
    environment: 'equestrian',
    disciplines: ['interfaces', 'motion', 'data', 'workflows', 'operations'],
    published: true,
  },
  {
    slug: 'ats-gem',
    name: 'ATS GeM',
    year: '2026',
    startedAt: '2026-09',
    category: 'Tender discovery platform',
    summary:
      'A tender search platform that crawls public procurement sources, cleans and de-duplicates the records, and serves filtered search.',
    context:
      'Public tenders are scattered across portals in inconsistent formats. The platform collects them, normalises each record, merges duplicates, and gives companies one place to search, save and follow the tenders that matter to them.',
    status: 'in-progress',
    role: 'Built end to end: backend and web app',
    stack: [
      'nextjs',
      'react',
      'typescript',
      'tailwind',
      'nestjs',
      'nodejs',
      'prisma',
      'postgresql',
      'redis-bullmq',
      'docker',
      'vitest',
      'playwright',
    ],
    highlights: [
      'One NestJS codebase deployed as four processes: API, worker, scheduler and CLI.',
      'Crawler with a CPPP source adapter, rate limiting, normalisation and duplicate detection, plus staff review of doubtful matches.',
      'PostgreSQL full-text search with weighted fields and trigram matching.',
      'Queues on Redis and BullMQ, with an outbox relay and health checks for each process.',
      'Next.js web app: dashboard, tender search and detail, saved tenders and searches, notifications and company profile.',
    ],
    limitations: [
      'No alert delivery, billing or bidding yet, and the interface does not pretend otherwise.',
      'OpenSearch support is stubbed. Search runs on PostgreSQL.',
      'Not publicly deployed yet.',
    ],
    live: null,
    liveUnavailable: 'Not publicly deployed yet',
    source: [{ label: 'Source on GitHub', href: 'https://github.com/atsinfra-org/ats_gem' }],
    media: {
      kind: 'screenshots',
      images: [
        {
          src: '/projects/ats-gem',
          alt: 'ATS GeM landing page with a tender search box, a live wire of tenders and a map of India shaded by state.',
          caption:
            "Landing page from the local production build. The market figures are the page's sample data; the backend was not running for this capture.",
          address: 'ats gem',
        },
      ],
    },
    environment: 'terminal',
    disciplines: ['interfaces', 'data', 'operations'],
    published: true,
  },
];

/** Published projects, oldest first. Stable for equal start months. */
export const projects: Project[] = all
  .filter((p) => p.published)
  .map((p, i) => ({ p, i }))
  .sort((a, b) => a.p.startedAt.localeCompare(b.p.startedAt) || a.i - b.i)
  .map(({ p }) => p);

export const allProjects = all;

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<string, Project>;
