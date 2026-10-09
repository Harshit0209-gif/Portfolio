import { projects, type Discipline, type Project } from './projects';
import { technologies, type Technology } from './technologies';

export * from './profile';
export * from './story';
export * from './projects';
export * from './technologies';

export interface TechUsage {
  /** Projects where I used the technology directly. */
  direct: Project[];
  /** Projects where it is part of the system around my work. */
  platform: Project[];
}

const usageCache = new Map<string, TechUsage>();

/** Evidence for a technology: which projects it appears in, derived from the manifest. */
export function usageOf(techId: string): TechUsage {
  const cached = usageCache.get(techId);
  if (cached) return cached;
  const usage: TechUsage = {
    direct: projects.filter((p) => p.stack.includes(techId)),
    platform: projects.filter((p) => !p.stack.includes(techId) && p.platform?.includes(techId)),
  };
  usageCache.set(techId, usage);
  return usage;
}

export function projectsInDiscipline(discipline: Discipline): Project[] {
  return projects.filter((p) => p.disciplines.includes(discipline));
}

/** Technologies ordered within their group as declared, with a usage count for sizing. */
export function technologiesWithUsage(): (Technology & { count: number })[] {
  return technologies.map((t) => {
    const u = usageOf(t.id);
    return { ...t, count: u.direct.length + u.platform.length };
  });
}
