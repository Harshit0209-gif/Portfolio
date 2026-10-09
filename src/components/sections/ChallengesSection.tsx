import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Check } from 'lucide-react';
import { gsap, MQ } from '@/lib/gsap';
import { challenges } from '@/content';
import ChapterHeading from '@/components/experience/ChapterHeading';

// Where each fragment starts before it finds its place: offset (in vw/vh) and tilt.
const SCATTER = [
  { x: -7, y: 6, r: -7 },
  { x: 9, y: -5, r: 5 },
  { x: -4, y: -7, r: 4 },
  { x: 6, y: 8, r: -6 },
  { x: -10, y: 2, r: 8 },
  { x: 5, y: -3, r: -9 },
];

/**
 * 06 — THE CHALLENGES. Patience, iteration, debugging.
 *
 * The room is dark and the monitors are off. What is left on the desk are fragments:
 * six real problems from the repositories, loose and unresolved. As you scroll, the
 * lamp comes back up, the fragments straighten into a grid, and each one gains the
 * line that fixed it. No melodrama — just the work of making things right.
 */
export default function ChallengesSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const cards = q('.fragment');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
        });
        cards.forEach((card, i) => {
          const s = SCATTER[i % SCATTER.length];
          tl.fromTo(
            card,
            { x: () => (s.x * window.innerWidth) / 100, y: () => (s.y * window.innerHeight) / 100, rotation: s.r, opacity: 0.5 },
            { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.34, ease: 'power2.inOut' },
            0.16 + i * 0.03
          );
        });
        tl.fromTo(q('.frag-solid'), { opacity: 0 }, { opacity: 1, duration: 0.12, stagger: 0.03 }, 0.52)
          .fromTo(q('.frag-fix'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.035 }, 0.6)
          .fromTo(q('.room-lamp'), { opacity: 0.12 }, { opacity: 1, duration: 0.6 }, 0.25)
          .fromTo(q('.room-screen'), { opacity: 0 }, { opacity: 1, duration: 0.14, stagger: 0.05 }, 0.74)
          .to({}, { duration: 0.08 });
      });

      mm.add(MQ.mobile, () => {
        q('.fragment').forEach((card, i) => {
          const s = SCATTER[i % SCATTER.length];
          gsap
            .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: card, start: 'top 94%', end: 'top 58%', scrub: 0.5 } })
            .fromTo(card, { rotation: s.r * 0.6, x: s.x * 2, opacity: 0.45 }, { rotation: 0, x: 0, opacity: 1, duration: 0.7 }, 0)
            .fromTo(card.querySelector('.frag-solid'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5)
            .fromTo(card.querySelector('.frag-fix'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.7);
        });
        gsap.fromTo(q('.room-lamp'), { opacity: 0.12 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 40%', end: 'bottom 80%', scrub: true } });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id='challenges'
      className='stage bg-[#03050A]'
      data-sticky='desktop'
      style={{ ['--len-desktop' as string]: '270vh' }}
      aria-labelledby='challenges-title'
    >
      <div className='stage-sticky'>
        {/* The studio after hours */}
        <div className='absolute inset-0' aria-hidden='true'>
          <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg,#03050A 0%,#05080F 70%,#04060B 70.1%,#020308 100%)' }} />
          <div className='room-lamp absolute inset-0' style={{ background: 'radial-gradient(ellipse 50% 60% at 68% 62%,rgba(240,163,94,.2),rgba(240,163,94,.05) 55%,transparent 80%)' }} />
          <div className='absolute right-[8%] top-[5.5%] hidden items-end gap-[1.2vw] opacity-70 lg:flex'>
            {[8, 11, 7].map((w, i) => (
              <div key={i} className='relative rounded-[6px] border-[5px] border-[#080C14] bg-[#05080F]' style={{ width: `${w}vw`, height: `${w * 0.6}vw` }}>
                <span className='absolute inset-0 bg-gradient-to-br from-parchment/[0.05] to-transparent' />
                <span className='room-screen absolute inset-0' style={{ background: 'linear-gradient(160deg,rgba(169,203,224,.22),rgba(216,184,120,.12))' }} />
              </div>
            ))}
          </div>
          <div className='absolute inset-0 scrim-left opacity-70 max-lg:hidden' />
        </div>

        <div className='relative z-10 mx-auto grid max-w-[1400px] gap-12 px-[var(--gutter)] py-[14vh] lg:h-full lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0'>
          <ChapterHeading chapter='challenges' className='challenges-copy lg:col-span-5' />

          <ul className='grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5' aria-label='Problems worked through, and how each was resolved'>
            {challenges.map((c) => (
              <li key={c.problem} className='fragment'>
                <span className='frag-solid' aria-hidden='true' />
                <div className='relative'>
                  <div className='mb-3.5 flex gap-1.5' aria-hidden='true'>
                    <span className='h-1.5 w-9 rounded-full bg-parchment/20' />
                    <span className='h-1.5 w-4 rounded-full bg-parchment/10' />
                  </div>
                  <h3 className='font-serif text-[1.22rem] leading-[1.2] text-parchment'>{c.problem}</h3>
                  <p className='frag-fix mt-2.5 flex gap-2 text-[0.9rem] leading-snug text-parchment/75'>
                    <Check className='mt-[0.2em] h-3.5 w-3.5 shrink-0 text-champagne' aria-hidden='true' />
                    <span>{c.resolution}</span>
                  </p>
                  <a href={`#project-${c.projectSlug}`} className='mt-3 inline-block text-[0.78rem] font-medium text-parchment/65 underline-offset-4 transition-colors hover:text-champagne hover:underline'>
                    {c.project}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
