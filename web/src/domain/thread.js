import {meta} from "../state/store.js";

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

const promisedFor = (p, m) => m.brief === p.brief && m.created >= p.created - PROMISED_WITHIN;

const delivered = (p, m) => Object.keys(m.data.files || {}).length >= Object.keys(p.data.files).length;

export function threadTurns(rows, pending) {
    const keys = new Map();
    const live = rows.message.filter((m) => !m.deleted);
    live.forEach((m) => pending.filter((p) => promisedFor(p, m)).forEach((p) => keys.set(m.ref, p.ref)));
    const turns = [
        ...live
            .filter((m) => m.place !== "bar" && !pending.some((p) => promisedFor(p, m) && !delivered(p, m)))
            .map((m) => ({...m, who: m.seen[0]})),
        ...live.filter((m) => m.seen[0] === "user" && m.completed && filed(m).length && !acknowledged(m, rows)).map(receipt),
        ...rows.comment.filter((c) => !c.deleted && c.place !== "bar" && hasParent(c)).map((c) => ({...c, who: c.seen[0]})),
        ...rows.question.filter((q) => !q.deleted).map((q) => ({...q, who: "agent"})),
        ...pending.filter((p) => !live.some((m) => promisedFor(p, m) && delivered(p, m))),
    ].sort((a, b) => a.created - b.created);
    return {turns, keys};
}
