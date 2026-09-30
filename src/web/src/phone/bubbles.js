import {CONTROLS, sidewaysScroller, useDrag} from "./drag.js";
import {tick} from "./haptic.js";

const HOLD_FOR = 450;
const PRESS_AFTER = 120;
const EDGE = 24;
const REPLY_AT = 56;
const REACH = 64;
const BEYOND = 0.15;

function calm(context) {
    clearTimeout(context.timer);
    clearTimeout(context.pressing);
    delete context.el.dataset.pressing;
}

function loosen(el) {
    delete el.dataset.dragging;
    el.style.transform = "";
    el.style.removeProperty("--pull");
}

export function useBubbles(list, {hold, reply}) {
    useDrag(list, {
        axis: "x",
        begin: (event, first) => {
            const el = event.target.closest("[data-hold]");
            if (!el || event.target.closest(CONTROLS)) return null;
            const context = {el, held: false, crossed: false};
            context.swipes = first.clientX > EDGE && !sidewaysScroller(event.target, el);
            context.pressing = setTimeout(() => (el.dataset.pressing = ""), PRESS_AFTER);
            context.timer = setTimeout(() => {
                calm(context);
                context.held = true;
                navigator.vibrate?.(10);
                hold(el.dataset.hold, el.getBoundingClientRect(), el);
            }, HOLD_FOR);
            return context;
        },
        accepts: (d, context) => {
            calm(context);
            return context.swipes && d > 0;
        },
        move: (d, context) => {
            const el = context.el;
            el.dataset.dragging = "";
            el.style.transform = `translateX(${Math.min(d, REACH) + Math.max(0, d - REACH) * BEYOND}px)`;
            el.style.setProperty("--pull", String(Math.min(1, Math.max(0, d) / REPLY_AT)));
            if (d >= REPLY_AT && !context.crossed) tick();
            context.crossed = d >= REPLY_AT;
        },
        end: (d, v, context) => {
            loosen(context.el);
            if (d >= REPLY_AT) reply(context.el.dataset.hold);
        },
        drop: calm,
    });
}
