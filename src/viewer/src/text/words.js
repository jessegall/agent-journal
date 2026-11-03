export const MARKER = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g;

export const withoutChips = (text) => String(text || "").replace(MARKER, (whole, kind, value, label) => label);

