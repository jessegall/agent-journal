import {register} from "./index.js";
import {WORD_PATTERN, tableOfWord} from "../domain/tables.js";

const SKIPPED = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs;
const NAMED = new RegExp(`\\b(${WORD_PATTERN}) #?(\\d+)\\b`, "gi");

const chips = (text) =>
    text.replace(NAMED, (whole, word, id) => `<a class="row-pill" href="#" data-peek="${tableOfWord(word)}:${id}">${word} <span class="row-pill-num">${id}</span></a>`);

register((text) =>
    text
        .split(SKIPPED)
        .map((part, i) => (i % 2 ? part : chips(part)))
        .join("")
);
