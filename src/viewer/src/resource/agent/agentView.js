import {dated, elapsed, perHour} from "../../format/time.js";

const MAIN_TITLE = "Main agent";
const NOT_KNOWN = "Not known";
const HIGH_CONTEXT_PERCENT = 80;
const MILLISECONDS_PER_SECOND = 1000;
const WORKER_ROLE = "worker";
const MAIN_ROLE = "main";
const WAITING_STATES = new Set(["waiting", "blocked", "at usage limit"]);

// the rows a list read gave, and how many rows the list holds in all; a read that failed gave none
export const rowsOf = (answer) => (answer.ok ? answer.value.rows : []);
export const totalOf = (answer) => (answer.ok ? answer.value.total : 0);

const capital = (word) => word.slice(0, 1).toUpperCase() + word.slice(1);

// the title band says the role and the number once; the main agent has no number to say
export const agentTitle = (row) => (row.role === MAIN_ROLE ? MAIN_TITLE : `${capital(row.role)} ${row.id}`);

export const givenName = (row, facts) => facts?.given_name || capital(facts?.profile_title || facts?.profile || row.role);

// what its dot shows: it ended, it waits for something, or it runs
export const agentState = (row, facts) => (row.ended_at ? "ended" : row.paused_at || WAITING_STATES.has(facts?.state) ? "waiting" : "running");

const completedCount = (facts) => (facts?.tasks ?? []).filter((task) => task.state === "completed").length;

// the cells of the strip: the time it has run, what it uses and costs, how fast it finishes tasks, and how many of its runs went wrong
export function stripCells({row, facts, inspection, now}) {
    const ended = Boolean(row.ended_at);
    const seconds = ((ended ? Date.parse(row.ended_at) : now) - Date.parse(row.process_started_at || row.created_at)) / MILLISECONDS_PER_SECOND;
    const cells = [{key: "time", label: ended ? "Ran for" : "Running for", value: elapsed(seconds)}];
    if (Number.isFinite(facts?.context_percent)) cells.push({key: "context", label: "Context used", value: `${facts.context_percent}%`, meter: facts.context_percent, high: facts.context_percent > HIGH_CONTEXT_PERCENT});
    if (facts) cells.push({key: "cost", label: "Cost", value: facts.cost_dollars === null ? NOT_KNOWN : `$${facts.cost_dollars.toFixed(2)}`});
    if (row.role === WORKER_ROLE) cells.push({key: "pace", label: "Tasks an hour", value: String(perHour(completedCount(facts), row.process_started_at || row.created_at, row.ended_at, now))});
    if (row.role === MAIN_ROLE && inspection.plan) cells.push({key: "done", label: "Tasks done", value: `${inspection.plan.done} of ${inspection.plan.total}`});
    cells.push({key: "failed", label: "Failed runs", value: String(inspection.failed_runs), bad: inspection.failed_runs > 0});
    return cells;
}

// what an ended agent did with its tasks, in words
export function finishedWords(facts) {
    const done = completedCount(facts);
    return done ? `Finished ${done} ${done === 1 ? "task" : "tasks"}` : "It finished no task.";
}

// every field of the agent with a plain label; the raw fields stay behind the Details fold
export function detailRows(row, inspection) {
    const rows = [["Number", String(row.id)], ["Session", row.session, "code"], ["Program", row.program], ["Type", row.role]];
    if (row.parent_id) rows.push(["Parent agent", `Agent ${row.parent_id}`]);
    rows.push(["Started by", inspection.started_by], ["Started", dated(row.created_at)]);
    if (row.ended_at) rows.push(["Ended", dated(row.ended_at)]);
    if (row.pid) rows.push(["Process", `pid ${row.pid}`]);
    return rows;
}
