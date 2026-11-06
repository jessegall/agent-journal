import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import PlanRounds from "../../core/modules/plan_reviews/web/src/PlanRounds.vue";
import SubjectReviews from "../../core/modules/reviews/web/src/SubjectReviews.vue";
import {AllowancePrompts} from "../src/windows/allowancePrompts.js";
import InspectorSections from "../src/windows/InspectorSections.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {INSPECTOR_HOST} from "../src/windows/windowContext.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {context, settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const window = (name, place, slots = []) => ({name, module: "acme.notes", title: name, entry_url: "", line: "", loading: "component", place, slots, reads: [], runs: [], events: [], allowed: true, skeleton: [], options: []});
const offers = (...windows) => async () => ({windows});

async function loaded(...windows) {
    const catalogue = new WindowCatalogue(offers(...windows));
    await catalogue.load();
    return catalogue;
}

function mounted(component, provided, props = {}) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(component, props)});
    for (const [key, value] of provided) app.provide(key, value);
    app.mount(element);
    return element;
}

function drawnWindow(component, answers, row = {id: 3}) {
    const keys = component === PlanRounds ? {"rounds.*": {line: "plan rounds {id}", loading: "requested"}} : undefined;
    const shown = {...context(answers, null, keys), option: () => ({value: row})};
    return mounted(component, [[WINDOW_CONTEXT, shown]]);
}

test("a section is kept apart from the windows a pane offers and found at its slots", async () => {
    const catalogue = await loaded(window("notes.board", "pane"), window("notes.part", "section", ["inspector.plan", "inspector.task"]));
    expect(catalogue.windows.value.map((entry) => entry.name)).toEqual(["notes.board"]);
    expect(catalogue.sectionsAt("inspector.plan").map((entry) => entry.name)).toEqual(["notes.part"]);
    expect(catalogue.sectionsAt("inspector.task").map((entry) => entry.name)).toEqual(["notes.part"]);
    expect(catalogue.sectionsAt("inspector.doc")).toEqual([]);
    expect(catalogue.window("notes.part").name).toBe("notes.part");
});

test("a section whose module is removed leaves when the registry syncs", async () => {
    const answers = [{windows: [window("notes.part", "section", ["inspector.plan"])]}, {windows: []}];
    const catalogue = new WindowCatalogue(async () => answers.shift());
    await catalogue.load();
    expect(catalogue.sectionsAt("inspector.plan").length).toBe(1);
    await catalogue.heard({event: "registry.sync"});
    expect(catalogue.sectionsAt("inspector.plan")).toEqual([]);
});

test("an inspector draws no section on a page that gives it no host", async () => {
    const element = mounted(InspectorSections, [], {slotName: "inspector.plan", row: {id: 1}});
    await settle();
    expect(element.querySelector("[data-section]")).toBeNull();
});

test("an inspector draws each section of its slot only, in the order listed", async () => {
    const catalogue = await loaded(window("notes.first", "section", ["inspector.plan"]), window("notes.other", "section", ["inspector.task"]), window("notes.second", "section", ["inspector.plan"]));
    const host = {catalogue, subscriptions: new WindowSubscriptions(), environment: "main", prompts: null, shellRead: null};
    const element = mounted(InspectorSections, [[INSPECTOR_HOST, host]], {slotName: "inspector.plan", row: {id: 1}});
    await settle();
    expect([...element.querySelectorAll("[data-section]")].map((part) => part.dataset.section)).toEqual(["notes.first", "notes.second"]);
});

test("windows that ask at once are asked one after another, and each answer reaches its own window", async () => {
    const prompts = new AllowancePrompts(async () => ({ok: true}));
    const first = prompts.prompt({window: "notes.first"});
    const second = prompts.prompt({window: "notes.second"});
    expect(prompts.current.value.window).toBe("notes.first");
    prompts.answer(true);
    expect(await first).toBe(true);
    expect(prompts.current.value.window).toBe("notes.second");
    prompts.answer(false);
    expect(await second).toBe(false);
    expect(prompts.current.value).toBeNull();
});

const round = (number, report) => ({number, started_at: "2026-11-01T10:00:00Z", ended_at: report ? "2026-11-01T11:00:00Z" : null, asked_by: 1,
                                    reviewers: [{agent_id: 7, name: "Grace Hopper"}, {agent_id: 8, name: "Ada Lovelace"}], reports: report ? [{id: report, filed_by: "Grace Hopper"}] : []});

test("two rounds show as 2, newest first, each with when, who read it and its report", async () => {
    const element = drawnWindow(PlanRounds, {"plan rounds 3": {ok: true, value: {rows: [round(1, 41), round(2, 42)]}}});
    await settle();
    expect(element.querySelector("h4").textContent).toBe("Review rounds: 2");
    const rows = [...element.querySelectorAll("[data-plan-round]")];
    expect(rows.map((row) => row.querySelector(".number, span").textContent)).toEqual(["Round 2", "Round 1"]);
    expect(rows[0].querySelector("button").textContent).toBe("Report 42");
    expect(rows[0].querySelector("button").title).toBe("Filed by Grace Hopper");
    expect(rows[0].querySelector("[data-time-ago]")).not.toBeNull();
    expect(rows[0].querySelector("[data-plan-round-reviewers]").textContent).toBe("2 reviewers");
    expect(rows[0].querySelector("[data-plan-round-reviewers]").title).toBe("Grace Hopper, Ada Lovelace");
    expect(rows[0].textContent).not.toContain("Running");
});

test("a round with no end says it is running", async () => {
    const element = drawnWindow(PlanRounds, {"plan rounds 3": {ok: true, value: {rows: [round(1, 0)]}}});
    await settle();
    expect(element.querySelector("[data-plan-round]").textContent).toContain("Running");
});

test("a plan with no rounds draws nothing, and a failed read draws the failure", async () => {
    const none = drawnWindow(PlanRounds, {"plan rounds 3": {ok: true, value: {rows: []}}});
    const failing = drawnWindow(PlanRounds, {"plan rounds 3": {ok: false, failure: "refused", error: "no plan 3"}});
    await settle();
    expect(none.querySelector("section")).toBeNull();
    expect(failing.querySelector("[role=alert]").textContent).toBe("no plan 3");
});

test("the reviews section lists a plan's reviews only, with their reports, and draws nothing without any", async () => {
    const rows = [{id: 1, subject_model: "plan", state: "reported", report: "Phase two is too large"}, {id: 2, subject_model: "task", state: "queued", report: ""}];
    const element = drawnWindow(SubjectReviews, {"review list --subject 3": {ok: true, value: {rows}}});
    const none = drawnWindow(SubjectReviews, {"review list --subject 3": {ok: true, value: {rows: []}}});
    await settle();
    expect(element.querySelectorAll("[data-plan-review]").length).toBe(1);
    expect(element.textContent).toContain("Phase two is too large");
    expect(none.querySelector("[data-plan-review]")).toBeNull();
});
