import {reactive, ref} from "vue";
import {store} from "../state/store.js";

const FOCUS_FOR = 1800;
const SETTLE = 120;

export const framed = window.parent !== window;
export const chatOnly = new URLSearchParams(location.search).has("chat");
export const soloView = new URLSearchParams(location.search).get("view") || "";
export const soloFloat = Number(new URLSearchParams(location.search).get("float")) || 0;

export const laidOut = ref(0);
let resizing = 0;
window.addEventListener("resize", () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => (laidOut.value += 1), SETTLE);
});

export const lightbox = reactive({pictures: [], at: -1});

export function openPictures(pictures, at) {
    lightbox.pictures = pictures;
    lightbox.at = at;
}

export function focusTurn(ref, {instant = false} = {}) {
    const el = document.querySelector(`[data-ref="${ref}"]`);
    if (!el) return false;
    store.focus = ref;
    el.scrollIntoView({behavior: instant ? "auto" : "smooth", block: "center"});
    setTimeout(() => (store.focus = store.focus === ref ? "" : store.focus), FOCUS_FOR);
    return true;
}
