import {remember, remembered} from "../platform/storage.js";
import {computed, ref, watch} from "vue";
import {createdAt} from "../domain/row.js";

const MINIMISED = "chat.pins.minimised";
const minimised = ref(remembered(MINIMISED, false));

function fold(folded) {
    minimised.value = folded;
    remember(MINIMISED, folded);
}

export function usePins(notices) {
    const pins = computed(() => notices());
    const visible = computed(() => (minimised.value ? [] : notices()));
    const toggle = () => fold(!minimised.value);
    const since = Date.now() / 1000;
    watch(
        () => pins.value.filter((pin) => createdAt(pin) > since).length,
        (arrived, before) => arrived > before && fold(false)
    );
    return {pins, visible, minimised, toggle};
}
