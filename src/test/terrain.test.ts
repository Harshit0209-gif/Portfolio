import { describe, expect, it } from 'vitest';
import { createRng, forestPath, ridgePath, ridgePoints, ridgeYAt, skylinePath } from '@/lib/terrain';

describe('terrain generator', () => {
  it('is deterministic: the same seed always draws the same mountains', () => {
    const a = ridgePoints({ seed: 11, baseY: 452, amplitude: 360 });
    const b = ridgePoints({ seed: 11, baseY: 452, amplitude: 360 });
    expect(a).toEqual(b);
    expect(ridgePath(a)).toBe(ridgePath(b));
  });

  it('draws different mountains for different seeds', () => {
    expect(ridgePoints({ seed: 1, baseY: 500, amplitude: 200 })).not.toEqual(ridgePoints({ seed: 2, baseY: 500, amplitude: 200 }));
  });

  it('spans the full width and stays near its base line', () => {
    const points = ridgePoints({ seed: 23, baseY: 600, amplitude: 150, detail: 7, width: 1600 });
    expect(points).toHaveLength(2 ** 7 + 1);
    expect(points[0].x).toBe(0);
    expect(points.at(-1)!.x).toBe(1600);
    for (const p of points) {
      expect(Number.isFinite(p.y)).toBe(true);
      expect(Math.abs(p.y - 600)).toBeLessThan(150 * 1.5);
    }
  });

  it('interpolates ridge height, including beyond both ends', () => {
    const points = [
      { x: 0, y: 100 },
      { x: 10, y: 200 },
    ];
    expect(ridgeYAt(points, 5)).toBe(150);
    expect(ridgeYAt(points, -4)).toBe(100);
    expect(ridgeYAt(points, 99)).toBe(200);
  });

  it('leaves clearings in a forest where asked', () => {
    const ground = ridgePoints({ seed: 37, baseY: 735, amplitude: 110 });
    const open = forestPath({ seed: 9, ground, spacing: 22, minHeight: 34, maxHeight: 78 });
    const cleared = forestPath({ seed: 9, ground, spacing: 22, minHeight: 34, maxHeight: 78, gaps: [[0, 1600]] });
    expect(open.length).toBeGreaterThan(1000);
    // everything on screen is cleared; only the off-screen overscan trees remain
    expect(cleared.length).toBeLessThan(open.length / 10);
  });

  it('produces valid SVG path data', () => {
    const path = ridgePath(ridgePoints({ seed: 5, baseY: 400, amplitude: 100 }));
    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(path).not.toMatch(/NaN|undefined|Infinity/);
  });

  it('keeps the random source in [0, 1)', () => {
    const rng = createRng(42);
    for (let i = 0; i < 200; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('draws a deterministic skyline that stays between its bounds', () => {
    const path = skylinePath(8, 690, 40, 230);
    expect(path).toBe(skylinePath(8, 690, 40, 230));
    expect(path).not.toMatch(/NaN|undefined|Infinity/);
    // every rooftop sits between the tallest and shortest allowed building
    const tops = [...path.matchAll(/L[\d.]+ ([\d.]+)/g)].map((m) => Number(m[1])).filter((y) => y < 690);
    expect(tops.length).toBeGreaterThan(10);
    for (const y of tops) {
      expect(y).toBeGreaterThanOrEqual(690 - 230);
      expect(y).toBeLessThanOrEqual(690 - 40);
    }
  });
});
