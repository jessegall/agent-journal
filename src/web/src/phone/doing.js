import {kindWord} from "./kinds.js";

const VERBS = {
    journalling: "Writing",
    sectioning: "Writing",
    writing: "Writing",
    editing: "Editing",
    reading: "Reading",
    searching: "Searching",
    running: "Running",
    testing: "Testing",
    thinking: "Thinking",
    planning: "Planning",
    reviewing: "Reviewing",
    committing: "Committing",
};
const ROW = /\b(report|doc|plan|todo|question|work|message)\s+(\d+)\b/;

export function plainDoing(text) {
    const words = String(text || "").trim();
    if (!words) return "";
    const verb = VERBS[words.split(/\s+/)[0].replace(/\W+$/, "").toLowerCase()];
    const row = words.match(ROW);
    if (verb && row) return `${verb} ${kindWord(row[1])} ${row[2]}`;
    if (verb) return verb;
    return "Working";
}

export const counted = (count, one, many) => `${count} ${count === 1 ? one : many}`;
