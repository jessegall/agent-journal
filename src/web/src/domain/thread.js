import {meta} from "../state/store.js";
import {words} from "../text/words.js";

const PROMISED_WITHIN = 5;

const acknowledged = (m, rows) =>
    rows.comment.some((c) => !c.deleted && c.refs.includes(m.ref) && c.seen[0] === "agent") ||
    rows.reaction.some((r) => !r.deleted && r.refs.includes(m.ref) && r.seen[0] === "agent");

const QUOTED = ["message", "comment"];

const filed = (m) => m.refs.filter((r) => !QUOTED.includes(r.split(":")[0]) && meta(r.split(":")[0]));

const hasParent = (c) =>
    c.refs.some((ref) => {
        const [type] = ref.split(":");
        return type !== "comment" && meta(type);
    });

const receipt = (m) => {
    const refs = filed(m);
    return {
        ref: `receipt:${m.n}`,
        type: "receipt",
        n: m.n,
        who: "agent",
        created: m.updated + 0.001,
        seen: ["agent"],
        refs,
        data: {},
        sections: [],
        title: `Filed ${refs.map((r) => `${meta(r.split(":")[0]).title.toLowerCase()} ${r.split(":")[1]}`).join(", ")} from your message.`,
        brief: "",
    };
};

const mark = (type, a, at, title, data = {}) => ({
    ref: `${type}:${a.n}:${at}`,
    type,
    n: a.n,
    who: "agent",
    created: at,
    seen: ["agent"],
    refs: [],
    data,
    sections: [],
    title,
    brief: "",
});

const sessions = (agents) => agents.filter((a) => !a.data.parent);

const loads = (agents) => sessions(agents).flatMap((a) => (a.data.skill_loads || []).map((load) => mark("skill", a, load.at, load.skill)));

const compactions = (agents) =>
    sessions(agents).flatMap((a) => (a.data.compactions || []).map((m) => mark("compacted", a, m.at, "Context compacted")));

const whispers = (agents) =>
    sessions(agents).flatMap((a) => (a.data.whispers || []).map((w) => mark("whisper", a, w.at, w.title, {row: w.ref})));

const cards = (agents) =>
    sessions(agents).flatMap((a) =>
        (a.data.cards || []).map((c) => mark("card", a, c.at, c.label, {icon: c.icon, color: c.color, tone: c.tone, label: c.label, name: c.plugin, detail: c.detail}))
    );

const subagents = (agents) =>
    sessions(agents).flatMap((a) =>
        (a.data.subagent_rows || []).flatMap((sub) => [
            mark("subagent", a, sub.at, sub.task, {kind: sub.type, model: sub.model}),
            ...(sub.ended ? [mark("subagent", a, sub.ended, sub.task, {kind: sub.type, finished: true})] : []),
        ])
    );

const madeByAgent = (docs) =>
    docs
        .filter((d) => !d.deleted && d.seen[0] === "agent")
        .map((d) => ({...d, ref: `made:${d.ref}`, type: "made", made: d, who: "agent", seen: ["agent"], refs: [d.ref]}));

const promisedFor = (p, m) =>
    p.data.idempotency && m.data?.idempotency
        ? p.data.idempotency === m.data.idempotency
        : words(m.brief) === p.brief && m.created >= p.created - PROMISED_WITHIN;

const delivered = (p, m) => Object.keys(m.data.files || {}).length >= Object.keys(p.data.files).length;

export function threadTurns(rows, pending) {
    const keys = new Map();
    const live = rows.message.filter((m) => !m.deleted);
    live.forEach((m) => pending.filter((p) => promisedFor(p, m)).forEach((p) => keys.set(m.ref, p.ref)));
    const turns = [
        ...live.filter((m) => !pending.some((p) => promisedFor(p, m) && !delivered(p, m))).map((m) => ({...m, who: m.seen[0]})),
        ...live.filter((m) => m.seen[0] === "user" && m.completed && filed(m).length && !acknowledged(m, rows)).map(receipt),
        ...rows.comment.filter((c) => !c.deleted && hasParent(c)).map((c) => ({...c, who: c.seen[0]})),
        ...rows.question.filter((q) => !q.deleted).map((q) => ({...q, who: "agent"})),
        ...loads(rows.agent || []),
        ...compactions(rows.agent || []),
        ...subagents(rows.agent || []),
        ...whispers(rows.agent || []),
        ...cards(rows.agent || []),
        ...madeByAgent(rows.doc || []),
        ...pending.filter((p) => !live.some((m) => promisedFor(p, m) && delivered(p, m))),
    ].sort((a, b) => a.created - b.created);
    return {turns, keys};
}
