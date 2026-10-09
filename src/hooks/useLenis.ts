import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { registerLenis, scrollToHash } from '@/lib/scroll';

/**
 * Smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Also owns fragment navigation: in-page links scroll smoothly while still updating the
 * URL and history, and back/forward moves between chapters.
 */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    let onTick: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      registerLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      onTick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(onTick);
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute('href') ?? '';
      if (hash.length < 2) return;
      if (!document.getElementById(decodeURIComponent(hash.slice(1)))) return;
      event.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, '', hash);
      scrollToHash(hash);
    };

    const onHistory = () => {
      if (window.location.hash) scrollToHash(window.location.hash);
      else if (lenis) lenis.scrollTo(0);
      else window.scrollTo(0, 0);
    };

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onHistory);

    // Web fonts change line breaks, and with them every trigger position: re-measure once they land.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    // Arriving on a deep link: wait for layout (stages add a lot of height), then jump.
    let raf = 0;
    if (window.location.hash) {
      raf = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        scrollToHash(window.location.hash, { immediate: true, focus: false });
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onHistory);
      if (onTick) gsap.ticker.remove(onTick);
      lenis?.destroy();
      registerLenis(null);
    };
  }, []);
}
