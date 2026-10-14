// @vitest-environment node
import {afterEach, expect, test} from "vitest";

const {readFloors} = await import("../src/figure/floors.js");

const CHAT = {left: 200, top: 100, right: 900, bottom: 800};
const VIEW = {left: 200, top: 100, right: 900, bottom: 540};

const element = (box) => ({getBoundingClientRect: () => ({width: box.right - box.left, height: box.bottom - box.top, ...box})});

// a page with a compose box, the bars docked over it while there are any, and the chat's bubbles and the page's tabs at their boxes
const page = ({docked = null, bubbles = [], tabs = []} = {}) => {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    const bars = docked && element(docked);
    const scroll = {...element(VIEW), querySelectorAll: () => bubbles};
    const thread = {
        ...element(CHAT),
        querySelector: (selector) => ({"[data-figure-docked-bars]": bars, ".thread-scroll": scroll})[selector] ?? null,
    };
    const home = {...element({left: 300, right: 700, top: 600, bottom: 720}), closest: () => thread};
    globalThis.document = {
        querySelector: (selector) => (selector === "[data-figure-home]" ? home : null),
        querySelectorAll: () => tabs,
    };
    return home;
};

const kinds = (snapshot) => snapshot.floors.map((floor) => [floor.kind, floor.top]);

afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
});

test("home is the compose box, and only the bars docked over it while they are there, with the window's foot under everything", () => {
    page();
    expect(kinds(readFloors())).toEqual([
        ["compose", 600],
        ["foot", 800],
    ]);
    page({docked: {left: 300, right: 700, top: 556, bottom: 600}});
    expect(kinds(readFloors())).toEqual([
        ["dock", 556],
        ["foot", 800],
    ]);
});

test("a bubble keeps its floor's id while the chat scrolls it, and its speed is measured from the read before", () => {
    const box = {left: 300, right: 600, top: 400, bottom: 460};
    const bubble = element(box);
    page({bubbles: [bubble]});
    const first = readFloors(undefined, 1000);
    const id = first.floors.find((floor) => floor.kind === "bubble").id;
    box.top = 380;
    const second = readFloors(first, 1100).floors.find((floor) => floor.kind === "bubble");
    expect(second).toMatchObject({id, top: 380, vy: -200});
});

test("a floor read after a long gap starts still, so the figure is carried to it rather than thrown", () => {
    const box = {left: 300, right: 600, top: 400, bottom: 460};
    page({bubbles: [element(box)]});
    const first = readFloors(undefined, 1000);
    box.top = 300;
    expect(readFloors(first, 5000).floors.find((floor) => floor.kind === "bubble").vy).toBe(0);
});

test("a bubble scrolled out of the chat's view is no floor, and neither is a tab with no size", () => {
    page({
        bubbles: [element({left: 300, right: 600, top: 560, bottom: 620}), element({left: 300, right: 600, top: 200, bottom: 260})],
        tabs: [element({left: 400, right: 400, top: 60, bottom: 60}), element({left: 500, right: 540, top: 60, bottom: 90})],
    });
    expect(kinds(readFloors())).toEqual([
        ["compose", 600],
        ["bubble", 200],
        ["tab", 60],
        ["foot", 800],
    ]);
});
