import {inject} from "vue";
import {useWindowData} from "./useWindowData.js";

// the key the shell's window host provides each window's context under, and every window reads it with
// how a window opens another: the stage that holds the panes provides it
export const OPEN_VIEW = Symbol("open-view");
export const WINDOW_CONTEXT = Symbol.for("journal.window-context");
const DOCK_CARD = Symbol("dock-card");

// a window's props start being read the first time it uses them, so a window that declares none makes no request
function withProps(context) {
    if ("props" in context) return context;
    let data = null;
    const started = () => (data ??= useWindowData(context));
    return Object.defineProperties(context, {
        props: {get: () => started().props},
        state: {get: () => started().state},
        reload: {value: (only) => started().reload(only)},
        readKey: {value: (name, flags) => started().readKey(name, flags)},
    });
}

export function useWindow() {
    const context = inject(WINDOW_CONTEXT, null);
    if (!context) throw new Error("useWindow is called only inside a window the viewer hosts");
    return withProps(context);
}

// what a docked card's body is given by the card it is drawn in: its prop, and the way to reload it and to read a page of its output
export const provideDockCard = (provide, card) => provide(DOCK_CARD, card);
export const useDockCard = () => inject(DOCK_CARD);
