import {TICK, visibleQueue} from "../domain/statusQueue.js";
import {onUnmounted, ref, watch} from "vue";

export function useBarLine(queue) {
    const state = ref({at: 0, since: 0});
    const message = ref(null);
    const elapsed = ref(0);

    function step() {
        const now = Date.now() / 1000;
        const got = visibleQueue(queue() || [], state.value, now);
        if (got.at !== state.value.at || got.since !== state.value.since) state.value = {at: got.at, since: got.since};
        if (got.message !== message.value) message.value = got.message;
        const seconds = got.message ? Math.floor(Math.max(0, now - got.since)) : 0;
        if (seconds !== elapsed.value) elapsed.value = seconds;
    }

    let ticking = 0;
    const ticked = () => {
        clearInterval(ticking);
        ticking = document.hidden ? 0 : setInterval(step, TICK);
    };
    ticked();
    document.addEventListener("visibilitychange", ticked);
    watch(queue, step, {immediate: true});
    onUnmounted(() => {
        clearInterval(ticking);
        document.removeEventListener("visibilitychange", ticked);
    });
    return {state, message, elapsed};
}
