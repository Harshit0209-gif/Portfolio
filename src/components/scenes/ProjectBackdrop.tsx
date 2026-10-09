import { memo, type ReactNode } from 'react';
import { VIEW_H, VIEW_W, createRng, forestPath, ridgePath, ridgePoints, skylinePath } from '@/lib/terrain';
import type { Environment } from '@/content';
import { Figure } from '@/components/scenes/Foreground';

/**
 * A procedural environment for each project world.
 *
 * Every scene is built from the same three ingredients — a sky, two or three depth
 * layers of silhouette, and one source of light — so all fourteen get the same amount
 * of craft and the same technical weight. What differs is the subject: the place the
 * product belongs to. Scenes are static SVG generated from fixed seeds; the only motion
 * is depth parallax applied by the parent.
 */

interface Scene {
  sky: string;
  layers: { depth: number; art: ReactNode; align?: string }[];
}

const AMBER = '#F0A35E';
const GOLD = '#D8B878';
const ICE = '#A9CBE0';
const INK = '#05080F';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function Glow({ id, color = AMBER, strength = 0.6 }: { id: string; color?: string; strength?: number }) {
  return (
    <radialGradient id={id}>
      <stop offset='0' stopColor={color} stopOpacity={strength} />
      <stop offset='0.45' stopColor={color} stopOpacity={strength * 0.28} />
      <stop offset='1' stopColor={color} stopOpacity='0' />
    </radialGradient>
  );
}

/* ── street: a night food street (Foodfetch) ─────────────────────────────── */
const street: Scene = (() => {
  const rng = createRng(101);
  const strings = [
    { y: 250, sag: 70 },
    { y: 330, sag: 90 },
  ];
  const bulbs = strings.flatMap((s, si) =>
    range(17).map((i) => {
      const t = i / 16;
      return { x: t * VIEW_W, y: s.y + s.sag * 4 * t * (1 - t), k: `${si}-${i}` };
    })
  );
  const stalls = [250, 640, 1010, 1370].map((x) => ({ x, w: 190 + rng() * 60, h: 150 + rng() * 40 }));
  return {
    sky: 'linear-gradient(180deg,#090B13 0%,#141420 55%,#2B1F1D 100%)',
    layers: [
      { depth: 0.25, art: <path d={skylinePath(4, 640, 40, 200)} fill='#11131E' /> },
      {
        depth: 0.5,
        art: (
          <>
            <defs>
              <Glow id='st-bulb' strength={0.7} />
            </defs>
            {strings.map((s) => (
              <path key={s.y} d={`M0 ${s.y}Q${VIEW_W / 2} ${s.y + s.sag * 2} ${VIEW_W} ${s.y}`} fill='none' stroke='#2B2730' strokeWidth='2' />
            ))}
            {bulbs.map((b) => (
              <g key={b.k}>
                <circle cx={b.x} cy={b.y + 8} r='30' fill='url(#st-bulb)' />
                <circle cx={b.x} cy={b.y + 8} r='4' fill='#FFDCAA' />
              </g>
            ))}
            {stalls.map((s) => (
              <g key={s.x}>
                <rect x={s.x - s.w / 2} y={700 - s.h} width={s.w} height={s.h} fill='#0B0D15' />
                <rect x={s.x - s.w / 2 + 16} y={700 - s.h + 52} width={s.w - 32} height={s.h - 86} fill={AMBER} opacity='0.26' />
                <path d={`M${s.x - s.w / 2 - 14} ${700 - s.h + 40}L${s.x - s.w / 2 + 6} ${700 - s.h}H${s.x + s.w / 2 - 6}L${s.x + s.w / 2 + 14} ${700 - s.h + 40}Z`} fill='#191621' />
              </g>
            ))}
          </>
        ),
      },
      {
        depth: 0.85,
        art: (
          <>
            <rect y='700' width={VIEW_W} height='240' fill={INK} />
            {[420, 480, 900, 1180].map((x, i) => (
              <path
                key={x}
                d={`M${x} 690q-26 -40 0 -80t0 -80`}
                fill='none'
                stroke='#ECE6DA'
                strokeOpacity={0.06 + (i % 2) * 0.04}
                strokeWidth='4'
                strokeLinecap='round'
              />
            ))}
          </>
        ),
      },
    ],
  };
})();

/* ── park: an evening walk (Pet Care) ────────────────────────────────────── */
const park: Scene = (() => {
  const far = ridgePoints({ seed: 201, baseY: 560, amplitude: 120, roughness: 0.4, detail: 4 });
  const near = ridgePoints({ seed: 207, baseY: 720, amplitude: 70, roughness: 0.4, detail: 4 });
  const prints = range(9).map((i) => {
    const t = i / 8;
    return { x: 520 + t * 520 + (i % 2 ? 26 : -26) * (1 - t * 0.6), y: 870 - t * 190, s: 1.5 - t * 0.95 };
  });
  return {
    sky: 'linear-gradient(180deg,#071018 0%,#11222B 52%,#2B3A38 80%,#7A7256 100%)',
    layers: [
      { depth: 0.2, art: <path d={ridgePath(far)} fill='#12252C' /> },
      {
        depth: 0.5,
        art: (
          <g fill='#0B1A20'>
            <path d={ridgePath(near)} />
            <rect x='1140' y='520' width='16' height='190' />
            <circle cx='1148' cy='470' r='96' />
            <circle cx='1080' cy='520' r='62' />
            <circle cx='1220' cy='526' r='68' />
          </g>
        ),
      },
      {
        depth: 0.85,
        art: (
          <>
            <path d={`M0 ${VIEW_H + 40}V800Q500 740 900 780T${VIEW_W} 760V${VIEW_H + 40}Z`} fill={INK} />
            <g fill={GOLD} opacity='0.55'>
              {prints.map((p, i) => (
                <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s}) rotate(${i % 2 ? 14 : -14})`}>
                  <ellipse cx='0' cy='4' rx='9' ry='7.5' />
                  <ellipse cx='-11' cy='-6' rx='3.6' ry='4.6' />
                  <ellipse cx='-4' cy='-12' rx='3.6' ry='4.8' />
                  <ellipse cx='4' cy='-12' rx='3.6' ry='4.8' />
                  <ellipse cx='11' cy='-6' rx='3.6' ry='4.6' />
                </g>
              ))}
            </g>
          </>
        ),
      },
    ],
  };
})();

/* ── facade: an office front at night (Golicit) ──────────────────────────── */
const facade: Scene = (() => {
  const rng = createRng(301);
  const cols = 16;
  const rows = 8;
  const w = VIEW_W / cols;
  const h = 96;
  const panes = range(cols * rows).map((i) => {
    const r = rng();
    return { c: i % cols, r: Math.floor(i / cols), tone: r > 0.88 ? GOLD : r > 0.7 ? ICE : null, o: 0.1 + rng() * 0.28 };
  });
  return {
    sky: 'linear-gradient(180deg,#070B16 0%,#0E182C 100%)',
    layers: [
      {
        depth: 0.35,
        art: (
          <>
            {panes.map((p, i) =>
              p.tone ? <rect key={i} x={p.c * w + 5} y={70 + p.r * h + 5} width={w - 10} height={h - 10} fill={p.tone} opacity={p.o} /> : null
            )}
          </>
        ),
      },
      {
        depth: 0.6,
        art: (
          <g stroke='#1B2740' strokeWidth='3'>
            {range(cols + 1).map((c) => (
              <path key={`c${c}`} d={`M${c * w} 40V${VIEW_H}`} />
            ))}
            {range(rows + 2).map((r) => (
              <path key={`r${r}`} d={`M0 ${70 + r * h}H${VIEW_W}`} />
            ))}
          </g>
        ),
      },
    ],
  };
})();

/* ── candles: a market chart as a skyline (AB Institute) ─────────────────── */
const candles: Scene = (() => {
  const rng = createRng(401);
  let level = 560;
  const bars = range(42).map((i) => {
    const move = (rng() - 0.42) * 70;
    const open = level;
    level = Math.min(700, Math.max(300, level - move));
    const top = Math.min(open, level);
    const bottom = Math.max(open, level);
    return { x: 30 + i * 37.5, top, bottom: Math.max(bottom, top + 8), hi: top - 12 - rng() * 30, lo: bottom + 12 + rng() * 30, up: level < open };
  });
  const line = bars.map((b, i) => `${i ? 'L' : 'M'}${b.x + 10} ${(b.top + b.bottom) / 2 - 60}`).join('');
  return {
    sky: 'linear-gradient(180deg,#060B14 0%,#0B1820 70%,#10242A 100%)',
    layers: [
      {
        depth: 0.25,
        art: (
          <g stroke='#16242F' strokeWidth='1.5'>
            {range(7).map((r) => (
              <path key={r} d={`M0 ${220 + r * 90}H${VIEW_W}`} />
            ))}
          </g>
        ),
      },
      {
        depth: 0.55,
        art: (
          <>
            {bars.map((b) => (
              <g key={b.x} fill={b.up ? '#7FCFC0' : '#4B5871'} stroke={b.up ? '#7FCFC0' : '#4B5871'} opacity={b.up ? 0.7 : 0.6}>
                <path d={`M${b.x + 10} ${b.hi}V${b.lo}`} strokeWidth='2' />
                <rect x={b.x} y={b.top} width='20' height={b.bottom - b.top} stroke='none' />
              </g>
            ))}
            <path d={line} fill='none' stroke={GOLD} strokeWidth='2.5' opacity='0.7' />
          </>
        ),
      },
      { depth: 0.9, art: <rect y='800' width={VIEW_W} height='140' fill={INK} /> },
    ],
  };
})();

/* ── clinic: a calm schedule (Theracure) ─────────────────────────────────── */
const clinic: Scene = (() => {
  const rng = createRng(501);
  const rows = range(6).map((r) => {
    const y = 470 + r * r * 14 + r * 22;
    const scale = 0.5 + r * 0.14;
    let x = 80 - r * 40;
    const slots: { x: number; w: number; tone: string | null }[] = [];
    while (x < VIEW_W + 80) {
      const w = (70 + rng() * 150) * scale;
      const roll = rng();
      slots.push({ x, w, tone: roll > 0.8 ? GOLD : roll > 0.35 ? ICE : null });
      x += w + 16 * scale;
    }
    return { y, h: 26 * scale, slots };
  });
  return {
    sky: 'linear-gradient(180deg,#07121E 0%,#0E2132 60%,#163040 100%)',
    layers: [
      {
        depth: 0.2,
        art: (
          <g fill={ICE}>
            <circle cx='1180' cy='250' r='250' opacity='0.05' />
            <circle cx='1180' cy='250' r='150' opacity='0.05' />
            <circle cx='380' cy='330' r='190' opacity='0.035' />
          </g>
        ),
      },
      {
        depth: 0.6,
        art: (
          <>
            {rows.map((row, r) => (
              <g key={r} opacity={0.3 + r * 0.1}>
                {row.slots.map((s, i) =>
                  s.tone ? <rect key={i} x={s.x} y={row.y} width={s.w} height={row.h} rx={row.h / 2} fill={s.tone} opacity={s.tone === GOLD ? 0.75 : 0.42} /> : null
                )}
              </g>
            ))}
          </>
        ),
      },
    ],
  };
})();

/* ── operations: a recruitment operations room (Ex-Serviceman Jobs) ───────── */
const operations: Scene = (() => {
  const rng = createRng(601);
  const dots = range(38 * 13).map((i) => ({ x: 60 + (i % 38) * 40, y: 120 + Math.floor(i / 38) * 40 }));
  const nodes = range(16).map(() => dots[Math.floor(rng() * dots.length)]);
  const links = range(8).map((i) => [nodes[i * 2], nodes[i * 2 + 1]] as const);
  return {
    sky: 'linear-gradient(180deg,#07090F 0%,#0F131C 100%)',
    layers: [
      {
        depth: 0.3,
        art: (
          <g fill='#8A97AB' opacity='0.22'>
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r='2.2' />
            ))}
          </g>
        ),
      },
      {
        depth: 0.5,
        art: (
          <>
            <defs>
              <Glow id='op-node' strength={0.6} />
            </defs>
            {links.map(([a, b], i) => (
              <path key={i} d={`M${a.x} ${a.y}Q${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 90} ${b.x} ${b.y}`} fill='none' stroke={i % 3 === 0 ? ICE : GOLD} strokeOpacity='0.4' strokeWidth='1.6' />
            ))}
            {nodes.map((n, i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r='26' fill='url(#op-node)' />
                <circle cx={n.x} cy={n.y} r='4.5' fill='#FFD9A6' />
              </g>
            ))}
          </>
        ),
      },
      {
        depth: 0.88,
        art: (
          <g>
            <path d={`M0 ${VIEW_H + 40}V760H${VIEW_W}V${VIEW_H + 40}Z`} fill={INK} />
            {[180, 470, 760, 1050, 1340].map((x, i) => (
              <g key={x}>
                <rect x={x} y='690' width='150' height='84' rx='5' fill='#04060B' />
                <rect x={x + 9} y='699' width='132' height='60' fill={i % 2 ? ICE : AMBER} opacity='0.3' />
              </g>
            ))}
          </g>
        ),
      },
    ],
  };
})();

/* ── parade: a training ground at first light (SSTA) ─────────────────────── */
const parade: Scene = {
  sky: 'linear-gradient(180deg,#0A0D15 0%,#1D191D 52%,#5A3F35 84%,#A86C4A 100%)',
  layers: [
    {
      depth: 0.25,
      art: (
        <g fill='#17151B'>
          <rect x='250' y='470' width='1100' height='240' />
          <rect x='220' y='452' width='1160' height='22' />
          <path d='M640 452L800 380L960 452Z' />
          {range(26).map((i) => (
            <rect key={i} x={272 + i * 42} y='500' width='14' height='210' fill='#241F24' />
          ))}
        </g>
      ),
    },
    {
      depth: 0.5,
      art: (
        <g fill='#0C0C12'>
          <rect x='1180' y='250' width='7' height='470' />
          <path d='M1187 256q60 -18 110 6t92 -8v74q-46 18 -92 -6t-110 8Z' fill='#7A2E2A' opacity='0.85' />
          <rect y='706' width={VIEW_W} height='30' />
        </g>
      ),
    },
    {
      depth: 0.9,
      art: (
        <g fill={INK}>
          <rect y='800' width={VIEW_W} height='140' />
          {range(22).map((i) => (
            <Figure key={i} x={70 + i * 70} y={812} scale={2.5} facing={'right'} />
          ))}
        </g>
      ),
    },
  ],
};

/* ── shelves: a pharmacy stockroom (GOBT Medical ERP) ────────────────────── */
const shelves: Scene = (() => {
  const rng = createRng(801);
  const rows = [300, 470, 640, 810];
  const boxes = rows.flatMap((y, r) => {
    const out: { x: number; y: number; w: number; h: number; tone: string; o: number }[] = [];
    let x = 30;
    while (x < VIEW_W - 40) {
      const w = 36 + rng() * 70;
      const h = 50 + rng() * 80;
      const roll = rng();
      if (roll > 0.14) out.push({ x, y: y - h, w, h, tone: roll > 0.86 ? GOLD : roll > 0.58 ? '#7FCFC0' : '#16263A', o: roll > 0.58 ? 0.42 : 1 });
      x += w + 8 + (rng() > 0.8 ? 60 : 0);
    }
    return out.map((b) => ({ ...b, k: `${r}-${b.x}` }));
  });
  return {
    sky: 'linear-gradient(180deg,#070C14 0%,#0C1622 100%)',
    layers: [
      {
        depth: 0.4,
        art: (
          <>
            {boxes.map((b) => (
              <rect key={b.k} x={b.x} y={b.y} width={b.w} height={b.h} rx='3' fill={b.tone} opacity={b.o} />
            ))}
          </>
        ),
      },
      {
        depth: 0.6,
        art: (
          <g fill='#05080F'>
            {rows.map((y) => (
              <rect key={y} y={y} width={VIEW_W} height='12' />
            ))}
            {range(6).map((i) => (
              <rect key={i} x={i * 320 - 6} y='150' width='12' height='800' />
            ))}
          </g>
        ),
      },
    ],
  };
})();

/* ── interior: a room shaped by light (Navaru) ───────────────────────────── */
const interior: Scene = {
  sky: 'linear-gradient(180deg,#0D0B0A 0%,#1A1512 100%)',
  layers: [
    {
      depth: 0.3,
      art: (
        <>
          <defs>
            <linearGradient id='in-spill' x1='1' y1='0' x2='0' y2='1'>
              <stop offset='0' stopColor={AMBER} stopOpacity='0.42' />
              <stop offset='1' stopColor={AMBER} stopOpacity='0' />
            </linearGradient>
            <Glow id='in-lamp' strength={0.55} />
          </defs>
          <rect x='500' y='240' width='600' height='390' fill='#17120F' />
          {/* window on the right wall, and the light it throws across the floor */}
          <path d='M1210 300L1420 230V640L1210 590Z' fill={AMBER} opacity='0.3' />
          <path d='M1210 590L1420 640L1000 900H520Z' fill='url(#in-spill)' />
          <g stroke='#ECE6DA' strokeOpacity='0.13' strokeWidth='2' fill='none'>
            <path d='M500 240L0 0M1100 240L1600 0M500 630L0 900M1100 630L1600 900' />
            <rect x='500' y='240' width='600' height='390' />
            <path d='M1315 265V615M1210 445L1420 435' />
          </g>
        </>
      ),
    },
    {
      depth: 0.55,
      art: (
        <>
          <path d='M800 0V330' stroke='#060504' strokeWidth='3' />
          <circle cx='800' cy='372' r='170' fill='url(#in-lamp)' />
          <path d='M762 330h76l22 44h-120Z' fill='#D8B878' opacity='0.85' />
          <g fill='#0A0807'>
            <rect x='580' y='548' width='440' height='92' rx='12' />
            <rect x='560' y='520' width='60' height='120' rx='12' />
            <rect x='980' y='520' width='60' height='120' rx='12' />
            <rect x='610' y='500' width='380' height='70' rx='12' />
          </g>
        </>
      ),
    },
  ],
};

/* ── constellation: businesses joined into one group (ATGC) ──────────────── */
const constellation: Scene = (() => {
  const rng = createRng(1001);
  const pts = range(54).map(() => ({ x: rng() * VIEW_W, y: 60 + rng() * 760 }));
  const lines: string[] = [];
  pts.forEach((a, i) => {
    pts
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((n) => n.j !== i)
      .sort((m, n) => m.d - n.d)
      .slice(0, 2)
      .forEach((n) => {
        if (n.j > i || n.d > 150) lines.push(`M${a.x.toFixed(0)} ${a.y.toFixed(0)}L${pts[n.j].x.toFixed(0)} ${pts[n.j].y.toFixed(0)}`);
      });
  });
  const hubs = [pts[3], pts[11], pts[19], pts[27], pts[41]];
  return {
    sky: 'linear-gradient(180deg,#060B18 0%,#0A1630 100%)',
    layers: [
      { depth: 0.3, art: <path d={lines.join('')} fill='none' stroke={ICE} strokeOpacity='0.2' strokeWidth='1.4' /> },
      {
        depth: 0.5,
        art: (
          <>
            <defs>
              <Glow id='co-hub' color={GOLD} strength={0.5} />
            </defs>
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r='3' fill={ICE} opacity='0.65' />
            ))}
            {hubs.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r='46' fill='url(#co-hub)' />
                <circle cx={p.x} cy={p.y} r='7' fill={GOLD} />
              </g>
            ))}
          </>
        ),
      },
    ],
  };
})();

/* ── shafts: a building in section, lifts mid-journey (Oasis Elevators) ───── */
const shafts: Scene = (() => {
  const xs = [260, 520, 800, 1080, 1340];
  const car = (x: number, y: number, k: string) => (
    <g key={k}>
      <path d={`M${x} 0V${y}`} stroke='#2A3850' strokeWidth='2' />
      <rect x={x - 34} y={y} width='68' height='92' rx='4' fill='#0A111E' stroke={ICE} strokeOpacity='0.5' strokeWidth='2' />
      <rect x={x - 26} y={y + 9} width='52' height='74' fill={ICE} opacity='0.22' />
      <path d={`M${x} ${y + 9}v74`} stroke='#0A111E' strokeWidth='2' />
    </g>
  );
  return {
    sky: 'linear-gradient(180deg,#070B14 0%,#0E1A2A 100%)',
    layers: [
      {
        depth: 0.5,
        art: (
          <g stroke='#18263A' strokeWidth='2'>
            {range(8).map((i) => (
              <path key={i} d={`M0 ${90 + i * 118}H${VIEW_W}`} />
            ))}
            {xs.flatMap((x) => [<path key={`l${x}`} d={`M${x - 46} 0V${VIEW_H}`} />, <path key={`r${x}`} d={`M${x + 46} 0V${VIEW_H}`} />])}
          </g>
        ),
      },
      // Two sets of cars on different depths: as the page moves, the lifts travel in their shafts.
      { depth: 0.1, art: <>{[car(xs[0], 250, 'a'), car(xs[2], 520, 'b'), car(xs[4], 130, 'c')]}</> },
      { depth: 0.95, art: <>{[car(xs[1], 420, 'd'), car(xs[3], 610, 'e')]}</> },
    ],
  };
})();

/* ── industry: headframe, crane and a lit workspace (ATS Corporation) ─────── */
const industry: Scene = {
  sky: 'linear-gradient(180deg,#080B12 0%,#151B26 58%,#3A3232 88%,#6E5040 100%)',
  layers: [
    { depth: 0.2, art: <path d={ridgePath(ridgePoints({ seed: 1201, baseY: 640, amplitude: 110, roughness: 0.45, detail: 5 }))} fill='#151A24' /> },
    {
      depth: 0.5,
      art: (
        <g fill='none' stroke='#0A0D14' strokeWidth='7' strokeLinejoin='round'>
          {/* mine headframe */}
          <path d='M300 760L380 360H440L520 760M340 560H480M322 660H498M380 360L498 660M440 360L322 660' />
          <path d='M410 360L700 760' strokeWidth='6' />
          <circle cx='410' cy='346' r='34' strokeWidth='6' />
          <circle cx='410' cy='346' r='6' fill='#0A0D14' />
          {/* tower crane */}
          <path d='M1180 760V220M1180 250H1500M1180 250H1090M1180 220L1380 250M1180 220L1100 250M1440 250V330' strokeWidth='6' />
          <rect x='1424' y='330' width='32' height='26' fill='#0A0D14' />
        </g>
      ),
    },
    {
      depth: 0.8,
      art: (
        <>
          <rect y='760' width={VIEW_W} height='180' fill={INK} />
          <rect x='700' y='610' width='380' height='150' fill='#070A10' />
          {range(5).flatMap((c) =>
            range(2).map((r) => <rect key={`${c}-${r}`} x={724 + c * 70} y={632 + r * 58} width='46' height='38' fill={AMBER} opacity={(c + r) % 3 === 0 ? 0.2 : 0.62} />)
          )}
        </>
      ),
    },
  ],
};

/* ── equestrian: an arena under lights, below the hills (Colonel Horse Riding Club) ── */
const equestrian: Scene = (() => {
  const hills = ridgePoints({ seed: 11, baseY: 520, amplitude: 180, roughness: 0.5, detail: 6 });
  const tree = ridgePoints({ seed: 1307, baseY: 640, amplitude: 50, roughness: 0.5, detail: 6 });
  const posts = range(15).map((i) => 110 + i * 100);
  return {
    sky: 'linear-gradient(180deg,#060C0C 0%,#0C1A16 52%,#1D2A20 82%,#4C4A30 100%)',
    layers: [
      { depth: 0.2, art: <path d={ridgePath(hills)} fill='#10201B' /> },
      {
        depth: 0.4,
        art: (
          <g fill='#0A1612'>
            <path d={ridgePath(tree)} />
            <path d={forestPath({ seed: 12, ground: tree, spacing: 20, minHeight: 40, maxHeight: 90 })} />
          </g>
        ),
      },
      {
        depth: 0.65,
        art: (
          <>
            <defs>
              <linearGradient id='eq-cone' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0' stopColor='#FFE0B0' stopOpacity='0.36' />
                <stop offset='1' stopColor='#FFE0B0' stopOpacity='0' />
              </linearGradient>
            </defs>
            <rect y='740' width={VIEW_W} height='200' fill='#0B130F' />
            {[330, 760, 1190].map((x) => (
              <g key={x}>
                <path d={`M${x} 452L${x - 210} 760H${x + 210}Z`} fill='url(#eq-cone)' />
                <rect x={x - 3} y='440' width='6' height='310' fill='#050908' />
                <rect x={x - 22} y='432' width='44' height='14' rx='3' fill='#FFE7C2' />
              </g>
            ))}
            {/* arena rails */}
            <g stroke='#D8C9A8' strokeOpacity='0.5' strokeWidth='4'>
              <path d={`M60 716H${VIEW_W - 60}M60 742H${VIEW_W - 60}`} />
              {posts.map((x) => (
                <path key={x} d={`M${x} 704V762`} />
              ))}
            </g>
            {/* horse and rider, mid-trot */}
            <g transform='translate(980 742) scale(1.5)' fill='#040706' stroke='#040706' strokeLinecap='round'>
              <ellipse cx='0' cy='-52' rx='37' ry='16' stroke='none' />
              <path d='M-26 -60Q-42 -84 -50 -98L-68 -90L-64 -80Q-50 -76 -38 -48Z' stroke='none' />
              <path d='M-52 -98l-1 -9l7 6Z' stroke='none' />
              <path d='M-25 -42L-38 -22L-33 0M-17 -40L-11 -2M23 -40L31 -18L27 0M33 -44L22 -2' fill='none' strokeWidth='5' />
              <path d='M36 -58Q55 -50 50 -26' fill='none' strokeWidth='4.5' />
              <path d='M-10 -66L-4 -92h9l4 26Z' stroke='none' />
              <circle cx='0' cy='-100' r='6' stroke='none' />
              <path d='M2 -68L10 -44' fill='none' strokeWidth='4.5' />
            </g>
          </>
        ),
      },
    ],
  };
})();

/* ── terminal: records streaming past a search beam (ATS GeM) ────────────── */
const terminal: Scene = (() => {
  const rng = createRng(1401);
  const cols = range(10).map((c) => {
    const x = 40 + c * 158;
    const rows = range(26).map((r) => {
      const roll = rng();
      return { y: 60 + r * 32, w: 30 + rng() * 100, tone: roll > 0.93 ? GOLD : ICE, o: roll > 0.93 ? 0.75 : 0.08 + rng() * 0.18 };
    });
    return { x, rows };
  });
  return {
    sky: 'linear-gradient(180deg,#05080F 0%,#0A0F1C 100%)',
    layers: [
      {
        depth: 0.35,
        art: (
          <>
            {cols.map((col) =>
              col.rows.map((row) => <rect key={`${col.x}-${row.y}`} x={col.x} y={row.y} width={row.w} height='9' rx='2' fill={row.tone} opacity={row.o} />)
            )}
          </>
        ),
      },
      {
        depth: 0.75,
        art: (
          <>
            <defs>
              <linearGradient id='tm-beam' x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0' stopColor={GOLD} stopOpacity='0' />
                <stop offset='0.5' stopColor={GOLD} stopOpacity='0.85' />
                <stop offset='1' stopColor={GOLD} stopOpacity='0' />
              </linearGradient>
              <linearGradient id='tm-wash' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0' stopColor={GOLD} stopOpacity='0' />
                <stop offset='1' stopColor={GOLD} stopOpacity='0.1' />
              </linearGradient>
            </defs>
            <rect y='330' width={VIEW_W} height='140' fill='url(#tm-wash)' />
            <rect y='469' width={VIEW_W} height='2.5' fill='url(#tm-beam)' />
          </>
        ),
      },
    ],
  };
})();

const SCENES: Record<Environment, Scene> = {
  street,
  park,
  facade,
  candles,
  clinic,
  operations,
  parade,
  shelves,
  interior,
  constellation,
  shafts,
  industry,
  equestrian,
  terminal,
};

function ProjectBackdrop({ env }: { env: Environment }) {
  const scene = SCENES[env];
  return (
    <div className='project-backdrop absolute inset-0 overflow-hidden' aria-hidden='true'>
      <div className='layer' style={{ background: scene.sky }} />
      {scene.layers.map((layer, i) => (
        <div key={i} className='layer layer-over' data-depth={layer.depth}>
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio={layer.align ?? 'xMidYMid slice'}>
            {layer.art}
          </svg>
        </div>
      ))}
    </div>
  );
}

export default memo(ProjectBackdrop);
