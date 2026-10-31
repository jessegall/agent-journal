import {createApp, h, nextTick} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {settled} from "./settled.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import DockWrapper from "../src/chat/DockWrapper.vue";
import MarkHost from "../src/chat/MarkHost.vue";
import PaneStage from "../src/windows/PaneStage.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {paneLayout} from "../src/windows/paneLayout.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";

// Version 5's desktop viewer against version 4's, one test per difference of report 1147 and one screenshot pair each (version 4 at port
// 8420, version 5 on a demo, both 1280 wide, cropped to the part that differs). Each test states version 4's look; it fails until version 5 draws it.
const LOOK = join(import.meta.dirname, "look") + "/";
const PAIRS = JSON.parse(readFileSync(`${LOOK}pairs.json`, "utf8"));
const NOW = Date.now() / 1000;
const FIRST_MESSAGE = {id: 1, type: "user", text: "Fix the `cart` total first", created_at: new Date((NOW - 600) * 1000).toISOString()};
const SECOND_MESSAGE = {id: 2, type: "agent", text: "On it, **now**", created_at: new Date((NOW - 300) * 1000).toISOString()};
const MARK = {id: 1, type: "task", variant: "made", key: "task:1", text: "Task 1 made: Fix the cart total", detail: "", lines: "", target_model: "tasks", target_id: 1, outcome: "none", state: "shown", created_at: NOW - 100};
const MARK_FAMILY = {type: "task", family_icon: "task", mark_icon: "task", group: "tasks", colouring: "group", click: "open row", process: false};
const REPORT_DOCK = {id: 1, type: "report", target_model: "reports", target_id: 1146, kept: false, state: "docked", leaves_at: null, title: "Report 1146: What the review found", text: "Two reviewers found 17 gaps in the plan"};
const REPORT_FAMILY = {type: "report", icon: "report", title: "Report {row_id}: {row_title}", buttons: [], leaves_after_seconds: 0, reads: ["report show"]};

let mounted = [];
let lines;

function windowContext(answers) {
    lines = [];
    return {
        read: async (line) => {
            lines.push(line);
            return {ok: true, value: {rows: answers[line] ?? []}};
        },
        run: async () => ({ok: true}),
        follow: () => {},
        option: () => ({value: true}),
        face: "person",
    };
}

async function mountedChat(answers = {}) {
    const context = windowContext({"message list": [FIRST_MESSAGE, SECOND_MESSAGE], "chat-mark list": [MARK], "dock-item list": [REPORT_DOCK], "notice list": [], ...answers});
    const element = document.createElement("div");
    document.body.append(element);
    createApp({setup: () => () => h(Chat), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    mounted.push(element);
    await settled();
    return element;
}

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    loadMarkDeclarations([MARK_FAMILY]);
    loadDockDeclarations([REPORT_FAMILY]);
    vi.stubGlobal("fetch", async () => ({json: async () => ({marks: [MARK_FAMILY], docks: [REPORT_FAMILY]})}));
});

afterEach(() => {
    mounted.forEach((element) => element.remove());
    mounted = [];
    vi.unstubAllGlobals();
});

test("each difference of report 1147 has a screenshot pair of version 4 and version 5 and says what version 5 does better or the same", () => {
    expect(PAIRS.map((pair) => pair.report).sort()).toEqual(
        ["The bars at the top", "The bars at the top", "The chat: docked items", "The chat: marks", "The chat: messages", "The chat: pinned notices", "The chat: the composer", "The side panels", "The side panels"].sort(),
    );
    for (const pair of PAIRS) {
        expect(existsSync(`${LOOK}${pair.version4}`), pair.version4).toBe(true);
        expect(existsSync(`${LOOK}${pair.version5}`), pair.version5).toBe(true);
        expect(pair.version5Does).toMatch(/Same:.*Better:/);
    }
    expect(existsSync(`${LOOK}home-v4.png`) && existsSync(`${LOOK}home-v5.png`)).toBe(true);
});

test("messages: each is a rounded card with its time under it, the agent's apart from the user's", async () => {
    const element = await mountedChat();
    const cards = element.querySelectorAll("[data-message]");
    expect(cards).toHaveLength(2);
    expect(cards[0]?.dataset.from).toBe("user");
    expect(cards[1]?.dataset.from).toBe("agent");
    expect(cards[0]?.querySelector("time")).not.toBeNull();
});

test("messages: markdown in the text shows as inline code and bold", async () => {
    const element = await mountedChat();
    expect(element.querySelector("[data-message] code")?.textContent).toBe("cart");
    expect(element.querySelector("[data-message] strong")?.textContent).toBe("now");
});

test("marks: a mark's line names the row's own title and carries no check mark", async () => {
    const element = await mountedChat();
    const line = element.querySelector('[data-ref="chat_mark:1"]');
    expect(line.textContent).toContain("Fix the cart total");
    expect(line.querySelector("[data-check]")).toBeNull();
});

test("marks: a mark drawn on its own names the row's title as well", async () => {
    const element = document.createElement("div");
    createApp(() => h(MarkHost, {mark: MARK})).mount(element);
    mounted.push(element);
    await settled();
    expect(element.textContent).toContain("Fix the cart total");
});

test("docked items: a card shows its title, a line of its text, and buttons to open and to close it", async () => {
    const element = document.createElement("div");
    createApp(() => h(DockWrapper, {item: REPORT_DOCK})).mount(element);
    mounted.push(element);
    await settled();
    expect(element.textContent).toContain("Report 1146: What the review found");
    expect(element.textContent).toContain("Two reviewers found 17 gaps in the plan");
    expect(element.querySelector("[data-dock-action='open']")).not.toBeNull();
    expect(element.querySelector("[data-dock-action='undock']")).not.toBeNull();
});

test("pinned notices: a strip above the chat holds each notice with its text, a button with its link and a close cross", async () => {
    const notice = {id: 1, title: "Version 5 demo seeded", link: "http://127.0.0.1:8431/", label: "Open the demo", closed_at: null};
    const element = await mountedChat({"notice list": [notice]});
    const strip = element.querySelector("[data-notices]");
    expect(strip?.textContent).toContain("Version 5 demo seeded");
    expect(strip?.querySelector("a, button")?.textContent).toContain("Open the demo");
    expect(strip?.querySelector("[data-notice-close]")).not.toBeNull();
});

test("composer: a tall box that says Message the agent, with an attach button and Dump files", async () => {
    const element = await mountedChat();
    expect(element.querySelector("textarea")?.getAttribute("placeholder")).toBe("Message the agent");
    expect(element.querySelector("[data-attach]")).not.toBeNull();
    expect([...element.querySelectorAll("button")].map((button) => button.textContent.trim())).toContain("Dump files");
});

test("composer: the running tool shows under the last message, and a button scrolls the chat to its top", async () => {
    const element = await mountedChat({"hook-call list --limit 1": [{id: 9, hook: "pre_tool_use", tool: "mcp__playwright__browser_navigate"}]});
    expect(element.querySelector("[data-running-tool]")?.textContent).toContain("browser_navigate");
    expect(element.querySelector("[data-scroll-top]")).not.toBeNull();
});

test("bars: an agent bar names the agent's state and task, and an information bar its context use and model", () => {
    const files = Object.keys(import.meta.glob("../src/shell/*.vue"));
    expect(files).toContain("../src/shell/AgentBar.vue");
    expect(files).toContain("../src/shell/InformationBar.vue");
});

test("bars: each window button carries its own icon before its own label", async () => {
    const offered = ["questions.waiting", "agents.subagents"].map((name) => ({name, module: "journal", title: name === "questions.waiting" ? "Waiting" : "Subagents", icon: "window", options: [], allowed: true, unavailable_reason: ""}));
    const catalogue = new WindowCatalogue(async () => ({windows: offered}));
    catalogue.windows.value = offered;
    const store = paneLayout({saved: async () => null, defaults: async () => ({tabs: ["messages.chat"], active: "messages.chat"}), save: async () => ({ok: true, version: 1}), tab: {read: () => null, write: () => {}}, entry: () => null});
    await store.load({environment: "main", person: 1, suite: "coding", page: "home", driver: "coding.builder"});
    vi.stubGlobal("innerWidth", 1280);
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(PaneStage, {store, catalogue, subscriptions: new WindowSubscriptions(), environment: "main", face: "person"})).mount(element);
    mounted.push(element);
    await nextTick();
    await settled();
    const buttons = [...element.querySelectorAll("[data-reopen]")];
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
        expect(button.querySelector("svg, .icon, [data-icon]")).not.toBeNull();
        expect(button.textContent.trim()).toBe(button.getAttribute("title"));
    }
});

test("side panels: a left sidebar lists the suite's pages and the environments, and a right panel shows the activity", () => {
    const files = Object.keys(import.meta.glob("../src/shell/*.vue"));
    expect(files).toContain("../src/shell/SidebarPages.vue");
    expect(files).toContain("../src/shell/ActivityPanel.vue");
});
