import {createApp, h, nextTick} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import WindowShell from "../src/windows/WindowShell.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {settledByTimer} from "./settled.js";
import {trackMutationObservers} from "./support/mutationObservers.js";

const summary = {name: "notes.summary", title: "Notes summary", entry_url: "", line: "task list", loading: "document", reads: ["task list"], runs: [], unavailable_reason: ""};
const calendar = {...summary, name: "notes.calendar", title: "Notes calendar", line: "plan list"};
const DESKTOP_WIDTH = 1200;
const NARROW_WIDTH = 600;

let apps = [];
let checkObservers;
beforeEach(() => { checkObservers = trackMutationObservers(); });
afterEach(() => {
    apps.forEach((app) => app.unmount());
    apps = [];
    checkObservers();
    vi.unstubAllGlobals();
});

async function shell(session, width) {
    vi.stubGlobal("innerWidth", width);
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 0, value: {rows: []}, error: ""})}));
    const catalogue = new WindowCatalogue(async () => ({windows: [summary, calendar]}));
    const element = document.createElement("div");
    const app = createApp(() => h(WindowShell, {environment: "main", layout: ["notes.summary", "notes.calendar"], catalogue, events: () => () => {}, session: async () => session}));
    app.mount(element);
    apps.push(app);
    await settledByTimer();
    return element;
}

test("the shell shows the face of the session it was opened with", async () => {
    expect((await shell({type: "phone", person_id: 1}, DESKTOP_WIDTH)).querySelector(".window-shell").dataset.face).toBe("phone");
    expect((await shell({type: "share", share: {name: "Checkout", ends_at: "2026-11-30"}}, DESKTOP_WIDTH)).querySelector(".window-shell").dataset.face).toBe("share");
    expect((await shell({type: "person", person_id: 1}, DESKTOP_WIDTH)).querySelector(".window-shell").dataset.face).toBe("person");
});

test("a user on a narrow screen keeps the user face and gets the stacked panes", async () => {
    const element = await shell({type: "person", person_id: 1}, NARROW_WIDTH);
    expect(element.querySelector(".window-shell").dataset.face).toBe("person");
    expect(element.querySelector(".pane-grid.stacked")).not.toBeNull();
});

test("the sidebar footer shows the journal version from the session", async () => {
    const element = await shell({type: "person", person_id: 1, journal_version: "5.7.3"}, DESKTOP_WIDTH);
    expect(element.querySelector(".sidebar-foot").textContent).toBe("Agent journal5.7.3");
});
