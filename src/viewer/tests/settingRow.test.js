import {h} from "vue";
import {expect, test} from "vitest";
import {SettingRow} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const source = (props) => drawnSettingComponent(SettingRow, {label: "Auto mode", ...props}).element.querySelector("[data-setting-source]");

test("each source is shown in its own words", () => {
    expect(source({source: "default"}).textContent).toBe("Default");
    expect(source({source: "environment"}).textContent).toBe("Set for this environment");
    expect(source({source: "project"}).textContent).toBe("Set for this project");
    expect(source({source: "profile-wide"}).textContent).toBe("Every profile");
    expect(source({source: "own"}).textContent).toBe("Own value");
});

test("a row with no source and no change shows no source", () => {
    expect(source({})).toBeNull();
});

test("the changed dot shows only while the row is changed, and the source word is Changed", () => {
    const quiet = drawnSettingComponent(SettingRow, {label: "Auto mode", source: "project"});
    expect(quiet.element.querySelector("[data-setting-changed]")).toBeNull();
    const edited = drawnSettingComponent(SettingRow, {label: "Auto mode", source: "project", changed: true});
    expect(edited.element.querySelector("[data-setting-changed]")).not.toBeNull();
    expect(edited.element.querySelector("[data-setting-source]").textContent).toBe("Changed");
});

test("the name and the help line are shown and an error line shows under the control", () => {
    const row = drawnSettingComponent(SettingRow, {label: "Auto mode", help: "Agents go on by themselves.", error: "Use a whole number of 0 or more."});
    expect(row.element.querySelector(".lab").textContent).toContain("Auto mode");
    expect(row.element.querySelector(".help").textContent).toBe("Agents go on by themselves.");
    expect(row.element.querySelector("[role=alert]").textContent).toBe("Use a whole number of 0 or more.");
    expect(drawnSettingComponent(SettingRow, {label: "Auto mode"}).element.querySelector("[role=alert]")).toBeNull();
});

test("the control is the slot", () => {
    const row = drawnSettingComponent(SettingRow, {label: "Auto mode"}, {default: () => h("button", {id: "control"}, "Switch")});
    expect(row.element.querySelector(".control #control")).not.toBeNull();
});
