import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {createApp, h, nextTick, ref, withDirectives} from "vue";
import Tooltip from "../src/kit/Tooltip.vue";
import {HIDE_AFTER, LEAVE_FOR, hide, place, shown, tip} from "../src/kit/tip.js";

const words = ref({title: "Builder", line: "Builds it itself."});
const identity = ref(0);
const withTip = (node, key, value) => withDirectives(node, [[tip, value, key]]);
let app;

const Bar = {
    render: () =>
        h("div", [
            withTip(h("button", {id: "one", key: identity.value}, "Builder"), "mode:one", words.value),
            withTip(h("button", {id: "two"}, "Solo"), "mode:two", {title: "Solo", line: "No helpers."}),
            h(Tooltip),
        ]),
};

const rect = (el, box) => (el.getBoundingClientRect = () => ({...box, right: box.left + box.width, bottom: box.top + box.height}));
const point = (id) => document.getElementById(id).dispatchEvent(new Event("pointerover", {bubbles: true}));
const bubble = () => document.getElementById("kit-tooltip");

async function settle() {
    await nextTick();
    await nextTick();
}

beforeEach(() => {
    vi.useFakeTimers();
    document.elementFromPoint = () => null;
    words.value = {title: "Builder", line: "Builds it itself."};
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {configurable: true, get: () => 200});
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {configurable: true, get: () => 40});
    app = createApp(Bar);
    app.directive("tip", tip);
    app.mount(document.body.appendChild(document.createElement("div")));
    rect(document.getElementById("one"), {left: 100, top: 10, width: 60, height: 20});
    rect(document.getElementById("two"), {left: 300, top: 740, width: 60, height: 20});
});

afterEach(() => {
    app.unmount();
    document.body.innerHTML = "";
    vi.useRealTimers();
});

test("pointing at a button shows its words at once, under it, and points the button at the bubble", async () => {
    point("one");
    await settle();
    expect(bubble().hidden).toBe(false);
    expect(bubble().getAttribute("role")).toBe("tooltip");
    expect(bubble().textContent).toContain("Builds it itself.");
    expect(shown.side).toBe("below");
    expect(document.getElementById("one").getAttribute("aria-describedby")).toBe("kit-tooltip");
});

test("a redraw keeps the bubble open and puts the new words in place", async () => {
    point("one");
    await settle();
    words.value = {title: "Builder", line: "Now with helpers out."};
    await settle();
    expect(bubble().hidden).toBe(false);
    expect(bubble().textContent).toContain("Now with helpers out.");
});

test("a button redrawn as a new element keeps the bubble, now measured against the new element", async () => {
    point("one");
    await settle();
    identity.value += 1;
    await settle();
    rect(document.getElementById("one"), {left: 400, top: 10, width: 60, height: 20});
    words.value = {...words.value};
    await settle();
    expect(bubble().hidden).toBe(false);
    expect(shown.x).toBe(330);
});

test("a button that appears under a pointer that has not moved shows its words", async () => {
    document.getElementById("one").dispatchEvent(new MouseEvent("pointerover", {bubbles: true, clientX: 120, clientY: 20}));
    await settle();
    hide(true);
    await settle();
    identity.value += 1;
    document.elementFromPoint = () => document.getElementById("one");
    await settle();
    expect(shown.key).toBe("mode:one");
});

test("near the bottom of the window the bubble opens above, and stays inside the sides", async () => {
    point("two");
    await settle();
    expect(shown.side).toBe("above");
    const spot = place({left: 0, top: 10, width: 20, bottom: 30}, {width: 200, height: 40}, {top: 0, left: 0, right: 800, bottom: 800}, "below");
    expect(spot.x).toBe(8);
    expect(spot.arrow).toBe(10);
});

test("Esc closes it and it stays closed until another button is reached", async () => {
    point("one");
    await settle();
    document.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    expect(bubble().hidden).toBe(true);
    point("one");
    expect(shown.key).toBeNull();
    point("two");
    expect(shown.key).toBe("mode:two");
});

test("leaving the button closes it after a short wait", async () => {
    point("one");
    document.body.dispatchEvent(new Event("pointerover", {bubbles: true}));
    vi.advanceTimersByTime(HIDE_AFTER + LEAVE_FOR + 1);
    expect(shown.key).toBeNull();
});

test("scrolling a list that does not hold the button leaves the bubble open, and scrolling the page closes it", async () => {
    const list = document.body.appendChild(document.createElement("div"));
    point("one");
    await settle();
    list.dispatchEvent(new Event("scroll"));
    expect(shown.key).toBe("mode:one");
    document.dispatchEvent(new Event("scroll"));
    expect(shown.key).toBeNull();
});
