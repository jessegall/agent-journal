import {afterEach, beforeEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/settingsContext.js";
import SettingsTree from "../../core/modules/settings/web/src/SettingsTree.vue";
import {applySettings} from "./support/pageSteps.js";

beforeEach(() => (location.hash = ""));
afterEach(() => (document.body.innerHTML = ""));

const row = (key, fields) => ({key, module: "shop", parent: null, title: key, description: "", type: "flag", value: false, shown: "off", source: "default", secret: false, scope: "environment", choices: [], toggleable: false, default: false, ...fields});
const ROWS = [row("shop.fast"), row("shop.loud"), row("shop.size", {type: "number", value: 5, shown: "5", default: 5})];
const DEVELOPER = [
    row("journal.core.developer.tools", {module: "journal.core.developer", type: "group", toggleable: true, value: false, title: "Developer tools"}),
    row("journal.core.developer.tools.hooks", {module: "journal.core.developer", parent: "journal.core.developer.tools", title: "Hook requests", value: true, shown: "on"}),
];

async function drawn(rows = ROWS, section = "advanced") {
    const ran = [];
    const window = context({"setting tree": page(rows), "environment cards": page([])});
    window.run = async (line) => (ran.push(line), ran.refuse?.(line) ?? {ok: true, value: {}});
    const element = await mounted(SettingsTree, window);
    document.body.append(element);
    element.querySelector(`[data-section="${section}"]`).click();
    await settle();
    return {element, ran};
}
const flip = async (element, key) => {
    element.querySelector(`[data-setting='${key}'] [data-flag-switch]`).click();
    await settle();
};
const note = (element) => element.querySelector("[data-settings-note]").textContent;

test("test_changes_are_draft: changes wait in a draft with their count by Save, and Save sends them all", async () => {
    const {element, ran} = await drawn();
    expect(element.querySelector("[data-settings-apply]").disabled).toBe(true);
    await flip(element, "shop.fast");
    await flip(element, "shop.loud");
    expect(ran).toEqual([]);
    expect(note(element)).toContain("2 changes");
    await applySettings(element);
    expect(ran).toEqual([["setting", "set", "shop.fast", "on"], ["setting", "set", "shop.loud", "on"]]);
    expect(note(element)).toContain("No changes");
});

test("test_leave_asks_with_changes: a link out of the page asks first when changes are not saved, and Leave drops them", async () => {
    const {element} = await drawn();
    const link = document.createElement("a");
    link.href = "#/elsewhere";
    document.body.append(link);
    link.click();
    await settle();
    expect(document.body.querySelector("[data-leave-words]")).toBeNull();
    location.hash = "";
    await flip(element, "shop.fast");
    link.click();
    await settle();
    expect(document.body.querySelector("[data-leave-words]").textContent).toContain("1 change is not saved");
    expect(location.hash).not.toBe("#/elsewhere");
    document.body.querySelector("[data-leave-stay]").click();
    await settle();
    expect(document.body.querySelector("[data-leave-words]")).toBeNull();
    expect(note(element)).toContain("1 change");
    link.click();
    await settle();
    document.body.querySelector("[data-leave-go]").click();
    await settle();
    expect(location.hash).toBe("#/elsewhere");
    expect(note(element)).toContain("No changes");
});

test("test_partial_save_marks_refused_row: a refused row keeps its change and shows why, and the rows that were saved leave the draft", async () => {
    const {element, ran} = await drawn();
    ran.refuse = (line) => (line[2] === "shop.loud" ? {ok: false, error: "the model is not allowed"} : null);
    await flip(element, "shop.fast");
    await flip(element, "shop.loud");
    await applySettings(element);
    expect(element.querySelector("[data-setting='shop.loud'] [data-setting-refused]").textContent).toBe("the model is not allowed");
    expect(element.querySelector("[data-setting='shop.fast'] [data-setting-refused]")).toBeNull();
    expect(note(element)).toContain("1 change");
    expect(note(element)).toContain("Shop.loud".toLowerCase());
    expect(element.querySelector("[data-setting='shop.loud'] [data-flag-switch]").getAttribute("aria-checked")).toBe("true");
});

test("test_developer_switch_shows_group: the Developer section has the Developer pages switch, which turns the developer tools on for the sidebar's Developer group", async () => {
    const {element, ran} = await drawn(DEVELOPER, "developer");
    expect(element.querySelector("[data-developer-pages]").textContent).toContain("Developer pages");
    expect(element.querySelector("[data-developer-switch]").getAttribute("aria-checked")).toBe("false");
    element.querySelector("[data-developer-switch]").click();
    await settle();
    expect(element.querySelector("[data-developer-switch]").getAttribute("aria-checked")).toBe("true");
    await applySettings(element);
    expect(ran).toEqual([["setting", "switch", "journal.core.developer.tools", "on", "--project"]]);
});
