import {escape, register} from "./index.js";
import {rows} from "../sync/rows.js";
import {words} from "./words.js";
import {age} from "../format/time.js";
import {isUpdate, updateCounts, updateLabel} from "../domain/updates.js";
import "./cards.css";

const MARKED = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m;
const PLAIN = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;

function alone(text, context) {
    const marked = MARKED.exec(text);
    if (marked) return {at: marked.index, length: marked[0].length, type: marked[1], n: Number(marked[2]), label: marked[3]};
    const plain = PLAIN.exec(text);
    const kind = plain && context.types.find((t) => [t.name, t.title.toLowerCase()].includes(plain[1].toLowerCase()));
    return kind ? {at: plain.index, length: plain[0].length, type: kind.name, n: Number(plain[2]), label: plain[0]} : null;
}

function updateCard(row, standalone = false) {
    const facts = updateCounts(row)
        .map((c) => `${c.n} ${escape(c.label)}`)
        .join(" · ");
    return `<a class="row-card update-card${standalone ? " standalone" : ""}" href="#" data-peek="report:${row.n}" data-update="${row.n}"><span class="update-card-head"><span>${escape(updateLabel(row))}</span><span>${escape(age(row.created))}</span></span><span class="row-card-title">${escape(words(row.title))}</span>${row.abstract ? `<span class="update-card-lead">${escape(words(row.abstract))}</span>` : ""}${facts ? `<span class="update-card-facts">${facts}</span>` : ""}</a>`;
}

function card(type, n, label, context) {
    const row = rows(type).find((r) => r.n === n);
    if (isUpdate(row)) return updateCard(row);
    const kind = context.types.find((t) => t.name === type);
    const title = words(row ? row.title : label);
    const line = row ? words(row.abstract || String(row.brief || "").split("\n")[0]).slice(0, 160) : "";
    return `<a class="row-card" href="#" data-peek="${type}:${n}"><span class="row-card-kind">${escape(kind ? kind.title : type)} ${n}</span><span class="row-card-title">${escape(title)}</span>${line ? `<span class="row-card-line">${escape(line)}</span>` : ""}</a>`;
}

export function standaloneUpdates(text, context) {
    const cards = [];
    const kept = String(text || "")
        .split("\n")
        .filter((line) => {
            const found = alone(line.trim(), context);
            const row = found && rows(found.type).find((r) => r.n === found.n);
            if (!found || found.length !== line.trim().length || !isUpdate(row)) return true;
            cards.push(updateCard(row, true));
            return false;
        });
    return {text: kept.join("\n").trim(), cards};
}

register(
    (text, context) => {
        const found = alone(text, context);
        if (!found) return null;
        return [
            {kind: "text", text: text.slice(0, found.at)},
            {kind: "html", html: card(found.type, found.n, found.label, context)},
            {kind: "text", text: text.slice(found.at + found.length)},
        ];
    },
    {first: true}
);
