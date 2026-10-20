import {ago} from "../format/time.js";

// where each agent stands in a workflow, as its nodes say it
export function waitingAt(standing, nodeId) {
    return (standing?.agents || []).filter((a) => a.waits && String(a.node) === String(nodeId));
}

export function waitingWords(standing, nodeId) {
    const waiting = waitingAt(standing, nodeId).length;
    if (!waiting) return "";
    return waiting === 1 ? "Waiting here" : `${waiting} agents waiting here`;
}

// a value the workflow keeps in the environment shown, by its name: a count or a time
export function valueNamed(standing, name) {
    return (standing?.values || []).find((v) => v.name === name) || null;
}

// a value read as words: a count's number, or how long ago a time was noted
export function valueWords(value) {
    if (value.kind === "count") return `${value.name.replaceAll("_", " ")} ${value.value}`;
    const minutes = Math.floor(value.value / 60);
    return `${value.name.replaceAll("_", " ")} noted ${minutes < 1 ? "under a minute" : `${minutes} min`} ago`;
}

// a count check's text is the count's name, then its number or a setting's name
export function countWords(standing, node) {
    const [name, limit] = (node.text || "").trim().split(/\s+/);
    const value = name ? valueNamed(standing, name) : null;
    if (!value || value.kind !== "count") return "";
    const number = standing?.limits?.[String(node.id)]?.number ?? (/^\d+$/.test(limit || "") ? limit : null);
    return number ? `${valueWords(value)} of ${number}` : valueWords(value);
}

// the value a step sets or asks about, as it stands, with when it was last set and by which steps
export function valueLines(standing, node) {
    const name = (node.text || "").trim().split(/\s+/)[0];
    const value = name ? valueNamed(standing, name) : null;
    if (!value) return [];
    const by = value.set_by.length ? `, by step ${value.set_by.join(" or ")}` : "";
    return [{label: "Value now", words: `${valueWords(value)}${value.set_at ? `, last set ${ago(value.set_at)}${by}` : by}`}];
}

export function standingLines(standing, nodeId) {
    return waitingAt(standing, nodeId).map((a) => ({label: `Agent ${a.n}`, words: "waits here"}));
}

// the number a count check compares with, and the setting it comes from when it names one
export function limitOf(standing, node) {
    return standing?.limits?.[String(node.id)] || null;
}
