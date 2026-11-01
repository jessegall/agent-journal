import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {barFacts} from "../src/domain/barFacts.js";
import AgentBar from "../src/shell/AgentBar.vue";
import InformationBar from "../src/shell/InformationBar.vue";

const mounted = (component, props) => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(component, props)).mount(element);
    return element;
};
const MAIN = {id: 1, role: "main", program: "claude", session: "s", process_started_at: null, ended_at: null};

test("the bars' counts: helpers still running, tasks not done, questions waiting", () => {
    const facts = barFacts({
        agents: [MAIN, {role: "worker", ended_at: null}, {role: "worker", ended_at: "2026-01-01"}],
        tasks: [{state: "open"}, {state: "started"}, {state: "completed"}, {state: "cancelled"}, {state: "blocked"}],
        questions: [{state: "open"}, {state: "answered"}],
    });
    expect(facts).toEqual({helpers: 1, tasks: 3, waiting: 1});
});

test("the information bar shows the program, the state, the uptime and each count, each asking to open what it counts", () => {
    const opened = [];
    const element = mounted(InformationBar, {agent: MAIN, facts: {helpers: 2, tasks: 5, waiting: 1}, onOpen: (name) => opened.push(name)});
    expect(element.textContent).toContain("claude");
    expect(element.textContent).toContain("Working");
    for (const key of ["tasks", "waiting", "helpers"]) element.querySelector(`[data-count="${key}"]`).click();
    expect(opened).toEqual(["tasks", "waiting", "helpers"]);
    expect(element.querySelector(`[data-count="tasks"]`).textContent).toContain("5");
});

test("the agent bar shows its state and a helpers button asking to open the helpers", () => {
    const opened = [];
    const element = mounted(AgentBar, {agent: MAIN, helpers: 1, onOpen: (name) => opened.push(name)});
    expect(element.querySelector("[data-helpers]").textContent.trim()).toBe("1 helper");
    element.querySelector("[data-helpers]").click();
    expect(opened).toEqual(["helpers"]);
    expect(element.textContent).toContain("Working");
});

test("the bars read the journal again every few seconds, so they follow the state as it changes", async () => {
    const {readFileSync} = await import("node:fs");
    const {resolve} = await import("node:path");
    const stage = readFileSync(resolve(__dirname, "../src/windows/PaneStage.vue"), "utf8");
    expect(stage).toMatch(/setInterval\(\(\) => \(readAgent\(\), readFacts\(\)\), FACT_SECONDS \* 1000\)/);
});

test("the agent bar names the task the agent is working in, and nothing when it has none", () => {
    const working = mounted(AgentBar, {agent: MAIN, task: {id: 5383, title: "Port the file pages"}});
    expect(working.querySelector("[data-agent-task]").textContent).toBe("Task 5383: Port the file pages");
    expect(mounted(AgentBar, {agent: MAIN, task: null}).querySelector("[data-agent-task]")).toBeNull();
});

test("the information bar shows the auto switch, on or off, and asks to toggle it", () => {
    const toggled = [];
    const on = mounted(InformationBar, {agent: MAIN, auto: true, onToggleAuto: () => toggled.push("toggle")});
    expect(on.querySelector("[data-auto-toggle]").textContent.trim()).toBe("Auto on");
    on.querySelector("[data-auto-toggle]").click();
    expect(toggled).toEqual(["toggle"]);
    expect(mounted(InformationBar, {agent: MAIN, auto: false}).querySelector("[data-auto-toggle]").textContent.trim()).toBe("Auto off");
});
