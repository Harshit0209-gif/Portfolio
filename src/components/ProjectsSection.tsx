import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'AB Institute',
    description:
      'Designed and developed a high-converting landing page for a trading institute, focusing on clear messaging, user engagement, and lead generation.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'TypeScript'],
    github:
      'https://github.com/resourcesgolicit-art/market_research_and_analysis',
    live: 'https://example.com',
    image: '/ab.png',
  },
  {
    id: 2,
    title: 'ABInstitute-Dashboard',
    description:
      'Built a comprehensive client dashboard with seamless integration of Razorpay for payments and Google Meet for live sessions, ensuring a smooth and scalable user experience.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'MongoDB'],
    github: 'https://github.com/resourcesgolicit-art/ABDashboard',
    live: 'https://example.com',
    image: '/ABDDash.png',
  },
  {
    id: 3,
    title: 'Theracure-Dashboard',
    description:
      'Contributed to UI development including prescription management interfaces, role-based authentication, and other core dashboard components to improve usability and workflow.',
    tech: ['Next', 'Chart.js', 'Tailwind CSS', 'MongoDB'],
    github: 'https://github.com/golicit/Theracure-Dashboard',
    live: 'https://example.com',
    image: '/theracure.png',
  },
  {
    id: 4,
    title: 'Golicit Services Pvt Ltd',
    description:
      'Developed a modern, responsive website for a Kolkata-based tech startup, highlighting their services, brand identity, and digital presence.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'JavaScript'],
    github: 'https://github.com/Harshit0209-gif/Websitev2',
    live: 'https://example.com',
    image: '/golicit.png',
  },
];

// 3D Project Card
function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: (typeof projects)[0];
  index: number;
  isInView: boolean;
}) {
  const [transform, setTransform] = useState(
    'perspective(1000px) rotateX(0) rotateY(0)'
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
    );
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) translateZ(0)');
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.2s ease-out' }}
      className='glass-card overflow-hidden group'
    >
      {/* Project image/gradient preview */}
      <div
        className='h-48 relative overflow-hidden bg-cover bg-center'
        style={{ backgroundImage: `url(${project.image})` }}
      >
        <div className='absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors duration-300' />

        {/* Hover overlay with links */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-4 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <a
            href={project.github}
            target='_blank'
            rel='noopener noreferrer'
            className='p-3 rounded-full bg-foreground/10 hover:bg-primary/20 border border-border hover:border-primary/50 transition-all'
          >
            <Github className='w-5 h-5' />
          </a>
          {/* <a
            href={project.live}
            target='_blank'
            rel='noopener noreferrer'
            className='p-3 rounded-full bg-foreground/10 hover:bg-primary/20 border border-border hover:border-primary/50 transition-all'
          >
            <ExternalLink className='w-5 h-5' />
          </a> */}
        </div>
      </div>

      {/* Project info */}
      <div className='p-6'>
        <h3 className='text-xl font-semibold mb-2 group-hover:text-primary transition-colors'>
          {project.title}
        </h3>
        <p className='text-muted-foreground text-sm mb-4 line-clamp-2'>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {project.tech.map((tech) => (
            <span
              key={tech}
              className='px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground'
            >
              {tech}
            </span>
          ))}
        </div>

        {/* View project link */}
        <a
          href={project.github}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all'
        >
          View Project <ArrowRight className='w-4 h-4' />
        </a>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id='projects' className='relative'>
      <div ref={ref} className='section-container'>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-12'
        >
          <h2 className='section-title gradient-text mb-4'>
            Freelance Projects
          </h2>
          <p className='section-subtitle mx-auto'>
            Selected works showcasing my expertise in frontend development and
            design
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* View all projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='text-center mt-12'
        >
          <a
            href='https://github.com/Harshit0209-gif'
            target='_blank'
            rel='noopener noreferrer'
            className='outline-glow-button inline-flex items-center gap-2'
          >
            <Github className='w-4 h-4' />
            View All on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
