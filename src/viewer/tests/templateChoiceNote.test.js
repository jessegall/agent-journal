import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {settle} from "./support/windowContext.js";

vi.mock("../src/windows/windowContext.js", () => ({
    lineResult: async () => ({
        ok: true,
        value: {rows: [
            {id: 1, title: "Find what is missing", module: "journal.suites.coding", brief: "Look for gaps"},
            {id: 2, title: "General critique", module: "", brief: "Review it"},
        ]},
    }),
}));

const ButtonTemplateField = (await import("../src/kit/ButtonTemplateField.vue")).default;
const mounted = [];
afterEach(() => mounted.splice(0).forEach((element) => element.remove()));

async function mount() {
    const element = document.createElement("div");
    document.body.append(element);
    mounted.push(element);
    const field = {target: "plan", purpose: "critique", default_title: "General critique"};
    createApp(() => h(ButtonTemplateField, {field, value: "2", environment: "main"})).directive("tip", {}).mount(element);
    await settle();
    return element;
}

test("a template's module key follows its name as a smaller, muted note, and the name stays alone", async () => {
    const element = await mount();
    const [module, general] = [...element.querySelectorAll(".segmented-option")];
    expect(module.querySelector(".segmented-note").textContent).toBe("journal.suites.coding");
    expect(module.textContent.replace(module.querySelector(".segmented-note").textContent, "").trim()).toBe("Find what is missing");
    expect(module.textContent).not.toContain("·");
    expect(general.querySelector(".segmented-note")).toBeNull();
    expect(general.textContent.trim()).toBe("General critique");
});
