import { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ } from '@/lib/gsap';
import { profile } from '@/content';
import { sceneImages } from '@/content/imagery';
import DepthImage, { type DepthImageHandle } from '@/components/scenes/DepthImage';
import Embers from '@/components/experience/Embers';

const INTRO_KEY = 'hr:intro-seen';
/** Where the camera rests once the opening has played: already leaning slightly into the valley. */
const REST = 0.12;

/**
 * PROLOGUE — a cabin at sunset, a figure looking out over the valley.
 *
 * Composition: the frame is laid out like a film poster. The name sits in the dark sky
 * at the top, the invitation sits on the dark rock at the bottom, and the middle of the
 * picture — the figure, the peaks, the lake, the sun — is left completely clear.
 *
 * Opening sequence: one point of warm light in the dark (the lantern on the cabin
 * table) grows until it has revealed the whole landscape, the camera eases forward, and
 * the name is set. It runs once per session, can be skipped at any moment (button,
 * Escape, or simply scrolling), and never runs for visitors who prefer reduced motion or
 * arrive on a deep link.
 *
 * Scroll: the camera travels toward the valley. On desktop the photograph is redrawn
 * through a depth map, so the rocks and the cabin slide past faster than the peaks;
 * then mist closes over the frame and chapter one begins inside it.
 */
export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<DepthImageHandle>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const [introPlaying, setIntroPlaying] = useState(false);

  const skipIntro = useCallback(() => {
    introRef.current?.progress(1);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);

      // Two independent contributions to the camera, so scroll and the opening never fight over one value.
      const camera = { scroll: REST, intro: 0 };
      const applyCamera = () => scene.current?.setPush(Math.max(0, camera.scroll + camera.intro));
      applyCamera();

      const mm = gsap.matchMedia();

      // ── Scroll: desktop — a scrubbed dolly toward the valley ────────────────
      mm.add(MQ.desktop, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
          })
          .fromTo(camera, { scroll: REST }, { scroll: 1, duration: 1, onUpdate: applyCamera }, 0)
          .fromTo(q('.hero-copy'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: () => -window.innerHeight * 0.08, duration: 0.4 }, 0)
          .fromTo(q('.hero-cue'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 0)
          .fromTo(q('.hero-mist'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.4)
          .fromTo(q('.hero-fog'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.7);
        return () => {
          camera.scroll = REST;
          applyCamera();
        };
      });

      // ── Scroll: mobile — the picture lags the page a little as it leaves ─────
      mm.add(MQ.mobile, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          })
          .fromTo(q('.hero-scene'), { y: 0 }, { y: () => window.innerHeight * 0.24 }, 0)
          .fromTo(q('.hero-copy'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.6 }, 0.1);
      });

      // ── Opening sequence ───────────────────────────────────────────────────
      const docEl = document.documentElement;
      if (!docEl.classList.contains('intro-pending')) return;

      const sticky = q('.stage-sticky')[0];
      const curtain = q('.intro-curtain')[0];
      const spark = q('.intro-spark')[0];
      const letters = q('.hero-name .line-mask > span');
      const copyParts = q('[data-intro]');
      // Navigation lives outside this section, and GSAP scopes selector text to it — so query the document directly.
      const chrome = Array.from(document.querySelectorAll<HTMLElement>('[data-intro-chrome]'));

      /** The lantern, wherever the crop has put it; kept on screen if the crop has cut it off. */
      const lightPoint = () => {
        const { width, height } = sticky.getBoundingClientRect();
        const p = scene.current?.pointOnScreen(sceneImages.prologue.light) ?? { x: width * 0.2, y: height * 0.42 };
        return { x: gsap.utils.clamp(width * 0.1, width * 0.9, p.x), y: gsap.utils.clamp(height * 0.15, height * 0.85, p.y) };
      };
      const p = lightPoint();

      // Take over from the CSS holding state in the same frame, so nothing flashes.
      gsap.set(curtain, { '--ix': `${p.x}px`, '--iy': `${p.y}px` });
      gsap.set(spark, { left: p.x, top: p.y, scale: 0, opacity: 0 });
      gsap.set(letters, { yPercent: 115 });
      gsap.set([...copyParts, ...chrome], { autoAlpha: 0 });
      gsap.set(copyParts, { y: 16 });
      camera.intro = -REST;
      applyCamera();
      curtain.classList.add('is-active');
      docEl.classList.remove('intro-pending');
      setIntroPlaying(true);

      // The picture may still be decoding when we start; once it is in, aim the light at the real lantern.
      const image = el.querySelector('img');
      const reaim = () => {
        const next = lightPoint();
        gsap.set(curtain, { '--ix': `${next.x}px`, '--iy': `${next.y}px` });
        gsap.set(spark, { left: next.x, top: next.y });
      };
      image?.addEventListener('load', reaim, { once: true });

      const finish = () => {
        try {
          sessionStorage.setItem(INTRO_KEY, '1');
        } catch {
          /* private mode — the intro will simply play again next time */
        }
        curtain.classList.remove('is-active');
        gsap.set(spark, { opacity: 0 });
        introRef.current = null;
        setIntroPlaying(false);
      };

      introRef.current = gsap
        .timeline({ defaults: { ease: 'power3.out' }, onComplete: finish })
        // a point of light appears against darkness…
        .to(spark, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.2)
        .to(spark, { scale: 1.5, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0.8)
        // …and gradually reveals the landscape around it
        .to(curtain, { '--ir': '160vmax', duration: 2.5, ease: 'power2.inOut' }, 1.05)
        .to(spark, { opacity: 0, duration: 0.5 }, 1.5)
        // the camera gently moves forward; with the depth pass, near and far respond at different speeds
        .to(camera, { intro: 0, duration: 3.6, ease: 'power2.out', onUpdate: applyCamera }, 1.05)
        .to(letters, { yPercent: 0, duration: 1.25, stagger: 0.05, ease: 'power4.out' }, 2.15)
        .to(copyParts, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.13 }, 2.85)
        .to(chrome, { autoAlpha: 1, duration: 0.9 }, 3.2);

      return () => image?.removeEventListener('load', reaim);
    },
    { scope: root }
  );

  // Never make anyone wait: any intent to move on completes the sequence instantly.
  useEffect(() => {
    if (!introPlaying) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow') || e.key.startsWith('Page')) {
        skipIntro();
      }
    };
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('wheel', skipIntro, opts);
    window.addEventListener('touchmove', skipIntro, opts);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', skipIntro);
      window.removeEventListener('touchmove', skipIntro);
      window.removeEventListener('keydown', onKey);
    };
  }, [introPlaying, skipIntro]);

  const [first, last] = profile.name.split(' ');

  return (
    <section
      ref={root}
      id='prologue'
      className='stage bg-[#07090F]'
      data-sticky='desktop'
      style={{ ['--len-desktop' as string]: '210vh' }}
      aria-labelledby='hero-title'
    >
      <div className='stage-sticky'>
        <DepthImage ref={scene} image={sceneImages.prologue} priority className='hero-scene' />

        <Embers count={34} className='z-[5] opacity-70' />

        {/* Legibility: shade the sky behind the name and the rock behind the invitation; leave the valley alone */}
        <div className='pointer-events-none absolute inset-x-0 top-0 z-[12] h-[52%] bg-gradient-to-b from-[#05070C]/90 via-[#05070C]/45 to-transparent' aria-hidden='true' />
        <div
          className='pointer-events-none absolute inset-0 z-[12] max-lg:hidden'
          style={{ background: 'radial-gradient(ellipse 78% 62% at 8% 104%,rgba(5,7,12,.94) 0%,rgba(5,7,12,.72) 38%,rgba(5,7,12,0) 72%)' }}
          aria-hidden='true'
        />
        {/* portrait: the words span the full width, so the shade does too */}
        <div className='pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-[58%] bg-gradient-to-t from-[#05070C]/95 via-[#05070C]/75 to-transparent lg:hidden' aria-hidden='true' />

        <div className='hero-copy relative z-20 flex min-h-[100svh] flex-col justify-between px-[var(--gutter)] pb-[8svh] pt-[13svh] lg:h-full lg:pb-[9vh] lg:pt-[13vh]'>
          <div>
            <h1 id='hero-title' className='hero-name' aria-label={profile.name}>
              {[first, last].map((word, wi) => (
                <span key={word} aria-hidden='true'>
                  <span className='word'>
                    {word.split('').map((letter, li) => (
                      <span key={li} className='line-mask'>
                        <span>{letter}</span>
                      </span>
                    ))}
                  </span>
                  {wi === 0 ? ' ' : ''}
                </span>
              ))}
            </h1>
            <p className='chapter-label mt-4 lg:mt-5' data-intro>
              {profile.role}
            </p>
          </div>

          <div className='max-w-[31rem]'>
            <p className='font-serif text-[clamp(1.55rem,2.5vw,2.25rem)] leading-[1.15] text-parchment' data-intro>
              {profile.heroHeadline}
            </p>
            <p className='lede mt-4' data-intro>
              {profile.heroIntro}
            </p>
            <div className='mt-7 flex flex-wrap gap-3' data-intro>
              <a href='#beginning' className='btn-primary'>
                Explore my journey
              </a>
              <a href='#projects' className='btn-ghost bg-[#05070C]/40'>
                View my work
              </a>
            </div>
          </div>
        </div>

        {/* Two elements on purpose: scroll fades the wrapper, the intro reveals the link inside it. */}
        <div className='hero-cue absolute bottom-6 right-[var(--gutter)] z-20 hidden lg:block'>
          <a
            href='#beginning'
            className='flex flex-col items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-parchment/80 transition-colors hover:text-champagne'
            data-intro
          >
            <span>Scroll</span>
            <span className='block h-10 w-px overflow-hidden bg-parchment/20' aria-hidden='true'>
              <span className='scroll-cue-line block h-full w-full bg-champagne' />
            </span>
          </a>
        </div>

        {/* Valley mist: thickens with scroll and becomes the air of chapter one */}
        <div
          className='hero-mist invisible pointer-events-none absolute inset-0 z-30 opacity-0'
          style={{ background: 'linear-gradient(180deg,rgba(22,32,47,0) 0%,rgba(22,32,47,.75) 45%,#16202F 78%)' }}
          aria-hidden='true'
        />
        <div className='hero-fog invisible pointer-events-none absolute inset-0 z-30 bg-[#16202F] opacity-0' aria-hidden='true' />

        <div className='intro-curtain' aria-hidden='true' />
        <span className='intro-spark' aria-hidden='true' />

        {introPlaying && (
          <button type='button' onClick={skipIntro} className='btn-ghost btn-sm absolute bottom-6 left-1/2 z-50 -translate-x-1/2 bg-midnight/70'>
            Skip intro
          </button>
        )}
      </div>
    </section>
  );
}
