import {createApp, h, nextTick} from "vue";
import {expect, test, vi} from "vitest";
import ViewWindow from "../src/layout/ViewWindow.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";

const board = {name: "notes.board", title: "Board", icon: "window", entry_url: "", line: "task list", loading: "document", reads: [], runs: [], events: [], unavailable_reason: "", allowed: true};

test("a view window builds its own catalogue and event stream, draws its one window and docks back through the channel", async () => {
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 1, value: null, error: "refused"})}));
    const stream = vi.fn(() => () => {});
    const catalogue = new WindowCatalogue(async () => ({windows: [board]}));
    const element = document.createElement("div");
    createApp(() => h(ViewWindow, {environment: "main", view: "notes.board", float: 3, catalogue, events: stream})).mount(element);
    for (let round = 0; round < 8; round++) await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(stream).toHaveBeenCalledWith("main", expect.any(Function));
    expect(element.querySelector(".view-window-title").textContent).toBe("Board");
    expect(element.querySelectorAll(".window")).toHaveLength(1);
    vi.unstubAllGlobals();
});
