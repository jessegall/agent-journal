import {onUnmounted} from "vue";
import {tick} from "../haptic.js";

export const CUE_AFTER = 150;
export const HOLD_FOR = 480;
export const SLIP = 4;

export function usePress(hold) {
    let pressed = null;
    let swallow = false;

    function lift() {
        if (!pressed) return;
        clearTimeout(pressed.cue);
        clearTimeout(pressed.timer);
        pressed.el.classList.remove("pressing");
        pressed = null;
    }

    function held() {
        const el = pressed.el;
        lift();
        swallow = true;
        tick();
        hold(el);
    }

    function down(event) {
        if (event.button > 0) return;
        lift();
        swallow = false;
        const el = event.currentTarget;
        pressed = {
            el,
            x: event.clientX,
            y: event.clientY,
            cue: setTimeout(() => el.classList.add("pressing"), CUE_AFTER),
            timer: setTimeout(held, HOLD_FOR),
        };
    }

    function moved(event) {
        if (pressed && Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) > SLIP) lift();
    }

    function took() {
        const was = swallow;
        swallow = false;
        return was;
    }

    onUnmounted(lift);

    return {down, moved, lift, took};
}
