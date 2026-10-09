/**
 * Small silhouettes shared by the generated project scenery.
 */

/** A standing figure with a backpack. Drawn in the current fill colour. */
export function Figure({ x, y, scale = 1, facing = 'left' }: { x: number; y: number; scale?: number; facing?: 'left' | 'right' }) {
  const flip = facing === 'left' ? 1 : -1;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * flip} ${scale})`}>
      {/* backpack sits behind the shoulders */}
      <rect x='3.2' y='-31' width='4.6' height='10.5' rx='1.6' />
      <circle cx='0' cy='-36.4' r='3.3' />
      <path d='M-4.2 -31.6Q0 -33.4 4.2 -31.6L4.7 -18.8H-4.3Z' />
      <path d='M-4.3 -30.4L-5.9 -28.8L-6.4 -19.4L-4.9 -19.1Z' />
      <path d='M-4 -19.4H-0.5L-1.3 0H-3.7Z' />
      <path d='M0.3 -19.4H4.1L3.6 0H1.1Z' />
    </g>
  );
}
