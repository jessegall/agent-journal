import {unref} from "vue";

// Keeps the turn a reader scrolled up to in place when turns above it change height; Safari has no scroll anchoring of its own.
export function useReadingPlace(scroller) {
    let place = null;

    function inView(box) {
        const top = box.getBoundingClientRect().top;
        for (const el of box.querySelectorAll("[data-ref]")) {
            const rect = el.getBoundingClientRect();
            if (rect.bottom > top) return {ref: el.dataset.ref, below: rect.top - top};
        }
        return null;
    }

    function mark() {
        const box = unref(scroller);
        place = box ? inView(box) : null;
    }

    function forget() {
        place = null;
    }

    function hold() {
        const box = unref(scroller);
        if (!box || !place) return;
        const el = [...box.querySelectorAll("[data-ref]")].find((turn) => turn.dataset.ref === place.ref);
        if (!el) return;
        const drift = el.getBoundingClientRect().top - box.getBoundingClientRect().top - place.below;
        if (Math.abs(drift) >= 1) box.scrollTop += drift;
    }

    return {mark, forget, hold};
}
