import {register} from "./index.js";

const MARKER = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g;
const FILE_ICON =
    '<svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/></svg>';

const RENDERERS = {
    chip: (value, label) => `<a class="row-pill" href="#" data-peek="${value}">${label}</a>`,
    file: (value, label, context) =>
        `<a class="row-pill file-pill" href="#/${context.env}/file?q=${encodeURIComponent(value)}">${FILE_ICON}${label}</a>`,
    commit: (value, label, context) => `<a class="row-pill" href="#/${context.env}/commit/${value}">${label}</a>`,
    url: (value, label) => `<a href="${value}" target="_blank" rel="noopener">${label}</a>`,
};

export const words = (text) => String(text || "").replace(MARKER, (whole, kind, value, label) => label);

register((text, context) =>
    text.replace(MARKER, (whole, kind, value, label) => (RENDERERS[kind] ? RENDERERS[kind](value, label, context) : label))
);
