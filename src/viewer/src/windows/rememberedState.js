import {ref, watch} from "vue";

const PREFIX = "journal.viewer.";

function read(key, fallback, storage) {
    try {
        const kept = storage.getItem(PREFIX + key);
        return kept === null ? fallback : JSON.parse(kept);
    } catch {
        return fallback;
    }
}

function write(key, value, storage) {
    try {
        storage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
        return;
    }
}

// a state of the page this browser keeps over a reload: a side panel open, full screen, a folded sidebar group
export function rememberedRef(key, fallback, storage = window.localStorage) {
    const state = ref(read(key, fallback, storage));
    watch(state, (value) => write(key, value, storage), {deep: true});
    return state;
}

// the value this browser kept under a key, read once, for code that runs before any component
export function rememberedValue(key, fallback, storage = window.localStorage) {
    return read(key, fallback, storage);
}
