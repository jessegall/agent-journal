import {span} from "../format/time.js";

const pad = (m) => `:${String(m).padStart(2, "0")}`;

export const loopRows = (loops) =>
    Object.entries(loops || {})
        .map(([id, loop]) => ({id, ...loop}))
        .sort((a, b) => (a.at || 0) - (b.at || 0));

export function loopWhen(schedule) {
    const [minute, hour, day, month, week] = (schedule || "").trim().split(/\s+/);
    if ([hour, day, month, week].some((part) => part !== "*")) return schedule;
    if (/^\*\/\d+$/.test(minute)) return `every ${minute.slice(2)} minutes`;
    if (minute === "*") return "every minute";
    if (/^\d+(,\d+)*$/.test(minute)) return `each hour at ${minute.split(",").map(pad).join(", ")}`;
    return schedule;
}

export const loopSet = (at) => (at ? `set ${span(Date.now() / 1000 - at)} ago` : "");
