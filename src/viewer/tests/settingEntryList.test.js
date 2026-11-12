import {expect, test} from "vitest";
import {SettingEntryList} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const typed = (list, index, text) => {
    const input = list.element.querySelector(`[data-entry="${index}"]`);
    input.value = text;
    input.dispatchEvent(new Event("input"));
};

test("an empty list says so and offers to add an entry", () => {
    const list = drawnSettingComponent(SettingEntryList, {modelValue: []});
    expect(list.element.textContent).toContain("Nothing in the list yet.");
    expect(list.element.querySelector("[data-add]")).not.toBeNull();
});

test("each entry is an input in the order given", () => {
    const list = drawnSettingComponent(SettingEntryList, {modelValue: ["b", "a", "c"]});
    expect([...list.element.querySelectorAll("[data-entry]")].map((input) => input.value)).toEqual(["b", "a", "c"]);
});

test("adding an entry shows an empty input and emits nothing until it holds something", async () => {
    const list = drawnSettingComponent(SettingEntryList, {modelValue: ["a"]});
    list.element.querySelector("[data-add]").click();
    await list.settled();
    expect(list.element.querySelectorAll("[data-entry]").length).toBe(2);
    expect(list.emitted["update:modelValue"]).toBeUndefined();
    typed(list, 1, "b");
    expect(list.emitted["update:modelValue"]).toEqual([["a", "b"]]);
});

test("removing an entry emits the others in the same order", () => {
    const list = drawnSettingComponent(SettingEntryList, {modelValue: ["a", "b", "c"]});
    list.element.querySelector('[data-remove="1"]').click();
    expect(list.emitted["update:modelValue"]).toEqual([["a", "c"]]);
});

test("emptying an entry takes it out of the emitted list", () => {
    const list = drawnSettingComponent(SettingEntryList, {modelValue: ["a", "b"]});
    typed(list, 0, "  ");
    expect(list.emitted["update:modelValue"]).toEqual([["b"]]);
});

test("a disabled list cannot be edited", () => {
    const list = drawnSettingComponent(SettingEntryList, {modelValue: ["a"], disabled: true});
    expect(list.element.querySelector("[data-entry]").disabled).toBe(true);
    expect(list.element.querySelector("[data-add]").disabled).toBe(true);
    expect(list.element.querySelector("[data-remove]").disabled).toBe(true);
});
