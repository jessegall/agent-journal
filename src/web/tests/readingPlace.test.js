import {describe, expect, it} from "vitest";
import {ref} from "vue";
import {useReadingPlace} from "../src/composables/readingPlace.js";

// Turns laid out by hand, since jsdom lays nothing out.
function pane(heights) {
    const box = document.createElement("div");
    box.scrollTop = 0;
    const turns = heights.map((height, i) => {
        const el = document.createElement("div");
        el.dataset.ref = `messages:${i + 1}`;
        el.height = height;
        box.appendChild(el);
        return el;
    });
    const offset = (el) => turns.slice(0, turns.indexOf(el)).reduce((sum, t) => sum + t.height, 0);
    box.getBoundingClientRect = () => ({top: 0, bottom: 300});
    turns.forEach((el) => (el.getBoundingClientRect = () => ({top: offset(el) - box.scrollTop, bottom: offset(el) + el.height - box.scrollTop})));
    return {box, turns};
}

describe("the reading place", () => {
    it("keeps the turn being read where it was when a turn above it grows", () => {
        const {box, turns} = pane([100, 100, 100, 100]);
        box.scrollTop = 150;
        const place = useReadingPlace(ref(box));
        place.mark();
        turns[0].height = 260;
        place.hold();
        expect(box.scrollTop).toBe(310);
        expect(turns[1].getBoundingClientRect().top).toBe(-50);
    });

    it("keeps it when a turn above it is taken away", () => {
        const {box, turns} = pane([100, 100, 100, 100]);
        box.scrollTop = 250;
        const place = useReadingPlace(ref(box));
        place.mark();
        turns[0].height = 0;
        place.hold();
        expect(box.scrollTop).toBe(150);
    });

    it("leaves the pane alone once the reader is at the foot again", () => {
        const {box, turns} = pane([100, 100, 100, 100]);
        box.scrollTop = 150;
        const place = useReadingPlace(ref(box));
        place.mark();
        place.forget();
        turns[0].height = 260;
        place.hold();
        expect(box.scrollTop).toBe(150);
    });
});
