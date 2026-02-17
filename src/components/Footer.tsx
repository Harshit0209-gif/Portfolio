import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: 'https://github.com/Harshit0209-gif', label: 'GitHub' },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/harshit-raj-963b99318/',
    label: 'LinkedIn',
  },
  { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
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
              href='#'
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
              <a
                key={social.label}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group'
                aria-label={social.label}
              >
                <social.icon className='w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors' />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
