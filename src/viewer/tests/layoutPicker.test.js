import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import LayoutThumb from "../src/kit/LayoutThumb.vue";
import PaneStage from "../src/windows/PaneStage.vue";
import {paneLayout} from "../src/windows/paneLayout.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {thumbnail} from "../src/domain/panes.js";

const entry = (name) => ({name, title: name, icon: "window", options: [], line: "task list", loading: "document", reads: [], runs: [], events: [], unavailable_reason: "", allowed: true});
const SHAPE = {direction: "row", share: 0.5, first: {windows: ["messages.chat"], active: "messages.chat"}, second: {windows: ["thirdparty.board"], active: "thirdparty.board"}};

afterEach(() => vi.unstubAllGlobals());

test("the thumbnail draws a cell per active window, the chat in the accent and a third party's window in the neutral colour", async () => {
    const cells = thumbnail({dir: "row", r: 0.5, a: {tabs: ["messages.chat", "tasks.tasks"], active: "messages.chat"}, b: {tabs: ["thirdparty.board"], active: "thirdparty.board"}});
    const element = document.createElement("div");
    createApp(() => h(LayoutThumb, {cells})).mount(element);
    await nextTick();
    const drawn = [...element.querySelectorAll(".layout-cell")];
    expect(drawn).toHaveLength(2);
    expect(drawn[0].classList.contains("chat")).toBe(true);
    expect(drawn[1].className).toBe("layout-cell module-thirdparty");
});

for (const [page, width] of [["home", 1200], ["home", 400], ["agent", 1200], ["agent", 400]]) {
    test(`the picker opens on the ${page} page at ${width} px wide and lists the suite's presets`, async () => {
        vi.stubGlobal("innerWidth", width);
        vi.stubGlobal("ResizeObserver", class {
            observe() {}
            disconnect() {}
            unobserve() {}
        });
        const shellLine = async (line) => (line[0] === "suite" ? {ok: true, value: {presets: [{key: "default", name: "Default", text: "Chat and a board", shape: SHAPE}]}} : {ok: true, value: {presets: []}});
        const catalogue = new WindowCatalogue(async () => ({windows: []}));
        catalogue.windows.value = [entry("messages.chat"), entry("thirdparty.board")];
        const store = paneLayout({
            saved: async () => null,
            defaults: async () => ({tabs: ["messages.chat"], active: "messages.chat"}),
            save: async () => ({ok: true, version: 1}),
            tab: {read: () => null, write: () => {}},
            entry: (name) => catalogue.window(name),
        });
        await store.load({environment: "main", person: 1, suite: "coding", page, driver: "coding.builder"});
        const element = document.createElement("div");
        document.body.append(element);
        const app = createApp(() => h(PaneStage, {store, catalogue, subscriptions: new WindowSubscriptions(), environment: "main", page, shellRead: shellLine}));
        app.mount(element);
        for (let round = 0; round < 6; round++) await new Promise((resolve) => setTimeout(resolve));
        [...element.querySelectorAll("button")].find((button) => button.textContent.includes("Presets")).click();
        await nextTick();
        await nextTick();
        const rows = [...document.body.querySelectorAll(".preset")];
        expect(rows.map((row) => row.textContent)).toEqual([expect.stringContaining("Default")]);
        expect(rows[0].querySelectorAll(".layout-cell")).toHaveLength(2);
        app.unmount();
        element.remove();
    });
}
