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
