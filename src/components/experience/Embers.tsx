import { useEffect, useRef } from 'react';

interface EmbersProps {
  /** Particles at desktop width; scaled down automatically on small screens. */
  count?: number;
  /** RGB triplet, e.g. "240, 163, 94". */
  color?: string;
  className?: string;
}

/**
 * Slow, warm motes drifting upward — fireflies at dusk, dust in lamplight.
 *
 * A plain 2D canvas is the right tool here: a few dozen soft sprites need no WebGL.
 * The loop stops whenever the canvas is off screen or the tab is hidden, and the
 * component renders nothing at all when the visitor prefers reduced motion.
 */
export default function Embers({ count = 46, color = '240, 163, 94', className = '' }: EmbersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let last = 0;

    // Pre-render one soft sprite and stamp it, instead of building a gradient per particle.
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext('2d')!;
    const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, `rgba(${color}, 1)`);
    g.addColorStop(0.25, `rgba(${color}, 0.55)`);
    g.addColorStop(1, `rgba(${color}, 0)`);
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 64, 64);

    type Mote = { x: number; y: number; size: number; speed: number; sway: number; phase: number; life: number };
    let motes: Mote[] = [];

    const spawn = (anywhere: boolean): Mote => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 20,
      size: 3 + Math.random() * 9,
      speed: 6 + Math.random() * 16,
      sway: 8 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      life: 0.35 + Math.random() * 0.65,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(count * Math.min(1, Math.max(0.4, width / 1440)));
      motes = Array.from({ length: target }, () => spawn(true));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.y -= m.speed * dt;
        m.phase += dt * 0.6;
        if (m.y < -20) motes[i] = spawn(false);
        // Brightest in the lower half, fading as they rise into the cold air.
        const fade = Math.min(1, Math.max(0, m.y / (height * 0.75)));
        ctx.globalAlpha = m.life * fade * (0.6 + 0.4 * Math.sin(m.phase * 2.3));
        const x = m.x + Math.sin(m.phase) * m.sway;
        ctx.drawImage(sprite, x - m.size, m.y - m.size, m.size * 2, m.size * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let visible = false;
    const sync = () => (visible && !document.hidden ? start() : stop());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const ro = new ResizeObserver(resize);

    resize();
    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener('visibilitychange', sync);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [count, color]);

  return <canvas ref={canvasRef} aria-hidden='true' className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
