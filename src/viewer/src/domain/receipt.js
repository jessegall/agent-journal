import {tableOfWord} from "./tables.js";
import {capitalised} from "../format/sentence.js";

// The receipt the journal writes under a user's message, as "Linked task 3, task 4 from your message", read back into its parts: what was done to the rows, linked, and the rows themselves
const PART = /^(\w+) (.+) from your message$/;

const rowOf = (named) => {
    const [word, n] = named.trim().split(" ");
    return {table: tableOfWord(word), id: Number(n), named: named.trim()};
};

export function receiptParts(text) {
    return String(text)
        .split("; ")
        .map((part) => part.match(PART))
        .filter(Boolean)
        .map(([, verb, rows]) => ({verb: verb.toLowerCase(), rows: rows.split(", ").map(rowOf)}));
}

export const receiptCount = (parts) => parts.reduce((sum, part) => sum + part.rows.length, 0);

const nounOf = (parts) => (parts.every((part) => part.rows.every((row) => row.table === "tasks")) ? "tasks" : "rows");

// the line in its short form, its rows as chips: "Linked: task 3 task 4"
export const receiptLine = (parts) =>
    parts.map((part, i) => `${i ? part.verb : capitalised(part.verb)}: ${part.rows.map((row) => row.named).join(" ")}`).join(" · ");

// the line once it holds too many rows for chips, as a count: "4 tasks created from your message", "10 linked tasks", or "10 tasks from
// your message: 3 created, 7 linked"
export function receiptWords(parts) {
    const noun = nounOf(parts);
    const count = receiptCount(parts);
    if (parts.length > 1)
        return `${count} ${noun} from your message: ${parts.map((part) => `${part.rows.length} ${part.verb}`).join(", ")}`;
    if (parts[0].verb === "linked") return `${count} linked ${noun}`;
    return `${count} ${noun} ${parts[0].verb} from your message`;
}

// the label above each part in the list the count opens
export const partLabel = (part) => `${capitalised(part.verb)}: tied to your message`;
