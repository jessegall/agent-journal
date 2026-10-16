import {meta} from "./spec.js";
import {withoutChips} from "../text/words.js";
import {turnKind, visibleIn} from "./chatVisibility.js";
import {answered} from "./replies.js";

const PROMISED_WITHIN = 5;

const acknowledged = (m, rows) =>
    rows.message.some((r) => !r.deleted && r.seen[0] === "agent" && answered(r) === m.ref) ||
    rows.reaction.some((r) => !r.deleted && r.refs.includes(m.ref) && r.seen[0] === "agent");

const QUOTED = ["message", "comment"];

const filed = (m) => m.refs.filter((r) => !QUOTED.includes(r.split(":")[0]) && meta(r.split(":")[0]));

const hasParent = (c) =>
    c.refs.some((ref) => {
        const [type] = ref.split(":");
        return type !== "comment" && meta(type);
    });

const quotedLines = (text) =>
    text
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");

const asked = (c, comments) => comments.find((p) => !p.deleted && p !== c && c.refs.includes(p.ref));

function onItsRow(c, comments) {
    if (hasParent(c)) return c;
    const parent = asked(c, comments);
    const row = parent && onItsRow(parent, comments);
    if (!row) return null;
    const passage = quotesOf(row) || quotedLines(row.brief);
    return {
        ...c,
        refs: [...c.refs, ...row.refs.filter((ref) => ref !== c.ref)],
        brief: c.brief.startsWith(">") ? c.brief : `${passage}\n\n${c.brief}`,
    };
}

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
                shows: turnKind("visitor"),
            })
        );

const sessions = (agents) => agents.filter((a) => !a.data.parent);

const loads = (agents) => sessions(agents).flatMap((a) => (a.data.skill_loads || []).map((load) => mark("skill", a, load.at, load.skill)));

const compactions = (agents) =>
    sessions(agents).flatMap((a) => (a.data.compactions || []).map((m) => mark("compacted", a, m.at, "Conversation compacted")));

const thoughts = (agents) => sessions(agents).flatMap((a) => (a.data.thoughts || []).map((t) => mark("thought", a, t.at, t.text)));

const SYSTEM_TURNS = {
    whisper: (card) => ({type: "whisper", data: {row: card.row, words: "", shows: "rules"}}),
    card: (card, label) => ({
        type: "card",
        data: {icon: card.icon, tone: card.tone, label, detail: card.detail, title: card.detail, row: card.row},
    }),
};

const fromSystem = (m) => m.data.author === "system";

const systemTurn = (m) => {
    const card = m.data.card;
    return {...m, who: "agent", title: m.brief, ...SYSTEM_TURNS[card.kind](card, m.brief)};
};

const cards = (agents) =>
    sessions(agents).flatMap((a) =>
        (a.data.cards || []).map((c) =>
            mark("card", a, c.at, c.label, {
                icon: c.icon,
                color: AGENT_ICONS.has(c.icon) ? SUBAGENT_COLOR : c.color,
                tone: AGENT_ICONS.has(c.icon) ? "" : c.tone,
                helper: c.helper,
                label: c.label,
                name: c.name || c.plugin,
                detail: c.detail,
                command: c.command,
                title: c.title,
                row: c.ref || c.row,
                page: c.page,
                settled: c.settled,
                settledAt: c.settled_at,
                side: c.side,
                shows: c.shows,
                state: c.state === "running" && !c.started ? "" : c.state,
                started: c.started,
                depth: c.depth || 0,
                ended: c.ended,
                search: c.found === undefined ? null : {label: c.label, found: c.found, reads: c.reads || []},
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
        : withoutChips(m.brief) === p.brief && m.created >= p.created - PROMISED_WITHIN;

const delivered = (p, m) => Object.keys(m.data.files || {}).length >= Object.keys(p.data.files).length;

export function threadTurns(rows, pending, env, older = false, hidden = []) {
    const keys = new Map();
    const live = rows.message.filter((m) => !m.deleted && !m.data.window);
    const said = live.filter((m) => !fromSystem(m));
    const paged = live.filter((m) => m.completed);
    const floor = older && live.length ? Math.min(...(paged.length ? paged : live).map((m) => m.created)) : 0;
    live.forEach((m) => pending.filter((p) => promisedFor(p, m)).forEach((p) => keys.set(m.ref, p.ref)));
    const turns = [
        ...said.filter((m) => !pending.some((p) => promisedFor(p, m) && !delivered(p, m))).map((m) => ({...m, who: m.seen[0]})),
        ...said.filter((m) => m.seen[0] === "user" && m.completed && filed(m).length && !acknowledged(m, rows)).map(receipt),
        ...live.filter(fromSystem).map(systemTurn),
        ...rows.comment
            .filter((c) => !c.deleted && !c.data.visitor)
            .map((c) => onItsRow(c, rows.comment))
            .filter(Boolean)
            .map((c) => ({...c, who: c.seen[0]})),
        ...visitorComments(rows.comment),
        ...rows.question.filter((q) => !q.deleted).map((q) => ({...q, who: "agent"})),
        ...(rows.suggestion || []).filter((q) => !q.deleted).map((q) => ({...q, who: "agent"})),
        ...loads(rows.agent || []),
        ...compactions(rows.agent || []),
        ...subagents(rows.agent || []),
        ...thoughts(rows.agent || []),
        ...cards(rows.agent || []),
        ...madeByAgent(rows.doc || [], env),
        ...pending.filter((p) => !live.some((m) => promisedFor(p, m) && delivered(p, m))),
    ]
        .filter((t) => t.type === "message" || t.created >= floor)
        .filter(visibleIn(hidden))
        .sort((a, b) => a.created - b.created);
    return {turns: grouped(turns), keys};
}

const GROUP_FROM = 4;
export const SUBAGENT_COLOR = "#e2c55c";
const AGENT_ICONS = new Set(["bot", "agents"]);
const GROUPS = {
    skill: () => ({key: "skill", icon: "book", tone: "good", label: (n) => `${n} skills loaded`}),
    whisper: () => ({key: "whisper", icon: "rules", label: (n) => `${n} rules and facts recalled`}),
    subagent: () => ({key: "subagent", icon: "agents", color: SUBAGENT_COLOR, label: (n) => `${n} subagent updates`}),
    card: (t) => ({
        key: `card:${t.data.icon}:${t.data.label}`,
        icon: t.data.icon,
        tone: t.data.tone,
        color: t.data.color,
        label: (n, run) => {
            const settled = run.filter((r) => r.data.settled);
            return `${n} × ${t.data.label}${settled.length ? `, ${settled.length} ${settled[0].data.settled}` : ""}`;
        },
    }),
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
        data: {tone: run.every((t) => t.data.settled) ? "good" : group.tone || "", color: group.color || ""},
        sections: [],
        title: group.label(run.length, run),
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

const quotesOf = (t) =>
    (t.brief || "")
        .split("\n")
        .filter((line) => line.startsWith(">"))
        .join("\n");
