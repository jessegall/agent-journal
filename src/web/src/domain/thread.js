import {withoutChips} from "../text/words.js";
import {visibleIn} from "./chatVisibility.js";
import {refOf, seconds} from "./row.js";
import {meta} from "./tables.js";

const PROMISED_WITHIN = 5;

// A turn of the chat: a message's own fields, with its kind, who said it, a key that stays while a placeholder becomes the
// real message, and when, in seconds. A card of the journal's carries what it draws in its data.
const turnOf = (m, kind, who, extra = {}) => ({...m, kind, who, key: m.key || refOf(m), time: seconds(m.created_at), ...extra});

const spoken = (m) => {
    if (m.data?.kind === "thought") return turnOf(m, "thought", "agent");
    if ((m.comments_on || []).length) return turnOf(m, "comment", m.author);
    return turnOf(m, "message", m.author);
};

const SYSTEM_TURNS = {
    whisper: (card, label) => ({kind: "whisper", title: label, data: {row: card.row, words: ""}}),
    skill: (card) => ({kind: "skill", title: card.detail, data: {}}),
    compacted: () => ({kind: "compacted", data: {}}),
    question: (card, label, m) => ({
        kind: "question",
        question: {id: Number(card.row.split(":")[1]), options: card.options, answer: card.answer ?? null, closedAt: card.answer == null ? 0 : seconds(m.updated_at)},
        data: {},
    }),
    made: (card, label) => ({kind: "made", made: {table: card.made_type, id: Number(String(card.row).split(":")[1]), title: label, line: card.summary, file: card.file}, data: {}}),
    docked: (card) => ({
        kind: "card",
        data: {icon: meta(String(card.row).split(":")[0])?.icon || "pin", label: card.docked ? "Docked above the chat" : "Was docked above the chat", detail: card.heading, title: card.heading, row: card.row},
    }),
    subagent: (card) => ({
        kind: "subagent",
        title: card.detail,
        data: {kind: card.agent_type, model: card.model, agent: card.agent, session: card.subagent, finished: card.state !== "running", stopped: card.state === "stopped"},
    }),
    card: (card, label) => ({
        kind: "card",
        data: {icon: card.icon, tone: card.tone, label, detail: card.detail, command: card.command, title: card.detail || card.command, row: card.row, visitor: card.visitor},
    }),
    peer: (card) => ({kind: "message", data: {peer: card.peer, sent_to: card.sent_to}}),
    suggestion: (card, label) => ({
        kind: "suggestion",
        suggestion: {id: Number(String(card.row).split(":")[1]), title: label, detail: card.detail, accept: card.accept, answer: card.answer},
        data: {},
    }),
    plugin: (card, label) => ({
        kind: "card",
        data: {icon: card.icon || "plug", tone: card.tone, label, name: card.plugin, detail: card.collapsed ? "" : card.detail, title: card.detail, row: card.row},
    }),
};

const pluginOf = (m) => ((m.created_by || "").startsWith("plugin:") ? m.created_by.slice("plugin:".length) : "");

const plainTurn = (m, label) => ({kind: "card", data: {icon: pluginOf(m) ? "plug" : "dot", label, name: pluginOf(m)}});

const fromSystem = (m) => m.author === "system";

const byUser = (m) => (m.created_by || "").startsWith("user");

const systemTurn = (m) => {
    const card = m.data || {};
    const turn = (SYSTEM_TURNS[card.kind] || ((_, label) => plainTurn(m, label)))(card, m.text, m);
    return turnOf(m, turn.kind, byUser(m) ? "user" : "agent", {...turn, data: {...turn.data, shows: card.shows || "", side: byUser(m) ? "user" : ""}});
};

const promisedFor = (p, m) =>
    p.idempotency && m.idempotency ? p.idempotency === m.idempotency : withoutChips(m.text) === p.text && seconds(m.created_at) >= seconds(p.created_at) - PROMISED_WITHIN;

const delivered = (p, m) => m.files.length >= p.files.length;

export const EARLIER = "An earlier message";

// What a message answers: the message it is a reply to, as messages:12.
export const answered = (m) => (m.reply_to ? `messages:${m.reply_to}` : "");

export function threadTurns(messages, pending, older = false, hidden = []) {
    const keys = new Map();
    const said = messages.filter((m) => !fromSystem(m));
    const floor = older && said.length ? Math.min(...said.map((m) => seconds(m.created_at))) : 0;
    messages.forEach((m) => pending.filter((p) => promisedFor(p, m)).forEach((p) => keys.set(refOf(m), p.key)));
    const turns = [
        ...said.filter((m) => !pending.some((p) => promisedFor(p, m) && !delivered(p, m))).map(spoken),
        ...messages.filter(fromSystem).map(systemTurn),
        ...pending.filter((p) => !messages.some((m) => promisedFor(p, m) && delivered(p, m))).map((p) => turnOf(p, "message", "user")),
    ]
        .filter((t) => t.kind === "message" || t.time >= floor)
        .filter(visibleIn(hidden))
        .sort((a, b) => a.time - b.time);
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
const groupOf = (t) => (GROUPS[t.kind] ? GROUPS[t.kind](t) : null);

function folded(run) {
    const group = groupOf(run[0]);
    const last = run[run.length - 1];
    return {
        key: `group:${run[0].key}`,
        kind: "group",
        who: "agent",
        time: last.time,
        data: {tone: run.every((t) => t.data.settled) ? "good" : group.tone || "", color: group.color || ""},
        title: group.label(run.length, run),
        text: "",
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
