import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {applyFilter} from "../kit/toggleFilter.js";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import {context, mounted, settle, unmountAll} from "./support/windowContext.js";
import ReminderRows from "../../core/modules/reminders/web/src/ReminderRows.vue";
import {reminderFilters} from "../../core/modules/reminders/web/src/reminderWords.js";
import {typeField} from "./support/pageSteps.js";

const at = (hours, minutes) => {
    const day = new Date();
    day.setHours(hours, minutes, 0, 0);
    return day.toISOString();
};
const row = (id, text, extra = {}) => ({id, text, created_at: at(8, 0), interval_seconds: 0, interval_tool_uses: 0, interval_tasks: 0, due_at: null, single_use: false, block_condition: "", block_subject: "", last_fired_at: null, ended_at: null, ...extra});
const ROWS = [
    row(1, "Stretch", {interval_seconds: 1800}),
    row(2, "Review the closed tasks", {interval_tasks: 1, block_condition: "tests-green", block_subject: "main"}),
    row(3, "Ping the build", {interval_tool_uses: 50}),
    row(4, "Call the dentist", {due_at: at(14, 30), single_use: true}),
];

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}});
    location.hash = "";
});

afterEach(() => {
    unmountAll();
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function drawn() {
    const ran = [];
    const window = context({}, null, {reminders: {line: "reminder list", events: ["reminder.*"]}});
    window.read = async () => ({ok: true, value: {rows: ROWS}});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(ReminderRows, window);
    document.body.append(element);
    await settle();
    return {element, ran};
}
const rowOf = (element, id) => element.querySelector(`[data-row="${id}"]`);
const texts = (element, selector) => [...element.querySelectorAll(selector)].map((found) => found.textContent.trim());

test("test_row_lines: a row has its number and words on the first line, and how it repeats on the second", async () => {
    const {element} = await drawn();
    expect(texts(element, ".list-row-title")).toEqual(["1 Stretch", "2 Review the closed tasks", "3 Ping the build", "4 Call the dentist"]);
    expect(texts(element, "[data-reminder-rule]")).toEqual(["Every 30 min", "Each closed task", "Every 50 tool uses", "Once"]);
    expect(element.querySelector("[data-reader-list]").style.width).toBe("460px");
    expect(rowOf(element, 1).querySelector(".list-row-line [data-reminder-rule]")).not.toBeNull();
});

test("test_next_time_right_edge: the time it comes next is at the right edge of the first line, and a reminder that counts closed tasks has none", async () => {
    const {element} = await drawn();
    expect(texts(rowOf(element, 4), ".list-row-end [data-reminder-next]")).toEqual(["14:30"]);
    expect(texts(rowOf(element, 1), ".list-row-end [data-reminder-next]")).toEqual(["08:30"]);
    expect(texts(rowOf(element, 3), ".list-row-end [data-reminder-next]")).toEqual(["in 50 tool uses"]);
    expect(texts(rowOf(element, 2), ".list-row-end [data-reminder-next]")).toEqual([""]);
});

test("test_holds_mark: only a reminder that holds the agent has the Holds mark, every row ends in the agent chip, and the reader names the agent, the facts and no text part", async () => {
    const {element} = await drawn();
    expect(texts(element, "[data-reminder-holds]")).toEqual(["Holds"]);
    expect(rowOf(element, 2).querySelector("[data-reminder-holds]")).not.toBeNull();
    expect(element.querySelectorAll("[data-reminder-agent]")).toHaveLength(4);
    rowOf(element, 2).click();
    await settle();
    const reader = element.querySelector("[data-reminder-reader]");
    expect(reader.querySelector("[data-reader-head] [data-agent-badge]")).not.toBeNull();
    expect(texts(reader, ".field-name")).toEqual(["Repeats", "Holds", "Next", "Last"]);
    expect(texts(reader, ".field-value")).toEqual(["Each closed task", "Until tests-green: main", "Not timed", "Never"]);
    expect(reader.querySelector("[data-reader-section]")).toBeNull();
});

test("test_filters: the page filters by agent, by how it repeats and by whether it holds", async () => {
    const {element} = await drawn();
    expect(texts(element, "[data-filter-chip]").map((label) => label.replace(/\s.*/, ""))).toEqual(["Agent", "Repeats", "Holds"]);
    const fields = reminderFilters(ROWS);
    expect(fields.find((field) => field.key === "repeats").options.map(([, label]) => label)).toEqual(["Minutes", "Tool uses", "Closed tasks", "Once"]);
    const picked = (key, values) => applyFilter(ROWS, fields, {[key]: {not: false, values}}).map((found) => found.id);
    expect(picked("repeats", ["minutes"])).toEqual([1]);
    expect(picked("repeats", ["tool_uses"])).toEqual([3]);
    expect(picked("repeats", ["tasks"])).toEqual([2]);
    expect(picked("repeats", ["once"])).toEqual([4]);
    expect(picked("holds", ["holds"])).toEqual([2]);
    expect(picked("holds", ["free"])).toEqual([1, 3, 4]);
    expect(picked("agent", ["main agent"])).toEqual([1, 2, 3, 4]);
});


test("test_new_runs_reminder_make: the New dialog shows the line it will run, checks the number and runs reminder make", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-reminder-new]").click();
    await settle();
    await typeField("text", "Read the review");
    await typeField("repeat", "minutes");
    await typeField("every", "0");
    document.body.querySelector("[data-create-send]").click();
    await settle();
    expect(document.body.querySelector('[data-refused="every"]').textContent).toBe("Use a whole number of 1 or more");
    expect(ran).toEqual([]);
    await typeField("every", "5");
    expect(document.body.querySelector("[data-command-preview]").textContent).toBe('journal reminder make "Read the review" --every-minutes 5');
    document.body.querySelector("[data-create-send]").click();
    await settle();
    expect(ran).toContainEqual(["reminder", "make", "Read the review", "--every-minutes", "5"]);
    expect(document.body.querySelector("[data-create-dialog]")).toBeNull();
});

test("test_menu_items: a right click on a row has Copy text and Delete, and Delete runs reminder delete with no Undo", async () => {
    const {element, ran} = await drawn();
    const place = placeUnder(rowOf(element, 3));
    expect(place.head).toBe("Reminder 3");
    const entries = menuEntries(place.items);
    expect(entries.filter((entry) => !entry.separator).map((entry) => entry.label)).toEqual(["Copy text", "Delete"]);
    const spoken = [];
    await entries.find((entry) => entry.label === "Delete").run({say: (text, undo = null) => spoken.push([text, undo])});
    expect(ran).toContainEqual(["reminder", "delete", "3"]);
    expect(spoken).toEqual([["Deleted reminder 3", null]]);
});
