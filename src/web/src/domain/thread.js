import {meta} from "../state/store.js";
import {words} from "../text/words.js";
import {shownIn} from "./chatShown.js";

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

const visitorComments = (comments) =>
    comments
        .filter((c) => !c.deleted && c.data.visitor)
        .map((c) =>
            mark("card", c, c.created, `${c.data.visitor} commented on ${c.refs[0].replace(":", " ")}`, {
                icon: "bubble",
                label: `${c.data.visitor} commented on ${c.refs[0].replace(":", " ")}`,
                row: c.refs[0],
                visitor: true,
            })
        );

const sessions = (agents) => agents.filter((a) => !a.data.parent);

const loads = (agents) => sessions(agents).flatMap((a) => (a.data.skill_loads || []).map((load) => mark("skill", a, load.at, load.skill)));

const compactions = (agents) =>
    sessions(agents).flatMap((a) => (a.data.compactions || []).map((m) => mark("compacted", a, m.at, "Context compacted")));

const thoughts = (agents) => sessions(agents).flatMap((a) => (a.data.thoughts || []).map((t) => mark("thought", a, t.at, t.text)));

const whispers = (agents) =>
    sessions(agents).flatMap((a) => (a.data.whispers || []).map((w) => mark("whisper", a, w.at, w.title, {row: w.ref})));

const cards = (agents) =>
    sessions(agents).flatMap((a) =>
        (a.data.cards || []).map((c) =>
            mark("card", a, c.at, c.label, {
                icon: c.icon,
                color: c.color,
                tone: c.tone,
                label: c.label,
                name: c.plugin,
                detail: c.detail,
                command: c.command,
                title: c.title,
                row: c.ref,
                page: c.page,
                state: c.state === "running" && !c.started ? "" : c.state,
                started: c.started,
                ended: c.ended,
            })
        )
    );

const subagents = (agents) =>
    sessions(agents).flatMap((a) =>
        (a.data.subagent_rows || []).flatMap((sub) => [
            mark("subagent", a, sub.at, sub.task, {
                kind: sub.type,
                model: sub.model,
                agent: a.n,
                session: sub.session,
                refusal: sub.refusal,
            }),
            ...(sub.ended && !sub.refusal
                ? [
                      mark("subagent", a, sub.ended, sub.task, {
                          kind: sub.type,
                          finished: true,
                          stopped: ["stopped", "killed"].includes(sub.status),
                          agent: a.n,
                          session: sub.session,
                          report: (a.data.subagent_reports || {})[sub.id] || 0,
                      }),
                  ]
                : []),
        ])
    );

const madeByAgent = (docs, env) =>
    docs
        .filter((d) => !d.deleted && d.seen[0] === "agent" && d.data.environment === env)
        .map((d) => ({...d, ref: `made:${d.ref}`, type: "made", made: d, who: "agent", seen: ["agent"], refs: [d.ref]}));

const promisedFor = (p, m) =>
    p.data.idempotency && m.data?.idempotency
        ? p.data.idempotency === m.data.idempotency
        : words(m.brief) === p.brief && m.created >= p.created - PROMISED_WITHIN;

const delivered = (p, m) => Object.keys(m.data.files || {}).length >= Object.keys(p.data.files).length;

export function threadTurns(rows, pending, env, older = false, hidden = []) {
    const keys = new Map();
    const live = rows.message.filter((m) => !m.deleted);
    const floor = older && live.length ? Math.min(...live.map((m) => m.created)) : 0;
    live.forEach((m) => pending.filter((p) => promisedFor(p, m)).forEach((p) => keys.set(m.ref, p.ref)));
    const turns = [
        ...live.filter((m) => !pending.some((p) => promisedFor(p, m) && !delivered(p, m))).map((m) => ({...m, who: m.seen[0]})),
        ...live.filter((m) => m.seen[0] === "user" && m.completed && filed(m).length && !acknowledged(m, rows)).map(receipt),
        ...rows.comment.filter((c) => !c.deleted && hasParent(c) && !c.data.visitor).map((c) => ({...c, who: c.seen[0]})),
        ...visitorComments(rows.comment),
        ...rows.question.filter((q) => !q.deleted).map((q) => ({...q, who: "agent"})),
        ...loads(rows.agent || []),
        ...compactions(rows.agent || []),
        ...subagents(rows.agent || []),
        ...whispers(rows.agent || []),
        ...thoughts(rows.agent || []),
        ...cards(rows.agent || []),
        ...madeByAgent(rows.doc || [], env),
        ...pending.filter((p) => !live.some((m) => promisedFor(p, m) && delivered(p, m))),
    ]
        .filter((t) => t.created >= floor)
        .filter(shownIn(hidden))
        .sort((a, b) => a.created - b.created);
    return {turns: grouped(mergedReplies(turns)), keys};
}

const GROUP_FROM = 4;
const GROUPS = {
    skill: () => ({key: "skill", icon: "book", label: (n) => `${n} skills loaded`}),
    whisper: () => ({key: "whisper", icon: "rules", label: (n) => `${n} rules and facts recalled`}),
    subagent: () => ({key: "subagent", icon: "agents", label: (n) => `${n} subagent updates`}),
    card: (t) => ({key: `card:${t.data.icon}:${t.data.label}`, icon: t.data.icon, label: (n) => `${n} × ${t.data.label}`}),
};
const groupOf = (t) => (GROUPS[t.type] ? GROUPS[t.type](t) : null);

function folded(run) {
    const group = groupOf(run[0]);
    const last = run[run.length - 1];
    return {
        ref: `group:${run[0].ref}`,
        type: "group",
        who: "agent",
        created: last.created,
        seen: ["agent"],
        refs: [],
        data: {},
        sections: [],
        title: group.label(run.length),
        brief: "",
        icon: group.icon,
        turns: run,
    };
}

function grouped(turns) {
    const out = [];
    let run = [];
    const close = () => {
        out.push(...(run.length >= GROUP_FROM ? [folded(run)] : run));
        run = [];
    };
    for (const turn of turns) {
        const key = groupOf(turn)?.key;
        if (!key || (run.length && groupOf(run[0]).key !== key)) close();
        if (key) run.push(turn);
        else out.push(turn);
    }
    close();
    return out;
}

const SAME_REPLY_WITHIN = 120;
const answerOf = (t) =>
    (t.brief || "")
        .split("\n")
        .filter((line) => !line.startsWith(">"))
        .join("\n")
        .trim();
const quotesOf = (t) =>
    (t.brief || "")
        .split("\n")
        .filter((line) => line.startsWith(">"))
        .join("\n");
const agentReply = (t) => t.type === "comment" && t.who === "agent";

function mergedReplies(turns) {
    const out = [];
    for (const turn of turns) {
        const last = out[out.length - 1];
        const same = last && agentReply(turn) && agentReply(last) && turn.created - last.created < SAME_REPLY_WITHIN;
        if (same && answerOf(turn) && answerOf(turn) === answerOf(last)) {
            out[out.length - 1] = {...last, brief: `${quotesOf(last)}\n>\n${quotesOf(turn)}\n\n${answerOf(turn)}`};
            continue;
        }
        out.push(turn);
    }
    return out;
}
