import {nextTick, reactive} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {store} from "../src/state/store.js";
import {stacked, unmountStacked} from "./support/stackedDock.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const run = (id) => ({id, dock_id: id, type: "processes.output", state: "docked", kept: false, leaves_at: null, target_model: "processes", target_id: id, title: `Run ${id}`, text: ""});

beforeEach(() => {
    localStorage.clear();
    store.identity = {root: "/project/opened"};
    loadDockDeclarations([{type: "processes.output", icon: "terminal", title: "{row_title}", body_url: "", leaves_after_seconds: 5, draws_head: false, folds: "Output", buttons: [], reads: []}]);
});

afterEach(() => {
    unmountStacked();
    document.body.innerHTML = "";
    localStorage.clear();
    store.identity = null;
});

async function openedWithOutput(items) {
    const host = stacked(items);
    await nextTick();
    host.querySelector("[data-dock-all]").click();
    await nextTick();
    expect(host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(items.length);
    host.querySelector(".chat-dock.collapsed").click();
    await nextTick();
    host.querySelector("[data-dock-fold]").click();
    await nextTick();
    return host;
}

test("a card and its output that the person opened stay open when another card docks", async () => {
    const items = reactive([run(1), run(2)]);
    const host = await openedWithOutput(items);
    expect(host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(1);
    expect(host.querySelector("[data-dock-fold]").getAttribute("aria-expanded")).toBe("true");
    items.push(run(3));
    await nextTick();
    expect(host.querySelectorAll(".chat-dock")).toHaveLength(3);
    expect(host.querySelectorAll(".chat-dock.collapsed")).toHaveLength(2);
    expect(host.querySelector("[data-dock-fold]").getAttribute("aria-expanded")).toBe("true");
});

test("a card that docked alone and its output, which the person opened, stay open when a second card docks while all were folded before", async () => {
    const items = reactive([run(1), run(2)]);
    const host = stacked(items);
    await nextTick();
    host.querySelector("[data-dock-all]").click();
    await nextTick();
    items.splice(1, 1);
    await nextTick();
    expect(host.querySelector(".chat-dock").classList.contains("collapsed")).toBe(false);
    host.querySelector("[data-dock-fold]").click();
    await nextTick();
    expect(host.querySelector("[data-dock-fold]").getAttribute("aria-expanded")).toBe("true");
    items.push(run(3));
    await nextTick();
    expect(host.querySelector(".chat-dock").classList.contains("collapsed")).toBe(false);
    expect(host.querySelector("[data-dock-fold]").getAttribute("aria-expanded")).toBe("true");
});
