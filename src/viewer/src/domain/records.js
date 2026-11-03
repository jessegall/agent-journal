import {meta} from "./tables.js";
import {rows} from "../sync/rows.js";
import {createdAt, isClosed, madeBy, refOf} from "./row.js";

export const GROUPS = {
    started: "In progress",
    testing: "Testing",
    paused: "Paused",
    blocked: "Blocked",
    planned: "Planned",
    asked: "Needs you",
    open: "Open",
};

export const open = (table) => rows(table).filter((r) => !isClosed(r));

// What the user has not seen: the agent's messages not read yet, and the open rows of a table that someone else made.
const unseen = (r) => (r.table === "messages" ? r.author === "agent" && !r.read_at : madeBy(r) !== "user");
// an open task that belongs to a plan, which waits for its plan to reach it, whatever the plan's state and whether its row is loaded
export const planned = (task) => task.state === "open" && Boolean(task.plan_id);

export const paused = (task) => task.state === "paused";

// the open question that names the task, which asks the user about it
const questionAbout = (task) => rows("questions").find((q) => !isClosed(q) && (q.text || "").includes(`task ${task.id}`)) || null;

export function groupOf(task) {
    if (task.state === "blocked") return "blocked";
    if (paused(task)) return "paused";
    if (planned(task)) return "planned";
    if (task.state === "started") return "started";
    if (task.state === "testing") return "testing";
    return questionAbout(task) ? "asked" : "open";
}

export const state = (task) =>
    isClosed(task) ? "done" : task.state === "blocked" ? "blocked" : paused(task) ? "paused" : planned(task) ? "planned" : task.state === "started" ? "started" : task.state === "testing" ? "testing" : "open";

export function happened(r) {
    const kind = meta(r.table);
    return isClosed(r) ? `${kind.title} closed` : `${kind.title} created`;
}

// The pins the user missed while away: open ones made since a moment, newest first.
export function missed(since) {
    return rows("pins")
        .filter((n) => !isClosed(n) && createdAt(n) * 1000 >= since && unseen(n))
        .sort((a, b) => createdAt(b) - createdAt(a));
}

export {refOf};
