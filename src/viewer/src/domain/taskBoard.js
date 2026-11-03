import {GROUPS, groupOf} from "./records.js";
import {isClosed} from "./row.js";
export const STATUS_PREFIXES = {...GROUPS, done: "Completed"};
// Tasks in progress, the agent's and the workers', come first; a task with a worker is grouped by its own state, the worker marked beside it.
export const STATUS_ORDER = ["started", "testing", "blocked", "asked", "paused", "open", "planned", "done"];
export const statusOf = (task) => (isClosed(task) ? "done" : groupOf(task));

export function matches(task, words) {
    const q = words.trim().toLowerCase();
    return !q || String(task.id) === q || task.title.toLowerCase().includes(q) || (task.brief || "").toLowerCase().includes(q);
}

