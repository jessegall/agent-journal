import {onUnmounted, watch} from "vue";

const SIDEWAYS = "table, .mark .command";

function marked(el) {
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    el.classList.toggle("fade-left", left);
    el.classList.toggle("fade-right", right);
}

export function useFades(root) {
    const scrolled = (event) => event.target.matches?.(SIDEWAYS) && marked(event.target);

    watch(
        root,
        (el, before) => {
            before?.removeEventListener("scroll", scrolled, {capture: true});
            el?.addEventListener("scroll", scrolled, {capture: true, passive: true});
        },
        {immediate: true, flush: "post"},
    );

    onUnmounted(() => root.value?.removeEventListener("scroll", scrolled, {capture: true}));

    return () => root.value?.querySelectorAll(SIDEWAYS).forEach(marked);
}
