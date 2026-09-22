import {highlight} from "./highlight.js";
import {words} from "./words.js";
import {register} from "./index.js";

const FENCE = /^(```|~~~)\s*(\w+)?\s*$/;
const INDENTED = /^\s{4,}\S/;
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

function block(lines, lang) {
    const code = highlight(unescape(lines.join("\n")), lang || guess(lines)).join("\n");
    return {kind: "html", html: `<pre class="chat-code"><code>${code}</code></pre>`};
}

function lift(text) {
    const lines = text.split("\n");
    const out = [];
    let held = [];
    const flush = () => {
        if (held.length) out.push({kind: "text", text: held.join("\n")});
        held = [];
    };
    let i = 0;
    while (i < lines.length) {
        const fence = lines[i].match(FENCE);
        if (fence) {
            const end = lines.findIndex((l, k) => k > i && l.trim().startsWith(fence[1]));
            const stop = end < 0 ? lines.length : end;
            flush();
            out.push(block(lines.slice(i + 1, stop).map(words), fence[2] ? fence[2].toLowerCase() : ""));
            i = stop + 1;
            continue;
        }
        if (INDENTED.test(lines[i])) {
            let stop = i;
            while (stop < lines.length && (INDENTED.test(lines[stop]) || !lines[stop].trim())) stop += 1;
            while (stop > i && !lines[stop - 1].trim()) stop -= 1;
            if (stop - i >= 2) {
                flush();
                out.push(block(lines.slice(i, stop).map(words), ""));
                i = stop;
                continue;
            }
        }
        held.push(lines[i]);
        i += 1;
    }
    flush();
    return out.length > 1 || (out[0] && out[0].kind === "html") ? out : null;
}

register((text) => lift(text));
