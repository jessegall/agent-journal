import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import DockStack from "../src/chat/DockStack.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {settle} from "./support/windowContext.js";

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

const DECLARED = {type: "documents.doc", icon: "document", title: "{row_title}", buttons: [], reads: []};
const PLAIN = {...DECLARED, type: "plans.plan"};
const LEAVING = {...DECLARED, type: "processes.output", leaves_after_seconds: 5};
const item = (type) => ({id: 5, type, target_model: "doc", target_id: 3, state: "docked", kept: false, leaves_at: null, text: "The abstract line", created_at: new Date(Date.now() - 601000).toISOString()});

async function drawn(type, collapsed = false) {
    loadDockDeclarations([DECLARED, PLAIN, LEAVING]);
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(DockStack, {items: [item(type)], collapsed})});
    app.provide(WINDOW_CONTEXT, {environment: "main"});
    app.mount(element);
    await settle();
    return element;
}

test("a docked document shows how long ago it was docked and not its abstract", async () => {
    const element = await drawn("documents.doc");
    expect(element.querySelector("[data-dock-age]").textContent).toBe("10m ago");
    expect(element.textContent).not.toContain("The abstract line");
});

test("every card shows its age and leaves the full text to Open", async () => {
    const element = await drawn("plans.plan");
    expect(element.querySelector("[data-dock-age]").textContent).toBe("10m ago");
    expect(element.textContent).not.toContain("The abstract line");
});

test("a card that leaves by itself shows no age, so its module can show how long it ran", async () => {
    const element = await drawn("processes.output");
    expect(element.querySelector("[data-dock-age]").textContent).toBe("");
});

test("a collapsed card that leaves by itself shows no age either", async () => {
    const element = await drawn("processes.output", true);
    expect(element.querySelector("[data-dock-age]").textContent).toBe("");
});
