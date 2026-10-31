import {WORD_PATTERN, tableOfWord} from "./tables.js";

const MENTION = new RegExp(`\\b(${WORD_PATTERN}) #?(\\d+)\\b`, "gi");

// The rows a text names by kind and number, as in "waits for the design in message 85018", each once, in the order named.
export const mentionedRefs = (text) => [...new Set([...String(text || "").matchAll(MENTION)].map(([, word, id]) => `${tableOfWord(word)}:${id}`))];
