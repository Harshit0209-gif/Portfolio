import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });
gsap.ticker.lagSmoothing(0);

/**
 * Media conditions shared by every chapter, for use with gsap.matchMedia().
 * Motion is opt-out at the OS level: anything under `reduced` must leave content
 * fully visible and usable with no scrubbing, pinning or large displacement.
 */
export const MQ = {
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

export { gsap, ScrollTrigger };
