import {onUnmounted} from "vue";

export function useOutside(el, close) {
    const away = (e) => {
        const node = el.value?.element || el.value?.$el || el.value;
        if (node && !node.contains(e.target)) close(e);
    };
    window.addEventListener("click", away);
    onUnmounted(() => window.removeEventListener("click", away));
}
