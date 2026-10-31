import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import WindowShell from "../src/windows/WindowShell.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {settledByTimer} from "./settled.js";

const summary = {name: "notes.summary", title: "Notes summary", entry_url: "", line: "task list", loading: "document", reads: ["task list"], runs: [], unavailable_reason: ""};
const calendar = {...summary, name: "notes.calendar", title: "Notes calendar", line: "plan list"};

afterEach(() => vi.unstubAllGlobals());

test("a registry sync asks for the windows again: a removed window shows as not installed and a new one joins the menu", async () => {
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 1, value: null, error: "the line was refused"})}));
    const answers = [{windows: [summary]}, {windows: [calendar]}];
    const catalogue = new WindowCatalogue(async () => answers.shift());
    let heard = null;
    const events = (environment, listener) => {
        heard = listener;
        return () => {};
    };
    const element = document.createElement("div");
    createApp(() => h(WindowShell, {environment: "main", layout: ["notes.summary"], catalogue, events})).mount(element);
    await settledByTimer();
    expect(element.textContent).toContain("the line was refused");
    expect(element.querySelector(`[data-reopen="notes.calendar"]`)).toBeNull();

    await heard({event: "registry.sync"});
    await settledByTimer();
    expect(element.textContent).toContain("No installed module has this window.");
    expect(element.querySelector(`[data-reopen="notes.calendar"]`)).not.toBeNull();
    expect(element.querySelectorAll(".window")).toHaveLength(1);
});

test("a hidden window's events wait, and it hears one refresh when it shows again", async () => {
    const {WindowSubscriptions} = await import("../src/windows/windowSubscriptions.js");
    const subscriptions = new WindowSubscriptions();
    const heard = [];
    let visible = false;
    subscriptions.follow("notes.board", ["task.*"], (event) => heard.push(event.event), () => visible);
    subscriptions.dispatch({event: "task.create"});
    subscriptions.dispatch({event: "task.start"});
    expect(heard).toEqual([]);
    visible = true;
    subscriptions.shown("notes.board");
    subscriptions.dispatch({event: "task.done"});
    expect(heard).toEqual(["refresh", "task.done"]);
});

test("a page window of a module the journal does not ship shows how to trust its module until the person trusts it", async () => {
    const page = {name: "pages.board", module: "pages", title: "Board", entry_url: "/modules/pages/board.js?v=1", line: "", loading: "component", reads: [], runs: [], events: [], unavailable_reason: "", allowed: false};
    const catalogue = new WindowCatalogue(async () => ({windows: [page]}));
    const access = {window: "pages.board", reads_allowed: "", reads_missing: "", runs_allowed: "", runs_missing: "", component_trusted: false};
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 0, value: access, error: ""})}));
    const element = document.createElement("div");
    createApp(() => h(WindowShell, {environment: "main", layout: ["pages.board"], catalogue, events: () => () => {}})).mount(element);
    await settledByTimer();
    await new Promise((resolve) => setTimeout(resolve));
    expect(element.textContent).toContain("journal window trust pages");
});
