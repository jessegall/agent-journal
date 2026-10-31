import {inject} from "vue";

// the key the shell's window host provides each window's context under, and every window reads it with
export const WINDOW_CONTEXT = Symbol.for("journal.window-context");

export function useWindow() {
    const context = inject(WINDOW_CONTEXT, null);
    if (!context) throw new Error("useWindow is called only inside a window the viewer hosts");
    return context;
}
