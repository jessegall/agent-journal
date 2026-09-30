import {onUnmounted, watch} from "vue";

const DECIDE = 6;
const DOMINANT = 1.2;
const WINDOW = 100;
const KEPT = 8;

export const CONTROLS = "button, a, input, textarea, select, label, summary, [data-peek], [role='button']";

export function sidewaysScroller(from, stop) {
    for (let el = from; el && el !== stop; el = el.parentElement) {
        if (el.scrollWidth > el.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(el).overflowX)) return el;
    }
    return null;
}

function speed(samples) {
    const last = samples.at(-1);
    const recent = samples.filter((sample) => last.t - sample.t <= WINDOW);
    const first = recent.length > 1 ? recent[0] : samples.at(-2);
    if (!first || last.t === first.t) return 0;
    return (last.d - first.d) / (last.t - first.t);
}

export function useDrag(area, {axis = "x", begin, accepts = () => true, move, end, drop = () => {}}) {
    let touch = null;

    const ours = (list) => [...list].find((one) => one.identifier === touch.id);

    function stop() {
        window.removeEventListener("touchmove", moved);
        window.removeEventListener("touchend", ended);
        window.removeEventListener("touchcancel", cancelled);
        touch = null;
    }

    function moved(event) {
        const now = ours(event.changedTouches);
        if (!now) return;
        const dx = now.clientX - touch.x;
        const dy = now.clientY - touch.y;
        const d = axis === "y" ? dy : dx;
        if (!touch.claimed) {
            if (touch.context.held) return;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < DECIDE) return;
            const along = Math.abs(axis === "y" ? dy : dx);
            const across = Math.abs(axis === "y" ? dx : dy);
            if (along <= DOMINANT * across || !accepts(d, touch.context)) {
                drop(touch.context);
                return stop();
            }
            touch.claimed = true;
            touch.samples = [{t: touch.t, d: 0}];
        }
        event.preventDefault();
        touch.d = d;
        touch.samples = [...touch.samples, {t: performance.now(), d}].slice(-KEPT);
        move(d, touch.context);
    }

    function ended(event) {
        if (!ours(event.changedTouches)) return;
        const {claimed, context, d, samples} = touch;
        if (claimed || context.held) event.preventDefault();
        stop();
        if (claimed) end(d, speed(samples), context);
        else drop(context);
    }

    function cancelled(event) {
        if (!ours(event.changedTouches)) return;
        const {claimed, context} = touch;
        stop();
        if (claimed) end(0, 0, context);
        else drop(context);
    }

    function began(event) {
        if (touch || event.touches.length > 1) return;
        const first = event.changedTouches[0];
        const context = begin(event, first);
        if (!context) return;
        touch = {id: first.identifier, x: first.clientX, y: first.clientY, t: performance.now(), d: 0, claimed: false, samples: [], context};
        window.addEventListener("touchmove", moved, {passive: false});
        window.addEventListener("touchend", ended, {passive: false});
        window.addEventListener("touchcancel", cancelled);
    }

    watch(
        area,
        (el, before) => {
            before?.removeEventListener("touchstart", began);
            el?.addEventListener("touchstart", began, {passive: true});
        },
        {immediate: true, flush: "post"},
    );

    onUnmounted(() => {
        area.value?.removeEventListener("touchstart", began);
        if (touch) {
            drop(touch.context);
            stop();
        }
    });
}
