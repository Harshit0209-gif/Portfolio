import { chapters, type ChapterId } from '@/content';
import { useActiveSection } from '@/hooks/useActiveSection';

const CHAPTER_IDS = chapters.map((c) => c.id);

/**
 * A slim rail of ticks down the right edge on wide screens: one per chapter, the current
 * one drawn longer. It gives a sense of how far through the film you are, and jumps to
 * any chapter. Hidden on smaller screens, where the menu does the same job.
 */
export default function ChapterRail() {
  const active = useActiveSection(CHAPTER_IDS) as ChapterId;

  return (
    <nav className='fixed right-3 top-1/2 z-[55] hidden -translate-y-1/2 xl:block' aria-label='Chapters' data-intro-chrome>
      <ol className='flex flex-col items-end'>
        {chapters.map((c) => {
          const current = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-label={c.number ? `Chapter ${c.number}: ${c.title}` : c.title}
                aria-current={current ? 'true' : undefined}
                className='group flex h-7 items-center justify-end gap-2.5 pl-6'
              >
                {/* The name appears on hover or keyboard focus only, so the rail never sits on top of content. */}
                <span
                  aria-hidden='true'
                  className={`whitespace-nowrap rounded-[2px] bg-midnight/80 px-1.5 py-0.5 text-[0.7rem] font-semibold transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    current ? 'text-champagne opacity-0' : 'text-parchment opacity-0'
                  }`}
                >
                  <span className='tabular'>{c.number}</span>
                  <span className={c.number ? 'ml-2' : ''}>{c.title}</span>
                </span>
                <span
                  className={`block h-px transition-all duration-500 ${current ? 'w-7 bg-champagne' : 'w-3 bg-parchment/40 group-hover:w-5 group-hover:bg-parchment'}`}
                  aria-hidden='true'
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
