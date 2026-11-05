import {nextTick, reactive, ref} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {store} from "../src/state/store.js";
import {stacked, unmountStacked} from "./support/stackedDock.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const documentItem = (id, title = "Project") => ({id, dock_id: 1, type: "plans.draft", state: "docked", kept: false, leaves_at: null, target_model: "plan", target_id: id, title, text: "Project notes"});
const foldButton = (host) => host.querySelector("[data-dock-fold]");

beforeEach(() => {
    localStorage.clear();
    store.identity = {root: "/project/first"};
    loadDockDeclarations([{type: "plans.draft", icon: "document", title: "{row_title}", body_url: "", leaves_after_seconds: 0, draws_head: false, folds: "Phases", buttons: [], reads: []}]);
});

afterEach(() => {
    unmountStacked();
    document.body.innerHTML = "";
    localStorage.clear();
    store.identity = null;
});

test("a manual collapse survives updates, new rows, scrolling and a stack remount", async () => {
    const items = reactive([documentItem(1)]);
    const automatic = ref(false);
    let host = stacked(items, automatic);
    foldButton(host).click();
    await nextTick();
    items.splice(0, 1, documentItem(1, "Updated project"));
    items.push(documentItem(2, "Another document"));
    automatic.value = true;
    await nextTick();
    automatic.value = false;
    await nextTick();
    expect(foldButton(host).getAttribute("aria-expanded")).toBe("false");
    unmountStacked();
    host = stacked(items, automatic);
    await nextTick();
    expect(foldButton(host).getAttribute("aria-expanded")).toBe("false");
    expect(host.querySelectorAll("[data-dock-fold]")[1].getAttribute("aria-expanded")).toBe("true");
});

test("only a manual reopening changes the saved collapse and the open choice survives a reload", async () => {
    let host = stacked([documentItem(1)]);
    foldButton(host).click();
    await nextTick();
    unmountStacked();
    host = stacked([documentItem(1)]);
    await nextTick();
    expect(foldButton(host).getAttribute("aria-expanded")).toBe("false");
    foldButton(host).click();
    await nextTick();
    unmountStacked();
    host = stacked([documentItem(1)], true);
    await nextTick();
    expect(foldButton(host).getAttribute("aria-expanded")).toBe("true");
});

test("the same dock number in another project has its own saved choice", async () => {
    const host = stacked([documentItem(1)]);
    foldButton(host).click();
    await nextTick();
    unmountStacked();
    store.identity = {root: "/project/second"};
    const second = stacked([documentItem(1)]);
    expect(foldButton(second).getAttribute("aria-expanded")).toBe("true");
    unmountStacked();
    store.identity = {root: "/project/first"};
    const first = stacked([documentItem(1)]);
    expect(foldButton(first).getAttribute("aria-expanded")).toBe("false");
});
