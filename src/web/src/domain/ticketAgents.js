import {rows} from "../sync/rows.js";

const STATES = {
    working: {word: "Working", dot: "running"},
    waiting: {word: "Waiting for you", dot: "you"},
    stuck: {word: "Stuck", dot: "failed"},
    stopped: {word: "Stopped", dot: ""},
    idle: {word: "Idle", dot: "queued"},
};
const PLAIN = ["stopped", "idle"];
const SILENT = /^silent for/;
const keyOf = (card) =>
    card.state === "running" ? "working" : PLAIN.includes(card.state) ? card.state : SILENT.test(card.reason || "") ? "stuck" : "waiting";

export const agentState = (card) => ({key: keyOf(card), ...STATES[keyOf(card)]});

export const workingCards = (lanes) =>
    (lanes || []).flatMap((lane) => lane.cards).filter((card) => card.type === "ticket" && card.session && card.state !== "done");

export const ticketOf = (n) => rows("ticket").find((ticket) => ticket.n === n) || null;
