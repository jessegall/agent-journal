import {computed, onMounted, onUnmounted, ref} from "vue";

export function closing(emit, props = {}) {
    const led = () => props.open !== undefined && props.open !== null;
    const dismissed = ref(false);
    const shown = computed(() => (led() ? props.open : !dismissed.value));
    const close = () => {
        if (!led()) dismissed.value = true;
        emit("dismiss");
    };
    const onEscape = (e) => e.key === "Escape" && !led() && close();
    onMounted(() => window.addEventListener("keydown", onEscape));
    onUnmounted(() => window.removeEventListener("keydown", onEscape));
    return {shown, close, closed: () => emit("close")};
}
