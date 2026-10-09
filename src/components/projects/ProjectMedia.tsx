import { useState } from 'react';
import type { ProjectMedia as Media } from '@/content';

/**
 * The "interface" half of a project world.
 *
 * Screenshots are real captures (see captions for where each came from), framed in a
 * plain browser chrome and served as responsive WebP. Projects with no UI to show get a
 * blueprint instead: actual routes read from the code, in the same 16:10 frame, so no
 * project is given a smaller stage than another.
 */
export default function ProjectMedia({ media, name }: { media: Media; name: string }) {
  const [index, setIndex] = useState(0);

  if (media.kind === 'blueprint') {
    return (
      <figure className='m-0'>
        <div className='browser-frame'>
          <div className='browser-bar'>
            <i />
            <i />
            <i />
            <span className='browser-url font-mono'>{media.file}</span>
          </div>
          <div className='flex aspect-[16/10] flex-col justify-center bg-[#070C17] px-[7%] py-[5%]'>
            <table className='w-full border-collapse text-left'>
              <caption className='sr-only'>Routes in {name}</caption>
              <tbody>
                {media.lines.map((line) => (
                  <tr key={line.path} className='border-b border-parchment/[0.06] last:border-0'>
                    <th scope='row' className='whitespace-nowrap py-[0.55em] pr-6 font-mono text-[clamp(0.72rem,1.15vw,0.95rem)] font-normal text-ice'>
                      {line.path}
                    </th>
                    <td className='py-[0.55em] text-[clamp(0.72rem,1.1vw,0.92rem)] text-parchment/60'>{line.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <figcaption className='fine mt-3.5'>{media.caption}</figcaption>
      </figure>
    );
  }

  const image = media.images[index];

  return (
    <figure className='m-0'>
      <div className='browser-frame'>
        <div className='browser-bar'>
          <i />
          <i />
          <i />
          <span className='browser-url'>{image.address}</span>
        </div>
        <img
          key={image.src}
          src={`${image.src}-800.webp`}
          srcSet={`${image.src}-800.webp 800w, ${image.src}-1440.webp 1440w`}
          sizes='(min-width: 1024px) 54vw, 92vw'
          width={1440}
          height={900}
          alt={image.alt}
          loading='lazy'
          decoding='async'
          className='block aspect-[16/10] h-auto w-full bg-[#070C17] object-cover'
        />
      </div>
      <div className='mt-3.5 flex flex-wrap items-start justify-between gap-x-6 gap-y-2'>
        <figcaption className='fine max-w-[34rem]'>{image.caption}</figcaption>
        {media.images.length > 1 && (
          <div className='flex gap-1.5' role='group' aria-label={`${name} screenshots`}>
            {media.images.map((img, i) => (
              <button
                key={img.src}
                type='button'
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                className={`min-h-[36px] rounded-full border px-3.5 text-[0.78rem] font-semibold transition-colors ${
                  i === index ? 'border-champagne bg-champagne text-midnight' : 'border-parchment/25 text-parchment/75 hover:border-champagne hover:text-champagne'
                }`}
              >
                {img.label ?? "View " + (i + 1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}
