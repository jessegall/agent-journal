import {afterEach, expect, test, vi} from "vitest";
import {nextTick} from "vue";
import {AUTO, LIMIT, mountAgentSettings as mount} from "./support/agentSettingsWindow.js";
import {settle as settled} from "./support/windowContext.js";

afterEach(() => vi.useRealTimers());

const field = (element) => element.querySelector("[data-setting-find] input");
const type = async (element, text) => { field(element).value = text; field(element).dispatchEvent(new Event("input")); await settled(); };
const press = async (element, key) => { field(element).dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true})); await settled(); };
const selected = (element) => element.querySelector("[data-tab][aria-selected=true]").dataset.tab;

test("the slash key focuses Find a setting", async () => {
    const {element} = await mount();
    document.dispatchEvent(new KeyboardEvent("keydown", {key: "/", bubbles: true}));
    expect(document.activeElement).toBe(field(element));
});

test("Find a setting is in the band beside the presets", async () => {
    const {element} = await mount();
    expect(element.querySelector(".setting-preset-band [data-setting-find]")).not.toBeNull();
});

test("typing lists the settings that match with the path of each", async () => {
    const {element} = await mount();
    await type(element, "o");
    expect([...element.querySelectorAll("[data-find-entry] .path")].map((path) => path.textContent)).toEqual(["Work > A section", "Tests > A section", "Helpers > Read only"]);
});

test("a setting of a helper type screen shows its path, and opening it goes to the Helpers tab", async () => {
    const {element} = await mount();
    await type(element, "read-only");
    expect(element.querySelector("[data-find-entry] .path").textContent).toBe("Helpers > Read only");
    await press(element, "Enter");
    expect(selected(element)).toBe("agents");
});

test("Enter opens the tab of the setting and marks its row for a moment", async () => {
    const {element} = await mount();
    expect(selected(element)).toBe("work");
    vi.useFakeTimers({toFake: ["setTimeout", "clearTimeout"]});
    const flush = async () => { for (let round = 0; round < 5; round++) await nextTick(); };
    field(element).value = "example limit";
    field(element).dispatchEvent(new Event("input"));
    await flush();
    field(element).dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await flush();
    expect(selected(element)).toBe("tests");
    const row = () => element.querySelector(`[data-setting="${LIMIT}"]`);
    expect(row().classList.contains("found")).toBe(true);
    vi.advanceTimersByTime(1199);
    await flush();
    expect(row().classList.contains("found")).toBe(true);
    vi.advanceTimersByTime(2);
    await flush();
    expect(row().classList.contains("found")).toBe(false);
});

test("opening a setting of the Work tab from another tab brings the Work tab back", async () => {
    const {element} = await mount();
    element.querySelector("[data-tab=tests]").click();
    await settled();
    await type(element, "auto mode");
    await press(element, "Enter");
    expect(selected(element)).toBe("work");
    expect(element.querySelector(`[data-setting="${AUTO}"]`)).not.toBeNull();
});

test("a word that matches nothing shows a plain line", async () => {
    const {element} = await mount();
    await type(element, "zebra");
    expect(element.querySelector("[data-find-none]").textContent).toBe("No setting matches that.");
});
