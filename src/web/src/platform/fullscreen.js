import {ref, watch} from "vue";
import {store} from "../state/store.js";
import {onMac} from "./keys.js";

const FADE = 90;
const SETTLE = 260;

let entered = false;
let leaving = false;
let fading = 0;
let settling = 0;

export const FULLSCREEN_KEYS = onMac ? "⌘⇧Enter" : "Ctrl+Shift+Enter";
export const switching = ref(false);
export const drawnWide = ref(store.wide);

function settle() {
    clearTimeout(settling);
    settling = setTimeout(() => (switching.value = false), SETTLE);
}

function resize(on) {
    drawnWide.value = on;
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    settle();
}

function enter() {
    const page = document.documentElement;
    if (document.fullscreenElement || !page.requestFullscreen) return;
    page.requestFullscreen()
        .then(() => (entered = true))
        .catch(() => {});
}

export function followFullscreen() {
    watch(
        () => store.wide,
        (on) => {
            if (on) enter();
            switching.value = true;
            clearTimeout(settling);
            clearTimeout(fading);
            fading = setTimeout(() => resize(on), FADE);
        }
    );
    window.addEventListener("resize", () => {
        if (switching.value) settle();
    });
    window.addEventListener("beforeunload", () => (leaving = true));
    window.addEventListener("pagehide", () => (leaving = true));
    window.addEventListener("pageshow", () => (leaving = false));
    document.addEventListener("fullscreenchange", () => {
        if (switching.value) settle();
        if (document.fullscreenElement) return;
        if (entered && store.wide && !leaving) store.wide = false;
        entered = false;
    });
}
