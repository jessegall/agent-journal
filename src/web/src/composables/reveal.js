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

export function useTyping() {
    const timers = new Set();
    const wait = (ms) =>
        new Promise((done) => {
            if (still) return done();
            const timer = setTimeout(() => (timers.delete(timer), done()), ms);
            timers.add(timer);
        });

    async function type(text, ms, show) {
        if (still) return show(text.length);
        const words = text.match(/\S+\s*/g) || [];
        const pace = () => (typeof ms === "function" ? ms() : ms) / Math.max(1, text.length);
        let at = 0;
        for (const word of words) {
            at += word.length;
            show(at);
            await wait(word.length * pace() * (0.4 + Math.random() * 1.2) + (/[.,;:!?]\s*$/.test(word) ? pace() * 8 : 0));
        }
    }

    onUnmounted(() => timers.forEach(clearTimeout));
    return {type, wait};
}
