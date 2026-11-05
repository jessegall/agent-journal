import "./table.css";

const transformers = [];
// the renders kept, newest last, each with the rows it read, so a text drawn again is scanned once until one of them changes
const RENDERS_KEPT = 2000;
const renders = new Map();
// a web address written bare in a bubble, outside a link already made: its closing punctuation stays text
const BARE_ADDRESS = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g;
// the code and the links a text already holds, kept as they are when bare addresses are linked
const MADE_PARTS = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;

export function register(fn, {first = false} = {}) {
    if (first) transformers.unshift(fn);
    else transformers.push(fn);
    renders.clear();
}

// a row a transformer shows, read through the render so a kept render is drawn again once the store holds a new copy of it
export function rowOf(context, table, id) {
    const row = context.row?.(table, id);
    context.reads?.push({table, id, row});
    return row;
}

const isCurrent = (read, context) => context.row?.(read.table, read.id) === read.row;

const renderKey = (text, context) => [context.env ?? "", context.inline ? "inline" : "block", context.rowNames === false ? "plain" : "names", context.document ? "document" : "note", text].join("\u0000");

export function escape(text) {
    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function transformed(text, context) {
    const blocks = [{type: "text", text: escape(text).replace(/\r\n/g, "\n")}];
    for (const fn of transformers) {
        for (let i = blocks.length - 1; i >= 0; i--) {
            const b = blocks[i];
            if (b.type !== "text") continue;
            const made = fn(b.text, context);
            if (typeof made === "string") b.text = made;
            else if (made) blocks.splice(i, 1, ...made);
        }
    }
    return blocks;
}

function spans(text) {
    const codes = [];
    const held = text.replace(/`([^`\n]+)`/g, (whole, code) => `\u0000${codes.push(`<code>${code}</code>`) - 1}\u0000`);
    const html = held
        .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
        .replace(/~~([^~\n]+)~~/g, "<del>$1</del>")
        .replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>")
        .replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>")
        .replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return addressesLinked(html).replace(/\u0000(\d+)\u0000/g, (whole, i) => codes[Number(i)]);
}

// bare web addresses linked in the text between the code and the links already made, which keep theirs as written
function addressesLinked(html) {
    return html
        .split(MADE_PARTS)
        .map((part, i) => (i % 2 ? part : part.replace(BARE_ADDRESS, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')))
        .join("");
}

function cells(row) {
    return row
        .trim()
        .replace(/^\||\|$/g, "")
        .split(/(?<!\\)\|/)
        .map((c) => c.replace(/\\\|/g, "|").trim());
}

// a column with a cell longer than this holds sentences, and is given a readable width
const TEXT_COLUMN_CHARACTERS = 24;

function table(lines) {
    const [head, , ...body] = lines;
    const headCells = cells(head);
    const bodyRows = body.map(cells);
    const type = (column) => ([headCells, ...bodyRows].some((row) => (row[column] ?? "").length > TEXT_COLUMN_CHARACTERS) ? ' class="text-column"' : "");
    const th = headCells.map((c, column) => `<th${type(column)}>${spans(c)}</th>`).join("");
    const rows = bodyRows.map((row) => `<tr>${row.map((c, column) => `<td${type(column)}>${spans(c)}</td>`).join("")}</tr>`).join("");
    return `<table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table>`;
}

const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/;
const NUMBERED_ITEM = /^\s*(\d+)[.)]\s/;

const indentOf = (line) => line.match(/^\s*/)[0].length;

// an item indented past the list's first item, and what runs on from it, is a list of its own inside the item above it
function list(lines) {
    const number = lines[0].match(NUMBERED_ITEM);
    const depth = indentOf(lines[0]);
    const items = [];
    for (const line of lines) {
        const m = line.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
        const last = items[items.length - 1];
        if (m && indentOf(line) <= depth) items.push({text: m[2], nested: []});
        else if (last && line.trim() && (m || last.nested.length)) last.nested.push(line);
        else if (last && line.trim()) last.text += ` ${line.trim()}`;
    }
    const opening = number ? `<ol${number[1] === "1" ? "" : ` start="${number[1]}"`}>` : "<ul>";
    return `${opening}${items.map((i) => `<li>${spans(i.text)}${i.nested.length ? list(i.nested) : ""}</li>`).join("")}</${number ? "ol" : "ul"}>`;
}

// A blank line between two items of one type stays inside the list, so a numbered list keeps counting.
function listEnd(lines, start) {
    const numbered = NUMBERED_ITEM.test(lines[start]);
    let end = start + 1;
    for (let next = end; next < lines.length; next += 1) {
        const isItem = LIST_ITEM.test(lines[next]) && NUMBERED_ITEM.test(lines[next]) === numbered;
        if (isItem || (next === end && /^\s{2,}\S/.test(lines[next]))) end = next + 1;
        else if (lines[next].trim()) break;
    }
    return end;
}

const opensTable = (lines, i) => lines[i].includes("|") && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || "");

function markdown(text) {
    const lines = String(text || "")
        .replace(/\r\n/g, "\n")
        .split("\n");
    const out = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) {
            i += 1;
            continue;
        }
        if (/^(```|~~~)/.test(line)) {
            const end = lines.findIndex((l, k) => k > i && /^(```|~~~)/.test(l));
            const stop = end < 0 ? lines.length : end;
            out.push(`<pre><code>${lines.slice(i + 1, stop).join("\n")}</code></pre>`);
            i = stop + 1;
            continue;
        }
        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            const level = Math.min(6, heading[1].length + 2);
            out.push(`<h${level}>${spans(heading[2])}</h${level}>`);
            i += 1;
            continue;
        }
        if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
            out.push("<hr>");
            i += 1;
            continue;
        }
        if (opensTable(lines, i)) {
            let end = i + 2;
            while (end < lines.length && lines[end].includes("|")) end += 1;
            out.push(table(lines.slice(i, end)));
            i = end;
            continue;
        }
        if (LIST_ITEM.test(line)) {
            const end = listEnd(lines, i);
            out.push(list(lines.slice(i, end)));
            i = end;
            continue;
        }
        if (/^(?:>|&gt;)\s?/.test(line)) {
            let end = i;
            while (end < lines.length && /^(?:>|&gt;)\s?/.test(lines[end])) end += 1;
            out.push(
                `<blockquote>${markdown(
                    lines
                        .slice(i, end)
                        .map((l) => l.replace(/^(?:>|&gt;)\s?/, ""))
                        .join("\n")
                )}</blockquote>`
            );
            i = end;
            continue;
        }
        let end = i;
        while (
            end < lines.length &&
            lines[end].trim() &&
            !opensTable(lines, end) &&
            !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(lines[end])
        )
            end += 1;
        out.push(`<p>${spans(lines.slice(i, end).join("\n")).replace(/\n/g, "<br>")}</p>`);
        i = end;
    }
    return out.join("");
}

// an html piece a transformer made that sits inside a line, such as a row's chip or a link, and not a block of its own
const BLOCK_HTML = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i;
const isInline = (block) => block.type !== "text" && !BLOCK_HTML.test(block.html);

// the pieces laid out as markdown: inline pieces stay in their text as numbered marks while the markdown is laid out, so a table or a
// list holding a chip keeps its shape, and are put back after; a block piece stands between the texts around it
function laidOut(blocks) {
    const inline = [];
    const out = [];
    let text = "";
    const flush = () => {
        if (text) out.push(markdown(text).replace(/\u0001(\d+)\u0001/g, (whole, i) => inline[Number(i)]));
        text = "";
    };
    for (const block of blocks) {
        if (block.type === "text") text += block.text;
        else if (isInline(block)) text += `\u0001${inline.push(block.html) - 1}\u0001`;
        else {
            flush();
            out.push(block.html);
        }
    }
    flush();
    return out.filter(Boolean).join("");
}

export function render(text, context = {env: ""}) {
    const key = renderKey(text, context);
    const kept = renders.get(key);
    renders.delete(key);
    if (kept && kept.source === context.source && kept.reads.every((read) => isCurrent(read, context))) {
        renders.set(key, kept);
        return kept.html;
    }
    const reads = [];
    const html = laidOut(transformed(text, {...context, reads}));
    renders.set(key, {html, reads, source: context.source});
    if (renders.size > RENDERS_KEPT) renders.delete(renders.keys().next().value);
    return html;
}
