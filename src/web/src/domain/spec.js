import {computed} from "vue";
import {store} from "../state/store.js";

export const types = computed(() => (store.spec ? store.spec.priority.map((t) => ({name: t, ...store.spec.types[t]})) : []));
export const meta = (type) => store.spec.types[type];
export const word = (type, method) => meta(type).command_names[method] || method;
export const label = (type, field, fallback) => meta(type).labels[field] || fallback;

const NAMED_CLOSES = {
    plugin: "Remove plugin",
    environment: "Remove environment",
    phone: "Disconnect",
    share: "Stop sharing",
    question: "Answer",
    suggestion: "Accept or decline",
    worktree: "Remove worktree",
    helper: "Remove helper and its working copy",
};
const STOPS = {trigger: "It stops starting by itself.", sequence: "It stops starting by itself.", rule: "The agent stops following it."};

export const closeWord = (type) => NAMED_CLOSES[type] || "Close";
export const closeNote = (type) => `Moves it to Closed. ${STOPS[type] ? `${STOPS[type]} ` : ""}You can reopen it.`;
export const DELETE_NOTE = "It leaves every list. Its history stays in Activity.";

const EVENT_PHRASES = {
    created: "is created",
    completed: "is closed",
    requested: "is requested",
    revised: "is revised",
    commissioned: "is commissioned",
    started: "is started",
    paused: "is paused",
    resumed: "is resumed",
    finished: "is finished",
    plan_waits: "waits for its plan to be approved",
    checkpoint: "reaches a checkpoint",
    escalated: "is escalated",
};

export function eventWords(event) {
    const [type, action] = event.split(".");
    const noun = store.spec.types[type] ? meta(type).title.toLowerCase() : type;
    return action === "stuck" ? `a ${noun}'s agent is stuck` : `a ${noun} ${EVENT_PHRASES[action] || `has ${action}`}`;
}
