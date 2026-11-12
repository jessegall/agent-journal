import {expect, test} from "vitest";
import {SettingEmptyState} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("an empty state shows its title and the line under it", () => {
    const empty = drawnSettingComponent(SettingEmptyState, {title: "No agents here yet", line: "An agent shows here as soon as one of this type starts."});
    expect(empty.element.querySelector("strong").textContent).toBe("No agents here yet");
    expect(empty.element.querySelector("p").textContent).toBe("An agent shows here as soon as one of this type starts.");
});

test("an empty state with no line shows only its title", () => {
    expect(drawnSettingComponent(SettingEmptyState, {title: "No agents here yet"}).element.querySelector("p")).toBeNull();
});
