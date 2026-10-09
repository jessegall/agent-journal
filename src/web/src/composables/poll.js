import {onMounted, onUnmounted} from "vue";
import {transport} from "../api/transport.js";

const BACKOFF_CAP_MS = 60000;
const SLOW_FACTOR = 4;
const WAKE_SPREAD_MS = 300;
const POKE_GAP_MS = 1000;
const UNSEEN_FACTOR = 10;

const polls = new Map();
let instance = 0;

export const pollKey = () => ++instance;

const FALLBACK_EVERY_MS = 5000;

function interval(user) {
    if (typeof user.every !== "function") return user.every;
    try {
        return user.every();
    } catch (e) {
        return FALLBACK_EVERY_MS;
    }
}
const fastest = (held) => Math.min(...[...held.users.values()].map(interval));
const jittered = (ms) => ms / 2 + (Math.random() * ms) / 2;
const newest = (held) => [...held.users.values()].pop();
const kept = (held) => polls.get(held.key) === held;
const staggered = () => Math.random() * WAKE_SPREAD_MS;

export const unseen = () => document.hidden || !document.hasFocus();

function pause(held) {
    const every = fastest(held) * (unseen() ? UNSEEN_FACTOR : 1);
    if (held.failures) return jittered(Math.min(BACKOFF_CAP_MS, every * 2 ** held.failures));
    return Math.max(every, SLOW_FACTOR * held.took);
}

function later(held, ms) {
    clearTimeout(held.timer);
    if (!kept(held)) return;
    held.timer = setTimeout(() => round(held), ms);
}

function round(held) {
    if (!kept(held)) return Promise.resolve();
    if (held.running) {
        held.again = true;
        return held.running;
    }
    held.running = rounds(held).finally(() => (held.running = null));
    return held.running;
}

async function answer(held) {
    const started = performance.now();
    held.started = started;
    try {
        const got = await transport.attemptOnce(newest(held).ask);
        held.took = performance.now() - started;
        held.failures = 0;
        return got;
    } catch (error) {
        held.failures += 1;
        throw error;
    }
}

async function rounds(held) {
    do {
        held.again = false;
        clearTimeout(held.timer);
        try {
            if (!newest(held).active()) continue;
            const got = await answer(held);
            held.last = {got};
            held.users.forEach((user) => user.take(got));
        } catch (e) {}
    } while (held.again && kept(held));
    later(held, pause(held));
}

export const pollNow = (key) => (polls.has(key) ? round(polls.get(key)) : Promise.resolve());

export function poke(key) {
    const held = polls.get(key);
    if (!held || held.running) return;
    later(held, Math.max(0, POKE_GAP_MS - (performance.now() - held.started)));
}

export function wakePolls() {
    polls.forEach((held) => {
        if (!held.failures) return;
        held.failures = 0;
        later(held, staggered());
    });
}

const seen = () => polls.forEach((held) => later(held, unseen() ? pause(held) : staggered()));

document.addEventListener("visibilitychange", seen);
window.addEventListener("focus", seen);
window.addEventListener("blur", seen);

function leave(key, token) {
    const held = polls.get(key);
    if (!held) return;
    held.users.delete(token);
    if (held.users.size) return;
    clearTimeout(held.timer);
    polls.delete(key);
}

export function startPoll(key, ask, every, take = () => {}, active = () => true) {
    const token = Symbol(String(key));
    const held = polls.get(key);
    if (held) {
        held.users.set(token, {ask, every, take, active});
        // A page that joins a poll another page runs shows its last answer now, not after the next round.
        if (held.last) take(held.last.got);
    } else {
        const fresh = {
            key,
            users: new Map([[token, {ask, every, take, active}]]),
            timer: 0,
            failures: 0,
            took: 0,
            started: -Infinity,
            last: null,
        };
        polls.set(key, fresh);
        round(fresh);
    }
    return () => leave(key, token);
}

export function usePoll(key, ask, every, take = () => {}, active = () => true) {
    let stop = () => {};
    onMounted(() => (stop = startPoll(key, ask, every, take, active)));
    onUnmounted(() => stop());
    return () => pollNow(key);
}
