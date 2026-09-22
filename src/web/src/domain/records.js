import {meta, types, word} from "../state/store.js";
import {rows} from "../sync/rows.js";

const ENDED = ["done", "abandoned"];
const UNSTARTED = ["building", "ready", "approved"];

export const GROUPS = {
    started: "In progress",
    parked: "Parked",
    blocked: "Blocked",
    planned: "Planned",
    waiting: "Waiting on others",
    asked: "Waiting on you",
    open: "Open",
};

export const open = (type) => rows(type).filter((r) => !r.completed && !r.deleted);
export const unreadByUser = (type) => open(type).filter((r) => !r.seen.includes("user"));
export const finishedUnread = (type) => rows(type).filter((r) => r.completed && !r.deleted && !r.seen.includes("user"));
const pointsAt = (link, ref) => link === ref || link.startsWith(`${ref}#`) || link.startsWith(`${ref}:`);
export const linkedTo = (ref) =>
    types.value.flatMap((t) => rows(t.name).filter((r) => r.refs.some((link) => pointsAt(link, ref)) && !r.deleted));

export function refParts(ref) {
    const [whole, section = ""] = ref.split("#");
    const [type, n, lines = ""] = whole.split(":");
    return {type, n: Number(n), part: section || lines};
}

export function byRef(ref) {
    const {type, n} = refParts(ref);
    return rows(type).find((r) => r.n === n) || null;
}

export function waitsOn(r) {
    return [].concat(r.data.after || []).filter((ref) => {
        const [type, n] = ref.split(":");
        const other = rows(type).find((x) => x.n === Number(n));
        return other && !other.deleted && (type === "plan" ? !ENDED.includes(other.data.status) : !other.completed);
    });
}

export function planOf(r) {
    return rows("plan").find((p) => !p.deleted && (p.data.phases || []).some((f) => (f.todos || []).includes(r.n))) || null;
}

export function planned(r) {
    const plan = planOf(r);
    return !!plan && UNSTARTED.includes(plan.data.status);
}

export function parkedFor(r) {
    const work =
        r.type === "work" ? r : r.data.status === "started" && r.data.work ? rows("work").find((w) => w.n === Number(r.data.work)) : null;
    return work && !work.completed ? work.data.parked || "" : "";
}

export const parked = (r) => !!parkedFor(r);

export function groupOf(r) {
    if (r.data.blocked) return "blocked";
    if (parked(r)) return "parked";
    if (planned(r)) return "planned";
    if (waitsOn(r).length) return "waiting";
    if (r.data.status === "started") return "started";
    return rows("question").some((q) => !q.completed && q.refs.includes(r.ref)) ? "asked" : "open";
}

export const state = (r) =>
    r.data.struck
        ? "struck"
        : r.completed
          ? "done"
          : r.data.blocked
            ? "blocked"
            : parked(r)
              ? "parked"
              : planned(r)
                ? "planned"
                : r.data.status === "started"
                  ? "started"
                  : "open";

export const toldToUser = (e) => !!meta(e.type) && meta(e.type).notified.includes("user");

export function happened(r) {
    const kind = meta(r.type);
    const action = r.completed ? "completed" : "created";
    const label = (kind.event_labels || {})[action];
    if (label) return label;
    return r.completed ? `${kind.title} ${word(r.type, "complete")}` : `${kind.title} created`;
}

export function missed(since) {
    return rows("notification")
        .filter((n) => !n.deleted && !n.completed && n.created * 1000 >= since && !n.seen.includes("user"))
        .sort((a, b) => b.created - a.created);
}
