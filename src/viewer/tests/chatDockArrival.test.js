import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h, nextTick} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import ChatDock, {DOCK_ARRIVAL_MS} from "../src/kit/ChatDock.vue";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const SOURCE = readFileSync(resolve(__dirname, "../src/kit/ChatDock.vue"), "utf8");
let app;

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    app?.unmount();
    vi.useRealTimers();
});

function mountedDock() {
    const host = document.createElement("div");
    app = createApp({render: () => h(ChatDock, {folded: true, label: "Tests"})});
    app.mount(host);
    return host;
}

test("a new dock is folded from its first frame with no size transition", async () => {
    const host = mountedDock();
    await nextTick();
    const body = host.querySelector(".chat-dock-body");
    expect(body.classList.contains("folded")).toBe(true);
    expect(body.classList.contains("settled")).toBe(false);
    expect(host.querySelector(".chat-dock-grow").classList.contains("settled")).toBe(false);
});

test("once it has arrived its fold eases", async () => {
    const host = mountedDock();
    vi.advanceTimersByTime(DOCK_ARRIVAL_MS);
    await nextTick();
    expect(host.querySelector(".chat-dock-body").classList.contains("settled")).toBe(true);
});

test("the size of a card only eases under the settled class", () => {
    expect(SOURCE).toMatch(/\.chat-dock-body\.settled \{\n {4}transition:/);
    expect(SOURCE).toMatch(/\.chat-dock-grow\.settled \{\n {4}transition: height/);
    expect(SOURCE).not.toMatch(/\.chat-dock-body \{[^}]*transition/);
});
