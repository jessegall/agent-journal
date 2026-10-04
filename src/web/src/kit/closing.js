import {computed, ref} from "vue";
import {useEscape} from "../composables/windowEvent.js";

export function closing(emit, props = {}) {
    const led = () => props.open !== undefined && props.open !== null;
    const dismissed = ref(false);
    const shown = computed(() => (led() ? props.open : !dismissed.value));
    const close = () => {
        if (!led()) dismissed.value = true;
        emit("dismiss");
    };
    useEscape(close, () => !led() && props.closable !== false);
    return {shown, close, closed: () => emit("close")};
}
