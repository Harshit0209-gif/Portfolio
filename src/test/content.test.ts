import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  allProjects,
  challenges,
  chapters,
  disciplines,
  experience,
  primaryNav,
  profile,
  projects,
  statusMeta,
  techById,
  techGroups,
  technologies,
  usageOf,
} from '@/content';

/**
 * The portfolio's promises, checked by machine: no fake links, no missing screenshots,
 * no technology without evidence, and no project treated differently from the rest.
 * These run in plain Node — they test the content, not the rendering.
 */

const publicDir = resolve(__dirname, '../../public');
const isHttps = (url: string) => /^https:\/\/[^\s]+$/.test(url);

describe('projects', () => {
  it('has unique slugs', () => {
    const slugs = allProjects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('lists published projects in chronological order', () => {
    const dates = projects.map((p) => p.startedAt);
    expect(dates).toEqual([...dates].sort());
    expect(projects.every((p) => p.published)).toBe(true);
    expect(dates.every((d) => /^\d{4}-\d{2}$/.test(d))).toBe(true);
  });

  it('gives every project the same complete set of information', () => {
    for (const p of projects) {
      expect(p.name, p.slug).toBeTruthy();
      expect(p.category, p.slug).toBeTruthy();
      expect(p.summary.length, p.slug).toBeGreaterThan(40);
      expect(p.context.length, p.slug).toBeGreaterThan(60);
      expect(p.role, p.slug).toBeTruthy();
      expect(p.stack.length, p.slug).toBeGreaterThan(0);
      expect(p.highlights.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.disciplines.length, p.slug).toBeGreaterThan(0);
      expect(statusMeta[p.status], p.slug).toBeDefined();
    }
  });

  it('never links to a placeholder or insecure URL', () => {
    for (const p of allProjects) {
      const urls = [...(p.live ? [p.live.href] : []), ...p.source.map((s) => s.href)];
      for (const url of urls) {
        expect(isHttps(url), `${p.slug}: ${url}`).toBe(true);
        expect(url, p.slug).not.toMatch(/example\.com|localhost|your[-_]/i);
      }
      for (const s of p.source) expect(s.href, p.slug).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it('explains itself wherever a link is missing', () => {
    for (const p of projects) {
      if (!p.live) expect(p.liveUnavailable, p.slug).toBeTruthy();
      if (p.source.length === 0) expect(p.sourceUnavailable, p.slug).toBeTruthy();
    }
  });

  it('only marks a project live when it has a live URL', () => {
    for (const p of projects) {
      if (p.status === 'live') expect(p.live, p.slug).not.toBeNull();
    }
  });

  it('references technologies and disciplines that exist', () => {
    const known = new Set(disciplines.map((d) => d.id));
    for (const p of allProjects) {
      for (const id of [...p.stack, ...(p.platform ?? [])]) expect(techById[id], `${p.slug}: ${id}`).toBeDefined();
      for (const d of p.disciplines) expect(known.has(d), `${p.slug}: ${d}`).toBe(true);
      // a technology is either something I used or part of the surrounding system — not both
      for (const id of p.platform ?? []) expect(p.stack, `${p.slug}: ${id}`).not.toContain(id);
    }
  });

  it('has every screenshot on disk in both sizes, with alt text and a caption', () => {
    for (const p of projects) {
      if (p.media.kind === 'screenshots') {
        expect(p.media.images.length, p.slug).toBeGreaterThan(0);
        for (const image of p.media.images) {
          for (const size of [800, 1440]) {
            const file = resolve(publicDir, `.${image.src}-${size}.webp`);
            expect(existsSync(file), `${p.slug}: ${file}`).toBe(true);
          }
          expect(image.alt.length, p.slug).toBeGreaterThan(30);
          expect(image.caption, p.slug).toBeTruthy();
          // the address bar text is a label, never something that could be mistaken for a working link
          expect(image.address, p.slug).not.toMatch(/^https?:/);
        }
      } else {
        expect(p.media.lines.length, p.slug).toBeGreaterThanOrEqual(5);
        expect(p.media.caption, p.slug).toBeTruthy();
      }
    }
  });
});

describe('technologies', () => {
  it('has unique ids in known groups', () => {
    const ids = technologies.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    const groups = new Set(techGroups.map((g) => g.id));
    for (const t of technologies) expect(groups.has(t.group), t.id).toBe(true);
  });

  it('backs every technology with evidence', () => {
    for (const t of technologies) {
      const usage = usageOf(t.id);
      const evidenced = usage.direct.length + usage.platform.length > 0 || t.usedHere === true || Boolean(t.everywhere);
      expect(evidenced, `${t.id} has no project and is not marked usedHere`).toBe(true);
      expect(t.note.length, t.id).toBeGreaterThan(20);
    }
  });

  it('makes no proficiency claims', () => {
    for (const t of technologies) {
      expect(Object.keys(t)).not.toContain('level');
      expect(t.note, t.id).not.toMatch(/\b(expert|master(y|ed)?|advanced|\d+\s*(\+\s*)?years?)\b/i);
    }
  });
});

describe('story', () => {
  it('numbers the eight chapters in sequence after the prologue', () => {
    expect(chapters[0]).toMatchObject({ id: 'prologue', number: null });
    expect(chapters.slice(1).map((c) => c.number)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
    for (const c of chapters.slice(1)) {
      expect(c.headline, c.id).toBeTruthy();
      expect(c.body, c.id).toBeTruthy();
    }
  });

  it('points navigation, challenges and experience at things that exist', () => {
    const ids = new Set<string>([...chapters.map((c) => c.id), 'contact']);
    for (const item of primaryNav) expect(ids.has(item.href.slice(1)), item.href).toBe(true);
    const slugs = new Set(projects.map((p) => p.slug));
    for (const c of challenges) expect(slugs.has(c.projectSlug), c.problem).toBe(true);
    for (const e of experience) if (e.projectSlug) expect(slugs.has(e.projectSlug), e.organisation).toBe(true);
  });
});

describe('profile', () => {
  it('has real contact details and a résumé that exists', () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
    for (const s of profile.socials) expect(isHttps(s.href), s.id).toBe(true);
    expect(existsSync(resolve(publicDir, `.${profile.resume.href}`))).toBe(true);
  });
});

describe('scene photographs', () => {
  it('has every crop on disk in both formats, plus its depth map', async () => {
    const { sceneImages } = await import('@/content/imagery');
    for (const [name, scene] of Object.entries(sceneImages)) {
      for (const crop of [scene.wide, scene.tall]) {
        expect(crop.widths, name).toEqual([...crop.widths].sort((a, b) => a - b));
        for (const width of crop.widths) {
          for (const ext of ['avif', 'webp']) {
            const file = resolve(publicDir, `.${crop.base}-${width}.${ext}`);
            expect(existsSync(file), `${name}: ${file}`).toBe(true);
          }
        }
        for (const value of crop.position) expect(value >= 0 && value <= 1, name).toBe(true);
      }
      expect(existsSync(resolve(publicDir, `.${scene.depth}`)), `${name}: depth map`).toBe(true);
      for (const value of scene.focus) expect(value >= 0 && value <= 1, name).toBe(true);
    }
  });
});
