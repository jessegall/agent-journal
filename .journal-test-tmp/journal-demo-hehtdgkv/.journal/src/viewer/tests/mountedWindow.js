import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

// a window component mounted with a context that reads the given rows and runs every line
export function mounted(component, rows) {
    const context = {read: async () => ({ok: true, value: {rows}}), run: async () => ({ok: true}), follow: () => {}, face: "person"};
    const element = document.createElement("div");
    createApp({setup: () => () => h(component), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    return element;
}
