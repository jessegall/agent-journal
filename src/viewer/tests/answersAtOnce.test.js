import {afterEach, expect, test} from "vitest";
import {added, patched, patchedWhere, removed} from "@journal/window-kit";
import {context, mounted, page, settle} from "./support/settingsContext.js";
import SettingsTree from "../../core/modules/settings/web/src/SettingsTree.vue";

afterEach(() => (document.body.innerHTML = ""));

const row = (key, fields) => ({key, module: "shop", parent: null, title: key, description: "", type: "number", value: 5, shown: "5", source: "default", secret: false, scope: "environment", choices: [], toggleable: false, default: 5, ...fields});
const ROWS = [row("shop.size"), row("shop.fast", {type: "flag", value: false, shown: "off", default: true, source: "environment"}), row("shop.names", {type: "list", value: '["a","b"]', shown: "a, b"})];

// a window whose server answers a run only when the test says so, and lists what the server holds
function slowServer(rows) {
    const held = {rows};
    const window = context({"setting tree": {get ok() {return true;}, get value() {return {rows: held.rows, page: 1, size: 50, total: held.rows.length};}}});
    const runs = [];
    window.run = (line) => new Promise((resolve) => runs.push({line, answer: resolve}));
    return {window, runs, held};
}

const switchOf = (element, key) => element.querySelector(`[data-setting='${key}'] [data-flag-switch]`);

test("the row helpers give the rows the command will leave and keep the rows they were given", () => {
    const rows = [{id: 1, title: "a"}, {id: 2, title: "b"}];
    expect(removed(1)(rows)).toEqual([{id: 2, title: "b"}]);
    expect(patched(2, {title: "c"})(rows)).toEqual([{id: 1, title: "a"}, {id: 2, title: "c"}]);
    expect(patchedWhere((held) => held.title === "a", {title: "z"})(rows)[0].title).toBe("z");
    expect(added({id: 3})(rows)).toHaveLength(3);
    expect(rows).toEqual([{id: 1, title: "a"}, {id: 2, title: "b"}]);
});

const isOn = (element, key) => switchOf(element, key).getAttribute("aria-checked");

test("a setting shows its new value before the server has answered", async () => {
    const {window, runs} = slowServer(ROWS);
    const element = await mounted(SettingsTree, window);
    expect(isOn(element, "shop.fast")).toBe("false");
    switchOf(element, "shop.fast").click();
    await settle();
    expect(runs.map((run) => run.line)).toEqual([["setting", "set", "shop.fast", "on"]]);
    expect(isOn(element, "shop.fast")).toBe("true");
});

test("a refused setting goes back to the value it had and says why", async () => {
    const {window, runs} = slowServer(ROWS);
    const element = await mounted(SettingsTree, window);
    switchOf(element, "shop.fast").click();
    await settle();
    expect(isOn(element, "shop.fast")).toBe("true");
    runs[0].answer({ok: false, error: "the model is not allowed"});
    await settle();
    expect(isOn(element, "shop.fast")).toBe("false");
    expect(element.querySelector("[data-setting='shop.fast'] .setting-refusal").textContent).toBe("the model is not allowed");
});

test("an accepted setting stays as the server lists it and shows no refusal", async () => {
    const {window, runs, held} = slowServer(ROWS);
    const element = await mounted(SettingsTree, window);
    switchOf(element, "shop.fast").click();
    await settle();
    held.rows = ROWS.map((listedRow) => (listedRow.key === "shop.fast" ? {...listedRow, value: true, shown: "on"} : listedRow));
    runs[0].answer({ok: true, value: {}});
    await settle();
    expect(isOn(element, "shop.fast")).toBe("true");
    expect(element.querySelector("[data-setting='shop.fast'] .setting-refusal")).toBeNull();
});

const ENVIRONMENTS = [{id: 1, name: "main", folder: "/shop", branch: "main", running_agent_count: 1, unfinished_task_count: 3}, {id: 2, name: "staging", folder: "/shop-staging", branch: "next", running_agent_count: 0, unfinished_task_count: 0}];

async function environmentsTab() {
    const window = context({"setting tree": page(ROWS), "environment cards": page(ENVIRONMENTS)});
    const runs = [];
    window.run = (line) => new Promise((resolve) => runs.push({line, answer: resolve}));
    const element = await mounted(SettingsTree, window);
    [...element.querySelectorAll("[data-settings-tabs] button")].find((button) => button.textContent.includes("Environments")).click();
    await settle();
    element.querySelector("[data-environment='staging'] [data-environment-remove]").click();
    await settle();
    element.querySelector("[data-environment='staging'] [data-environment-confirm]").click();
    await settle();
    return {element, runs};
}

test("a removed environment is gone at once, and comes back with the reason when it is refused", async () => {
    const {element, runs} = await environmentsTab();
    expect(runs[0].line).toEqual(["environment", "delete", "2"]);
    expect(element.querySelector("[data-environment='staging']")).toBeNull();
    runs[0].answer({ok: false, error: "it has tasks"});
    await settle();
    expect(element.querySelector("[data-environment='staging'] [data-environment-refusal]").textContent).toBe("it has tasks");
});

test("a removed environment stays gone when the server removes it", async () => {
    const {element, runs} = await environmentsTab();
    runs[0].answer({ok: true, value: {}});
    await settle();
    expect(element.querySelector("[data-environment='main']")).not.toBeNull();
});

test("a list shows its new items at once, kept as a list", async () => {
    const {window, runs} = slowServer(ROWS);
    const element = await mounted(SettingsTree, window);
    const box = element.querySelector("[data-setting-list]");
    box.value = "a\nb\nc";
    box.dispatchEvent(new Event("change"));
    await settle();
    expect(runs[0].line).toEqual(["setting", "set", "shop.names", '["a","b","c"]']);
    expect(element.querySelector("[data-setting-list]").value).toBe("a\nb\nc");
});
