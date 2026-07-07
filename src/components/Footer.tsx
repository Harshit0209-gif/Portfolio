import { Github, Linkedin, Mail } from 'lucide-react';
import MagneticButton from '@/components/effects/MagneticButton';
import { contactInfo } from '@/data/experience';

const socialLinks = [
  { icon: Github, href: contactInfo.github, label: 'GitHub' },
  { icon: Linkedin, href: contactInfo.linkedin, label: 'LinkedIn' },
  { icon: Mail, href: `mailto:${contactInfo.email}`, label: 'Email' },
];

export default function Footer() {
  return (
    <footer className='relative border-t border-border'>
      {/* Animated glow line */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent' />

      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          {/* Logo & tagline */}
          <div className='text-center md:text-left'>
            <a
              href='#hero'
              className='font-display text-xl font-bold gradient-text'
            >
              Portfolio
            </a>
            <p className='text-sm text-muted-foreground mt-1'>
              Crafting digital experiences
            </p>
          </div>

          {/* Social links */}
          <div className='flex items-center gap-4'>
            {socialLinks.map((social) => (
              <MagneticButton key={social.label}>
                <a
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group'
                  aria-label={social.label}
                  data-cursor='social'
                >
                  <social.icon className='w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors' />
                </a>
              </MagneticButton>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
