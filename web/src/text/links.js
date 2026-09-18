import {register} from "./index.js";

const URL = /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:)]/g;
const CODE = /`([^`\n]+)`/g;

register((text) =>
    text
        .replace(CODE, (whole, code) => `<code>${code}</code>`)
        .replace(URL, (url) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`)
);
