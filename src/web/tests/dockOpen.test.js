import {createApp, h} from "vue";
import {afterEach, describe, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

const {api} = await import("../src/api/client.js");
const {choose} = await import("../src/state/environment.js");
const {default: RowDock} = await import("../src/chat/RowDock.vue");
const {default: MadeCard} = await import("../src/chat/MadeCard.vue");
const {default: ResourceControls} = await import("../src/resource/ResourceControls.vue");

const dockedReport = {
    table: "messages",
    id: 41,
    author: "system",
    data: {
        kind: "docked",
        row: "reports:2",
        docked: true,
        heading: "Report 2: Found",
        summary: "What was found",
        dock: {
            buttons: [
                {label: "Open", act: "open"},
                {label: "Close", act: "close"},
            ],
            folds: true,
        },
    },
};
let app = null;
choose("main");

async function shown(component, props) {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(component, props)});
    app.directive("tip", {});
    app.mount(host);
    await flush();
    return host;
}

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

describe("a row docked above the chat", () => {
    test("stays docked when it is opened by its heading, its summary or its Open button", async () => {
        const act = vi.spyOn(api, "act").mockResolvedValue({});
        const host = await shown(RowDock, {message: dockedReport});
        host.querySelector(".row-dock-heading").click();
        host.querySelector(".row-dock-summary").click();
        [...host.querySelectorAll("button")].find((b) => b.textContent.trim() === "Open").click();
        await flush();
        expect(location.hash).toContain("reports:2");
        expect(act).not.toHaveBeenCalled();
    });

    test("is taken down by its close X alone", async () => {
        const act = vi.spyOn(api, "act").mockResolvedValue({});
        const host = await shown(RowDock, {message: dockedReport});
        host.querySelector('[aria-label^="Hide from chat"]').click();
        expect(act).toHaveBeenCalledWith("messages", 41, "undock");
    });

    test("and the dock and the made card offer no download", async () => {
        const dock = await shown(RowDock, {message: dockedReport});
        expect(dock.textContent).not.toContain("Download");
        app.unmount();
        const made = await shown(MadeCard, {made: {table: "reports", id: 2, title: "Report 2: Found", line: ""}});
        expect(made.textContent).not.toContain("Download");
        expect(made.querySelector("[download]")).toBeNull();
    });
});

describe("where a document is read", () => {
    test("a report and a doc offer Download, linking to their export, and a task does not", async () => {
        const report = await shown(ResourceControls, {resource: {table: "reports", id: 2, title: "Found", state: "open", files: []}});
        const download = report.querySelector("a.download");
        expect(download.textContent.trim()).toBe("Download");
        expect(download.getAttribute("href")).toContain("/journal/reports/2/export");
        expect(download.hasAttribute("download")).toBe(true);
        app.unmount();
        const doc = await shown(ResourceControls, {resource: {table: "docs", id: 3, title: "Notes", state: "open", files: []}});
        expect(doc.querySelector("a.download").getAttribute("href")).toContain("/journal/docs/3/export");
        app.unmount();
        const task = await shown(ResourceControls, {resource: {table: "tasks", id: 4, title: "Write it", state: "open", files: []}});
        expect(task.querySelector("a.download")).toBeNull();
    });
});
