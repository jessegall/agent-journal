import {afterEach, beforeEach, expect, test} from "vitest";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import {context, mounted, settle, typeInto, unmountAll} from "./support/windowContext.js";
import SequenceCards from "../../core/modules/sequences/web/src/SequenceCards.vue";

const RELEASE = {id: 1, title: "Release", steps: ["Run the suite", "Tag it", "Publish"], triggers: JSON.stringify([{trigger_type: "phrase", text: "ship it"}]), step_guards: "[]", created_at: "2026-11-01T10:00:00Z"};
const REVIEW = {id: 2, title: "Review a plan", steps: ["Read it"], triggers: "[]", step_guards: "[]", created_at: "2026-11-02T10:00:00Z"};
const RUN = {id: 9, sequence_id: 1, session_agent_id: 3, title: "Release", steps: JSON.stringify(RELEASE.steps), step_number: 2, step_started: true};

beforeEach(() => (location.hash = ""));
afterEach(() => {
    unmountAll();
    document.body.innerHTML = "";
});

async function drawn(runs = [RUN]) {
    const ran = [];
    const window = context({}, null, {board: {line: "sequence board", events: ["sequence.*", "sequence_run.*"]}});
    window.read = async () => ({ok: true, value: {rows: [RELEASE, REVIEW], runs}});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(SequenceCards, window);
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
const tab = async (element, key) => {
    element.querySelector(`[data-tab="${key}"]`).click();
    await settle();
};
const type = async (name, text) => {
    const field = document.body.querySelector(`[data-field="${name}"]`);
    field.value = text;
    field.dispatchEvent(new Event(field.tagName === "SELECT" ? "change" : "input", {bubbles: true}));
    await settle();
};
const send = async () => {
    document.body.querySelector("[data-create-send]").click();
    await settle();
};
// the Actions button of the reader opens the menu under it, and an item is chosen by its words
async function chooseAction(element, label) {
    element.querySelector("[data-actions-menu]").click();
    await settle();
    [...document.body.querySelectorAll("[data-menu-item]")].find((item) => item.textContent.includes(label)).click();
    await settle();
    await settle();
}

test("test_reader_tabs: a row has the quiet Running badge, and the reader has the Steps, Runs and Triggers tabs with their counts and bodies", async () => {
    const {element, ran} = await drawn();
    expect(element.querySelector("[data-reader-list]").style.width).toBe("460px");
    expect(texts(rowOf(element, 1), ".list-row-title")).toEqual(["1 Release"]);
    expect(rowOf(element, 1).querySelector("[data-sequence-running]").classList.contains("badge-quiet")).toBe(true);
    expect(rowOf(element, 2).querySelector("[data-sequence-running]")).toBeNull();
    expect(texts(rowOf(element, 1), ".list-row-text")).toEqual(["3 steps · 1 running now"]);
    await choose(element, 1);
    expect(texts(element, "[data-tab]").map((label) => label.replace(/\s+/g, " "))).toEqual(["Steps 3", "Runs 1", "Triggers 1"]);
    expect(texts(element, "[data-step] .step-text")).toEqual(["Run the suite", "Tag it", "Publish"]);
    expect(element.querySelector("[data-run-head]").textContent).toBe("Run 9 · step 2 of 3");
    await tab(element, "runs");
    expect(element.querySelectorAll("[data-run]")).toHaveLength(1);
    element.querySelector("[data-run-abandon]").click();
    await settle();
    await type("why", "The plan changed");
    await send();
    expect(ran).toContainEqual(["sequence", "abandon", "--why", "The plan changed", "--sure"]);
    await tab(element, "triggers");
    expect(element.querySelector("[data-sequence-trigger]").textContent).toBe("When you ask “ship it”");
});

test("test_step_progress: a run shows a bar of the steps done and a quiet badge on each step it has done or is on", async () => {
    const {element} = await drawn();
    await choose(element, 1);
    const bar = element.querySelector("[data-step-progress] [role=progressbar]");
    expect(bar.getAttribute("aria-valuenow")).toBe("1");
    expect(bar.getAttribute("aria-valuemax")).toBe("3");
    expect(element.querySelector("[data-step-progress]").textContent).toContain("1 of 3 done");
    expect([...element.querySelectorAll("[data-step]")].map((step) => step.querySelector("[data-step-state]")?.textContent ?? "")).toEqual(["Done", "In progress", ""]);
    await choose(element, 2);
    expect(element.querySelector("[data-step-progress]")).toBeNull();
    expect(element.querySelector("[data-step-state]")).toBeNull();
});

test("test_new_and_edit_dialogs: New makes a sequence from its title and steps, Edit steps keeps the guards by place, and both run through the dialog", async () => {
    const {element, ran} = await drawn([]);
    element.querySelector("[data-sequence-new]").click();
    await settle();
    expect(document.body.querySelector("[data-create-send]").disabled).toBe(true);
    await type("title", "Shipping");
    typeInto(document.body.querySelector("[data-step-text]"), "Tag it");
    await settle();
    document.body.querySelector("[data-step-add]").click();
    await settle();
    typeInto(document.body.querySelectorAll("[data-step-text]")[1], "Run it");
    await settle();
    expect(document.body.querySelector("[data-command-preview]").textContent).toBe('journal sequence make Shipping --steps "Tag it | Run it"');
    await send();
    expect(ran).toContainEqual(["sequence", "make", "Shipping", "--steps", "Tag it | Run it"]);
    expect(document.body.querySelector("[data-create-dialog]")).toBeNull();
    await choose(element, 1);
    await chooseAction(element, "Edit steps");
    document.body.querySelectorAll("[data-step-remove]")[0].click();
    await settle();
    await send();
    expect(ran).toContainEqual(["sequence", "edit", "1", "--steps", "Tag it", "Publish", "--step-guards", JSON.stringify([{file_edits_allowed: true, allowed_commands: []}, {file_edits_allowed: true, allowed_commands: []}])]);
    await chooseAction(element, "Add trigger");
    await type("kind", "command");
    await type("command:pattern", "^git push");
    await send();
    expect(ran).toContainEqual(["sequence", "edit", "1", "--triggers", JSON.stringify([{trigger_type: "phrase", text: "ship it"}, {trigger_type: "command", pattern: "^git push"}])]);
});

test("test_menu_items: a right click on a sequence has Open, Start, its own actions and Delete, and Start and Delete run their commands", async () => {
    const {element, ran} = await drawn();
    const running = menuEntries(placeUnder(rowOf(element, 1)).items).filter((entry) => !entry.separator);
    expect(running.map((entry) => entry.label)).toEqual(["Open", "Start", "Abandon run 9", "Edit steps", "Add trigger", "Duplicate", "Delete"]);
    expect(running.find((entry) => entry.label === "Start").disabled).toBe(true);
    const idle = menuEntries(placeUnder(rowOf(element, 2)).items).filter((entry) => !entry.separator);
    expect(idle.map((entry) => entry.label)).toEqual(["Open", "Start", "Edit steps", "Add trigger", "Duplicate", "Delete"]);
    const spoken = [];
    const say = (text, undo = null) => spoken.push([text, undo]);
    await idle.find((entry) => entry.label === "Start").run({say});
    await idle.find((entry) => entry.label === "Delete").run({say});
    expect(ran).toContainEqual(["sequence", "run", "2"]);
    expect(ran).toContainEqual(["sequence", "delete", "2"]);
    expect(spoken).toEqual([["Sequence 2 started", null], ["Deleted sequence 2", null]]);
    idle.find((entry) => entry.label === "Open").run();
    await settle();
    expect(element.querySelector("[data-sequence-reader]")).not.toBeNull();
});

test("the list has a search with the State and Trigger chips, and the search keeps the sequences holding the words", async () => {
    const {element} = await drawn();
    expect(element.querySelector("[data-filter-bar]")).not.toBeNull();
    const chips = [...element.querySelectorAll("[data-filter-chip]")].map((chip) => chip.dataset.filterChip);
    expect(chips).toEqual(expect.arrayContaining(["state", "trigger"]));
    typeInto(element.querySelector("[data-filter-bar] input"), "Review");
    await settle();
    expect(element.querySelector('[data-row="1"]')).toBeNull();
    expect(rowOf(element, 2)).not.toBeNull();
});
