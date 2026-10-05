import {computed, ref} from "vue";
import {useEscape} from "./windowEvent.js";

export function closing(emit, props = {}) {
    const led = () => props.open !== undefined && props.open !== null;
    const dismissed = ref(false);
    const visible = computed(() => (led() ? props.open : !dismissed.value));
    const close = () => {
        if (!led()) dismissed.value = true;
        emit("dismiss");
    };
    useEscape(close, () => !led() && props.closable !== false);
    return {visible, close, closed: () => emit("close")};
}
