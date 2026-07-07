import * as React from 'react';

export function useCanHover() {
  // Lazy-initialize synchronously; see use-reduced-motion.tsx for why a
  // post-mount-only effect races with @gsap/react's layout effect.
  const [canHover, setCanHover] = React.useState(
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  React.useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = () => setCanHover(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return canHover;
}
