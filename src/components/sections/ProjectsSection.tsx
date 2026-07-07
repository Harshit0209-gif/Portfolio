import { useRef } from 'react';
import { Github, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useParallax } from '@/hooks/useParallax';
import MagneticButton from '@/components/effects/MagneticButton';
import SplitTextReveal from '@/components/effects/SplitTextReveal';
import { projects, type Project } from '@/data/projects';

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const parallaxImgRef = useParallax<HTMLDivElement>({ speed: index % 2 === 0 ? 0.55 : -0.55 });
  const reversed = index % 2 === 1;

  useGSAP(() => {
    if (!imageWrapRef.current) return;
    const fromClip = reversed ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';

    const trigger = ScrollTrigger.create({
      trigger: imageWrapRef.current,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: fromClip },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.1,
            ease: 'power4.out',
            onComplete: () =>
              gsap.set(imageWrapRef.current, { clipPath: 'inset(0% 0% 0% 0%)' }),
          }
        );
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      className={`flex flex-col ${
        reversed ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-center gap-10 md:gap-16 py-14 md:py-24 border-b border-border/50 last:border-0`}
    >
      <div
        ref={imageWrapRef}
        className='relative w-full md:w-3/5 h-64 sm:h-80 md:h-[440px] rounded-2xl overflow-hidden'
      >
        <div
          ref={parallaxImgRef}
          className='absolute -inset-y-[18%] inset-x-0 bg-cover bg-center'
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent' />
        <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 group'>
          <MagneticButton>
            <a
              href={project.github}
              target='_blank'
              rel='noopener noreferrer'
              className='p-4 rounded-full bg-foreground/10 hover:bg-primary/20 border border-border hover:border-primary/50 transition-all'
              data-cursor='view'
            >
              <Github className='w-6 h-6' />
            </a>
          </MagneticButton>
        </div>
      </div>

      <div className='relative w-full md:w-2/5'>
        <span className='absolute -top-14 md:-top-20 left-0 text-[6rem] md:text-[9rem] font-display font-bold text-foreground/[0.05] leading-none select-none pointer-events-none'>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className='relative'>
          <h3 className='text-2xl md:text-3xl font-display font-bold mb-3'>
            {project.title}
          </h3>
          <p className='text-muted-foreground mb-5'>{project.description}</p>
          <div className='flex flex-wrap gap-2 mb-7'>
            {project.tech.map((tech) => (
              <span
                key={tech}
                className='px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-border/50'
              >
                {tech}
              </span>
            ))}
          </div>
          <MagneticButton>
            <a
              href={project.github}
              target='_blank'
              rel='noopener noreferrer'
              className='outline-glow-button inline-flex items-center gap-2'
              data-cursor='view'
            >
              <Github className='w-4 h-4' />
              View on GitHub
              <ArrowRight className='w-4 h-4' />
            </a>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const glowA = useParallax<HTMLDivElement>({ speed: 0.5 });
  const glowB = useParallax<HTMLDivElement>({ speed: -0.35 });

  return (
    <section
      id='projects'
      className='relative py-20 md:py-28 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden'
    >
      {/* Parallax decorative glows */}
      <div
        ref={glowA}
        className='absolute -top-20 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none'
      />
      <div
        ref={glowB}
        className='absolute top-1/2 -right-32 w-[28rem] h-[28rem] bg-secondary/10 rounded-full blur-3xl pointer-events-none'
      />

      <div className='relative'>
        <div className='text-center mb-4'>
          <SplitTextReveal
            as='h2'
            text='Selected Work'
            className='section-title gradient-text mb-4'
          />
          <p className='section-subtitle mx-auto'>
            Freelance projects showcasing my expertise in frontend development
            and design
          </p>
        </div>

        <div>
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className='text-center mt-8'>
          <MagneticButton>
            <a
              href='https://github.com/Harshit0209-gif'
              target='_blank'
              rel='noopener noreferrer'
              className='outline-glow-button inline-flex items-center gap-2'
              data-cursor='view'
            >
              <Github className='w-4 h-4' />
              View All on GitHub
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
