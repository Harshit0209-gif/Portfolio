import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Code2, 
  Smartphone, 
  FileCode, 
  Paintbrush, 
  Github, 
  GitBranch, 
  Zap, 
  Layout, 
  Palette,
  Server,
  Monitor,
  Layers,
  Figma,
  Globe,
  Box,
  Sparkles
} from 'lucide-react';

const skills = [
  { name: 'React', category: 'frontend', icon: Code2, color: 'from-cyan-400 to-blue-500' },
  { name: 'Next.js', category: 'frontend', icon: Globe, color: 'from-gray-400 to-gray-600' },
  { name: 'React Native', category: 'frontend', icon: Smartphone, color: 'from-blue-400 to-purple-500' },
  { name: 'JavaScript', category: 'frontend', icon: FileCode, color: 'from-yellow-400 to-orange-500' },
  { name: 'TypeScript', category: 'frontend', icon: FileCode, color: 'from-blue-500 to-blue-700' },
  { name: 'HTML5', category: 'frontend', icon: Layout, color: 'from-orange-500 to-red-500' },
  { name: 'CSS3', category: 'frontend', icon: Paintbrush, color: 'from-blue-400 to-indigo-500' },
  { name: 'Vite', category: 'tools', icon: Zap, color: 'from-purple-400 to-yellow-400' },
  { name: 'Bootstrap', category: 'frontend', icon: Box, color: 'from-purple-500 to-purple-700' },
  { name: 'Tailwind CSS', category: 'frontend', icon: Layers, color: 'from-cyan-400 to-teal-500' },
  { name: 'Figma', category: 'design', icon: Figma, color: 'from-pink-500 to-purple-500' },
  { name: 'UI/UX Design', category: 'design', icon: Palette, color: 'from-rose-400 to-pink-500' },
  { name: 'GitHub', category: 'tools', icon: Github, color: 'from-gray-400 to-gray-600' },
  { name: 'Git', category: 'tools', icon: GitBranch, color: 'from-orange-400 to-red-500' },
  { name: 'REST APIs', category: 'backend', icon: Server, color: 'from-green-400 to-emerald-500' },
  { name: 'Responsive Design', category: 'design', icon: Monitor, color: 'from-violet-400 to-purple-500' },
];

const categories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'frontend', label: 'Frontend', icon: Code2 },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'tools', label: 'Tools', icon: GitBranch },
  { id: 'backend', label: 'Backend', icon: Server },
];

// Enhanced 3D Tilt Card Component with glow effect
function SkillCard({ 
  skill, 
  index, 
  isInView 
}: { 
  skill: typeof skills[0]; 
  index: number; 
  isInView: boolean;
}) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0) rotateY(0)');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = skill.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 8;
    const rotateY = (centerX - x) / 8;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.05,
        type: "spring",
        stiffness: 100
      }}
      layout
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transform, 
          transition: 'transform 0.2s ease-out',
        }}
        className="relative group cursor-pointer"
      >
        {/* Outer glow */}
        <div 
          className={`absolute -inset-0.5 bg-gradient-to-r ${skill.color} rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-all duration-500`}
        />
        
        {/* Card */}
        <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 overflow-hidden">
          {/* Dynamic glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`
            }}
          />
          
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${skill.color} opacity-20`} />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Icon container with floating animation */}
            <motion.div 
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${skill.color} p-0.5 shadow-lg`}
              animate={isHovered ? { 
                y: [-2, 2, -2],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-full h-full bg-background/90 rounded-[10px] flex items-center justify-center">
                <Icon className="w-7 h-7 text-foreground" />
              </div>
            </motion.div>
            
            {/* Skill name */}
            <span className="font-medium text-foreground text-center leading-tight">
              {skill.name}
            </span>
            
            {/* Decorative dots */}
            <div className="flex gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${skill.color}`}
                  initial={{ scale: 0.5, opacity: 0.3 }}
                  animate={isHovered ? { 
                    scale: 1, 
                    opacity: 1,
                  } : { scale: 0.5, opacity: 0.3 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
          
          {/* Corner accents */}
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${skill.color} opacity-5 rounded-bl-full`} />
          <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${skill.color} opacity-5 rounded-tr-full`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = skills.filter(
    (skill) => activeCategory === 'all' || skill.category === activeCategory
  );

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div ref={ref} className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">My Arsenal</span>
          </motion.div>
          
          <h2 className="section-title gradient-text mb-4">Skills & Tech Stack</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Technologies and tools I use to bring ideas to life with precision and creativity
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${
                  activeCategory === category.id
                    ? 'text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border/50'
                }`}
              >
                {/* Active background */}
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-violet-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className={`relative z-10 w-4 h-4 transition-transform duration-300 ${
                  activeCategory === category.id ? '' : 'group-hover:scale-110'
                }`} />
                <span className="relative z-10">{category.label}</span>
                
                {/* Skill count badge */}
                <span className={`relative z-10 ml-1 px-1.5 py-0.5 text-xs rounded-full transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-white/20' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {category.id === 'all' 
                    ? skills.length 
                    : skills.filter(s => s.category === category.id).length
                  }
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <SkillCard 
                key={skill.name} 
                skill={skill} 
                index={index} 
                isInView={isInView}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </div>
    </section>
  );
}
