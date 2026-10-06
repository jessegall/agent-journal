import {helperWord} from "../composables/helperWords.js";

export const MODES = [
    {
        key: "builder",
        label: "Builder",
        get note() {
            return `The agent builds it itself, and sends ${helperWord(2)} when a job is better done beside it.`;
        },
    },
    {
        key: "orchestrator",
        label: "Orchestrator",
        get note() {
            return `The agent plans, hands the work to ${helperWord(2)}, then reviews and merges it; it writes code only for reviews and small fixes.`;
        },
    },
    {
        key: "solo",
        label: "Solo",
        get note() {
            return `The agent does everything itself, with no ${helperWord(2)}.`;
        },
    },
];

export const DEFAULT_MODE = "builder";
export const ORCHESTRATOR = "orchestrator";
export const modeOf = (key) => MODES.find((mode) => mode.key === key) || MODES.find((mode) => mode.key === DEFAULT_MODE);
