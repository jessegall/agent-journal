import {expect, test} from "vitest";
import {resolveSettingComponent, settingComponents} from "@journal/setting-components";

test("an unknown setting component name is refused with an error that names it", () => {
    expect(() => resolveSettingComponent("slider")).toThrow('no setting component is named "slider"');
});

test("a name that only every object has is not a setting component", () => {
    expect(() => resolveSettingComponent("constructor")).toThrow("no setting component is named");
});

test("every name of the registry resolves to its component", () => {
    const names = Object.keys(settingComponents);
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(resolveSettingComponent(name)).toBe(settingComponents[name]);
});
