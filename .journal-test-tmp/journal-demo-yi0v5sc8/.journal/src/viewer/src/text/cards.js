import {withoutChips} from "./words.js";
import {escape, register, rowOf} from "./index.js";
import {meta, tableOfWord} from "../domain/tables.js";
import {titleOf} from "../domain/row.js";
import "./cards.css";

const MARKED = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m;
const PLAIN = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;

function alone(text) {
    const marked = MARKED.exec(text);
    if (marked && tableOfWord(marked[1])) return {at: marked.index, length: marked[0].length, table: tableOfWord(marked[1]), id: Number(marked[2]), label: marked[3]};
    const plain = PLAIN.exec(text);
    const table = plain && tableOfWord(plain[1]);
    return table ? {at: plain.index, length: plain[0].length, table, id: Number(plain[2]), label: plain[0]} : null;
}

function card(table, id, label, context) {
    const row = rowOf(context, table, id);
    const title = withoutChips(row ? titleOf(row) : label);
    return `<a class="row-card" href="#" data-peek="${table}:${id}"><span class="row-card-kind">${escape(meta(table).title)} ${id}</span><span class="row-card-title">${escape(title)}</span></a>`;
}

register(
    (text, context) => {
        const found = alone(text);
        if (!found) return null;
        return [
            {kind: "text", text: text.slice(0, found.at)},
            {kind: "html", html: card(found.table, found.id, found.label, context)},
            {kind: "text", text: text.slice(found.at + found.length)},
        ];
    },
    {first: true}
);
