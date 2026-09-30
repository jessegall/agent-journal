import {onUnmounted, ref, watch} from "vue";
import {CONTROLS, sidewaysScroller, useDrag} from "./drag.js";

const EDGE = 24;
const COMMIT = 0.5;
const FLICK = 0.5;
const BACKWARD = -0.3;
const FASTEST = 180;
const SLOWEST = 320;
const GIVE_UP = 1000;

export function useEdgeBack(stack, {depth, back}) {
    const dragging = ref(false);
    const leaving = ref(false);
    const settle = ref(0);
    let resting = 0;
    let stuck = 0;
    let pending = null;
    let awaiting = -1;

    const width = () => stack.value?.clientWidth || 1;
    const departing = () => [...(stack.value?.querySelectorAll(".page:not(.beneath):not(.buried)") || [])].at(-1);
    const covers = (x) => {
        const page = departing();
        return Boolean(page) && page.getBoundingClientRect().left <= x;
    };
    const slid = (event) => pending && event.propertyName === "transform" && event.target === departing() && rest();
    const busy = () => pending !== null || awaiting >= 0;

    function pulled(dx) {
        const el = stack.value;
        if (!el) return;
        el.style.setProperty("--dx", `${dx}px`);
        el.style.setProperty("--p", String(Math.min(1, dx / width())));
    }

    function rest() {
        clearTimeout(resting);
        const after = pending;
        pending = null;
        settle.value = 0;
        after?.();
    }

    function popping(expected) {
        awaiting = expected;
        clearTimeout(stuck);
        stuck = setTimeout(() => {
            if (awaiting < 0) return;
            awaiting = -1;
            leaving.value = false;
            pulled(0);
        }, GIVE_UP);
        back();
    }

    useDrag(stack, {
        axis: "x",
        begin: (event, first) => {
            if (busy()) {
                const covered = covers(first.clientX);
                if (pending) rest();
                return covered ? {held: true} : null;
            }
            if (!depth() || first.clientX > EDGE || event.target.closest(CONTROLS)) return null;
            if (sidewaysScroller(event.target, stack.value)?.scrollLeft > 0) return null;
            return {};
        },
        accepts: (d) => d > 0,
        move: (d) => {
            if (!dragging.value) dragging.value = true;
            pulled(Math.max(0, d));
        },
        end: (d, v) => {
            const full = width();
            const committed = v > FLICK || (d > COMMIT * full && v >= BACKWARD);
            const target = committed ? full : 0;
            const expected = depth() - 1;
            settle.value = Math.round(Math.min(SLOWEST, Math.max(FASTEST, Math.abs(target - d) / Math.max(Math.abs(v), 0.001))));
            dragging.value = false;
            pulled(target);
            pending = committed ? () => popping(expected) : null;
            leaving.value = committed;
            resting = setTimeout(rest, settle.value);
        },
    });

    function landed(count) {
        if (awaiting < 0) return false;
        const swiped = count === awaiting;
        awaiting = -1;
        leaving.value = false;
        clearTimeout(stuck);
        if (!swiped) return false;
        dragging.value = true;
        pulled(0);
        requestAnimationFrame(() => requestAnimationFrame(() => (dragging.value = false)));
        return true;
    }

    watch(
        stack,
        (el, before) => {
            before?.removeEventListener("transitionend", slid);
            el?.addEventListener("transitionend", slid);
        },
        {immediate: true, flush: "post"},
    );

    onUnmounted(() => {
        stack.value?.removeEventListener("transitionend", slid);
        clearTimeout(resting);
        clearTimeout(stuck);
    });

    return {dragging, leaving, settle, landed, busy};
}
