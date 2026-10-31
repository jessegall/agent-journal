import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import HomePage from "../src/pages/HomePage.vue";
import AgentPage from "../src/pages/AgentPage.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";

const entry = (name, extra = {}) => ({name, module: name.split(".")[0], title: name, icon: "window", options: [], line: "task list", loading: "document", place: "environment", roles: [], reads: [], runs: [], events: [], unavailable_reason: "", allowed: true, ...extra});
const SHAPES = {
    "coding:home:coding.builder": {windows: ["messages.chat"], active: "messages.chat"},
    "coding:agent:coding.worker": {windows: ["agents.terminal", "agents.notes"], active: "agents.terminal"},
    "review:home:review.reviewer": {windows: ["tasks.tasks"], active: "tasks.tasks"},
};
const WINDOWS = [
    entry("messages.chat"),
    entry("tasks.tasks"),
    entry("agents.terminal", {place: "agent", roles: ["worker"]}),
    entry("agents.notes", {place: "agent", roles: ["worker"]}),
    entry("agents.briefing", {place: "agent", roles: ["main"]}),
];

let current;
let layoutKeys;

function wire() {
    current = {suite: "coding", drivers: "main: coding.builder, worker: coding.worker"};
    layoutKeys = [];
    vi.stubGlobal("fetch", async (url, init) => {
        const line = JSON.parse(init?.body || "{}").line || [];
        const flag = (name) => line[line.indexOf(name) + 1];
        let value = null;
        if (line.join(" ").startsWith("suite current")) value = current;
        else if (line[0] === "agent" && line[1] === "show") value = {id: Number(line[2]), role: "worker", driver: "coding.worker"};
        else if (line[0] === "viewer-layout" && line[1] === "current") layoutKeys.push(`${flag("--suite")}:${flag("--page")}:${flag("--driver")}`);
        else if (line[0] === "suite" && line[1] === "layout") value = {shape: SHAPES[`${current.suite}:${line[3]}:${flag("--driver")}`]};
        return {json: async () => (value ? {code: 0, value, error: ""} : {code: 1, value: null, error: "none"})};
    });
}

async function mount(page, props = {}) {
    const catalogue = new WindowCatalogue(async () => ({windows: WINDOWS}));
    let heard = null;
    const events = (environment, listener) => ((heard = listener), () => {});
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(page, {environment: "main", catalogue, events, ...props})).mount(element);
    for (let round = 0; round < 10; round++) await new Promise((resolve) => setTimeout(resolve));
    return {element, heard: (event) => heard(event)};
}

const tabs = (element) => [...element.querySelectorAll("[data-tab]")].map((tab) => tab.dataset.tab);
const settle = async () => {
    for (let round = 0; round < 10; round++) await new Promise((resolve) => setTimeout(resolve));
};

beforeEach(() => {
    sessionStorage.clear();
    wire();
});
afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

test("the home page and the agent page both mount the pane stage", async () => {
    const home = await mount(HomePage);
    expect(home.element.querySelector(".pane-stage")).not.toBeNull();
    const agent = await mount(AgentPage, {agent: 12});
    expect(agent.element.querySelector(".pane-stage")).not.toBeNull();
});

test("the agent page loads the layout of that agent's driver and gives its windows the agent id", async () => {
    const {element} = await mount(AgentPage, {agent: 12});
    expect(layoutKeys).toContain("coding:agent:coding.worker");
    expect(tabs(element)).toEqual(["agents.terminal", "agents.notes"]);
    expect(element.querySelector(`section.window[data-window="agents.terminal"]`).dataset.agent).toBe("12");
});

test("switching the suite loads that suite's layout, and switching back restores the first", async () => {
    const {element, heard} = await mount(HomePage);
    expect(tabs(element)).toEqual(["messages.chat"]);
    current = {suite: "review", drivers: "main: review.reviewer"};
    await heard({event: "setting.change"});
    await settle();
    expect(tabs(element)).toEqual(["tasks.tasks"]);
    current = {suite: "coding", drivers: "main: coding.builder, worker: coding.worker"};
    await heard({event: "setting.change"});
    await settle();
    expect(tabs(element)).toEqual(["messages.chat"]);
});

test("the agent roles of a window filter which agent windows an agent page offers", async () => {
    const {element} = await mount(AgentPage, {agent: 12});
    const offered = [...element.querySelectorAll("[data-reopen]")].map((button) => button.dataset.reopen);
    expect(offered).not.toContain("agents.briefing");
});

test("at phone width the home page stacks its panes and the agent page shows a plain tab bar", async () => {
    vi.stubGlobal("innerWidth", 400);
    const home = await mount(HomePage);
    expect(home.element.querySelector(".pane-grid.stacked")).not.toBeNull();
    const agent = await mount(AgentPage, {agent: 12});
    const bar = agent.element.querySelector("nav.agent-tabbar");
    expect([...bar.querySelectorAll("button")].map((button) => button.textContent.trim())).toEqual(["agents.terminal", "agents.notes"]);
});

test("an agent window opened on the home page is given the main agent's id and an environment window is not", async () => {
    const line = (words) => words;
    const base = globalThis.fetch;
    vi.stubGlobal("fetch", async (url, init) => {
        const words = JSON.parse(init?.body || "{}").line || [];
        if (words[0] === "agent" && words[1] === "list") return {json: async () => ({code: 0, value: {rows: [{id: 3}]}, error: ""})};
        return base(url, init);
    });
    current = {suite: "coding", drivers: "main: coding.builder"};
    SHAPES["coding:home:coding.builder"] = {windows: ["messages.chat", "agents.terminal"], active: "messages.chat"};
    const {element} = await mount(HomePage);
    element.querySelector(`[data-tab="agents.terminal"]`).dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect(element.querySelector(`section.window[data-window="agents.terminal"]`).dataset.agent).toBe("3");
    expect(line).toBeDefined();
    SHAPES["coding:home:coding.builder"] = {windows: ["messages.chat"], active: "messages.chat"};
});

test("the agent bar of the home page shows an icon for each closed window, one group per module", async () => {
    const {element} = await mount(HomePage);
    const bar = element.querySelector(".agent-bar");
    expect([...bar.querySelectorAll(".reopen-module")].map((module) => module.textContent)).toEqual(["tasks", "agents"]);
    expect(bar.querySelector(`[data-reopen="tasks.tasks"]`)).not.toBeNull();
    expect(bar.querySelector(`[data-reopen="messages.chat"]`)).toBeNull();
    expect(bar.querySelector(`[data-reopen="agents.briefing"]`)).not.toBeNull();
});

test("the tour shows once, steps through, and is followed by the pane menu hint, each shown once", async () => {
    localStorage.clear();
    const first = await mount(HomePage);
    expect(first.element.querySelector(".pane-tour-title").textContent).toContain("Tabs");
    first.element.querySelector(`[data-tour="next"]`).click();
    await settle();
    expect(first.element.querySelector(".pane-tour-title").textContent).toContain("Move and split");
    first.element.querySelector(`[data-tour="skip"]`).click();
    await settle();
    expect(first.element.querySelector(".pane-tour")).toBeNull();
    expect(first.element.querySelector(".pane-menu-hint")).not.toBeNull();
    first.element.querySelector(`[data-hint="done"]`).click();
    await settle();
    expect(first.element.querySelector(".pane-menu-hint")).toBeNull();
    const again = await mount(HomePage);
    expect(again.element.querySelector(".pane-tour")).toBeNull();
    expect(again.element.querySelector(".pane-menu-hint")).toBeNull();
});
