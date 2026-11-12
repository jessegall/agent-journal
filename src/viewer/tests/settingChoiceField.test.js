import {expect, test} from "vitest";
import {SettingChoiceField} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const optionTexts = (field) => [...field.element.querySelectorAll("option")].map((option) => option.textContent);

test("a size shows in thousands and a word shows with a capital", () => {
    expect(optionTexts(drawnSettingComponent(SettingChoiceField, {modelValue: 100000, choices: [50000, 100000, 1000000]}))).toEqual(["50k", "100k", "1000k"]);
    expect(optionTexts(drawnSettingComponent(SettingChoiceField, {modelValue: "auto", choices: ["auto", "off"]}))).toEqual(["Auto", "Off"]);
});

test("the choice that is the value is the one selected", () => {
    const field = drawnSettingComponent(SettingChoiceField, {modelValue: 100000, choices: [50000, 100000]});
    expect(field.element.querySelector("select").value).toBe("100000");
});

test("choosing another emits the choice with its own type", () => {
    const field = drawnSettingComponent(SettingChoiceField, {modelValue: 50000, choices: [50000, 100000]});
    const select = field.element.querySelector("select");
    select.value = "100000";
    select.dispatchEvent(new Event("change"));
    expect(field.emitted["update:modelValue"]).toEqual([100000]);
});

test("a disabled choice cannot be changed", () => {
    expect(drawnSettingComponent(SettingChoiceField, {modelValue: "a", choices: ["a"], disabled: true}).element.querySelector("select").disabled).toBe(true);
});
