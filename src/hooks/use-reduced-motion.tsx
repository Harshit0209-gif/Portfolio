import * as React from 'react';

export function useReducedMotion() {
  // Lazy-initialize synchronously from matchMedia (not a post-mount effect):
  // @gsap/react's useGSAP runs as a layout effect, which fires before this
  // hook's own passive effect would. Starting from a hardcoded `false` meant
  // Preloader/CustomCursor/MagneticButton always read the wrong value on the
  // very first render and committed to the "motion allowed" branch before
  // the real preference was detected.
  const [reduced, setReduced] = React.useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
