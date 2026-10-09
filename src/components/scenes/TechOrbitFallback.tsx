import type { UniverseNode } from '@/components/scenes/TechUniverse3D';
import type { TechGroupId } from '@/content';

const RINGS: Record<TechGroupId, { rx: number; color: string }> = {
  frontend: { rx: 150, color: '#A9CBE0' },
  motion: { rx: 215, color: '#D8B878' },
  backend: { rx: 285, color: '#F0A35E' },
  tools: { rx: 350, color: '#8A97AB' },
};

interface Props {
  nodes: UniverseNode[];
  selectedId: string | null;
  hoveredId: string | null;
}

/**
 * The same system drawn flat, in SVG. It stands in while the 3D scene is loading, and
 * replaces it entirely when WebGL is unavailable or fails — the chapter never shows an
 * empty box, and every technology remains selectable from the list beside it.
 */
export default function TechOrbitFallback({ nodes, selectedId, hoveredId }: Props) {
  return (
    <svg viewBox='-400 -230 800 460' className='h-full w-full' role='img' aria-label='Technologies arranged on four orbits around a warm core, one orbit per group.'>
      <defs>
        <radialGradient id='orbit-core'>
          <stop offset='0' stopColor='#FFE0B0' />
          <stop offset='0.25' stopColor='#F0A35E' stopOpacity='0.6' />
          <stop offset='1' stopColor='#F0A35E' stopOpacity='0' />
        </radialGradient>
      </defs>
      <circle r='120' fill='url(#orbit-core)' />
      <circle r='20' fill='#F0A35E' />
      {(Object.keys(RINGS) as TechGroupId[]).map((group) => {
        const ring = RINGS[group];
        const members = nodes.filter((n) => n.group === group);
        return (
          <g key={group}>
            <ellipse rx={ring.rx} ry={ring.rx * 0.5} fill='none' stroke={ring.color} strokeOpacity='0.3' />
            {members.map((node, i) => {
              const a = ring.rx * 0.012 + (i / members.length) * Math.PI * 2;
              const focused = node.id === selectedId || node.id === hoveredId;
              const x = Math.cos(a) * ring.rx;
              const y = Math.sin(a) * ring.rx * 0.5;
              return (
                <g key={node.id}>
                  <circle cx={x} cy={y} r={focused ? 9 : 4 + Math.min(node.count, 9) * 0.35} fill={ring.color} />
                  {focused && (
                    <text x={x} y={y + 26} textAnchor='middle' fill='#ECE6DA' fontSize='15' fontWeight='600' className='font-sans'>
                      {node.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
