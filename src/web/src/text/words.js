export const MARKER = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g;

export const words = (text) => String(text || "").replace(MARKER, (whole, kind, value, label) => label);
