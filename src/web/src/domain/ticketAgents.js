import {rows} from "../sync/rows.js";

const STATES = {
    working: {word: "Working", dot: "running"},
    waiting: {word: "Waiting for you", dot: "you"},
    stuck: {word: "Stuck", dot: "failed"},
};
const SILENT = /^silent for/;
const keyOf = (card) => (card.state === "running" ? "working" : SILENT.test(card.reason || "") ? "stuck" : "waiting");

export const agentState = (card) => ({key: keyOf(card), ...STATES[keyOf(card)]});

export const workingCards = (lanes) => (lanes || []).flatMap((lane) => lane.cards).filter((card) => card.type === "ticket" && card.session);

export const ticketOf = (n) => rows("ticket").find((ticket) => ticket.n === n) || null;
