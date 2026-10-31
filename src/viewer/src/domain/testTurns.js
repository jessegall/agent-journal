import {seconds} from "./row.js";
import {span} from "../format/time.js";

// The workers' queued test runs and builds: those running first, then those waiting, each oldest first,
// with its worker, the test ids it named and how long it has run or waited.

const turnLine = (turn, names, now) => {
    const running = turn.state === "running";
    const since = running ? turn.started_at : seconds(turn.created_at);
    return {
        key: turn.id,
        state: turn.state,
        worker: names.get(turn.worker) || `Worker ${turn.worker}`,
        ids: turn.ids,
        time: `${running ? "running" : "waiting"} ${span(Math.max(0, now - since))}`,
    };
};

export function turnLines(turns, workers, now) {
    const names = new Map(workers.map((worker) => [worker.id, worker.name || `Worker ${worker.id}`]));
    const ordered = [...turns.filter((turn) => turn.state === "running"), ...turns.filter((turn) => turn.state === "waiting")];
    return ordered.map((turn) => turnLine(turn, names, now));
}

// the budget's numbers as the settings name them, the most turns that may wait left out when no limit is set
export function budgetLine(workers) {
    const settings = workers || {};
    return [
        `${settings.test_runs ?? 3} runs at once`,
        settings.test_waiting ? `${settings.test_waiting} may wait` : "",
        `${settings.tests_per_run ?? 20} test ids a run`,
        `${settings.test_run_minutes ?? 10} minutes a run`,
    ]
        .filter(Boolean)
        .join(" · ");
}
