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
