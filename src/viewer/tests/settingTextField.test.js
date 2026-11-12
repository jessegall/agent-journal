import {expect, test} from "vitest";
import {SettingTextField} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("a text field shows its value and emits what is typed", () => {
    const field = drawnSettingComponent(SettingTextField, {modelValue: "main"});
    const input = field.element.querySelector("input");
    expect(input.value).toBe("main");
    input.value = "develop";
    input.dispatchEvent(new Event("input"));
    expect(field.emitted["update:modelValue"]).toEqual(["develop"]);
});

test("an empty text field shows its placeholder and a disabled one cannot be typed in", () => {
    const input = drawnSettingComponent(SettingTextField, {modelValue: "", placeholder: "A branch name", disabled: true}).element.querySelector("input");
    expect(input.placeholder).toBe("A branch name");
    expect(input.disabled).toBe(true);
});
