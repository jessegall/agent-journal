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

const DECLARED = {type: "documents.doc", icon: "document", title: "{row_title}", buttons: [], reads: [], shows_age: true};
const PLAIN = {...DECLARED, type: "plans.plan", shows_age: false};
const item = (type) => ({id: 5, type, target_model: "doc", target_id: 3, state: "docked", kept: false, leaves_at: null, text: "The abstract line", created_at: new Date(Date.now() - 600000).toISOString()});

async function drawn(type) {
    loadDockDeclarations([DECLARED, PLAIN]);
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(DockStack, {items: [item(type)]})});
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

test("a docked card that does not ask for its age keeps its text", async () => {
    const element = await drawn("plans.plan");
    expect(element.querySelector("[data-dock-age]")).toBeNull();
    expect(element.textContent).toContain("The abstract line");
});
