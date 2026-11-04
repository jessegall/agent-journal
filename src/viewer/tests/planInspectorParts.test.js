import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import PlanInspector from "../src/resource/PlanInspector.vue";
import PlanLinks from "../src/resource/PlanLinks.vue";
import PlanReviews from "../src/resource/PlanReviews.vue";
import PlanTimeline from "../src/resource/PlanTimeline.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));
globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};

async function drawn(component, answer, props = {}) {
    const element = document.createElement("div");
    createApp({render: () => h(component, {id: 3, read: async () => answer, ...props})}).mount(element);
    await settle();
    return element;
}

const event = (event_type, task_id, text = "") => ({time: "2026-11-01T10:00:00Z", event_type, task_id, title: `Task ${task_id}`, text});

test("the timeline shows each moment with its word, opens the task, and says what it wrote", async () => {
    const picked = [];
    const element = await drawn(PlanTimeline, {ok: true, value: {events: [event("completed", 7, "It works"), event("made", 7)]}}, {onSelect: (id) => picked.push(id)});
    const rows = element.querySelectorAll("[data-plan-event]");
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain("Finished");
    expect(rows[0].textContent).toContain("It works");
    rows[0].querySelector("button").click();
    expect(picked).toEqual([7]);
});

test("a plan with no moments says so, and a refused read says why", async () => {
    expect((await drawn(PlanTimeline, {ok: true, value: {events: []}})).textContent).toContain("Nothing has happened");
    expect((await drawn(PlanTimeline, {ok: false, error: "no such plan"})).textContent).toContain("no such plan");
});

test("review rounds show the plan's reviews only, with their reports", async () => {
    const rows = [{id: 1, subject_model: "plan", state: "reported", report: "Phase two is too large"}, {id: 2, subject_model: "task", state: "queued", report: ""}];
    const element = await drawn(PlanReviews, {ok: true, value: {rows}});
    expect(element.querySelectorAll("[data-plan-review]").length).toBe(1);
    expect(element.textContent).toContain("Round 1");
    expect(element.textContent).toContain("Phase two is too large");
});

test("a plan with no reviews shows no rounds", async () => {
    expect((await drawn(PlanReviews, {ok: true, value: {rows: []}})).querySelector("[data-plan-reviews]")).toBeNull();
});

test("the inspector tags a task a worker holds and switches to the timeline", async () => {
    const lines = [];
    const plan = {id: 3, title: "Cart", state: "started", total: 1, finished: 0, current_phase: 1, phases: [{id: 1, title: "Build", goal: "", checkpoint: false, tasks: [{id: 7, title: "Cart", state: "started", helper_id: 44}, {id: 8, title: "Tax", state: "open", helper_id: null}]}]};
    const read = async (line) => {
        lines.push(line[1]);
        return line[1] === "inspect" ? {ok: true, value: plan} : line[1] === "timeline" ? {ok: true, value: {events: [event("made", 7)]}} : {ok: true, value: {rows: []}};
    };
    const element = document.createElement("div");
    createApp({render: () => h(PlanInspector, {id: 3, read})}).directive("tip", {}).mount(element);
    await settle();
    expect(element.querySelectorAll("[data-plan-agent]").length).toBe(1);
    expect(element.querySelector("[data-plan-agent]").textContent).toBe("Agent 44");
    [...element.querySelectorAll("button")].find((button) => button.textContent.trim() === "Timeline").click();
    await settle();
    expect(lines).toContain("timeline");
    expect(element.querySelector("[data-plan-timeline]")).not.toBeNull();
});

test("the links to a plan list the design document first and open a row as its table and number", async () => {
    const opened = [];
    const incoming = [{source_model: "report", source_id: 4, source_title: "Review", link_type: "about"}, {source_model: "doc", source_id: 9, source_title: "Rebuild design", link_type: "about"}];
    const read = async (line) => ({ok: true, value: {rows: line[2] === "--target" ? incoming : []}});
    const element = await drawn(PlanLinks, null, {read, documentId: 9, onOpen: (row) => opened.push(row)});
    const rows = element.querySelectorAll("[data-plan-link]");
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain("Design document 9");
    expect(rows[0].textContent).toContain("Rebuild design");
    rows[1].click();
    expect(opened).toEqual([{table: "reports", id: 4}]);
});

test("a plan nothing links to shows no links", async () => {
    expect((await drawn(PlanLinks, {ok: true, value: {rows: []}})).querySelector("[data-plan-links]")).toBeNull();
});
