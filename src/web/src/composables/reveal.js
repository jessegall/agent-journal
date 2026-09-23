import {onUnmounted, ref} from "vue";

const still = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReveal(length, every = 16) {
    const count = ref(still ? length : 0);
    const timer = setInterval(() => {
        count.value = Math.min(length, count.value + 2);
        if (count.value >= length) clearInterval(timer);
    }, every);
    onUnmounted(() => clearInterval(timer));
    return count;
}

export function useTyping(tick = 16) {
    const timers = new Set();
    const wait = (ms) =>
        new Promise((done) => {
            if (still) return done();
            const timer = setTimeout(() => (timers.delete(timer), done()), ms);
            timers.add(timer);
        });

    async function type(length, ms, show) {
        if (still) return show(length);
        const step = Math.max(1, Math.ceil(length / Math.max(1, Math.round(ms / tick))));
        for (let at = step; at < length + step; at += step) {
            show(Math.min(at, length));
            await wait(tick);
        }
    }

    onUnmounted(() => timers.forEach(clearTimeout));
    return {type, wait};
}
