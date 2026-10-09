import type Lenis from 'lenis';

/**
 * A tiny module-level handle on the smooth-scroll instance, so navigation code can ask
 * for a scroll without threading a ref through the tree. When Lenis is not running
 * (reduced motion), scrolling falls back to the browser's native behaviour.
 */
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

interface ScrollOptions {
  immediate?: boolean;
  /** Move keyboard focus to the target so screen-reader and keyboard users land there too. */
  focus?: boolean;
}

/**
 * Where to scroll so that `target` is actually on show.
 *
 * Content inside a sticky stage has no useful document position of its own — it stays
 * pinned to the top of the stage while scroll progress decides what is visible. Such
 * content can declare `data-stage-progress="0.9"`; a jump then lands at that point of
 * the stage's timeline, so the animation state and the destination always agree.
 * Returns null when the element's own position is the right answer.
 */
function stageAwareTop(target: HTMLElement): number | null {
  const progress = target.dataset.stageProgress;
  if (progress === undefined) return null;
  const stage = target.closest<HTMLElement>('.stage');
  const sticky = stage?.querySelector<HTMLElement>(':scope > .stage-sticky');
  if (!stage || !sticky || getComputedStyle(sticky).position !== 'sticky') return null;
  const top = stage.getBoundingClientRect().top + window.scrollY;
  return top + (stage.offsetHeight - window.innerHeight) * Number(progress);
}

/** Document position a jump to `target` should end at, measured now. */
function destinationOf(target: HTMLElement): number {
  return stageAwareTop(target) ?? target.getBoundingClientRect().top + window.scrollY;
}

export function scrollToTarget(target: HTMLElement, { immediate = false, focus = true }: ScrollOptions = {}) {
  const y = stageAwareTop(target);
  if (lenis) {
    const instance = lenis;
    instance.scrollTo(y ?? target, {
      immediate,
      duration: immediate ? 0 : 1.4,
      // force: navigation must still work in the instant a menu is closing and scrolling is paused
      force: true,
      // A long animated scroll can outlive a layout change (late fonts, lazy content).
      // Re-measure on arrival and settle exactly on the destination if it moved.
      onComplete: () => {
        const settled = destinationOf(target);
        if (Math.abs(settled - window.scrollY) > 2) instance.scrollTo(settled, { immediate: true, force: true });
      },
    });
  } else if (y !== null) {
    window.scrollTo(0, y);
  } else {
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  if (focus) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

/** Resolve a URL fragment to an element and scroll to it. Returns false if nothing matched. */
export function scrollToHash(hash: string, options?: ScrollOptions) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  scrollToTarget(el, options);
  return true;
}
