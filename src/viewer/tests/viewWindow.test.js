import {createApp, h, nextTick} from "vue";
import {expect, test, vi} from "vitest";
import ViewWindow from "../src/layout/ViewWindow.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {perLine} from "./support/windowContext.js";

globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};

const board = {name: "notes.board", title: "Board", icon: "window", entry_url: "", line: "task list", loading: "document", reads: [], runs: [], events: [], unavailable_reason: "", allowed: true};

test("a view window builds its own catalogue and event stream, draws its one window and docks back through the channel", async () => {
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => ({code: 1, value: null, error: "refused"})})));
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

test("a window on a page of its own opens a row in the panel, as Home does", async () => {
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => ({code: 1, value: null, error: "refused"})})));
    window.location.hash = "#?open=plans:7";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    const catalogue = new WindowCatalogue(async () => ({windows: [board]}));
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(ViewWindow, {environment: "main", view: "notes.board", float: 0, standalone: true, catalogue, events: () => () => {}}));
    app.mount(element);
    for (let round = 0; round < 8; round++) await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(document.querySelector("[data-resource-close]")).not.toBeNull();
    app.unmount();
    window.location.hash = "";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    element.remove();
    vi.unstubAllGlobals();
});

const terminal = {...board, name: "coding.terminal", title: "Terminal", shows: "one-agent", line: "agent terminal"};

async function pageOf(answer) {
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => answer})));
    const catalogue = new WindowCatalogue(async () => ({windows: [terminal]}));
    const element = document.createElement("div");
    const app = createApp(() => h(ViewWindow, {environment: "main", view: "coding.terminal", float: 0, standalone: true, catalogue, events: () => () => {}}));
    app.mount(element);
    for (let round = 0; round < 8; round++) await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    return {element, app};
}

test("an agent's window on a page of its own with no agent running says so and reads nothing", async () => {
    const {element, app} = await pageOf({code: 1, value: null, error: "refused"});
    expect(element.textContent).toContain("No agent is running here");
    expect(element.querySelectorAll(".window")).toHaveLength(0);
    app.unmount();
    vi.unstubAllGlobals();
});

test("an agent's window on a page of its own draws for the main agent", async () => {
    const {element, app} = await pageOf({code: 0, value: {agents: [{id: 4, role: "worker"}, {id: 9, role: "main"}], rows: []}, error: ""});
    expect(element.textContent).not.toContain("No agent is running here");
    expect(element.querySelectorAll(".window")).toHaveLength(1);
    app.unmount();
    vi.unstubAllGlobals();
});

