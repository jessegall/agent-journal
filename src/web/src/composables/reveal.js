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
