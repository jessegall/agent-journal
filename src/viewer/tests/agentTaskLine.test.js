import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {taskLine} from "../../core/modules/agents/web/src/agentTaskLine.js";
import {context, mounted} from "./support/agentWindowContext.js";

const STARTED = new Date(Date.now() - 2 * 3600000).toISOString();
const worker = (overrides) => ({id: 6, role: "worker", access: "writing", session: "s-6", program: "claude", state: "running", created_at: STARTED, ended_at: null, ...overrides});
const tasksOf = (done, inHand, total) => Array.from({length: total}, (unused, place) => ({id: 100 + place, title: `Task title ${place}`, state: place < done ? "completed" : place === done ? inHand : "open"}));
const card = async (row, facts) => (await mounted({render: () => h(AgentCard, {row, facts: {job_enabled: true, ...facts}})}, context({}))).querySelector("[data-agent-open]");
const tip = (element, selector) => element.querySelector(`${selector} [role='tooltip']`);
const labelOf = (element) => [...element.childNodes].filter((node) => node.nodeType === 3).map((node) => node.textContent).join("").trim();
const widths = (element) => [element.querySelector("[data-task-bar-done]").style.width, element.querySelector("[data-task-bar-testing]").style.width];

test("the row says Task and its number, with the title and the done count in the tooltip", async () => {
    const element = await card(worker(), {tasks: tasksOf(10, "started", 20)});
    expect(labelOf(element.querySelector("[data-agent-task]"))).toBe("Task 110");
    expect(tip(element, "[data-agent-task]").querySelector("b").textContent).toBe("Task title 10");
    expect(tip(element, "[data-agent-task]").querySelector("span").textContent).toBe("10 of its 20 tasks done. This one is started.");
    expect(element.querySelector("[data-agent-task]").getAttribute("aria-label")).toBe("Task 110: Task title 10");
});

test("a worker with two started tasks shows the number of each, with its title in the tooltip, and counts both as in hand", async () => {
    const tasks = [{id: 110, title: "Add the tax", state: "started"}, {id: 111, title: "Print the receipt", state: "started"}, {id: 112, title: "Send it", state: "open"}];
    const element = await card(worker(), {tasks});
    const numbers = [...element.querySelectorAll("[data-agent-task]")];
    expect(element.querySelector("[data-agent-tasks]").textContent.replace(/\s+/g, " ")).toContain("Tasks 110");
    expect(numbers.map(labelOf)).toEqual(["110", "111"]);
    expect(numbers.map((number) => number.getAttribute("aria-label"))).toEqual(["Task 110: Add the tax", "Task 111: Print the receipt"]);
    expect(tip(element, "[data-agent-count]").querySelector("b").textContent).toBe("0 done, 2 in hand, 1 to go");
});

test("the far right says how many tasks are done, and its tooltip says what is done, in hand, to go and the pace", async () => {
    const element = await card(worker(), {tasks: tasksOf(4, "testing", 6)});
    expect(labelOf(element.querySelector("[data-agent-count]"))).toBe("4 of 6");
    expect(tip(element, "[data-agent-count]").querySelector("b").textContent).toBe("4 done, 1 in hand, 1 to go");
    expect(tip(element, "[data-agent-task]").querySelector("span").textContent).toBe("4 of its 6 tasks done. This one is being tested.");
});

test("above the bar the row shows the hourly rate as a rounded number", async () => {
    const tasks = tasksOf(4, "started", 6);
    expect(taskLine({tasks, inHand: tasks[4], perHour: 3.6}).rate).toBe("4/hour");
    expect(taskLine({tasks, inHand: tasks[4], perHour: 0}).rate).toBe("");
    const element = await card(worker(), {tasks});
    expect(element.querySelector("[data-agent-rate]").textContent).toMatch(/^\d+\/hour$/);
});

test("the bar draws the finished tasks, then those in testing, out of all the tasks given", async () => {
    const tasks = [{id: 1, state: "completed"}, {id: 2, state: "completed"}, {id: 3, state: "testing"}, {id: 4, state: "open"}, {id: 5, state: "started"}];
    const element = await card(worker(), {tasks});
    expect(widths(element)).toEqual(["40%", "20%"]);
    expect(labelOf(element.querySelector("[data-agent-count]"))).toBe("2 of 5");
});

test("a task in testing never counts as finished and a cancelled task is not given", () => {
    const tasks = [{id: 1, state: "testing"}, {id: 2, state: "testing"}, {id: 3, state: "open"}, {id: 4, state: "cancelled"}];
    expect(taskLine({tasks, inHand: {id: 1, state: "testing"}, perHour: 0}).bar).toEqual({total: 3, done: 0, testing: 2});
});

test("a retired agent with all its tasks done shows a full bar and says All done", async () => {
    const element = await card(worker({state: "retired", retired_at: STARTED, ended_at: STARTED}), {tasks: tasksOf(2, "completed", 2)});
    expect(labelOf(element.querySelector("[data-agent-count]"))).toBe("2 of 2");
    expect(tip(element, "[data-agent-count]").querySelector("b").textContent).toBe("All 2 tasks done");
    expect(widths(element)).toEqual(["100%", "0%"]);
});

test("a helper's line names its job by the first words of its question, with the question in the tooltip, and has no count or bar", async () => {
    const element = await card({id: 7, role: "helper", access: "read-only", session: "s-7", program: "claude", state: "running", ended_at: null, created_at: STARTED}, {tasks: [], helper_job: "How does the phone app read the chat?"});
    expect(labelOf(element.querySelector("[data-agent-job]"))).toBe("How does the phone app");
    expect(tip(element, "[data-agent-job]").textContent).toBe("How does the phone app read the chat?");
    expect(element.querySelector("[data-agent-count]")).toBeNull();
    expect(element.querySelector("[data-agent-bar]")).toBeNull();
});

test("a row has no Waiting or Blocked words and no pace", async () => {
    const element = await card(worker(), {tasks: tasksOf(1, "started", 3), work_status: "tests running", state: "blocked", blocked_reason: "x"});
    expect(element.querySelector("[data-agent-work-status]")).toBeNull();
    expect(element.querySelector("[data-agent-list-pace]")).toBeNull();
    expect(element.querySelector("[data-agent-title]")).not.toBeNull();
    expect(element.querySelector("[data-agent-identity]")).not.toBeNull();
});

test("after the task the row says Plan and its number, with no title, when the task is in a plan", async () => {
    const element = await card(worker(), {tasks: tasksOf(1, "started", 3).map((task) => ({...task, plan_id: 7, plan_title: "Plan title seven"}))});
    expect(element.querySelector("[data-agent-plan]").textContent).toBe("Plan 7");
    expect(element.querySelector("[data-agent-task]").nextElementSibling).toBe(element.querySelector("[data-agent-plan]"));
});

test("a task in no plan shows no plan after it", async () => {
    const element = await card(worker(), {tasks: tasksOf(1, "started", 3).map((task) => ({...task, plan_id: null, plan_title: null}))});
    expect(element.querySelector("[data-agent-plan]")).toBeNull();
});

test("the count and the bar draw the tasks the card was given for its current round, never those of an earlier merged round", async () => {
    const currentRound = [{id: 4, title: "Fourth", state: "completed"}, {id: 5, title: "Fifth", state: "started"}, {id: 6, title: "Sixth", state: "open"}];
    const element = await card(worker(), {tasks: currentRound});
    expect(labelOf(element.querySelector("[data-agent-count]"))).toBe("1 of 3");
    expect(element.querySelector("[data-task-bar-done]").style.width).toBe("33%");
});

test("a worker with more than three started tasks shows one Tasks count and lists each task in its tooltip", async () => {
    const tasks = Array.from({length: 10}, (unused, place) => ({id: 200 + place, title: `Started title ${place}`, state: "started"}));
    const element = await card(worker(), {tasks});
    const count = element.querySelector("[data-agent-task-count]");
    expect(count.textContent).toContain("Tasks: 10");
    expect(element.querySelectorAll("[data-agent-task]")).toHaveLength(0);
    const listed = [...count.querySelectorAll("[data-agent-task-listed]")].map((line) => line.textContent);
    expect(listed).toHaveLength(10);
    expect(listed[0]).toBe("200 Started title 0");
});

test("a worker with three started tasks lists all three as before and shows no count", async () => {
    const tasks = [200, 201, 202].map((id) => ({id, title: `Title ${id}`, state: "started"}));
    const element = await card(worker(), {tasks});
    expect(element.querySelectorAll("[data-agent-task]")).toHaveLength(3);
    expect(element.querySelector("[data-agent-task-count]")).toBeNull();
});
