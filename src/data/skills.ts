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
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface Skill {
  name: string;
  category: 'frontend' | 'design' | 'tools' | 'backend';
  icon: LucideIcon;
  color: string;
}

export const skills: Skill[] = [
  { name: 'React', category: 'frontend', icon: Code2, color: 'from-amber-400 to-orange-500' },
  { name: 'Next.js', category: 'frontend', icon: Globe, color: 'from-gray-400 to-gray-600' },
  { name: 'React Native', category: 'frontend', icon: Smartphone, color: 'from-orange-400 to-rose-500' },
  { name: 'JavaScript', category: 'frontend', icon: FileCode, color: 'from-yellow-400 to-amber-500' },
  { name: 'TypeScript', category: 'frontend', icon: FileCode, color: 'from-amber-500 to-orange-700' },
  { name: 'HTML5', category: 'frontend', icon: Layout, color: 'from-orange-500 to-red-500' },
  { name: 'CSS3', category: 'frontend', icon: Paintbrush, color: 'from-amber-400 to-rose-500' },
  { name: 'Vite', category: 'tools', icon: Zap, color: 'from-purple-400 to-yellow-400' },
  { name: 'Bootstrap', category: 'frontend', icon: Box, color: 'from-rose-500 to-rose-700' },
  { name: 'Tailwind CSS', category: 'frontend', icon: Layers, color: 'from-amber-400 to-teal-500' },
  { name: 'Figma', category: 'design', icon: Figma, color: 'from-rose-500 to-orange-500' },
  { name: 'UI/UX Design', category: 'design', icon: Palette, color: 'from-rose-400 to-amber-500' },
  { name: 'GitHub', category: 'tools', icon: Github, color: 'from-gray-400 to-gray-600' },
  { name: 'Git', category: 'tools', icon: GitBranch, color: 'from-orange-400 to-red-500' },
  { name: 'REST APIs', category: 'backend', icon: Server, color: 'from-green-400 to-emerald-500' },
  { name: 'Responsive Design', category: 'design', icon: Monitor, color: 'from-amber-400 to-rose-500' },
];

export const skillCategories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'frontend', label: 'Frontend', icon: Code2 },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'tools', label: 'Tools', icon: GitBranch },
  { id: 'backend', label: 'Backend', icon: Server },
] as const;
