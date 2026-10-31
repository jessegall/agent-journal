import {agent} from "../composables/leadAgent.js";
import {store} from "../state/store.js";
import {followServer, updating} from "../state/updating.js";
import {isActive} from "../domain/journals.js";
import {api} from "../api/client.js";
import {sharedData} from "../api/shared.js";
import {PAGE, takeEntries} from "./rows.js";
import {barOn} from "../composables/settings.js";
import {loadPhones} from "../composables/phones.js";
import {checkTunnel} from "../composables/shares.js";
import {RECENT, pageOf} from "./paging.js";
import {reviewSteps} from "../domain/reviewer.js";
import {updatedAt} from "../domain/row.js";

const LIVE = 5;
const BUSY_EVERY = 500;
const CALM_EVERY = 3000;
const ASK_EVERY = 1500;
const newest = () => (store.entries.length ? store.entries[store.entries.length - 1].id : 0);
const polledTo = {env: "", id: 0};
const busy = () => Boolean(store.bar && store.bar.length) || isActive(agent.value && agent.value.status);

// the cards docked above a chat, read apart from its pages so a card older than the newest page is still drawn
function readDockedCards({session}) {
    return (session ? api.chat(session, {docked: true}) : api.list("messages", {docked: true})).then((got) => got.rows || []);
}

// the steps of every reviewer the journal sent here, read from each one's own chat, its newest steps
function readReviewSteps() {
    return api
        .list("reviewers", {limit: 20})
        .then((got) => Promise.all((got.rows || []).filter((row) => row.session).map((row) => api.chat(row.session, {limit: RECENT}))))
        .then(reviewSteps);
}

function pollEntries() {
    if (polledTo.env !== api.env()) Object.assign(polledTo, {env: api.env(), id: newest()});
    return api.entries(polledTo.id);
}

function takePolled(fresh) {
    if (!fresh.length) return;
    polledTo.id = fresh[fresh.length - 1].id;
    takeEntries(fresh);
}

async function heldElsewhere({scope, table, id}) {
    await scope.holding(table, [id]);
    await scope.recent("messages", PAGE);
}

// The workers a poll holds, per poll and environment: each round asks only for the rows changed since the newest it holds, as
// the watch rewrites a running worker every few seconds, and reads the whole page again when more changed than a page holds.
const heldWorkers = new Map();

async function workerChanges(key, limit) {
    const place = `${key}:${api.env()}`;
    const held = heldWorkers.get(place);
    if (!held) return keptWorkers(place, (await api.list("workers", {limit})).rows || []);
    const since = Math.max(0, ...held.map(updatedAt));
    const after = held.length ? Math.min(...held.map((row) => row.id)) - 1 : 0;
    const got = await api.list("workers", {limit, since, after});
    if (!got.is_last_page) {
        heldWorkers.delete(place);
        return workerChanges(key, limit);
    }
    const fresh = new Set(got.rows.map((row) => row.id));
    return keptWorkers(
        place,
        [...held.filter((row) => !fresh.has(row.id)), ...got.rows].sort((one, other) => one.id - other.id)
    );
}

const keptWorkers = (place, rows) => {
    heldWorkers.set(place, rows);
    return rows;
};

// Every poller the viewer runs, declared once here and nowhere else, and never at runtime: its key, what it reads from the
// params its users hand it, and how often in milliseconds (or a function of the moment). One that runs per agent or per row
// names in `by` the part of its params that tells one run from another. One the whole app holds keeps its answer in the
// store with `take`. An on-demand poller (`demand`) has no interval: it reads once when asked, pausing the poller it names
// in `pauses` for the length of its own read, so the two never pull at the same time. Any poller may declare `least`, the milliseconds
// between two reads of one run; an on-demand one that does not reads at most once a second.
// the newest agents, listed as plain rows and then read whole by their ids, since an index carries no row's details
async function wholeAgents(client, limit) {
    const page = await client.list("agents", {limit});
    const ids = page.rows.map((row) => row.id);
    return ids.length ? client.list("agents", {ids}) : page;
}

export const POLLERS = Object.freeze({
    "status.bar": {
        read: () => api.bar(),
        every: () => (busy() ? BUSY_EVERY : CALM_EVERY),
        take: (got) => Array.isArray(got) && (store.bar = got),
        active: () => barOn.value,
    },
    "agents.index": {read: () => wholeAgents(api, LIVE), every: 1000, take: (got) => (store.agents = got.rows)},
    "agents.live": {read: () => api.liveAgents(), every: 5000, take: (got) => (store.live = got)},
    "status.summary": {
        read: () => api.summary(),
        every: () => (updating.countdown || updating.external || updating.version ? 1000 : 4000),
        take: (got) => {
            store.summary = got;
            followServer(got);
        },
    },
    "journal.manifest": {read: () => api.manifest(), every: 30000, take: (got) => (store.spec = got)},
    "journals.index": {read: () => api.journals(), every: 10000, take: (got) => (store.journals = got)},
    "people.index": {read: () => api.people(), every: 30000, take: (got) => got && got.people && (store.people = got)},
    "entries.recent": {read: pollEntries, every: 1000, take: takePolled},
    "phones.index": {read: () => loadPhones(), every: 30000},
    "phones.pairing": {read: () => loadPhones(), every: ASK_EVERY},
    "phone.tunnel": {read: () => api.tunnelAnswering(), every: ASK_EVERY},
    "phone.tunnel.problems": {read: () => checkTunnel(), every: ASK_EVERY * 2},
    "shares.services": {read: () => api.services(), every: 5000},
    "outputs.running": {read: () => api.runningOutputs(), every: 3000},
    "messages.docked": {read: readDockedCards, every: 1000, by: ({session}) => session || "main"},
    "mcp.servers": {read: () => api.mcp(), every: 30000},
    "developer.readers": {read: () => api.developerReaders(), every: 5000},
    "share.page": {read: () => sharedData(), every: 20000},
    "outbox.retry": {read: ({retry}) => retry(), every: 5000},
    "tour.start": {read: ({clear}) => clear(), every: 800},
    "workers.index": {read: () => workerChanges("workers.index", pageOf("workers")), every: 5000},
    "workers.activity": {read: () => api.workerActivity().then((got) => got.rows || []), every: 5000},
    "workers.every": {read: () => workerChanges("workers.every", 200), every: 5000},
    "verifiers.every": {read: () => api.list("verifiers", {limit: 200}).then((got) => got.rows || []), every: 5000},
    "reviewers.every": {read: () => api.list("reviewers", {limit: 200}).then((got) => got.rows || []), every: 5000},
    "reviewer.steps": {read: readReviewSteps, every: 3000},
    "tests.turns": {read: () => api.list("test_turns", {limit: pageOf("test_turns")}).then((got) => got.rows || []), every: 3000},
    "rows.shown": {read: ({table, ids}) => api.list(table, {ids}).then((got) => got.rows || []), every: 10000, by: ({table, ids}) => `${table}:${ids.join(",")}`},
    "workers.shown": {read: ({ids}) => (ids.length ? api.list("workers", {ids}).then((got) => got.rows || []) : Promise.resolve([])), every: 5000, by: ({ids}) => ids.join(",")},
    "workers.holding": {read: ({tasks}) => (tasks.length ? api.list("workers", {tasks}).then((got) => got.rows || []) : Promise.resolve([])), every: 5000, by: ({tasks}) => tasks.join(",")},
    "plugin.dashboard": {read: ({plugin}) => api.pluginDashboard(plugin), every: 10000, by: ({plugin, board}) => `${plugin}:${board}`},
    "plan.timeline": {read: ({scope, plan}) => scope.api.planTimeline(plan), every: 15000, by: ({scope, plan}) => `${scope.env}:${plan}`},
    "reader.elsewhere": {read: heldElsewhere, every: 5000, by: ({scope, table, id}) => `${scope.env}:${table}:${id}`},
    "inspector.agents": {read: ({client}) => wholeAgents(client, 20), every: 5000, by: ({client}) => client.env()},
    "inspector.rows": {read: ({scope, tables}) => scope.recentAll(tables, 50), every: 5000, by: ({scope}) => scope.env},
    "agent.terminal": {read: ({client, agent, after}) => client.terminal(agent, after), every: 2000, by: ({client, agent}) => `${client.env()}:${agent}`},
    "agent.transcript": {
        read: ({client, agent, session, since}) => client.transcript(agent, session, {since, last: PAGE}),
        every: 3000,
        by: ({client, agent, session}) => `${client.env()}:${agent}:${session || ""}`,
    },
    "rows.older": {read: ({scope, table}) => scope.earlier(table), demand: true, by: ({scope, table}) => `${scope.env}:${table}`},
    "agent.transcript.older": {read: ({client, agent, session, before}) => client.transcript(agent, session, {before, last: PAGE}), demand: true, pauses: "agent.transcript"},
    "worker.chat": {read: ({scope}) => scope.chat.refresh(), every: 3000, by: ({scope}) => scope.chat.session},
    "agent.edits": {read: ({client, agent, cursor}) => client.edits(agent, cursor), every: 2000, by: ({client, agent}) => `${client.env()}:${agent}`},
    "agent.edits.older": {read: ({client, agent, before}) => client.edits(agent, 0, {before}), demand: true, pauses: "agent.edits"},
});
