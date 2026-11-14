import {onMounted, onUnmounted} from "vue";

function useWindowEvent(name, handler, options, target = () => window) {
    onMounted(() => target()?.addEventListener(name, handler, options));
    onUnmounted(() => target()?.removeEventListener(name, handler, options));
}

export const useEscape = (close, when = () => true) => useWindowEvent("keydown", (event) => event.key === "Escape" && when() && close());
