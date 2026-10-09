/**
 * Full-bleed scene photographs.
 *
 * Each scene ships as responsive AVIF/WebP in two crops — `wide` for landscape screens
 * and `tall` for portrait ones — plus a tiny depth map used for parallax on desktop.
 * To swap a picture: drop new files in /public/Hero with the same naming scheme
 * (`<name>-wide-<width>.avif|webp`, `<name>-tall-<width>.avif|webp`, `<name>-depth.jpg`)
 * and adjust the numbers below. Coordinates are fractions of the wide image, from the
 * top-left corner.
 */

export interface SceneCrop {
  /** Path in /public without size or extension. */
  base: string;
  /** Available widths, smallest first. */
  widths: number[];
  /** Intrinsic size of the largest file. */
  width: number;
  height: number;
  /** What to keep in frame when the picture is cropped to fit (CSS object-position, as fractions). */
  position: [number, number];
}

export interface SceneImage {
  wide: SceneCrop;
  /** Portrait crop, with the slice of the wide image it was cut from: [left, width] as fractions. */
  tall: SceneCrop & { slice: [number, number] };
  /** Greyscale depth map for the wide crop: white is near the lens, black is far away. */
  depth: string;
  /** The point the camera travels toward as the visitor scrolls. */
  focus: [number, number];
  /** A light source in the picture, for scenes that open from one. */
  light?: [number, number];
  /** A window in the picture the camera can pass through: [left, top, right, bottom]. */
  window?: [number, number, number, number];
}

export const sceneImages = {
  /** Prologue: a cabin at sunset, a figure looking out over the valley. */
  prologue: {
    wide: { base: '/Hero/sunset-cabin-wide', widths: [1280, 1672], width: 1672, height: 941, position: [0.5, 0.42] },
    tall: { base: '/Hero/sunset-cabin-tall', widths: [720, 1036], width: 1036, height: 940, position: [0.29, 0.5], slice: [0, 0.62] },
    depth: '/Hero/sunset-cabin-depth.jpg',
    focus: [0.62, 0.4],
    /** The lantern on the cabin table. The opening sequence grows out of it. */
    light: [0.115, 0.41],
  },
  /** Chapter 01: the same valley, the hiker now standing with a pack, about to set off. */
  beginning: {
    wide: { base: '/Hero/alpine-hiker-wide', widths: [1152, 1536], width: 1536, height: 1024, position: [0.6, 0.45] },
    tall: { base: '/Hero/alpine-hiker-tall', widths: [600, 844], width: 844, height: 1023, position: [0.68, 0.5], slice: [0.45, 0.55] },
    depth: '/Hero/alpine-hiker-depth.jpg',
    focus: [0.7, 0.45],
  },
  /** Chapter 02: the cabin at twilight, a desk visible through its lit window. */
  exploration: {
    wide: { base: '/Hero/twilight-cabin-wide', widths: [1280, 1672], width: 1672, height: 941, position: [0.5, 0.56] },
    tall: { base: '/Hero/twilight-cabin-tall', widths: [540, 769], width: 769, height: 941, position: [0.5, 0.5], slice: [0.27, 0.46] },
    depth: '/Hero/twilight-cabin-depth.jpg',
    // the centre of the window, which the camera pushes through
    focus: [0.502, 0.563],
    /** The window glass, measured from the photograph: [left, top, right, bottom]. */
    window: [0.395, 0.331, 0.609, 0.795],
  },
  /** Chapter 02, inside: the studio at night, a wall of glass onto the moonlit valley, an empty desk. */
  studio: {
    wide: { base: '/Hero/alpine-studio-wide', widths: [1280, 1672], width: 1672, height: 941, position: [0.5, 0.5] },
    tall: { base: '/Hero/alpine-studio-tall', widths: [540, 769], width: 769, height: 941, position: [0.76, 0.5], slice: [0.44, 0.46] },
    depth: '/Hero/alpine-studio-depth.jpg',
    // the far shore of the lake, through the glass
    focus: [0.58, 0.44],
  },
  /** Chapter 08: the summit at sunrise, the valley and the lit lodge below. */
  finale: {
    wide: { base: '/Hero/valley-sunset-wide', widths: [1280, 1765], width: 1765, height: 891, position: [0.62, 0.5] },
    tall: { base: '/Hero/valley-sunset-tall', widths: [540, 776], width: 776, height: 890, position: [0.47, 0.5], slice: [0.48, 0.44] },
    depth: '/Hero/valley-sunset-depth.jpg',
    // the sun on the horizon
    focus: [0.65, 0.447],
  },
} satisfies Record<string, SceneImage>;
