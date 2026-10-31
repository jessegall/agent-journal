import {href} from "../route.js";
import {register} from "./index.js";
import {MARKER} from "./words.js";

const RENDERERS = {
    chip: (value, label) =>
        `<a class="row-pill" href="#" data-peek="${value}">${label.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
    file: (value, label) => {
        const [path, line] = value.split("#L");
        return `<a class="row-pill file-pill" href="${href.file(path, line)}">${label}</a>`;
    },
    url: (value, label) => `<a href="${value}" target="_blank" rel="noopener">${label}</a>`,
};

register((text, context) =>
    text.replace(MARKER, (whole, kind, value, label) => (RENDERERS[kind] ? RENDERERS[kind](value, label, context) : label))
);
