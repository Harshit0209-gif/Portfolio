import { Outlet } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import ChapterRail from '@/components/layout/ChapterRail';
import { useLenis } from '@/hooks/useLenis';

export default function Layout() {
  useLenis();

  return (
    <>
      <a
        href='#main'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-champagne focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-midnight'
      >
        Skip to content
      </a>

      <Navigation />
      <ChapterRail />

      <main id='main' tabIndex={-1} className='relative outline-none'>
        <Outlet />
      </main>

      {/* Film grain: one static layer, no blend mode and no animation, so it costs nothing to scroll past. */}
      <div className='grain' aria-hidden='true' />
    </>
  );
}
