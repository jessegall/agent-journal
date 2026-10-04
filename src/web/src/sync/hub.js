import {reactive} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {startPoll} from "../composables/poll.js";
import {envState, environmentsOf, isThrowaway} from "../domain/journals.js";

const LINGER = 60000;
const SUMMARY_EVERY = 5000;
const STALE_AFTER = 10000;
const STREAMS_PER_JOURNAL = 3;

const streams = new Map();
const summaryPolls = new Map();
let scanning = false;

const asking = new Map();

export function refresh(j) {
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
        j.summary = j.current ? store.summary : await api.journal(j).summary();
        j.changed = false;
        j.gone = 0;
        j.fresh = Date.now();
        j.unreadable = false;
    } catch (e) {
        j.unreadable = true;
    }
}

const due = (j) => j.changed || Date.now() - (j.fresh || 0) > STALE_AFTER;

function pollSummary(j) {
    if (j.current || summaryPolls.has(j.root)) return;
    summaryPolls.set(
        j.root,
        startPoll(`summary:${j.root}`, () => due(j) && refresh(j), SUMMARY_EVERY)
    );
}

function listenTo(j) {
    const watched = j.running && !j.current ? environmentsOf(j).filter((e) => e.name === j.summary.start || envState(e) !== "stopped") : [];
    const envs = watched.slice(0, STREAMS_PER_JOURNAL).map((e) => e.name);
    const have = streams.get(j.root) || new Map();
    for (const name of envs) {
        if (have.has(name)) continue;
        const source = api.journal(j).in(name).stream();
        source.onmessage = () => (j.changed = true);
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
    summaryPolls.get(root)?.();
    summaryPolls.delete(root);
    store.hub.journals = store.hub.journals.filter((j) => j.root !== root);
}

export async function forget(j) {
    await api.forgetJournal(j.root);
    drop(j.root);
}

async function rescan() {
    const listed = store.journals
        .map((got) => ({...got, current: got.port === Number(location.port)}))
        .filter((got) => got.current || !isThrowaway(got));
    const found = listed.filter(
        (got) => got.current || !listed.some((other) => other.root === got.root && (other.current || other.port < got.port))
    );
    for (const got of found) {
        let j = store.hub.journals.find((x) => x.port === got.port);
        if (!j) {
            j = reactive({...got, summary: null, gone: 0, unreadable: false});
            store.hub.journals.push(j);
            await refresh(j);
        } else {
            const changed = got.version !== j.version;
            Object.assign(j, got);
            if (j.gone || (j.unreadable && changed) || Date.now() - (j.fresh || 0) > STALE_AFTER) await refresh(j);
        }
        listenTo(j);
        pollSummary(j);
    }
    for (const j of [...store.hub.journals]) {
        if (found.some((got) => got.port === j.port)) continue;
        j.gone = j.gone || Date.now();
        if (Date.now() - j.gone > LINGER) drop(j.root);
    }
    store.hub.journals.sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0) || a.project.localeCompare(b.project));
    store.hub.loaded = true;
}

export async function scan() {
    if (scanning) return;
    scanning = true;
    try {
        await rescan();
    } finally {
        scanning = false;
    }
}

export function closeAll() {
    for (const j of [...store.hub.journals]) drop(j.root);
    store.hub.loaded = false;
}
