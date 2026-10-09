# Harshit Raj — The Journey of a Developer

My portfolio, built as a scroll-driven story in eight chapters rather than a stack of
sections: a cabin above a valley at sunset, a lit window you travel through into a
studio, a building whose lit windows map my projects, fourteen project worlds, a 3D
technology universe, and a summit at sunrise.

**Live:** _add the deployed URL here_

## Run it

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # production build in dist/
npm run preview    # serve the production build
npm test           # content and terrain checks (Vitest)
npm run lint       # ESLint
```

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · GSAP + ScrollTrigger · Lenis ·
Three.js via React Three Fiber (technology universe only) · Radix Dialog.

## Editing the content

Everything a visitor reads lives in `src/content/`. Components never hard-code it.

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, role, contact details, résumé path, experience, education |
| `story.ts` | The copy for each chapter, navigation, and the "challenges" fragments |
| `projects.ts` | The project manifest: summary, role, stack, status, links, media |
| `technologies.ts` | Technologies and one honest sentence about each |
| `imagery.ts` | The five full-bleed scene photographs: crops, focal points, depth maps |

Rules the content follows, enforced by `npm test`:

- Every project is shown the same way, in the order it began. There is no featured tier.
- A project only gets a live link when the URL has been checked. Otherwise it shows a
  plain "not available" state, never a placeholder link.
- `stack` is what I used; `platform` is the rest of the system around my work.
- No proficiency ratings. A technology's evidence is the list of projects it appears in.

To add a project, add an entry to `projects.ts` and, if it has a UI to show, two
screenshots in `public/projects/` named `<name>-800.webp` and `<name>-1440.webp`
(16:10). Set `published: false` to keep an entry without showing it.

## How it is put together

```
src/
  content/        the words and facts (see above)
  lib/
    terrain.ts    seeded procedural mountains, forests and skylines (pure functions)
    parallax.ts   depth parallax driven by data-depth attributes
    scroll.ts     fragment navigation that stays in sync with scroll-driven stages
    gsap.ts       GSAP setup and the shared media conditions
  components/
    sections/     one file per chapter; each owns its scene and choreography
    scenes/       the landscape, project environments and the 3D universe
    projects/     project world, media frame and case-study sheet
    experience/   chapter title card, ember particles
    layout/       navigation and chapter rail
```

A few decisions worth knowing about:

- **Stages use CSS `position: sticky`,** not pin-spacers. A tall wrapper with a sticky,
  screen-sized child; scroll progress through the wrapper scrubs a GSAP timeline. Anchors,
  history and resizing behave like an ordinary page.
- **The scene photographs have depth.** The prologue, chapters one and two and the
  finale are single images redrawn through a small depth map (`DepthImage`, plain
  WebGL, no library), so scrolling dollies the camera and the foreground moves faster
  than the peaks. Phones, reduced motion and browsers without WebGL get the same
  picture as a normal image.
- **Chapter two passes through a window in a photograph.** The glass is located from
  the image itself (`window` in `imagery.ts`); the photo scales about its centre while
  the studio is unmasked behind it at the same rate, so they stay aligned at any size.
- **The rest of the scenery is generated, not drawn.** `terrain.ts` builds the ridges,
  treelines and skylines behind the project worlds and the builder from fixed seeds.
- **Three.js is used once,** where depth matters: the technology universe. It is a
  separate chunk, loaded as the chapter approaches, paused off screen, and replaced by an
  SVG version when WebGL is unavailable.
- **Project scenery mounts lazily,** about a screen before it is needed, so the first
  load does not pay for fourteen scenes it cannot show yet.

## Accessibility and motion

- Works without animation: with `prefers-reduced-motion`, there is no intro, no smooth
  scrolling, no scrubbing, and every chapter renders in its final state.
- The opening sequence plays once per session and can be skipped (button, Escape, or
  simply scrolling).
- All navigation is ordinary links to URL fragments; the back button works.
- The technology list and the per-floor project lists are real buttons and links, so
  nothing depends on hovering a canvas.

## Assets

- Fonts are self-hosted in `public/fonts` (SIL Open Font License).
- Screenshots in `public/projects` are real captures of the projects; each caption in
  `projects.ts` says where it came from.
- Scene photographs live in `public/Hero` as AVIF and WebP, in a wide crop and a portrait
  crop. The original PNGs are local sources only: the site never loads them and they
  are git-ignored, so they stay out of the repository and out of deploys built from it.
