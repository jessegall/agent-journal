import {expect, test} from "vitest";
import {LayoutStore} from "../src/windows/layoutStore.js";
import {arranged, fresh} from "../src/domain/panes.js";

const shapeOf = (...windows) => ({tabs: windows, active: windows[0]});
const layoutOf = (...windows) => arranged(fresh(), shapeOf(...windows)).layout;

function store({saved = {}, defaults = {}} = {}) {
    const kept = [];
    const keyText = ({suite, page, driver}) => `${suite}/${page}/${driver}`;
    return {
        kept,
        layouts: new LayoutStore({
            saved: async (key) => (saved[keyText(key)] ? {layout: saved[keyText(key)], version: 1} : null),
            defaults: async ({page, driver}) => defaults[`${page}@${driver}`] ?? defaults[page] ?? null,
            save: async (key, layout) => kept.push([keyText(key), layout]),
        }),
    };
}

test("switching the suite loads the person's saved layout for the new suite, and switching back brings the first back", async () => {
    const coding = layoutOf("messages.chat", "tasks.tasks");
    const marketing = layoutOf("marketing.calendar");
    const {layouts} = store({saved: {"coding/home/coding.builder": coding, "marketing/home/marketing.lead": marketing}});
    expect((await layouts.layout({suite: "coding", page: "home", driver: "coding.builder"})).layout).toEqual(coding);
    expect((await layouts.layout({suite: "marketing", page: "home", driver: "marketing.lead"})).layout).toEqual(marketing);
    expect((await layouts.layout({suite: "coding", page: "home", driver: "coding.builder"})).layout).toEqual(coding);
});

test("with nothing saved, the suite's layout for the driver comes before its plain page layout", async () => {
    const {layouts} = store({defaults: {"home@coding.orchestrator": shapeOf("agents.agents"), home: shapeOf("messages.chat")}});
    expect((await layouts.layout({suite: "coding", page: "home", driver: "coding.orchestrator"})).layout).toEqual(layoutOf("agents.agents"));
    expect((await layouts.layout({suite: "coding", page: "home", driver: "coding.builder"})).layout).toEqual(layoutOf("messages.chat"));
});

test("an agent page keeps one layout per driver, so the main agent's and a worker's stay apart", async () => {
    const {layouts, kept} = store();
    await layouts.keep({suite: "coding", page: "agent", driver: "coding.builder"}, layoutOf("coding.file-feed"));
    await layouts.keep({suite: "coding", page: "agent", driver: "coding.worker"}, layoutOf("coding.terminal"));
    expect(kept.map(([key]) => key)).toEqual(["coding/agent/coding.builder", "coding/agent/coding.worker"]);
});

test("a stored layout that names a window no module has is loaded as it is and never saved over", async () => {
    const stored = layoutOf("messages.chat", "marketing.gone");
    const {layouts, kept} = store({saved: {"coding/home/coding.builder": stored}, defaults: {home: shapeOf("tasks.tasks")}});
    expect((await layouts.layout({suite: "coding", page: "home", driver: "coding.builder"})).layout).toEqual(stored);
    expect(kept).toEqual([]);
});

test("a stored layout of the wrong shape gives way to the suite's default", async () => {
    const {layouts} = store({saved: {"coding/home/coding.builder": {tree: "not a layout"}}, defaults: {home: shapeOf("messages.chat")}});
    expect((await layouts.layout({suite: "coding", page: "home", driver: "coding.builder"})).layout).toEqual(layoutOf("messages.chat"));
});
