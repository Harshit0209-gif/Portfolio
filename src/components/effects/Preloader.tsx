import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Progress } from '@/components/ui/progress';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // Lazy-init so the sessionStorage read only happens once per mount, not per render.
  const [alreadyPlayed] = useState(
    () => sessionStorage.getItem('intro-played') === 'true'
  );

  useGSAP(() => {
    document.body.style.overflow = 'hidden';

    const finish = () => {
      document.body.style.overflow = '';
      sessionStorage.setItem('intro-played', 'true');
      ScrollTrigger.refresh();
      setDone(true);
      onComplete();
    };

    if (reducedMotion || alreadyPlayed) {
      finish();
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });

    tl.from(nameRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    });

    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 1.4,
        ease: 'power1.inOut',
        onUpdate: function () {
          setProgress(Math.round(this.targets()[0].val));
        },
      },
      '-=0.1'
    );

    tl.to(nameRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
    });

    tl.to(
      curtainRef.current,
      {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
      },
      '-=0.1'
    );

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={curtainRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-background"
      >
        <div
          ref={nameRef}
          className="font-display text-2xl md:text-3xl gradient-text tracking-tight"
        >
          Harshit Raj
        </div>
        <div className="w-48 md:w-64">
          <Progress value={progress} className="h-1" />
        </div>
      </div>
    </div>
  );
}
