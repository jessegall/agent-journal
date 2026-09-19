import {highlight} from "./highlight.js";
import {register} from "./index.js";

const FENCE = /^(```|~~~)\s*(\w+)?\s*$/;
const SIGNALS = [
    /^\s*(return|def|class|import|from|const|let|var|function|if|for|while|export|async|await|try|except|elif|else|public|private|static|fn|use|foreach|echo|SELECT|INSERT|UPDATE|DELETE)\b/,
    /[;{}]\s*$/,
    /=>|->|==|!=|<=|>=|\+=|-=|\|\||&&|::|\*\*/,
    /\w\(.*\)/,
    /\[\*|\(\*|\.\.\./,
    /^\s{4,}\S/,
    /^\$ \S/,
    /\w\.\w+\(/,
    /^\s*[\w.]+\s*=\s*\S/,
];
const PROSE = /^[A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+/;
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

function coded(line) {
    const plain = unescape(line);
    if (!plain.trim() || PROSE.test(plain.trim())) return 0;
    return SIGNALS.filter((s) => s.test(plain)).length;
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
            out.push(block(lines.slice(i + 1, stop), fence[2] ? fence[2].toLowerCase() : ""));
            i = stop + 1;
            continue;
        }
        let end = i;
        while (end < lines.length && coded(lines[end]) >= (end === i ? 2 : 1)) end += 1;
        const run = end - i;
        if (run >= 1 && (run >= 2 || coded(lines[i]) >= 3)) {
            flush();
            out.push(block(lines.slice(i, end), ""));
            i = end;
            continue;
        }
        held.push(lines[i]);
        i += 1;
    }
    flush();
    return out.length > 1 || (out[0] && out[0].kind === "html") ? out : null;
}

register((text) => lift(text));
