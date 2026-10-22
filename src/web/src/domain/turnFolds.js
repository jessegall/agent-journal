import {reportOf} from "./report.js";

// How tall each kind of chat message may stand before it folds, and how much of it shows folded, in pixels: a report from a
// worker or a subagent shows its first two lines, the user's words and the agent's keep the room they had.
export const TURN_FOLDS = {
    report: {at: 70, keep: 46},
    message: {at: 420, keep: 320},
};

export const turnFold = (turn) => (reportOf(turn) ? TURN_FOLDS.report : TURN_FOLDS.message);
