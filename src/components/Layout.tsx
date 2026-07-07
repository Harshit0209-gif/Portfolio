import { lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from '@/lib/gsap';
import Footer from '@/components/Footer';
import Preloader from '@/components/effects/Preloader';
import CustomCursor from '@/components/effects/CustomCursor';
import ScrollProgress from '@/components/effects/ScrollProgress';
import NoiseOverlay from '@/components/effects/NoiseOverlay';
import { useLenis } from '@/hooks/useLenis';

// Lazy load the 3D scene for better performance
const Scene3D = lazy(() => import('@/components/Scene3D'));

export default function Layout() {
  const { pathname } = useLocation();
  const lenisRef = useLenis();

  useGSAP(
    () => {
      lenisRef.current?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      // Let the new page's content mount before measuring scroll distances.
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    },
    { dependencies: [pathname] }
  );

  return (
    <main className='relative min-h-screen bg-background'>
      <Preloader onComplete={() => {}} />

      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      <NoiseOverlay />
      <ScrollProgress />
      <CustomCursor />

      <div className='relative z-10'>
        <Outlet />
      </div>

      <Footer />
    </main>
  );
}
