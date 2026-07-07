import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface ParallaxOptions {
  /** Positive = drifts down as it scrolls past center; negative = drifts up. */
  speed?: number;
}

export function useParallax<T extends HTMLElement>({ speed = 0.3 }: ParallaxOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        gsap.set(ref.current, { yPercent: (self.progress - 0.5) * speed * 100 });
      },
    });

    return () => trigger.kill();
  }, []);

  return ref;
}
