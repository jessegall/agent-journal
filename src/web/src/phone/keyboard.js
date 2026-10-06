import {onMounted} from "vue";
import {useWindowEvent} from "../composables/windowEvent.js";

const UP = 80;

const standalone = () => window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;

function measured() {
    const view = window.visualViewport;
    const root = document.documentElement;
    if (!view || !standalone()) return;
    const covered = Math.max(0, Math.round(window.innerHeight - (view.height + view.offsetTop)));
    const phone = document.querySelector(".phone");
    const short = phone ? Math.max(0, Math.round(phone.getBoundingClientRect().bottom - window.innerHeight)) : 0;
    const lift = covered > UP ? covered + short : 0;
    root.style.setProperty("--keyboard", `${lift}px`);
    root.classList.toggle("keyboard-up", lift > 0);
    if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
}

export function useKeyboard() {
    const viewport = () => window.visualViewport;
    useWindowEvent("resize", measured, undefined, viewport);
    useWindowEvent("scroll", measured, undefined, viewport);
    useWindowEvent("scroll", measured, {passive: true});
    onMounted(measured);
}
