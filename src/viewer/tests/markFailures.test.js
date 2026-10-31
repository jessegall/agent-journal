import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import MarkButtons from "../src/chat/MarkButtons.vue";
import MarkHost from "../src/chat/MarkHost.vue";
import ModuleBody from "../src/windows/ModuleBody.vue";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";
import {markLook} from "../src/domain/markLook.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), go: vi.fn(), peekRef: vi.fn()}));

let app = null;
afterEach(() => app?.unmount());

function drawn(component, props) {
    const element = document.createElement("div");
    document.body.appendChild(element);
    app = createApp(() => h(component, props));
    app.mount(element);
    return element;
}

const later = () => new Promise((resolve) => setTimeout(resolve, 50));

test("a mark of a type no module declares is drawn as a plain line with its words", () => {
    loadMarkDeclarations([]);
    expect(markLook({id: 1, text: "Old words", type: "gone"}, null)).toMatchObject({icon: "dot", label: "Old words", action: "", handlers: {}});
    const element = drawn(MarkHost, {mark: {id: 1, text: "Old words", type: "gone", state: "shown", created_at: 1}});
    expect(element.textContent).toContain("Old words");
});

test("a body that fails to load shows its error in place of the body", async () => {
    const element = drawn(ModuleBody, {declaration: {module: "third", type: "x", body_url: "/modules/third/missing-body.js?v=1", shipped: true}});
    await later();
    expect(element.textContent).toContain("could not be loaded");
});

test("a button the server refuses shows the refusal", async () => {
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 1, value: null, error: "chat does not declare dock add"})}));
    const element = drawn(MarkButtons, {buttons: [{icon: "dock", label: "Dock", runs: "dock add memory {row_id}"}], mark: {target_id: 3}});
    element.querySelector("button").click();
    await later();
    expect(element.querySelector("[role=alert]").textContent).toContain("does not declare");
});

test("a person who may not run a button's line sees the mark without that button", () => {
    loadMarkDeclarations([{type: "output", family_icon: "terminal", mark_icon: "terminal", group: "agent", colouring: "group", click: "unfold", buttons: [{icon: "stop", label: "Stop", runs: "command-output stop {row_id}"}, {icon: "dock", label: "Dock", runs: "dock add output {row_id}"}]}]);
    const mark = {id: 2, type: "output", text: "ran tests", state: "shown", created_at: 1, target_id: 9};
    expect(drawn(MarkHost, {mark}).querySelectorAll(".mark-button")).toHaveLength(2);
    app.unmount();
    const limited = drawn(MarkHost, {mark, allowedRuns: ["dock add"]});
    expect(limited.querySelectorAll(".mark-button")).toHaveLength(1);
    expect(limited.querySelector(".mark-button").getAttribute("title")).toBe("Dock");
    expect(limited.textContent).toContain("ran tests");
});
