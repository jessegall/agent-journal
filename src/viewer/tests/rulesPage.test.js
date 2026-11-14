import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {applyFilter, defaultFilter} from "../kit/toggleFilter.js";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import {context, mounted, page, settle, typeInto, unmountAll} from "./support/windowContext.js";
import RulesPage from "../../core/modules/project_rules/web/src/RulesPage.vue";
import {ruleFilters, ruleMenu} from "../../core/modules/project_rules/web/src/ruleWords.js";

const rule = (id, text, state) => ({id, text, state, created_at: "2026-11-01T10:00:00Z"});
const RULES = [rule(2, "Use small tests", "active"), rule(1, "Read the brief", "proposed"), rule(3, "Old rule", "removed"), rule(4, "Denied rule", "denied")];

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}});
    location.hash = "";
});
afterEach(() => {
    unmountAll();
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

const rulesContext = (answers) => context(answers, null, {rules: {line: "rule list", events: ["rule.*"], page_size: 50}});

async function drawn(rows = RULES) {
    const ran = [];
    const window = rulesContext({"rule list": page(rows)});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(RulesPage, window);
    document.body.append(element);
    await settle();
    return {element, ran, window};
}
const rowOf = (element, id) => element.querySelector(`[data-row="${id}"]`);
const choose = async (element, id) => {
    rowOf(element, id).click();
    await settle();
};
const itemButton = (label) => [...document.body.querySelectorAll("[data-menu-item]")].find((item) => item.textContent.trim() === label);
const labels = (element, id) => menuEntries(placeUnder(rowOf(element, id)).items).filter((entry) => !entry.separator).map((entry) => entry.label);

test("test_state_filter: the list starts on the waiting and active rules, grouped with the waiting ones first, and the filter can show the removed ones", async () => {
    const {element, window} = await drawn();
    expect(window.reads).toEqual(["rule list --limit 50"]);
    expect([...element.querySelectorAll("[data-reader-row]")].map((row) => row.dataset.row)).toEqual(["1", "2"]);
    expect([...element.querySelectorAll(".list-reader-group")].map((group) => group.textContent)).toEqual(["Waiting for you", "Active"]);
    expect(ruleFilters[0].options.map(([, label]) => label)).toEqual(["Waiting", "Active", "Denied", "Removed"]);
    expect(applyFilter(RULES, ruleFilters, defaultFilter(ruleFilters)).map((found) => found.id)).toEqual([2, 1]);
    expect(applyFilter(RULES, ruleFilters, {state: {not: false, values: ["removed"]}}).map((found) => found.id)).toEqual([3]);
});

test("test_reader_actions: the reader approves a waiting rule and declines it from Actions, and an active rule is edited and removed", async () => {
    const {element, ran} = await drawn();
    await choose(element, 1);
    element.querySelector("[data-rule-approve]").click();
    await settle();
    expect(ran).toContainEqual(["rule", "approve", "1"]);
    element.querySelector("[data-actions-menu]").click();
    await settle();
    itemButton("Decline").click();
    await settle();
    await settle();
    expect(ran).toContainEqual(["rule", "deny", "1"]);
    await choose(element, 2);
    expect(element.querySelector("[data-rule-approve]")).toBeNull();
    element.querySelector("[data-actions-menu]").click();
    await settle();
    itemButton("Edit").click();
    await settle();
    await settle();
    typeInto(document.body.querySelector('[data-field="text"]'), "Use small, fast tests");
    await settle();
    document.body.querySelector("[data-create-send]").click();
    await settle();
    expect(ran).toContainEqual(["rule", "edit", "2", "--text", "Use small, fast tests"]);
    element.querySelector("[data-actions-menu]").click();
    await settle();
    itemButton("Remove").click();
    await settle();
    itemButton("Remove: click again").click();
    await settle();
    await settle();
    expect(ran).toContainEqual(["rule", "remove", "2"]);
});

test("test_menu_items: a right click has Open and Copy text, Approve and Decline on a waiting rule, Edit and Remove on an active one, and Copy text alone on a removed one", async () => {
    const {element} = await drawn();
    expect(labels(element, 1)).toEqual(["Open", "Copy text", "Approve", "Decline"]);
    expect(labels(element, 2)).toEqual(["Open", "Copy text", "Edit", "Remove"]);
    expect(ruleMenu(RULES[2], {run: async () => ({ok: true}), remove: async () => ({ok: true}), ask: () => {}}).map((item) => item.label)).toEqual(["Copy text"]);
});

test("rules page older rows through the declared key", async () => {
    const window = rulesContext({});
    window.read = async (line) => ({ok: true, value: {rows: [rule(line.includes("--before-id") ? 1 : 2, line.includes("--before-id") ? "Older rule" : "Newer rule", "active")], page: 1, size: 1, total: 2}});
    const element = await mounted(RulesPage, window);
    document.body.append(element);
    await settle();
    element.querySelector("[data-row-list-more]").click();
    await settle();
    expect(element.textContent).toContain("Older rule");
    expect(element.textContent).toContain("Newer rule");
});
