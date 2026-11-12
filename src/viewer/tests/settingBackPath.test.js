import {expect, test} from "vitest";
import {SettingBackPath} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("the path shows the screen above and the screen shown", () => {
    const path = drawnSettingComponent(SettingBackPath, {parent: "Helpers", current: "Workers"});
    expect(path.element.querySelector("a").textContent).toBe("Helpers");
    expect(path.element.querySelector("b").textContent).toBe("Workers");
});

test("pressing the screen above goes back", () => {
    const path = drawnSettingComponent(SettingBackPath, {parent: "Helpers", current: "Workers"});
    path.element.querySelector("[data-back]").click();
    expect(path.emitted.back).toHaveLength(1);
});
