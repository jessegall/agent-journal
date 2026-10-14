import {onMounted, onUnmounted} from "vue";

const LINE = 0.3;

export function useScrollSpy(ids, current) {
    function update() {
        if (!ids.value.length) return;
        const line = window.innerHeight * LINE;
        const above = ids.value.filter((id) => document.querySelector(`[data-spy="${id}"]`)?.getBoundingClientRect().top <= line);
        current.value = above.at(-1) || ids.value[0];
    }

    onMounted(() => window.addEventListener("scroll", update, {capture: true, passive: true}));
    onUnmounted(() => window.removeEventListener("scroll", update, {capture: true}));
}
