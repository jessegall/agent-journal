// How the agent shares its work with workers, as the plan bar's buttons offer it; the journal keeps it as workers.mode.
export const MODES = [
    {key: "builder", label: "Builder", note: "The agent builds the work itself and sends workers for jobs better done beside it."},
    {key: "orchestrator", label: "Orchestrator", note: "The agent plans, hands tasks to workers and reviews their work."},
    {key: "solo", label: "Solo", note: "The agent does all the work itself, with no workers."},
];

export const DEFAULT_MODE = "builder";

