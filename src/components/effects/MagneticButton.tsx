import { useRef, ReactNode, cloneElement, isValidElement } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { useCanHover } from '@/hooks/use-can-hover';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  disabled?: boolean;
  className?: string;
}

export default function MagneticButton({
  children,
  strength = 0.35,
  disabled = false,
  className,
}: MagneticButtonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();
  const reducedMotion = useReducedMotion();
  const active = canHover && !reducedMotion && !disabled;

  useGSAP(
    () => {
      const el = wrapperRef.current;
      if (!el || !active) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      };

      const handleLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseleave', handleLeave);

      return () => {
        el.removeEventListener('mousemove', handleMove);
        el.removeEventListener('mouseleave', handleLeave);
      };
    },
    { dependencies: [active, strength] }
  );

  return (
    <div
      ref={wrapperRef}
      className={`magnetic-target inline-flex ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
