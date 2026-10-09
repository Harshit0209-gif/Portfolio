import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projectBySlug, projects } from '@/content';
import { useInView } from '@/hooks/useInView';
import ChapterHeading from '@/components/experience/ChapterHeading';
import ProjectWorld from '@/components/projects/ProjectWorld';
import CaseStudyDialog from '@/components/projects/CaseStudyDialog';

/** Which project world is currently in view — updates only when it changes. */
function useCurrentProject() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const worlds = projects.map((p) => document.getElementById(`project-${p.slug}`)).filter((el): el is HTMLElement => el !== null);
    if (worlds.length === 0 || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(worlds.indexOf(entry.target as HTMLElement));
        });
      },
      // A thin band across the middle of the screen: whichever world crosses it is "current".
      { rootMargin: '-50% 0px -49% 0px' }
    );
    worlds.forEach((w) => observer.observe(w));
    return () => observer.disconnect();
  }, []);

  return current;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 04 — THE PROJECTS.
 *
 * Fourteen worlds, in the order the projects began. There is no featured tier: every
 * project gets the same stage, the same sequence and the same depth of case study.
 * A plain index at the top and a pager at the bottom keep every project one click away,
 * with or without animation.
 */
export default function ProjectsSection() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const current = useCurrentProject();
  const openCaseStudy = useCallback((slug: string) => setOpenSlug(slug), []);
  const closeCaseStudy = useCallback(() => setOpenSlug(null), []);

  const worlds = useRef<HTMLDivElement>(null);
  // "In the worlds" = the list of worlds overlaps the middle of the screen.
  const inWorlds = useInView(worlds, { rootMargin: '-45% 0px -45% 0px' });

  const prev = projects[current - 1];
  const next = projects[current + 1];

  return (
    <section id='projects' className='relative bg-midnight' aria-labelledby='projects-title'>
      <div className='mx-auto max-w-[1440px] px-[var(--gutter)] pb-[10vh] pt-[22vh]'>
        <div className='grid gap-12 lg:grid-cols-12 lg:gap-10'>
          <ChapterHeading chapter='projects' className='lg:col-span-6' />

          <nav className='lg:col-span-5 lg:col-start-8 lg:pt-12' aria-label='All projects'>
            <ol className='border-t border-parchment/15 sm:columns-2 sm:gap-x-10'>
              {projects.map((p, i) => (
                <li key={p.slug} className='break-inside-avoid border-b border-parchment/10'>
                  <a href={`#project-${p.slug}`} className='group flex items-baseline gap-4 py-2.5 transition-colors hover:text-champagne'>
                    <span className='tabular w-6 shrink-0 text-xs text-parchment/60 group-hover:text-champagne'>{pad(i + 1)}</span>
                    <span className='flex-1 text-[0.98rem] leading-snug'>{p.name}</span>
                    <span className='tabular shrink-0 text-xs text-parchment/60'>{p.year}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <div ref={worlds}>
        {projects.map((project, i) => (
          <ProjectWorld key={project.slug} project={project} flip={i % 2 === 1} onOpenCaseStudy={openCaseStudy} />
        ))}
      </div>

      {/* Pager: sticks to the bottom of the screen for as long as this chapter is on it */}
      <nav
        className={`pointer-events-none sticky bottom-4 z-40 -mt-16 flex justify-center px-4 transition-opacity duration-300 ${inWorlds ? 'opacity-100' : 'invisible opacity-0'}`}
        aria-label='Project pager'
      >
        <div className='pointer-events-auto flex items-center gap-1 rounded-full border border-parchment/15 bg-midnight/90 p-1 shadow-[0_18px_40px_-18px_rgba(0,0,0,.9)]'>
          {prev ? (
            <a href={`#project-${prev.slug}`} className='inline-flex h-10 w-10 items-center justify-center rounded-full text-parchment/80 transition-colors hover:bg-parchment/10 hover:text-champagne'>
              <ChevronLeft className='h-4 w-4' aria-hidden='true' />
              <span className='sr-only'>Previous project: {prev.name}</span>
            </a>
          ) : (
            <span className='inline-flex h-10 w-10 items-center justify-center text-parchment/20' aria-hidden='true'>
              <ChevronLeft className='h-4 w-4' />
            </span>
          )}

          <a href='#projects' className='flex min-w-0 items-baseline gap-2.5 rounded-full px-2 py-1.5 text-sm transition-colors hover:text-champagne'>
            <span className='tabular text-xs text-champagne'>
              {pad(current + 1)}
              <span className='text-parchment/60'> / {pad(projects.length)}</span>
            </span>
            <span className='max-w-[42vw] truncate font-medium sm:max-w-[18rem]'>{projects[current]?.name}</span>
            <span className='sr-only'>— back to the list of all projects</span>
          </a>

          {next ? (
            <a href={`#project-${next.slug}`} className='inline-flex h-10 w-10 items-center justify-center rounded-full text-parchment/80 transition-colors hover:bg-parchment/10 hover:text-champagne'>
              <ChevronRight className='h-4 w-4' aria-hidden='true' />
              <span className='sr-only'>Next project: {next.name}</span>
            </a>
          ) : (
            <span className='inline-flex h-10 w-10 items-center justify-center text-parchment/20' aria-hidden='true'>
              <ChevronRight className='h-4 w-4' />
            </span>
          )}
        </div>
      </nav>

      <CaseStudyDialog project={openSlug ? (projectBySlug[openSlug] ?? null) : null} onClose={closeCaseStudy} />
    </section>
  );
}
