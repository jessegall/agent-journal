import {createApp, h, nextTick} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {settled} from "./settled.js";
import {context, perLine} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import DockWrapper from "../src/chat/DockWrapper.vue";
import DockStack from "../src/chat/DockStack.vue";
import MarkHost from "../src/chat/MarkHost.vue";
import PaneStage from "../src/windows/PaneStage.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {loadMarkDeclarations} from "../src/domain/markRegistry.js";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {paneLayout} from "../src/windows/paneLayout.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {dockWindow} from "./support/dockWindow.js";

// Version 5's desktop viewer against version 4's, one test per difference of report 1147 and one screenshot pair each (version 4 at port
// 8420, version 5 on a demo, both 1280 wide, cropped to the part that differs). Each test states version 4's look; it fails until version 5 draws it.
const LOOK = join(import.meta.dirname, "look") + "/";
const PAIRS = JSON.parse(readFileSync(`${LOOK}pairs.json`, "utf8"));
const NOW = Date.now() / 1000;
const FIRST_MESSAGE = {id: 1, type: "user", text: "Fix the `cart` total first", created_at: new Date((NOW - 600) * 1000).toISOString()};
const SECOND_MESSAGE = {id: 2, type: "agent", text: "On it, **now**", created_at: new Date((NOW - 300) * 1000).toISOString()};
const MARK = {id: 1, type: "task", variant: "made", key: "task:1", text: "Task 1 created: Fix the cart total", detail: "", lines: "", target_model: "tasks", target_id: 1, outcome: "none", state: "shown", created_at: NOW - 100};
const MARK_FAMILY = {type: "task", family_icon: "task", mark_icon: "task", group: "tasks", colouring: "group", click: "open row", process: false};
const REPORT_DOCK = {id: 1, type: "report", target_model: "reports", target_id: 1146, kept: false, state: "docked", leaves_at: null, title: "Report 1146: What the review found", text: "Two reviewers found 17 gaps in the plan"};
const REPORT_FAMILY = {type: "report", icon: "report", folds: true, title: "Report {row_id}: {row_title}", buttons: [], leaves_after_seconds: 0, reads: ["report show"]};

const apps = [];
let mounted = [];
let lines;
let runs;
let uploads = [];

function windowContext(answers) {
    lines = [];
    runs = [];
    uploads = [];
    return {
        ...context({}),
        read: async (line) => {
            lines.push(line);
            const key = Object.keys(answers).find((start) => line === start || line.startsWith(`${start} `));
            const answer = answers[key];
            return {ok: true, value: Array.isArray(answer) || !answer ? {rows: answer ?? []} : answer};
        },
        run: async (line) => {
            runs.push(line);
            return {ok: true};
        },
        follow: () => {},
        option: () => ({value: true}),
        face: "person",
        upload: async (file) => {
            uploads.push(file.name);
            return {ok: true, value: `pending-${file.name}`};
        },
    };
}

function mountedApp(app, element) {
    app.mount(element);
    apps.push(app);
}

async function mountedChat(answers = {}) {
    const context = windowContext({"message feed": [FIRST_MESSAGE, SECOND_MESSAGE], "chat-mark main": [MARK], "dock-item main": [REPORT_DOCK], "pin list": [], ...answers});
    const element = document.createElement("div");
    document.body.append(element);
    mountedApp(createApp({setup: () => () => h(Chat), provide: {[WINDOW_CONTEXT]: context}}), element);
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
    apps.splice(0).forEach((app) => app.unmount());
    mounted.forEach((element) => element.remove());
    mounted = [];
    vi.unstubAllGlobals();
});

test("each difference of report 1147 has a screenshot pair of version 4 and version 5 and says what version 5 does better or the same", () => {
    expect(PAIRS.map((pair) => pair.report).sort()).toEqual(
        ["Docks at the bottom and borderless buttons", "The settings page", "The sidebar and the breadcrumb", "The bars at the top", "The bars at the top", "The chat: docked items", "The chat: marks", "The chat: messages", "The chat: pins", "The chat: the composer", "The chat: the composer", "The side panels", "The side panels"].sort(),
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
    mountedApp(createApp(() => h(MarkHost, {mark: MARK})), element);
    mounted.push(element);
    await settled();
    expect(element.textContent).toContain("Fix the cart total");
});

test("docked items: a card shows its title, a line of its text, and buttons to open and to close it", async () => {
    const element = document.createElement("div");
    mountedApp(createApp({render: () => h(DockWrapper, {item: REPORT_DOCK}), provide: {[WINDOW_CONTEXT]: context({})}}), element);
    mounted.push(element);
    await settled();
    expect(element.textContent).toContain("Report 1146: What the review found");
    expect(element.textContent).not.toContain("Two reviewers found 17 gaps in the plan");
    expect(element.querySelector("[data-dock-action='open']")).not.toBeNull();
    expect(element.querySelector("[data-dock-action='undock']")).not.toBeNull();
});

test("docked items: a declared button goes the moment it is pressed, and comes back with the reason if it is refused", async () => {
    const ITEM = {...REPORT_DOCK, type: "plans.waiting", target_model: "plan", target_id: 7};
    loadDockDeclarations([{...REPORT_FAMILY, type: "plans.waiting", buttons: [{icon: "check", label: "Approve", runs: "plan approve {row_id}"}]}]);
    let answer;
    vi.stubGlobal("fetch", perLine(() => new Promise((resolve) => (answer = resolve))));
    const element = document.createElement("div");
    mountedApp(createApp({setup: () => () => h(DockWrapper, {item: ITEM}), provide: {[WINDOW_CONTEXT]: dockWindow([ITEM])}}), element);
    mounted.push(element);
    await settled();
    const button = () => element.querySelector("[data-dock-action='declared']");
    expect(button().textContent).toContain("Approve");
    button().click();
    await nextTick();
    expect(button()).toBeNull();
    await settled();
    answer({json: async () => ({code: 1, error: "only a person approves"})});
    await settled();
    expect(button().textContent).toContain("Approve");
    expect(element.querySelector("[data-dock-failure]").textContent).toContain("only a person approves");
});

test("a refused close of a docked card says why on the card", async () => {
    vi.stubGlobal("fetch", perLine(async () => ({json: async () => ({code: 1, error: "this card stays"})})));
    const element = document.createElement("div");
    mountedApp(createApp({setup: () => () => h(DockStack, {items: [REPORT_DOCK]}), provide: {[WINDOW_CONTEXT]: dockWindow([REPORT_DOCK])}}), element);
    mounted.push(element);
    await settled();
    element.querySelector("[data-dock-action='undock']").click();
    await settled();
    expect(element.querySelector("[data-dock-failure]").textContent).toContain("this card stays");
});

// task 5498: version 4's docked cards fold as the chat is scrolled up and open again at its foot, and the person folds one by hand
test("docked cards fold when the chat is scrolled up, open at its foot, and a hand fold holds", async () => {
    const element = await mountedChat();
    const history = element.querySelector(".history");
    Object.defineProperty(history, "scrollHeight", {value: 1000, configurable: true});
    Object.defineProperty(history, "clientHeight", {value: 300, configurable: true});
    const scrollTo = async (top, delay = 260) => {
        history.scrollTop = top;
        history.dispatchEvent(new Event("scroll"));
        await new Promise((resolve) => setTimeout(resolve, delay));
        await settled();
    };
    const folded = () => element.querySelector(".chat-dock-body")?.classList.contains("folded");
    const collapsed = () => element.querySelector(".chat-dock")?.classList.contains("collapsed");
    expect(collapsed()).toBe(false);
    await scrollTo(700);
    expect(collapsed()).toBe(false);
    await scrollTo(300, 3100);
    expect(collapsed()).toBe(true);
    await scrollTo(700);
    expect(collapsed()).toBe(false);
    element.querySelector("[data-dock-fold]").click();
    await settled();
    expect(folded()).toBe(true);
    await scrollTo(100);
    await scrollTo(700);
    expect(folded()).toBe(true);
});

test("pins: a strip above the chat holds each pin with its text, a button with its link and a close cross", async () => {
    const pin = {id: 1, title: "Version 5 demo seeded", link: "http://127.0.0.1:8431/", label: "Open the demo", closed_at: null};
    const element = await mountedChat({"pin list": [pin]});
    const strip = element.querySelector("[data-pins]");
    expect(strip?.textContent).toContain("Version 5 demo seeded");
    expect(strip?.querySelector("a, button")?.textContent).toContain("Open the demo");
    expect(strip?.querySelector("[data-pin-close]")).not.toBeNull();
});

test("composer: a tall box that says Message the agent, with an attach button and Dump files", async () => {
    const element = await mountedChat();
    expect(element.querySelector("textarea")?.getAttribute("placeholder")).toBe("Message the agent");
    expect(element.querySelector("[data-attach]")).not.toBeNull();
    expect([...element.querySelectorAll("button")].map((button) => button.textContent.trim())).toContain("Dump files");
});

// version 4: one button in the composer's corner, Dump files while the box holds no text and Send once something is typed
test("composer: the corner button is Dump files while the box is empty and Send as soon as something is typed", async () => {
    const element = await mountedChat();
    const corner = () => [...element.querySelectorAll(".composer-send")].map((button) => button.textContent.trim());
    expect(corner()).toEqual(["Dump files"]);
    const box = element.querySelector("textarea");
    box.value = "Hello";
    box.dispatchEvent(new Event("input"));
    await settled();
    expect(corner()).toEqual(["Send"]);
    box.value = "   ";
    box.dispatchEvent(new Event("input"));
    await settled();
    expect(corner()).toEqual(["Dump files"]);
});

async function pasteFiles(element, names) {
    const paste = new Event("paste", {bubbles: true, cancelable: true});
    paste.clipboardData = {files: names.map((name) => new File(["x"], name))};
    element.querySelector("textarea").dispatchEvent(paste);
    await settled();
}

test("composer: the offer to dump several files shows only while the box holds no text", async () => {
    const element = await mountedChat();
    await pasteFiles(element, ["one.png", "two.png"]);
    const offer = () => element.querySelector("[data-dump-offer]");
    expect(offer()?.textContent.trim()).toBe("Dump 2 files");
    const box = element.querySelector("textarea");
    box.value = "Look at these";
    box.dispatchEvent(new Event("input"));
    await settled();
    expect(offer()).toBeNull();
    expect(element.querySelector("[data-send]")).not.toBeNull();
    box.value = "";
    box.dispatchEvent(new Event("input"));
    await settled();
    expect(offer()).not.toBeNull();
});

test("composer: a second file with the same name is left out, so one chip and one upload", async () => {
    const element = await mountedChat();
    await pasteFiles(element, ["same.png", "same.png"]);
    expect(uploads).toEqual(["same.png"]);
    await pasteFiles(element, ["same.png", "other.png"]);
    expect(uploads).toEqual(["same.png", "other.png"]);
    expect(element.querySelector("[data-send]")).not.toBeNull();
});

test("the running command bar sits above the docks, and the docks on the composer", async () => {
    const element = await mountedChat();
    const docks = element.querySelector("[data-figure-chat-foot]");
    const running = element.querySelector(".running-strip");
    const composer = element.querySelector("form.composer");
    expect(running.compareDocumentPosition(docks) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(docks.compareDocumentPosition(composer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("composer: Dump files opens a form where pasted paragraphs and dropped files become the parts of one dump made through dump make", async () => {
    const element = await mountedChat();
    element.querySelector("[data-dump-files]").click();
    await settled();
    const notes = element.querySelector("[data-dump-form] textarea");
    expect(notes).not.toBeNull();
    notes.value = "The cart rounds twice\n\nShip on Friday";
    notes.dispatchEvent(new Event("input"));
    await settled();
    element.querySelector("[data-dump-make]").click();
    await settled();
    expect(runs).toEqual([["dump", "make", "The cart rounds twice", "--parts", "The cart rounds twice | Ship on Friday"]]);
    expect(element.querySelector("[data-dump-form]")).toBeNull();
});

test("composer: the running tool rolls at the foot of the chat, and a button scrolls the chat to its newest", async () => {
    const element = await mountedChat({"usage tool": {tool: "mcp__playwright__browser_navigate"}});
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(element.querySelector("[data-running-command]")?.textContent).toContain("browser_navigate");
    expect(element.querySelector("[data-scroll-foot]")).not.toBeNull();
});

test("bars: an agent bar names the agent's state and task, and an information bar its context use and model", () => {
    const files = Object.keys(import.meta.glob("../src/shell/*.vue"));
    expect(files).toContain("../src/shell/AgentBar.vue");
    expect(files).toContain("../src/shell/InformationBar.vue");
});

test("bars: each window button carries its own icon before its own label", async () => {
    const offered = ["questions.waiting", "agents.helpers"].map((name) => ({name, module: "journal", title: name === "questions.waiting" ? "Waiting" : "Helpers", icon: "window", options: [], allowed: true, unavailable_reason: ""}));
    const catalogue = new WindowCatalogue(async () => ({windows: offered}));
    catalogue.windows.value = offered;
    const store = paneLayout({saved: async () => null, defaults: async () => ({tabs: ["messages.chat"], active: "messages.chat"}), save: async () => ({ok: true, version: 1}), tab: {read: () => null, write: () => {}}, entry: () => null});
    await store.load({environment: "main", person: 1, suite: "coding", page: "home", driver: "coding.builder"});
    vi.stubGlobal("innerWidth", 1280);
    const element = document.createElement("div");
    document.body.append(element);
    mountedApp(createApp(() => h(PaneStage, {store, catalogue, subscriptions: new WindowSubscriptions(), environment: "main", face: "person"})), element);
    mounted.push(element);
    await nextTick();
    await settled();
    element.querySelector("[data-add-window]").click();
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

test("composer: a comment on a message to a worker shows in the band under the word Comment and goes as a comment", async () => {
    const element = await mountedChat({"message feed": [{id: 5, type: "peer", text: "Check the cart", recipient: "worker 12", created_at: "2026-11-01T05:00:00+00:00"}]});
    element.querySelector("[data-growing-comment]").click();
    await settled();
    expect(element.querySelector("[data-composer-quote]").textContent).toContain("Comment on: Check the cart");
    const box = element.querySelector(".composer-input");
    box.value = "And the till";
    box.dispatchEvent(new Event("input"));
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settled();
    expect(runs).toContainEqual(["message", "comment", "5", "And the till"]);
    expect(element.querySelector("[data-composer-quote]")).toBeNull();
});

test("composer: a reply names what it answers and goes as a reply, and the arrow up edits the newest unread message", async () => {
    const element = await mountedChat({"message feed": [{id: 4, type: "user", text: "Fix the cart", created_at: "2026-11-01T05:00:00+00:00"}]});
    element.querySelector("[data-message-action='reply']").click();
    await settled();
    expect(element.querySelector("[data-composer-quote]").textContent).toContain("Fix the cart");
    const box = element.querySelector(".composer-input");
    box.value = "Done";
    box.dispatchEvent(new Event("input"));
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settled();
    expect(runs).toContainEqual(["message", "reply", "4", "Done"]);
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp"}));
    await settled();
    expect(box.value).toBe("Fix the cart");
    expect(element.querySelector("[data-composer-quote]").textContent).toContain("Editing message 4");
    box.value = "Fix the cart now";
    box.dispatchEvent(new Event("input"));
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settled();
    expect(runs).toContainEqual(["message", "edit", "4", "--text", "Fix the cart now"]);
});

test("composer: a draft survives a remount, enter sends, shift enter does not, and the slash key focuses the box", async () => {
    localStorage.clear();
    const first = await mountedChat();
    const box = first.querySelector(".composer-input");
    box.value = "half a thought";
    box.dispatchEvent(new Event("input"));
    await settled();
    expect(localStorage.getItem("journal.draft.undefined") ?? localStorage.getItem("journal.draft.main")).toBe("half a thought");
    const second = await mountedChat();
    expect(second.querySelector(".composer-input").value).toBe("half a thought");
    const shifted = new KeyboardEvent("keydown", {key: "Enter", shiftKey: true, bubbles: true, cancelable: true});
    second.querySelector(".composer-input").dispatchEvent(shifted);
    expect(shifted.defaultPrevented).toBe(false);
    second.querySelector(".composer-input").blur();
    window.dispatchEvent(new KeyboardEvent("keydown", {key: "/", bubbles: true, cancelable: true}));
    await settled();
    expect(document.activeElement).toBe(second.querySelector(".composer-input"));
    localStorage.clear();
});
