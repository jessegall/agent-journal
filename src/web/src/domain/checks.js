import {seconds as secondsOf} from "./row.js";

const ESTIMATE_CAP = 95;

// A check's standing: its run under way, or its last run. The journal keeps only the last run, so there is no history.
export function checkState(check, now) {
    const running = check.running || {};
    const last = {time: secondsOf(check.last_ran_at), ok: check.last_passed === true, took: check.last_took, output: check.last_output, report: check.last_report};
    const runs = [];
    const expected = Number(last.took || 0);
    if (running.time) {
        const elapsed = Math.max(0, now - running.time);
        const reported = running.percent ?? null;
        const estimated = expected ? Math.min(ESTIMATE_CAP, (elapsed / expected) * 100) : null;
        return {
            verdict: "running",
            elapsed,
            percent: reported ?? estimated,
            measured: reported !== null,
            remaining: expected ? Math.max(0, expected - elapsed) : null,
            done: running.done ?? null,
            total: running.total ?? null,
            output: running.output || "",
            runs,
            last,
        };
    }
    return {
        verdict: !last.time ? "never" : last.ok ? "passed" : "failed",
        elapsed: 0,
        percent: null,
        remaining: null,
        output: last.output || "",
        runs,
        last,
    };
}

export function seconds(value) {
    const s = Math.round(Number(value || 0));
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

export const VERDICTS = {running: "Running", passed: "Passing", failed: "Failing", never: "Not run yet"};
