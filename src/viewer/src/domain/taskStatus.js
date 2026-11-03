const FINISHED_STATES = new Set(["completed", "cancelled"]);

const isFinished = (state) => FINISHED_STATES.has(state);
export const statusIcon = (state) => (isFinished(state) ? "done" : state);
