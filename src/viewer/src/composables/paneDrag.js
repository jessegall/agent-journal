import {onUnmounted, ref} from "vue";

const THRESHOLD = 6;

export function usePaneDrag(aim, land) {
    const drag = ref(null);
    let release = null;

    function grab(e, grip) {
        if (e.button) return;
        e.preventDefault();
        const start = {x: e.clientX, y: e.clientY};
        let moving = false;
        const move = (ev) => {
            if (!moving && Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) < THRESHOLD) return;
            moving = true;
            document.body.classList.add("dragging-view");
            drag.value = {view: grip.view, from: grip.from, x: ev.clientX, y: ev.clientY, target: aim(ev.clientX, ev.clientY, grip)};
        };
        const up = (ev) => {
            const target = moving && ev.type === "pointerup" ? aim(ev.clientX, ev.clientY, grip) : null;
            end();
            if (!moving) return grip.click && grip.click();
            if (target) land(grip, target);
        };
        const key = (ev) => ev.key === "Escape" && end();
        const end = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            window.removeEventListener("pointercancel", up);
            window.removeEventListener("keydown", key);
            document.body.classList.remove("dragging-view");
            drag.value = null;
            release = null;
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
        window.addEventListener("keydown", key);
        release = end;
    }

    onUnmounted(() => release && release());
    return {drag, grab};
}
