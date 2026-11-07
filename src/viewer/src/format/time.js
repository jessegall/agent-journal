// at is epoch seconds or a row's ISO time
export function age(at, nowMilliseconds = Date.now()) {
    if (!at) return "";
    const seconds = typeof at === "string" ? Date.parse(at) / 1000 : at;
    const s = Math.max(0, nowMilliseconds / 1000 - seconds);
    if (s < 60) return "now";
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}

export function ago(at, nowMilliseconds = Date.now()) {
    const elapsed = age(at, nowMilliseconds);
    return elapsed === "now" ? "just now" : elapsed && `${elapsed} ago`;
}

const MILLISECONDS_PER_HOUR = 3600000;

// how many tasks were completed in each hour from the start to the end, or to now while it has not ended; 0 when none were or no time passed
export function perHour(completed, startedAt, finishedAt, nowMilliseconds = Date.now()) {
    const hours = ((finishedAt ? Date.parse(finishedAt) : nowMilliseconds) - Date.parse(startedAt)) / MILLISECONDS_PER_HOUR;
    return hours > 0 && completed ? Math.round(completed / hours) : 0;
}

// a row's ISO time as a person reads a date: 3 Nov 2026, 12:19
export function dated(at) {
    return at ? new Date(at).toLocaleString([], {day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false}) : "";
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

const two = (n) => String(n).padStart(2, "0");

export function elapsed(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m ${two(s % 60)}s`;
    return `${Math.floor(s / 3600)}h ${two(Math.floor((s % 3600) / 60))}m ${two(s % 60)}s`;
}


