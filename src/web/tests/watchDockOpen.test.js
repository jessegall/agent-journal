import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

const {api} = await import("../src/api/client.js");
const {choose} = await import("../src/state/environment.js");
const {default: WatchDock} = await import("../src/chat/WatchDock.vue");

const watched = {table: "messages", id: 7, author: "system", text: "Running the tests", data: {kind: "card", output: 12, line: "pytest -q", lines: ["FAILED test_b"], figure: "Tests 40%", fraction: 0.4, docked: true}};
let app = null;
choose("main");

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

test("a docked output is titled in words, names its command beneath, and opens on a click to its whole output in a box that scrolls", async () => {
    const read = vi.spyOn(api, "readOutput").mockResolvedValue({command: "pytest -q", outcome: "running", lines: ["collecting", "FAILED test_b", "[ 40%] test_c"]});
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(WatchDock, {message: watched})});
    app.directive("tip", {});
    app.mount(host);
    await flush();
    expect(host.querySelector(".watch-dock-label").textContent.trim()).toBe("Running the tests");
    expect(host.querySelector(".watch-dock-command").textContent).toBe("pytest -q");
    expect(host.querySelector(".watch-dock-output")).toBeNull();
    host.querySelector(".watch-dock-label").click();
    await flush();
    expect(read).toHaveBeenCalledWith(12);
    expect(host.querySelector(".watch-dock-output").textContent).toBe("collecting\nFAILED test_b\n[ 40%] test_c");
    host.querySelector(".watch-dock-label").click();
    await flush();
    expect(host.querySelector(".watch-dock-output")).toBeNull();
});

test("an ended run's dock is outlined green when it passed and red when it failed, and a running one is not outlined", async () => {
    const outlines = [];
    for (const data of [{tone: "good", ending: "finished"}, {tone: "bad", ending: "failed with code 1"}, {tone: "", ending: ""}]) {
        const host = document.createElement("div");
        document.body.append(host);
        app = createApp({render: () => h(WatchDock, {message: {...watched, data: {...watched.data, ...data}}})});
        app.directive("tip", {});
        app.mount(host);
        await flush();
        const card = host.querySelector(".chat-dock-card");
        outlines.push(["tone-good", "tone-bad"].filter((name) => card.classList.contains(name)));
        app.unmount();
        app = null;
    }
    expect(outlines).toEqual([["tone-good"], ["tone-bad"], []]);
});
