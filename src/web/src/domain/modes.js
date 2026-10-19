// How the agent shares its work with workers, as the plan bar's buttons offer it; the journal keeps it as workers.mode.
export const MODES = [
    {key: "builder", label: "Builder", note: "The agent builds it itself, and sends workers when a job is better done beside it."},
    {key: "orchestrator", label: "Orchestrator", note: "The agent plans, hands the work to workers, then reviews and merges it; it writes code only for reviews and small fixes."},
    {key: "solo", label: "Solo", note: "The agent does everything itself, with no workers."},
];

export const DEFAULT_MODE = "builder";
