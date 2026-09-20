const transformers = [];
const TAG = /^\s*(?:\*\*)?\[!(?:discovery|correction|blocked|info|reply)\](?:\*\*)?\s*/;

export function visible(text) {
    return String(text ?? "").replace(TAG, "");
}

export function register(fn) {
    transformers.push(fn);
}

export function escape(text) {
    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function transformed(text, context) {
    const blocks = [{kind: "text", text: escape(visible(text)).replace(/\r\n/g, "\n")}];
    for (const fn of transformers) {
        for (let i = blocks.length - 1; i >= 0; i--) {
            const b = blocks[i];
            if (b.kind !== "text") continue;
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

function table(lines) {
    const [head, , ...body] = lines;
    const th = cells(head)
        .map((c) => `<th>${spans(c)}</th>`)
        .join("");
    const rows = body
        .map(
            (r) =>
                `<tr>${cells(r)
                    .map((c) => `<td>${spans(c)}</td>`)
                    .join("")}</tr>`
        )
        .join("");
    return `<table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table>`;
}

function list(lines) {
    const ordered = /^\s*\d+[.)]\s/.test(lines[0]);
    const items = [];
    for (const line of lines) {
        const m = line.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
        if (m) items.push(m[2]);
        else if (items.length) items[items.length - 1] += ` ${line.trim()}`;
    }
    const tag = ordered ? "ol" : "ul";
    return `<${tag}>${items.map((i) => `<li>${spans(i)}</li>`).join("")}</${tag}>`;
}

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
        if (line.includes("|") && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || "")) {
            let end = i + 2;
            while (end < lines.length && lines[end].includes("|")) end += 1;
            out.push(table(lines.slice(i, end)));
            i = end;
            continue;
        }
        if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(line)) {
            let end = i + 1;
            while (end < lines.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(lines[end]) || /^\s{2,}\S/.test(lines[end]))) end += 1;
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
        while (end < lines.length && lines[end].trim() && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(lines[end]))
            end += 1;
        out.push(`<p>${spans(lines.slice(i, end).join("\n")).replace(/\n/g, "<br>")}</p>`);
        i = end;
    }
    return out.join("");
}

export function render(text, context = {types: [], env: ""}) {
    return transformed(text, context)
        .map((b) => (b.kind === "text" ? markdown(b.text) : b.html))
        .filter(Boolean)
        .join("");
}
