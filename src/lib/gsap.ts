import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });
gsap.ticker.lagSmoothing(0);

export { gsap, ScrollTrigger };
