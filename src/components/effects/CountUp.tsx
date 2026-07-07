import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface CountUpProps {
  /** e.g. "7+", "6+", "1+" — leading number is animated, trailing text kept as-is. */
  value: string;
  duration?: number;
}

export default function CountUp({ value, duration = 1.5 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const isInt = Number.isInteger(target);

  useGSAP(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            if (ref.current) {
              const display = isInt ? Math.round(counter.val) : counter.val.toFixed(1);
              ref.current.textContent = `${display}${suffix}`;
            }
          },
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return <span ref={ref}>{`0${suffix}`}</span>;
}
