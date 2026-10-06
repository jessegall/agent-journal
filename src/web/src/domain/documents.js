import {choiceGroups} from "./buttons.js";

const REPLACED = /^(?:superseded|replaced) by (?:\[\[chip doc:(\d+)[^\]]*\]\]|doc (\d+))[.,;]?/i;
const PLAIN_FINAL = ["", "final"];

export function standing(doc) {
    const outcome = (doc.outcome || "").trim();
    const by = outcome.match(REPLACED);
    if (by) {
        const n = Number(by[1] || by[2]);
        return {key: "replaced", label: `Replaced by doc ${n}`, by: n, hint: `Doc ${n} is the newer version`, said: outcome === by[0]};
    }
    const groups = choiceGroups(doc);
    if (doc.data.answered_own) return {key: "answered", label: "Answered, final now", by: 0, hint: "Your answer was sent", said: true};
    const pending = groups.filter((group) => !group.chosen);
    if (pending.length) {
        const approval = pending.some((group) =>
            /approv/i.test(`${group.choice} ${group.ask} ${group.buttons.map((button) => button.label).join(" ")}`)
        );
        return {
            key: approval ? "approve" : "answer",
            label: approval ? "Your approval is needed" : "Your answer is needed",
            hint: approval ? "Choose whether to approve this document" : "Choose an answer to continue",
            said: true,
        };
    }
    if (groups.length && groups.every((group) => group.chosen))
        return {key: "answered", label: "Answered, final now", by: 0, hint: "Your answer was sent", said: true};
    if (doc.completed || doc.data.status === "final" || !doc.data.status)
        return {
            key: "final",
            label: "Final",
            by: 0,
            hint: "Marked finished by its author",
            said: PLAIN_FINAL.includes(outcome.toLowerCase()),
        };
    return {key: "writing", label: "Still being written", by: 0, hint: "This document is still being written", said: true};
}

export const searchTerms = (query) => query.toLowerCase().split(/\s+/).filter(Boolean);

const has = (text, all) => all.some((w) => (text || "").toLowerCase().includes(w));
const WEIGHTS = {title: 8, number: 8, abstract: 3, brief: 2, section: 1, file: 1};
const AROUND = 70;

const plain = (text) =>
    text
        .replace(/\[\[\w+ [^|\]]*\|([^\]]*)\]\]/g, "$1")
        .replace(/\[\[\w+ ([^\]]*)\]\]/g, "$1")
        .replace(/[*`]+/g, "")
        .replace(/\s+/g, " ");

function excerpt(text, all) {
    const flat = plain(text);
    const at = Math.min(...all.map((w) => flat.toLowerCase().indexOf(w)).filter((i) => i >= 0));
    if (!Number.isFinite(at)) return "";
    const from = Math.max(0, at - AROUND);
    return `${from ? "…" : ""}${flat.slice(from, at + AROUND * 2).trim()}${at + AROUND * 2 < flat.length ? "…" : ""}`;
}

export function found(doc, all) {
    const files = Object.entries(doc.data.files || {});
    const places = [
        ["title", doc.title],
        ["abstract", doc.abstract],
        ["brief", doc.brief],
        ...doc.sections.map((s) => ["section", `${s.title}\n${s.body}`]),
        ...files.map(([name, about]) => ["file", `${name} ${about || ""}`]),
        ["number", `doc ${doc.n}`],
    ];
    const haystack = places
        .map(([, text]) => text || "")
        .join("\n")
        .toLowerCase();
    if (!all.every((w) => haystack.includes(w))) return null;
    const score = places.reduce((sum, [where, text]) => sum + (has(text, all) ? WEIGHTS[where] : 0), 0);
    if (has(doc.title, all) || has(doc.abstract, all)) return {score, where: "", text: ""};
    const section = doc.sections.find((s) => has(`${s.title}\n${s.body}`, all));
    if (section) return {score, where: section.title, text: excerpt(has(section.body, all) ? section.body : section.title, all)};
    const file = files.find(([name, about]) => has(`${name} ${about || ""}`, all));
    if (file) return {score, where: "Attached file", text: file[0]};
    return {score, where: "", text: excerpt(doc.brief || "", all)};
}
