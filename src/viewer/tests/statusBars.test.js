import {createApp, h, nextTick, reactive} from "vue";
import {expect, test} from "vitest";
import AgentBar from "../src/shell/AgentBar.vue";
import WindowDropdown from "../src/windows/WindowDropdown.vue";
import InformationBar from "../src/shell/InformationBar.vue";

const mounted = (component, props) => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(component, props)).mount(element);
    return element;
};
const MAIN = {id: 1, role: "main", program: "claude", session: "s", process_started_at: null, ended_at: null};

test("the allowance gauge names the window its percentage is of", () => {
    const usage = {agents: [], windows: [{title: "7 days", used_percent: 17, reset_epoch_seconds: 1}]};
    const fact = mounted(InformationBar, {agent: MAIN, usage}).querySelector('[data-fact="usage"]');
    expect(fact.textContent).not.toContain("7 days");
    expect(fact.title).toContain("7 days");
    expect(fact.textContent).toContain("17%");
});

test("the information bar holds no window counts, and its scheduled jobs open with an icon and a count", () => {
    const opened = [];
    const element = mounted(InformationBar, {agent: MAIN, jobs: 2, onOpen: (name) => opened.push(name)});
    expect(element.textContent).toContain("Claude");
    expect(element.querySelector("[data-count]")).toBeNull();
    const jobs = element.querySelector('[data-fact="jobs"]');
    expect(jobs.textContent.trim()).toBe("2");
    expect(jobs.querySelector("svg")).not.toBeNull();
    jobs.click();
    expect(opened).toEqual(["jobs"]);
});

test("fitness and load come last in the bar, each an icon and a number with no word", () => {
    const element = mounted(InformationBar, {agent: MAIN, fitness: {is_measured: true, score: 90, workload: 0.5, workload_level: "ok"}});
    const facts = [...element.querySelectorAll("[data-fact]")].map((fact) => fact.dataset.fact);
    expect(facts.slice(-2)).toEqual(["fitness", "load"]);
    for (const [name, number] of [["fitness", "90"], ["load", "0.5"]]) {
        const fact = element.querySelector(`[data-fact="${name}"]`);
        expect(fact.textContent.trim()).toBe(number);
        expect(fact.querySelector("svg")).not.toBeNull();
    }
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
    expect(stage).toMatch(/<Breadcrumb[^>]*>[\s\S]*<StageTopButtons[\s\S]*<\/Breadcrumb>/);
    expect(readFileSync(resolve(__dirname, "../src/windows/StageTopButtons.vue"), "utf8")).toMatch(/data-top-search[\s\S]*data-top-bell[\s\S]*data-top-phone[\s\S]*data-activity-toggle[\s\S]*data-fullscreen/);
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

test("the agent bar names a paused agent, says nothing of what waits, and has one button for every helper", () => {
    const opened = [];
    const element = mounted(AgentBar, {agent: {...MAIN, paused_at: "2026-11-01T10:00:00Z"}, helpers: 3, onOpen: (name, anchor) => opened.push([name, anchor])});
    expect(element.querySelector("[data-agent-word]").textContent).toBe("Paused");
    expect(element.querySelector("[data-workers]")).toBeNull();
    expect(element.querySelector("[data-reviewers]")).toBeNull();
    const helpers = element.querySelector("[data-helpers]");
    expect(helpers.textContent.trim()).toBe("3 helpers");
    helpers.click();
    expect(opened).toEqual([["helpers", helpers]]);
});

test("a dropdown opens under the button that asked for it, kept inside the window", () => {
    const anchor = {getBoundingClientRect: () => ({left: 400, bottom: 90})};
    const catalogue = {dropdown: () => null, window: () => null, loaded: {value: false}};
    const groups = [{name: "usage.context", title: "Context", count: 0}];
    const element = mounted(WindowDropdown, {groups, anchor, catalogue, subscriptions: {}, environment: "main"});
    const panel = element.querySelector("[data-dropdown]");
    expect(panel.style.top).toBe("96px");
    expect(panel.style.left).toBe("400px");
    expect(element.querySelector("[data-dropdown-group]")).toBeNull();
    const nearEdge = mounted(WindowDropdown, {groups, anchor: {getBoundingClientRect: () => ({left: window.innerWidth - 10, bottom: 90})}, catalogue, subscriptions: {}, environment: "main"});
    expect(nearEdge.querySelector("[data-dropdown]").style.right).toBe("8px");
});

test("the helpers dropdown holds every kind under its own header with a count", () => {
    const catalogue = {dropdown: () => null, window: () => null, loaded: {value: false}};
    const groups = [{name: "agents.subagents", title: "Subagents", count: 1}, {name: "workers.workers", title: "Workers", count: 2}, {name: "reviews.reviewers", title: "Reviewers", count: 0}];
    const element = mounted(WindowDropdown, {groups, catalogue, subscriptions: {}, environment: "main"});
    expect([...element.querySelectorAll("[data-dropdown-group]")].map((head) => head.textContent.trim())).toEqual(["Subagents1", "Workers2", "Reviewers0"]);
});

test("the pause button shows paused at once, resume shows working, and a refusal puts it back", async () => {
    const agent = reactive({...MAIN, id: 7, paused_at: null});
    const ran = [];
    let answer = {ok: true, value: {}};
    const element = mounted(AgentBar, {agent, run: async (line) => (ran.push(line.join(" ")), answer)});
    const button = element.querySelector("[data-agent-pause]");
    button.click();
    await nextTick();
    expect(element.querySelector("[data-agent-word]").textContent).toBe("Paused");
    await nextTick();
    expect(ran).toEqual(["agent pause 7"]);
    button.click();
    await nextTick();
    expect(element.querySelector("[data-agent-word]").textContent).toBe("Working");
    expect(ran).toEqual(["agent pause 7", "agent resume 7"]);
    answer = {ok: false, error: "no"};
    button.click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(element.querySelector("[data-agent-word]").textContent).toBe("Working");
    expect(element.querySelector("[data-agent-failure]").textContent).toBe("no");
});

test("the bar shows the branch, says nothing of working, and shows the effort level", () => {
    const element = mounted(InformationBar, {agent: MAIN, branch: "version-5", usage: {agents: [{id: 1, effort: "high"}], windows: []}});
    expect(element.querySelector('[data-fact="branch"]').textContent).toContain("version-5");
    expect(element.querySelector('[data-fact="state"]')).toBeNull();
    expect(element.textContent).not.toContain("Working");
});
