import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/settingsContext.js";
import SettingsTree from "../../core/modules/settings/web/src/SettingsTree.vue";

afterEach(() => (document.body.innerHTML = ""));

const row = (key, fields) => ({key, module: "shop", parent: null, title: key, description: "", type: "number", value: 5, shown: "5", source: "default", secret: false, scope: "environment", choices: [], toggleable: false, default: 5, ...fields});
const ROWS = [row("shop.limit", {value: 9, shown: "9", source: "environment"}), row("shop.size"), row("shop.fast", {type: "flag", value: false, shown: "off", default: true, source: "environment"})];

async function drawn() {
    const ran = [];
    const window = context({"setting tree": page(ROWS)});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(SettingsTree, window);
    document.body.append(element);
    return {element, ran};
}

const shown = (element) => [...element.querySelectorAll("[data-setting]")].map((item) => item.dataset.setting);
const pick = async (element, label) => {
    [...element.querySelectorAll("[data-settings-filter] button")].find((button) => button.textContent.includes(label)).click();
    await settle();
};

test("the filters keep all, the changed and the switched off", async () => {
    const {element} = await drawn();
    expect(shown(element)).toEqual(["shop.limit", "shop.size", "shop.fast"]);
    await pick(element, "Changed");
    expect(shown(element)).toEqual(["shop.limit", "shop.fast"]);
    await pick(element, "Off");
    expect(shown(element)).toEqual(["shop.fast"]);
});

test("a changed setting has a dot and a reset that sets its default", async () => {
    const {element, ran} = await drawn();
    const limit = element.querySelector("[data-setting='shop.limit']");
    expect(limit.querySelector("[data-setting-changed]").previousElementSibling.classList.contains("setting-label")).toBe(true);
    limit.querySelector("[data-setting-reset]").click();
    await settle();
    expect(ran).toContainEqual(["setting", "set", "shop.limit", "5"]);
    expect(element.querySelector("[data-setting='shop.size'] [data-setting-reset]")).toBeNull();
    element.querySelector("[data-setting='shop.fast'] [data-setting-reset]").click();
    await settle();
    expect(ran).toContainEqual(["setting", "set", "shop.fast", "on"]);
});

test("a setting off only because its group is off does not count as changed", async () => {
    const window = context({"setting tree": page([row("shop.held", {type: "flag", value: false, shown: "off", source: "group shop.all is off"})])});
    const element = await mounted(SettingsTree, window);
    expect(element.querySelector("[data-setting-changed]")).toBeNull();
    expect(element.querySelector("[data-setting-reset]")).toBeNull();
});

test("slash focuses the search and escape clears it", async () => {
    const {element} = await drawn();
    const search = element.querySelector("[data-search-input]");
    document.body.dispatchEvent(new KeyboardEvent("keydown", {key: "/", bubbles: true}));
    expect(document.activeElement).toBe(search);
    search.value = "size";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect(shown(element)).toEqual(["shop.size"]);
    search.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    expect(search.value).toBe("");
});

async function environments(ran) {
    const window = context({"setting tree": page(ROWS), "environment cards": page([{id: 1, name: "main", folder: "/shop", branch: "main", running_agent_count: 1, unfinished_task_count: 3}, {id: 2, name: "staging", folder: "/shop-staging", branch: "next"}])});
    window.run = async (line) => (ran.push(line), line[2] === "2" ? {ok: false, error: "it has tasks"} : {ok: true, value: {}});
    const element = await mounted(SettingsTree, window);
    [...element.querySelectorAll("[data-settings-tabs] button")].find((button) => button.textContent.includes("Environments")).click();
    await settle();
    return element;
}

test("the environments tab lists them with the current one first, which cannot be removed", async () => {
    const element = await environments([]);
    expect([...element.querySelectorAll("[data-environment]")].map((row) => row.dataset.environment)).toEqual(["main", "staging"]);
    expect(element.querySelector("[data-environment='main'] [data-environment-remove]").disabled).toBe(true);
});

test("removing an environment asks first, and a refusal says justification", async () => {
    const ran = [];
    const element = await environments(ran);
    element.querySelector("[data-environment='staging'] [data-environment-remove]").click();
    await settle();
    expect(ran).toEqual([]);
    element.querySelector("[data-environment='staging'] [data-environment-confirm]").click();
    await settle();
    expect(ran).toContainEqual(["environment", "delete", "2"]);
    expect(element.querySelector("[data-environment='staging'] [data-environment-refusal]").textContent).toBe("it has tasks");
});

async function drawnWith(rows) {
    const ran = [];
    const window = context({"setting tree": page(rows)});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    return {element: await mounted(SettingsTree, window), ran};
}

test("a number whose key names its unit shows the unit", async () => {
    const {element} = await drawnWith([row("shop.wait-minutes"), row("shop.size")]);
    expect(element.querySelector('[data-setting="shop.wait-minutes"] [data-setting-unit]').textContent).toBe("minutes");
    expect(element.querySelector('[data-setting="shop.size"] [data-setting-unit]')).toBeNull();
});

test("a list is edited one on each line and saved as a list", async () => {
    const {element, ran} = await drawnWith([row("shop.names", {type: "list", value: JSON.stringify(["a", "b"]), shown: "a, b"})]);
    const box = element.querySelector("[data-setting-list]");
    expect(box.value).toBe("a\nb");
    box.value = "a\nb\n\nc";
    box.dispatchEvent(new Event("change"));
    await settle();
    expect(ran[0]).toEqual(expect.arrayContaining(["setting", "set", "shop.names", JSON.stringify(["a", "b", "c"])]));
});

test("picking a section in the nav shows that section alone", async () => {
    const {element} = await drawnWith([row("shop.size"), row("till.size", {module: "till"})]);
    const shown = () => [...element.querySelectorAll("[data-module]")].map((section) => section.dataset.module);
    expect(shown()).toEqual(["shop"]);
    expect(element.querySelector(".settings-nav-item.current").dataset.jump).toBe("shop");
    element.querySelector('[data-jump="till"]').click();
    await settle();
    expect(shown()).toEqual(["till"]);
    expect(element.querySelector(".settings-nav-item.current").dataset.jump).toBe("till");
    expect(element.querySelector('[data-setting="shop.size"]')).toBeNull();
    expect(element.querySelectorAll(".settings-nav-item")).toHaveLength(3);
});

test("an environment says whether its agent runs and how many tasks are not done", async () => {
    const element = await environments([]);
    expect(element.querySelector("[data-environment-state]").textContent).toContain("Agent: running · 3 tasks not done");
});

test("the page reads each tab and the command section when opened", async () => {
    const window = context({"setting tree": page(ROWS), "environment cards": page([]), "alias saved": page([{id: 1, name: "tests", line: "npm test", category: "test run"}])});
    const element = await mounted(SettingsTree, window);
    expect(window.reads).toEqual(["setting tree"]);
    element.querySelector('[data-jump="commands"]').click();
    await settle();
    expect(window.reads).toContain("alias saved --limit 1000");
    expect(element.querySelector('[data-saved-command="tests"]')).not.toBeNull();
    [...element.querySelectorAll("[data-settings-tabs] button")].find((button) => button.textContent.includes("Environments")).click();
    await settle();
    expect(window.reads).toContain("environment cards");
});
