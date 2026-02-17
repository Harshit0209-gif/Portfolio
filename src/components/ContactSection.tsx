import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Send,
  Mail,
  Github,
  Linkedin,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: '', email: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id='contact' className='relative'>
      <div ref={ref} className='section-container'>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-12'
        >
          <h2 className='section-title gradient-text mb-4'>Let's Connect</h2>
          <p className='section-subtitle mx-auto'>
            Have a project in mind? Let's discuss how we can work together.
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto'>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='space-y-8'
          >
            <div>
              <h3 className='text-2xl font-semibold mb-4'>Get in Touch</h3>
              <p className='text-muted-foreground'>
                I'm always open to discussing new projects, creative ideas, or
                opportunities to be part of your vision.
              </p>
            </div>

            <div className='space-y-4'>
              <a
                href='mailto:harshitrajsingh142@gmail.com'
                className='flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group'
              >
                <div className='p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                  <Mail className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <div className='text-sm text-muted-foreground'>Email</div>
                  <div className='font-medium'>
                    harshitrajsingh142@gmail.com
                  </div>
                </div>
              </a>

              <a
                href='https://github.com/Harshit0209-gif'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group'
              >
                <div className='p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                  <Github className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <div className='text-sm text-muted-foreground'>GitHub</div>
                  <div className='font-medium'>Harshit0209-gif</div>
                </div>
              </a>

              <a
                href='https://www.linkedin.com/in/harshit-raj-963b99318/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group'
              >
                <div className='p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                  <Linkedin className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <div className='text-sm text-muted-foreground'>LinkedIn</div>
                  <div className='font-medium'>Harshit Raj</div>
                </div>
              </a>

              <div className='flex items-center gap-4 p-4 rounded-lg bg-muted/30'>
                <div className='p-3 rounded-lg bg-primary/10'>
                  <MapPin className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <div className='text-sm text-muted-foreground'>Location</div>
                  <div className='font-medium'>Patna,Bihar</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className='glass-card p-8 space-y-6'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium mb-2'
                >
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className='portfolio-input'
                  placeholder='Your name'
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium mb-2'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className='portfolio-input'
                  placeholder='your@email.com'
                />
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium mb-2'
                >
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className='portfolio-input resize-none'
                  placeholder='Tell me about your project...'
                />
              </div>

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
                    <CheckCircle className='w-4 h-4' />
                    Message Sent!
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-2'>
                    <Send className='w-4 h-4' />
                    Send Message
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
