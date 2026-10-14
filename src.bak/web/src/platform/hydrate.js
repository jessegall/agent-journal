export const EASE = "cubic-bezier(0.2, 0.9, 0.25, 1)";
const PARTS = ".hy";
const STAGGER = {head: 60, row: 26, other: 35};
const LONGEST = 440;
const RISE = 240;
const TICK = 420;
const WASH = "rgba(255, 255, 255, 0.055)";

export const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function tick(el, delay) {
    const to = Number(el.dataset.to);
    const start = performance.now() + delay;
    el.textContent = "0";
    const step = (now) => {
        const k = Math.min(1, Math.max(0, (now - start) / TICK));
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

export function hydrate(root, {base = 0, also = ""} = {}) {
    if (!root || still()) return;
    const parts = [...root.querySelectorAll(also ? `${also}, ${PARTS}` : PARTS)];
    let t = 0;
    const offsets = parts.map((el, i) => (i ? (t += STAGGER[el.dataset.hy] || STAGGER.other) : 0));
    const scale = t > LONGEST ? LONGEST / t : 1;
    parts.forEach((el, i) => {
        const delay = base + offsets[i] * scale;
        el.animate(
            [
                {opacity: 0, transform: "translateY(6px)"},
                {opacity: 1, transform: "none"},
            ],
            {duration: RISE, delay, easing: EASE, fill: "backwards"}
        );
        el.querySelectorAll("[data-to]").forEach((num) => tick(num, delay));
        if (el.dataset.changed) {
            el.animate([{backgroundColor: WASH}, {backgroundColor: WASH, offset: 0.35}, {backgroundColor: "rgba(255, 255, 255, 0)"}], {
                duration: 900,
                delay: delay + 100,
                easing: "ease-out",
            });
        }
    });
}
