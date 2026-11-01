import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import SettingsTree from "../../core/modules/settings/web/src/SettingsTree.vue";

afterEach(() => (document.body.innerHTML = ""));

const row = (key, fields) => ({key, module: "shop", parent: null, title: key, description: "", type: "number", value: 5, shown: "5", source: "default", secret: false, scope: "environment", agent_writable: false, choices: [], toggleable: false, default: 5, ...fields});
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
    expect(limit.querySelector("[data-setting-changed]")).not.toBeNull();
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
    const search = element.querySelector("input[type=search]");
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
    const window = context({"setting tree": page(ROWS), "environment list": page([{id: 1, name: "main", folder: "/shop", branch: "main"}, {id: 2, name: "staging", folder: "/shop-staging", branch: "next"}])});
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

test("a list is edited one on each line and saved with commas", async () => {
    const {element, ran} = await drawnWith([row("shop.names", {type: "list", value: ["a", "b"], shown: "a, b"})]);
    const box = element.querySelector("[data-setting-list]");
    expect(box.value).toBe("a\nb");
    box.value = "a\nb\n\nc";
    box.dispatchEvent(new Event("change"));
    await settle();
    expect(ran[0]).toEqual(expect.arrayContaining(["setting", "set", "shop.names", "a,b,c"]));
});

test("the nav marks the first module, and the one scrolled to the top", async () => {
    const {element} = await drawnWith([row("shop.size"), row("till.size", {module: "till"})]);
    expect(element.querySelector(".settings-nav-item.current").dataset.jump).toBe("shop");
    const sections = element.querySelector("[data-settings-sections]");
    sections.getBoundingClientRect = () => ({top: 100});
    element.querySelector('[data-module="shop"]').getBoundingClientRect = () => ({top: -300});
    element.querySelector('[data-module="till"]').getBoundingClientRect = () => ({top: 105});
    sections.dispatchEvent(new Event("scroll"));
    await settle();
    expect(element.querySelector(".settings-nav-item.current").dataset.jump).toBe("till");
});
