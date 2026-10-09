import { useEffect } from 'react';
import { getLenis } from '@/lib/scroll';

/** Pause smooth scrolling while an overlay (menu, case study) owns the screen. */
export function useScrollPause(paused: boolean) {
  useEffect(() => {
    if (!paused) return;
    const lenis = getLenis();
    lenis?.stop();
    return () => lenis?.start();
  }, [paused]);
}
