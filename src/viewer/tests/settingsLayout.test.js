import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/settingsContext.js";
import SettingsTree from "../../core/modules/settings/web/src/SettingsTree.vue";
import {GROUPS, SECTIONS, sectionOf} from "../../core/modules/settings/web/src/settingSections.js";

afterEach(() => (document.body.innerHTML = ""));

const row = (key, module, fields = {}) => ({key, module, parent: null, title: key.split(".").pop(), description: "", type: "flag", value: true, shown: "on", source: "default", secret: false, scope: "environment", choices: [], toggleable: false, default: true, ...fields});
const ROWS = [
    row("journal.core.viewer.motion", "journal.core.viewer", {title: "Animations"}),
    row("journal.core.reviews.model", "journal.core.reviews", {title: "Review model"}),
    row("journal.core.tunnel.service", "journal.core.tunnel", {title: "Tunnel service"}),
    row("journal.core.developer.tools", "journal.core.developer", {title: "Developer tools"}),
    row("journal.core.tasks.limit", "journal.core.tasks", {title: "Task limit"}),
];

async function drawn() {
    const window = context({"setting tree": page(ROWS), "environment cards": page([])});
    return mounted(SettingsTree, window);
}
const labels = (element, selector) => [...element.querySelectorAll(selector)].map((found) => found.textContent.trim());

test("test_section_nav_with_search_first: the nav starts with the search, then each group with its sections in the design's order", async () => {
    const element = await drawn();
    const nav = element.querySelector("[data-settings-nav]");
    expect(nav.firstElementChild.hasAttribute("data-settings-search")).toBe(true);
    expect(labels(element, "[data-settings-group]")).toEqual(["Viewer", "Agents", "Connections", "Project"]);
    expect(labels(element, "[data-section]")).toEqual(["Look", "Workers", "Reviews", "Helpers", "Tests", "Command classification", "Hooks", "Advanced", "Tunnel", "Environments", "Developer"]);
    expect(nav.textContent).not.toMatch(/\./);
});

test("test_section_icons: each section has one icon, Reviews an eye, Tests the to-dos, Advanced the layout and Developer the code", async () => {
    const element = await drawn();
    const icon = (key) => element.querySelector(`[data-section="${key}"] [data-section-icon]`).dataset.icon;
    expect(icon("reviews")).toBe("eye");
    expect(icon("tests")).toBe("todos");
    expect(icon("advanced")).toBe("layout");
    expect(icon("developer")).toBe("code");
    expect(element.querySelectorAll("[data-section]").length).toBe(element.querySelectorAll("[data-section-icon]").length);
    expect(GROUPS.flatMap((group) => group.sections).every((key) => SECTIONS[key].icon)).toBe(true);
});

test("test_search_finds_rows: typing in the search shows the matching rows of every section with the section named, and none says so", async () => {
    const element = await drawn();
    const box = element.querySelector("[data-settings-search-field]");
    box.value = "model";
    box.dispatchEvent(new Event("input"));
    await settle();
    expect(labels(element, "[data-found-section] h3")).toEqual(["Reviews"]);
    expect(element.querySelector("[data-setting='journal.core.reviews.model']")).not.toBeNull();
    box.value = "limit";
    box.dispatchEvent(new Event("input"));
    await settle();
    expect(labels(element, "[data-found-section] h3")).toEqual(["Advanced"]);
    box.value = "zzzz";
    box.dispatchEvent(new Event("input"));
    await settle();
    expect(element.querySelector("[data-settings-none]")).not.toBeNull();
});

test("test_declared_screen_mapped: a declared module opens in the section the design gives it, the agent settings are drawn by their own window, and a module no section names goes under Advanced", async () => {
    expect(sectionOf("journal.core.viewer")).toBe("look");
    expect(sectionOf("journal.core.tunnel")).toBe("tunnel");
    expect(sectionOf("journal.suites.coding.workers")).toBeNull();
    expect(sectionOf("journal.core.tasks")).toBe("advanced");
    const element = await drawn();
    element.querySelector('[data-section="tunnel"]').click();
    await settle();
    expect(element.querySelector("[data-setting='journal.core.tunnel.service']")).not.toBeNull();
    expect(element.querySelector("[data-setting='journal.core.reviews.model']")).toBeNull();
    element.querySelector('[data-section="advanced"]').click();
    await settle();
    expect(element.querySelector("[data-setting='journal.core.tasks.limit']")).not.toBeNull();
});
