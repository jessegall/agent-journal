import {ref, watch} from "vue";
import {store} from "../state/store.js";
import {onMac} from "./keys.js";

const FADE = 90;
const SETTLE = 260;

let entered = false;
let leaving = false;
let fading = 0;
let settling = 0;

const DISPLAY = window.matchMedia("(display-mode: fullscreen)");
const browserFull = () =>
    !document.fullscreenElement && (DISPLAY.matches || (window.innerHeight === screen.height && window.innerWidth === screen.width));

let byBrowser = browserFull();
let following = false;
if (byBrowser) store.wide = true;

export const FULLSCREEN_KEYS = onMac ? "⌘⇧Enter" : "Ctrl+Shift+Enter";
export const switching = ref(false);
export const drawnWide = ref(store.wide);
export const armed = ref(false);

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

function followBrowser() {
    const now = browserFull();
    if (now === byBrowser) return;
    byBrowser = now;
    armed.value = armed.value && !now;
    following = store.wide !== now;
    store.wide = now;
}

function rearm() {
    if (!store.wide || byBrowser || document.fullscreenElement || !document.documentElement.requestFullscreen) return;
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
            if (on && !following) enter();
            following = false;
            switching.value = true;
            clearTimeout(settling);
            clearTimeout(fading);
            fading = setTimeout(() => resize(on), FADE);
        }
    );
    rearm();
    window.addEventListener("resize", () => {
        followBrowser();
        if (switching.value) settle();
    });
    DISPLAY.addEventListener("change", followBrowser);
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
