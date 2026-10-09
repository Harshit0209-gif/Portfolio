import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, MQ } from '@/lib/gsap';
import { capabilities, experience, profile, projects } from '@/content';
import ChapterHeading from '@/components/experience/ChapterHeading';

/**
 * 07 — THE PRESENT.
 *
 * The lights are back on and the room is in order. Where earlier chapters were
 * atmospheric, this one is deliberately structured: drawn rules, a clear grid, and only
 * verified facts — real roles with their dates, education, and capabilities stated
 * qualitatively. There are no invented statistics here.
 */
export default function PresentSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // Structure first: the rules draw, then the content settles onto them.
        q('.present-block').forEach((block) => {
          gsap
            .timeline({ scrollTrigger: { trigger: block, start: 'top 80%', once: true } })
            .from(block.querySelectorAll('.rule'), { scaleX: 0, duration: 1.1, ease: 'power3.inOut', stagger: 0.08 }, 0)
            .from(block.querySelectorAll('.present-item'), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.07 }, 0.25);
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id='present' className='relative overflow-hidden bg-navy' aria-labelledby='present-title'>
      <div className='pointer-events-none absolute inset-0' aria-hidden='true'>
        <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg,#03050A 0%,#0A1220 22%,#0D1626 60%,#0B1424 100%)' }} />
        {/* cool light from one side, warm from the other: design and engineering in balance */}
        <div className='absolute -left-[10%] top-[10%] h-[70%] w-[55%]' style={{ background: 'radial-gradient(closest-side,rgba(169,203,224,.09),transparent)' }} />
        <div className='absolute -right-[10%] bottom-0 h-[70%] w-[55%]' style={{ background: 'radial-gradient(closest-side,rgba(240,163,94,.08),transparent)' }} />
      </div>

      <div className='relative mx-auto max-w-[1400px] px-[var(--gutter)] pb-[18vh] pt-[24vh]'>
        <ChapterHeading chapter='present' className='max-w-[52rem]' />

        <div className='mt-20 grid gap-x-14 gap-y-20 lg:grid-cols-12'>
          <div className='present-block lg:col-span-7'>
            <h3 className='present-item font-sans text-[0.8rem] font-semibold tracking-normal text-champagne'>What I bring</h3>
            <dl className='mt-5 grid gap-x-10 sm:grid-cols-2'>
              {capabilities.map((c) => (
                <div key={c.title} className='relative py-7'>
                  <span className='rule absolute inset-x-0 top-0 h-px origin-left bg-parchment/20' aria-hidden='true' />
                  <dt className='present-item font-serif text-[1.55rem] leading-tight text-parchment'>{c.title}</dt>
                  <dd className='present-item mt-3 text-[0.98rem] leading-relaxed text-parchment/70'>{c.body}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className='present-block lg:col-span-5'>
            <h3 className='present-item font-sans text-[0.8rem] font-semibold tracking-normal text-champagne'>Experience</h3>
            <ol className='mt-5'>
              {experience.map((job) => (
                <li key={job.organisation} className='relative py-6'>
                  <span className='rule absolute inset-x-0 top-0 h-px origin-left bg-parchment/20' aria-hidden='true' />
                  <div className='present-item flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1'>
                    <h4 className='font-serif text-[1.3rem] font-normal leading-tight tracking-normal text-parchment'>{job.organisation}</h4>
                    <p className='tabular text-[0.82rem] text-parchment/60'>{job.period}</p>
                  </div>
                  <p className='present-item mt-1 text-[0.86rem] text-parchment/60'>{job.role}</p>
                  <p className='present-item mt-3 text-[0.95rem] leading-relaxed text-parchment/70'>{job.summary}</p>
                  {job.projectSlug && (
                    <a href={`#project-${job.projectSlug}`} className='present-item text-link mt-3 inline-block text-[0.88rem]'>
                      See the project
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className='present-block relative mt-16 pt-8'>
          <span className='rule absolute inset-x-0 top-0 h-px origin-left bg-champagne/50' aria-hidden='true' />
          <dl className='grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='present-item'>
              <dt className='text-[0.8rem] font-semibold text-champagne'>Education</dt>
              <dd className='mt-2 text-[0.98rem] leading-snug text-parchment/85'>
                {profile.education.degree}
                <span className='mt-1 block text-[0.86rem] text-parchment/60'>
                  {profile.education.school}, {profile.education.period}
                </span>
              </dd>
            </div>
            <div className='present-item'>
              <dt className='text-[0.8rem] font-semibold text-champagne'>Based in</dt>
              <dd className='mt-2 text-[0.98rem] leading-snug text-parchment/85'>{profile.location}</dd>
            </div>
            <div className='present-item'>
              <dt className='text-[0.8rem] font-semibold text-champagne'>Availability</dt>
              <dd className='mt-2 text-[0.98rem] leading-snug text-parchment/85'>{profile.availability}</dd>
            </div>
            <div className='present-item'>
              <dt className='text-[0.8rem] font-semibold text-champagne'>The work</dt>
              <dd className='mt-2 flex flex-col items-start gap-1.5 text-[0.98rem] leading-snug'>
                <a href='#projects' className='text-link'>
                  {projects.length} projects on this page
                </a>
                <a href={profile.socials[0].href} target='_blank' rel='noopener noreferrer' className='text-link inline-flex items-center gap-1'>
                  Code on GitHub
                  <ArrowUpRight className='h-3.5 w-3.5' aria-hidden='true' />
                  <span className='sr-only'>(opens in a new tab)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
