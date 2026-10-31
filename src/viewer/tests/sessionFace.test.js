import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import WindowShell from "../src/windows/WindowShell.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";

const summary = {name: "notes.summary", title: "Notes summary", entry_url: "", line: "task list", loading: "document", reads: ["task list"], runs: [], unavailable_reason: ""};
const calendar = {...summary, name: "notes.calendar", title: "Notes calendar", line: "plan list"};
const DESKTOP_WIDTH = 1200;
const NARROW_WIDTH = 600;

afterEach(() => vi.unstubAllGlobals());

async function settled() {
    for (let round = 0; round < 5; round++) {
        await new Promise((resolve) => setTimeout(resolve));
        await nextTick();
    }
}

async function shell(session, width) {
    vi.stubGlobal("innerWidth", width);
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 0, value: {rows: []}, error: ""})}));
    const catalogue = new WindowCatalogue(async () => ({windows: [summary, calendar]}));
    const element = document.createElement("div");
    createApp(() => h(WindowShell, {environment: "main", layout: ["notes.summary", "notes.calendar"], catalogue, events: () => () => {}, session: async () => session})).mount(element);
    await settled();
    return element;
}

test("the shell shows the face of the session it was opened with", async () => {
    expect((await shell({type: "phone", person_id: 1}, DESKTOP_WIDTH)).querySelector(".window-shell").dataset.face).toBe("phone");
    expect((await shell({type: "share", share: {name: "Checkout", ends_at: "2026-11-30"}}, DESKTOP_WIDTH)).querySelector(".window-shell").dataset.face).toBe("share");
    expect((await shell({type: "person", person_id: 1}, DESKTOP_WIDTH)).querySelector(".window-shell").dataset.face).toBe("person");
});

test("a person on a narrow screen keeps the person face and gets the stacked panes", async () => {
    const element = await shell({type: "person", person_id: 1}, NARROW_WIDTH);
    expect(element.querySelector(".window-shell").dataset.face).toBe("person");
    expect(element.querySelector(".pane-grid.stacked")).not.toBeNull();
});
