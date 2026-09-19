import {escape, inline} from "./index.js";

function spans(text, context) {
    const codes = [];
    const held = text.replace(/`([^`\n]+)`/g, (whole, code) => `\u0000${codes.push(`<code>${escape(code)}</code>`) - 1}\u0000`);
    let html = inline(held, context)
        .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
        .replace(/(^|[\s(])_([^_\n]+)_/g, "$1<em>$2</em>")
        .replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return html.replace(/\u0000(\d+)\u0000/g, (whole, i) => codes[Number(i)]);
}

function cells(row) {
    return row
        .trim()
        .replace(/^\||\|$/g, "")
        .split(/(?<!\\)\|/)
        .map((c) => c.replace(/\\\|/g, "|").trim());
}

function table(lines, context) {
    const [head, , ...body] = lines;
    const th = cells(head)
        .map((c) => `<th>${spans(c, context)}</th>`)
        .join("");
    const rows = body
        .map(
            (r) =>
                `<tr>${cells(r)
                    .map((c) => `<td>${spans(c, context)}</td>`)
                    .join("")}</tr>`
        )
        .join("");
    return `<table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table>`;
}

function list(lines, context) {
    const ordered = /^\s*\d+[.)]\s/.test(lines[0]);
    const items = [];
    for (const line of lines) {
        const m = line.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
        if (m) items.push(m[2]);
        else if (items.length) items[items.length - 1] += ` ${line.trim()}`;
    }
    const tag = ordered ? "ol" : "ul";
    return `<${tag}>${items.map((i) => `<li>${spans(i, context)}</li>`).join("")}</${tag}>`;
}

export function markdown(text, context) {
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
            out.push(`<pre><code>${escape(lines.slice(i + 1, stop).join("\n"))}</code></pre>`);
            i = stop + 1;
            continue;
        }
        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            const level = Math.min(6, heading[1].length + 2);
            out.push(`<h${level}>${spans(heading[2], context)}</h${level}>`);
            i += 1;
            continue;
        }
        if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
            out.push("<hr>");
            i += 1;
            continue;
        }
        if (line.includes("|") && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || "")) {
            let end = i + 2;
            while (end < lines.length && lines[end].includes("|")) end += 1;
            out.push(table(lines.slice(i, end), context));
            i = end;
            continue;
        }
        if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(line)) {
            let end = i + 1;
            while (end < lines.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(lines[end]) || /^\s{2,}\S/.test(lines[end]))) end += 1;
            out.push(list(lines.slice(i, end), context));
            i = end;
            continue;
        }
        if (/^>\s?/.test(line)) {
            let end = i;
            while (end < lines.length && /^>\s?/.test(lines[end])) end += 1;
            out.push(
                `<blockquote>${markdown(
                    lines
                        .slice(i, end)
                        .map((l) => l.replace(/^>\s?/, ""))
                        .join("\n"),
                    context
                )}</blockquote>`
            );
            i = end;
            continue;
        }
        let end = i;
        while (end < lines.length && lines[end].trim() && !/^(#{1,6}\s|```|~~~|>\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(lines[end])) end += 1;
        out.push(`<p>${spans(lines.slice(i, end).join("\n"), context).replace(/\n/g, "<br>")}</p>`);
        i = end;
    }
    return out.join("");
}
