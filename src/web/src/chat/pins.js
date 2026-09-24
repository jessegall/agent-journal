import {computed, ref, watch} from "vue";
import {remember, remembered} from "../composables/remembered.js";

const MINIMISED = "chat.pins.minimised";
const minimised = ref(remembered(MINIMISED, false));
const asks = (notice) => Boolean(notice.data.action && notice.data.session);

function fold(folded) {
    minimised.value = folded;
    remember(MINIMISED, folded);
}

export function usePins(notices) {
    const pins = computed(() => notices().filter((notice) => !asks(notice)));
    const shown = computed(() => (minimised.value ? notices().filter(asks) : notices()));
    const toggle = () => fold(!minimised.value);
    const since = Date.now() / 1000;
    watch(
        () => pins.value.filter((pin) => pin.created > since).length,
        (arrived, before) => arrived > before && fold(false)
    );
    return {pins, shown, minimised, toggle};
}
