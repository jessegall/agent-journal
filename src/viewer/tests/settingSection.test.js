import {h} from "vue";
import {expect, test} from "vitest";
import {SettingSection} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

test("a section has its title, an anchor to jump to, and its settings in the slot", () => {
    const section = drawnSettingComponent(SettingSection, {sectionKey: "approvals", title: "Approvals"}, {default: () => h("p", {id: "inside"}, "A setting")});
    expect(section.element.querySelector("[data-section=approvals] h4").textContent).toBe("Approvals");
    expect(section.element.querySelector("[data-section=approvals] #inside")).not.toBeNull();
});

test("a section shows its help line only when it has one", () => {
    expect(drawnSettingComponent(SettingSection, {sectionKey: "a", title: "A"}).element.querySelector(".help")).toBeNull();
    expect(drawnSettingComponent(SettingSection, {sectionKey: "a", title: "A", help: "What this is."}).element.querySelector(".help").textContent).toBe("What this is.");
});
