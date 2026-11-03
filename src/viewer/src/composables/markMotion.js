import {nextTick, onBeforeUnmount, ref, watch} from "vue";

export const LEAVE_MS = 120;
export const RESIZE_MS = 280;
export const ENTER_MS = 160;

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const STEPS = ["leaving", "resizing", "entering"];

// the size to the fraction of a pixel: a rounded one locks the mark a little off its real size, so it jumps when the lock comes off, and a width rounded down wraps its title
function measured(el) {
    const {width, height} = el.getBoundingClientRect();
    return {width, height};
}

// the size the mark has once its steps are over: read with the classes of the steps off, in the same breath, so what the steps change in how its
// title wraps is part of the size it grows or shrinks to, and nothing jumps when the last step ends
function finalSize(el) {
    const held = STEPS.filter((step) => el.classList.contains(step));
    el.classList.remove(...held);
    const size = measured(el);
    el.classList.add(...held);
    return size;
}

// How a chat mark opens and closes: its contents fade out quickly and are taken out while the mark keeps its size, so no text wraps;
// then the mark changes size in one transition, its top where it was; and only at its new size do the new contents fade in. `wanted`
// is whether it should be folded; `folded` is what it shows, and `phase` names the step it is in: leaving, resizing or entering. A mark
// not laid out, or a reader who asks for less motion, changes at once.
export function useMarkMotion(root, wanted, later = (ms) => new Promise((done) => setTimeout(done, ms))) {
    const folded = ref(wanted());
    const phase = ref("");
    let run = 0;

    const lock = (el, size) => Object.assign(el.style, {width: `${size.width}px`, height: `${size.height}px`});
    const release = (el) => Object.assign(el.style, {width: "", height: "", transition: ""});

    function resizeFrom(el, from) {
        release(el);
        const to = finalSize(el);
        lock(el, from);
        void el.offsetWidth;
        el.style.transition = `width ${RESIZE_MS}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${RESIZE_MS}ms cubic-bezier(0.2, 0.9, 0.25, 1)`;
        lock(el, to);
    }

    // contents that arrive while the mark resizes, such as a run's output, change where it is going: it turns towards the new size from where it is
    function followContents(el) {
        const contents = el.querySelector(":scope > :not(.top)");
        if (!contents || typeof ResizeObserver === "undefined") return null;
        let height = contents.offsetHeight;
        const watcher = new ResizeObserver(() => {
            if (contents.offsetHeight === height) return;
            height = contents.offsetHeight;
            resizeFrom(el, measured(el));
        });
        watcher.observe(contents);
        return watcher;
    }

    async function change(next) {
        const el = root.value;
        const token = ++run;
        if (!el || !el.offsetWidth || reducedMotion()) {
            folded.value = next;
            return;
        }
        const from = measured(el);
        lock(el, from);
        phase.value = "leaving";
        await later(LEAVE_MS);
        if (token !== run) return;
        folded.value = next;
        phase.value = "resizing";
        await nextTick();
        resizeFrom(el, from);
        const watcher = followContents(el);
        await later(RESIZE_MS);
        watcher?.disconnect();
        if (token !== run) return;
        release(el);
        phase.value = "entering";
        await later(ENTER_MS);
        if (token === run) phase.value = "";
    }

    watch(wanted, (next) => change(next));
    onBeforeUnmount(() => {
        run += 1;
    });
    return {folded, phase};
}
