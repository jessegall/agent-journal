import {resolve} from "node:path";
import {readFileSync} from "node:fs";
import {createApp, h, nextTick} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import HomePage from "../src/pages/HomePage.vue";
import AgentPage from "../src/pages/AgentPage.vue";
import ViewWindow from "../src/layout/ViewWindow.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";

const entry = (name, extra = {}) => ({name, module: name.split(".")[0], title: name, icon: "window", options: [], line: "task list", loading: "document", place: "pane", shows: "environment", roles: [], reads: [], runs: [], events: [], unavailable_reason: "", allowed: true, ...extra});
const SHAPES = {
    "coding:home:coding.builder": {windows: ["messages.chat"], active: "messages.chat"},
    "coding:agent:coding.worker": {windows: ["agents.terminal", "agents.notes"], active: "agents.terminal"},
    "review:home:review.reviewer": {windows: ["tasks.tasks"], active: "tasks.tasks"},
};
const WINDOWS = [
    entry("messages.chat"),
    entry("tasks.tasks"),
    entry("agents.terminal", {shows: "one-agent", roles: ["worker"]}),
    entry("agents.notes", {shows: "one-agent", roles: ["worker"]}),
    entry("agents.briefing", {shows: "one-agent", roles: ["main"]}),
    entry("docs.library", {place: "page"}),
];

let current;
let layoutKeys;
let apps = [];

function wire() {
    current = {suite: "coding", drivers: "main: coding.builder, worker: coding.worker"};
    layoutKeys = [];
    vi.stubGlobal("fetch", perLine(async (url, init) => {
        const line = JSON.parse(init?.body || "{}").line || [];
        const flag = (name) => line[line.indexOf(name) + 1];
        let value = null;
        if (line.join(" ").startsWith("suite current")) value = current;
        else if (line[0] === "agent" && line[1] === "show") value = line[2] === "99" ? null : {id: Number(line[2]), role: "worker"};
        else if (line[0] === "viewer-layout" && line[1] === "current") layoutKeys.push(`${flag("--suite")}:${flag("--page")}:${flag("--driver")}`);
        else if (line[0] === "suite" && line[1] === "layout") value = {shape: SHAPES[`${current.suite}:${line[3]}:${flag("--driver")}`]};
        return {json: async () => (value ? {code: 0, value, error: ""} : {code: 1, value: null, error: line[2] === "99" ? JSON.stringify({refused: "no agent 99", hint: "see journal agent list"}) : "none"})};
    }));
}

async function mount(page, props = {}) {
    const catalogue = new WindowCatalogue(async () => ({windows: WINDOWS}));
    let heard = null;
    const events = (environment, listener) => ((heard = listener), () => {});
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(page, {environment: "main", catalogue, events, ...props}));
    apps.push(app);
    app.mount(element);
    for (let round = 0; round < 40; round++) await new Promise((resolve) => setTimeout(resolve));
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
    apps.forEach((app) => app.unmount());
    apps = [];
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
    expect(element.querySelector(".agent-page-facts").textContent).toBe("Worker · coding.worker");
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

const openAddBar = async (element) => {
    element.querySelector("[data-add-window]").click();
    await settle();
};

test("the agent roles of a window filter which agent windows an agent page offers", async () => {
    const {element} = await mount(AgentPage, {agent: 12});
    await openAddBar(element);
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
    vi.stubGlobal("fetch", perLine(async (url, init) => {
        const words = JSON.parse(init?.body || "{}").line || [];
        if (words[0] === "agent" && words[1] === "main") return {json: async () => ({code: 0, value: {id: 3}, error: ""})};
        return base(url, init);
    }));
    current = {suite: "coding", drivers: "main: coding.builder"};
    SHAPES["coding:home:coding.builder"] = {windows: ["messages.chat", "agents.terminal"], active: "messages.chat"};
    const {element} = await mount(HomePage);
    element.querySelector(`[data-tab="agents.terminal"]`).dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect(element.querySelector(`section.window[data-window="agents.terminal"]`).dataset.agent).toBe("3");
    expect(line).toBeDefined();
    SHAPES["coding:home:coding.builder"] = {windows: ["messages.chat"], active: "messages.chat"};
});

test("the plus bar of the home page shows an icon for each closed window", async () => {
    const {element} = await mount(HomePage);
    await openAddBar(element);
    const bar = element.querySelector("[data-add-bar]");
    const reopen = (name) => bar.querySelector(`[data-reopen="${name}"]`);
    expect(reopen("tasks.tasks").querySelector("svg")).not.toBeNull();
    expect(reopen("messages.chat")).toBeNull();
    expect(reopen("agents.briefing").querySelector("svg")).not.toBeNull();
    expect(bar.querySelector(".reopen-module")).toBeNull();
});

const STEPS = [
    ["Add a window", "The plus in a window's header lists the windows that are closed. Pick one to open it there, or drag one onto a pane.", "[data-add-window]"],
    ["Pick a preset", "Presets opens a list of ready layouts, such as Default, Chat only and Terminal, and arranges every pane in one step.", "[data-presets]"],
    ["Split a pane", "Each window has this menu. Split right or Split below opens a second window beside this one.", `[data-menu="split-right"]`],
    ["Detach a window", "Detach opens a floating window that stays visible on every page. Use its menu to dock it again.", `[data-menu="detach"]`],
    ["Full screen", expect.stringMatching(/^This button, or the full screen keys \(.+\), hides the sidebar and the top bar so the panes fill the screen\. Esc brings them back\.$/), "[data-fullscreen]"],
];

test("the tour shows its five steps in order, pointing at each target, with the pane menu open for the split and detach steps and closed after", async () => {
    localStorage.clear();
    const {element} = await mount(HomePage);
    for (const [at, [title, text, target]] of STEPS.entries()) {
        expect(element.querySelector(".pane-tour-title").textContent).toContain(title);
        expect(element.querySelector(".pane-tour-text").textContent).toEqual(text);
        expect(element.querySelector(".pane-tour-step").textContent).toBe(`${at + 1} of 5`);
        expect([at, document.body.querySelector(target)?.className]).toEqual([at, expect.stringContaining("tour-target")]);
        expect(document.body.querySelector(".pane-menu") !== null).toBe(at === 2 || at === 3);
        element.querySelector(`[data-tour="next"]`).click();
        await settle();
    }
    expect(element.querySelector(".pane-tour")).toBeNull();
    expect(document.body.querySelector(".pane-menu")).toBeNull();
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

test("the plus bar draws each window's icon with the mark icons", async () => {
    const {element} = await mount(HomePage);
    await openAddBar(element);
    expect(element.querySelectorAll("[data-add-bar] [data-reopen] svg.mark-icon").length).toBeGreaterThan(0);
    expect(element.querySelector("[data-tab] svg.mark-icon")).not.toBeNull();
});

test("the page never scrolls sideways at phone width", () => {
    const source = readFileSync(resolve(__dirname, "../src/windows/PaneStage.vue"), "utf8");
    expect(source).toMatch(/\.pane-stage \{[^}]*max-width: 100vw;/);
});

import EnvironmentPage from "../src/pages/EnvironmentPage.vue";
import {perLine} from "./support/windowContext.js";

async function environments(rows, search = "?agent=3") {
    const replaced = vi.fn();
    vi.stubGlobal("location", {replace: replaced});
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => (rows ? {code: 0, value: {rows}, error: ""} : {code: 1, value: null, error: "none"})})));
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
    await openAddBar(element);
    const offered = [...element.querySelectorAll("[data-reopen]")].map((button) => button.dataset.reopen);
    expect(offered).toContain("tasks.tasks");
    expect(offered).not.toContain("agents.briefing");
});

// task 5394: the button draws the expand icon; the bar keeps each window's icon beside its title at every width
test("the full screen button draws the expand icon, not the plain dot, and the plus bar keeps icons beside titles at phone width", async () => {
    const wide = await mount(HomePage);
    expect(wide.element.querySelector("[data-fullscreen] svg").innerHTML).toContain("M6.2 2.6H2.6");
    vi.stubGlobal("innerWidth", 400);
    const narrow = await mount(HomePage);
    await openAddBar(narrow.element);
    expect(narrow.element.querySelectorAll("[data-add-bar] [data-reopen] svg").length).toBeGreaterThan(0);
});

test("a journal that cannot run the shell's lines says why above the page", async () => {
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => ({code: 2, value: null, error: "the journal's modules changed: journal module sync"})})));
    const {element} = await mount(HomePage);
    expect(element.querySelector(".home-problem").textContent).toContain("the journal's modules changed: journal module sync");
});

test("a page whose suite is simply not chosen shows no problem", async () => {
    const {element} = await mount(HomePage);
    expect(element.querySelector(".home-problem")).toBeNull();
});

// task 5476: a window opens as a page of its own, the sidebar linking each window's address
test("a window page draws the sidebar with a link to each window's own address and the window itself", async () => {
    const {element} = await mount(ViewWindow, {view: "tasks.tasks", float: 0, standalone: true});
    expect(element.querySelector(`[data-page="tasks.tasks"]`)).not.toBeNull();
    expect(element.querySelector(`[data-sidebar-window="docs.library"]`).getAttribute("href")).toBe("?environment=main&page=docs.library");
    expect(element.querySelector(`[data-sidebar-window="agents.notes"]`)).toBeNull();
    expect(element.querySelector("[data-breadcrumb]").textContent).toContain("tasks.tasks");
    expect(element.querySelector(`section.window[data-window="tasks.tasks"]`)).not.toBeNull();
});

test("a plain click on a sidebar page follows its address and opens no pane", async () => {
    const {default: SidebarPages} = await import("../src/shell/SidebarPages.vue");
    const opened = [];
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(SidebarPages, {windows: [entry("docs.library", {place: "page"})], current: "main", onOpen: (name) => opened.push(name)})).mount(element);
    const link = element.querySelector(`[data-sidebar-window="docs.library"]`);
    expect(link.getAttribute("href")).toBe("?environment=main&page=docs.library");
    const click = new MouseEvent("click", {bubbles: true, cancelable: true, button: 0});
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    expect(opened).toEqual([]);
});

// a fresh journal has no suite chosen, so no layout is ever loaded; the page still has one, and a click on a window works
test("on a fresh page with no suite chosen, a click on a closed window's button opens it instead of throwing", async () => {
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => ({code: 2, value: null, error: "no suite is chosen"})})));
    const {element} = await mount(HomePage);
    await openAddBar(element);
    const button = element.querySelector(`[data-add-bar] [data-reopen="tasks.tasks"]`);
    expect(button).not.toBeNull();
    button.dispatchEvent(new MouseEvent("click", {bubbles: true}));
    await settle();
    expect(element.querySelector(`[data-tab="tasks.tasks"]`)).not.toBeNull();
});

test("only an environment with an agent has a colored dot", async () => {
    const {default: SidebarPages} = await import("../src/shell/SidebarPages.vue");
    const element = document.createElement("div");
    const environments = [{id: 1, name: "main"}, {id: 2, name: "development"}];
    createApp(() => h(SidebarPages, {windows: [], environments, activeEnvironments: [1], current: "main"})).mount(element);
    await nextTick();
    expect(element.querySelector("[data-environment='main'] .dot").classList.contains("active")).toBe(true);
    expect(element.querySelector("[data-environment='development'] .dot").classList.contains("active")).toBe(false);
});

test("a window that stands in a pane or on a page is offered to the panes and listed in the sidebar", async () => {
    const catalogue = new WindowCatalogue(async () => ({windows: [entry("docs.library", {place: "pane_or_page"}), entry("docs.notes", {place: "page"})]}));
    await catalogue.load();
    expect(catalogue.windows.value.map((window) => window.name)).toEqual(["docs.library"]);
    expect(catalogue.pages.value.map((window) => window.name)).toEqual(["docs.library", "docs.notes"]);
});

