import {capitalised, helperCount, helperWord} from "../composables/helperWords.js";
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
    get helper() {
        return `Remove ${helperWord()} and its working copy`;
    },
};
const STOPS = {trigger: "It stops running.", sequence: "It stops starting by itself.", rule: "The agent stops following it."};

export const closeWord = (type) => NAMED_CLOSES[type] || `Close the ${meta(type).title.toLowerCase()}`;
export const closeNote = (type) => `Moves it to Closed. ${STOPS[type] ? `${STOPS[type]} ` : ""}You can reopen it.`;
export const MENUED = ["rule", "fact", "trigger"];
export const DELETE_NOTE = "It leaves every list. Its history stays in Activity.";
