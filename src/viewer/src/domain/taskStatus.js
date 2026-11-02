const FINISHED_STATES = new Set(["completed", "cancelled"]);

export const isFinished = (state) => FINISHED_STATES.has(state);
export const statusIcon = (state) => (isFinished(state) ? "done" : state);
