import {ref} from "vue";
const SETTLE = 120;

export const chatOnly = new URLSearchParams(location.search).has("chat");
export const soloView = new URLSearchParams(location.search).get("view") || "";
export const floatWindow = chatOnly || Boolean(soloView);
export const soloFloat = Number(new URLSearchParams(location.search).get("float")) || 0;

const NARROW = window.matchMedia("(max-width: 700px)");
export const narrow = ref(NARROW.matches);
NARROW.addEventListener("change", (e) => (narrow.value = e.matches));

export const laidOut = ref(0);
let resizing = 0;
window.addEventListener("resize", () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => (laidOut.value += 1), SETTLE);
});

