import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ } from '@/lib/gsap';
import { sceneImages } from '@/content/imagery';
import DepthImage, { type DepthImageHandle } from '@/components/scenes/DepthImage';
import ChapterHeading from '@/components/experience/ChapterHeading';

const CODE = ['<section class="idea">', '  <h1>Hello, world</h1>', '  <button>Try it</button>', '</section>'];

/**
 * 01 — THE BEGINNING. Theme: curiosity.
 *
 * The same valley as the prologue, but the figure is on their feet now, pack on, looking
 * at where the trail goes. The photograph stays fixed behind the chapter (CSS sticky)
 * while the words travel over it, and the camera keeps drifting toward the horizon.
 *
 * Beside the hiker, a notebook page draws its own first wireframe and a few lines of
 * markup appear — the moment an idea starts to become a thing. The last stroke is the
 * sketched button filling with warm light: the window chapter two opens on. Then the
 * light goes, and night falls for the walk to the cabin.
 */
export default function BeginningSection() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<DepthImageHandle>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // The camera keeps moving for as long as the chapter is on screen.
        const camera = { push: 0 };
        gsap.to(camera, {
          push: 0.8,
          ease: 'none',
          onUpdate: () => scene.current?.setPush(camera.push),
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });

        // The notebook: strokes draw, labels settle, markup is typed, the button warms.
        const visual = q('.notebook')[0];
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: visual, start: 'top 82%', end: 'bottom 58%', scrub: 0.7 },
          })
          .fromTo(q('.sketch [pathLength]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.035 }, 0)
          .fromTo(q('.sketch-note'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, stagger: 0.06 }, 0.45)
          .fromTo(q('.code-line'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.16, stagger: 0.1 }, 0.5)
          .fromTo(q('.sketch-spark'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.14 }, 0.86);

        return () => scene.current?.setPush(0);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id='beginning' className='relative bg-midnight' aria-labelledby='beginning-title'>
      {/* The scene stays put while the chapter scrolls over it */}
      <div className='sticky top-0 h-[100svh] overflow-hidden' aria-hidden='true'>
        <DepthImage ref={scene} image={sceneImages.beginning} />
        {/* shade the side the words sit on; the hiker and the sunrise stay untouched */}
        <div
          className='absolute inset-0 max-lg:hidden'
          style={{ background: 'linear-gradient(90deg,rgba(6,10,20,.9) 0%,rgba(6,10,20,.74) 30%,rgba(6,10,20,.2) 58%,rgba(6,10,20,0) 70%)' }}
        />
        <div className='absolute inset-0 lg:hidden' style={{ background: 'linear-gradient(180deg,rgba(6,10,20,.92) 0%,rgba(6,10,20,.7) 34%,rgba(6,10,20,.14) 58%,rgba(6,10,20,.3) 100%)' }} />
      </div>

      <div className='relative z-10 -mt-[100svh]'>
        {/* The mist we arrived in, thinning as we walk out of it */}
        <div
          className='pointer-events-none absolute inset-x-0 top-0 h-[55vh]'
          style={{ background: 'linear-gradient(180deg,#16202F 0%,rgba(22,32,47,.7) 34%,rgba(22,32,47,0) 100%)' }}
          aria-hidden='true'
        />

        <div className='relative mx-auto flex min-h-[100svh] max-w-[1400px] items-start px-[var(--gutter)] pt-[22svh] lg:items-center lg:pt-0'>
          <ChapterHeading chapter='beginning' className='max-w-[34rem]' />
        </div>

        <div className='relative mx-auto max-w-[1400px] px-[var(--gutter)] pb-[16vh] lg:grid lg:grid-cols-12'>
          <div className='notebook relative lg:col-span-6'>
            <figure className='notebook-page relative -rotate-1'>
              <svg className='sketch block w-full' viewBox='0 0 520 360' fill='none' role='img' aria-label='A hand-drawn wireframe of a web page: navigation, a headline, a button, an image and three cards.'>
                <g stroke='#D8B878' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' strokeDasharray='1'>
                  <rect pathLength='1' x='20' y='20' width='480' height='320' rx='10' />
                  <path pathLength='1' d='M20 62H500' />
                  <path pathLength='1' d='M60 41h64' />
                  <path pathLength='1' d='M352 41h34M400 41h34M448 41h26' />
                  <path pathLength='1' d='M60 112h214' strokeWidth='5' />
                  <path pathLength='1' d='M60 140h150' strokeWidth='5' />
                  <path pathLength='1' d='M60 172h204M60 188h176' opacity='.6' />
                  <rect pathLength='1' x='60' y='212' width='104' height='32' rx='16' />
                  <rect pathLength='1' x='318' y='94' width='152' height='152' rx='6' />
                  <path pathLength='1' d='M318 94L470 246M470 94L318 246' opacity='.45' />
                  <rect pathLength='1' x='60' y='272' width='126' height='46' rx='5' />
                  <rect pathLength='1' x='197' y='272' width='126' height='46' rx='5' />
                  <rect pathLength='1' x='334' y='272' width='136' height='46' rx='5' />
                </g>
                {/* the button warms: the first light of the next chapter */}
                <g className='sketch-spark'>
                  <rect x='60' y='212' width='104' height='32' rx='16' fill='#F0A35E' />
                  <ellipse cx='112' cy='228' rx='110' ry='60' fill='url(#notebook-glow)' />
                </g>
                <defs>
                  <radialGradient id='notebook-glow'>
                    <stop offset='0' stopColor='#F0A35E' stopOpacity='0.45' />
                    <stop offset='1' stopColor='#F0A35E' stopOpacity='0' />
                  </radialGradient>
                </defs>
                <g className='font-sans' fill='#A9CBE0' fontSize='12' fontWeight='500'>
                  <text className='sketch-note' x='132' y='36'>
                    nav
                  </text>
                  <text className='sketch-note' x='286' y='130'>
                    headline
                  </text>
                  <text className='sketch-note' x='176' y='233'>
                    call to action
                  </text>
                  <text className='sketch-note' x='374' y='264'>
                    cards
                  </text>
                </g>
              </svg>
            </figure>

            <pre
              className='code-card relative z-10 -mt-10 ml-auto w-[min(100%,21rem)] overflow-hidden rounded-[6px] border border-parchment/10 bg-[#070C17]/95 p-4 font-mono text-[0.78rem] leading-relaxed text-ice shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] sm:mr-6'
              aria-label='The first lines of markup'
            >
              <code>
                {CODE.map((line) => (
                  <span key={line} className='code-line block whitespace-pre'>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>

        {/* Night falls: the last screen of the chapter fades the valley into the dark of the next one.
            Pure CSS, so it happens with or without animation. */}
        <div className='pointer-events-none h-[70svh] bg-gradient-to-b from-transparent via-midnight/80 to-midnight' aria-hidden='true' />
      </div>
    </section>
  );
}
