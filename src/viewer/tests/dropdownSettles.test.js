import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h, nextTick} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import WindowDropdown from "../src/windows/WindowDropdown.vue";

const SOURCE = readFileSync(resolve(__dirname, "../src/windows/WindowDropdown.vue"), "utf8");
const CATALOGUE = {dropdown: () => null, window: () => null, skeleton: () => [], loaded: {value: false}};
const GROUPS = [{name: "usage.context", title: "Context", count: 0}];
const WIDTH_MS = 200;
let app;
let host;
let width;
let resized;

beforeEach(() => {
    vi.useFakeTimers();
    width = 240;
    vi.stubGlobal("ResizeObserver", class {
        constructor(callback) {
            resized = callback;
        }
        observe() {}
        disconnect() {}
    });
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(() => width);
});
afterEach(() => {
    app?.unmount();
    host?.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

function opened(anchor = null) {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp(() => h(WindowDropdown, {groups: GROUPS, anchor, catalogue: CATALOGUE, subscriptions: {}, environment: "main"}));
    app.mount(host);
    return host.querySelector("[data-dropdown]");
}

test("a dropdown opens under its button, and moves left only as far as its own width needs to stay in the window", async () => {
    const panel = opened({getBoundingClientRect: () => ({left: window.innerWidth - 100, bottom: 90})});
    await nextTick();
    expect(panel.style.left).toBe(`${window.innerWidth - width - 8}px`);
    app.unmount();
    host.remove();
    const roomy = opened({getBoundingClientRect: () => ({left: 40, bottom: 90})});
    await nextTick();
    expect(roomy.style.left).toBe("40px");
    expect(roomy.style.top).toBe("96px");
});

test("a dropdown at rest shows its contents at the width it has", () => {
    const panel = opened();
    resized();
    expect(panel.hasAttribute("data-settling")).toBe(false);
    expect(panel.style.width).toBe("");
});

test("when new contents change the width, the panel moves from the old width to the new one with its contents hidden", () => {
    const panel = opened();
    width = 434;
    resized();
    expect(panel.hasAttribute("data-settling")).toBe(true);
    expect(panel.style.width).toBe("434px");
    expect(panel.style.transition).toContain(`width ${WIDTH_MS}ms`);
});

test("the contents show again only once the width has settled, and the panel is left to fit them", () => {
    const panel = opened();
    width = 434;
    resized();
    vi.advanceTimersByTime(WIDTH_MS - 1);
    expect(panel.hasAttribute("data-settling")).toBe(true);
    vi.advanceTimersByTime(1);
    expect(panel.hasAttribute("data-settling")).toBe(false);
    expect(panel.style.width).toBe("");
    expect(panel.style.transition).toBe("");
});

test("a width that did not change leaves the contents showing", () => {
    const panel = opened();
    width = 241;
    resized();
    expect(panel.hasAttribute("data-settling")).toBe(false);
});

test("hidden contents fade in once shown and hide at once, with no fade out", () => {
    expect(SOURCE).toMatch(/\.dropdown-body \{[^}]*transition: opacity 0\.16s ease;/);
    expect(SOURCE).toMatch(/\.dropdown\[data-settling\] \.dropdown-body \{\s*opacity: 0;\s*transition: none;/);
});

test("the helpers dropdown keeps one width", () => {
    expect(SOURCE).toMatch(/\.dropdown\[data-dropdown="agents\.helpers"\] \{\s*width: min\(460px, calc\(100vw - 16px\)\);/);
});
