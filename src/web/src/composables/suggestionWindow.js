import {computed, onMounted, onUnmounted, ref} from "vue";
import {dueNow} from "../domain/suggestions.js";

export const IDLE_MS = 4000;
export const ACTIVE_MS = 3 * 60_000;
export const GAP_MS = 10 * 60_000;
export const CHECK_MS = 1000;
const CHAT_BOX = ".compose textarea";

const drafted = () => [...document.querySelectorAll(CHAT_BOX)].some((box) => box.value.trim());

export function useSuggestionWindow(suggestions, hours, graceUntil = () => 0) {
    const shown = ref(0);
    const opened = new Set();
    let active = Date.now();
    let typed = 0;
    let closed = -Infinity;
    let timer = 0;

    const stirred = () => (active = Date.now());
    const keyed = (event) => {
        stirred();
        if (event.target?.closest?.(".compose")) typed = Date.now();
    };

    function waiting(now) {
        return (
            document.visibilityState !== "visible" ||
            now - active > ACTIVE_MS ||
            now - typed < IDLE_MS ||
            now - closed < GAP_MS ||
            now < graceUntil() ||
            drafted()
        );
    }

    function check() {
        const now = Date.now();
        if (shown.value || waiting(now)) return;
        const due = dueNow(
            suggestions().filter((s) => !opened.has(s.n)),
            hours(),
            now / 1000
        );
        if (!due) return;
        opened.add(due.n);
        shown.value = due.n;
    }

    function close() {
        shown.value = 0;
        closed = Date.now();
    }

    onMounted(() => {
        document.addEventListener("keydown", keyed, {capture: true});
        document.addEventListener("pointerdown", stirred, {capture: true, passive: true});
        timer = setInterval(check, CHECK_MS);
    });

    onUnmounted(() => {
        document.removeEventListener("keydown", keyed, {capture: true});
        document.removeEventListener("pointerdown", stirred, {capture: true});
        clearInterval(timer);
    });

    const suggestion = computed(() => suggestions().find((s) => s.n === shown.value) || null);
    return {suggestion, close, check};
}
