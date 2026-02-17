import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
  // Cursor position for perspective grid warping
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const heroRef = useRef<HTMLElement>(null);
  const [gridLines, setGridLines] = useState<
    Array<{ x: number; y: number; delay: number }>
  >([]);

  // Generate random scan lines on mount
  useEffect(() => {
    const lines = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setGridLines(lines);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
      return () => hero.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  // Transform cursor position to rotation values for perspective effect
  const rotateX = useTransform(mouseY, [0, 1], [2, -2]);
  const rotateY = useTransform(mouseX, [0, 1], [-2, 2]);

  return (
    <section
      ref={heroRef}
      id='hero'
      className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background/95'
    >
      {/* Perspective grid - warps subtly based on cursor position */}
      <motion.div
        className='absolute inset-0 opacity-20 pointer-events-none'
        style={{
          perspective: '1000px',
          rotateX,
          rotateY,
        }}
      >
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'translateZ(-100px) scale(1.2)',
          }}
        />
      </motion.div>

      {/* Animated scan lines - create holographic depth */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {gridLines.map((line, i) => (
          <motion.div
            key={i}
            className='absolute h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent'
            style={{
              left: 0,
              right: 0,
              top: `${line.y}%`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: line.delay,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Chromatic aberration glow on edges - adds premium tech feel */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent' />
        <div className='absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent' />
        <div className='absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent' />
      </div>

      {/* Floating particles - minimal, depth-creating */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 bg-cyan-400/30 rounded-full'
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className='section-container text-center relative z-10'>
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight'
        >
          <span className='text-foreground'>I'm </span>
          <span className='gradient-text animate-focus-in-expand tracking-tight'>
            Harshit Raj
          </span>
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className='text-xl md:text-2xl text-muted-foreground mb-4 font-light'
        >
          Frontend Developer & UI/UX Designer
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='text-lg text-muted-foreground/80 max-w-xl mx-auto mb-10'
        >
          Crafting immersive digital experiences with pixel-perfect precision
          and thoughtful interaction design.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className='flex flex-wrap items-center justify-center gap-4 mb-12'
        >
          <a href='#projects' className='glow-button'>
            <span>View Projects</span>
          </a>
          <a
            href='/Harshit_Raj_Resume.pdf'
            target='_blank'
            rel='noopener noreferrer'
            className='outline-glow-button'
          >
            Download Resume
          </a>
          <a href='#contact' className='outline-glow-button'>
            Contact Me
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className='flex items-center justify-center gap-6'
        >
          {[
            {
              icon: Github,
              href: 'https://github.com/Harshit0209-gif',
              label: 'GitHub',
            },
            {
              icon: Linkedin,
              href: 'https://www.linkedin.com/in/harshit-raj-963b99318/',
              label: 'LinkedIn',
            },
            { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target='_blank'
              rel='noopener noreferrer'
              className='p-3 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group'
              aria-label={social.label}
            >
              <social.icon className='w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors' />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href='#about'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
      >
        <span className='text-xs uppercase tracking-widest'>Scroll</span>
        <ArrowDown className='w-4 h-4 animate-bounce' />
      </motion.a>
    </section>
  );
}
