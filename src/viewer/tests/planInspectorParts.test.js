import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import PlanInspector from "../src/resource/PlanInspector.vue";
import PlanLinks from "../src/resource/PlanLinks.vue";
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

test("the inspector tags a task a worker holds and switches to the timeline", async () => {
    const lines = [];
    const plan = {id: 3, title: "Cart", state: "started", total: 1, finished: 0, current_phase: 1, phases: [{id: 1, title: "Build", goal: "", checkpoint: false, tasks: [{id: 7, title: "Cart", state: "started", helper_id: 44, helper_name: "Grace Hopper"}, {id: 8, title: "Tax", state: "open", helper_id: null, helper_name: null}]}], delegated: true, agents: [{id: 44, name: "Grace Hopper", task_id: 7, task_title: "Cart"}]};
    const read = async (line) => {
        lines.push(line[1]);
        return line[1] === "inspect" ? {ok: true, value: plan} : line[1] === "timeline" ? {ok: true, value: {events: [event("made", 7)]}} : {ok: true, value: {rows: []}};
    };
    const element = document.createElement("div");
    createApp({render: () => h(PlanInspector, {id: 3, read})}).directive("tip", {}).mount(element);
    await settle();
    const actions = element.querySelector("[data-plan-inspector] > [data-inspector-actions]");
    expect(actions.previousElementSibling.classList.contains("top")).toBe(true);
    expect(actions.querySelector("[data-move]")).not.toBeNull();
    expect(element.querySelectorAll("[data-plan-agent]").length).toBe(1);
    expect(element.querySelector("[data-plan-agent]").textContent).toBe("Grace Hopper");
    [...element.querySelectorAll("button")].find((button) => button.textContent.trim() === "Timeline").click();
    await settle();
    expect(lines).toContain("timeline");
    expect(element.querySelector("[data-plan-timeline]")).not.toBeNull();
});

test("the links to a plan list the design document first and open a row as its table and number", async () => {
    const opened = [];
    const counterparts = [
        {endpoint: {model: "report", id: 4, title: "Review", exists: true, unavailable: false, open_ref: "reports:4"}, relations: ["about"], link_ids: [1]},
        {endpoint: {model: "doc", id: 9, title: "Rebuild design", exists: true, unavailable: false, open_ref: "docs:9"}, relations: ["about"], link_ids: [2]},
    ];
    const read = async () => ({ok: true, value: {rows: [], counterparts, total: 2}});
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

const delegatedPlan = () => ({
    id: 3, title: "Rebuild the cart", brief: "", state: "started", reason: "", total: 3, finished: 0, current_phase: 1, document_id: 0,
    delegated: true,
    agents: [{id: 12, name: "Lady Lovelace", task_id: 1, task_title: "Cart"}, {id: 12, name: "Lady Lovelace", task_id: 2, task_title: "Tax"}],
    phases: [{id: 1, title: "Build", goal: "", checkpoint: false, tasks: [
        {id: 1, title: "Cart", state: "started", helper_id: 12, helper_name: "Lady Lovelace"},
        {id: 2, title: "Tax", state: "open", helper_id: 12, helper_name: "Lady Lovelace"},
        {id: 3, title: "Totals", state: "open", helper_id: null, helper_name: null},
    ]}],
});

test("a delegated plan names its agent on the plan, under its phase and on each task it holds or has queued", async () => {
    const element = await drawn(PlanInspector, {ok: true, value: delegatedPlan()});
    expect(element.querySelector("[data-plan-delegated]").textContent).toBe("Worker: Lady Lovelace");
    expect(element.querySelector("[data-plan-phase-agent]").textContent).toContain("Lady Lovelace");
    expect(element.querySelector("[data-plan-phase-agent]").textContent).toContain("Working");
    expect([...element.querySelectorAll("[data-plan-agent]")].map((agent) => agent.textContent)).toEqual(["Lady Lovelace", "Lady Lovelace"]);
    expect(element.textContent).not.toContain("Agent 12");
});

test("a plan with two agents is only Delegated, and a plan nobody works for shows neither line", async () => {
    const two = delegatedPlan();
    two.agents.push({id: 13, name: "Grace Hopper", task_id: 3, task_title: "Totals"});
    expect((await drawn(PlanInspector, {ok: true, value: two})).querySelector("[data-plan-delegated]").textContent).toBe("Delegated");
    const none = {...delegatedPlan(), delegated: false, agents: []};
    none.phases[0].tasks.forEach((task) => Object.assign(task, {helper_id: null, helper_name: null}));
    const element = await drawn(PlanInspector, {ok: true, value: none});
    expect(element.querySelector("[data-plan-delegated]")).toBeNull();
    expect(element.querySelector("[data-plan-phase-agents]")).toBeNull();
});

test("a phase whose tasks are all closed shows no agent tag, though each task still names its agent", async () => {
    const plan = delegatedPlan();
    plan.phases[0].tasks.forEach((task) => Object.assign(task, {state: "completed"}));
    const element = await drawn(PlanInspector, {ok: true, value: plan});
    expect(element.querySelector("[data-plan-phase-agents]")).toBeNull();
    expect(element.querySelectorAll("[data-plan-agent]").length).toBe(2);
});

test("the plan has detail and comment tabs, and comment controls return to the details", async () => {
    const element = await drawn(PlanInspector, {ok: true, value: delegatedPlan()});
    const tab = (name) => [...element.querySelectorAll("[data-plan-tabs] button")].find((button) => button.textContent.trim() === name);
    expect(element.querySelector(".summary [data-resource-title]").textContent).toBe("Rebuild the cart");
    expect(tab("Details")).toBeDefined();
    tab("Comments").click();
    await nextTick();
    expect(element.querySelector("[data-comment-side]").textContent).toContain("No comments yet");
    expect(element.querySelector("[data-resource-phase]")).toBeNull();
    element.querySelector('[aria-label="Close the comments"]').click();
    await nextTick();
    expect(element.querySelector("[data-resource-phase]")).not.toBeNull();
});

test("all task states in the plan use the tasks window's status icons", async () => {
    const plan = delegatedPlan();
    plan.phases[0].tasks = ["open", "started", "testing", "blocked", "completed", "cancelled"].map((state, id) => ({id, title: state, state}));
    const element = await drawn(PlanInspector, {ok: true, value: plan});
    expect([...element.querySelectorAll("[data-resource-task] .ring")].map((icon) => icon.getAttribute("class"))).toEqual(["ring open", "ring started", "ring testing", "ring blocked", "ring done", "ring done"]);
    expect(element.querySelector('[data-resource-task].cancelled .ring').getAttribute("aria-label")).toBe("Cancelled");
});

test("sending another comment from the details returns to the comments again", async () => {
    const comments = [];
    const read = async (line) => {
        if (line[1] === "inspect") return {ok: true, value: delegatedPlan()};
        if (line[1] === "comment") comments.push({id: comments.length + 1, text: line[3]});
        return {ok: true, value: {rows: line[1] === "comments" ? comments : []}};
    };
    const element = await drawn(PlanInspector, null, {read, environment: "main"});
    for (const text of ["Check the cart", "Check the tax too"]) {
        [...element.querySelectorAll("[data-plan-tabs] button")].find((button) => button.textContent.trim() === "Details").click();
        await nextTick();
        element.querySelector(".comment-bar-open").click();
        await nextTick();
        const input = element.querySelector("textarea");
        input.value = text;
        input.dispatchEvent(new Event("input"));
        await nextTick();
        element.querySelector("form.compose").dispatchEvent(new Event("submit", {cancelable: true}));
        await settle();
        expect(element.querySelector("[data-comment-side]").textContent).toContain(text);
    }
});
