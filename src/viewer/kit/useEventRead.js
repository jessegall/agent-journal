import {onBeforeUnmount, onMounted} from "vue";
import {coalesced} from "../src/composables/coalesced.js";
import {READ_RATES} from "../src/composables/readRates.js";
import {useWindow} from "./windowContextKey.js";

// reads once at the start and again when one of the named events arrives, whatever the window itself declares, until the component goes
export function useEventRead(load, events) {
    const context = useWindow();
    const ask = coalesced(load, READ_RATES.openPanel);
    const stop = context.subscriptions.follow(context.window, events, ask, () => context.visible.value);
    onMounted(load);
    onBeforeUnmount(() => {
        stop();
        ask.cancel();
    });
}
