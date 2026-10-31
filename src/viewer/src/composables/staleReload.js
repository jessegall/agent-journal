import {onBeforeUnmount, ref, watch} from "vue";
import {fieldBusy, reloadWhenFree} from "../platform/busyField.js";

const TOUCHES = ["pointerdown", "keydown"];

// The reload a newer viewer build offers while `stale` holds: never made by itself, only when the reader asks for it with `reload`, which
// waits while a field has words in it or `drafting` says a message is being written. `waiting` says whether a draft holds it.
export function useStaleReload(stale, drafting, win = window) {
    const waiting = ref(false);
    const look = () => (waiting.value = stale.value && (drafting() || fieldBusy(win.document)));
    const reload = () => reloadWhenFree(win);
    TOUCHES.forEach((kind) => win.addEventListener(kind, look, {passive: true}));
    watch(stale, look, {immediate: true});
    onBeforeUnmount(() => TOUCHES.forEach((kind) => win.removeEventListener(kind, look)));
    return {waiting, reload};
}
