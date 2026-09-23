import {register} from "./index.js";
import {MARKER} from "./words.js";

const FILE_ICON =
    '<svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/></svg>';

const RENDERERS = {
    chip: (value, label) => `<a class="row-pill" href="#" data-peek="${value}">${label.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
    chips: (value, label) => {
        const type = value.split(":")[0];
        const linked = label.replace(/#?(\d+)/g, (whole, n) => `<a class="row-pill-n row-pill-num" href="#" data-peek="${type}:${n}">${whole}</a>`);
        return `<span class="row-pill">${linked}</span>`;
    },
    file: (value, label, context) => {
        const [path, line] = value.split("#L");
        return `<a class="row-pill file-pill" href="#/${context.env}/file?q=${encodeURIComponent(path)}${line ? `&line=${line}` : ""}">${FILE_ICON}${label}</a>`;
    },
    commit: (value, label, context) => `<a class="row-pill" href="#/${context.env}/commit/${value}">${label}</a>`,
    url: (value, label) => `<a href="${value}" target="_blank" rel="noopener">${label}</a>`,
};

register((text, context) =>
    text.replace(MARKER, (whole, kind, value, label) => (RENDERERS[kind] ? RENDERERS[kind](value, label, context) : label))
);
