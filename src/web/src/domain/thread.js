import {meta} from "./spec.js";
import {withoutChips} from "../text/words.js";
import {turnKind, visibleIn} from "./chatVisibility.js";

const PROMISED_WITHIN = 5;

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

const isThought = (m) => (m.data.card || {}).kind === "thought";

const spoken = (m) => (isThought(m) ? {...m, type: "thought", who: "agent", title: m.brief} : {...m, who: m.seen[0]});

const SYSTEM_TURNS = {
    whisper: (card) => ({type: "whisper", data: {row: card.row, words: "", shows: "rules"}}),
    skill: (card) => ({type: "skill", title: card.detail, data: {}}),
    compacted: () => ({type: "compacted", data: {}}),
    made: (card, label) => ({type: "made", made: {type: card.made_type, n: card.n, title: label, abstract: card.abstract}, data: {shows: card.shows}}),
    subagent: (card) => ({
        type: "subagent",
        title: card.detail,
        data: {kind: card.agent_type, model: card.model, agent: card.agent, session: card.subagent, finished: card.state !== "running", stopped: card.state === "stopped"},
    }),
    card: (card, label) => ({
        type: "card",
        data: {icon: card.icon, tone: card.tone, label, detail: card.detail, title: card.detail, row: card.row, shows: card.shows},
    }),
    plugin: (card, label) => ({
        type: "card",
        data: {icon: card.icon || "plug", tone: card.tone, label, name: card.plugin, detail: card.collapsed ? "" : card.detail, title: card.detail, row: card.row},
    }),
};

const pluginOf = (m) => ((m.data.actor || "").startsWith("plugin:") ? m.data.actor.slice("plugin:".length) : "");

const plainTurn = (m, label) => ({type: "card", data: {icon: pluginOf(m) ? "plug" : "dot", label, name: pluginOf(m)}});

const fromSystem = (m) => m.data.author === "system";

const byUser = (m) => (m.data.actor || "").startsWith("user");

const systemTurn = (m) => {
    const card = m.data.card || {};
    const turn = (SYSTEM_TURNS[card.kind] || ((_, label) => plainTurn(m, label)))(card, m.brief);
    return {
        ...m,
        who: byUser(m) ? "user" : "agent",
        title: m.brief,
        ...turn,
        data: {...turn.data, side: byUser(m) ? "user" : ""},
    };
};

const promisedFor = (p, m) =>
    p.data.idempotency && m.data?.idempotency
        ? p.data.idempotency === m.data.idempotency
        : withoutChips(m.brief) === p.brief && m.created >= p.created - PROMISED_WITHIN;

const delivered = (p, m) => Object.keys(m.data.files || {}).length >= Object.keys(p.data.files).length;

export function threadTurns(rows, pending, older = false, hidden = []) {
    const keys = new Map();
    const live = rows.message.filter((m) => !m.deleted && !m.data.window);
    const said = live.filter((m) => !fromSystem(m));
    const paged = live.filter((m) => m.completed);
    const floor = older && live.length ? Math.min(...(paged.length ? paged : live).map((m) => m.created)) : 0;
    live.forEach((m) => pending.filter((p) => promisedFor(p, m)).forEach((p) => keys.set(m.ref, p.ref)));
    const turns = [
        ...said.filter((m) => !pending.some((p) => promisedFor(p, m) && !delivered(p, m))).map(spoken),
        ...live.filter(fromSystem).map(systemTurn),
        ...rows.comment
            .filter((c) => !c.deleted && !c.data.visitor)
            .map((c) => onItsRow(c, rows.comment))
            .filter(Boolean)
            .map((c) => ({...c, who: c.seen[0]})),
        ...visitorComments(rows.comment),
        ...rows.question.filter((q) => !q.deleted).map((q) => ({...q, who: "agent"})),
        ...(rows.suggestion || []).filter((q) => !q.deleted).map((q) => ({...q, who: "agent"})),
        ...pending.filter((p) => !live.some((m) => promisedFor(p, m) && delivered(p, m))),
    ]
        .filter((t) => t.type === "message" || t.created >= floor)
        .filter(visibleIn(hidden))
        .sort((a, b) => a.created - b.created);
    return {turns: grouped(turns), keys};
}

const GROUP_FROM = 4;
export const SUBAGENT_COLOR = "#e2c55c";
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
