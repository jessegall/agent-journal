import {withoutChips} from "../text/words.js";
import {visibleIn} from "./chatVisibility.js";

const PROMISED_WITHIN = 5;

const isThought = (m) => (m.data.card || {}).kind === "thought";

const comments = (m) => m.data.comments_on || [];

const spoken = (m) => {
    if (isThought(m)) return {...m, type: "thought", who: "agent", title: m.brief};
    if (comments(m).length) return {...m, type: "comment", who: m.seen[0], refs: [...comments(m), ...m.refs]};
    return {...m, who: m.seen[0]};
};

const SYSTEM_TURNS = {
    whisper: (card) => ({type: "whisper", data: {row: card.row, words: "", shows: "rules"}}),
    skill: (card) => ({type: "skill", title: card.detail, data: {}}),
    compacted: () => ({type: "compacted", data: {}}),
    question: (card, label, m) => ({
        type: "question",
        ref: card.row,
        n: card.n,
        outcome: card.answer || "",
        completed: card.answer == null ? 0 : m.updated,
        data: {
            options: card.options.map((title) => ({title, description: ""})),
            pick: 1,
            chosen: card.answer == null ? 0 : card.options.indexOf(card.answer) + 1,
            kept: false,
            answered_by: card.answer == null ? "" : "user",
            reason: "",
            final: false,
            dismissed: false,
        },
    }),
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
    const turn = (SYSTEM_TURNS[card.kind] || ((_, label) => plainTurn(m, label)))(card, m.brief, m);
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
