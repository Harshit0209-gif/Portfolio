import { profile } from '@/content';

const NotFound = () => (
  <main className='flex min-h-screen flex-col items-start justify-center bg-midnight px-[var(--gutter)]'>
    <p className='chapter-label'>
      <span className='chapter-num'>404</span>
      <span className='chapter-rule' aria-hidden='true' />
      <span>Off the trail</span>
    </p>
    <h1 className='headline mt-5 max-w-[40rem]'>This path doesn&rsquo;t lead anywhere.</h1>
    <p className='lede mt-6'>The page you were looking for isn&rsquo;t part of {profile.name}&rsquo;s portfolio. The journey starts at the beginning.</p>
    <a href='/' className='btn-primary mt-9'>
      Back to the start
    </a>
  </main>
);

export default NotFound;
