import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { useCanHover } from '@/hooks/use-can-hover';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();
  const reducedMotion = useReducedMotion();
  const active = canHover && !reducedMotion;

  useGSAP(
    () => {
      if (!active || !dotRef.current || !ringRef.current) return;

      document.documentElement.classList.add('custom-cursor-active');

      const dotX = gsap.quickTo(dotRef.current, 'x', {
        duration: 0.1,
        ease: 'power3',
      });
      const dotY = gsap.quickTo(dotRef.current, 'y', {
        duration: 0.1,
        ease: 'power3',
      });
      const ringX = gsap.quickTo(ringRef.current, 'x', {
        duration: 0.45,
        ease: 'power3',
      });
      const ringY = gsap.quickTo(ringRef.current, 'y', {
        duration: 0.45,
        ease: 'power3',
      });

      const handleMove = (e: MouseEvent) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const handleEnter = (e: Event) => {
        const target = e.target as HTMLElement;
        const cursorTarget = target.closest('[data-cursor]');
        if (cursorTarget) {
          ringRef.current?.classList.add('cursor-active');
          gsap.to(ringRef.current, { scale: 2.4, duration: 0.35, ease: 'power3.out' });
          gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
        }
      };

      const handleLeave = (e: Event) => {
        const target = e.target as HTMLElement;
        const cursorTarget = target.closest('[data-cursor]');
        if (cursorTarget) {
          ringRef.current?.classList.remove('cursor-active');
          gsap.to(ringRef.current, { scale: 1, duration: 0.35, ease: 'power3.out' });
          gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
        }
      };

      window.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseover', handleEnter);
      document.addEventListener('mouseout', handleLeave);

      return () => {
        document.documentElement.classList.remove('custom-cursor-active');
        window.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseover', handleEnter);
        document.removeEventListener('mouseout', handleLeave);
      };
    },
    { dependencies: [active] }
  );

  if (!active) return null;

  return (
    <>
      <div
        ref={dotRef}
        className='fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[200] -translate-x-1/2 -translate-y-1/2'
        aria-hidden='true'
      />
      <div
        ref={ringRef}
        className='cursor-ring fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/60 pointer-events-none z-[200] -translate-x-1/2 -translate-y-1/2'
        aria-hidden='true'
      />
    </>
  );
}
