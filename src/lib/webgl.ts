let cached: boolean | null = null;

/** True when the browser can actually create a WebGL context (not just when the API exists). */
export function supportsWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    cached = gl !== null;
    // Release the probe context straight away; browsers cap the number of live contexts.
    (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
