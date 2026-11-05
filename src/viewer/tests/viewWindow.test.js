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
    expect(stream).toHaveBeenCalledWith("main", expect.any(Function), expect.objectContaining({__v_isRef: true}));
    expect(stream.mock.calls[0][2].value).toContain("registry.sync");
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

const library = {...board, name: "docs.library", title: "Library", place: "page"};
const notes = {...board, name: "docs.notes", title: "Notes", place: "page"};

async function pageShell(events) {
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => ({code: 1, value: null, error: "refused"})})));
    const fetchCatalogue = vi.fn(async () => ({windows: [library, notes]}));
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(ViewWindow, {environment: "main", view: "docs.library", float: 0, standalone: true, catalogue: new WindowCatalogue(fetchCatalogue), events}));
    app.mount(element);
    for (let round = 0; round < 8; round++) await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    return {element, app, fetchCatalogue};
}

const settled = async () => {
    for (let round = 0; round < 8; round++) await new Promise((resolve) => setTimeout(resolve));
};

test("moving to another page keeps the shell mounted and draws only the window of the new page", async () => {
    const unsubscribe = vi.fn();
    const stream = vi.fn(() => unsubscribe);
    const {element, app, fetchCatalogue} = await pageShell(stream);
    const shell = {sidebar: element.querySelector("[data-sidebar]"), breadcrumb: element.querySelector("[data-breadcrumb]"), main: element.querySelector(".view-window-main"), root: element.querySelector(".view-window")};
    const firstWindow = element.querySelector(`section.window[data-window="docs.library"]`);
    expect(firstWindow).not.toBeNull();
    const click = new MouseEvent("click", {bubbles: true, cancelable: true, button: 0});
    element.querySelector(`[data-sidebar-window="docs.notes"]`).dispatchEvent(click);
    await settled();
    expect(click.defaultPrevented).toBe(true);
    expect(element.querySelector("[data-sidebar]")).toBe(shell.sidebar);
    expect(element.querySelector("[data-breadcrumb]")).toBe(shell.breadcrumb);
    expect(element.querySelector(".view-window-main")).toBe(shell.main);
    expect(element.querySelector(".view-window")).toBe(shell.root);
    expect(element.querySelector(`section.window[data-window="docs.library"]`)).toBeNull();
    expect(element.querySelector(`section.window[data-window="docs.notes"]`)).not.toBeNull();
    expect(element.querySelector(".view-window").dataset.page).toBe("docs.notes");
    expect(element.querySelector("[data-breadcrumb]").textContent).toContain("Notes");
    expect(element.querySelector(`[data-sidebar-window="docs.notes"]`).classList.contains("active")).toBe(true);
    expect(location.search).toBe("?environment=main&page=docs.notes");
    expect(document.title).toBe("Notes · main");
    expect(stream).toHaveBeenCalledTimes(1);
    expect(unsubscribe).not.toHaveBeenCalled();
    expect(fetchCatalogue).toHaveBeenCalledTimes(1);
    app.unmount();
    element.remove();
    history.replaceState(null, "", "/");
    vi.unstubAllGlobals();
});

test("the back button returns to the earlier page without a reload", async () => {
    const {element, app} = await pageShell(() => () => {});
    const sidebar = element.querySelector("[data-sidebar]");
    element.querySelector(`[data-sidebar-window="docs.notes"]`).click();
    await settled();
    history.replaceState(null, "", "?environment=main&page=docs.library");
    window.dispatchEvent(new PopStateEvent("popstate"));
    await settled();
    expect(element.querySelector(".view-window").dataset.page).toBe("docs.library");
    expect(element.querySelector(`section.window[data-window="docs.library"]`)).not.toBeNull();
    expect(element.querySelector("[data-sidebar]")).toBe(sidebar);
    app.unmount();
    element.remove();
    history.replaceState(null, "", "/");
    vi.unstubAllGlobals();
});

test("a click with a modifier key still follows the address, to open the page in a tab of its own", async () => {
    const {element, app} = await pageShell(() => () => {});
    const click = new MouseEvent("click", {bubbles: true, cancelable: true, button: 0, ctrlKey: true});
    element.querySelector(`[data-sidebar-window="docs.notes"]`).dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    expect(element.querySelector(".view-window").dataset.page).toBe("docs.library");
    app.unmount();
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

