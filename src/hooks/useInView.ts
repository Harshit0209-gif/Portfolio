import { useEffect, useState, type RefObject } from 'react';

interface Options {
  /** Grow the viewport so work can start slightly before the element is visible. */
  rootMargin?: string;
  /** Stay true after the first intersection (for lazy mounting). */
  once?: boolean;
}

/** Whether an element is on (or near) screen. Used to lazy-mount and to pause rendering. */
export function useInView(ref: RefObject<Element>, { rootMargin = '0px', once = false }: Options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
