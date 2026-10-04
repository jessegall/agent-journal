import {onMounted, onUnmounted} from "vue";

const polls = new Map();
let instance = 0;

export const pollKey = () => ++instance;

const interval = (user) => (typeof user.every === "function" ? user.every() : user.every);
const fastest = (held) => Math.min(...[...held.users.values()].map(interval));

function next(held) {
    clearTimeout(held.timer);
    if (document.hidden || polls.get(held.key) !== held || !held.active()) return;
    held.timer = setTimeout(() => round(held), fastest(held));
}

function round(held) {
    if (polls.get(held.key) !== held || !held.active()) return Promise.resolve();
    if (held.running) {
        held.again = true;
        return held.running;
    }
    held.running = rounds(held).finally(() => (held.running = null));
    return held.running;
}

async function rounds(held) {
    do {
        held.again = false;
        clearTimeout(held.timer);
        try {
            const got = await held.ask();
            held.users.forEach((user) => user.take(got));
        } catch (e) {}
    } while (held.again && polls.get(held.key) === held && held.active());
    next(held);
}

document.addEventListener("visibilitychange", () => polls.forEach((held) => (document.hidden ? clearTimeout(held.timer) : round(held))));

export function usePoll(key, ask, every, take = () => {}, active = () => true) {
    const token = Symbol(String(key));
    onMounted(() => {
        const held = polls.get(key);
        if (held) {
            held.users.set(token, {every, take});
            return;
        }
        const fresh = {key, ask, active, users: new Map([[token, {every, take}]]), timer: 0};
        polls.set(key, fresh);
        round(fresh);
    });
    onUnmounted(() => {
        const held = polls.get(key);
        if (!held) return;
        held.users.delete(token);
        if (held.users.size) return;
        clearTimeout(held.timer);
        polls.delete(key);
    });
    return () => polls.has(key) && round(polls.get(key));
}
