import {escape} from "./index.js";

const C_KEYWORDS =
    "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select";
const PY_KEYWORDS =
    "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case";
const PHP_KEYWORDS = `${C_KEYWORDS} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`;
const SH_KEYWORDS =
    "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false";
const SQL_KEYWORDS =
    "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in";

const LANGUAGES = {
    js: {keywords: C_KEYWORDS, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"]},
    py: {keywords: PY_KEYWORDS, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"]},
    php: {keywords: PHP_KEYWORDS, line: "//", hash: true, block: ["/*", "*/"], quotes: ['"', "'"]},
    c: {keywords: C_KEYWORDS, line: "//", block: ["/*", "*/"], quotes: ['"', "'"]},
    sh: {keywords: SH_KEYWORDS, line: "#", quotes: ['"', "'"]},
    css: {keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: true},
    html: {keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: true},
    json: {keywords: "true false null", quotes: ['"'], keyed: true},
    yaml: {keywords: "true false null yes no", line: "#", quotes: ['"', "'"]},
    sql: {keywords: SQL_KEYWORDS, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: true},
    md: {keywords: "", quotes: [], markdown: true},
    text: {keywords: "", quotes: []},
};

// the names a fence or a file gives a language, for each language the table above knows
const ALIASES = {
    javascript: "js", mjs: "js", cjs: "js", ts: "js", typescript: "js", tsx: "js", jsx: "js", vue: "html",
    python: "py", cpp: "c", cc: "c", h: "c", hpp: "c", cs: "c", csharp: "c", java: "c", kt: "c", kotlin: "c", go: "c", golang: "c", rs: "c", rust: "c", swift: "c", scala: "c", dart: "c",
    bash: "sh", shell: "sh", zsh: "sh", fish: "sh", scss: "css", less: "css", htm: "html", xml: "html", yml: "yaml", markdown: "md",
};

function startsAt(text, i, mark) {
    return mark && text.startsWith(mark, i);
}

function tokenize(text, lang) {
    const spec = LANGUAGES[ALIASES[lang] ?? lang] || LANGUAGES.text;
    const keywords = new Set(spec.keywords.split(" ").filter(Boolean));
    const out = [];
    let i = 0;
    const push = (type, value) => value && out.push({type, value});
    while (i < text.length) {
        const c = text[i];
        if (spec.markdown) {
            const end = text.indexOf("\n", i);
            const line = text.slice(i, end < 0 ? text.length : end);
            push(
                /^#{1,6}\s/.test(line)
                    ? "keyword"
                    : /^(```|~~~)/.test(line)
                      ? "comment"
                      : /^\s*([-*+]|\d+\.)\s/.test(line)
                        ? "number"
                        : "plain",
                line
            );
            push("plain", end < 0 ? "" : "\n");
            i = end < 0 ? text.length : end + 1;
            continue;
        }
        if (startsAt(text, i, spec.line) || (spec.hash && c === "#")) {
            const end = text.indexOf("\n", i);
            push("comment", text.slice(i, end < 0 ? text.length : end));
            i = end < 0 ? text.length : end;
            continue;
        }
        if (spec.block && startsAt(text, i, spec.block[0])) {
            const end = text.indexOf(spec.block[1], i + spec.block[0].length);
            const stop = end < 0 ? text.length : end + spec.block[1].length;
            push("comment", text.slice(i, stop));
            i = stop;
            continue;
        }
        const triple = (spec.triple || []).find((q) => text.startsWith(q, i));
        if (triple) {
            const end = text.indexOf(triple, i + 3);
            const stop = end < 0 ? text.length : end + 3;
            push("string", text.slice(i, stop));
            i = stop;
            continue;
        }
        if (spec.quotes.includes(c)) {
            let j = i + 1;
            while (j < text.length && text[j] !== c && (c === "`" || text[j] !== "\n")) j += text[j] === "\\" ? 2 : 1;
            push(spec.keyed && /^\s*:/.test(text.slice(j + 1)) ? "property" : "string", text.slice(i, j + 1));
            i = j + 1;
            continue;
        }
        if (spec.tags && c === "<" && /[A-Za-z/!?]/.test(text[i + 1] || "")) {
            const m = text.slice(i).match(/^<\/?[\w:-]+/);
            push("keyword", m[0]);
            i += m[0].length;
            continue;
        }
        if (/[A-Za-z_$]/.test(c)) {
            const m = text.slice(i).match(/^[\w$]+/);
            const word = m[0];
            const key = spec.lower ? word.toLowerCase() : word;
            const property = spec.property && /^\s*:/.test(text.slice(i + word.length));
            push(keywords.has(key) ? "keyword" : property ? "property" : /^[A-Z]/.test(word) && lang !== "text" ? "type" : "plain", word);
            i += word.length;
            continue;
        }
        if (/\d/.test(c)) {
            const m = text.slice(i).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
            push("number", m[0]);
            i += m[0].length;
            continue;
        }
        if (spec.tags && (c === ">" || text.startsWith("/>", i))) {
            const width = c === ">" ? 1 : 2;
            push("keyword", text.slice(i, i + width));
            i += width;
            continue;
        }
        push("plain", c);
        i += 1;
    }
    return out;
}

export function highlight(text, lang) {
    const lines = [""];
    for (const {type, value} of tokenize(text, lang)) {
        const parts = value.split("\n");
        parts.forEach((part, k) => {
            if (k) lines.push("");
            if (part) lines[lines.length - 1] += type === "plain" ? escape(part) : `<span class="tok-${type}">${escape(part)}</span>`;
        });
    }
    if (text.endsWith("\n")) lines.pop();
    return lines;
}
