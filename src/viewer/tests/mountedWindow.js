import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

const CARD_KEYS = ["checks", "board"];

// a window component mounted with a context that reads the given rows and runs every line
export function mounted(component, rows) {
    const answer = {ok: true, value: {rows}};
    const declared = Object.fromEntries(CARD_KEYS.map((name) => [name, {tab: null, events: [], reload_seconds: 0, loading: "first", page_size: 0}]));
    const readKeys = async ({only = []}) => ({ok: true, value: {declared, keys: Object.fromEntries((only.length ? only : CARD_KEYS).map((name) => [name, answer]))}});
    const context = {read: async () => answer, readKeys, run: async () => ({ok: true}), follow: () => {}, face: "person"};
    const element = document.createElement("div");
    createApp({setup: () => () => h(component), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    return element;
}
