import {h} from "vue";
import {expect, test} from "vitest";
import {SettingPresetBand} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const PRESETS = [{key: "builder", name: "Builder"}, {key: "orchestrator", name: "Orchestrator"}];
const band = (props, slots) => drawnSettingComponent(SettingPresetBand, {presets: PRESETS, current: "builder", ...props}, slots);
const marked = (drawn, key) => drawn.element.querySelector(`[data-preset=${key}]`).getAttribute("aria-checked");

test("the presets and Custom are side by side and the current one is marked", () => {
    const drawn = band({current: "orchestrator"});
    expect([...drawn.element.querySelectorAll("[data-preset]")].map((button) => button.textContent)).toEqual(["Builder", "Orchestrator", "Custom"]);
    expect(marked(drawn, "orchestrator")).toBe("true");
    expect(marked(drawn, "builder")).toBe("false");
});

test("a form that matches no preset marks Custom", () => {
    expect(marked(band({current: "custom"}), "custom")).toBe("true");
});

test("choosing a preset asks for it and Custom cannot be chosen", () => {
    const drawn = band({});
    drawn.element.querySelector("[data-preset=orchestrator]").click();
    drawn.element.querySelector("[data-preset=custom]").click();
    expect(drawn.emitted.pick).toEqual(["orchestrator"]);
});

test("the link asks for the page that says what a preset is", () => {
    const drawn = band({});
    const link = drawn.element.querySelector("[data-preset-page]");
    expect(link.textContent).toBe("What is a preset?");
    link.click();
    expect(drawn.emitted["open-page"]).toHaveLength(1);
});

test("a slot on the right holds the search", () => {
    expect(band({}, {default: () => h("input", {id: "find"})}).element.querySelector(".find #find")).not.toBeNull();
});

test("a disabled band cannot choose", () => {
    const drawn = band({disabled: true});
    drawn.element.querySelector("[data-preset=orchestrator]").click();
    expect(drawn.emitted.pick).toBeUndefined();
});
