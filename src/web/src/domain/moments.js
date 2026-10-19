import {meta} from "./tables.js";

// What starts a sequence by itself: a row of a kind being created, written as the journal keeps it, plan.created.
export const momentWord = () => "is created";

export function eventWords(event) {
    const [kind] = event.split(".");
    return `a ${(meta(`${kind}s`)?.title || kind).toLowerCase()} ${momentWord()}`;
}
