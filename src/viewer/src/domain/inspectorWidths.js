// the width of each word an inspector declares, in pixels: the one place the viewer names a width
export const INSPECTOR_WIDTHS = {small: 480, medium: 640, large: 960, wide: 1130};

// the CSS width of a declared word, never wider than the screen; a word the viewer does not know draws small
export const inspectorWidth = (name) => `min(${INSPECTOR_WIDTHS[name] ?? INSPECTOR_WIDTHS.small}px, 100vw)`;
