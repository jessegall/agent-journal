import {nextTick, onMounted, onUnmounted} from "vue";

let pressed = null;

document.addEventListener("pointerdown", (event) => (pressed = event.target.closest?.("button, a[href], [tabindex]") || null), {capture: true, passive: true});

const FOCUSABLE = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function useTrap(box, close) {
    let opener = null;

    function kept(event) {
        if (event.key === "Escape") return close();
        if (event.key !== "Tab" || !box.value) return;
        const all = [...box.value.querySelectorAll(FOCUSABLE)];
        if (!all.length) return event.preventDefault();
        const [first, last] = [all[0], all.at(-1)];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    onMounted(() => {
        opener = document.activeElement && document.activeElement !== document.body ? document.activeElement : pressed;
        document.addEventListener("keydown", kept);
        nextTick(() => box.value?.focus({preventScroll: true}));
    });

    onUnmounted(() => {
        document.removeEventListener("keydown", kept);
        opener?.focus?.({preventScroll: true});
    });
}
