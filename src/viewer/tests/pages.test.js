import {resolve} from "node:path";
import {readFileSync} from "node:fs";
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
        else if (line[0] === "agent" && line[1] === "show") value = line[2] === "99" ? null : {id: Number(line[2]), role: "worker"};
        else if (line[0] === "viewer-layout" && line[1] === "current") layoutKeys.push(`${flag("--suite")}:${flag("--page")}:${flag("--driver")}`);
        else if (line[0] === "suite" && line[1] === "layout") value = {shape: SHAPES[`${current.suite}:${line[3]}:${flag("--driver")}`]};
        return {json: async () => (value ? {code: 0, value, error: ""} : {code: 1, value: null, error: line[2] === "99" ? JSON.stringify({refusal: "no agent 99", hint: "see journal agent list"}) : "none"})};
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
    expect([...bar.querySelectorAll(".reopen-module")].map((module) => module.textContent)).toEqual(["tasks.tasks", "agents.terminal, agents.notes, agents.briefing"]);
    expect(bar.querySelector(`[data-reopen="tasks.tasks"]`)).not.toBeNull();
    expect(bar.querySelector(`[data-reopen="messages.chat"]`)).toBeNull();
    expect(bar.querySelector(`[data-reopen="agents.briefing"]`)).not.toBeNull();
});

const STEPS = [
    ["Drag a window onto a pane", "Every window has an icon here. Drag one onto a pane to open it there. The icon comes back when you close that window.", ".agent-bar [data-reopen]"],
    ["Pick a preset", "Presets opens a list of ready layouts, such as Default, Chat only and Terminal, and arranges every pane in one step.", ".agent-bar [data-presets]"],
    ["Split a pane", "Each pane has this menu. Split right or Split below opens a second window beside this one.", `[data-menu="split-right"]`],
    ["Detach a window", "Detach opens this window in a window of its own that stays on screen on every page. Dock it back from its menu.", `[data-menu="detach"]`],
    ["Full screen", expect.stringMatching(/^This button, or the full screen keys \(.+\), hides the sidebar and the top bar so the panes fill the screen\. Esc brings them back\.$/), ".agent-bar [data-fullscreen]"],
];

test("the tour shows its five steps in order, pointing at each target, with the pane menu open for the split and detach steps and closed after", async () => {
    localStorage.clear();
    const {element} = await mount(HomePage);
    for (const [at, [title, text, target]] of STEPS.entries()) {
        expect(element.querySelector(".pane-tour-title").textContent).toContain(title);
        expect(element.querySelector(".pane-tour-text").textContent).toEqual(text);
        expect(element.querySelector(".pane-tour-step").textContent).toBe(`${at + 1} of 5`);
        expect([at, element.querySelector(target)?.className]).toEqual([at, expect.stringContaining("tour-target")]);
        expect(element.querySelector(".pane-menu") !== null).toBe(at === 2 || at === 3);
        element.querySelector(`[data-tour="next"]`).click();
        await settle();
    }
    expect(element.querySelector(".pane-tour")).toBeNull();
    expect(element.querySelector(".pane-menu")).toBeNull();
});

test("the tour can be skipped, and is followed by the pane menu hint, each shown once", async () => {
    localStorage.clear();
    const first = await mount(HomePage);
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

test("an agent page that cannot read its agent says so in plain words instead of drawing nothing", async () => {
    const {element} = await mount(AgentPage, {agent: 99});
    expect(element.querySelector(".agent-page-failure").textContent).toBe("Agent 99 could not be read: no agent 99");
});

test("the agent bar names a group by its windows, never by the module's dotted name, and draws each window's icon with the mark icons", async () => {
    const {element} = await mount(HomePage);
    const labels = [...element.querySelectorAll(".agent-bar .reopen-module")].map((label) => label.textContent);
    expect(labels.every((label) => !label.includes("journal.core"))).toBe(true);
    expect(element.querySelectorAll(".agent-bar [data-reopen] svg.mark-icon").length).toBeGreaterThan(0);
    expect(element.querySelector("[data-tab] svg.mark-icon")).not.toBeNull();
});

test("the agent bar scrolls inside itself so the page never scrolls sideways at phone width", () => {
    const source = readFileSync(resolve(__dirname, "../src/windows/PaneStage.vue"), "utf8");
    expect(source).toMatch(/\.pane-stage-bar \{[^}]*overflow-x: auto;/);
    expect(source).toMatch(/\.pane-stage \{[^}]*max-width: 100vw;/);
});

import EnvironmentPage from "../src/pages/EnvironmentPage.vue";

async function environments(rows, search = "?agent=3") {
    const replaced = vi.fn();
    vi.stubGlobal("location", {replace: replaced});
    vi.stubGlobal("fetch", async () => ({json: async () => (rows ? {code: 0, value: {rows}, error: ""} : {code: 1, value: null, error: "none"})}));
    const element = document.createElement("div");
    createApp(() => h(EnvironmentPage, {search})).mount(element);
    for (let round = 0; round < 6; round++) await new Promise((resolve) => setTimeout(resolve));
    return {element, replaced};
}

test("an address with no environment opens the one environment there is and keeps the rest of the address", async () => {
    const {replaced} = await environments([{name: "work"}]);
    expect(replaced).toHaveBeenCalledWith("?agent=3&environment=work");
});

test("an address with no environment, and several or none to choose from, says so in plain words", async () => {
    const several = await environments([{name: "work"}, {name: "home"}]);
    expect(several.replaced).not.toHaveBeenCalled();
    expect(several.element.textContent).toContain("This address names no environment. Add ?environment= and the name of the environment to open.");
    expect(several.element.textContent).toContain("Environments: work, home");
    const none = await environments(null);
    expect(none.element.textContent).toContain("names no environment");
});

test("the agent page offers the environment windows too, with no agent id, and filters only the agent windows by role", async () => {
    const {element} = await mount(AgentPage, {agent: 12});
    const offered = [...element.querySelectorAll("[data-reopen]")].map((button) => button.dataset.reopen);
    expect(offered).toContain("tasks.tasks");
    expect(offered).not.toContain("agents.briefing");
});

test("a refusal is shown by its words alone", async () => {
    const {refusalWords} = await import("../src/windows/windowContext.js");
    expect(refusalWords(JSON.stringify({refusal: "no agent 1", hint: "see journal agent list"}))).toBe("no agent 1");
    expect(refusalWords("plain text")).toBe("plain text");
});

test("the full screen button draws the expand icon, not the plain dot, and at phone width the bar shows icons without labels", async () => {
    const wide = await mount(HomePage);
    expect(wide.element.querySelector("[data-fullscreen] svg").innerHTML).toContain("M6.2 2.6H2.6");
    expect(wide.element.querySelector(".agent-bar .reopen-module")).not.toBeNull();
    vi.stubGlobal("innerWidth", 400);
    const narrow = await mount(HomePage);
    expect(narrow.element.querySelector(".agent-bar .reopen-module")).toBeNull();
    expect(narrow.element.querySelectorAll(".agent-bar [data-reopen]").length).toBeGreaterThan(0);
    const source = readFileSync(resolve(__dirname, "../src/windows/PaneStage.vue"), "utf8");
    expect(source).toMatch(/\.reopen-module \{[^}]*white-space: nowrap;/);
});

test("a journal that cannot run the shell's lines says why above the page", async () => {
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 2, value: null, error: "the journal's modules changed: journal module sync"})}));
    const {element} = await mount(HomePage);
    expect(element.querySelector(".home-problem").textContent).toContain("the journal's modules changed: journal module sync");
});

test("a page whose suite is simply not chosen shows no problem", async () => {
    const {element} = await mount(HomePage);
    expect(element.querySelector(".home-problem")).toBeNull();
});
