import {expect} from "vitest";
import {feeds} from "@journal/window-kit";
import {settle} from "./windowContext.js";

export const FOOT = 1000;
const PREVIOUS_PAGE = /--before(-id)?\b/;
const TOP = 0;

export const previousPageReads = (reads) => reads.filter((line) => PREVIOUS_PAGE.test(line));
const breaches = () => feeds.flatMap((feed) => feed.breaches);

// a pane that is 100px tall in a feed 1000px long, and scrolls where it is told to
function withPaneSizes() {
    Object.defineProperties(HTMLElement.prototype, {scrollHeight: {value: FOOT, configurable: true}, clientHeight: {value: 100, configurable: true}});
    HTMLElement.prototype.scrollTo = function scrollTo({top}) {
        this.scrollTop = top;
    };
    return () => {
        delete HTMLElement.prototype.scrollHeight;
        delete HTMLElement.prototype.clientHeight;
        delete HTMLElement.prototype.scrollTo;
    };
}

// Draws a feed window and checks it against the rules of the shared paginator: it reads the newest page only and opens at the bottom, one scroll
// to the top reads exactly one earlier page, and the window made a paginator that broke none of its rules. `draw` returns the drawn `element`
// and the window's `reads`; the newest page it answers has to say another page follows, so there is one to read.
export async function expectFeedRules(draw, {pane = (element) => element.querySelector(".auto-scroll-pane")} = {}) {
    const restore = withPaneSizes();
    feeds.length = 0;
    try {
        const {element, reads} = await draw();
        const scrolling = pane(element);
        expect(feeds.length, "the window made no feed paginator").toBeGreaterThan(0);
        expect(previousPageReads(reads), "the window read an earlier page on open").toEqual([]);
        expect(scrolling.scrollTop, "the window did not open at the bottom").toBe(FOOT);
        scrolling.scrollTop = TOP;
        scrolling.dispatchEvent(new Event("scroll"));
        await settle();
        expect(previousPageReads(reads), `one scroll up must read one earlier page, the window read: ${reads.join(" | ")}`).toHaveLength(1);
        expect(breaches()).toEqual([]);
        return {element, scrolling};
    } finally {
        restore();
        document.body.innerHTML = "";
    }
}
