import {expect, test} from "vitest";
import {SettingToggle} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("a toggle shows On while it is on and Off while it is off", async () => {
    const toggle = drawnSettingComponent(SettingToggle, {modelValue: true});
    expect(toggle.element.textContent).toContain("On");
    toggle.state.modelValue = false;
    await toggle.settled();
    expect(toggle.element.textContent).toContain("Off");
});

test("a click on a toggle asks for the opposite value", () => {
    const toggle = drawnSettingComponent(SettingToggle, {modelValue: false});
    toggle.element.querySelector("button").click();
    expect(toggle.emitted["update:modelValue"]).toEqual([true]);
});

test("a disabled toggle does not flip", () => {
    const toggle = drawnSettingComponent(SettingToggle, {modelValue: false, disabled: true});
    toggle.element.querySelector("button").click();
    expect(toggle.emitted["update:modelValue"]).toBeUndefined();
});
