import {nextButtons} from "./next.js";

const CONTROLS =
    "button, [role=button], [role=switch], [role=checkbox], [role=menuitem], [role=option], input, select, textarea, summary, label, [contenteditable=true]";
const NAVIGATION =
    ".demo-band, .side, [role=tablist], a[href], [aria-expanded], [title^=Close], [aria-label^=Close], .page-jump, .quick-row";
const PRESSES = ["pointerdown", "mousedown", "click", "dblclick", "dragstart"];
const MOVING = new Set(["Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", "Shift"]);

const hint = () => window.dispatchEvent(new CustomEvent("replay-hint"));
const outlined = (standIn, el) => nextButtons(standIn).some((button) => button.contains(el));

function pressable(standIn, target) {
    const control = target.closest(CONTROLS);
    return !control || Boolean(control.closest(NAVIGATION)) || outlined(standIn, control);
}

function typeable(standIn, event) {
    if (MOVING.has(event.key) || event.metaKey || event.ctrlKey) return true;
    return outlined(standIn, document.activeElement) && (event.key === "Enter" || event.key === " ");
}

function held(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.type === "click" || event.type === "keydown" || event.type === "dragstart") hint();
}

export function lockReplay(standIn) {
    const pressed = (event) => event.target instanceof Element && !pressable(standIn, event.target) && held(event);
    PRESSES.forEach((kind) => window.addEventListener(kind, pressed, true));
    window.addEventListener("keydown", (event) => typeable(standIn, event) || held(event), true);
}
