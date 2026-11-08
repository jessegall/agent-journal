import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {taskSegments} from "../../core/modules/agents/web/src/agentTaskLine.js";
import {context, mounted} from "./support/agentWindowContext.js";

const STARTED = new Date(Date.now() - 2 * 3600000).toISOString();
const worker = (overrides) => ({id: 6, role: "worker", access: "writing", session: "s-6", program: "claude", state: "running", created_at: STARTED, ended_at: null, ...overrides});
const tasksOf = (done, inHand, total) => Array.from({length: total}, (unused, place) => ({id: 100 + place, title: `Task title ${place}`, state: place < done ? "completed" : place === done ? inHand : "open"}));
const card = async (row, facts) => (await mounted({render: () => h(AgentCard, {row, facts: {job_enabled: true, ...facts}})}, context({}))).querySelector("[data-agent-open]");
const tip = (element, selector) => element.querySelector(`${selector} [role='tooltip']`);
const labelOf = (element) => [...element.childNodes].filter((node) => node.nodeType === 3).map((node) => node.textContent).join("").trim();
const kinds = (element) => [...element.querySelectorAll("[data-agent-bar] i")].map((segment) => segment.className);

test("the row says Task and its number, with the title and the done count in the tooltip", async () => {
    const element = await card(worker(), {tasks: tasksOf(10, "started", 20)});
    expect(labelOf(element.querySelector("[data-agent-task]"))).toBe("Task 110");
    expect(tip(element, "[data-agent-task]").querySelector("b").textContent).toBe("Task title 10");
    expect(tip(element, "[data-agent-task]").querySelector("span").textContent).toBe("10 of its 20 tasks done. This one is started.");
    expect(element.querySelector("[data-agent-task]").getAttribute("aria-label")).toBe("Task 110: Task title 10");
});

test("the far right says how many tasks are done, and its tooltip says what is done, in hand, to go and the pace", async () => {
    const element = await card(worker(), {tasks: tasksOf(4, "testing", 6)});
    expect(labelOf(element.querySelector("[data-agent-count]"))).toBe("4 of 6");
    expect(tip(element, "[data-agent-count]").querySelector("b").textContent).toBe("4 done, 1 in hand, 1 to go");
    expect(tip(element, "[data-agent-task]").querySelector("span").textContent).toBe("4 of its 6 tasks done. This one is being tested.");
});

test("the bar has one segment per task: done, the one in hand part full, the rest empty, in the colour of the dot", async () => {
    const element = await card(worker(), {tasks: tasksOf(2, "testing", 4)});
    expect(kinds(element)).toEqual(["done", "done", "now", "todo"]);
    expect(element.querySelector("[data-agent-bar] i.now").style.getPropertyValue("--fill")).toBe("66%");
    expect(element.querySelector("[data-agent-bar]").dataset.state).toBe("running");
    const started = await card(worker(), {tasks: tasksOf(0, "started", 3)});
    expect(started.querySelector("[data-agent-bar] i.now").style.getPropertyValue("--fill")).toBe("33%");
    const blocked = await card(worker(), {tasks: tasksOf(0, "blocked", 3), state: "blocked", blocked_reason: "it waits on task 7340"});
    expect(blocked.querySelector("[data-agent-bar]").dataset.state).toBe("blocked");
    expect(blocked.querySelector("[data-agent-bar] i.now").style.getPropertyValue("--fill")).toBe("33%");
});

test("a retired agent with all its tasks done shows a full bar and says All done", async () => {
    const element = await card(worker({state: "retired", retired_at: STARTED, ended_at: STARTED}), {tasks: tasksOf(2, "completed", 2)});
    expect(labelOf(element.querySelector("[data-agent-count]"))).toBe("2 of 2");
    expect(tip(element, "[data-agent-count]").querySelector("b").textContent).toBe("All 2 tasks done");
    expect(kinds(element)).toEqual(["done", "done"]);
});

test("over thirty tasks the bar is one continuous bar", async () => {
    const bar = taskSegments(tasksOf(15, "started", 40), {id: 115, state: "started"});
    expect(bar.continuous).toBe(true);
    expect(bar.segments).toEqual([]);
    expect(bar.done).toBeCloseTo(37.5);
    expect(bar.now).toBeCloseTo((33 / 100 / 40) * 100);
    const element = await card(worker(), {tasks: tasksOf(15, "started", 40)});
    expect(element.querySelector("[data-agent-bar]").classList.contains("continuous")).toBe(true);
    expect(element.querySelectorAll("[data-agent-bar] i")).toHaveLength(0);
});

test("a helper's line reads Job with its question in the tooltip, and has no count or bar", async () => {
    const element = await card({id: 7, role: "helper", access: "read-only", session: "s-7", program: "claude", state: "running", ended_at: null, created_at: STARTED}, {tasks: [], helper_job: "How does the phone app read the chat?"});
    expect(labelOf(element.querySelector("[data-agent-job]"))).toBe("Job");
    expect(tip(element, "[data-agent-job]").textContent).toBe("How does the phone app read the chat?");
    expect(element.querySelector("[data-agent-count]")).toBeNull();
    expect(element.querySelector("[data-agent-bar]")).toBeNull();
});

test("a row has no plan link, no Waiting or Blocked words and no pace", async () => {
    const element = await card(worker(), {tasks: tasksOf(1, "started", 3).map((task) => ({...task, plan_id: 7})), work_status: "tests running", state: "blocked", blocked_reason: "x"});
    expect(element.querySelector("[data-agent-plan]")).toBeNull();
    expect(element.querySelector("[data-agent-work-status]")).toBeNull();
    expect(element.querySelector("[data-agent-list-pace]")).toBeNull();
    expect(element.querySelector("[data-agent-title]")).not.toBeNull();
    expect(element.querySelector("[data-agent-identity]")).not.toBeNull();
});
