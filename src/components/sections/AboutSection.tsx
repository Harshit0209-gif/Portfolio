import { useRef } from 'react';
import { Briefcase, Download, FileText, MapPin, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useParallax } from '@/hooks/useParallax';
import BentoCard from '@/components/BentoCard';
import MagneticButton from '@/components/effects/MagneticButton';
import SplitTextReveal from '@/components/effects/SplitTextReveal';
import CountUp from '@/components/effects/CountUp';
import TechMarqueeRows from '@/components/effects/TechMarqueeRows';
import { skills } from '@/data/skills';
import { experience, focusAreas, resumeStats, contactInfo } from '@/data/experience';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const glowA = useParallax<HTMLDivElement>({ speed: 0.4 });
  const glowB = useParallax<HTMLDivElement>({ speed: -0.3 });

  useGSAP(
    () => {
      const railTrigger = ScrollTrigger.create({
        trigger: timelineRef.current,
        start: 'top 65%',
        end: 'bottom 85%',
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(railRef.current, { scaleY: self.progress });
          const railHeight = timelineRef.current?.offsetHeight ?? 0;
          gsap.set(dotRef.current, {
            top: self.progress * railHeight,
            opacity: self.progress > 0.02 && self.progress < 0.98 ? 1 : 0,
          });
        },
      });
      return () => railTrigger.kill();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id='about'
      className='relative py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden'
    >
      <div
        ref={glowA}
        className='absolute -top-10 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none'
      />
      <div
        ref={glowB}
        className='absolute top-[50%] -left-40 w-[26rem] h-[26rem] bg-primary/10 rounded-full blur-3xl pointer-events-none'
      />

      <div className='relative'>
        <div className='text-center mb-8 max-w-3xl mx-auto'>
          <SplitTextReveal as='h2' text='About Me' className='section-title gradient-text mb-6' />
          <p className='text-lg text-muted-foreground leading-relaxed'>
            I'm a passionate frontend developer and designer with a keen eye for detail
            and a love for creating seamless digital experiences. With expertise in
            modern web technologies and a deep understanding of user behavior, I bridge
            the gap between beautiful design and functional code.
          </p>
        </div>

        <div className='flex items-center justify-center gap-4 flex-wrap mb-16 text-sm'>
          <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium'>
            <span className='relative flex h-2 w-2'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75' />
              <span className='relative inline-flex rounded-full h-2 w-2 bg-primary' />
            </span>
            Open to freelance work
          </span>
          <span className='inline-flex items-center gap-2 text-muted-foreground'>
            <MapPin className='w-4 h-4' />
            {contactInfo.location}
          </span>
        </div>

        {/* Focus areas */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
          {focusAreas.map((area) => (
            <BentoCard key={area.title} className='flex-col text-center items-center'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4'>
                <area.icon className='w-7 h-7 text-primary' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>{area.title}</h3>
              <p className='text-sm text-muted-foreground'>{area.description}</p>
            </BentoCard>
          ))}
        </div>

        {/* Tech Stack — GSAP parallax scroll rows */}
        <div className='relative mb-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4'>
          <div className='absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none' />
          <div className='absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none' />

          <div className='text-center mb-10'>
            <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 text-sm font-medium text-primary'>
              <Sparkles className='w-4 h-4' />
              My Arsenal
            </span>
            <h2 className='text-3xl font-display font-bold gradient-text'>Skills & Tech Stack</h2>
          </div>

          <TechMarqueeRows skills={skills} rowCount={3} />
        </div>

        {/* Impact stats */}
        <div className='grid grid-cols-3 gap-4 sm:gap-8 mb-20 max-w-2xl mx-auto text-center'>
          {resumeStats.map((stat) => (
            <BentoCard key={stat.label} className='flex-col items-center justify-center gap-1 py-8'>
              <div className='text-4xl sm:text-5xl font-bold gradient-text font-display'>
                <CountUp value={stat.value} />
              </div>
              <div className='text-xs sm:text-sm text-muted-foreground'>{stat.label}</div>
            </BentoCard>
          ))}
        </div>

        {/* Experience + Resume */}
        <div className='grid lg:grid-cols-2 gap-12 items-start'>
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <Briefcase className='w-5 h-5 text-primary' />
              <h3 className='text-xl font-semibold'>Experience</h3>
            </div>

            <div ref={timelineRef} className='space-y-6 relative'>
              <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-border' />
              <div
                ref={railRef}
                className='absolute left-0 top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-primary to-secondary'
                style={{ transform: 'scaleY(0)' }}
              />
              <div
                ref={dotRef}
                className='absolute left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_4px_hsl(var(--primary)/0.6)] opacity-0 pointer-events-none'
              />
              {experience.map((exp, index) => (
                <div key={`${exp.company}-${index}`} className='relative pl-6'>
                  <div className='absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-primary/50' />
                  <span className='text-xs text-primary font-medium'>{exp.period}</span>
                  <h4 className='text-lg font-semibold mt-1'>{exp.title}</h4>
                  <p className='text-muted-foreground text-sm'>{exp.company}</p>
                  <p className='text-muted-foreground text-sm mt-2'>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <BentoCard className='flex-col text-center items-center'>
            <div className='w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center'>
              <FileText className='w-10 h-10 text-primary' />
            </div>
            <h3 className='text-2xl font-semibold mb-2'>Download My Resume</h3>
            <p className='text-muted-foreground mb-6'>
              Get a comprehensive overview of my skills, experience, and qualifications.
            </p>
            <MagneticButton>
              <a
                href='/Harshit_Raj_Resume.pdf'
                target='_blank'
                rel='noopener noreferrer'
                className='glow-button inline-flex items-center gap-2'
                data-cursor='view'
              >
                <Download className='w-4 h-4' />
                <span>Download PDF</span>
              </a>
            </MagneticButton>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
