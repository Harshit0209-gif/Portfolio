import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ, ScrollTrigger } from '@/lib/gsap';
import { getLenis } from '@/lib/scroll';
import { sceneImages } from '@/content/imagery';
import DepthImage, { type DepthImageHandle } from '@/components/scenes/DepthImage';
import ChapterHeading from '@/components/experience/ChapterHeading';

/* The six steps of the experiment: the same small card, rebuilt with one more idea each time. */
const STEPS = [
  {
    tech: 'HTML',
    file: 'index.html',
    caption: 'Structure: a heading, a sentence, a link.',
    code: ['<article class="card">', '  <h2>Idea</h2>', '  <p>Make it real.</p>', '  <a href="#">Open</a>', '</article>'],
  },
  {
    tech: 'CSS',
    file: 'styles.css',
    caption: 'Style: spacing, colour and type.',
    code: ['.card {', '  padding: 2rem;', '  border-radius: 14px;', '  background: #0d1626;', '  color: #ece6da;', '}'],
  },
  {
    tech: 'JavaScript',
    file: 'script.js',
    caption: 'Behaviour: the button responds.',
    code: [
      "const button = card.querySelector('button');",
      'let saved = false;',
      '',
      "button.addEventListener('click', () => {",
      '  saved = !saved;',
      "  button.textContent = saved ? 'Saved' : 'Save';",
      '});',
    ],
  },
  {
    tech: 'React',
    file: 'Card.jsx',
    caption: 'Components: one card, reused.',
    code: [
      'function Card({ title, body }) {',
      '  const [saved, setSaved] = useState(false);',
      '  return (',
      '    <article className="card">',
      '      <h2>{title}</h2>',
      '      <p>{body}</p>',
      '      <button onClick={() => setSaved(!saved)}>',
      "        {saved ? 'Saved' : 'Save'}",
      '      </button>',
      '    </article>',
      '  );',
      '}',
    ],
  },
  {
    tech: 'TypeScript',
    file: 'Card.tsx',
    caption: 'Types: props that cannot go wrong quietly.',
    code: [
      'type CardProps = {',
      '  title: string;',
      '  body: string;',
      '  onSave?: (saved: boolean) => void;',
      '};',
      '',
      'function Card({ title, body, onSave }: CardProps) {',
      '  // …',
      '}',
    ],
  },
  {
    tech: 'Next.js',
    file: 'app/projects/page.tsx',
    caption: 'Routes: the card becomes a page.',
    code: [
      'export default async function Projects() {',
      '  const projects = await getProjects();',
      '  return (',
      '    <main>',
      '      {projects.map((p) => (',
      '        <Card key={p.id} {...p} />',
      '      ))}',
      '    </main>',
      '  );',
      '}',
    ],
  },
] as const;

const TOKEN = /(\/\/.*$)|('[^']*'|"[^"]*")|(<\/?[A-Za-z][\w.]*|\/?>)|\b(const|let|function|return|type|export|default|async|await)\b|(#[0-9a-fA-F]{3,6}\b|\b\d+(?:\.\d+)?(?:rem|px)?\b)/g;
const TOKEN_CLASS = ['', 'text-mist', 'text-[#E6B98A]', 'text-ice', 'text-champagne', 'text-[#C9D6A0]'];

/** A deliberately tiny highlighter — enough to make six short snippets read as code. */
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push(line.slice(last, index));
    const group = match.slice(1).findIndex(Boolean) + 1;
    out.push(
      <span key={index} className={TOKEN_CLASS[group]}>
        {match[0]}
      </span>
    );
    last = index + match[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

const CABIN = sceneImages.exploration;

/** The stage, as fractions of its scroll: a beat on the cabin, the push through the glass, then the steps. */
const HOLD = 0.05;
const ZOOM_END = 0.27;
const STEPS_START = 0.36;

/**
 * 02 — THE EXPLORATION. Curiosity becomes experimentation.
 *
 * The trail ends at the cabin at twilight, a desk visible through its lit window.
 * Scrolling pushes the camera through that window. The photograph scales about the
 * centre of the glass while the studio is unmasked behind it at exactly the same rate
 * and dissolves in, so the room you were looking into becomes the room you are in.
 * The glass is located from the photograph itself, so the two stay aligned at any size.
 *
 * On phones, and with reduced motion, there is no push: the cabin is simply the first
 * screen of the chapter and the studio follows it.
 *
 * The room is a photograph as well: a wall of glass onto the moonlit valley and an
 * empty desk. The monitors, the keyboard and their light are drawn on top of it. Its
 * depth map keeps the desk still under the monitors while the pointer moves the view
 * outside one way and the shelves the other, the way a window does when you lean.
 *
 * Inside, technologies are not listed — they happen. One small card is rebuilt six
 * times on the monitors (HTML → CSS → JavaScript → React → TypeScript → Next.js), with
 * the code on the left and the result on the right. Scroll drives the steps on desktop;
 * the step buttons work everywhere, including with reduced motion.
 */
export default function ExplorationSection() {
  const root = useRef<HTMLElement>(null);
  /** The cabin, seen from outside. */
  const scene = useRef<DepthImageHandle>(null);
  /** The studio, inside it. */
  const room = useRef<DepthImageHandle>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const stepRef = useRef(0);

  const showStep = useCallback((index: number) => {
    if (stepRef.current === index) return;
    stepRef.current = index;
    setStep(index);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const outside = q('.outside')[0];
        const studio = q('.studio')[0];
        const picture = outside.querySelector('img');
        /** 0 = standing outside, 1 = the glass has filled the frame. */
        const zoom = { t: 0 };
        /** The window glass on screen at rest: centre and half-size, in px. */
        let glass = { cx: 0, cy: 0, halfW: 1, halfH: 1 };

        const measure = () => {
          const [left, top, right, bottom] = CABIN.window;
          const a = scene.current?.pointOnScreen([left, top]);
          const b = scene.current?.pointOnScreen([right, bottom]);
          glass =
            a && b
              ? { cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, halfW: (b.x - a.x) / 2, halfH: (b.y - a.y) / 2 }
              : // until the picture has loaded: where the window sits in a 16:9 frame
                { cx: window.innerWidth * 0.5, cy: window.innerHeight * 0.56, halfW: window.innerWidth * 0.107, halfH: window.innerHeight * 0.232 };
          outside.style.transformOrigin = `${glass.cx.toFixed(1)}px ${glass.cy.toFixed(1)}px`;
        };

        /** One value moves the photograph and the studio's mask together, so they cannot drift apart. */
        const applyZoom = () => {
          const { cx, cy, halfW, halfH } = glass;
          const w = window.innerWidth;
          const h = window.innerHeight;
          // just enough to push every edge of the glass past the edge of the screen
          const full = Math.max(cx / halfW, (w - cx) / halfW, cy / halfH, (h - cy) / halfH) * 1.03;
          const s = 1 + (full - 1) * zoom.t;
          const inset = [cy - halfH * s, w - cx - halfW * s, h - cy - halfH * s, cx - halfW * s].map((v) => Math.max(0, v).toFixed(1));
          studio.style.clipPath = `inset(${inset[0]}px ${inset[1]}px ${inset[2]}px ${inset[3]}px)`;
          outside.style.transform = `scale(${s.toFixed(4)})`;
        };
        const remeasure = () => {
          measure();
          applyZoom();
        };

        remeasure();
        picture?.addEventListener('load', remeasure);

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onRefresh: remeasure,
            onUpdate: (self) => {
              const p = (self.progress - STEPS_START) / (1 - STEPS_START);
              showStep(Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length))));
            },
          },
        });
        triggerRef.current = tl.scrollTrigger ?? null;

        tl.to(zoom, { t: 1, duration: ZOOM_END - HOLD, ease: 'power2.in', onUpdate: applyZoom }, HOLD)
          // The photographed room stays in view until the glass has all but filled the frame; only then
          // does the real one dissolve in over it — a pull of focus rather than a cut. The monitors
          // arrive with it, so the desk seen through the window resolves into the desk you can read.
          .fromTo(studio, { opacity: 0 }, { opacity: 1, duration: 0.055, ease: 'power1.inOut' }, ZOOM_END - 0.035)
          .fromTo(q('.studio-set'), { scale: 1.12 }, { scale: 1, duration: 0.1, ease: 'power2.out' }, ZOOM_END - 0.035)
          .fromTo(q('.studio-rig'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, ZOOM_END - 0.02)
          .fromTo(outside, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, ZOOM_END + 0.025)
          // a trace of the lamplight crosses the cut, then settles to the cooler light of the screens
          .fromTo(q('.studio-warmth'), { autoAlpha: 0.6 }, { autoAlpha: 0, duration: 0.08 }, ZOOM_END - 0.01)
          .fromTo(q('.studio-copy'), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, ZOOM_END + 0.01)
          .to({}, { duration: 1 - (ZOOM_END + 0.07) }); // hold the room while the steps play

        return () => {
          triggerRef.current = null;
          picture?.removeEventListener('load', remeasure);
          studio.style.clipPath = '';
          outside.style.transform = '';
          outside.style.transformOrigin = '';
        };
      });

      // Mobile: no pin, no push through the glass. The cabin leans in a little as it passes,
      // and the steps advance as the monitors cross the screen.
      mm.add(MQ.mobile, () => {
        const camera = { push: 0, room: 0 };
        gsap.to(camera, {
          push: 0.9,
          ease: 'none',
          onUpdate: () => scene.current?.setPush(camera.push),
          scrollTrigger: { trigger: q('.outside')[0], start: 'top bottom', end: 'bottom top', scrub: true },
        });
        // inside, the view through the glass keeps drifting closer for as long as the room is on screen
        gsap.to(camera, {
          room: 0.7,
          ease: 'none',
          onUpdate: () => room.current?.setPush(camera.room),
          scrollTrigger: { trigger: q('.studio')[0], start: 'top bottom', end: 'bottom top', scrub: true },
        });
        ScrollTrigger.create({
          trigger: q('.studio-rig')[0],
          start: 'top 62%',
          end: 'bottom 48%',
          onUpdate: (self) => showStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))),
        });
        return () => {
          scene.current?.setPush(0);
          room.current?.setPush(0);
        };
      });
    },
    { scope: root }
  );

  /** Step buttons: keep scroll and state in sync where the stage is scroll-driven. */
  const chooseStep = (index: number) => {
    const st = triggerRef.current;
    if (!st) {
      showStep(index);
      return;
    }
    const progress = STEPS_START + ((index + 0.5) / STEPS.length) * (1 - STEPS_START);
    const y = st.start + (st.end - st.start) * progress;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo(0, y);
  };

  const current = STEPS[step];

  return (
    <section
      ref={root}
      id='exploration'
      className='stage bg-midnight'
      data-sticky='desktop'
      style={{ ['--len-desktop' as string]: '460vh' }}
      aria-labelledby='exploration-title'
    >
      <div className='stage-sticky'>
        {/* Outside: the cabin at twilight, and the lit window the trail was leading to.
            Desktop with motion: it fills the frame and the camera pushes through the glass.
            Otherwise: it is simply the first screen of the chapter. */}
        <div
          className='outside relative h-[100svh] overflow-hidden will-change-transform lg:motion-safe:absolute lg:motion-safe:inset-0 lg:motion-safe:h-auto'
          aria-hidden='true'
        >
          <DepthImage ref={scene} image={CABIN} />
          {/* night air from the chapter before, thinning as the cabin comes into view */}
          <div className='absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-midnight to-transparent' />
          {/* stacked layouts only: the wall darkens into the room below */}
          <div className='absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-transparent to-[#0A111E] lg:motion-safe:hidden' />
        </div>

        {/* Inside: the studio. On desktop it is revealed through the window. */}
        <div className='studio relative lg:motion-safe:absolute lg:motion-safe:inset-0'>
          {/* The room itself is a photograph: a wall of glass onto the moonlit valley, and an empty desk.
              It stays fixed while the chapter scrolls over it wherever the chapter is taller than the screen. */}
          <div className='studio-set sticky top-0 h-[100svh] origin-[50%_56%] overflow-hidden' aria-hidden='true'>
            <DepthImage ref={room} image={sceneImages.studio} />
            {/* shade the shelves behind the words; the window and the desk are left as they are */}
            <div
              className='absolute inset-0 max-lg:hidden'
              style={{ background: 'linear-gradient(90deg,rgba(5,8,16,.86) 0%,rgba(5,8,16,.72) 24%,rgba(5,8,16,.26) 40%,rgba(5,8,16,0) 50%)' }}
            />
            <div className='absolute inset-0 bg-[#05080F]/65 lg:hidden' />
            {/* what the monitors add to the room: their light pooling on the desk, and a keyboard in front of them */}
            <div
              className='absolute left-[44%] right-[2%] top-[79%] hidden h-[14%] lg:block'
              style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 0%,rgba(169,203,224,.16),transparent 72%)' }}
            />
            <div
              className='absolute left-[49%] top-[85.5%] hidden h-[4.2vh] w-[21vw] rounded-[5px] border border-parchment/[0.07] lg:block'
              style={{
                background:
                  'repeating-linear-gradient(90deg,rgba(169,203,224,.08) 0 1.05vw,transparent 1.05vw 1.3vw),repeating-linear-gradient(180deg,transparent 0 0.9vh,#04070D 0.9vh 1.15vh),#080D17',
                transform: 'perspective(600px) rotateX(38deg)',
              }}
            />
          </div>

          {/* the amber of the lamplit room in the photograph, carried across the cut and then faded */}
          <div
            className='studio-warmth invisible absolute inset-0 hidden lg:block'
            style={{ background: 'radial-gradient(circle at 50% 56%,rgba(255,186,110,.42),rgba(214,120,48,.26) 55%,rgba(60,28,8,.18) 100%)' }}
            aria-hidden='true'
          />

          <div className='relative z-10 mx-auto -mt-[100svh] grid max-w-[1500px] gap-10 px-[var(--gutter)] py-[14vh] lg:h-full lg:grid-cols-12 lg:gap-8 lg:py-0'>
            <div className='studio-copy lg:col-span-4 lg:self-center'>
              <ChapterHeading chapter='exploration' />

              <ol className='mt-8 space-y-1' aria-label='Technologies, in the order I learned to combine them'>
                {STEPS.map((s, i) => {
                  const active = i === step;
                  return (
                    <li key={s.tech}>
                      <button
                        type='button'
                        onClick={() => chooseStep(i)}
                        aria-current={active ? 'step' : undefined}
                        className={`group flex w-full items-baseline gap-3 rounded-[3px] py-1.5 text-left transition-colors ${active ? 'text-parchment' : 'text-mist hover:text-parchment'}`}
                      >
                        <span
                          className={`mt-[0.45em] h-1.5 w-1.5 shrink-0 self-start rounded-full transition-all duration-300 ${active ? 'scale-125 bg-ember shadow-[0_0_10px_2px_rgba(240,163,94,.6)]' : 'bg-mist/50'}`}
                          aria-hidden='true'
                        />
                        <span className='min-w-[6.5rem] text-[0.95rem] font-semibold'>{s.tech}</span>
                        <span className={`hidden text-sm transition-opacity duration-300 lg:inline ${active ? 'opacity-80' : 'opacity-0'}`}>{s.caption}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {/* Small screens: one caption in a reserved slot, so changing steps never shifts the page below. */}
              <p className='mt-3 min-h-[2.75rem] text-sm text-parchment/80 lg:hidden'>{current.caption}</p>
            </div>

            {/* The rig: two monitors on the desk */}
            {/* On desktop the stands come down onto the photographed desk, leaving the peaks and the moon in view above. */}
            <div className='studio-rig lg:col-span-8 lg:self-end lg:pb-[20vh]'>
              <div className='flex flex-col items-stretch gap-5 lg:flex-row lg:items-end lg:gap-[2vw]'>
                <div className='monitor lg:w-[56%]'>
                  <div className='monitor-screen'>
                    <div className='flex h-7 items-center gap-2 border-b border-parchment/[0.07] bg-[#080D18] px-3'>
                      <span className='h-1.5 w-1.5 rounded-full bg-ember' aria-hidden='true' />
                      <span className='truncate font-mono text-[0.68rem] text-parchment/70'>{current.file}</span>
                      {/* names the step where the list of steps has scrolled out of view */}
                      <span className='ml-auto shrink-0 text-[0.7rem] font-semibold text-champagne'>{current.tech}</span>
                    </div>
                    <div className='relative h-[15.5rem] lg:h-[min(19vw,42vh)]'>
                      {STEPS.map((s, i) => (
                        <pre
                          key={s.tech}
                          className={`absolute inset-0 overflow-hidden p-3.5 font-mono text-[0.7rem] leading-[1.65] text-parchment/85 transition-opacity duration-500 xl:text-[0.78rem] ${i === step ? 'opacity-100' : 'opacity-0'}`}
                          aria-hidden={i !== step}
                        >
                          <code>
                            {s.code.map((line, n) => (
                              <span key={n} className='block whitespace-pre'>
                                <span className='mr-3 inline-block w-4 select-none text-right text-mist/40'>{n + 1}</span>
                                {highlight(line)}
                              </span>
                            ))}
                          </code>
                        </pre>
                      ))}
                    </div>
                  </div>
                  <div className='monitor-stand' aria-hidden='true' />
                </div>

                <div className='monitor lg:w-[44%]'>
                  <div className='monitor-screen'>
                    <div className='preview' data-step={step}>
                      <div className='preview-bar'>
                        <i />
                        <i />
                        <i />
                        <span className='preview-url'>localhost:3000{step === 5 ? '/projects' : ''}</span>
                      </div>
                      <div className='preview-body'>
                        {step === 5 && (
                          <nav className='preview-nav' aria-hidden='true'>
                            <span>Home</span>
                            <span data-active>Projects</span>
                            <span>About</span>
                          </nav>
                        )}
                        <div className='preview-cards'>
                          {(step >= 3 ? ['Idea', 'Sketch', 'Build'] : ['Idea']).map((title, i) => (
                            <article key={title} className='preview-card'>
                              <h3>{title}</h3>
                              <p>Make it real.</p>
                              {step < 2 ? (
                                <span className='preview-link'>Open</span>
                              ) : (
                                <button
                                  type='button'
                                  className='preview-button'
                                  data-saved={i === 0 ? saved : i === 1}
                                  onClick={i === 0 ? () => setSaved((v) => !v) : undefined}
                                  tabIndex={i === 0 ? 0 : -1}
                                >
                                  {(i === 0 ? saved : i === 1) ? 'Saved' : 'Save'}
                                </button>
                              )}
                              {step === 4 && i === 0 && <span className='preview-type'>title: string</span>}
                            </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='monitor-stand' aria-hidden='true' />
                </div>
              </div>
              <p className='sr-only' aria-live='polite'>
                {current.tech}. {current.caption}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
