import { lazy, Suspense, useRef } from 'react';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import MagneticButton from '@/components/effects/MagneticButton';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';

const Hero3D = lazy(() => import('@/components/Hero3D'));

export default function Home() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLAnchorElement>(null);

  // Kinetic intro reveal
  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(badgeRef.current, { opacity: 0, y: 20, duration: 0.6 })
        .from(
          headingRef.current,
          { opacity: 0, y: 60, scale: 0.95, duration: 1 },
          '-=0.35'
        )
        .from(taglineRef.current, { opacity: 0, y: 25, duration: 0.7 }, '-=0.6')
        .from(ctaRef.current, { opacity: 0, y: 25, duration: 0.7 }, '-=0.5')
        .from(scrollRef.current, { opacity: 0, duration: 0.6 }, '-=0.3');
    },
    { scope: heroSectionRef }
  );

  // Scroll-out parallax: text drifts up + fades, the 3D scene drifts slower
  // (a smaller distance) than the text — classic depth-of-field parallax.
  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(heroContentRef.current, {
            yPercent: self.progress * -35,
            opacity: 1 - self.progress * 0.9,
          });
        },
      });
      return () => trigger.kill();
    },
    { scope: heroSectionRef }
  );

  return (
    <div>
      {/* Full-viewport interactive hero */}
      <section
        ref={heroSectionRef}
        id='hero'
        className='relative min-h-screen flex items-center justify-center overflow-hidden'
      >
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>

        <div
          ref={heroContentRef}
          className='relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 text-center md:text-left pointer-events-none'
        >
          <span
            ref={badgeRef}
            className='pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-primary/20 text-sm font-medium text-primary mb-8'
          >
            <Sparkles className='w-4 h-4' />
            Frontend Developer & UI/UX Designer
          </span>

          <h1
            ref={headingRef}
            className='text-6xl sm:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-6 tracking-tight max-w-3xl'
          >
            <span className='text-foreground'>Harshit</span>{' '}
            <span className='gradient-text'>Raj</span>
          </h1>

          <p
            ref={taglineRef}
            className='text-muted-foreground text-lg sm:text-xl max-w-lg mx-auto md:mx-0 mb-10'
          >
            Crafting immersive digital experiences with pixel-perfect
            precision and thoughtful interaction design.
          </p>

          <div
            ref={ctaRef}
            className='pointer-events-auto flex flex-wrap items-center justify-center md:justify-start gap-4'
          >
            <MagneticButton>
              <a href='#projects' className='glow-button' data-cursor='view'>
                <span className='inline-flex items-center gap-2'>
                  View Work <ArrowRight className='w-4 h-4' />
                </span>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href='#contact' className='outline-glow-button' data-cursor='view'>
                Contact Me
              </a>
            </MagneticButton>
          </div>
        </div>

        <a
          ref={scrollRef}
          href='#about'
          className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors z-10'
        >
          <span className='text-xs uppercase tracking-widest'>Scroll</span>
          <ArrowDown className='w-4 h-4 animate-bounce' />
        </a>
      </section>

      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
