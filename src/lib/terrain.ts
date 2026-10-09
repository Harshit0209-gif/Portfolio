/**
 * Procedural scenery geometry.
 *
 * The ridges, treelines and skylines behind the project worlds, the builder's city and
 * the studio window are generated, not drawn: a seeded midpoint-displacement ridge gives
 * a natural silhouette that is identical on every visit.
 * Everything here is pure and runs once at module load — no per-frame cost.
 */

export const VIEW_W = 1600;
export const VIEW_H = 900;

/** Small, fast, deterministic PRNG (mulberry32). */
export function createRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface RidgeOptions {
  seed: number;
  /** Average height of the ridge line, in viewBox units from the top. */
  baseY: number;
  /** Peak-to-valley size of the largest features. */
  amplitude: number;
  /** 0–1. Higher keeps more small-scale jaggedness. */
  roughness?: number;
  /** Subdivision depth: 2^detail segments across the width. */
  detail?: number;
  width?: number;
}

export interface Point {
  x: number;
  y: number;
}

/** Midpoint displacement: start with two ends, repeatedly split and nudge the midpoints. */
export function ridgePoints({ seed, baseY, amplitude, roughness = 0.55, detail = 7, width = VIEW_W }: RidgeOptions): Point[] {
  const rng = createRng(seed);
  const count = 2 ** detail;
  const heights = new Array<number>(count + 1).fill(0);
  heights[0] = (rng() - 0.5) * amplitude;
  heights[count] = (rng() - 0.5) * amplitude;

  let step = count;
  let scale = amplitude;
  while (step > 1) {
    const half = step / 2;
    for (let i = half; i < count; i += step) {
      heights[i] = (heights[i - half] + heights[i + half]) / 2 + (rng() - 0.5) * scale;
    }
    scale *= roughness;
    step = half;
  }

  return heights.map((h, i) => ({ x: (i / count) * width, y: baseY + h }));
}

/** Height of a ridge at an arbitrary x, by linear interpolation. Used to seat objects on it. */
export function ridgeYAt(points: Point[], x: number): number {
  if (x <= points[0].x) return points[0].y;
  for (let i = 1; i < points.length; i++) {
    if (x <= points[i].x) {
      const a = points[i - 1];
      const b = points[i];
      const t = (x - a.x) / (b.x - a.x);
      return a.y + (b.y - a.y) * t;
    }
  }
  return points[points.length - 1].y;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A filled silhouette: the ridge line closed down to the bottom of the view. */
export function ridgePath(points: Point[], bottom = VIEW_H + 40): string {
  const line = points.map((p) => `L${r1(p.x)} ${r1(p.y)}`).join('');
  return `M${r1(points[0].x)} ${bottom}${line}L${r1(points[points.length - 1].x)} ${bottom}Z`;
}

/** One stylised conifer — three tiers and a point — as a path fragment. */
function pine(x: number, y: number, h: number, w: number): string {
  const p = (dx: number, dy: number) => `${r1(x + dx * w)} ${r1(y - dy * h)}`;
  return (
    `M${p(0, 1)}L${p(0.2, 0.7)}L${p(0.11, 0.7)}L${p(0.34, 0.4)}L${p(0.2, 0.4)}L${p(0.5, 0)}` +
    `L${p(-0.5, 0)}L${p(-0.2, 0.4)}L${p(-0.34, 0.4)}L${p(-0.11, 0.7)}L${p(-0.2, 0.7)}Z`
  );
}

export interface ForestOptions {
  seed: number;
  /** Ridge the trees stand on. */
  ground: Point[];
  /** Average spacing between trunks. */
  spacing: number;
  minHeight: number;
  maxHeight: number;
  /** Leave these x-ranges clear (for a cabin, a trail, a clearing). */
  gaps?: [number, number][];
}

/** A whole treeline as a single path, so a forest costs one draw call. */
export function forestPath({ seed, ground, spacing, minHeight, maxHeight, gaps = [] }: ForestOptions): string {
  const rng = createRng(seed);
  const width = ground[ground.length - 1].x;
  let d = '';
  for (let x = -spacing; x < width + spacing; x += spacing * (0.55 + rng() * 0.9)) {
    const h = minHeight + rng() * (maxHeight - minHeight);
    if (gaps.some(([a, b]) => x > a && x < b)) continue;
    d += pine(x, ridgeYAt(ground, x) + h * 0.06, h, h * 0.46);
  }
  return d;
}

/** A skyline of flat-topped blocks for the city chapters, as a single path. */
export function skylinePath(seed: number, baseY: number, minH: number, maxH: number, width = VIEW_W): string {
  const rng = createRng(seed);
  let d = `M0 ${VIEW_H + 40}L0 ${baseY}`;
  let x = 0;
  while (x < width) {
    const w = 26 + rng() * 70;
    const h = minH + rng() ** 1.8 * (maxH - minH);
    d += `L${r1(x)} ${r1(baseY - h)}L${r1(x + w)} ${r1(baseY - h)}`;
    x += w;
  }
  return `${d}L${width} ${baseY}L${width} ${VIEW_H + 40}Z`;
}
