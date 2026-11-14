import {inject} from "vue";

// the key the home page provides its toasts under: a window raises one with useToast, the shell draws it
export const TOAST = Symbol.for("journal.toast");

// raise(text) says a thing for a few seconds; raise(text, {line: [...]}) gives it an Undo button that runs that journal command.
// A new toast replaces the one shown, so only one Undo stands at a time.
export function useToast() {
    const toasts = inject(TOAST, null);
    if (!toasts) throw new Error("useToast is called only inside a page that shows toasts");
    return toasts.raise;
}
