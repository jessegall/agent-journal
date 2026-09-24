import {ref, watch} from "vue";
import {store} from "../state/store.js";

const FADE = 90;
const SETTLE = 260;

let entered = false;
let leaving = false;
let fading = 0;
let settling = 0;

export const FULLSCREEN_KEYS = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘⇧Enter" : "Ctrl+Shift+Enter";
export const switching = ref(false);
export const drawnWide = ref(store.wide);
export const armed = ref(false);

function settle() {
    clearTimeout(settling);
    settling = setTimeout(() => (switching.value = false), SETTLE);
}

function resize(on) {
    drawnWide.value = on;
    if (on) enter();
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

function rearm() {
    if (!store.wide || document.fullscreenElement || !document.documentElement.requestFullscreen) return;
    armed.value = true;
    const once = () => {
        armed.value = false;
        window.removeEventListener("pointerdown", once, true);
        window.removeEventListener("keydown", once, true);
        if (store.wide) enter();
    };
    window.addEventListener("pointerdown", once, true);
    window.addEventListener("keydown", once, true);
}

export function followFullscreen() {
    watch(
        () => store.wide,
        (on) => {
            switching.value = true;
            clearTimeout(settling);
            clearTimeout(fading);
            fading = setTimeout(() => resize(on), FADE);
        }
    );
    rearm();
    window.addEventListener("resize", () => switching.value && settle());
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
