import {clock} from "../format/time.js";
import {words} from "../text/words.js";

const SECTIONS = [
    {key: "need", title: "Needs you", past: "Needed you"},
    {key: "done", title: "Done"},
    {key: "doing", title: "In progress"},
    {key: "plans", title: "Plans"},
    {key: "commits", title: "Commits"},
];
const COUNTED = [
    {key: "need", one: "need you", past: "needed you"},
    {key: "done", one: "done"},
    {key: "doing", one: "in progress"},
    {key: "commits", one: "commit", many: "commits"},
];

export const isUpdate = (r) => r?.data?.kind === "update";

export const updateLabel = (r) => `Update ${r.data.number || r.n}`;

const itemsOf = (r) => (r.data.items || []).map((i) => ({...i, title: words(i.title), note: words(i.note || "")}));

export const neighbour = (r, reports, step) =>
    reports.find((p) => isUpdate(p) && !p.deleted && p.data.number === r.data.number + step) || null;

export function updateCounts(r, past = false) {
    const items = itemsOf(r);
    return COUNTED.map((c) => ({...c, n: items.filter((i) => i.section === c.key).length}))
        .filter((c) => c.n)
        .map((c) => ({n: c.n, label: c.n > 1 && c.many ? c.many : past && c.past ? c.past : c.one}));
}

export const updateSpan = (r) => `${clock(r.data.since)} to ${clock(r.data.until)}`;

export function updateSections(r, past = false) {
    const items = itemsOf(r);
    return SECTIONS.map((s) => ({
        key: s.key,
        title: past && s.past ? s.past : s.title,
        items: items.filter((i) => i.section === s.key),
    })).filter((s) => s.items.length);
}

export const updateAlso = (r) => itemsOf(r).filter((i) => i.section === "also");

export function carriedOver(r, reports) {
    const before = reports.find((p) => isUpdate(p) && !p.deleted && p.data.number === r.data.number - 1);
    return new Set(before ? (before.data.items || []).filter((i) => i.section !== "also").map((i) => i.ref) : []);
}

export const refLabel = (ref) => (ref.startsWith("commit:") ? ref.slice(7, 14) : ref.replace(/^todo:/, "to-do ").replace(":", " "));

export const commitHref = (ref, env) => (ref.startsWith("commit:") ? `#/${env}/commit/${ref.slice(7)}` : "");
