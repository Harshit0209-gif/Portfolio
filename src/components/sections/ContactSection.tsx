import { useRef, useState } from 'react';
import { Send, Mail, Github, Linkedin, MapPin, CheckCircle } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useCanHover } from '@/hooks/use-can-hover';
import BentoCard from '@/components/BentoCard';
import MagneticButton from '@/components/effects/MagneticButton';
import SplitTextReveal from '@/components/effects/SplitTextReveal';
import { contactInfo } from '@/data/experience';

const FIELD_LABEL_CLASS =
  'absolute left-4 top-4 text-muted-foreground text-sm transition-all duration-200 pointer-events-none ' +
  'peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary ' +
  'peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs';

const FIELD_INPUT_CLASS = 'peer portfolio-input pt-6 pb-2';

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const successIconRef = useRef<HTMLSpanElement>(null);
  const canHover = useCanHover();

  const quickRotateX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickRotateY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap
            .timeline()
            .from(infoRef.current, { opacity: 0, x: -40, duration: 0.8 })
            .from(formRef.current, { opacity: 0, x: 40, duration: 0.8 }, '-=0.6');
        },
      });
      return () => trigger.kill();
    },
    { scope: sectionRef }
  );

  // Subtle mouse-reactive tilt on the form card.
  useGSAP(
    () => {
      if (!cardRef.current || !canHover) return;
      gsap.set(cardRef.current, { transformPerspective: 1200 });
      quickRotateX.current = gsap.quickTo(cardRef.current, 'rotationX', { duration: 0.5, ease: 'power3' });
      quickRotateY.current = gsap.quickTo(cardRef.current, 'rotationY', { duration: 0.5, ease: 'power3' });
    },
    { dependencies: [canHover] }
  );

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !quickRotateX.current || !quickRotateY.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    quickRotateX.current((e.clientY - rect.top - rect.height / 2) / 25);
    quickRotateY.current((rect.width / 2 - (e.clientX - rect.left)) / 25);
  };

  const handleCardMouseLeave = () => {
    quickRotateX.current?.(0);
    quickRotateY.current?.(0);
  };

  // Success checkmark pop.
  useGSAP(
    () => {
      if (!isSubmitted || !successIconRef.current) return;
      gsap.fromTo(
        successIconRef.current,
        { scale: 0, rotate: -45 },
        { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.5)' }
      );
    },
    { dependencies: [isSubmitted] }
  );

  return (
    <section
      ref={sectionRef}
      id='contact'
      className='py-20 md:py-28 px-4 sm:px-6 max-w-6xl mx-auto'
    >
      <div className='text-center mb-12'>
        <SplitTextReveal as='h2' text="Let's Connect" className='section-title gradient-text mb-4' />
        <p className='section-subtitle mx-auto'>
          Have a project in mind? Let's discuss how we can work together.
        </p>
      </div>

      <div className='grid lg:grid-cols-2 gap-12'>
        <div ref={infoRef} className='space-y-8'>
          <div>
            <h3 className='text-2xl font-semibold mb-4'>Get in Touch</h3>
            <p className='text-muted-foreground'>
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>
          </div>

          <div className='space-y-4'>
            <a
              href={`mailto:${contactInfo.email}`}
              className='flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group'
              data-cursor='link'
            >
              <div className='p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <Mail className='w-5 h-5 text-primary' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>Email</div>
                <div className='font-medium'>{contactInfo.email}</div>
              </div>
            </a>

            <a
              href={contactInfo.github}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group'
              data-cursor='link'
            >
              <div className='p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <Github className='w-5 h-5 text-primary' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>GitHub</div>
                <div className='font-medium'>{contactInfo.githubHandle}</div>
              </div>
            </a>

            <a
              href={contactInfo.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group'
              data-cursor='link'
            >
              <div className='p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <Linkedin className='w-5 h-5 text-primary' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>LinkedIn</div>
                <div className='font-medium'>{contactInfo.linkedinName}</div>
              </div>
            </a>

            <div className='flex items-center gap-4 p-4 rounded-lg bg-muted/30'>
              <div className='p-3 rounded-lg bg-primary/10'>
                <MapPin className='w-5 h-5 text-primary' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>Location</div>
                <div className='font-medium'>{contactInfo.location}</div>
              </div>
            </div>
          </div>
        </div>

        <div ref={formRef}>
          <BentoCard
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className='flex-col p-8 space-y-6'
          >
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='relative'>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder=' '
                  className={FIELD_INPUT_CLASS}
                />
                <label htmlFor='name' className={FIELD_LABEL_CLASS}>
                  Name
                </label>
              </div>

              <div className='relative'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder=' '
                  className={FIELD_INPUT_CLASS}
                />
                <label htmlFor='email' className={FIELD_LABEL_CLASS}>
                  Email
                </label>
              </div>

              <div className='relative'>
                <textarea
                  id='message'
                  name='message'
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder=' '
                  className={`${FIELD_INPUT_CLASS} resize-none`}
                />
                <label htmlFor='message' className={FIELD_LABEL_CLASS}>
                  Message
                </label>
              </div>

              <MagneticButton disabled={isSubmitting || isSubmitted} className='w-full'>
                <button
                  type='submit'
                  disabled={isSubmitting || isSubmitted}
                  className='glow-button w-full disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? (
                    <span className='inline-flex items-center gap-2'>
                      <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                          fill='none'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : isSubmitted ? (
                    <span className='inline-flex items-center gap-2'>
                      <span ref={successIconRef} className='inline-flex'>
                        <CheckCircle className='w-4 h-4' />
                      </span>
                      Message Sent!
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-2'>
                      <Send className='w-4 h-4' />
                      Send Message
                    </span>
                  )}
                </button>
              </MagneticButton>
            </form>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
