export function age(at) {
    if (!at) return "";
    const s = Math.max(0, Date.now() / 1000 - at);
    if (s < 60) return "now";
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}

export function ago(at) {
    const elapsed = age(at);
    return elapsed === "now" ? "just now" : elapsed && `${elapsed} ago`;
}

export function fresh(at, now) {
    const s = Math.max(0, now - at);
    if (s < 5) return "now";
    if (s < 60) return `${Math.floor(s)}s`;
    return age(at);
}

export function clock(at) {
    if (!at) return "";
    const d = new Date(at * 1000);
    const today = new Date().toDateString() === d.toDateString();
    const time = d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
    return today ? time : `${d.toLocaleDateString([], {day: "numeric", month: "short"})} ${time}`;
}

export function span(seconds, exact = false) {
    const s = Math.max(0, Math.floor(seconds || 0));
    if (s < 60) return `${s}s`;
    if (s < 3600) return exact ? `${Math.floor(s / 60)}m ${s % 60}s` : `${Math.floor(s / 60)}m`;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h < 24 ? `${h}h ${m}m` : `${Math.floor(h / 24)}d ${h % 24}h`;
}

export function stamp(at) {
    return at
        ? new Date(at * 1000).toLocaleString([], {month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"})
        : "";
}

const DAY = 86400;
const AGES = [
    {title: "Last 7 days", within: 7 * DAY},
    {title: "Last 30 days", within: 30 * DAY},
    {title: "Older", within: Infinity},
];

export function ageGroups(list, when) {
    const now = Date.now() / 1000;
    const groups = AGES.map((g) => ({title: g.title, list: []}));
    for (const item of list) groups[AGES.findIndex((g) => now - when(item) < g.within)].list.push(item);
    return groups.filter((g) => g.list.length);
}
