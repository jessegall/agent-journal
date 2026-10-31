import {register} from "./index.js";
import {WORD_PATTERN, tableOfWord} from "../domain/tables.js";

const SKIPPED = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs;
// a row by its word and number, with a place in it after a colon: a line, a span of lines, or "section N"; or its number in parentheses, as in "the joining task (1463)"
const NAMED = new RegExp(`\\b(${WORD_PATTERN}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi");

// a word and a list of numbers, as in "messages 62830, 62833 and 62837": each number its own chip of the singular word
const LISTED = new RegExp(`\\b(${WORD_PATTERN}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi");

const pill = (word, id) => `<a class="row-pill" href="#" data-peek="${tableOfWord(word)}:${id}">${word} <span class="row-pill-num">${id}</span></a>`;

const listed = (text) => text.replace(LISTED, (whole, word, numbers) => numbers.replace(/\d+/g, (id) => pill(word.replace(/s$/i, ""), id)));

const chips = (text) =>
    listed(text).replace(
        NAMED,
        (whole, word, bare, at = "", enclosed) => {
            const id = bare || enclosed;
            return `<a class="row-pill" href="#" data-peek="${tableOfWord(word)}:${id}"${at ? ` data-sub="${at}"` : ""}>${word} <span class="row-pill-num">${id}${at ? `:${at}` : ""}</span></a>`;
        }
    );

register((text, context) =>
    context.rowNames === false
        ? text
        : text
              .split(SKIPPED)
              .map((part, i) => (i % 2 ? part : chips(part)))
              .join("")
);
