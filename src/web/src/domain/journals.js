import {api} from "../api/client.js";
import {ago, span} from "../format/time.js";
import {counted} from "../format/number.js";
import {SILENT, SILENT_WORD, stateOf} from "./agentState.js";

const THROWAWAY = [/\/pytest-of-[^/]+\//, /\/var\/folders\/.+\/T\/tmp[^/]*\/\.journal$/];
export const STATE_RANK = {working: 0, busy: 1, waiting: 1, compacting: 1, [SILENT]: 1, paused: 2, idle: 2, stopped: 3};
const ACTIVE = ["working", "busy", "waiting", "compacting"];

export const STATE_WORDS = {
    working: "Working",
    busy: "Busy",
    waiting: "Waiting",
    compacting: "Summarizing",
    paused: "Paused",
    idle: "Idle",
    [SILENT]: SILENT_WORD,
    stopped: "No agent",
};

export const COUNTS = [
    {key: "prompts", page: "", icon: "lock", one: "permission waits on you", many: "permissions wait on you", hot: true},
    {key: "questions", page: "question", icon: "help", one: "question waiting", many: "questions waiting", hot: true},
    {key: "messages", page: "message", icon: "mail", one: "unread message", many: "unread messages", hot: true},
    {key: "suggestions", page: "suggestion", icon: "bulb", one: "suggestion to review", many: "suggestions to review", hot: true},
    {key: "todos", page: "todo", icon: "todos", one: "open to-do", many: "open to-dos", hot: false},
];

const PLAN_ASKS = {
    ready: "waits for your approval",
    waiting: "waits for you to continue",
    done: "is finished and waits for you to close it",
};

export const isThrowaway = (j) => THROWAWAY.some((pattern) => pattern.test(j.root));

export const environmentsOf = (j) => (j.summary && j.summary.environments) || [];

export function worksOf(e) {
    const row = (w, completed) => ({...w, completed, data: {todo: w.todo}});
    const works = [];
    if (e.last && (!e.work || e.last.n !== e.work.n)) works.push(row(e.last, 1));
    if (e.work) works.push(row(e.work, 0));
    return works;
}

export const envState = (e) => (e.silent ? SILENT : stateOf(e.agent ? {data: e.agent} : null, worksOf(e)));

export const silentIn = (summary, name) => Boolean(((summary && summary.environments) || []).find((e) => e.name === name)?.silent);

export const isActive = (state) => ACTIVE.includes(state);

export function leadOf(j) {
    const envs = environmentsOf(j);
    const ranked = [...envs].sort((a, b) => STATE_RANK[envState(a)] - STATE_RANK[envState(b)] || (b.agent?.at || 0) - (a.agent?.at || 0));
    if (ranked.length && envState(ranked[0]) !== "stopped") return ranked[0];
    return envs.find((e) => e.name === j.summary.start) || envs[0] || null;
}

export function journalState(j) {
    const lead = j.gone || !j.summary ? null : leadOf(j);
    return lead ? envState(lead) : "stopped";
}

function workCaption(work) {
    const state = work.awaiting ? `waiting: ${work.awaiting}` : work.parked ? "parked" : "";
    return [state, work.todo ? `to-do ${work.todo}` : "work without a to-do"].filter(Boolean).join(" · ");
}

export function focusOf(e) {
    if (e.work) return {title: e.work.title, caption: workCaption(e.work), current: true, known: true};
    if (e.last)
        return {
            title: e.last.title,
            caption: [`finished ${ago(e.last.completed)}`, e.last.todo ? `to-do ${e.last.todo}` : ""].filter(Boolean).join(" · "),
            current: false,
            known: true,
        };
    return {title: "Nothing worked on yet", caption: "", current: false, known: false};
}

const building = (p) => p.status === "building";

export const planMeter = (p) => ({
    label: "Plan",
    title: p.title,
    figure: building(p) ? "" : `${p.done}/${p.rows}`,
    detail: building(p) ? "being written" : `phase ${p.current || 1} of ${p.phases}${p.phase ? ` · ${p.phase}` : ""}`,
    value: p.done,
    max: Math.max(1, p.rows),
    busy: building(p),
    tone: "muted",
});

export function idleSince(e) {
    if (envState(e) !== "idle" || !e.agent || !e.agent.at || (e.work && e.work.awaiting)) return 0;
    return e.agent.at;
}

export function idleNote(e, now) {
    const since = idleSince(e);
    return since ? `for ${span(now - since)}` : "";
}

export function agentLine(e) {
    if (!e.agent || envState(e) === "stopped") return "";
    return `${e.agent.model || e.agent.provider} · context ${Math.round(e.agent.context || 0)}%`;
}

export const countsOf = (counts) =>
    COUNTS.filter((c) => counts[c.key]).map((c) => ({...c, n: counts[c.key], text: counted(counts[c.key], c.one, c.many)}));

export function asksOf(j, e) {
    const server = api.journal(j);
    const counts = countsOf(e.counts)
        .filter((c) => c.hot)
        .map((c) => ({key: c.key, n: c.n, count: c.n, icon: c.icon, text: c.n === 1 ? c.one : c.many, href: server.page(e.name, c.page)}));
    const plans = e.plans
        .filter((p) => p.status in PLAN_ASKS)
        .map((p) => ({
            key: `plan-${p.n}`,
            n: 1,
            count: "",
            icon: "plan",
            text: `Plan “${p.title}” ${PLAN_ASKS[p.status]}`,
            href: server.page(e.name, "plan"),
        }));
    return [...counts, ...plans];
}

export function totalsOf(j) {
    return environmentsOf(j).reduce(
        (sum, e) => ({
            questions: sum.questions + e.counts.questions,
            messages: sum.messages + e.counts.messages,
            suggestions: sum.suggestions + e.counts.suggestions,
            todos: sum.todos + e.counts.todos,
        }),
        {questions: 0, messages: 0, suggestions: 0, todos: 0}
    );
}

export const projectPath = (j) => j.root.replace(/\/\.journal$/, "");

export const stoppedNote = (j) => (j.running ? "its viewer stopped answering" : `last seen ${ago(j.at)}`);

export const removeWords = (row) =>
    [
        row.live ? "An agent is running here." : "",
        `Removing moves all of ${row.title} into the archive.`,
        `Bring it back with journal environment unarchive ${row.title}.`,
    ]
        .filter(Boolean)
        .join(" ");

export function sweepWords(reply) {
    const found = /packs (.+) into the attic/.exec(String(reply));
    if (!found) return String(reply);
    if (found[1] === "nothing") return "There is nothing to archive.";
    return `Archiving moves ${found[1]} into the archive. Facts, rules, reminders, docs and open work stay.`;
}

export const sentence = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1) + ".";
