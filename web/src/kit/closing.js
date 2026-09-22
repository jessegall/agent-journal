import {onMounted, onUnmounted, ref} from "vue";

export function closing(emit) {
    const shown = ref(true);
    const close = () => (shown.value = false);
    const onEscape = (e) => e.key === "Escape" && close();
    onMounted(() => window.addEventListener("keydown", onEscape));
    onUnmounted(() => window.removeEventListener("keydown", onEscape));
    return {shown, close, closed: () => emit("close")};
}
