import {onMounted} from "vue";
import {useWindowEvent} from "../composables/windowEvent.js";

const UP = 80;

function measured() {
    const view = window.visualViewport;
    const root = document.documentElement;
    if (!view) return;
    const covered = Math.max(0, Math.round(window.innerHeight - (view.height + view.offsetTop)));
    const phone = document.querySelector(".phone");
    const short = phone ? Math.max(0, Math.round(phone.getBoundingClientRect().bottom - window.innerHeight)) : 0;
    const lift = covered > UP ? covered + short : 0;
    root.style.setProperty("--keyboard", `${lift}px`);
    root.classList.toggle("keyboard-up", lift > 0);
    if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
}

const FIELDS = "input, textarea, [contenteditable]";

function focused(event) {
    if (event.target.matches?.(FIELDS)) document.documentElement.classList.add("typing");
}

function blurred() {
    setTimeout(() => document.documentElement.classList.toggle("typing", Boolean(document.activeElement?.matches?.(FIELDS))), 50);
}

export function useKeyboard() {
    const viewport = () => window.visualViewport;
    useWindowEvent("resize", measured, undefined, viewport);
    useWindowEvent("scroll", measured, undefined, viewport);
    useWindowEvent("scroll", measured, {passive: true});
    useWindowEvent("focusin", measured, undefined, () => document);
    useWindowEvent("focusin", focused, undefined, () => document);
    useWindowEvent("focusout", blurred, undefined, () => document);
    onMounted(measured);
}
