import {nextTick, onMounted, onUnmounted, ref} from "vue";

const landing = ref(null);
const EASE = "cubic-bezier(0.2, 0.9, 0.25, 1)";

export function useLanding(el) {
    onMounted(() => (landing.value = el.value));
    onUnmounted(() => landing.value === el.value && (landing.value = null));
}

export async function flyToBar(card, change) {
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return change();
    const from = card.getBoundingClientRect();
    const ghost = card.cloneNode(true);
    ghost.classList.add("plan-ghost");
    Object.assign(ghost.style, {
        position: "fixed",
        zIndex: "60",
        margin: "0",
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
        overflow: "hidden",
        pointerEvents: "none",
    });
    document.body.appendChild(ghost);
    ghost.querySelectorAll("[data-fades]").forEach((el) => el.animate([{opacity: 1}, {opacity: 0}], {duration: 160, fill: "forwards"}));
    const done = change();
    await nextTick();
    const bar = landing.value;
    const gone = () => ghost.animate([{opacity: 1}, {opacity: 0}], {duration: 200, fill: "forwards"}).finished.then(() => ghost.remove());
    if (!bar) {
        gone();
        return done;
    }
    const to = bar.getBoundingClientRect();
    const flight = ghost.animate(
        [
            {left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: "10px"},
            {
                left: `${to.left}px`,
                top: `${to.top}px`,
                width: `${to.width}px`,
                height: getComputedStyle(bar).getPropertyValue("--planbar-height"),
                borderRadius: "0px",
            },
        ],
        {duration: 380, easing: EASE, fill: "forwards"}
    );
    flight.finished.then(gone);
    return done;
}
