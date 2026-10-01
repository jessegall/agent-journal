export const MODES = [
    {key: "builder", label: "Builder", note: "The agent builds it itself, and sends helpers when a job is better done beside it."},
    {key: "orchestrator", label: "Orchestrator", note: "The agent plans, sends helpers to do the work, reviews and merges; it writes code only for reviews and small fixes."},
    {key: "solo", label: "Solo", note: "The agent does everything itself, with no helpers."},
];

export const DEFAULT_MODE = "builder";
export const ORCHESTRATOR = "orchestrator";
export const modeOf = (key) => MODES.find((mode) => mode.key === key) || MODES.find((mode) => mode.key === DEFAULT_MODE);
