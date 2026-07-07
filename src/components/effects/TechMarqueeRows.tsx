import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import type { Skill } from '@/data/skills';

interface TechMarqueeRowsProps {
  skills: Skill[];
  rowCount?: number;
  compact?: boolean;
  className?: string;
}

export default function TechMarqueeRows({
  skills,
  rowCount = 3,
  compact = false,
  className = '',
}: TechMarqueeRowsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  const rows = useMemo(() => {
    const result: Skill[][] = Array.from({ length: rowCount }, () => []);
    skills.forEach((skill, i) => result[i % rowCount].push(skill));
    return result;
  }, [skills, rowCount]);

  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          rowRefs.current.forEach((el, i) => {
            if (!el) return;
            const direction = i % 2 === 0 ? -1 : 1;
            const distance = (compact ? 50 : 120) + i * (compact ? 15 : 40);
            gsap.set(el, { x: (self.progress - 0.5) * distance * direction });
          });
        },
      });
      return () => trigger.kill();
    },
    { dependencies: [rows], scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className={`space-y-2 ${className}`}>
      {rows.map((row, i) => (
        <div key={i} className='overflow-hidden py-1'>
          <div
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className={`flex flex-wrap gap-2 will-change-transform ${
              compact ? 'justify-start' : 'justify-center'
            }`}
          >
            {row.map((skill) => (
              <span
                key={skill.name}
                className={`inline-flex items-center gap-1.5 rounded-lg bg-muted/40 border border-border/50 hover:border-primary/40 transition-colors font-medium text-foreground/90 ${
                  compact ? 'px-3 py-1.5 text-xs' : 'px-5 py-3 text-sm sm:text-base'
                }`}
              >
                <span
                  className={`rounded-md bg-gradient-to-br ${skill.color} p-0.5 flex-shrink-0 ${
                    compact ? 'w-4 h-4' : 'w-6 h-6'
                  }`}
                >
                  <span className='w-full h-full bg-background/90 rounded-[4px] flex items-center justify-center'>
                    <skill.icon className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
                  </span>
                </span>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
