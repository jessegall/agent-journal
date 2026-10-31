import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import DockWrapper from "../src/chat/DockWrapper.vue";
import MarkHost from "../src/chat/MarkHost.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const WIDTHS = {phone: 375, wide: 1280};
const mark = {id: 7, type: "memory", text: "Memory 3: weight set", state: "shown", created_at: 5, target_model: "memories", target_id: 3};
const item = {id: 2, type: "memory", target_model: "memories", target_id: 3, kept: false, leaves_at: null, state: "docked"};
let app = null;

afterEach(() => {
    app?.unmount();
    document.documentElement.classList.remove("phone");
});

function drawn(component, props, width) {
    window.innerWidth = width;
    document.documentElement.classList.toggle("phone", width < 600);
    const element = document.createElement("div");
    document.body.appendChild(element);
    app = createApp(() => h(component, props));
    app.mount(element);
    return element;
}

for (const [name, width] of Object.entries(WIDTHS)) {
    test(`a mark is drawn at the ${name} width with its words and its row reference`, () => {
        loadMarkDeclarations([{type: "memory", family_icon: "fact", mark_icon: "fact", group: "reminders", colouring: "group", click: "unfold", buttons: []}]);
        const element = drawn(MarkHost, {mark}, width);
        expect(element.querySelector("[data-ref='chat_mark:7']")).not.toBeNull();
        expect(element.textContent).toContain("Memory 3: weight set");
    });

    test(`a docked item is drawn at the ${name} width with its title`, () => {
        loadDockDeclarations([{type: "memory", icon: "fact", title: "Memory {row_id}", body_url: "", buttons: []}]);
        const element = drawn(DockWrapper, {item}, width);
        expect(element.textContent).toContain("Memory 3");
    });
}

test("the dock stays in the chat's flow, so at phone width it never covers the compose box", () => {
    for (const file of ["src/kit/ChatDock.vue", "src/chat/DockWrapper.vue", "src/chat/DockStack.vue"]) {
        const style = readFileSync(resolve(__dirname, "..", file), "utf8").split("<style")[1] || "";
        expect(style).not.toMatch(/position:\s*(fixed|sticky)/);
        expect(style).not.toMatch(/position:\s*absolute[^}]*bottom/);
    }
});
