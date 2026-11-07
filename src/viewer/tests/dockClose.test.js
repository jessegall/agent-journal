import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import DockStack from "../src/chat/DockStack.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {settle} from "./support/windowContext.js";
import {dockWindow} from "./support/dockWindow.js";

const answers = vi.hoisted(() => ({next: null}));
vi.mock("../src/chat/markButtons.js", () => ({pressButton: () => answers.next}));

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

const DECLARATION = {type: "processes.output", icon: "terminal", title: "Output {row_id}", buttons: [], leaves_after_seconds: 5, reads: []};
const ITEM = {id: 5, type: "processes.output", target_model: "processes", target_id: 3, state: "docked", kept: false, leaves_at: null};

function drawn() {
    loadDockDeclarations([DECLARATION]);
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(DockStack, {items: [ITEM]})});
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(element);
    return element;
}

test("a docked card leaves as soon as its close is pressed, before the server answers", async () => {
    answers.next = new Promise(() => {});
    const element = drawn();
    await settle();
    expect(element.querySelector('[data-dock-action="undock"]')).not.toBeNull();
    element.querySelector('[data-dock-action="undock"]').click();
    await settle();
    expect(element.querySelector('.dock-leave-active [data-dock-action="undock"]')).not.toBeNull();
});

test("a refused close brings the card back with the reason", async () => {
    answers.next = Promise.resolve({ok: false, error: "not yours"});
    const element = drawn();
    await settle();
    element.querySelector('[data-dock-action="undock"]').click();
    await settle();
    expect(element.querySelector("[data-dock-failure]").textContent).toBe("Could not close this card: not yours");
});
