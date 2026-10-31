import {inject} from "vue";

export {default as EmptyState} from "../src/kit/EmptyState.vue";
export {default as Btn} from "../src/kit/Btn.vue";
export {default as CloseButton} from "../src/kit/CloseButton.vue";

// the kit's own version: a breaking change to the window context, or a new Vue minor version, is a new major version
export const KIT_VERSION = "1.0.0";
export const KIT_VUE = "3.5";

// the key the shell's window host provides each window's context under, and every window reads it with
export const WINDOW_CONTEXT = Symbol.for("journal.window-context");

export function useWindow() {
    const context = inject(WINDOW_CONTEXT, null);
    if (!context) throw new Error("useWindow is called only inside a window the viewer hosts");
    return context;
}
