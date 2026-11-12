import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import DockWrapper from "../src/chat/DockWrapper.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {settle} from "./support/windowContext.js";
import {dockWindow} from "./support/dockWindow.js";

const SOURCE = resolve(import.meta.dirname, "..");
const apps = [];
const STOP = {label: "Stop", runs: "output stop {row_id}"};

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function drawn(folded) {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}

        disconnect() {}
    });
    loadDockDeclarations([{type: "sample.process", icon: "docs", title: "{row_title}", reads: ["doc show"], folds: "Output", buttons: [STOP]}]);
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 0, value: {title: "Example"}})}));
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(DockWrapper, {item: {id: 7, type: "sample.process", target_model: "process", target_id: 3, row_title: "Example", created_at: new Date().toISOString()}, folded})});
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(host);
    apps.push(app);
    await settle();
    return host;
}

const stopButtons = (host) => [...host.querySelectorAll("button")].filter((button) => button.textContent.trim() === "Stop");

test("a folded process card shows no Stop button and an open one shows it", async () => {
    expect(stopButtons(await drawn(true))).toHaveLength(0);
    expect(stopButtons(await drawn(false))).toHaveLength(1);
});

test("the folded card keeps its fold toggle to open it again", async () => {
    const host = await drawn(true);
    expect(host.querySelector("[data-dock-fold]").getAttribute("aria-expanded")).toBe("false");
});

test("the progress bar of a folded card is larger and its unfilled part has its own theme color in both themes", () => {
    const dock = readFileSync(resolve(SOURCE, "../core/modules/processes/web/src/OutputDock.vue"), "utf8");
    const bar = dock.slice(dock.indexOf(".output-dock-percent {"), dock.indexOf("}", dock.indexOf(".output-dock-percent {")));
    expect(bar).toContain("--dock-bar-width: 64px");
    expect(bar).toContain("--dock-bar-height: 8px");
    expect(bar).toContain("background: var(--bar-track)");
    const track = (file) => readFileSync(resolve(SOURCE, "src", file), "utf8").match(/--bar-track: (#[0-9a-f]{6})/)[1];
    const hover = (file) => readFileSync(resolve(SOURCE, "src", file), "utf8").match(/--hover: (#[0-9a-f]{6})/)[1];
    for (const file of ["tokens.css", "light.css"]) expect(track(file)).not.toBe(hover(file));
});
