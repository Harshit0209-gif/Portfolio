import { Component, Suspense, lazy, useMemo, useRef, useState, type ReactNode } from 'react';
import { techById, techGroups, technologiesWithUsage, usageOf, type TechGroupId } from '@/content';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { supportsWebGL } from '@/lib/webgl';
import ChapterHeading from '@/components/experience/ChapterHeading';
import TechOrbitFallback from '@/components/scenes/TechOrbitFallback';

// Three.js and React Three Fiber are the heaviest thing on the page, so they live in
// their own chunk and are only requested as this chapter approaches the viewport.
const TechUniverse3D = lazy(() => import('@/components/scenes/TechUniverse3D'));

const GROUP_COLOR: Record<TechGroupId, string> = {
  frontend: '#A9CBE0',
  motion: '#D8B878',
  backend: '#F0A35E',
  tools: '#8A97AB',
};

/** If the 3D scene throws (lost context, driver trouble), fall back instead of breaking the page. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('Technology universe: 3D scene unavailable, showing the 2D version.', error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * 05 — THE TECHNOLOGY UNIVERSE.
 *
 * The warm light from the studio has become the core of a small solar system; the
 * technologies orbit it in four groups. Nothing here is rated. Selecting a technology
 * shows one honest sentence about how I have used it, and the projects it appears in —
 * taken straight from the project manifest, so the evidence travels with the claim.
 *
 * The list of buttons is the real interface (keyboard, touch and screen-reader
 * friendly); the 3D scene mirrors it and also accepts hover and click.
 */
export default function UniverseSection() {
  const stage = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>('react');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const compact = useIsMobile();
  const near = useInView(stage, { rootMargin: '700px 0px', once: true });
  const onScreen = useInView(stage);
  const webgl = useMemo(() => supportsWebGL(), []);

  const nodes = useMemo(() => technologiesWithUsage().map(({ id, name, group, count }) => ({ id, name, group, count })), []);
  const groups = techGroups;

  const tech = techById[selectedId];
  const usage = usageOf(selectedId);
  const group = techGroups.find((g) => g.id === tech.group)!;

  const flat = <TechOrbitFallback nodes={nodes} selectedId={selectedId} hoveredId={hoveredId} />;

  return (
    <section id='universe' className='relative overflow-hidden bg-[#04060C]' aria-labelledby='universe-title'>
      {/* deep space, with the faintest warmth where the core sits */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{ background: 'radial-gradient(ellipse 60% 46% at 50% 38%,rgba(240,163,94,.1),rgba(13,22,38,.5) 46%,rgba(4,6,12,0) 78%)' }}
        aria-hidden='true'
      />
      <div className='pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-midnight to-transparent' aria-hidden='true' />

      <div className='relative mx-auto max-w-[1440px] px-[var(--gutter)] pb-[16vh] pt-[20vh]'>
        {/* Small screens read top to bottom: title, scene, details. Wide screens put the scene beside both. */}
        <div className='grid gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-12'>
          <ChapterHeading chapter='universe' className='relative z-10 lg:col-span-5 lg:row-start-1' />

          <div ref={stage} className='relative h-[min(96vw,56vh)] min-h-[320px] lg:sticky lg:top-[11vh] lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:h-[78vh] lg:self-start'>
            {webgl && near ? (
              <SceneBoundary fallback={flat}>
                <Suspense fallback={flat}>
                  <TechUniverse3D
                    nodes={nodes}
                    groups={groups}
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={setSelectedId}
                    onHover={setHoveredId}
                    active={onScreen}
                    still={reduced}
                    compact={compact}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              flat
            )}
          </div>

          {/* What the selected technology was actually used for */}
          <div className='relative z-10 lg:col-span-5 lg:row-start-2' aria-live='polite'>
            <div className='border-l border-parchment/15 pl-6'>
              <p className='flex items-center gap-2.5 text-sm text-parchment/65'>
                <span className='h-2 w-2 rounded-full' style={{ background: GROUP_COLOR[tech.group] }} aria-hidden='true' />
                {group.label}
              </p>
              <h3 className='mt-2 font-serif text-[clamp(2rem,3.2vw,2.9rem)] leading-none text-parchment'>{tech.name}</h3>
              <p className='mt-4 text-[1.02rem] leading-relaxed text-parchment/80'>{tech.note}</p>

              {tech.everywhere ? (
                <p className='mt-5 text-sm text-parchment/65'>{tech.everywhere}</p>
              ) : (
                <>
                  {usage.direct.length > 0 && (
                    <div className='mt-6'>
                      <h4 className='font-sans text-[0.8rem] font-semibold tracking-normal text-champagne'>
                        Used in {usage.direct.length} {usage.direct.length === 1 ? 'project' : 'projects'}
                      </h4>
                      <ul className='mt-2.5 space-y-1.5'>
                        {usage.direct.map((p) => (
                          <li key={p.slug}>
                            <a href={`#project-${p.slug}`} className='text-link text-[0.95rem]'>
                              {p.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {usage.platform.length > 0 && (
                    <div className='mt-6'>
                      <h4 className='font-sans text-[0.8rem] font-semibold tracking-normal text-parchment/60'>Part of the system around my work in</h4>
                      <ul className='mt-2.5 space-y-1.5'>
                        {usage.platform.map((p) => (
                          <li key={p.slug}>
                            <a href={`#project-${p.slug}`} className='text-link text-[0.95rem]'>
                              {p.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
              {tech.usedHere && <p className='mt-5 text-sm text-parchment/65'>Also used to build this site.</p>}
            </div>
          </div>
        </div>

        {/* The index: every technology, grouped, as real buttons */}
        <div className='relative z-10 mt-16 grid gap-x-8 gap-y-10 border-t border-parchment/10 pt-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4'>
          {techGroups.map((g) => (
            <section key={g.id} aria-labelledby={`group-${g.id}`}>
              <h3 id={`group-${g.id}`} className='flex items-center gap-2.5 font-sans text-[0.95rem] font-semibold tracking-normal text-parchment'>
                <span className='h-2 w-2 rounded-full' style={{ background: GROUP_COLOR[g.id] }} aria-hidden='true' />
                {g.label}
              </h3>
              <p className='mt-1.5 text-[0.84rem] leading-snug text-parchment/55'>{g.description}</p>
              <ul className='mt-4 flex flex-wrap gap-2'>
                {nodes
                  .filter((n) => n.group === g.id)
                  .map((n) => {
                    const active = n.id === selectedId;
                    return (
                      <li key={n.id}>
                        <button
                          type='button'
                          aria-pressed={active}
                          onClick={() => setSelectedId(n.id)}
                          onMouseEnter={() => setHoveredId(n.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onFocus={() => setHoveredId(n.id)}
                          onBlur={() => setHoveredId(null)}
                          className={`min-h-[40px] rounded-[3px] border px-3 text-[0.85rem] font-medium transition-colors ${
                            active
                              ? 'border-champagne bg-champagne text-midnight'
                              : 'border-parchment/15 text-parchment/80 hover:border-champagne/70 hover:text-parchment'
                          }`}
                        >
                          {n.name}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
