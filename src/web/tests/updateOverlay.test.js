import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {api} = await import("../src/api/client.js");
const {store} = await import("../src/state/store.js");
const {closeUpdate, updateView} = await import("../src/state/overlays.js");
const {default: RowDock} = await import("../src/chat/RowDock.vue");
const {default: UpdateOverlay} = await import("../src/chat/UpdateOverlay.vue");

const update = {table: "reports", id: 5, title: "Update 2026-10-23 at 09.00", abstract: "The parser reads the grammar.", kind: "update",
    items: [{section: "done", ref: "tasks:1", title: "the parser", note: ""}, {section: "commits", ref: "messages:3", title: "Ship the parser", note: "the slow part"}, {section: "need", ref: "questions:2", title: "Which colour?", note: ""}]};
const docked = {table: "messages", id: 9, author: "system", text: "Report 5", data: {kind: "made", row: "reports:5", heading: "Report 5: Update", summary: "The parser reads the grammar. (1 waits on you, 1 done, 1 commit)", docked: true,
    dock: {buttons: [{label: "Open update", act: "open_update"}, {label: "Close", act: "close"}], folds: true}}};
let app = null;

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
    store.rows.reports = [];
    closeUpdate();
    vi.restoreAllMocks();
});

function mounted(component, props = {}) {
    const host = document.createElement("div");
    host.className = "thread";
    document.body.append(host);
    app = createApp({render: () => h(component, props)});
    app.provide("scope", {api});
    app.directive("tip", {});
    app.mount(host);
    return host;
}

test("an update's card above the chat opens it over the chat, by section, and opening it marks it read", async () => {
    const read = vi.spyOn(api, "act").mockResolvedValue({});
    store.rows.reports = [update];
    let host = mounted(RowDock, {message: docked});
    await flush();
    const button = [...host.querySelectorAll("button")].find((b) => b.textContent.trim() === "Open update");
    button.click();
    await flush();
    expect(updateView.id).toBe(5);
    app.unmount();
    host = mounted(UpdateOverlay);
    await flush();
    expect([...host.querySelectorAll(".update-section")].map((s) => s.textContent)).toEqual(["Waits on you", "Done", "Commits"]);
    expect(host.querySelector(".update-note").textContent).toBe("the slow part");
    expect(read).toHaveBeenCalledWith("reports", 5, "read");
});
