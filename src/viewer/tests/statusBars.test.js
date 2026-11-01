import {createApp, h} from "vue";
import {expect, test} from "vitest";
import AgentBar from "../src/shell/AgentBar.vue";
import InformationBar from "../src/shell/InformationBar.vue";

const mounted = (component, props) => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(component, props)).mount(element);
    return element;
};
const MAIN = {id: 1, role: "main", program: "claude", session: "s", process_started_at: null, ended_at: null};

test("the information bar shows the program, the state, the uptime and each count, each asking to open what it counts", () => {
    const opened = [];
    const element = mounted(InformationBar, {agent: MAIN, facts: {helpers: 2, tasks: 5, waiting: 1}, onOpen: (name) => opened.push(name)});
    expect(element.textContent).toContain("Claude");
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

test("the agent bar says nothing until it knows, then No agent when there is none", () => {
    expect(mounted(AgentBar, {agent: null, loading: true}).textContent).not.toContain("No agent");
    expect(mounted(AgentBar, {agent: null}).textContent).toContain("No agent");
});

test("the top bar holds the breadcrumb, the activity and the full screen buttons, the second the status and the mode bar, and the third the facts and the view controls", async () => {
    const {readFileSync} = await import("node:fs");
    const {resolve} = await import("node:path");
    const stage = readFileSync(resolve(__dirname, "../src/windows/PaneStage.vue"), "utf8");
    expect(stage).toMatch(/<Breadcrumb[^>]*>[\s\S]*data-top-search[\s\S]*data-top-bell[\s\S]*data-activity-toggle[\s\S]*data-fullscreen[\s\S]*<\/Breadcrumb>/);
    expect(stage).toMatch(/<AgentBar[^>]*>[\s\S]*catalogue\.bars[\s\S]*<\/AgentBar>/);
    expect(stage).toMatch(/<InformationBar[^>]*>[\s\S]*LayoutPicker[\s\S]*<\/InformationBar>/);
});

test("a window's fade ends without holding a stacking context, so a dropdown in the top bars draws over the panes", async () => {
    const {readFileSync} = await import("node:fs");
    const {resolve} = await import("node:path");
    const host = readFileSync(resolve(__dirname, "../src/windows/WindowHost.vue"), "utf8");
    expect(host).toContain("animation: window-fade 0.25s ease backwards;");
});

test("the bars read the journal again every few seconds, so they follow the state as it changes", async () => {
    const {readFileSync} = await import("node:fs");
    const {resolve} = await import("node:path");
    const stage = readFileSync(resolve(__dirname, "../src/windows/PaneStage.vue"), "utf8");
    expect(stage).toMatch(/setInterval\(readFacts, FACT_SECONDS \* 1000\)/);
});

test("the agent bar names the task the agent is working in, and nothing when it has none", () => {
    const working = mounted(AgentBar, {agent: MAIN, task: {id: 5383, title: "Port the file pages"}});
    expect(working.querySelector("[data-agent-task]").textContent).toBe("Task 5383: Port the file pages");
    expect(mounted(AgentBar, {agent: MAIN, task: null}).querySelector("[data-agent-task]")).toBeNull();
});


test("the information bar shows the allowance used, the context, the model and the cost, and opens context", () => {
    const opened = [];
    const usage = {agents: [{id: 1, context_percent: 89, model: "Opus 5.5", cost_dollars: 40.86}], windows: [{title: "7 days", used_percent: 12.4}]};
    const element = mounted(InformationBar, {agent: MAIN, usage, onOpen: (name) => opened.push(name)});
    expect(element.querySelector("[data-fact='usage']").textContent).toContain("12%");
    expect(element.querySelector("[data-fact='context']").textContent).toContain("89%");
    expect(element.querySelector("[data-fact='model']").textContent).toContain("Opus 5.5");
    expect(element.querySelector("[data-fact='cost']").textContent).toContain("$40.86");
    element.querySelector("[data-fact='context']").click();
    expect(opened).toEqual(["context"]);
});
