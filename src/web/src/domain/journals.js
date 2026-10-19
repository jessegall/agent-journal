import {counted} from "../format/number.js";
import {SILENT, SILENT_WORD, stateOf} from "./agentState.js";

const ACTIVE = ["working", "busy", "waiting", "compacting"];

export const STATE_WORDS = {
    working: "Working",
    busy: "Busy",
    waiting: "Waiting",
    compacting: "Compacting",
    idle: "Idle",
    [SILENT]: SILENT_WORD,
    stopped: "No agent",
};

const COUNTS = [
    {key: "questions", page: "questions", icon: "help", one: "question waiting", many: "questions waiting", hot: true},
    {key: "messages", page: "messages", icon: "mail", one: "unread message", many: "unread messages", hot: true},
    {key: "tasks", page: "tasks", icon: "todos", one: "open task", many: "open tasks", hot: false},
];

// How an environment stands, as the summary tells it: its agent's state, or silent when a busy agent went quiet.
export const envState = (standing) => (standing.silent ? SILENT : stateOf(standing.agent));

export const isActive = (state) => ACTIVE.includes(state);

export const countsOf = (standing) => COUNTS.filter((c) => standing[c.key]).map((c) => ({...c, n: standing[c.key], text: counted(standing[c.key], c.one, c.many)}));

export const removeWords = (environment, live) =>
    [live ? "Agent: running" : "", `Removing ${environment.name} deletes everything recorded in it.`].filter(Boolean).join(" ");

export const sentence = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1) + ".";
