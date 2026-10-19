import {meta, tables} from "./tables.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {createdAt, isClosed, madeBy, refOf} from "./row.js";

export const GROUPS = {
    started: "In progress",
    parked: "Paused",
    blocked: "Blocked",
    planned: "Planned",
    asked: "Needs you",
    open: "Open",
};

const UNSTARTED = ["draft", "ready", "reviewing", "approved"];

export const open = (table) => rows(table).filter((r) => !isClosed(r));

// What the user has not seen: the agent's messages not read yet, and the open rows of a table that someone else made.
const unseen = (r) => (r.table === "messages" ? r.author === "agent" && !r.read_at : madeBy(r) !== "user");
export const unreadByUser = (table) => open(table).filter(unseen);
export const finishedUnread = (table) => rows(table).filter((r) => isClosed(r) && unseen(r));

const pointsAt = (link, ref) => link === ref || link.startsWith(`${ref}#`) || link.startsWith(`${ref}:`);

// The rows that name another as theirs: a document's or report's links, a plan's tasks, a comment's row, a filed message.
export const linksOf = (r) => [...(r.links || []), ...(r.on || []), ...(r.task_ids || []).map((id) => `tasks:${id}`), ...(r.filed || []).map((id) => `tasks:${id}`)];
export const linkedTo = (ref) => tables.value.flatMap((t) => rows(t.name).filter((r) => linksOf(r).some((link) => pointsAt(link, ref))));

export function refParts(ref) {
    const [whole, section = ""] = ref.split("#");
    const [env, ...rest] = whole.includes("/") ? whole.split("/") : ["", whole];
    const [table, id, lines = ""] = rest.join("/").split(":");
    return {env, table, id: Number(id), part: section || lines};
}

export function byRef(ref) {
    const {table, id} = refParts(ref);
    return rows(table).find((r) => r.id === id) || null;
}

export function planOf(task) {
    return task.plan_id ? rows("plans").find((p) => p.id === task.plan_id) || null : null;
}

export function planned(task) {
    const plan = planOf(task);
    return !!plan && UNSTARTED.includes(plan.state);
}

export const parked = (task) => task.state === "parked";

const asked = (task) => rows("questions").some((q) => !isClosed(q) && (q.text || "").includes(`task ${task.id}`));

export function groupOf(task) {
    if (task.state === "blocked") return "blocked";
    if (parked(task)) return "parked";
    if (planned(task)) return "planned";
    if (task.state === "started") return "started";
    return asked(task) ? "asked" : "open";
}

export const state = (task) =>
    isClosed(task) ? "done" : task.state === "blocked" ? "blocked" : parked(task) ? "parked" : planned(task) ? "planned" : task.state === "started" ? "started" : "open";

export function happened(r) {
    const kind = meta(r.table);
    return isClosed(r) ? `${kind.title} closed` : `${kind.title} created`;
}

// The notices the user missed while away: open ones made since a moment, newest first.
export function missed(since) {
    return rows("notices")
        .filter((n) => !isClosed(n) && createdAt(n) * 1000 >= since && unseen(n))
        .sort((a, b) => createdAt(b) - createdAt(a));
}

export const recordCount = (table, key = "open") => (store.counts && store.counts[table] && store.counts[table][key]) || 0;

// How many rows wait on the user across the tables that ask for attention, as the top bar's bell counts them.
export const waitingCount = () => tables.value.filter((t) => t.needs_attention).flatMap((t) => unreadByUser(t.name)).length;

export {refOf};
