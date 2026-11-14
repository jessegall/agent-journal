import {afterEach, expect, test} from "vitest";
import {FindBox} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";
import {settle} from "./support/windowContext.js";

const INDEX = [
    {key: "a.auto", title: "Auto mode", description: "The journal hands the main agent its next task.", path: "Work > Taking on work", screen: "work", section: "Taking on work"},
    {key: "a.merger", title: "Merger takes in workers", description: "A helper merges workers whose tests passed.", path: "Helpers > Merger", screen: "helper-type.merger", section: "Merger"},
    {key: "a.limit", title: "Read-only helpers running", description: "Helpers of each profile that run at once.", path: "Helpers > Read only", screen: "helper-type.read-only", section: "Every profile"},
];
const box = () => drawnSettingComponent(FindBox, {index: INDEX});
const input = (drawn) => drawn.element.querySelector("input");
const type = async (drawn, text) => { input(drawn).value = text; input(drawn).dispatchEvent(new Event("input")); await settle(); };
const press = async (drawn, key) => { input(drawn).dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true})); await settle(); };
const titles = (drawn) => [...drawn.element.querySelectorAll("[data-find-entry] .title")].map((entry) => entry.textContent);

afterEach(() => { document.body.innerHTML = ""; });

test("nothing is listed until something is typed", () => {
    expect(box().element.querySelector("[data-find-list]")).toBeNull();
});

test("typing lists the settings whose title or description holds every word", async () => {
    const drawn = box();
    await type(drawn, "merge");
    expect(titles(drawn)).toEqual(["Merger takes in workers"]);
    await type(drawn, "helper profile");
    expect(titles(drawn)).toEqual(["Read-only helpers running"]);
    await type(drawn, "AUTO next");
    expect(titles(drawn)).toEqual(["Auto mode"]);
});

test("a setting shows where it lives in words", async () => {
    const drawn = box();
    await type(drawn, "merger");
    expect(drawn.element.querySelector('[data-find-entry="a.merger"] .path').textContent).toBe("Helpers > Merger");
});

test("with no match a plain line says so", async () => {
    const drawn = box();
    await type(drawn, "zebra");
    expect(drawn.element.querySelector("[data-find-none]").textContent).toBe("No setting matches that.");
});

test("Enter opens the first match, and the arrows move to another before it", async () => {
    const drawn = box();
    await type(drawn, "helper");
    await press(drawn, "Enter");
    expect(drawn.emitted.pick.map((entry) => entry.key)).toEqual(["a.merger"]);
    await type(drawn, "helper");
    await press(drawn, "ArrowDown");
    await press(drawn, "Enter");
    expect(drawn.emitted.pick.map((entry) => entry.key)).toEqual(["a.merger", "a.limit"]);
});

test("the arrows go round the list in both directions", async () => {
    const drawn = box();
    await type(drawn, "helper");
    await press(drawn, "ArrowUp");
    expect(drawn.element.querySelector('[data-find-entry="a.limit"]').classList.contains("on")).toBe(true);
    await press(drawn, "ArrowDown");
    expect(drawn.element.querySelector('[data-find-entry="a.merger"]').classList.contains("on")).toBe(true);
});

test("picking one clears the field and closes the list", async () => {
    const drawn = box();
    await type(drawn, "auto");
    drawn.element.querySelector('[data-find-entry="a.auto"]').dispatchEvent(new MouseEvent("mousedown", {bubbles: true}));
    await settle();
    expect(drawn.emitted.pick.map((entry) => entry.key)).toEqual(["a.auto"]);
    expect(input(drawn).value).toBe("");
    expect(drawn.element.querySelector("[data-find-list]")).toBeNull();
});

test("Escape clears the field", async () => {
    const drawn = box();
    await type(drawn, "auto");
    await press(drawn, "Escape");
    expect(drawn.element.querySelector("[data-find-list]")).toBeNull();
});

test("the slash key moves to the field when no field has the focus, and is a plain character in a field", async () => {
    const drawn = box();
    document.dispatchEvent(new KeyboardEvent("keydown", {key: "/", bubbles: true}));
    expect(document.activeElement).toBe(input(drawn));
    const other = document.createElement("input");
    document.body.append(other);
    other.focus();
    const slash = new KeyboardEvent("keydown", {key: "/", bubbles: true, cancelable: true});
    other.dispatchEvent(slash);
    expect(slash.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(other);
});
