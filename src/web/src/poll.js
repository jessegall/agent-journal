import {onMounted, onUnmounted} from "vue";
import {transport} from "./api/transport.js";

const BACKOFF_CAP_MS = 60000;
const SLOW_FACTOR = 4;
const WAKE_SPREAD_MS = 300;

const polls = new Map();
let instance = 0;

export const pollKey = () => ++instance;

const interval = (user) => (typeof user.every === "function" ? user.every() : user.every);
const fastest = (held) => Math.min(...[...held.users.values()].map(interval));
const jittered = (ms) => ms / 2 + (Math.random() * ms) / 2;
const live = (held) => polls.get(held.key) === held && held.active();
const staggered = () => Math.random() * WAKE_SPREAD_MS;

function pause(held) {
    const every = fastest(held);
    if (held.failures) return jittered(Math.min(BACKOFF_CAP_MS, every * 2 ** held.failures));
    return Math.max(every, SLOW_FACTOR * held.took);
}

function later(held, ms) {
    clearTimeout(held.timer);
    if (document.hidden || !live(held)) return;
    held.timer = setTimeout(() => round(held), ms);
}

function round(held) {
    if (!live(held)) return Promise.resolve();
    if (held.running) {
        held.again = true;
        return held.running;
    }
    held.running = rounds(held).finally(() => (held.running = null));
    return held.running;
}

async function answer(held) {
    const started = performance.now();
    try {
        const got = await transport.attemptOnce(held.ask);
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
            const got = await answer(held);
            held.users.forEach((user) => user.take(got));
        } catch (e) {}
    } while (held.again && live(held));
    later(held, pause(held));
}

export function wakePolls() {
    polls.forEach((held) => {
        if (!held.failures) return;
        held.failures = 0;
        later(held, staggered());
    });
}

document.addEventListener("visibilitychange", () => polls.forEach((held) => (document.hidden ? clearTimeout(held.timer) : later(held, staggered()))));

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
        held.users.set(token, {every, take});
    } else {
        const fresh = {key, ask, active, users: new Map([[token, {every, take}]]), timer: 0, failures: 0, took: 0};
        polls.set(key, fresh);
        round(fresh);
    }
    return () => leave(key, token);
}

export function usePoll(key, ask, every, take = () => {}, active = () => true) {
    let stop = () => {};
    onMounted(() => (stop = startPoll(key, ask, every, take, active)));
    onUnmounted(() => stop());
    return () => polls.has(key) && round(polls.get(key));
}
