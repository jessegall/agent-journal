import {plainText} from "../text/words.js";

export function quoted(text) {
    const lines = String(text ?? "").split("\n");
    const quote = [];
    while (lines.length && lines[0].startsWith(">")) quote.push(lines.shift().replace(/^> ?/, ""));
    return {quote: quote.join("\n"), text: lines.join("\n").trim()};
}

export function withQuote(quote, text) {
    return quote ? `> ${quote.replace(/\n/g, "\n> ")}\n\n${text}` : text;
}

export function replyQuote(text) {
    return plainText(quoted(text).text)
        .split("\n")
        .filter((line) => !line.startsWith(">"))
        .join(" ")
        .slice(0, 200);
}

// a quoted message as one line of plain words, for the bar above the composer: code fences dropped, the code's words kept, and the
// marks of quotes, headings, lists, links and emphasis taken out
const FENCE = /^\s*(```|~~~)/;
const LINE_MARK = /^\s*(?:>+|#{1,6}|[-*+]|\d+[.)])\s+/;
const LINK = /!?\[([^\]]*)\]\([^)]*\)/g;
const EMPHASIS = /(^|[\s(])[*_]+([^*_\n]+?)[*_]+(?=[\s.,;:!?)]|$)/g;

export const quoteLine = (text) =>
    plainText(
        String(text ?? "")
            .split("\n")
            .filter((line) => !FENCE.test(line))
            .map((line) => line.replace(LINE_MARK, "").replace(LINK, "$1"))
            .join(" ")
    )
        .replace(EMPHASIS, "$1$2")
        .replace(/\s+/g, " ")
        .trim();

export const linesWord = ({first, last}) => (first ? (first === last ? `line ${first}` : `lines ${first}-${last}`) : "a selection");

export const fileComment = (file, picked, words) => ({text: aboutLines(file, picked, words)});

export function aboutLines(file, picked, words) {
    const source = picked.first
        ? file.text
              .split("\n")
              .slice(picked.first - 1, picked.last)
              .join("\n")
        : picked.text;
    const path = file.root ? `${file.root}/${file.path}` : file.path;
    return `About ${path}, ${linesWord(picked)}:\n\n${withQuote(source, words.trim())}`;
}
