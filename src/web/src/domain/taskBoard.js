import {GROUPS, groupOf, planned, questionAbout, refParts} from "./records.js";
import {standingOf} from "./plans.js";
import {isClosed} from "./row.js";
import {counted} from "../format/number.js";

export const STATUS_WORDS = {...GROUPS, done: "Done"};
export const STATUS_ORDER = ["blocked", "asked", "started", "delegated", "parked", "open", "planned", "done"];
const WAIT_KINDS = {tasks: "task", questions: "question", checks: "command"};

export const statusOf = (task) => (isClosed(task) ? "done" : groupOf(task));

// What a blocked task waits on: the first open row it is linked to, or only the reason it was given.
export function waitOf(task) {
    if (task.state !== "blocked") return null;
    const ref = (task.waits || [])[0];
    if (!ref) return {kind: "reason", why: task.block_reason || ""};
    const {table, id} = refParts(ref);
    return {kind: WAIT_KINDS[table] || "command", id, ref, why: task.block_reason || ""};
}

const WAIT_LINES = {
    task: (w) => `Blocked by task ${w.id}`,
    question: (w) => `Waiting on question ${w.id}`,
    command: () => "Waiting for a command to pass",
    reason: (w) => `Blocked: ${w.why}`,
};

export function waitLine(task) {
    if (statusOf(task) === "asked") return `Question ${questionAbout(task).id} asks you about it`;
    const wait = waitOf(task);
    return wait ? WAIT_LINES[wait.kind](wait) : "";
}

const act = (name, label) => ({name, label});

const NEXT = {
    done: () => act("reopen", "Reopen"),
    started: () => act("finish", "Finish"),
    delegated: () => null,
    parked: () => act("start", "Resume"),
    asked: (t) => act("answer", `Answer question ${questionAbout(t).id}`),
    blocked: (t) => {
        const wait = waitOf(t);
        if (wait.kind === "task") return act("goto", `Go to task ${wait.id}`);
        if (wait.kind === "question") return act("answer", `Answer question ${wait.id}`);
        return act("unblock", "Unblock");
    },
    open: () => act("start", "Start"),
    planned: () => act("start", "Start"),
};

export const nextAct = (task) => NEXT[statusOf(task)](task);

const OTHERS = {
    started: () => [act("suspend", "Pause"), act("block", "Block")],
    open: () => [act("block", "Block")],
    planned: () => [act("block", "Block")],
    asked: () => [act("start", "Start")],
    blocked: (t) => (["task", "question"].includes(waitOf(t).kind) ? [act("unblock", "Unblock")] : []),
};

export const otherActs = (task) => (OTHERS[statusOf(task)] || (() => []))(task);

// The question a task's next step answers: the one that asks about it, or the one it waits on.
export const questionOf = (task) =>
    statusOf(task) === "asked" ? questionAbout(task).id : waitOf(task)?.kind === "question" ? waitOf(task).id : 0;

export function matches(task, words) {
    const q = words.trim().toLowerCase();
    return !q || String(task.id) === q || task.title.toLowerCase().includes(q) || (task.brief || "").toLowerCase().includes(q);
}

// The tasks the list shows: those of the statuses picked, or every one not done unless done ones are asked for.
export function shownTasks(tasks, {statuses, display, words}) {
    const fits = (t) => (statuses.length ? statuses.includes(statusOf(t)) : display.showDone || statusOf(t) !== "done");
    return tasks.filter((t) => fits(t) && matches(t, words));
}

const head = (key, depth, label, note, extra = {}) => ({type: "head", key, depth, label, note, ...extra});
const rowLines = (tasks, depth) => tasks.map((task) => ({type: "row", key: `t${task.id}`, depth, task}));

function phaseLines(plan, shown, all, folded) {
    const phases = plan.phases || [];
    const lines = [];
    phases.forEach((phase, i) => {
        const rows = shown.filter((t) => phase.task_ids.includes(t.id));
        if (!rows.length) return;
        const key = `p${plan.id}-${i + 1}`;
        if (phases.length > 1) {
            const inPhase = all.filter((t) => phase.task_ids.includes(t.id));
            lines.push(
                head(
                    key,
                    1,
                    `Phase ${i + 1} of ${phases.length}: ${phase.title}`,
                    `${inPhase.filter((t) => t.state === "done").length} of ${inPhase.length} done`
                )
            );
            if (folded[key]) return;
        }
        lines.push(...rowLines(rows, phases.length > 1 ? 2 : 1));
    });
    const loose = shown.filter((t) => !phases.some((p) => p.task_ids.includes(t.id)));
    return [...lines, ...rowLines(loose, 1)];
}

function byPlan(shown, all, plans, folded) {
    const lines = [];
    for (const plan of plans) {
        const mine = shown.filter((t) => t.plan_id === plan.id);
        if (!mine.length) continue;
        const key = `p${plan.id}`;
        const note = planned(mine[0]) ? "Waiting for your approval" : standingOf(plan, all).title;
        lines.push(head(key, 0, plan.title, note, {number: `Plan ${plan.id}`}));
        if (!folded[key])
            lines.push(
                ...phaseLines(
                    plan,
                    mine,
                    all.filter((t) => t.plan_id === plan.id),
                    folded
                )
            );
    }
    const loose = shown.filter((t) => !plans.some((p) => p.id === t.plan_id));
    if (loose.length) {
        lines.push(head("p0", 0, "Not in a plan", counted(loose.length, "task")));
        if (!folded.p0) lines.push(...rowLines(loose, 1));
    }
    return lines;
}

function byStatus(shown, folded) {
    return STATUS_ORDER.flatMap((status) => {
        const rows = shown.filter((t) => statusOf(t) === status);
        if (!rows.length) return [];
        const key = `s${status}`;
        return [head(key, 0, STATUS_WORDS[status], String(rows.length), {status}), ...(folded[key] ? [] : rowLines(rows, 1))];
    });
}

const GROUPINGS = {
    plan: ({shown, all, plans, folded}) => byPlan(shown, all, plans, folded),
    status: ({shown, folded}) => byStatus(shown, folded),
    none: ({shown}) => rowLines(shown, 0),
};

// The list as lines in the order they are drawn: a head for each group and phase, and a row for each task under one not folded.
export const boardLines = (grouping, parts) => GROUPINGS[grouping](parts);

const choice = (status, label, act, note) => ({status, label, act, note});
const CHOICES = [
    (s) =>
        choice("open", "Open", s === "blocked" ? "unblock" : s === "done" ? "reopen" : "", "Only a blocked or done task goes back to open"),
    (s) => choice("started", "In progress", ["open", "planned", "asked", "parked"].includes(s) ? "start" : "", "Unblock it first"),
    (s) => choice("parked", "Paused...", s === "started" ? "suspend" : "", "Only a task in progress can be paused"),
    (s) => choice("blocked", "Blocked...", ["done", "blocked"].includes(s) ? "" : "block", "It is blocked already"),
    (s) => choice("done", "Done...", s === "done" ? "" : "finish", "It is done already"),
];
const CURRENT = {open: ["open", "asked", "planned"]};

// The statuses a task can be moved to from the one it has, each with the act that moves it there, or why it cannot.
export function statusChoices(task) {
    const status = statusOf(task);
    return CHOICES.map((made) => made(status)).map((c) => ({...c, current: (CURRENT[c.status] || [c.status]).includes(status)}));
}

// The rest of what can be done to a task, for its More menu.
export function moreActs(task) {
    const status = statusOf(task);
    const next = nextAct(task);
    return [
        ...(["done", "blocked"].includes(status) ? [] : [act("block", "Blocked by a task...")]),
        ...(status === "blocked" ? [act("unblock", "Unblock")] : []),
        ...(["answer", "goto"].includes(next.name) ? [next] : []),
        act("edit", "Edit the title and brief"),
    ];
}
