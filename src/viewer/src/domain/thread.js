import {withoutChips} from "../text/words.js";
import {cardLook, familyOf, visibleIn} from "./chatVisibility.js";
import {refOf, seconds} from "./row.js";
import {meta} from "./tables.js";

const PROMISED_WITHIN = 5;

// A turn of the chat: a message's own fields, with its kind, who said it, a key that stays while a placeholder becomes the
// real message, and when, in seconds. A card of the journal's carries what it draws in its data.
const turnOf = (m, kind, who, extra = {}) => ({...m, kind, who, key: m.key || refOf(m), time: seconds(m.created_at), ...extra});

// a turn depends on its row alone, so a row that has not changed keeps the very turn it had: a new message draws one new item and
// leaves every other turn as it was
const turned = new WeakMap();
const once = (build) => (m) => {
    if (!turned.has(m)) turned.set(m, build(m));
    return turned.get(m);
};

const spoken = once((m) => {
    if (m.data?.kind === "thought") return turnOf(m, "thought", "agent");
    if ((m.comments_on || []).length) return turnOf(m, "comment", m.author);
    return turnOf(m, "message", m.author);
});

const placeholderTurn = once((p) => turnOf(p, "message", "user"));

// the run a card's mark gathers in: a sequence's step, or one subagent's action
const runOfCard = (card) => ({
    run: card.run || "",
    step: card.step || 0,
    run_title: card.run_title || "",
    run_noun: card.run_noun || "steps",
    run_mark: card.run_mark || "sequence",
});

const SYSTEM_TURNS = {
    whisper: (card, label) => ({kind: "whisper", title: label, data: {row: card.row, words: ""}}),
    skill: (card) => ({kind: "skill", title: card.detail, data: {}}),
    compacted: () => ({kind: "compacted", data: {}}),
    flowchart: (card, label) => ({kind: "flowchart", title: label, edges: card.edges || [], data: {}}),
    question: (card, label, m) => ({
        kind: "question",
        question: {
            id: Number(card.row.split(":")[1]),
            options: card.options,
            answer: card.answer ?? null,
            closedAt: card.answer == null ? 0 : seconds(m.updated_at),
        },
        data: {},
    }),
    made: (card, label) => ({
        kind: "made",
        made: {
            table: card.made_type,
            id: Number(String(card.row).split(":")[1]),
            title: card.title || label,
            status: card.status || "",
            summary: card.summary || "",
        },
        data: runOfCard(card),
    }),
    docked: (card) => ({
        kind: "card",
        data: {
            icon: meta(String(card.row).split(":")[0])?.icon || "pin",
            label: card.docked ? "Docked above the chat" : "Was docked above the chat",
            detail: card.heading,
            title: card.heading,
            row: card.row,
        },
    }),
    subagent: (card) => ({
        kind: "subagent",
        title: card.detail,
        data: {
            kind: card.agent_type,
            model: card.model,
            agent: card.agent,
            session: card.subagent,
            finished: card.state !== "running",
            stopped: card.state === "stopped",
            failed: card.state === "failed",
            unfinished: card.state === "unfinished",
            reason: card.reason || "",
            returned: card.returned || "",
        },
    }),
    card: (card, label) => ({
        kind: "card",
        data: {
            ...cardLook(card, label),
            label,
            detail: card.detail,
            lines: card.lines || [],
            figure: (card.output ? card.count : card.figure) || "",
            fraction: card.fraction || 0,
            counting: Boolean(card.counting),
            began_at: card.began_at || 0,
            output: card.output || 0,
            check: card.check || 0,
            line: card.line || "",
            summary: card.summary || "",
            reason: card.reason || "",
            ending: card.ending || "",
            docked: Boolean(card.docked),
            worker: card.worker || "",
            command: card.command,
            title: card.detail || card.command,
            row: card.row,
            visitor: card.visitor,
            proof_task: card.proof_task || 0,
            ...runOfCard(card),
            round: card.round || null,
        },
    }),
    search: (card, label, m) => ((card.results || []).length ? searchGroup(card, label, m) : SYSTEM_TURNS.card(card, label)),
    peer: (card) => ({kind: "message", data: {peer: card.peer, sent_to: card.sent_to, failure: card.failure || ""}}),
    suggestion: (card, label) => ({
        kind: "suggestion",
        suggestion: {
            id: Number(String(card.row).split(":")[1]),
            title: label,
            detail: card.description ?? card.detail,
            accept: card.accept,
            answer: card.answer,
        },
        data: {},
    }),
    plugin: (card, label) => ({
        kind: "card",
        data: {
            ...cardLook(card, label),
            label,
            name: card.plugin,
            detail: card.detail,
            lines: card.lines || [],
            collapsed: Boolean(card.collapsed && card.detail),
            title: card.detail,
            row: card.row,
        },
    }),
};

// the most results a search's mark lists as its children; past it the last child opens the search page with them all
const SHOWN_RESULTS = 10;

// a search's mark, headed with its words and how many it found, opening to one child mark per result that opens its row
function searchGroup(card, label, m) {
    const look = cardLook(card, label);
    const child = (i, data) => ({key: `${refOf(m)}:result:${i}`, kind: "card", who: "agent", time: seconds(m.created_at), data: {...look, lines: [], ...data}});
    const result = (r, i) => child(i, {label: `${r.label}: ${r.passage}`, title: r.passage, row: r.row});
    const more = card.results.length - SHOWN_RESULTS;
    const rest = more > 0 ? [child(SHOWN_RESULTS, {label: `+ ${more} more`, go: "search", query: card.terms || ""})] : [];
    return {
        kind: "group",
        title: label,
        icon: look.icon,
        turns: [...card.results.slice(0, SHOWN_RESULTS).map(result), ...rest],
        data: {tone: look.tone || "", color: look.color || "", group: look.group || "", markIcon: look.markIcon || "", news: 0, continues: ""},
    };
}

const pluginOf = (m) => ((m.creator || "").startsWith("plugin:") ? m.creator.slice("plugin:".length) : "");

const plainTurn = (m, label) => ({kind: "card", data: {icon: pluginOf(m) ? "plug" : "dot", label, name: pluginOf(m)}});

const fromSystem = (m) => m.author === "system";

const byUser = (m) => (m.creator || "").startsWith("user");

const systemTurn = once((m) => {
    const card = m.data || {};
    const turn = (SYSTEM_TURNS[card.kind] || ((_, label) => plainTurn(m, label)))(card, m.text, m);
    return turnOf(m, turn.kind, byUser(m) ? "user" : "agent", {
        ...turn,
        data: {...turn.data, shows: card.shows || "", side: byUser(m) ? "user" : ""},
    });
});

const promisedFor = (p, m) =>
    p.idempotency && m.idempotency
        ? p.idempotency === m.idempotency
        : withoutChips(m.text) === p.text && seconds(m.created_at) >= seconds(p.created_at) - PROMISED_WITHIN;

const delivered = (p, m) => m.files.length >= p.files.length;

export const EARLIER = "An earlier message";

// What a message answers: the message it is a reply to, as messages:12.
export const answered = (m) => (m.reply_target ? `messages:${m.reply_target}` : "");

// the receipt the journal writes for a user's message, naming the tasks created or edited from it, keyed filed:<message id>
const receiptOf = (m) => (fromSystem(m) && String(m.data?.key || "").startsWith("filed:") ? Number(m.data.key.split(":")[1]) : 0);

// a user's message with the line saying what was created or edited from it under it, once, in place of a mark of its own elsewhere
const withReceipt = (turn, receipt) => (receipt ? {...turn, receipt} : turn);

export function threadTurns(messages, pending, older = false, hidden = []) {
    const keys = new Map();
    const receipts = new Map(hidden.includes("filed") ? [] : messages.filter(receiptOf).map((m) => [receiptOf(m), m.text]));
    const said = messages.filter((m) => !fromSystem(m));
    const floor = older && said.length ? Math.min(...said.map((m) => seconds(m.created_at))) : 0;
    messages.forEach((m) => pending.filter((p) => promisedFor(p, m)).forEach((p) => keys.set(refOf(m), p.key)));
    const turns = [
        ...said
            .filter((m) => !pending.some((p) => promisedFor(p, m) && !delivered(p, m)))
            .map((m) => withReceipt(spoken(m), receipts.get(m.id))),
        ...messages.filter((m) => fromSystem(m) && !receiptOf(m)).map(systemTurn),
        ...pending.filter((p) => !messages.some((m) => promisedFor(p, m) && delivered(p, m))).map(placeholderTurn),
    ]
        .filter((t) => t.kind === "message" || t.time >= floor)
        .filter(visibleIn(hidden))
        .sort((a, b) => a.time - b.time);
    return {turns: grouped(turns), keys};
}

// Marks of one family standing together fold into one group mark from this many
const GROUP_FROM = 3;
// a sequence's later step joins its run's marks while they are among this many of the chat's latest bubbles; further back it starts its own
const JOIN_WITHIN = 10;

const settledWords = (run) => {
    const settled = run.filter((r) => r.data.settled);
    return settled.length ? `, ${settled.length} ${settled[0].data.settled}` : "";
};

// what a card's marks fold by: one worker's own marks, else the family its kind belongs to, named with its count of updates so
// "Tasks: 3 updates" never reads as three tasks made, else the very same mark repeated
function cardGroup(t) {
    const look = {icon: t.data.icon, tone: t.data.tone, color: t.data.color, group: t.data.group, markIcon: t.data.markIcon};
    if (t.data.worker) return {...look, key: `worker:${t.data.worker}`, label: (n) => `${t.data.worker}: ${n} events`};
    const family = familyOf(t.data.shows);
    if (family) return {...look, key: `family:${family.key}`, label: (n, run) => `${family.title}: ${n} updates${settledWords(run)}`};
    return {...look, key: `card:${t.data.icon}:${t.data.label}`, label: (n, run) => `${n} × ${t.data.label}${settledWords(run)}`};
}

const GROUPS = {
    skill: () => ({key: "skill", icon: "book", markIcon: "skill", group: "agent", label: (n) => `${n} skills loaded`}),
    whisper: () => ({key: "whisper", icon: "rules", markIcon: "rule", group: "reminders", label: (n) => `${n} rules and reminders recalled`}),
    subagent: () => ({key: "subagent", icon: "agents", markIcon: "subagent", group: "agent", label: (n) => `${n} subagent updates`}),
    card: cardGroup,
};
const groupOf = (t) => (GROUPS[t.kind] ? GROUPS[t.kind](t) : null);

function groupTurn(first, run, look, title, more = {}) {
    return {
        key: `group:${first.key}`,
        kind: "group",
        who: "agent",
        time: Math.max(...run.map((t) => t.time)),
        data: {
            tone: run.every((t) => t.data.settled) ? "good" : look.tone || "",
            color: look.color || "",
            group: look.group || "",
            markIcon: look.markIcon || "",
            news: 0,
            continues: "",
            ...more,
        },
        title,
        text: "",
        icon: look.icon,
        turns: run,
    };
}

const folded = (run) => groupTurn(run[0], run, groupOf(run[0]), groupOf(run[0]).label(run.length, run));

// A run's marks, a sequence's steps or one subagent's actions, gathered wherever they arrive: in step order, one group mark from three of them or once it continues an earlier part
const runOf = (t) => t.data?.run || "";
const unitShown = (unit) => Boolean(unit.continues) || unit.turns.length >= GROUP_FROM;
const unitKey = (unit) => (unitShown(unit) ? `group:${unit.turns[0].key}` : unit.turns[0].key);

function unitTurns(unit) {
    const inOrder = [...unit.turns].sort((a, b) => a.data.step - b.data.step || a.time - b.time);
    if (!unitShown(unit)) return inOrder;
    const first = unit.turns[0];
    const title = unit.continues ? `${first.data.run_title}, continued` : `${first.data.run_title}: ${inOrder.length} ${first.data.run_noun}`;
    const look = {icon: first.data.icon, group: first.data.group, markIcon: first.data.run_mark};
    return [groupTurn(first, inOrder, look, title, {news: unit.news, continues: unit.continues})];
}

// a step joins its run's marks while they are among the latest bubbles, counted as news if other bubbles came in between; further back
// it starts a part of its own at the bottom, naming the part it continues
function gather(out, units, run, turn) {
    const unit = units.get(run);
    const at = unit ? out.indexOf(unit.place) : -1;
    if (unit && out.length - at <= JOIN_WITHIN) {
        if (at < out.length - 1) unit.news += 1;
        unit.turns.push(turn);
        return;
    }
    const place = {unit: {turns: [turn], news: 0, continues: unit ? unitKey(unit) : ""}};
    place.unit.place = place;
    units.set(run, place.unit);
    out.push(place);
}

function isCommandCard(turn) {
    return turn.kind === "card" && turn.data.shows === "commands";
}

function grouped(turns) {
    const out = [];
    const units = new Map();
    let run = [];
    const close = () => {
        out.push(...(run.length >= GROUP_FROM ? [folded(run)] : run));
        run = [];
    };
    for (const turn of turns) {
        if (isCommandCard(turn)) {
            close();
            out.push(turn);
            continue;
        }
        if (runOf(turn)) {
            close();
            gather(out, units, runOf(turn), turn);
            continue;
        }
        const key = groupOf(turn)?.key;
        if (!key || (run.length && groupOf(run[0]).key !== key)) close();
        if (key) run.push(turn);
        else out.push(turn);
    }
    close();
    return out.flatMap((item) => (item.unit ? unitTurns(item.unit) : [item]));
}

// The main chat: the user's and the main agent's own rows; a worker's and a subagent's messages live in their own chats.
export const mainChat = (messages) => messages.filter((m) => m.thread === "main");
