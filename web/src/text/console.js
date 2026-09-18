import {register} from "./index.js";

const HEAD =
    /(?:(?<![\w/])[\w.\/-]+\.[a-z]{1,4}:\d+\s+)?(?:Uncaught(?: \(in promise\))?\s+)?\b[A-Z][\w$]*(?:Error|Exception|Warning)\b:?\s/g;
const FRAME = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)/g;
const TRACEBACK = /^Traceback \(most recent call last\):/m;
const FOLD = 8;

function card(entries) {
    const rows = entries
        .map(
            (e) =>
                `<div class="console-entry"><div class="console-head">${e.head}</div>${e.frames.map((f) => `<div class="console-frame">${f}</div>`).join("")}</div>`
        )
        .join("");
    const shown =
        entries.length > 1 ? `<details class="console-more"><summary>Show all ${entries.length} errors</summary>${rows}</details>` : rows;
    const first =
        entries.length > 1
            ? `<div class="console-entry"><div class="console-head">${entries[0].head}</div>${entries[0].frames
                  .slice(0, FOLD)
                  .map((f) => `<div class="console-frame">${f}</div>`)
                  .join("")}</div>`
            : "";
    return `<div class="console-card"><span class="console-label">console</span>${entries.length > 1 ? first + shown : rows}</div>`;
}

function browser(text) {
    const heads = [...text.matchAll(HEAD)].map((m) => m.index);
    FRAME.lastIndex = 0;
    if (!heads.length || !FRAME.test(text)) return null;
    FRAME.lastIndex = 0;
    const entries = heads.map((at, i) => {
        const chunk = text.slice(at, i + 1 < heads.length ? heads[i + 1] : text.length).trim();
        const frames = [...chunk.matchAll(FRAME)];
        return {head: frames.length ? chunk.slice(0, frames[0].index).trim() : chunk, frames: frames.map((f) => f[0].trim())};
    });
    if (!entries.some((e) => e.frames.length)) return null;
    return {lead: text.slice(0, heads[0]), html: card(entries), tail: ""};
}

function python(text) {
    const m = TRACEBACK.exec(text);
    if (!m) return null;
    const lines = text.slice(m.index).split("\n");
    const got = [lines[0]];
    let j = 1;
    while (j < lines.length && lines[j].trim()) {
        got.push(lines[j]);
        j++;
        if (/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(got[got.length - 1])) break;
    }
    const entry = {head: got[got.length - 1], frames: got.slice(0, -1)};
    return {lead: text.slice(0, m.index), html: card([entry]), tail: lines.slice(j).join("\n")};
}

register((text) => {
    const found = python(text) || browser(text);
    if (!found) return null;
    return [
        {kind: "text", text: found.lead},
        {kind: "html", html: found.html},
        {kind: "text", text: found.tail},
    ];
});
