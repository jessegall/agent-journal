import {onUnmounted, ref} from "vue";
import {CONTROLS, sidewaysScroller, useDrag} from "./drag.js";

const EDGE = 24;
const COMMIT = 0.5;
const FLICK = 0.5;
const BACKWARD = -0.3;
const FASTEST = 180;
const SLOWEST = 320;

export function useEdgeBack(stack, {covered, back}) {
    const dragging = ref(false);
    const settle = ref(0);
    let swiped = false;
    let resting = 0;
    let pending = null;

    function pulled(dx, width) {
        const el = stack.value;
        if (!el) return;
        el.style.setProperty("--dx", `${dx}px`);
        el.style.setProperty("--p", String(Math.min(1, dx / width)));
    }

    function rest() {
        clearTimeout(resting);
        const after = pending;
        pending = null;
        settle.value = 0;
        after?.();
    }

    useDrag(stack, {
        axis: "x",
        begin: (event, first) => {
            if (pending) {
                rest();
                return null;
            }
            if (!covered() || first.clientX > EDGE || event.target.closest(CONTROLS)) return null;
            if (sidewaysScroller(event.target, stack.value)?.scrollLeft > 0) return null;
            return {width: stack.value.clientWidth};
        },
        accepts: (d) => d > 0,
        move: (d, context) => {
            if (!dragging.value) dragging.value = true;
            pulled(Math.max(0, d), context.width);
        },
        end: (d, v, context) => {
            const committed = v > FLICK || (d > COMMIT * context.width && v >= BACKWARD);
            const target = committed ? context.width : 0;
            settle.value = Math.round(Math.min(SLOWEST, Math.max(FASTEST, Math.abs(target - d) / Math.max(Math.abs(v), 0.001))));
            dragging.value = false;
            pulled(target, context.width);
            pending = committed
                ? () => {
                      swiped = true;
                      back();
                  }
                : null;
            resting = setTimeout(rest, settle.value);
        },
    });

    function landed() {
        const was = swiped;
        swiped = false;
        if (!was) return false;
        dragging.value = true;
        pulled(0, 1);
        requestAnimationFrame(() => requestAnimationFrame(() => (dragging.value = false)));
        return true;
    }

    onUnmounted(() => clearTimeout(resting));

    return {dragging, settle, landed};
}
