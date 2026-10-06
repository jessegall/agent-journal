const BOUNDARY = "[\\p{L}\\p{N}_-]";
const escaped = (word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const matches = (word, text) => new RegExp(`(?<!${BOUNDARY})${escaped(word)}(?!${BOUNDARY})`, "iu").test(text);

export const matching = (words, text) => (text ? words.filter((word) => word && matches(word, text)) : []);

export const split = (text) =>
    text
        .split(/[,\n]/)
        .map((word) => word.trim())
        .filter(Boolean);
