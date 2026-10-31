// A cron schedule of five fields, minute hour day month weekday, as the agent's own program reads it, in the local time.

const RANGES = [
    [0, 59],
    [0, 23],
    [1, 31],
    [1, 12],
    [0, 6],
];
const LOOK_AHEAD_MINUTES = 8 * 24 * 60;

function values(field, [low, high]) {
    const picked = new Set();
    for (const part of field.split(",")) {
        const [span, step = "1"] = part.split("/");
        const [from, to] = span === "*" ? [low, high] : span.includes("-") ? span.split("-").map(Number) : [Number(span), step === "1" ? Number(span) : high];
        for (let n = from; n <= to; n += Number(step)) picked.add(n);
    }
    return picked;
}

export function parsed(expression) {
    const fields = String(expression || "").trim().split(/\s+/);
    return fields.length === 5 ? fields.map((field, i) => values(field, RANGES[i])) : null;
}

/** When the schedule runs next after the moment given, to the minute, or null for one that runs in no minute ahead. */
export function nextRun(expression, from = new Date()) {
    const sets = parsed(expression);
    if (!sets) return null;
    const at = new Date(from);
    at.setSeconds(0, 0);
    for (let n = 0; n < LOOK_AHEAD_MINUTES; n++) {
        at.setMinutes(at.getMinutes() + 1);
        const fields = [at.getMinutes(), at.getHours(), at.getDate(), at.getMonth() + 1, at.getDay()];
        if (fields.every((value, i) => sets[i].has(value))) return new Date(at);
    }
    return null;
}

const pad = (n) => String(n).padStart(2, "0");

/** The schedule in plain words, for the forms an agent writes most: every so many minutes, hourly at given minutes, daily at a time. */
export function scheduleWords(expression) {
    const fields = String(expression || "").trim().split(/\s+/);
    if (fields.length !== 5) return expression || "";
    const [minute, hour, day, month, weekday] = fields;
    const everyDay = day === "*" && month === "*" && weekday === "*";
    if (everyDay && hour === "*" && minute.startsWith("*/")) return `every ${minute.slice(2)} minutes`;
    if (everyDay && hour === "*" && /^[\d,]+$/.test(minute)) return `every hour at ${minute.split(",").map((m) => `:${pad(m)}`).join(", ")}`;
    if (everyDay && /^\d+$/.test(hour) && /^\d+$/.test(minute)) return `every day at ${pad(hour)}:${pad(minute)}`;
    if (!everyDay && /^\d+$/.test(day) && /^\d+$/.test(month) && /^\d+$/.test(hour) && /^\d+$/.test(minute)) return `once, on ${day}/${month} at ${pad(hour)}:${pad(minute)}`;
    return expression;
}
