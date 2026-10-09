import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { SceneCrop, SceneImage } from '@/content/imagery';

export interface DepthImageHandle {
  /** Camera push, 0 (at rest) to 1 (fully travelled). Driven by scroll and the opening sequence. */
  setPush: (value: number) => void;
  /** Where a point of the picture (fractions of the wide image) currently sits inside this element, in px. */
  pointOnScreen: (point: [number, number]) => { x: number; y: number } | null;
}

interface DepthImageProps {
  image: SceneImage;
  /** The first thing on the page: load eagerly and at high priority. */
  priority?: boolean;
  className?: string;
}

/** Portrait screens get the portrait crop. Keep in sync with `.depth-image` in index.css. */
const TALL_QUERY = '(max-aspect-ratio: 4/5)';
/** The depth pass is a desktop enhancement: a wide frame, and a visitor who has not asked for less motion. */
const DEPTH_QUERY = '(min-width: 1024px) and (min-aspect-ratio: 1/1) and (prefers-reduced-motion: no-preference)';

const srcSet = (crop: SceneCrop, ext: string) => crop.widths.map((w) => `${crop.base}-${w}.${ext} ${w}w`).join(', ');
/** A cover-fitted image is as wide as the screen, or wider when the screen is the narrower shape. */
const sizes = (crop: SceneCrop) => `max(100vw, ${Math.round((crop.width / crop.height) * 100)}vh)`;
const pct = ([x, y]: [number, number]) => `${x * 100}% ${y * 100}%`;

const VERTEX = `
attribute vec2 a;
varying vec2 vUv;
void main() {
  vUv = vec2(a.x * 0.5 + 0.5, 0.5 - a.y * 0.5);
  gl_Position = vec4(a, 0.0, 1.0);
}`;

/*
  One photograph, treated as if it had depth. Each pixel looks up how near it is, then:
  - the camera push zooms near things faster than far ones (a dolly, not a flat zoom);
  - the pointer shifts near things one way and far things the other. Anything at the
    neutral depth of 0.35 does not move at all, which is how a scene keeps a surface
    still under content drawn on top of it.
*/
const FRAGMENT = `
precision mediump float;
uniform sampler2D uImage;
uniform sampler2D uDepth;
uniform vec2 uScale;
uniform vec2 uOrigin;
uniform vec2 uFocus;
uniform vec2 uPointer;
uniform float uPush;
varying vec2 vUv;
void main() {
  vec2 uv = uOrigin + vUv * uScale;
  float near = texture2D(uDepth, uv).r;
  float zoom = 1.0 + uPush * mix(0.05, 0.24, near);
  vec2 p = uFocus + (uv - uFocus) / zoom;
  p -= uPointer * (near - 0.35) * vec2(0.011, 0.007);
  gl_FragColor = texture2D(uImage, clamp(p, 0.0, 1.0));
}`;

/**
 * A full-bleed scene photograph with depth.
 *
 * It is an ordinary responsive <picture> first — that is what loads, what counts as the
 * largest paint, and what everyone gets on phones, with reduced motion, or without
 * WebGL (there the camera push is a plain CSS scale). On desktop a small WebGL pass
 * (no library, one triangle, two textures) redraws the same picture through a depth
 * map so that scroll and pointer movement reveal real parallax.
 *
 * It is frugal on purpose: it draws only when something changes, never on a
 * free-running loop, and it holds textures and a full-size drawing buffer only while
 * the scene is within a couple of screens of the viewport.
 */
const DepthImage = forwardRef<DepthImageHandle, DepthImageProps>(function DepthImage({ image, priority = false, className = '' }, ref) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef({ push: 0, draw: null as null | (() => void) });

  const applyPush = () => {
    const { push, draw } = view.current;
    if (draw) draw();
    else if (img.current) img.current.style.transform = push ? `scale(${(1 + push * 0.14).toFixed(4)})` : '';
  };

  useImperativeHandle(ref, () => ({
    setPush(value) {
      view.current.push = value;
      applyPush();
    },
    pointOnScreen([u, v]) {
      const el = img.current;
      if (!el || !el.naturalWidth) return null;
      const tall = window.matchMedia(TALL_QUERY).matches;
      const crop = tall ? image.tall : image.wide;
      const x = tall ? (u - image.tall.slice[0]) / image.tall.slice[1] : u;
      const box = { w: el.clientWidth, h: el.clientHeight };
      const scale = Math.max(box.w / el.naturalWidth, box.h / el.naturalHeight);
      const shown = { w: el.naturalWidth * scale, h: el.naturalHeight * scale };
      return { x: (box.w - shown.w) * crop.position[0] + x * shown.w, y: (box.h - shown.h) * crop.position[1] + v * shown.h };
    },
  }));

  useEffect(() => {
    const el = img.current;
    const cv = canvas.current;
    const box = wrap.current;
    if (!el || !cv || !box) return;
    const wants = window.matchMedia(DEPTH_QUERY);
    let gl: WebGLRenderingContext | null = null;

    /** Build the depth pass. Returns a function that hands every GPU resource back, or null if it cannot run. */
    const engage = (): (() => void) | null => {
      gl = gl ?? cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false });
      if (!gl || gl.isContextLost()) return null;
      const g = gl;

      const compile = (type: number, source: string) => {
        const shader = g.createShader(type)!;
        g.shaderSource(shader, source);
        g.compileShader(shader);
        return shader;
      };
      const program = g.createProgram()!;
      const vs = compile(g.VERTEX_SHADER, VERTEX);
      const fs = compile(g.FRAGMENT_SHADER, FRAGMENT);
      g.attachShader(program, vs);
      g.attachShader(program, fs);
      g.linkProgram(program);
      const buffer = g.createBuffer();
      const textures: (WebGLTexture | null)[] = [];
      const dispose = () => {
        textures.forEach((t) => g.deleteTexture(t));
        g.deleteBuffer(buffer);
        g.deleteProgram(program);
        g.deleteShader(vs);
        g.deleteShader(fs);
      };
      if (!g.getProgramParameter(program, g.LINK_STATUS)) {
        dispose();
        return null; // keep the plain image
      }
      g.useProgram(program);

      // one oversized triangle covers the screen
      g.bindBuffer(g.ARRAY_BUFFER, buffer);
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
      const a = g.getAttribLocation(program, 'a');
      g.enableVertexAttribArray(a);
      g.vertexAttribPointer(a, 2, g.FLOAT, false, 0, 0);

      const texture = (unit: number, source: TexImageSource) => {
        const tex = g.createTexture();
        g.activeTexture(g.TEXTURE0 + unit);
        g.bindTexture(g.TEXTURE_2D, tex);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, source);
        return tex;
      };
      const uniform = (name: string) => g.getUniformLocation(program, name);
      const u = { scale: uniform('uScale'), origin: uniform('uOrigin'), focus: uniform('uFocus'), pointer: uniform('uPointer'), push: uniform('uPush') };
      g.uniform1i(uniform('uImage'), 0);
      g.uniform1i(uniform('uDepth'), 1);
      g.uniform2f(u.focus, image.focus[0], image.focus[1]);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      let alive = true;
      let live = false;
      let onScreen = false;
      let frame = 0;

      const draw = () => {
        g.viewport(0, 0, cv.width, cv.height);
        // reproduce object-fit: cover with the same focal position the <img> uses
        const frameRatio = cv.width / cv.height;
        const imageRatio = el.naturalWidth / el.naturalHeight;
        const sx = frameRatio > imageRatio ? 1 : frameRatio / imageRatio;
        const sy = frameRatio > imageRatio ? imageRatio / frameRatio : 1;
        g.uniform2f(u.scale, sx, sy);
        g.uniform2f(u.origin, (1 - sx) * image.wide.position[0], (1 - sy) * image.wide.position[1]);
        g.uniform2f(u.pointer, pointer.x, pointer.y);
        g.uniform1f(u.push, view.current.push);
        g.drawArrays(g.TRIANGLES, 0, 3);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cv.width = Math.max(1, Math.round(box.clientWidth * dpr));
        cv.height = Math.max(1, Math.round(box.clientHeight * dpr));
        if (live) draw();
      };

      // Ease the pointer toward its target for a few frames, then stop until it moves again.
      const settle = () => {
        pointer.x += (pointer.tx - pointer.x) * 0.06;
        pointer.y += (pointer.ty - pointer.y) * 0.06;
        draw();
        frame = Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.002 ? requestAnimationFrame(settle) : 0;
      };
      const onPointer = (event: PointerEvent) => {
        if (!live || !onScreen || event.pointerType !== 'mouse') return;
        pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
        if (!frame) frame = requestAnimationFrame(settle);
      };

      const depth = new Image();
      depth.decoding = 'async';
      const ready = () => {
        if (!alive || !el.naturalWidth || !depth.naturalWidth) return;
        textures.forEach((t) => g.deleteTexture(t));
        textures.length = 0;
        textures.push(texture(0, el), texture(1, depth));
        // hand over from the still image: same picture, now with depth
        live = true;
        el.style.transform = '';
        view.current.draw = draw;
        resize();
        cv.style.opacity = '1';
      };
      depth.onload = ready;
      depth.src = image.depth;
      el.addEventListener('load', ready);
      if (el.complete) ready();

      const visibility = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
      });
      const sizeWatcher = new ResizeObserver(resize);
      window.addEventListener('pointermove', onPointer, { passive: true });
      visibility.observe(box);
      sizeWatcher.observe(box);

      return () => {
        alive = false;
        live = false;
        cancelAnimationFrame(frame);
        depth.onload = null;
        el.removeEventListener('load', ready);
        window.removeEventListener('pointermove', onPointer);
        visibility.disconnect();
        sizeWatcher.disconnect();
        // back to the still image, carrying the current camera position with it
        view.current.draw = null;
        cv.style.opacity = '0';
        applyPush();
        dispose();
        // give the drawing buffer back too
        cv.width = 1;
        cv.height = 1;
      };
    };

    let release: (() => void) | null = null;
    let near = false;
    const sync = () => {
      if (near && wants.matches) release = release ?? engage();
      else if (release) {
        release();
        release = null;
      }
    };
    const proximity = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        sync();
      },
      // within a screen and a half above or below
      { rootMargin: '150% 0px' }
    );
    const onLost = (event: Event) => {
      event.preventDefault();
      release?.();
      release = null;
    };

    proximity.observe(box);
    wants.addEventListener('change', sync);
    cv.addEventListener('webglcontextlost', onLost);

    return () => {
      proximity.disconnect();
      wants.removeEventListener('change', sync);
      cv.removeEventListener('webglcontextlost', onLost);
      release?.();
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [image]);

  const largest = (crop: SceneCrop) => `${crop.base}-${crop.widths[crop.widths.length - 1]}.webp`;

  return (
    <div
      ref={wrap}
      className={`depth-image absolute inset-0 overflow-hidden ${className}`}
      style={{ ['--pos-wide' as string]: pct(image.wide.position), ['--pos-tall' as string]: pct(image.tall.position) }}
      aria-hidden='true'
    >
      <picture>
        <source media={TALL_QUERY} type='image/avif' srcSet={srcSet(image.tall, 'avif')} sizes={sizes(image.tall)} />
        <source media={TALL_QUERY} type='image/webp' srcSet={srcSet(image.tall, 'webp')} sizes={sizes(image.tall)} />
        <source type='image/avif' srcSet={srcSet(image.wide, 'avif')} sizes={sizes(image.wide)} />
        <source type='image/webp' srcSet={srcSet(image.wide, 'webp')} sizes={sizes(image.wide)} />
        <img
          ref={img}
          src={largest(image.wide)}
          alt=''
          width={image.wide.width}
          height={image.wide.height}
          decoding='async'
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={{ transformOrigin: pct(image.focus) }}
        />
      </picture>
      <canvas ref={canvas} />
    </div>
  );
});

export default DepthImage;
