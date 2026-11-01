// The chat's visible faces that a drop can stick to, kept by their elements so a stain follows a bubble when it scrolls. A partly
// hidden bubble catches drops only on its visible part, above the composer and inside the thread's scroll view.
const SURFACES = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]";

const intersect = (a, b) => ({left: Math.max(a.left, b.left), right: Math.min(a.right, b.right), top: Math.max(a.top, b.top), bottom: Math.min(a.bottom, b.bottom)});
const hasArea = (box) => box.right > box.left && box.bottom > box.top;

export function slushSurfaces(thread = document.querySelector("[data-figure-home]")?.closest(".thread")) {
    if (!thread) return [];
    const world = thread.getBoundingClientRect();
    const foot = thread.querySelector("[data-figure-chat-foot]")?.getBoundingClientRect();
    return [...thread.querySelectorAll(SURFACES)].flatMap((element) => {
        if (element.checkVisibility && !element.checkVisibility({opacityProperty: true, visibilityProperty: true})) return [];
        const box = element.getBoundingClientRect();
        let clip = intersect(box, world);
        const scroll = element.closest(".thread-scroll");
        if (scroll && !element.closest("[data-figure-chat-foot]")) {
            clip = intersect(clip, scroll.getBoundingClientRect());
            if (foot) clip.bottom = Math.min(clip.bottom, foot.top);
        }
        return hasArea(clip) ? [{id: element, left: box.left, right: box.right, top: box.top, bottom: box.bottom, clip}] : [];
    });
}

// The first face crossed by a drop's short flight segment, including a narrow box that lies between both sampled endpoints. The
// contact keeps its offset inside that element; drawing it later uses the element's current box rather than the window's coordinates.
export function hitSurface(from, to, surfaces) {
    let first = null;
    for (const surface of surfaces) {
        const box = surface.clip ?? surface;
        let enter = 0;
        let leave = 1;
        for (const [axis, low, high] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
            const distance = to[axis] - from[axis];
            if (Math.abs(distance) < 1e-9) {
                if (from[axis] < box[low] || from[axis] > box[high]) leave = -1;
            } else {
                const a = (box[low] - from[axis]) / distance;
                const b = (box[high] - from[axis]) / distance;
                enter = Math.max(enter, Math.min(a, b));
                leave = Math.min(leave, Math.max(a, b));
            }
        }
        if (enter > leave || (first && enter >= first.share)) continue;
        const x = from.x + (to.x - from.x) * enter;
        const y = from.y + (to.y - from.y) * enter;
        first = {share: enter, x, y, on: "surface", surface: surface.id, dx: x - surface.left, dy: y - surface.top};
    }
    return first;
}
