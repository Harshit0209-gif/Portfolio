import { useRef, ElementType } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface SplitTextRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  start?: string;
}

export default function SplitTextReveal({
  text,
  as: Tag = 'span',
  className,
  start = 'top 85%',
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const words = text.split(' ');

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const wordEls = container.querySelectorAll('.split-text-word > span');

      const trigger = ScrollTrigger.create({
        trigger: container,
        start,
        once: true,
        onEnter: () => {
          gsap.fromTo(
            wordEls,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.06,
              ease: 'power3.out',
            }
          );
        },
      });

      return () => trigger.kill();
    },
    { scope: containerRef }
  );

  return (
    <Tag ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span className="split-text-word" key={`${word}-${i}`}>
          <span>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}
