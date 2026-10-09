import { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, X } from 'lucide-react';
import { statusMeta, techById, type Project } from '@/content';

interface CaseStudyDialogProps {
  project: Project | null;
  onClose: () => void;
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='border-t border-parchment/10 py-6'>
      <h3 className='mb-3 font-sans text-[0.8rem] font-semibold text-champagne'>{title}</h3>
      {children}
    </section>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className='space-y-2.5'>
      {items.map((item) => (
        <li key={item} className='relative pl-5 text-[0.98rem] leading-relaxed text-parchment/85'>
          <span className='absolute left-0 top-[0.72em] h-px w-2.5 bg-champagne/70' aria-hidden='true' />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Tags({ ids }: { ids: string[] }) {
  return (
    <ul className='flex flex-wrap gap-2'>
      {ids.map((id) => (
        <li key={id} className='tech-tag'>
          {techById[id]?.name ?? id}
        </li>
      ))}
    </ul>
  );
}

/**
 * The full account of one project: context, my part in it, what it does, what it is
 * built with, and — stated plainly — where it stands and what is not done.
 * Every project gets the same sections in the same order.
 */
export default function CaseStudyDialog({ project: selected, onClose }: CaseStudyDialogProps) {
  // Keep showing the last project while the sheet animates out.
  const lastShown = useRef<Project | null>(null);
  if (selected) lastShown.current = selected;
  const project = lastShown.current;

  return (
    <Dialog.Root open={selected !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-[80] bg-[#02040A]/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0' />
        <Dialog.Content
          // Lenis must not hijack wheel/touch inside the scrollable sheet.
          data-lenis-prevent
          aria-describedby={undefined}
          className='fixed inset-y-0 right-0 z-[81] flex w-full max-w-[46rem] flex-col border-l border-parchment/10 bg-navy shadow-[-40px_0_80px_-20px_rgba(0,0,0,.8)] duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right motion-reduce:!animate-none'
        >
          {project && (
            <>
              <header className='flex items-start justify-between gap-6 px-6 pb-5 pt-7 sm:px-10 sm:pt-9'>
                <div>
                  <p className='text-sm text-parchment/60'>
                    <span className='tabular'>{project.year}</span>
                    <span className='mx-2.5 inline-block h-px w-5 translate-y-[-0.28em] bg-parchment/30' aria-hidden='true' />
                    {project.category}
                  </p>
                  <Dialog.Title className='mt-2 font-serif text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.05] text-parchment'>{project.name}</Dialog.Title>
                  <p className='status mt-4' style={{ ['--status-color' as string]: statusMeta[project.status].color }}>
                    {statusMeta[project.status].label}
                  </p>
                </div>
                <Dialog.Close className='-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-parchment/70 transition-colors hover:bg-parchment/10 hover:text-parchment'>
                  <X className='h-5 w-5' aria-hidden='true' />
                  <span className='sr-only'>Close case study</span>
                </Dialog.Close>
              </header>

              <div className='flex-1 overflow-y-auto overscroll-contain px-6 pb-10 sm:px-10'>
                <Block title='Context'>
                  <p className='text-[1.02rem] leading-relaxed text-parchment/85'>{project.context}</p>
                </Block>

                <Block title='My role'>
                  <p className='mb-3 text-[1.02rem] leading-relaxed text-parchment/85'>{project.role}.</p>
                  {project.contribution && <Points items={project.contribution} />}
                </Block>

                <Block title='What it does'>
                  <Points items={project.highlights} />
                </Block>

                <Block title='Built with'>
                  <Tags ids={project.stack} />
                  {project.platform && (
                    <div className='mt-5'>
                      <p className='fine mb-2.5'>Also part of the system, outside my own work:</p>
                      <Tags ids={project.platform} />
                    </div>
                  )}
                </Block>

                <Block title='Where it stands'>
                  <p className='mb-3 text-[1.02rem] leading-relaxed text-parchment/85'>{statusMeta[project.status].label}.</p>
                  {project.limitations.length > 0 && <Points items={project.limitations} />}
                </Block>

                <Block title='Links'>
                  <ul className='flex flex-wrap gap-3'>
                    {project.live ? (
                      <li>
                        <a href={project.live.href} target='_blank' rel='noopener noreferrer' className='btn-primary btn-sm'>
                          {project.live.label}
                          <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
                          <span className='sr-only'>(opens in a new tab)</span>
                        </a>
                      </li>
                    ) : (
                      <li>
                        <span className='btn-unavailable btn-sm'>
                          <span className='sr-only'>Live site: </span>
                          {project.liveUnavailable}
                        </span>
                      </li>
                    )}
                    {project.source.length > 0 ? (
                      project.source.map((link) => (
                        <li key={link.href}>
                          <a href={link.href} target='_blank' rel='noopener noreferrer' className='btn-ghost btn-sm'>
                            {link.label}
                            <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
                            <span className='sr-only'>(opens in a new tab)</span>
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span className='btn-unavailable btn-sm'>
                          <span className='sr-only'>Source code: </span>
                          {project.sourceUnavailable ?? 'Source not public'}
                        </span>
                      </li>
                    )}
                  </ul>
                </Block>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
