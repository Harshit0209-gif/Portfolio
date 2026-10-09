/**
 * Narrative copy for each chapter. These are deliberately written as editable
 * placeholders — they describe the shape of the journey without inventing specific
 * personal events. Replace any line with your own words; layout adapts.
 */

export type ChapterId =
  | 'prologue'
  | 'beginning'
  | 'exploration'
  | 'builder'
  | 'projects'
  | 'universe'
  | 'challenges'
  | 'present'
  | 'next';

export interface Chapter {
  id: ChapterId;
  /** Sequence number shown in chapter indicators. The prologue has none. */
  number: string | null;
  title: string;
  headline?: string;
  body?: string;
}

export const chapters: Chapter[] = [
  { id: 'prologue', number: null, title: 'Prologue' },
  {
    id: 'beginning',
    number: '01',
    title: 'The beginning',
    headline: 'Every journey begins with curiosity.',
    body: 'My journey into development began with the desire to understand how ideas become things people can actually use.',
  },
  {
    id: 'exploration',
    number: '02',
    title: 'The exploration',
    headline: 'Then curiosity became experimentation.',
    body: 'Learning meant exploring new technologies, understanding how systems connect, and discovering better ways to turn ideas into working products.',
  },
  {
    id: 'builder',
    number: '03',
    title: 'The builder',
    headline: 'From experiments to real products.',
    body: 'Building real applications taught me to connect interfaces, data, workflows, and user needs into complete experiences.',
  },
  {
    id: 'projects',
    number: '04',
    title: 'The projects',
    headline: 'Each project is its own world.',
    body: 'Listed in the order they began. Client sites, products and prototypes — every one shown the same way, with what it is, what I did, and where it stands today.',
  },
  {
    id: 'universe',
    number: '05',
    title: 'The technology universe',
    headline: 'Every tool here has been used in real work.',
    body: 'Select a technology to see what I used it for and which projects it appears in.',
  },
  {
    id: 'challenges',
    number: '06',
    title: 'The challenges',
    headline: 'Not everything worked the first time.',
    body: 'Every project brings new constraints, unexpected bugs, and decisions that need reconsideration. Progress comes from investigating problems, refining ideas, and building better solutions.',
  },
  {
    id: 'present',
    number: '07',
    title: 'The present',
    headline: 'Design-minded. Engineering-focused.',
    body: 'I bring together interface design, frontend engineering, application architecture, and interaction design to create thoughtful digital products.',
  },
  {
    id: 'next',
    number: '08',
    title: "What's next",
    headline: "This isn't the end. It's the next chapter.",
    body: "I'm interested in building meaningful digital experiences, exploring creative development, and continuing to grow as an engineer.",
  },
];

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, Chapter>;

/** Primary navigation: five destinations, each an ordinary URL fragment. */
export const primaryNav = [
  { label: 'Journey', href: '#beginning' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#universe' },
  { label: 'About', href: '#present' },
  { label: 'Contact', href: '#contact' },
] as const;

export const closingStatement = "Let's build something extraordinary.";

/**
 * Chapter 06. Each fragment is a real engineering problem, taken from commit history or
 * migration names in the repositories — not a dramatised setback.
 */
export const challenges = [
  {
    problem: 'Booking windows that ignored the clock',
    resolution: 'Class sessions open and close on India time, whatever the server timezone says.',
    project: 'Colonel Horse Riding Club',
    projectSlug: 'colonel-horse-riding-club',
  },
  {
    problem: 'A member editing their own role',
    resolution: 'Database rules and a trigger stop anyone from raising their own privileges.',
    project: 'Colonel Horse Riding Club',
    projectSlug: 'colonel-horse-riding-club',
  },
  {
    problem: 'Refunds larger than the payment',
    resolution: 'One finance service owns the maths, with over-refund safety and receipts.',
    project: 'Theracure Dashboard',
    projectSlug: 'theracure',
  },
  {
    problem: 'The same tender, listed twice',
    resolution: 'Records are normalised and de-duplicated, with doubtful matches sent to staff review.',
    project: 'ATS GeM',
    projectSlug: 'ats-gem',
  },
  {
    problem: 'Checkout without a live gateway',
    resolution: 'Orders wait as pending until staff confirm payment, so nothing dead-ends.',
    project: 'Colonel Horse Riding Club',
    projectSlug: 'colonel-horse-riding-club',
  },
  {
    problem: 'Pages opening halfway down',
    resolution: 'Scroll position now resets on every client-side route change.',
    project: 'Oasis Elevators',
    projectSlug: 'oasis-elevators',
  },
] as const;
