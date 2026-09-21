const ESTIMATE_CAP = 95;

export function checkState(check, now) {
    const data = check.data || {};
    const running = data.running || {};
    const last = data.last || {};
    const runs = data.runs || [];
    const expected = Number(last.took || 0);
    if (running.at) {
        const elapsed = Math.max(0, now - running.at);
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
            said: running.said || "",
            runs,
            last,
        };
    }
    return {
        verdict: !last.at ? "never" : last.ok ? "passed" : "failed",
        elapsed: 0,
        percent: null,
        remaining: null,
        said: last.said || "",
        runs,
        last,
    };
}

export function seconds(value) {
    const s = Math.round(Number(value || 0));
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

export const VERDICTS = {running: "Running", passed: "Passing", failed: "Failing", never: "Not run yet"};
