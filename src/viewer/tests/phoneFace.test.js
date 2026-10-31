import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {settled} from "./settled.js";
import PaneStage from "../src/windows/PaneStage.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {paneLayout} from "../src/windows/paneLayout.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";

const PHONE_WIDTH = 400;
const TITLES = {"messages.chat": "Chat", "questions.waiting": "Waiting", "tasks.tasks": "Tasks", "plans.plans": "Plans"};
const fake = (name) => ({name, title: TITLES[name], icon: "window", options: [], line: "task list", loading: "document", reads: [], runs: [], events: [], unavailable_reason: "", allowed: true});
const PHONE_LAYOUT = {
    dir: "row",
    r: 0.5,
    a: {tabs: ["tasks.tasks"], active: "tasks.tasks"},
    b: {dir: "col", r: 0.5, a: {tabs: ["messages.chat"], active: "messages.chat"}, b: {tabs: ["questions.waiting", "plans.plans"], active: "questions.waiting"}},
};

let mounted = [];

async function phone({offers = Object.keys(TITLES)} = {}) {
    const store = paneLayout({saved: async () => null, defaults: async () => PHONE_LAYOUT, save: async () => ({ok: true, version: 1}), tab: {read: () => null, write: () => {}}, entry: (name) => (offers.includes(name) ? fake(name) : null)});
    await store.load({environment: "main", person: 1, suite: "coding", page: "home", driver: "coding.builder"});
    const catalogue = new WindowCatalogue(async () => ({windows: []}));
    catalogue.windows.value = offers.map(fake);
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(PaneStage, {store, catalogue, subscriptions: new WindowSubscriptions(), environment: "main", face: "phone"})).mount(element);
    mounted.push(element);
    await settled();
    return element;
}

const shown = (element) => [...element.querySelectorAll("section.pane")].filter((pane) => !pane.hidden).map((pane) => pane.querySelector(".window")?.dataset.window ?? pane.textContent.trim());
const barNames = (element) => [...element.querySelectorAll(".phone-bar [data-phone-window]")].map((button) => button.dataset.phoneWindow);

beforeEach(() => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 0, value: {rows: [], total: 0}, error: ""})}));
    vi.stubGlobal("requestAnimationFrame", (run) => setTimeout(run, 0));
});

afterEach(() => {
    mounted.forEach((element) => element.remove());
    mounted = [];
    vi.unstubAllGlobals();
});

test("a phone shows one pane at a time, the chat first, with a bar at the bottom naming every window of its layout", async () => {
    const element = await phone();
    expect(shown(element)).toEqual(["messages.chat"]);
    expect(barNames(element)[0]).toBe("messages.chat");
    expect(new Set(barNames(element))).toEqual(new Set(Object.keys(TITLES)));
    expect(element.querySelector(".phone-bar [data-phone-window='messages.chat']").getAttribute("aria-current")).toBe("page");
});

test("a tap on a window in the bar shows that window alone", async () => {
    const element = await phone();
    element.querySelector(".phone-bar [data-phone-window='tasks.tasks']").click();
    await settled();
    expect(shown(element)).toEqual(["tasks.tasks"]);
    element.querySelector(".phone-bar [data-phone-window='plans.plans']").click();
    await settled();
    expect(shown(element)).toEqual(["plans.plans"]);
});

test("a phone draws no resize separator, no pane menu with detach, and no tab strip to drag", async () => {
    const element = await phone();
    expect(element.querySelector(".pane-split")).toBeNull();
    expect(element.querySelector("[data-tabs-of]")).toBeNull();
    expect(element.querySelector("[data-menu='detach']")).toBeNull();
});

test("a window no installed module has keeps its place in the bar and shows its placeholder", async () => {
    const element = await phone({offers: ["messages.chat", "questions.waiting", "tasks.tasks"]});
    expect(barNames(element)).toContain("plans.plans");
    element.querySelector(".phone-bar [data-phone-window='plans.plans']").click();
    await settled();
    expect(element.textContent).toContain("No installed module has this window.");
});

test("a phone opened from a notice's link shows the window that holds the row", async () => {
    vi.stubGlobal("location", {...window.location, hash: "#open=plans%3A4"});
    const element = await phone();
    expect(shown(element)).toEqual(["plans.plans"]);
});
