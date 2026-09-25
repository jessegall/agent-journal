import {computed, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {usePoll} from "../poll.js";
import {age} from "../format/time.js";
import {stateOf} from "../layout/statusline.js";

const LINGER = 60000;
const SCAN_EVERY = 2000;
const REFRESH_EVERY = 1000;
const STALE_AFTER = 10000;
const STREAMS_PER_JOURNAL = 3;
const THROWAWAY = [/\/pytest-of-[^/]+\//, /\/var\/folders\/.+\/T\/tmp[^/]*\/\.journal$/];
const RANK = {working: 0, busy: 1, waiting: 1, compacting: 1, paused: 2, idle: 2, stopped: 3};
const ACTIVE = ["working", "busy", "waiting", "compacting"];

export const STATE_WORDS = {
    working: "Working",
    busy: "Busy",
    waiting: "Waiting",
    compacting: "Compacting",
    paused: "Paused",
    idle: "Idle",
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

export const counted = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const ago = (at) => (age(at) === "now" ? "just now" : `${age(at)} ago`);

export const isThrowaway = (j) => THROWAWAY.some((pattern) => pattern.test(j.root));

export const environmentsOf = (j) => (j.summary && j.summary.environments) || [];

export function worksOf(e) {
    const row = (w, completed) => ({...w, completed, data: {todo: w.todo}});
    const works = [];
    if (e.last && (!e.work || e.last.n !== e.work.n)) works.push(row(e.last, 1));
    if (e.work) works.push(row(e.work, 0));
    return works;
}

export const envState = (e) => stateOf(e.agent ? {data: e.agent} : null, worksOf(e));

export const isActive = (state) => ACTIVE.includes(state);

export function leadOf(j) {
    const envs = environmentsOf(j);
    const ranked = [...envs].sort((a, b) => RANK[envState(a)] - RANK[envState(b)] || (b.agent?.at || 0) - (a.agent?.at || 0));
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

const journals = ref([]);
const loaded = ref(false);
const running = computed(() => journals.value.filter((j) => j.running));
const online = computed(() =>
    journals.value
        .filter((j) => j.running && !j.gone && (j.summary || j.unreadable))
        .sort((a, b) => RANK[journalState(a)] - RANK[journalState(b)] || a.project.localeCompare(b.project))
);
const stopped = computed(() => journals.value.filter((j) => !j.running || j.gone));
const needs = computed(() =>
    online.value
        .flatMap((j) => environmentsOf(j).map((e) => ({key: `${j.root}:${e.name}`, journal: j, env: e, asks: asksOf(j, e)})))
        .filter((item) => item.asks.length)
);
const tally = computed(() => {
    const states = online.value.flatMap(environmentsOf).map(envState);
    return {
        journals: online.value.length,
        stopped: stopped.value.length,
        agents: states.filter((s) => s !== "stopped").length,
        working: states.filter(isActive).length,
        idle: states.filter((s) => s === "idle").length,
        needs: needs.value.reduce((sum, item) => sum + item.asks.reduce((n, ask) => n + ask.n, 0), 0),
        todos: online.value.reduce((sum, j) => sum + totalsOf(j).todos, 0),
    };
});
const streams = new Map();
const waiting = new Map();
let scanning = false;

const asking = new Map();

function refresh(j) {
    if (!asking.has(j.root))
        asking.set(
            j.root,
            reread(j).finally(() => asking.delete(j.root))
        );
    return asking.get(j.root);
}

async function reread(j) {
    if (!j.running) {
        j.summary = null;
        j.unreadable = false;
        return;
    }
    try {
        j.summary = await api.journal(j).summary();
        j.gone = 0;
        j.fresh = Date.now();
        j.unreadable = false;
    } catch (e) {
        j.unreadable = true;
    }
}

function soon(j) {
    if (waiting.has(j.root)) return;
    waiting.set(
        j.root,
        setTimeout(() => {
            waiting.delete(j.root);
            refresh(j);
        }, REFRESH_EVERY)
    );
}

function listenTo(j) {
    const watched = j.running && !j.current ? environmentsOf(j).filter((e) => e.name === j.summary.start || envState(e) !== "stopped") : [];
    const envs = watched.slice(0, STREAMS_PER_JOURNAL).map((e) => e.name);
    const have = streams.get(j.root) || new Map();
    for (const name of envs) {
        if (have.has(name)) continue;
        const source = api.journal(j).in(name).stream();
        source.onmessage = () => soon(j);
        have.set(name, source);
    }
    for (const [name, source] of have) {
        if (envs.includes(name)) continue;
        source.close();
        have.delete(name);
    }
    streams.set(j.root, have);
}

function drop(root) {
    for (const source of (streams.get(root) || new Map()).values()) source.close();
    streams.delete(root);
    clearTimeout(waiting.get(root));
    waiting.delete(root);
    journals.value = journals.value.filter((j) => j.root !== root);
}

async function forget(j) {
    await api.forgetJournal(j.root);
    drop(j.root);
}

async function rescan() {
    const listed = (await api.journals())
        .map((got) => ({...got, current: got.port === Number(location.port)}))
        .filter((got) => got.current || !isThrowaway(got));
    const found = listed.filter(
        (got) => got.current || !listed.some((other) => other.root === got.root && (other.current || other.port < got.port))
    );
    for (const got of found) {
        let j = journals.value.find((x) => x.port === got.port);
        if (!j) {
            j = reactive({...got, summary: null, gone: 0, unreadable: false});
            journals.value.push(j);
            await refresh(j);
        } else {
            const changed = got.version !== j.version;
            Object.assign(j, got);
            if (j.gone || (j.unreadable && changed) || Date.now() - (j.fresh || 0) > STALE_AFTER) await refresh(j);
        }
        listenTo(j);
    }
    for (const j of [...journals.value]) {
        if (found.some((got) => got.port === j.port)) continue;
        j.gone = j.gone || Date.now();
        if (Date.now() - j.gone > LINGER) drop(j.root);
    }
    journals.value.sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0) || a.project.localeCompare(b.project));
    loaded.value = true;
}

async function scan() {
    if (scanning) return;
    scanning = true;
    try {
        await rescan();
    } finally {
        scanning = false;
    }
}

let users = 0;

export function useHub() {
    watch(
        () => store.events,
        () => {
            const mine = journals.value.find((j) => j.current);
            if (mine) soon(mine);
        }
    );

    usePoll("hub", scan, SCAN_EVERY);
    onMounted(() => users++);
    onUnmounted(() => {
        users--;
        if (users) return;
        for (const j of [...journals.value]) drop(j.root);
        loaded.value = false;
    });

    return {journals, loaded, running, online, stopped, needs, tally, refresh, forget};
}
