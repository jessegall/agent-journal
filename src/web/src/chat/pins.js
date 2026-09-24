import {computed, ref} from "vue";
import {remember, remembered} from "../composables/remembered.js";

const MINIMISED = "chat.pins.minimised";
const minimised = ref(remembered(MINIMISED, false));
const asks = (notice) => Boolean(notice.data.action && notice.data.session);

export function usePins(notices) {
    const pins = computed(() => notices().filter((notice) => !asks(notice)));
    const shown = computed(() => (minimised.value ? notices().filter(asks) : notices()));
    const toggle = () => {
        minimised.value = !minimised.value;
        remember(MINIMISED, minimised.value);
    };
    return {pins, shown, minimised, toggle};
}
