import {nextTick, onBeforeUnmount, ref, watch} from "vue";

export const LEAVE_MS = 120;
export const RESIZE_MS = 280;
export const ENTER_MS = 160;

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

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

    async function change(next) {
        const el = root.value;
        const token = ++run;
        if (!el || !el.offsetWidth || reducedMotion()) {
            folded.value = next;
            return;
        }
        const from = {width: el.offsetWidth, height: el.offsetHeight};
        lock(el, from);
        phase.value = "leaving";
        await later(LEAVE_MS);
        if (token !== run) return;
        folded.value = next;
        phase.value = "resizing";
        await nextTick();
        release(el);
        const to = {width: el.offsetWidth, height: el.offsetHeight};
        lock(el, from);
        void el.offsetWidth;
        el.style.transition = `width ${RESIZE_MS}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${RESIZE_MS}ms cubic-bezier(0.2, 0.9, 0.25, 1)`;
        lock(el, to);
        await later(RESIZE_MS);
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
