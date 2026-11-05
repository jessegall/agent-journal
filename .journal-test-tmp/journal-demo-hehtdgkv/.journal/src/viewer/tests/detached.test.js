import {expect, test, vi} from "vitest";
import {useDetached} from "../src/composables/detached.js";
import {paneLayout} from "../src/windows/paneLayout.js";

const entries = {"a.chat": {name: "a.chat", title: "Chat", float_width: 640, float_height: 420}, "a.tasks": {name: "a.tasks", title: "Tasks"}};

async function floating() {
    const store = paneLayout({
        saved: async () => null,
        defaults: async () => ({dir: "row", r: 0.5, a: {tabs: ["a.chat"], active: "a.chat"}, b: {tabs: ["a.tasks"], active: "a.tasks"}}),
        save: async () => ({ok: true, version: 1}),
        tab: {read: () => null, write: () => {}},
        entry: (name) => entries[name] || null,
    });
    await store.load({environment: "main", person: 1, suite: "coding", page: "home", driver: "coding.builder"});
    const detached = useDetached(store, {window: (name) => entries[name] || null}, "main");
    const first = store.panes.value.find((pane) => pane.pane.active === "a.chat").id;
    detached.detach(first);
    return {store, detached};
}

test("detaching opens a float at the window's declared size, and takes the window out of its pane", async () => {
    const {store, detached} = await floating();
    expect(detached.floats.value).toEqual([expect.objectContaining({view: "a.chat", w: 640, h: 420})]);
    expect(store.panes.value.filter((pane) => pane.state === "live")).toHaveLength(1);
});

test("a float moves, but never past the window's edge, and resizes within the window", async () => {
    const {detached} = await floating();
    const id = detached.floats.value[0].id;
    detached.move(id, {x: 200, y: 150});
    expect(detached.floats.value[0]).toEqual(expect.objectContaining({x: 200, y: 150}));
    detached.move(id, {x: 99999, y: 99999});
    expect(detached.floats.value[0].x).toBe(window.innerWidth - 40);
    expect(detached.floats.value[0].y).toBe(window.innerHeight - 40);
    detached.size(id, {w: 10, h: 10});
    expect(detached.floats.value[0]).toEqual(expect.objectContaining({w: 260, h: 180}));
});

test("docking puts the float back in a pane and leaves no float", async () => {
    const {store, detached} = await floating();
    detached.dock(detached.floats.value[0].id);
    expect(detached.floats.value).toEqual([]);
    expect(store.panes.value.some((pane) => pane.pane.tabs.includes("a.chat"))).toBe(true);
});

test("sending away opens a browser window, and a blocked one leaves the float", async () => {
    const {store, detached} = await floating();
    const id = detached.floats.value[0].id;
    vi.stubGlobal("open", () => null);
    expect(detached.sendAway(id)).toBeNull();
    expect(detached.floats.value).toHaveLength(1);
    vi.stubGlobal("open", () => ({}));
    expect(detached.sendAway(id)).toEqual(expect.objectContaining({view: "a.chat"}));
    expect(detached.floats.value).toEqual([]);
    expect(store.layout.value.away).toHaveLength(1);
    vi.unstubAllGlobals();
});
