import {onMounted, onUnmounted} from "vue";

const polls = new Map();

function next(held) {
    clearTimeout(held.timer);
    if (document.hidden || polls.get(held.key) !== held) return;
    held.timer = setTimeout(() => round(held), typeof held.every === "function" ? held.every() : held.every);
}

function round(held) {
    if (polls.get(held.key) !== held) return Promise.resolve();
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
            held.takers.forEach((take) => take(got));
        } catch (e) {}
    } while (held.again && polls.get(held.key) === held);
    next(held);
}

document.addEventListener("visibilitychange", () => polls.forEach((held) => (document.hidden ? clearTimeout(held.timer) : round(held))));

export function usePoll(key, ask, every, take = () => {}) {
    onMounted(() => {
        const held = polls.get(key);
        if (held) {
            held.takers.add(take);
            return;
        }
        const fresh = {key, ask, every, takers: new Set([take]), timer: 0};
        polls.set(key, fresh);
        round(fresh);
    });
    onUnmounted(() => {
        const held = polls.get(key);
        if (!held) return;
        held.takers.delete(take);
        if (!held.takers.size) {
            clearTimeout(held.timer);
            polls.delete(key);
        }
    });
    return () => polls.has(key) && round(polls.get(key));
}
