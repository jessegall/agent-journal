import {workMode} from "../composables/settings.js";
import {rows} from "../sync/rows.js";
import {ORCHESTRATOR} from "./modes.js";

const STATES = {
    working: {word: "Working", dot: "running"},
    waiting: {word: "Needs you", dot: "you"},
    stuck: {word: "Stuck", dot: "failed"},
    stopped: {word: "Stopped", dot: ""},
    idle: {word: "Idle", dot: "queued"},
};
const PLAIN = ["stopped", "idle"];
const SILENT = /^silent for/;
const keyOf = (card) =>
    card.state === "running" ? "working" : PLAIN.includes(card.state) ? card.state : SILENT.test(card.reason || "") ? "stuck" : "waiting";

const wordIn = (key, mode) => (key === "waiting" && mode === ORCHESTRATOR ? "Waits for answer" : STATES[key].word);

export const agentState = (card, mode = workMode.value) => ({key: keyOf(card), ...STATES[keyOf(card)], word: wordIn(keyOf(card), mode)});

export const workingCards = (lanes) =>
    (lanes || []).flatMap((lane) => lane.cards).filter((card) => card.type === "ticket" && card.session && card.state !== "done");

export const ticketOf = (n) => rows("ticket").find((ticket) => ticket.n === n) || null;
