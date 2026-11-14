import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {PAGE_TOASTS} from "../kit/useToast.js";
import {applyFilter, defaultFilter} from "../kit/toggleFilter.js";
import {placeUnder} from "../kit/vContext.js";
import {makeToasts} from "../src/composables/toasts.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import {context, mounted, page, settle, typeInto, unmountAll} from "./support/windowContext.js";
import MemoriesPage from "../../core/modules/memories/web/src/MemoriesPage.vue";
import AgentMemories from "../../core/modules/memories/web/src/AgentMemories.vue";
import {memoryItems} from "../../core/modules/memories/web/src/memoryItems.js";
import {memoryFilters} from "../../core/modules/memories/web/src/memoryWords.js";

const memory = (id, extra = {}) => ({id, text: `Memory words ${id}`, weight: 5, state: "active", agent_id: null, task_id: null, reason: "", created_at: "2026-11-01T10:00:00Z", ...extra});
const ROWS = [memory(1, {text: "Totals are in cents", task_id: 6700}), memory(2, {text: "My worktree is clean", weight: 7, agent_id: 646}), memory(3, {text: "An old fact", weight: 1, state: "removed", reason: "faded to weight 0"})];
const AGENTS = [{agent_id: 646, name: "Worker 646", role: "worker", ended_at: null}];
let toasts = null;

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}});
    location.hash = "";
    toasts = makeToasts(async () => ({ok: true}));
    globalThis[PAGE_TOASTS] = toasts;
});
afterEach(() => {
    unmountAll();
    document.body.innerHTML = "";
    delete globalThis[PAGE_TOASTS];
    vi.unstubAllGlobals();
});

async function drawn() {
    const ran = [];
    const window = context({}, null, {memories: {line: "memory page", events: ["memory.*"], loading: "requested"}});
    window.read = async () => ({ok: true, value: {rows: ROWS, agents: AGENTS, total: 3, page: 1, size: 100}});
    window.readKeys = async ({only = []}) => ({ok: true, value: {declared: {memories: {tab: null, events: ["memory.*"], reload_seconds: 0, loading: "requested", page_size: 0}}, keys: Object.fromEntries(only.map((name) => [name, name === "memories" ? {ok: true, value: {rows: ROWS, agents: AGENTS, total: 3, page: 1, size: 100}} : {ok: true, value: {rows: []}}]))}});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(MemoriesPage, window);
    document.body.append(element);
    await settle();
    return {element, ran};
}
const rowOf = (element, id) => element.querySelector(`[data-row="${id}"]`);
const texts = (element, selector) => [...element.querySelectorAll(selector)].map((found) => found.textContent.trim());
const choose = async (element, id) => {
    rowOf(element, id).click();
    await settle();
};
const itemButton = (label) => [...document.body.querySelectorAll("[data-menu-item]")].find((item) => item.textContent.trim().replace(/›$/, "") === label);

test("test_default_filter_active: the list starts on the active memories, with the task as a bare number at the right edge and the agent and weight under the words", async () => {
    const {element} = await drawn();
    expect(texts(element, "[data-reader-row] .list-row-title")).toEqual(["Totals are in cents", "My worktree is clean"]);
    expect(texts(rowOf(element, 1), "[data-memory-task]")).toEqual(["6700"]);
    expect(texts(element, ".list-row-text")).toEqual(["Main agent · weight 5", "Worker 646 · weight 7"]);
    const fields = memoryFilters(ROWS, AGENTS);
    expect(applyFilter(ROWS, fields, defaultFilter(fields)).map((row) => row.id)).toEqual([1, 2]);
    expect(applyFilter(ROWS, fields, {state: {not: false, values: ["removed"]}}).map((row) => row.id)).toEqual([3]);
    expect(fields.find((field) => field.key === "agent").options.map(([, label]) => label)).toEqual(["Main agent", "Worker 646", "Main agent"].slice(0, 2));
});

test("test_weigh_steps: the reader weighs in the ten steps of the weight and runs memory weigh", async () => {
    const {element, ran} = await drawn();
    await choose(element, 1);
    expect(texts(element, ".field-name")).toEqual(["State", "Weight", "Task", "Made"]);
    element.querySelector("[data-actions-menu]").click();
    await settle();
    itemButton("Weigh").click();
    await settle();
    expect(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].every((step) => itemButton(step))).toBe(true);
    itemButton("8").click();
    await settle();
    await settle();
    expect(ran).toContainEqual(["memory", "weigh", "1", "8"]);
});

test("test_remove_and_restore: Remove asks once and says it with an Undo that restores, and a removed memory offers Bring it back", async () => {
    const {element, ran} = await drawn();
    await choose(element, 2);
    element.querySelector("[data-actions-menu]").click();
    await settle();
    itemButton("Remove").click();
    await settle();
    itemButton("Remove: click again").click();
    await settle();
    await settle();
    expect(ran).toContainEqual(["memory", "remove", "2", "--reason", "Removed from the memory list"]);
    expect(toasts.current.value).toEqual({text: "Removed memory 2", undo: {line: ["memory", "restore", "2"]}});
    const spoken = [];
    const items = memoryItems(ROWS[2], {run: async (line) => (ran.push(line), {ok: true}), ask: () => {}});
    expect(items.map((item) => item.label)).toEqual(["Open", "Weigh", "Copy text", "Edit", "Bring it back"]);
    await items.find((item) => item.label === "Bring it back").run({say: (text) => spoken.push(text)});
    expect(ran).toContainEqual(["memory", "restore", "3"]);
    expect(spoken).toEqual(["Memory 3 is back"]);
});

test("test_no_new_button: the page has no New memory, as an agent makes its own", async () => {
    const {element} = await drawn();
    expect(element.textContent).not.toMatch(/new memory/i);
    expect(element.querySelector(".page-header-end button")).toBeNull();
});

test("test_agent_tab_rows: the agent's memories tab draws the same memory rows with the same menu", async () => {
    const answers = {"memory page --agent 646 --state active": page([ROWS[1]]), "memory page --agent 646 --removed": page([ROWS[2]])};
    const keys = {
        "agent-memories.*": {line: "memory page --agent {id} --state active --order weight --limit 100", tab: "memories", events: ["memory.*"], loading: "requested"},
        "agent-removed-memories.*": {line: "memory page --agent {id} --removed --state removed --order weight --limit 100", tab: "memories", events: ["memory.*"], loading: "requested"},
    };
    const element = await mounted(AgentMemories, context(answers, null, keys), {agent: 646});
    document.body.append(element);
    await vi.waitFor(() => expect(element.querySelector('[data-memory="2"]')).not.toBeNull());
    const labels = menuEntries(placeUnder(element.querySelector('[data-memory="2"]')).items).filter((entry) => !entry.separator).map((entry) => entry.label);
    expect(labels).toEqual(["Open", "Weigh", "Copy text", "Edit", "Remove"]);
});

test("test_menu_items: a right click has Open, Weigh in 9, 7 and 5, Copy text, Edit and Remove, and Edit changes the words through memory edit", async () => {
    const {element, ran} = await drawn();
    const entries = menuEntries(placeUnder(rowOf(element, 1)).items).filter((entry) => !entry.separator);
    expect(entries.map((entry) => entry.label)).toEqual(["Open", "Weigh", "Copy text", "Edit", "Remove"]);
    expect(entries.find((entry) => entry.label === "Weigh").children.map((child) => child.label)).toEqual(["9: owed work", "7: later today", "5: work in hand"]);
    entries.find((entry) => entry.label === "Edit").run({say: () => {}});
    await settle();
    expect(document.body.querySelector('[data-field="text"]').value).toBe("Totals are in cents");
    const field = document.body.querySelector('[data-field="text"]');
    typeInto(field, "Totals are in euro cents");
    await settle();
    document.body.querySelector("[data-create-send]").click();
    await settle();
    expect(ran).toContainEqual(["memory", "edit", "1", "--text", "Totals are in euro cents"]);
});
