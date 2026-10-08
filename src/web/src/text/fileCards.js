import {escape, register} from "./index.js";
import {api} from "../api/client.js";
import {isPicture} from "../format/files.js";
import {rows} from "../sync/rows.js";
import "./cards.css";

const ATTACHMENT = /^([A-Za-z][\w-]*) #?(\d+) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m;
const PATH = /^(\/[\w .()/-]+\.[A-Za-z0-9]{1,8})$/m;

function attachment(text, context) {
    const found = ATTACHMENT.exec(text);
    const kind = found && context.types.find((t) => [t.name, t.title.toLowerCase()].includes(found[1].toLowerCase()));
    const row = kind && rows(kind.name).find((r) => r.n === Number(found[2]));
    if (!row || !(((row.data || {}).files || {})[found[3]] !== undefined)) return null;
    const name = found[3];
    const url = api.in(context.env).fileUrl(kind.name, row.n, name);
    const label = `${kind.title} ${row.n} · ${escape(name)}`;
    const picture = isPicture(name) ? `<img class="file-card-image" src="${url}" alt="${escape(name)}">` : "";
    return {at: found.index, length: found[0].length, html: `<a class="file-card" href="${url}" target="_blank" rel="noopener">${picture}<span class="file-card-name">${label}</span></a>`};
}

function path(text) {
    const found = PATH.exec(text);
    if (!found) return null;
    const name = found[1].split("/").pop();
    return {at: found.index, length: found[0].length, html: `<a class="file-card" href="#" data-file="${found[1]}"><span class="file-card-name">${escape(name)}</span><span class="file-card-line">${found[1]}</span></a>`};
}

register(
    (text, context) => {
        const found = attachment(text, context) || path(text);
        if (!found) return null;
        return [
            {kind: "text", text: text.slice(0, found.at)},
            {kind: "html", html: found.html},
            {kind: "text", text: text.slice(found.at + found.length)},
        ];
    },
    {first: true}
);
