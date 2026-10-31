import {onMounted, onUnmounted, watch} from "vue";
import {transport} from "../api/transport.js";
import {POLLERS} from "../sync/pollers.js";
import {covered, STATUS_POLL} from "../state/updating.js";

const BACKOFF_CAP_MS = 60000;
const STATUS_CAP_MS = 3000;
const SLOW_FACTOR = 4;
const WAKE_SPREAD_MS = 300;
const POKE_GAP_MS = 1000;
const FALLBACK_EVERY_MS = 5000;
// The least time between two reads of one on-demand poller's run, unless the poller declares its own `least`.
const LEAST_MS = 1000;

// the runs of the declared pollers, one per poller, or one per agent or row for a poller declared with `by`
const runs = new Map();

function entryOf(key) {
    if (!(key in POLLERS)) throw new Error(`no poller ${key} is declared in sync/pollers.js`);
    return POLLERS[key];
}

const placeOf = (key, params) => (entryOf(key).by ? `${key}:${entryOf(key).by(params)}` : key);

function interval(run) {
    const every = entryOf(run.key).every;
    if (typeof every !== "function") return every;
    try {
        return every();
    } catch (e) {
        return FALLBACK_EVERY_MS;
    }
}
const jittered = (ms) => ms / 2 + (Math.random() * ms) / 2;
const newest = (run) => [...run.users.values()].pop();
const kept = (run) => runs.get(run.place) === run;
const staggered = () => Math.random() * WAKE_SPREAD_MS;

// a tab in front keeps asking, on any monitor; one hidden asks nothing until it is shown again
export const unseen = () => document.hidden;

function pause(run) {
    const every = interval(run);
    if (run.failures) return jittered(Math.min(run.key === STATUS_POLL ? STATUS_CAP_MS : BACKOFF_CAP_MS, every * 2 ** run.failures));
    return Math.max(every, SLOW_FACTOR * run.took);
}

function later(run, ms) {
    clearTimeout(run.timer);
    if (!kept(run) || run.paused || unseen()) return;
    run.timer = setTimeout(() => round(run), ms);
}

function round(run) {
    if (!kept(run)) return Promise.resolve();
    if (run.running) {
        run.again = true;
        return run.running;
    }
    run.running = rounds(run).finally(() => (run.running = null));
    return run.running;
}

const asked = (run) => !run.paused && !unseen() && (entryOf(run.key).active?.() ?? true) && newest(run).active() && (!covered() || run.key === STATUS_POLL);

async function answer(run) {
    const started = performance.now();
    run.started = started;
    try {
        const got = await transport.attemptOnce(() => entryOf(run.key).read(newest(run).params()));
        run.took = performance.now() - started;
        run.failures = 0;
        return got;
    } catch (error) {
        run.failures += 1;
        throw error;
    }
}

function handed(run, got) {
    run.last = {got};
    entryOf(run.key).take?.(got);
    run.users.forEach((user) => user.take(got));
}

async function rounds(run) {
    do {
        run.again = false;
        clearTimeout(run.timer);
        try {
            if (asked(run)) handed(run, await answer(run));
        } catch (error) {
            run.users.forEach((user) => user.failed(error));
        }
    } while (run.again && kept(run) && !run.paused);
    later(run, pause(run));
}

const matching = (key, params) => (entryOf(key).by && params ? [runs.get(placeOf(key, params))].filter(Boolean) : [...runs.values()].filter((run) => run.key === key));

// Stops a poller's runs, or the one run its params name, and settles once none of them has a request in flight.
export async function pausePoller(key, params) {
    const paused = matching(key, params);
    paused.forEach((run) => {
        run.paused += 1;
        clearTimeout(run.timer);
    });
    await Promise.all(paused.map((run) => run.running).filter(Boolean)).catch(() => {});
    return paused;
}

export function resumePoller(paused) {
    paused.forEach((run) => {
        run.paused = Math.max(0, run.paused - 1);
        if (!run.paused) later(run, 0);
    });
}

// when each on-demand run may next read: a read asked for sooner than that waits for it, so a run never reads twice within its least
const openAt = new Map();

async function spaced(place, entry) {
    const now = Date.now();
    const free = Math.max(now, openAt.get(place) ?? 0);
    openAt.set(place, free + (entry.least ?? LEAST_MS));
    if (free > now) await new Promise((resolve) => setTimeout(resolve, free - now));
}

// An on-demand poller's one read, made while the poller it pauses is quiet, so the two never pull at the same time, and no sooner
// after the run's last read than its least interval.
export async function demand(key, params = {}) {
    const entry = entryOf(key);
    await spaced(placeOf(key, params), entry);
    const paused = entry.pauses ? await pausePoller(entry.pauses, params) : [];
    try {
        return await transport.attemptOnce(() => entry.read(params));
    } finally {
        resumePoller(paused);
    }
}

export const pollNow = (key, params) => Promise.all(matching(key, params).map(round));

export function poke(key) {
    matching(key).forEach((run) => {
        if (run.running) return;
        later(run, Math.max(0, POKE_GAP_MS - (performance.now() - run.started)));
    });
}

export function wakePolls() {
    runs.forEach((run) => {
        if (!run.failures) return;
        run.failures = 0;
        later(run, staggered());
    });
}

const seen = () => unseen() || runs.forEach((run) => later(run, staggered()));

document.addEventListener("visibilitychange", seen);

function leave(place, token) {
    const run = runs.get(place);
    if (!run) return;
    run.users.delete(token);
    if (run.users.size) return;
    clearTimeout(run.timer);
    runs.delete(place);
}

// Takes part in a declared poller: `params` hands it what to read, `take` gets each answer, `failed` each failure, and
// `active` says whether this user wants it asked now.
export function startPoll(key, {params = () => ({}), take = () => {}, failed = () => {}, active = () => true} = {}) {
    const place = placeOf(key, params());
    const token = Symbol(place);
    const user = {params, take, failed, active};
    const run = runs.get(place);
    if (run) {
        run.users.set(token, user);
        // a user that joins a poller another one runs is handed its last answer now, not after the next round
        if (run.last) take(run.last.got);
    } else {
        const fresh = {key, place, users: new Map([[token, user]]), timer: 0, failures: 0, took: 0, started: -Infinity, last: null, paused: 0};
        runs.set(place, fresh);
        round(fresh);
    }
    return () => leave(place, token);
}

// startPoll for a component's life; a user whose params come to name another run moves to it
export function usePoll(key, options = {}) {
    const params = options.params || (() => ({}));
    let stop = () => {};
    onMounted(() => {
        stop = startPoll(key, options);
        watch(
            () => placeOf(key, params()),
            () => {
                stop();
                stop = startPoll(key, options);
            }
        );
    });
    onUnmounted(() => stop());
    // a poller that had nothing to ask for asks the moment it has, not a whole interval later
    if (options.active) watch(options.active, (now) => now && pollNow(key, params()));
    return () => pollNow(key, params());
}
