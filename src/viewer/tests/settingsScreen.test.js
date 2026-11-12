import {nextTick} from "vue";
import {expect, test, vi} from "vitest";
import {SettingSectionList, SettingsScreen, sectionsOf, useSettingsDraft} from "@journal/setting-components";
import {drawnSettingComponent} from "./support/settingComponent.js";

const NUMBER_RULE = JSON.stringify({rule: "number", minimum: 2, integer: true, maximum: null, exclusive: false});
const node = (key, kind, component, value, extra = {}) => ({key, kind, component, section: "First", parent: null, title: `Title of ${key}`, description: `About ${key}.`, value, default: value, source: "default", choices: [], rule: "", requires: [], read_only: true, ...extra});

function screenOf(nodes) {
    const draft = useSettingsDraft({run: vi.fn(async () => ({ok: true})), reload: vi.fn(async () => {})});
    draft.load([{screen: "made-up", revision: "r1", nodes}]);
    return draft;
}

const drawn = (nodes, props = {}) => {
    const draft = screenOf(nodes);
    return {draft, ...drawnSettingComponent(SettingsScreen, {nodes, draft, ...props})};
};
const row = (screen, key) => screen.element.querySelector(`[data-setting="${key}"]`);

const EVERY_KIND = [
    node("a.flag", "flag", "toggle", true),
    node("a.number", "number", "number", 5, {rule: NUMBER_RULE}),
    node("a.choice", "choice", "choice", "auto", {choices: ["auto", "off"]}),
    node("a.list", "list", "entry-list", ["x", "y"]),
    node("a.numbers", "number list", "number-list", [1, 2]),
    node("a.text", "text", "text", "hello"),
];

test("a setting of each kind is drawn with its own component", () => {
    const screen = drawn(EVERY_KIND);
    expect(row(screen, "a.flag").querySelector("button[role=switch]")).not.toBeNull();
    expect(row(screen, "a.number").querySelector(".setting-number input").value).toBe("5");
    expect(row(screen, "a.choice").querySelector("select.setting-choice").value).toBe("auto");
    expect(row(screen, "a.list").querySelectorAll("[data-entry]").length).toBe(2);
    expect(row(screen, "a.numbers").querySelectorAll("[data-entry]").length).toBe(2);
    expect(row(screen, "a.text").querySelector("input.setting-text").value).toBe("hello");
});

test("a row shows the title and the description of its setting and the number gets its least from the rule", () => {
    const screen = drawn(EVERY_KIND);
    expect(row(screen, "a.number").querySelector(".lab").textContent).toContain("Title of a.number");
    expect(row(screen, "a.number").querySelector(".help").textContent).toBe("About a.number.");
    screen.draft.set("a.number", "1");
    return nextTick().then(() => expect(row(screen, "a.number").querySelector("[role=alert]").textContent).toBe("Use a whole number of 2 or more."));
});

test("a change in a control goes into the draft and marks the row changed", async () => {
    const screen = drawn(EVERY_KIND);
    row(screen, "a.flag").querySelector("button[role=switch]").click();
    await nextTick();
    expect(screen.draft.value("a.flag")).toBe(false);
    expect(row(screen, "a.flag").querySelector("[data-setting-changed]")).not.toBeNull();
});

test("a setting declared under another is nested and shows only while the other is on", async () => {
    const screen = drawn([node("gate", "flag", "toggle", true), node("inner", "number", "number", 3, {parent: "gate", requires: ["gate"]})]);
    expect(row(screen, "inner").closest("[data-setting-nested]")).not.toBeNull();
    screen.draft.set("gate", false);
    await nextTick();
    expect(row(screen, "inner")).toBeNull();
    expect(screen.element.querySelector("[data-setting-nested]")).toBeNull();
    screen.draft.set("gate", true);
    await nextTick();
    expect(row(screen, "inner")).not.toBeNull();
});

test("the sections are drawn in the order they are declared and the section list is made from the same nodes", () => {
    const nodes = [node("one", "flag", "toggle", true, {section: "Second part"}), node("two", "flag", "toggle", true, {section: "First part"}), node("three", "flag", "toggle", true, {section: "Second part"})];
    const screen = drawn(nodes);
    expect(sectionsOf(nodes)).toEqual([{key: "second-part", title: "Second part"}, {key: "first-part", title: "First part"}]);
    expect([...screen.element.querySelectorAll("[data-section]")].map((section) => section.dataset.section)).toEqual(["second-part", "first-part"]);
    const list = drawnSettingComponent(SettingSectionList, {sections: sectionsOf(nodes)});
    expect([...list.element.querySelectorAll("[data-section-link]")].map((link) => link.textContent)).toEqual(["Second part", "First part"]);
});

test("a setting that names a component nobody built shows a row that says so", () => {
    const screen = drawn([node("odd", "text", "slider", "x")]);
    const odd = row(screen, "odd");
    expect(odd.hasAttribute("data-unknown-component")).toBe(true);
    expect(odd.querySelector("[role=alert]").textContent).toBe("No setting component is named slider.");
});

test("a setting that names no component is drawn with the one for its kind", () => {
    const screen = drawn([node("plain", "flag", "", false)]);
    expect(row(screen, "plain").querySelector("button[role=switch]")).not.toBeNull();
});

test("the controls are off while the window is read only", () => {
    const screen = drawn(EVERY_KIND, {readOnly: true});
    expect(row(screen, "a.flag").querySelector("button[role=switch]").disabled).toBe(true);
    expect(row(screen, "a.number").querySelector("input").disabled).toBe(true);
    expect(row(screen, "a.choice").querySelector("select").disabled).toBe(true);
});

test("a setting nobody has heard of is drawn with no change to any Vue file", () => {
    const screen = drawn([node("journal.suites.nobody.invented-this-yesterday", "number", "number", 42, {rule: NUMBER_RULE, section: "Invented"})]);
    const made = row(screen, "journal.suites.nobody.invented-this-yesterday");
    expect(made.querySelector(".lab").textContent).toContain("Title of journal.suites.nobody.invented-this-yesterday");
    expect(made.querySelector("input").value).toBe("42");
    expect(screen.element.querySelector("[data-section=invented] h4").textContent).toBe("Invented");
});
