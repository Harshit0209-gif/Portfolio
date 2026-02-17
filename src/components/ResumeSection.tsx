import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react';

const experience = [
  {
    title: 'Freelance Front-End Developer',
    company: 'AB Institute',
    period: 'November 2025 – January 2026',
    description:
      'Built a comprehensive client dashboard with seamless integration of Razorpay for payments and Google Meet for live sessions, ensuring a smooth and scalable user experience.',
  },
  {
    title: 'Freelance Front-End Developer',
    company: 'Golicit Services',
    period: 'September 2025 – October 2025',
    description:
      'Developed a modern, responsive website for a Kolkata-based tech startup, highlighting their services, brand identity, and digital presence.',
  },
  {
    title: 'Freelance Front-End Developer',
    company: 'EMA',
    period: 'February 2025 – May 2025',
    description:
      'Architected a responsive and scalable user interface (UI) for a major platform active in 45+ countries.',
  },
];

export default function ResumeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id='resume' className='relative'>
      <div ref={ref} className='section-container'>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-12'
        >
          <h2 className='section-title gradient-text mb-4'>Resume</h2>
          <p className='section-subtitle mx-auto'>
            My professional journey and qualifications
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-12 items-start'>
          {/* Experience Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className='flex items-center gap-3 mb-6'>
              <Briefcase className='w-5 h-5 text-primary' />
              <h3 className='text-xl font-semibold'>Experience</h3>
            </div>

            <div className='space-y-6'>
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className='relative pl-6 border-l-2 border-border hover:border-primary/50 transition-colors'
                >
                  <div className='absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-primary/50' />
                  <span className='text-xs text-primary font-medium'>
                    {exp.period}
                  </span>
                  <h4 className='text-lg font-semibold mt-1'>{exp.title}</h4>
                  <p className='text-muted-foreground text-sm'>{exp.company}</p>
                  <p className='text-muted-foreground text-sm mt-2'>
                    {exp.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resume Download Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='glass-card p-8 text-center'
          >
            <div className='w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center'>
              <FileText className='w-10 h-10 text-primary' />
            </div>

            <h3 className='text-2xl font-semibold mb-2'>Download My Resume</h3>
            <p className='text-muted-foreground mb-6'>
              Get a comprehensive overview of my skills, experience, and
              qualifications.
            </p>

            <a
              href='/Harshit_Raj_Resume.pdf'
              target='_blank'
              rel='noopener noreferrer'
              className='glow-button inline-flex items-center gap-2'
            >
              <Download className='w-4 h-4' />
              <span>Download PDF</span>
            </a>

            {/* Quick stats */}
            <div className='grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border'>
              <div>
                <div className='text-2xl font-bold gradient-text'>1+</div>
                <div className='text-xs text-muted-foreground'>Years Exp.</div>
              </div>
              <div>
                <div className='text-2xl font-bold gradient-text'>7+</div>
                <div className='text-xs text-muted-foreground'>Projects</div>
              </div>
              <div>
                <div className='text-2xl font-bold gradient-text'>6+</div>
                <div className='text-xs text-muted-foreground'>Clients</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
