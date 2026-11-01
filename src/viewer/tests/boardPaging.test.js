import {afterEach, expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";

afterEach(() => (document.body.innerHTML = ""));

const task = (id, title) => ({id, title, state: "open", priority: "normal"});
const plan = (id, title) => ({id, title, state: "started", task_count: 1, completed_count: 0, phase_count: 1, current_phase: 1, created_at: "2026-11-01T10:00:00Z"});

function reader(answers) {
    const reads = [];
    const window = context({});
    window.read = async (line) => (reads.push(line), answers(line));
    return {window, reads};
}

test("more tasks are asked for older than the oldest shown, without doubles, and a reload reads as many as were shown", async () => {
    let reloaded = false;
    const {window, reads} = reader((line) => {
        if (line.includes("--before-id")) return {ok: true, value: {groups: [{state: "open", total: 3, rows: [task(2, "Two"), task(1, "One")]}]}};
        if (line.includes("--limit")) return (reloaded = true), {ok: true, value: {groups: [{state: "open", total: 2, rows: [task(3, "Three"), task(1, "One")]}]}};
        return {ok: true, value: {groups: [{state: "open", total: 3, rows: [task(3, "Three"), task(2, "Two")]}]}};
    });
    let heard = null;
    window.follow = (patterns, handler) => ((heard = handler), () => {});
    const element = await mounted(TaskGroups, window);
    element.querySelector('[data-more="open"]').click();
    await settle();
    expect(reads).toContain("task board --state open --before-id 2");
    expect(element.textContent.match(/Two/g).length).toBe(1);
    expect(element.textContent).toContain("One");
    await heard();
    await settle();
    expect(reloaded).toBe(true);
    expect(element.textContent).not.toContain("Two");
});

test("a plan answer for the tab left behind is dropped", async () => {
    let answerClosed = null;
    const {window} = reader((line) => {
        if (line.includes("--closed")) return new Promise((resolve) => (answerClosed = () => resolve({ok: true, value: {open_total: 1, closed_total: 1, plans: [plan(2, "Closed plan")]}})));
        return {ok: true, value: {open_total: 1, closed_total: 1, plans: [plan(1, "Open plan")]}};
    });
    const element = await mounted(PlanCards, window);
    element.querySelector('[data-tab="closed"]').click();
    await settle();
    element.querySelector('[data-tab="open"]').click();
    await settle();
    answerClosed();
    await settle();
    expect(element.textContent).toContain("Open plan");
    expect(element.textContent).not.toContain("Closed plan");
});

test("show more on an empty plan list asks for nothing", async () => {
    const reads = [];
    const window = context({});
    window.read = async (line) => (reads.push(line), {ok: true, value: {open_total: 3, closed_total: 0, plans: []}});
    const element = await mounted(PlanCards, window);
    expect(element.querySelector("[data-plans-more]")).toBeNull();
    expect(reads.some((line) => line.includes("Infinity"))).toBe(false);
});
