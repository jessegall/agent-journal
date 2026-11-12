import {expect, test} from "vitest";
import {SettingNumberField} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const typed = (field, text) => {
    const input = field.element.querySelector("input");
    input.value = text;
    input.dispatchEvent(new Event("input"));
};

test("typing a number emits what was typed", () => {
    const field = drawnSettingComponent(SettingNumberField, {modelValue: 3});
    typed(field, "7");
    expect(field.emitted["update:modelValue"]).toEqual(["7"]);
});

test("the plus and minus buttons step by one and stop at the least", () => {
    const field = drawnSettingComponent(SettingNumberField, {modelValue: 1, least: 1});
    const [less, more] = field.element.querySelectorAll("button");
    more.click();
    expect(field.emitted["update:modelValue"]).toEqual([2]);
    expect(less.disabled).toBe(true);
});

test("a blank number says a number is missing", () => {
    const field = drawnSettingComponent(SettingNumberField, {modelValue: ""});
    expect(field.element.querySelector("[role=alert]").textContent).toBe("A number is missing.");
});

test("a number below the least says the rule", () => {
    const field = drawnSettingComponent(SettingNumberField, {modelValue: -2});
    expect(field.element.querySelector("[role=alert]").textContent).toBe("Use a whole number of 0 or more.");
    expect(drawnSettingComponent(SettingNumberField, {modelValue: 2.5}).element.querySelector("[role=alert]")).not.toBeNull();
});

test("a number that keeps the rule shows no message", () => {
    expect(drawnSettingComponent(SettingNumberField, {modelValue: 0}).element.querySelector("[role=alert]")).toBeNull();
});

test("the unit is shown beside the number", () => {
    expect(drawnSettingComponent(SettingNumberField, {modelValue: 5, unit: "seconds"}).element.textContent).toContain("seconds");
});

test("a disabled number cannot be typed or stepped", () => {
    const field = drawnSettingComponent(SettingNumberField, {modelValue: 5, disabled: true});
    expect(field.element.querySelector("input").disabled).toBe(true);
    expect([...field.element.querySelectorAll("button")].every((button) => button.disabled)).toBe(true);
});
