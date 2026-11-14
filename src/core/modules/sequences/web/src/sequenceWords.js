import {startWords} from "./sequenceTriggers.js";

// what the Sequences page says about a sequence and its runs, from the rows the board reads
const stepsOfRun = (run) => JSON.parse(run.steps);
export const runsOf = (sequence, runs) => runs.filter((run) => run.sequence_id === sequence.id);
export const triggersOf = (sequence) => JSON.parse(sequence.triggers || "[]");

// a run has done the steps before the one it is on
export const progress = (run) => ({done: run.step_number - 1, total: stepsOfRun(run).length});

// the agent's run that moves when a run is given up is its newest one, so only that run can be given up
export const canAbandon = (run, runs) => run.id === Math.max(...runs.filter((other) => other.session_agent_id === run.session_agent_id).map((other) => other.id));

export function rowLine(sequence, runs) {
    const running = runsOf(sequence, runs).length;
    return `${sequence.steps.length} steps · ${running ? `${running} running now` : startWords(triggersOf(sequence))[0]}`;
}
