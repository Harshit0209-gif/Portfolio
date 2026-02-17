import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Palette, Zap, Brain } from 'lucide-react';

const focusAreas = [
  {
    icon: Code2,
    title: 'Frontend Excellence',
    description: 'Building performant, accessible interfaces with modern frameworks.',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Creating intuitive experiences that delight and engage users.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimizing for speed, ensuring lightning-fast load times.',
  },
  {
    icon: Brain,
    title: 'Design Thinking',
    description: 'Solving complex problems with user-centered approaches.',
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative">
      <div ref={ref} className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-6">About Me</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            I'm a passionate frontend developer and designer with a keen eye for detail
            and a love for creating seamless digital experiences. With expertise in
            modern web technologies and a deep understanding of user behavior, I bridge
            the gap between beautiful design and functional code.
          </p>
        </motion.div>

        {/* Focus areas grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-card p-6 text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <area.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{area.title}</h3>
              <p className="text-sm text-muted-foreground">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
