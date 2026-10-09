import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ } from '@/lib/gsap';
import { chapterById, type ChapterId } from '@/content';

interface ChapterHeadingProps {
  chapter: ChapterId;
  className?: string;
  /** Extra content revealed with the supporting copy (controls, notes). */
  children?: ReactNode;
  /** Override the body copy from the story file. */
  body?: string;
}

/**
 * The title card that opens each chapter: sequence marker, headline, supporting copy.
 * The headline rises word by word out of its own baseline, like an intertitle being set.
 * Splitting by word (not by measured line) keeps the effect correct at any width.
 */
export default function ChapterHeading({ chapter, className = '', children, body }: ChapterHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const { number, title, headline, body: storyBody } = chapterById[chapter];
  const copy = body ?? storyBody;
  const words = (headline ?? title).split(' ');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current;
        if (!el) return;
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } })
          .from(el.querySelector('.chapter-label'), { autoAlpha: 0, x: -16, duration: 0.7 })
          .from(el.querySelectorAll('.headline .line-mask > span'), { yPercent: 110, duration: 1.1, stagger: 0.06, ease: 'power4.out' }, 0.1)
          .from(el.querySelectorAll('[data-follow]'), { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.12 }, 0.5);
      });
    },
    { scope: ref }
  );

  return (
    <header ref={ref} className={className}>
      <p className='chapter-label'>
        {number && <span className='chapter-num'>{number}</span>}
        {number && <span className='chapter-rule' aria-hidden='true' />}
        <span>{title}</span>
      </p>
      <h2 id={`${chapter}-title`} className='headline mt-5' aria-label={headline ?? title}>
        {words.map((word, i) => (
          <span key={i} aria-hidden='true'>
            <span className='line-mask'>
              <span>{word}</span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h2>
      {copy && (
        <p className='lede mt-6' data-follow>
          {copy}
        </p>
      )}
      {children && <div data-follow>{children}</div>}
    </header>
  );
}
