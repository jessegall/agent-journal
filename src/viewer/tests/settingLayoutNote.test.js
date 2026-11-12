import {expect, test} from "vitest";
import {SettingLayoutNote} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("the note names each type with its value and says where they are changed", () => {
    const note = drawnSettingComponent(SettingLayoutNote, {entries: [{name: "Researcher", value: "150k"}, {name: "Debugger", value: "no cap"}]});
    expect(note.element.textContent.replace(/\s+/g, " ").trim()).toBe("Researcher 150k, Debugger no cap. They are changed on their own screens.");
});

test("the note says its own words about where when it is given them", () => {
    const note = drawnSettingComponent(SettingLayoutNote, {entries: [{name: "Planner", value: "2"}], where: "Open the type to change it."});
    expect(note.element.textContent).toContain("Open the type to change it.");
});

test("with nothing to name the note is not there", () => {
    expect(drawnSettingComponent(SettingLayoutNote, {entries: []}).element.querySelector("[data-layout-note]")).toBeNull();
});
