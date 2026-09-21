import {onUnmounted} from "vue";

export function useOutside(el, close) {
    const away = (e) => {
        if (el.value && !el.value.contains(e.target)) close();
    };
    window.addEventListener("click", away);
    onUnmounted(() => window.removeEventListener("click", away));
}
