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
