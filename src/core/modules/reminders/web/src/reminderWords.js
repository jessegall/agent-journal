import {optionsOf} from "@journal/window-kit";

// what a reminder says about itself in short words: how it repeats, when it comes next, whether it holds the agent and the kinds a filter picks from
const MINUTE = 60;
const HOUR = 3600;
const REPEATS = [["minutes", "Minutes"], ["tool_uses", "Tool uses"], ["tasks", "Closed tasks"], ["once", "Once"]];

function every(seconds) {
    if (seconds % HOUR === 0) return `Every ${seconds / HOUR} h`;
    return `Every ${Math.max(1, Math.round(seconds / MINUTE))} min`;
}

// the kinds of repeat a reminder has, as the Repeats filter names them
function repeatKinds(row) {
    const kinds = [];
    if (row.interval_seconds) kinds.push("minutes");
    if (row.interval_tool_uses) kinds.push("tool_uses");
    if (row.interval_tasks) kinds.push("tasks");
    if (row.single_use || row.due_at) kinds.push("once");
    return kinds;
}

export function repeatWords(row) {
    const words = [];
    if (row.interval_seconds) words.push(every(row.interval_seconds));
    if (row.interval_tool_uses) words.push(`Every ${row.interval_tool_uses} tool uses`);
    if (row.interval_tasks) words.push(row.interval_tasks === 1 ? "Each closed task" : `Every ${row.interval_tasks} closed tasks`);
    if (row.single_use || row.due_at) words.push("Once");
    return words.join(" · ") || "Never";
}

const sameDay = (first, second) => first.toDateString() === second.toDateString();

// a time as 14:30 today, and with its date on another day
export function clock(text, now = new Date()) {
    const at = new Date(text);
    const time = at.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
    return sameDay(at, now) ? time : `${at.toLocaleDateString([], {day: "numeric", month: "short"})} ${time}`;
}

// when it comes next: a set time, the end of the interval of minutes, how many tool uses are left to count; a reminder that counts closed tasks has no time
export function nextWords(row, now = new Date()) {
    if (row.ended_at) return "";
    if (row.due_at) return clock(row.due_at, now);
    if (row.interval_seconds) {
        const since = row.last_fired_at ?? row.created_at;
        return since ? clock(new Date(new Date(since).getTime() + row.interval_seconds * 1000), now) : "";
    }
    return row.interval_tool_uses ? `in ${row.interval_tool_uses} tool uses` : "";
}

export const holdsAgent = (row) => Boolean(row.block_condition);

export function holdWords(row) {
    if (!row.block_condition) return "No";
    return row.block_subject ? `Until ${row.block_condition}: ${row.block_subject}` : `Until ${row.block_condition}`;
}

// a reminder is told to the main agent, so that is the agent every row names
export const AGENT = "main agent";

export const reminderFilters = (rows) => [
    {key: "agent", label: "Agent", options: optionsOf(rows, () => AGENT), get: () => AGENT},
    {key: "repeats", label: "Repeats", options: REPEATS, get: repeatKinds},
    {key: "holds", label: "Holds", options: [["holds", "Holds the agent"], ["free", "Does not hold"]], get: (row) => (holdsAgent(row) ? "holds" : "free")},
];
