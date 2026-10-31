import {span} from "../format/time.js";
export const TICK = 250;
const BEHIND = 3;

export function visibleQueue(queue, state, now) {
    const got = playable(queue, state, now);
    const running = queue.filter((one) => !one.done).at(-1);
    return got.message || !running ? got : {time: running.time, since: now, message: running};
}

// Where the line jumps to when it is too far behind: the newest item, or the first file of the roll the newest belongs
// to, so a command's changed files are always shown one by one.
function rollStart(later) {
    const newest = later.at(-1);
    return (newest.group && later.find((one) => one.group === newest.group)) || newest;
}

function playable(queue, state, now) {
    const held = queue.find((one) => one.time === state.time) || null;
    const later = queue.filter((one) => one.time > state.time);
    const next = later.length > BEHIND ? rollStart(later) : later[0];
    if (!held) {
        const first = next || (state.time ? null : queue.at(-1));
        return first ? {time: first.time, since: now, message: first} : {time: state.time, since: state.since, message: null};
    }
    if (next && now - state.since >= (held.hold || 0)) return {time: next.time, since: now, message: next};
    if (!later.length && held.done && now - state.since >= held.lingers) return {time: held.time, since: state.since, message: null};
    return {time: held.time, since: state.since, message: held};
}

export function frames(message, elapsed) {
    return ((message && message.parts) || []).map((part) => {
        const values = Array.isArray(part.value) ? part.value : [part.value];
        const step = Math.floor(elapsed / (part.duration || 1));
        const at = values.length > 1 ? Math.max(0, Math.min(step, values.length - 1)) : 0;
        return {
            values,
            at,
            value: values[at],
            color: part.color || "muted",
            prefix: part.prefix || "",
            increments: !!part.increments,
        };
    });
}

export const CLOCK_AFTER = 3;

export function queueClock(message, elapsed = 0) {
    const seconds = message && message.done ? message.for : elapsed;
    return message && message.clock && seconds >= CLOCK_AFTER ? span(seconds, true) : "";
}

export function line(message, elapsed) {
    if (!message) return null;
    const parts = frames(message, elapsed).filter((part) => part.value !== "");
    const still = parts.length > 1 ? parts.slice(0, -1) : parts;
    return {
        key: still.map((p) => p.value).join(" "),
        parts,
        text: parts.map((p) => `${p.prefix}${p.value}`).join(" "),
        clock: queueClock(message, elapsed),
        done: !!message.done,
    };
}
