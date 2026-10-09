import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { chapterById, chapters, primaryNav, profile, type ChapterId } from '@/content';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrollPause } from '@/hooks/useScrollPause';

const CHAPTER_IDS = chapters.map((c) => c.id);

/** Which primary link is "current" for each chapter of the story. */
const NAV_FOR_CHAPTER: Partial<Record<ChapterId, string>> = {
  beginning: '#beginning',
  exploration: '#beginning',
  builder: '#beginning',
  projects: '#projects',
  universe: '#universe',
  challenges: '#present',
  present: '#present',
  next: '#contact',
};

/**
 * Minimal navigation: a wordmark, five destinations, and a quiet indicator of where in
 * the story you are. Every link is an ordinary URL fragment, so it works with the
 * keyboard, with "open in new tab", with the back button, and without animation.
 */
export default function Navigation() {
  const active = useActiveSection(CHAPTER_IDS) as ChapterId;
  const chapter = chapterById[active] ?? chapters[0];
  const currentHref = NAV_FOR_CHAPTER[active];
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollPause(menuOpen);

  return (
    <header className='fixed inset-x-0 top-0 z-[60]' data-intro-chrome>
      {/* a soft shade so links stay readable over any scene; not a bar */}
      <div className='pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#03050A]/80 to-transparent' aria-hidden='true' />

      <nav className='relative flex h-16 items-center justify-between gap-6 px-[var(--gutter)] lg:h-20' aria-label='Primary'>
        <a href='#prologue' className='font-serif text-[1.3rem] leading-none text-parchment transition-colors hover:text-champagne'>
          {profile.name}
        </a>

        <ul className='hidden items-center gap-9 lg:flex'>
          {primaryNav.map((item) => {
            const current = item.href === currentHref;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={current ? 'true' : undefined}
                  className={`relative py-2 text-[0.9rem] font-medium transition-colors ${current ? 'text-parchment' : 'text-parchment/60 hover:text-parchment'}`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-champagne transition-transform duration-500 ${current ? 'scale-x-100' : 'scale-x-0'}`}
                    aria-hidden='true'
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <p className='chapter-label hidden min-w-[13rem] justify-end lg:flex' aria-label={chapter.number ? `Chapter ${chapter.number}: ${chapter.title}` : chapter.title}>
          {chapter.number && <span className='chapter-num'>{chapter.number}</span>}
          {chapter.number && <span className='chapter-rule' aria-hidden='true' />}
          <span>{chapter.title}</span>
        </p>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className='-mr-2 inline-flex h-11 items-center gap-2.5 rounded-full px-3 text-[0.9rem] font-semibold text-parchment lg:hidden'>
            <span className='flex flex-col gap-[5px]' aria-hidden='true'>
              <span className='block h-px w-5 bg-current' />
              <span className='block h-px w-5 bg-current' />
            </span>
            Menu
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content
              data-lenis-prevent
              aria-describedby={undefined}
              className='fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-midnight px-[var(--gutter)] pb-10 duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:!animate-none'
            >
              <div className='flex h-16 shrink-0 items-center justify-between'>
                <Dialog.Title className='font-serif text-[1.3rem] font-normal leading-none tracking-normal text-parchment'>{profile.name}</Dialog.Title>
                <Dialog.Close className='-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-parchment'>
                  <X className='h-5 w-5' aria-hidden='true' />
                  <span className='sr-only'>Close menu</span>
                </Dialog.Close>
              </div>

              <nav aria-label='Chapters' className='mt-6'>
                <ol>
                  {chapters
                    .filter((c) => c.number)
                    .map((c) => (
                      <li key={c.id} className='border-b border-parchment/10'>
                        <a
                          href={`#${c.id}`}
                          onClick={() => setMenuOpen(false)}
                          aria-current={c.id === active ? 'true' : undefined}
                          className={`flex items-baseline gap-5 py-4 ${c.id === active ? 'text-champagne' : 'text-parchment'}`}
                        >
                          <span className='tabular w-6 text-xs text-parchment/60'>{c.number}</span>
                          <span className='font-serif text-[1.65rem] leading-tight'>{c.title}</span>
                        </a>
                      </li>
                    ))}
                </ol>
              </nav>

              <div className='mt-10 flex flex-wrap gap-3'>
                <a href='#contact' onClick={() => setMenuOpen(false)} className='btn-primary'>
                  Let&rsquo;s talk
                </a>
                <a href={profile.resume.href} download={profile.resume.fileName} className='btn-ghost'>
                  Download résumé
                </a>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}
