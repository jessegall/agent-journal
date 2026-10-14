import {onUnmounted, ref, watch} from "vue";

export function useUnder(sentinel) {
    const under = ref(false);
    let watcher = null;

    watch(
        sentinel,
        (el) => {
            watcher?.disconnect();
            watcher = null;
            if (!el) return;
            watcher = new IntersectionObserver(([seen]) => (under.value = !seen.isIntersecting), {root: el.closest("[data-scroller]")});
            watcher.observe(el);
        },
        {immediate: true, flush: "post"},
    );

    onUnmounted(() => watcher?.disconnect());
    return under;
}
