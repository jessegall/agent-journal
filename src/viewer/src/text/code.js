import {withoutChips} from "./words.js";
import {typeOfParagraph} from "./codeLines.js";
import {highlight} from "./highlight.js";
import {register} from "./index.js";
import "./copyBlock.js";

const PARAGRAPH_BREAK = /\n\s*\n/;
const FENCE = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/;
const CLOSING_FENCE = /^\s*(`{3,}|~{3,})\s*$/;
const INDENTED = /^\s{4,}\S/;
// the lines under a head line: indented by two spaces or more, and not a list item
const UNDER_HEAD = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;
const HEAD = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/;
const LANGS = [
    ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
    ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
    ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
    ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
    ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
    ["json", /^\s*[{[]/],
    ["js", /\b(const |let |=>|function |console\.|=== )/],
];

function unescape(text) {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
}

function guess(lines) {
    const text = unescape(lines.join("\n"));
    return (LANGS.find(([, re]) => re.test(text)) || ["text"])[0];
}

// whether the last held line opens a block, so the indented lines after it are its body
const endsInHead = (held) => {
    const last = (held[held.length - 1] || "").trim();
    return Boolean(last) && HEAD.test(last) && !LIST_ITEM.test(last);
};

// whether a line is an item of a list or runs on from one, so its indent is the list's and not a block of code
const inList = (held, line) => LIST_ITEM.test(line) || LIST_ITEM.test([...held].reverse().find((kept) => kept.trim()) || "");

function block(lines, lang) {
    const language = lang || guess(lines);
    const code = highlight(unescape(lines.join("\n")), language).map((line) => `<span class="code-line">${line}\n</span>`).join("");
    return {type: "html", html: `<div class="chat-code-block" data-language="${language}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${code}</code></pre></div>`};
}

// a fence ends at a line of the same mark, at least as long, with nothing after it
function fenceEnd(lines, opening, mark) {
    const end = lines.findIndex((line, k) => k > opening && line.trim().startsWith(mark) && CLOSING_FENCE.test(line));
    return end < 0 ? lines.length : end;
}

// the lines of a fence inside a list lose the fence's own indent
function fenced(lines, indent, language) {
    const outdented = lines.map((line) => line.replace(new RegExp(`^\\s{0,${indent.length}}`), ""));
    return block(outdented.map(withoutChips), language ? language.toLowerCase() : "");
}

// the text with each run of paragraphs that is code without a fence made a block, and the text between them kept as it was: a run holds
// a paragraph of code, or two lines of code, and may hold blank lines
function withCodeParagraphs(text) {
    const paragraphs = text.split(PARAGRAPH_BREAK).map((paragraph) => ({paragraph, type: typeOfParagraph(unescape(paragraph).split("\n"))}));
    const pieces = [];
    let kept = [];
    const keep = () => {
        if (kept.length) pieces.push({type: "text", text: kept.join("\n\n")});
        kept = [];
    };
    let i = 0;
    while (i < paragraphs.length) {
        let stop = i;
        while (stop < paragraphs.length && paragraphs[stop].type !== "text") stop += 1;
        const run = paragraphs.slice(i, stop);
        if (run.some(({type}) => type === "code") || run.length > 1) {
            keep();
            pieces.push(block(run.map(({paragraph}) => paragraph).join("\n\n").split("\n").map(withoutChips), ""));
            i = stop;
            continue;
        }
        kept.push(paragraphs[i].paragraph);
        i += 1;
    }
    keep();
    return pieces.length === 1 && pieces[0].type === "text" ? [{type: "text", text}] : pieces;
}

// the text with its fences made blocks; a document is Markdown, so nothing else in it is guessed to be code
function lift(text, isDocument) {
    const lines = text.split("\n");
    const out = [];
    let held = [];
    const flush = () => {
        if (held.length) out.push(...(isDocument ? [{type: "text", text: held.join("\n")}] : withCodeParagraphs(held.join("\n"))));
        held = [];
    };
    let i = 0;
    while (i < lines.length) {
        const fence = lines[i].match(FENCE);
        if (fence) {
            const stop = fenceEnd(lines, i, fence[2]);
            flush();
            out.push(fenced(lines.slice(i + 1, stop), fence[1], fence[3]));
            i = stop + 1;
            continue;
        }
        const indent = endsInHead(held) ? UNDER_HEAD : INDENTED;
        if (!isDocument && indent.test(lines[i]) && !inList(held, lines[i])) {
            let stop = i;
            while (stop < lines.length && (indent.test(lines[stop]) || !lines[stop].trim())) stop += 1;
            while (stop > i && !lines[stop - 1].trim()) stop -= 1;
            const head = [];
            while (held.length && held[held.length - 1].trim() && HEAD.test(held[held.length - 1].trim())) head.unshift(held.pop());
            if (stop - i + head.length >= 2) {
                flush();
                out.push(block([...head, ...lines.slice(i, stop)].map(withoutChips), ""));
                i = stop;
                continue;
            }
            held.push(...head);
        }
        held.push(lines[i]);
        i += 1;
    }
    flush();
    return out.length > 1 || (out[0] && out[0].type === "html") ? out : null;
}

register((text, context) => lift(text, context.document), {first: true});
