export function follow(e, move, done = () => {}) {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const end = (ev) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", end);
        el.removeEventListener("pointercancel", end);
        el.releasePointerCapture(ev.pointerId);
        done(ev);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
}
