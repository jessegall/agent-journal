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

export const linesWord = ({first, last}) => (first ? (first === last ? `line ${first}` : `lines ${first}-${last}`) : "a selection");

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
