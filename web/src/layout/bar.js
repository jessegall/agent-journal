import {stopwatch} from "../format/time.js";
export const TICK = 250;
export const MINUTE = 60;

export function shown(queue, state, now) {
    const held = queue.find((one) => one.at === state.at) || null;
    const later = queue.filter((one) => one.at > state.at);
    if (!held) {
        const first = later[0] || (state.at ? null : queue[0]);
        return first ? {at: first.at, since: now, message: first} : {at: state.at, since: state.since, message: null};
    }
    if (later.length && now - state.since >= (held.hold || 0)) return {at: later[0].at, since: now, message: later[0]};
    if (!later.length && held.done && now - state.since >= held.lingers) return {at: held.at, since: state.since, message: null};
    return {at: held.at, since: state.since, message: held};
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

export function clock(message) {
    return message && message.clock ? stopwatch(message.for) : "";
}

export function line(message, elapsed) {
    if (!message) return null;
    const parts = frames(message, elapsed).filter((part) => part.value !== "");
    return {
        key: message.key,
        parts,
        text: parts.map((p) => `${p.prefix}${p.value}`).join(" "),
        clock: clock(message),
        done: !!message.done,
    };
}
