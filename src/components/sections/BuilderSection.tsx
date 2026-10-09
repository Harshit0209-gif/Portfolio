import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ } from '@/lib/gsap';
import { VIEW_H, VIEW_W, skylinePath } from '@/lib/terrain';
import { disciplines, projects, projectsInDiscipline } from '@/content';
import ChapterHeading from '@/components/experience/ChapterHeading';

const FAR_CITY = skylinePath(8, 690, 40, 230);
const NEAR_CITY = skylinePath(19, 760, 30, 170);

// Ground floor first: interfaces are where the work starts, operations are what it grows into.
const FLOORS = disciplines.map((d) => ({ ...d, projects: projectsInDiscipline(d.id) }));
const TOP_DOWN = [...FLOORS].reverse();

/**
 * 03 — THE BUILDER. Ideas becoming functional products.
 *
 * The studio's monitor edges redraw themselves as architectural lines, and a building
 * rises out of them. It is a metaphor with real data inside it: every column of windows
 * is one project (in the order they were built) and every floor is a kind of engineering
 * work. A window is lit only where that project genuinely involved that work, so the
 * facade is an honest map of what has been built. As you approach, the floors light from
 * the ground up.
 */
export default function BuilderSection() {
  const root = useRef<HTMLElement>(null);
  const [hot, setHot] = useState<string | null>(null);
  const hotProject = hot ? projects.find((p) => p.slug === hot) : null;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      /** The story of the facade, shared by both layouts; only the trigger differs. */
      const build = (scrollTrigger: ScrollTrigger.Vars) => {
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger });
        // 1. architectural lines draw themselves, ground floor first
        tl.fromTo(q('.edge-h'), { scaleX: 0 }, { scaleX: 1, duration: 0.1, stagger: { each: 0.018, from: 'end' } }, 0)
          .fromTo(q('.edge-v'), { scaleY: 0 }, { scaleY: 1, duration: 0.14, stagger: { each: 0.012, from: 'end' } }, 0.02)
          // 2. the structure fills in behind the lines
          .fromTo(q('.floor-wall'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, stagger: { each: 0.02, from: 'end' } }, 0.1);
        // 3. floors come alight from the ground up, and each is named as it does
        TOP_DOWN.forEach((_, row) => {
          const fromGround = TOP_DOWN.length - 1 - row;
          const at = 0.24 + fromGround * 0.14;
          tl.fromTo(q(`.floor[data-row="${row}"] .win-lit`), { opacity: 0.06 }, { opacity: 1, duration: 0.08, stagger: { each: 0.01, from: 'random' } }, at).fromTo(
            q(`.floor[data-row="${row}"] .floor-label`),
            { autoAlpha: 0, x: 14 },
            { autoAlpha: 1, x: 0, duration: 0.07, ease: 'power2.out' },
            at + 0.02
          );
        });
        tl.fromTo(q('.tower-sign'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.9);
        return tl;
      };

      mm.add(MQ.desktop, () => {
        const tl = build({ trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.7 });
        // the camera travels toward the building; the city behind moves less
        tl.fromTo(q('.tower-wrap'), { scale: 0.8, yPercent: 7 }, { scale: 1, yPercent: 0, duration: 1, ease: 'power1.out', transformOrigin: '30% 100%' }, 0)
          .fromTo(q('.city-far'), { scale: 1 }, { scale: 1.07, duration: 1, transformOrigin: '50% 100%' }, 0)
          .fromTo(q('.city-near'), { scale: 1 }, { scale: 1.18, duration: 1, transformOrigin: '50% 100%' }, 0);
      });

      mm.add(MQ.mobile, () => {
        build({ trigger: q('.tower-wrap')[0], start: 'top 78%', end: 'bottom 62%', scrub: 0.5 });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id='builder'
      className='stage bg-midnight'
      data-sticky='desktop'
      style={{ ['--len-desktop' as string]: '300vh' }}
      aria-labelledby='builder-title'
    >
      <div className='stage-sticky'>
        <div className='absolute inset-0' aria-hidden='true'>
          <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg,#060A14 0%,#0B1526 40%,#1B2740 68%,#3A3540 84%,#4A3F40 100%)' }} />
          <svg className='city-far absolute inset-0 h-full w-full will-change-transform' viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio='xMidYMax slice'>
            <path d={FAR_CITY} fill='#121D31' />
          </svg>
          <svg className='city-near absolute inset-0 h-full w-full will-change-transform' viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio='xMidYMax slice'>
            <path d={NEAR_CITY} fill='#0A1220' />
          </svg>
          <div className='absolute inset-0 scrim-left opacity-75 max-lg:hidden' />
          <div className='absolute inset-0 bg-midnight/50 lg:hidden' />
        </div>

        <div className='relative z-10 mx-auto grid max-w-[1400px] gap-12 px-[var(--gutter)] py-[14vh] lg:h-full lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-0'>
          <ChapterHeading chapter='builder' className='builder-copy lg:col-span-5'>
            <p className='fine mt-6 max-w-[26rem]'>
              Each column of windows is one project, oldest on the left. A window is lit where that project involved the
              work on that floor.
            </p>
          </ChapterHeading>

          <div className='tower-wrap lg:col-span-7 lg:will-change-transform' style={{ ['--cols' as string]: projects.length }}>
            {/* rooftop sign: names the project under the pointer */}
            <div className='floor'>
              <div className='relative flex h-9 items-end justify-center'>
                <span className='absolute bottom-0 left-[18%] h-7 w-px bg-parchment/20' aria-hidden='true' />
                <p className='tower-sign truncate px-2 pb-1 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-champagne' aria-live='polite'>
                  {hotProject ? hotProject.name : `${projects.length} projects`}
                </p>
              </div>
              <span />
            </div>

            {TOP_DOWN.map((floor, row) => (
              <div key={floor.id} className='floor' data-row={row}>
                <div className='floor-cell'>
                  <div className='floor-wall' aria-hidden='true' />
                  <span className='edge-h' aria-hidden='true' />
                  <span className='edge-v left-0' aria-hidden='true' />
                  <span className='edge-v right-0' aria-hidden='true' />
                  {/* Pointer-only enhancement; the same links are in the list beside each floor. */}
                  <div className='floor-windows' aria-hidden='true'>
                    {projects.map((p) =>
                      p.disciplines.includes(floor.id) ? (
                        <a
                          key={p.slug}
                          href={`#project-${p.slug}`}
                          tabIndex={-1}
                          className={`win win-lit ${hot === p.slug ? 'is-hot' : ''} ${hot && hot !== p.slug ? 'is-dim' : ''}`}
                          onMouseEnter={() => setHot(p.slug)}
                          onMouseLeave={() => setHot(null)}
                        />
                      ) : (
                        <span key={p.slug} className='win' />
                      )
                    )}
                  </div>
                </div>

                <div className='floor-label'>
                  <h3 className='font-serif text-[1.15rem] leading-tight text-parchment lg:text-[1.3rem]'>{floor.label}</h3>
                  <p className='mt-1 hidden text-[0.82rem] leading-snug text-parchment/60 xl:block'>{floor.description}</p>
                  <details className='floor-details group relative mt-1.5'>
                    <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-[2px] text-[0.8rem] font-semibold text-champagne marker:hidden [&::-webkit-details-marker]:hidden'>
                      {floor.projects.length} projects
                      <svg className='h-3 w-3 transition-transform group-open:rotate-180' viewBox='0 0 12 12' fill='none' aria-hidden='true'>
                        <path d='M2.5 4.5L6 8l3.5-3.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    </summary>
                    <ul className='absolute left-0 top-full z-30 mt-2 w-[min(17rem,70vw)] space-y-1.5 rounded-[6px] border border-parchment/10 bg-navy p-3.5 text-[0.85rem] shadow-[0_24px_50px_-20px_rgba(0,0,0,.9)] max-lg:right-0 max-lg:left-auto'>
                      {floor.projects.map((p) => (
                        <li key={p.slug}>
                          <a href={`#project-${p.slug}`} className='text-link'>
                            {p.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            ))}

            <div className='floor' aria-hidden='true'>
              <div className='relative h-[5vh]'>
                <span className='absolute inset-x-[-12%] top-0 h-px bg-parchment/15' />
                <span className='absolute inset-x-0 top-0 h-full' style={{ background: 'linear-gradient(180deg,rgba(240,163,94,.16),transparent)' }} />
              </div>
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
