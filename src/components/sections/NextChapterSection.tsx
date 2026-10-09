import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react';
import { gsap, MQ } from '@/lib/gsap';
import { closingStatement, profile } from '@/content';
import { sceneImages } from '@/content/imagery';
import DepthImage, { type DepthImageHandle } from '@/components/scenes/DepthImage';
import ChapterHeading from '@/components/experience/ChapterHeading';
import Embers from '@/components/experience/Embers';

/**
 * 08 — WHAT'S NEXT. The page's last scene, and its footer.
 *
 * Back above the valley the story started in, at the other end of the night. The
 * figure stands on the summit facing the sun; below are the lake, the town, and a lit
 * lodge among the trees. The warm light that began as a lantern on a cabin table is
 * now the whole horizon.
 *
 * The frame arrives under a veil of night and clears as you scroll — day breaking —
 * while the camera drifts toward the sun (with real depth on desktop: the rock and the
 * pines slide past the peaks).
 *
 * The contact panel is deliberately compact: real links, one copy button, no form
 * pretending to send mail.
 */
export default function NextChapterSection() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<DepthImageHandle>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard blocked: the address is right there as a mailto link.
      setCopied(false);
    }
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      const camera = { push: 0 };
      const applyCamera = () => scene.current?.setPush(camera.push);

      /** Daybreak, shared by both layouts: the veil of night lifts and the camera drifts toward the sun. */
      const daybreak = (tl: gsap.core.Timeline, length: number, travel: number) =>
        tl
          .fromTo(q('.dawn-night'), { opacity: 0.66 }, { opacity: 0, duration: length, ease: 'power1.out' }, 0)
          .fromTo(camera, { push: 0 }, { push: travel, duration: 1, onUpdate: applyCamera }, 0);

      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        });
        daybreak(tl, 0.6, 0.85)
          // the reflection gives way to the invitation
          .fromTo(q('.next-intro'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -28, duration: 0.12 }, 0.44)
          .fromTo(q('.next-final'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.58);
        return () => {
          camera.push = 0;
          applyCamera();
        };
      });

      mm.add(MQ.mobile, () => {
        daybreak(gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom bottom', scrub: 0.6 } }), 0.7, 0.6);
        return () => {
          camera.push = 0;
          applyCamera();
        };
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id='next'
      className='stage bg-[#080C1A]'
      data-sticky='desktop'
      style={{ ['--len-desktop' as string]: '260vh' }}
      aria-labelledby='next-title'
    >
      <div className='stage-sticky flex flex-col'>
        {/* On small screens (and with reduced motion) the scene is one screen tall, anchored to the bottom of a longer page. */}
        <div className='absolute inset-x-0 bottom-0 h-[100svh] overflow-hidden lg:motion-safe:inset-0 lg:motion-safe:h-auto' aria-hidden='true'>
          <DepthImage ref={scene} image={sceneImages.finale} />
          {/* The veil of night. Clear by default, so without animation the scene is simply the sunrise. */}
          <div className='dawn-night absolute inset-0 bg-[#060A1C] opacity-0' />
          {/* Stacked layout: the page's dark runs into the top of the picture, so the words above never sit on bright sky. */}
          <div className='absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#080C1A] via-[#080C1A]/80 to-transparent lg:motion-safe:hidden' />
        </div>

        <Embers count={22} color='255, 226, 180' className='z-[11] opacity-60' />

        {/* Shade only the column the words sit in; the hiker and the sunrise stay untouched. */}
        <div
          className='pointer-events-none absolute inset-0 z-[12] hidden lg:motion-safe:block'
          style={{ background: 'linear-gradient(90deg,rgba(6,9,22,.9) 0%,rgba(6,9,22,.76) 26%,rgba(6,9,22,.28) 44%,rgba(6,9,22,0) 56%)' }}
          aria-hidden='true'
        />
        {/* …and a little under the footer line, which sits on the bright foreground */}
        <div className='pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-36 bg-gradient-to-t from-[#05070F]/90 to-transparent' aria-hidden='true' />

        <div className='relative z-20 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-[var(--gutter)] pb-8 pt-[18vh] lg:pt-[15vh]'>
          <div className='relative flex-1'>
            {/* First: the reflection */}
            <div className='next-intro max-w-[44rem] lg:motion-safe:absolute lg:motion-safe:inset-x-0 lg:motion-safe:top-0'>
              <ChapterHeading chapter='next' />
            </div>

            {/* Then: the invitation. On desktop it replaces the reflection as the sun clears the ridge. */}
            <div id='contact' data-stage-progress='0.86' className='next-final mt-20 max-w-[46rem] outline-none lg:motion-safe:absolute lg:motion-safe:inset-x-0 lg:motion-safe:top-0 lg:motion-safe:mt-0'>
              <p className='font-serif text-[clamp(2.4rem,min(5.4vw,9.5vh),5rem)] leading-[1.02] tracking-[-0.015em] text-parchment [text-wrap:balance]'>{closingStatement}</p>

              <div className='mt-7 flex flex-wrap gap-3'>
                <a href={`mailto:${profile.email}?subject=${encodeURIComponent('Hello Harshit')}`} className='btn-primary'>
                  Let&rsquo;s talk
                </a>
                <a href={profile.resume.href} download={profile.resume.fileName} className='btn-ghost'>
                  <Download className='h-4 w-4' aria-hidden='true' />
                  Download résumé
                </a>
              </div>

              <dl className='mt-8 grid max-w-[34rem] gap-x-8 gap-y-3 border-t border-parchment/20 pt-5 text-[0.95rem] sm:grid-cols-[7rem_1fr]'>
                <dt className='text-parchment/60'>Email</dt>
                <dd className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                  <a href={`mailto:${profile.email}`} className='text-link break-all'>
                    {profile.email}
                  </a>
                  <button
                    type='button'
                    onClick={copyEmail}
                    className='inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-parchment/25 px-3 text-[0.78rem] font-semibold text-parchment/85 transition-colors hover:border-champagne hover:text-champagne'
                  >
                    {copied ? <Check className='h-3.5 w-3.5' aria-hidden='true' /> : <Copy className='h-3.5 w-3.5' aria-hidden='true' />}
                    <span aria-live='polite'>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </dd>
                {profile.socials.map((s) => (
                  <div key={s.id} className='contents'>
                    <dt className='text-parchment/60'>{s.label}</dt>
                    <dd>
                      <a href={s.href} target='_blank' rel='noopener noreferrer' className='text-link inline-flex items-center gap-1'>
                        {s.handle}
                        <ArrowUpRight className='h-3.5 w-3.5' aria-hidden='true' />
                        <span className='sr-only'>(opens in a new tab)</span>
                      </a>
                    </dd>
                  </div>
                ))}
                <dt className='text-parchment/60'>Based in</dt>
                <dd>{profile.location}</dd>
              </dl>
            </div>
          </div>

          {/* Stacked layout: the words end where the picture begins; this is the clear view of it before the footer. */}
          <div className='h-[62svh] lg:motion-safe:hidden' aria-hidden='true' />

          <footer className='relative mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-parchment/15 pt-5 text-[0.8rem] text-parchment/60'>
            <p>
              © {new Date().getFullYear()} {profile.name}. Built with React, GSAP and Three.js.
            </p>
            <a href='#prologue' className='text-link'>
              Back to the beginning
            </a>
          </footer>
        </div>
      </div>
    </section>
  );
}
