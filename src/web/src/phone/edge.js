import {ref} from "vue";
import {CONTROLS, sidewaysScroller, useDrag} from "./drag.js";

const EDGE = 24;
const COMMIT = 0.5;
const FLICK = 0.5;
const BACKWARD = -0.3;
const FASTEST = 180;
const SLOWEST = 320;

export function useEdgeBack(stack, {covered, back}) {
    const dx = ref(0);
    const width = ref(1);
    const dragging = ref(false);
    const settle = ref(0);
    let swiped = false;
    let resting = 0;

    useDrag(stack, {
        axis: "x",
        begin: (event, first) => {
            if (!covered() || first.clientX > EDGE || event.target.closest(CONTROLS)) return null;
            if (sidewaysScroller(event.target, stack.value)?.scrollLeft > 0) return null;
            return {width: stack.value.clientWidth};
        },
        accepts: (d) => d > 0,
        move: (d, context) => {
            clearTimeout(resting);
            settle.value = 0;
            dragging.value = true;
            width.value = context.width;
            dx.value = Math.max(0, d);
        },
        end: (d, v, context) => {
            const committed = v > FLICK || (d > COMMIT * context.width && v >= BACKWARD);
            const target = committed ? context.width : 0;
            settle.value = Math.round(Math.min(SLOWEST, Math.max(FASTEST, Math.abs(target - d) / Math.max(Math.abs(v), 0.001))));
            dragging.value = false;
            dx.value = target;
            resting = setTimeout(() => {
                settle.value = 0;
                if (!committed) return;
                swiped = true;
                back();
            }, settle.value);
        },
    });

    function landed() {
        const was = swiped;
        swiped = false;
        if (!was) return false;
        dragging.value = true;
        dx.value = 0;
        requestAnimationFrame(() => requestAnimationFrame(() => (dragging.value = false)));
        return true;
    }

    return {dx, width, dragging, settle, landed};
}
