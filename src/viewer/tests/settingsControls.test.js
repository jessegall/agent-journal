import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/settingsContext.js";
import SettingsTree from "../../core/modules/settings/web/src/SettingsTree.vue";

afterEach(() => (document.body.innerHTML = ""));

const row = (key, fields) => ({key, module: "shop", parent: null, title: key, description: "", type: "number", value: 5, shown: "5", source: "default", secret: false, scope: "environment", choices: [], toggleable: false, default: 5, ...fields});
const ROWS = [row("shop.limit", {value: 9, shown: "9", source: "environment"}), row("shop.size"), row("shop.fast", {type: "flag", value: false, shown: "off", default: true, source: "environment"})];

// a module with no section of its own is drawn in Advanced, and the other sections are chosen in the nav
const open = async (element, section) => {
    element.querySelector(`[data-section="${section}"]`).click();
    await settle();
};
const save = async (element) => {
    element.querySelector("[data-settings-apply]").click();
    await settle();
};

async function drawnWith(rows, {section = "advanced", extra = {}} = {}) {
    const ran = [];
    const window = context({"setting tree": page(rows), ...extra});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(SettingsTree, window);
    document.body.append(element);
    await open(element, section);
    return {element, ran, window};
}

test("a changed setting has a dot and a reset that waits in the draft until Save sets its default", async () => {
    const {element, ran} = await drawnWith(ROWS);
    const limit = element.querySelector("[data-setting='shop.limit']");
    expect(limit.querySelector("[data-setting-changed]").previousElementSibling.classList.contains("setting-label")).toBe(true);
    limit.querySelector("[data-setting-reset]").click();
    await settle();
    expect(ran).toEqual([]);
    await save(element);
    expect(ran).toContainEqual(["setting", "set", "shop.limit", "5"]);
    expect(element.querySelector("[data-setting='shop.size'] [data-setting-reset]")).toBeNull();
});

test("a setting off only because its group is off does not count as changed", async () => {
    const {element} = await drawnWith([row("shop.held", {type: "flag", value: false, shown: "off", source: "group shop.all is off"})]);
    expect(element.querySelector("[data-setting-changed]")).toBeNull();
    expect(element.querySelector("[data-setting-reset]")).toBeNull();
});

async function environments(ran) {
    const window = context({"setting tree": page(ROWS), "environment cards": page([{id: 1, name: "main", folder: "/shop", branch: "main", running_agent_count: 1, unfinished_task_count: 3}, {id: 2, name: "staging", folder: "/shop-staging", branch: "next"}])});
    window.run = async (line) => (ran.push(line), line[2] === "2" ? {ok: false, error: "it has tasks"} : {ok: true, value: {}});
    const element = await mounted(SettingsTree, window);
    document.body.append(element);
    await open(element, "environments");
    return element;
}

test("the environments section lists them with the current one first, which cannot be removed", async () => {
    const element = await environments([]);
    expect([...element.querySelectorAll("[data-environment]")].map((item) => item.dataset.environment)).toEqual(["main", "staging"]);
    expect(element.querySelector("[data-environment='main'] [data-environment-remove]").disabled).toBe(true);
});

test("removing an environment asks first, and a refusal says why", async () => {
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

test("an environment says whether its agent runs and how many tasks are not done", async () => {
    const element = await environments([]);
    expect(element.querySelector("[data-environment-state]").textContent).toContain("Agent: running · 3 tasks not done");
});

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
    await save(element);
    expect(ran[0]).toEqual(expect.arrayContaining(["setting", "set", "shop.names", JSON.stringify(["a", "b", "c"])]));
});

test("the page reads the environments and the saved commands only when their section opens", async () => {
    const {element, window} = await drawnWith(ROWS, {section: "advanced", extra: {"environment cards": page([]), "alias saved": page([{id: 1, name: "tests", line: "npm test", category: "test run"}])}});
    expect(window.reads).toEqual(["setting tree"]);
    await open(element, "commands");
    expect(window.reads).toContain("alias saved --limit 1000");
    expect(element.querySelector('[data-saved-command="tests"]')).not.toBeNull();
    await open(element, "environments");
    expect(window.reads).toContain("environment cards");
});
