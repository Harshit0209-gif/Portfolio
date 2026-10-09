import { gsap } from '@/lib/gsap';

interface DepthParallaxOptions {
  /**
   * How far the most distant layer lags behind the page, as a fraction of the viewport
   * height. Layers need at least this much overscan above and below (see `.layer-over`).
   */
  strength?: number;
  /** Element whose passage through the viewport drives the effect. Defaults to `scope`. */
  trigger?: Element;
}

/**
 * Depth parallax for scenes that scroll with the page.
 *
 * Any descendant with `data-depth` takes part: 0 is infinitely far (lags the scroll the
 * most), 1 is at the lens (moves with the page). The depth lives on the element, next
 * to the artwork, so a scene declares its own spacing and this function stays generic.
 *
 * All layers of a scene share one scrubbed timeline — and therefore one ScrollTrigger —
 * so a scene costs a single measurement on refresh however many layers it has.
 *
 * Must be called inside a GSAP context (useGSAP / gsap.matchMedia) so it is reverted
 * automatically; only call it when motion is allowed.
 */
export function depthParallax(scope: Element, { strength = 0.14, trigger = scope }: DepthParallaxOptions = {}) {
  const layers = gsap.utils
    .toArray<HTMLElement>(scope.querySelectorAll('[data-depth]'))
    .map((layer) => ({ layer, lag: 1 - Math.min(1, Math.max(0, Number(layer.dataset.depth) || 0)) }))
    .filter(({ lag }) => lag > 0);
  if (layers.length === 0) return null;

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
  });
  layers.forEach(({ layer, lag }) => {
    timeline.fromTo(layer, { y: () => -lag * strength * window.innerHeight }, { y: () => lag * strength * window.innerHeight }, 0);
  });
  return timeline;
}
