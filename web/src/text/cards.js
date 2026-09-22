import {escape, register} from "./index.js";
import {rows} from "../sync/rows.js";

const MARKED = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m;
const PLAIN = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;

function alone(text, context) {
    const marked = MARKED.exec(text);
    if (marked) return {at: marked.index, length: marked[0].length, type: marked[1], n: Number(marked[2]), label: marked[3]};
    const plain = PLAIN.exec(text);
    const kind = plain && context.types.find((t) => [t.name, t.title.toLowerCase()].includes(plain[1].toLowerCase()));
    return kind ? {at: plain.index, length: plain[0].length, type: kind.name, n: Number(plain[2]), label: plain[0]} : null;
}

function card(type, n, label, context) {
    const row = rows(type).find((r) => r.n === n);
    const kind = context.types.find((t) => t.name === type);
    const title = row ? row.title : label;
    const line = row
        ? row.abstract ||
          String(row.brief || "")
              .split("\n")[0]
              .slice(0, 160)
        : "";
    return `<a class="row-card" href="#" data-peek="${type}:${n}"><span class="row-card-kind">${escape(kind ? kind.title : type)} ${n}</span><span class="row-card-title">${escape(title)}</span>${line ? `<span class="row-card-line">${escape(line)}</span>` : ""}</a>`;
}

register((text, context) => {
    const found = alone(text, context);
    if (!found) return null;
    return [
        {kind: "text", text: text.slice(0, found.at)},
        {kind: "html", html: card(found.type, found.n, found.label, context)},
        {kind: "text", text: text.slice(found.at + found.length)},
    ];
}, {first: true});
