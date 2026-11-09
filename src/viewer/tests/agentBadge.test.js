import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import AgentBadge from "../src/kit/AgentBadge.vue";
import PlanDetails from "../src/resource/PlanDetails.vue";
import PlanPhaseAgents from "../src/resource/PlanPhaseAgents.vue";
import TaskFacts from "../src/tasks/TaskFacts.vue";
import PlanAgents from "../../core/modules/plans/web/src/PlanAgents.vue";

afterEach(() => (document.body.innerHTML = ""));

const drawn = (component, props) => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(component, props)}).directive("tip", {}).mount(element);
    return element;
};
const MAIN = {id: 78, name: "Agent 78", main: true};
const WORKER = {id: 12, name: "Grace Hopper", main: false};
const nameOf = (element) => element.querySelector("[data-agent-badge-name]").textContent;

test("a main agent's badge reads main agent in purple, with no agent word and no number", () => {
    const badge = drawn(AgentBadge, {name: MAIN.name, main: true}).querySelector("[data-agent-badge]");
    expect(badge.textContent.trim()).toBe("main agent");
    expect(badge.textContent).not.toContain("78");
    expect(badge.classList.contains("main")).toBe(true);
    expect(badge.querySelector("[data-agent-main-icon]")).not.toBeNull();
});

test("any other agent's badge reads its name, without the main look", () => {
    const badge = drawn(AgentBadge, {name: WORKER.name, main: false}).querySelector("[data-agent-badge]");
    expect(badge.textContent.trim()).toBe("Grace Hopper");
    expect(badge.classList.contains("main")).toBe(false);
    expect(badge.querySelector("[data-agent-main-icon]")).toBeNull();
});

test("a plan card shows the main agent through the shared badge", () => {
    const element = drawn(PlanAgents, {planId: 1105, agents: [MAIN]});
    expect(nameOf(element)).toBe("main agent");
    expect(element.querySelector("[data-plan-agent]").hasAttribute("data-agent-tip")).toBe(true);
    expect(element.querySelector("[data-agent-main]")).not.toBeNull();
});

test("a plan inspector shows its assignee and its one delegated agent through the shared badge", () => {
    const plan = {id: 3, state: "started", total: 0, phases: [], delegated: true, assignee: {id: 78, name: "main", main: true}, agents: [MAIN]};
    expect(nameOf(drawn(PlanDetails, {plan}).querySelector("[data-plan-assignee]"))).toBe("main agent");
    const delegated = drawn(PlanDetails, {plan: {...plan, assignee: null, agents: [WORKER]}}).querySelector("[data-plan-delegated]");
    expect(nameOf(delegated)).toBe("Grace Hopper");
    expect(drawn(PlanDetails, {plan: {...plan, assignee: null, agents: [MAIN, WORKER]}}).querySelector("[data-plan-delegated]").textContent.trim()).toBe("Delegated");
});

test("a phase lists its agents through the shared badge", () => {
    const tasks = [{id: 1, state: "started", helper_id: 78, helper_name: "Agent 78", helper_main: true}, {id: 2, state: "open", helper_id: 12, helper_name: "Grace Hopper", helper_main: false}];
    const element = drawn(PlanPhaseAgents, {tasks});
    expect([...element.querySelectorAll("[data-plan-phase-agent] [data-agent-badge-name]")].map((name) => name.textContent)).toEqual(["main agent", "Grace Hopper"]);
    expect(element.querySelectorAll("[data-agent-main]")).toHaveLength(1);
});

test("a task's facts show the agent holding it through the shared badge", () => {
    const element = drawn(TaskFacts, {task: {id: 7, state: "started", priority: 200, holder_id: 78, helper_id: 78, helper_name: "Agent 78", helper_main: true}});
    expect(nameOf(element.querySelector("[data-task-agent]"))).toBe("main agent");
    expect(element.querySelector("[data-task-held-by]").textContent).toContain("main agent holds it");
    expect(element.querySelector("[data-task-held-by] [data-agent-main]")).not.toBeNull();
});
