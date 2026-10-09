import { memo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, MQ } from '@/lib/gsap';
import { depthParallax } from '@/lib/parallax';
import { useInView } from '@/hooks/useInView';
import { statusMeta, techById, type Project } from '@/content';
import ProjectBackdrop from '@/components/scenes/ProjectBackdrop';
import ProjectMedia from '@/components/projects/ProjectMedia';

interface ProjectWorldProps {
  project: Project;
  /** Alternates the composition left/right for rhythm. It carries no meaning. */
  flip: boolean;
  onOpenCaseStudy: (slug: string) => void;
}

/**
 * One project, one world. The structure, size, motion and depth of information are
 * identical for every project by design — none is a "feature" and none is a footnote.
 *
 * When a world comes into focus the sequence is always the same:
 * the environment resolves → the title is set → the interface arrives →
 * the technologies are named → the description and actions follow.
 *
 * Performance: the words and links are always in the page, but a world's scenery and
 * its animation are only built once it is about a screen away. Fourteen procedural
 * scenes are ~1,800 SVG nodes; mounting them all up front would make every layout and
 * every ScrollTrigger measurement on the page pay for scenery nobody can see yet.
 */
function ProjectWorld({ project, flip, onOpenCaseStudy }: ProjectWorldProps) {
  const root = useRef<HTMLElement>(null);
  const status = statusMeta[project.status];
  const words = project.name.split(' ');
  const near = useInView(root, { rootMargin: '130% 0px', once: true });

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !near) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        depthParallax(q('.project-backdrop')[0], { strength: 0.1, trigger: el });

        gsap
          .timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: el, start: 'top 58%', once: true } })
          // will-change only for the length of the move: the scene scales as one texture instead of being redrawn each frame
          .fromTo(
            q('.world-env'),
            { opacity: 0.25, scale: 1.07, willChange: 'transform, opacity' },
            { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out', clearProps: 'willChange' },
            0
          )
          .from(q('.world-meta'), { autoAlpha: 0, x: -14, duration: 0.7 }, 0.1)
          .from(q('.world-title .line-mask > span'), { yPercent: 112, duration: 1.05, stagger: 0.07, ease: 'power4.out' }, 0.15)
          .from(q('.world-media'), { autoAlpha: 0, y: 64, rotateX: 7, transformPerspective: 1400, transformOrigin: '50% 100%', duration: 1.3 }, 0.4)
          .from(q('.world-tech > li'), { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.045 }, 0.85)
          .from(q('.world-follow'), { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.1 }, 1.0);
      });
    },
    { scope: root, dependencies: [near] }
  );

  return (
    <article ref={root} id={`project-${project.slug}`} className='project-world relative isolate overflow-hidden bg-midnight' aria-labelledby={`${project.slug}-name`}>
      <div className='world-env absolute inset-0'>{near && <ProjectBackdrop env={project.environment} />}</div>
      {/* Legibility: shade the side the words sit on, leave the other to the scene */}
      <div className={`pointer-events-none absolute inset-0 max-lg:hidden ${flip ? 'scrim-right' : 'scrim-left'}`} aria-hidden='true' />
      <div className='pointer-events-none absolute inset-0 bg-midnight/[0.72] lg:hidden' aria-hidden='true' />
      <div className='pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-midnight to-transparent' aria-hidden='true' />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-midnight to-transparent' aria-hidden='true' />

      <div className='relative z-10 mx-auto grid min-h-[100svh] max-w-[1440px] content-center items-center gap-x-10 gap-y-10 px-[var(--gutter)] py-[13vh] lg:grid-cols-12'>
        <div className={`lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : ''}`}>
          <p className='world-meta text-sm text-champagne'>
            <span className='tabular'>{project.year}</span>
            <span className='mx-3 inline-block h-px w-6 translate-y-[-0.28em] bg-champagne/50' aria-hidden='true' />
            <span>{project.category}</span>
          </p>

          <h3
            id={`${project.slug}-name`}
            className='world-title mt-4 font-serif text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.01em] text-parchment [text-wrap:balance]'
            aria-label={project.name}
          >
            {words.map((word, i) => (
              <span key={i} aria-hidden='true'>
                <span className='line-mask'>
                  <span>{word}</span>
                </span>
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h3>

          <p className='world-follow status mt-5' style={{ ['--status-color' as string]: status.color }}>
            {status.label}
          </p>

          <ul className='world-tech mt-6 flex flex-wrap gap-2' aria-label='Technologies I used'>
            {project.stack.map((id) => (
              <li key={id} className='tech-tag'>
                {techById[id]?.name ?? id}
              </li>
            ))}
          </ul>

          <p className='world-follow lede mt-6'>{project.summary}</p>
          <p className='world-follow fine mt-3'>{project.role}.</p>

          <div className='world-follow mt-8 flex flex-wrap gap-2.5'>
            <button type='button' className='btn-primary btn-sm' onClick={() => onOpenCaseStudy(project.slug)} aria-haspopup='dialog'>
              Read the case study
            </button>
            {project.live ? (
              <a href={project.live.href} target='_blank' rel='noopener noreferrer' className='btn-ghost btn-sm'>
                {project.live.label}
                <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
                <span className='sr-only'>(opens in a new tab)</span>
              </a>
            ) : (
              <span className='btn-unavailable btn-sm'>
                <span className='sr-only'>Live site: </span>
                {project.liveUnavailable}
              </span>
            )}
            {project.source.length > 0 ? (
              <a href={project.source[0].href} target='_blank' rel='noopener noreferrer' className='btn-ghost btn-sm'>
                Source
                <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
                <span className='sr-only'>for {project.name} (opens in a new tab)</span>
              </a>
            ) : (
              <span className='btn-unavailable btn-sm'>
                <span className='sr-only'>Source code: </span>
                {project.sourceUnavailable ?? 'Source not public'}
              </span>
            )}
          </div>
        </div>

        <div className={`world-media lg:col-span-7 ${flip ? 'lg:order-1 lg:col-start-1' : ''}`}>
          <ProjectMedia media={project.media} name={project.name} />
        </div>
      </div>
    </article>
  );
}

export default memo(ProjectWorld);
