import {onBeforeUnmount, ref} from "vue";

const TICK_MILLISECONDS = 1000;

// the time now, moved on every second with no read of the journal: a running time is worked out here from the start time the row gives
export function useNow() {
    const now = ref(Date.now());
    const timer = setInterval(() => (now.value = Date.now()), TICK_MILLISECONDS);
    onBeforeUnmount(() => clearInterval(timer));
    return now;
}
