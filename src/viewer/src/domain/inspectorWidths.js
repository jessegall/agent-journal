// the width of each word an inspector declares, in pixels: the one place the viewer names a width
export const INSPECTOR_WIDTHS = {small: 480, medium: 640, large: 960, wide: 1120};
// the widest inspector never takes more than 92% of the window, so the page stays in view beside it
const WIDE_SHARE = "92vw";

// the CSS width of a declared word, never wider than the screen; a word the viewer does not know draws small
export const inspectorWidth = (name) => `min(${INSPECTOR_WIDTHS[name] ?? INSPECTOR_WIDTHS.small}px, ${name === "wide" ? WIDE_SHARE : "100vw"})`;
