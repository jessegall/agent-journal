import {unref} from "vue";

// how many of the rows in view are marked, so one removed or folded into another still leaves a row to hold the view by
const MARKS = 4;

// Keeps the rows a reader scrolled up to in place when rows change height, appear, fold or go, holding the view by its lowest rows: the
// lowest marked row still on the page has its foot put back where it was in the view, so a row that grows pushes what is above it up and
// never what is below it down, and the marks are taken again from there; Safari has no scroll anchoring of its own.
export function useReadingPlace(scroller) {
    let places = [];

    function inView(box) {
        const {top, bottom} = box.getBoundingClientRect();
        return [...box.querySelectorAll("[data-ref]")]
            .map((el) => ({el, rect: el.getBoundingClientRect()}))
            .filter(({rect}) => rect.bottom > top && rect.top < bottom)
            .slice(-MARKS)
            .reverse()
            .map(({el, rect}) => ({ref: el.dataset.ref, above: bottom - rect.bottom}));
    }

    function mark() {
        const box = unref(scroller);
        places = box ? inView(box) : [];
    }

    function forget() {
        places = [];
    }

    function hold() {
        const box = unref(scroller);
        if (!box || !places.length) return;
        const rows = new Map([...box.querySelectorAll("[data-ref]")].map((el) => [el.dataset.ref, el]));
        const place = places.find((each) => rows.has(each.ref));
        if (!place) return;
        const drift = place.above - (box.getBoundingClientRect().bottom - rows.get(place.ref).getBoundingClientRect().bottom);
        if (Math.abs(drift) >= 1) box.scrollTop += drift;
        mark();
    }

    return {mark, forget, hold};
}
