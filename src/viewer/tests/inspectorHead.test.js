import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import InspectorHead from "../src/resource/InspectorHead.vue";

const OPENED = {table: "plans", id: 12};
const mounted = [];

function head(props = {}, listeners = {}) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(InspectorHead, {label: "Plan 12 · ready", title: "A better journal", description: "Why it moves", opened: OPENED, ...props, ...listeners})});
    app.directive("tip", {});
    app.mount(element);
    mounted.push(app);
    return element;
}

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
});

const titles = (element) => [...element.querySelectorAll("[data-inspector-head] button, [data-inspector-head] a")].map((icon) => icon.title);

test("a plain inspector head has only the X", () => {
    const element = head();
    expect(titles(element)).toEqual(["Close"]);
    expect(element.querySelector("[data-resource-title]").textContent).toBe("A better journal");
    expect(element.textContent).toContain("Plan 12 · ready");
});

test("a stacked inspector adds Back, and its X says it closes every row", () => {
    expect(titles(head({backed: true}))).toEqual(["Back", "Close all rows"]);
});

test("a stepped inspector adds Previous and Next after Back", () => {
    expect(titles(head({backed: true, stepped: true}))).toEqual(["Back", "Previous", "Next", "Close all rows"]);
});

test("Share shows only for a shareable row outside a read-only view", () => {
    const shared = head({shareable: true});
    expect(titles(shared)).toEqual(["Share this row", "Close"]);
    expect(shared.querySelector("[data-resource-share]").href).toContain("share=plans%3A12");
    expect(titles(head({shareable: true, readOnly: true}))).toEqual(["Close"]);
    expect(titles(head({shareable: false}))).toEqual(["Close"]);
});

test("an embedded inspector has no X and offers Open in the inspector", () => {
    expect(titles(head({embedded: true}))).toEqual(["Open in the inspector"]);
});

test("every head icon has a title and no text", () => {
    const element = head({backed: true, stepped: true, shareable: true});
    const icons = [...element.querySelectorAll("[data-inspector-head] button, [data-inspector-head] a")];
    expect(icons).toHaveLength(5);
    for (const icon of icons) {
        expect(icon.title).not.toBe("");
        expect(icon.getAttribute("aria-label")).toBe(icon.title);
        expect(icon.textContent.trim()).toBe("");
    }
});

test("pressing an icon tells its host: close, back and a step of minus one or one", () => {
    const told = [];
    const element = head({backed: true, stepped: true}, {onClose: () => told.push("close"), onBack: () => told.push("back"), onStep: (by) => told.push(by)});
    element.querySelector("[data-resource-back]").click();
    element.querySelector('[data-inspector-step="previous"]').click();
    element.querySelector('[data-inspector-step="next"]').click();
    element.querySelector("[data-resource-close]").click();
    expect(told).toEqual(["back", -1, 1, "close"]);
});
