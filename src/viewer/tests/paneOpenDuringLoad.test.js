import {createApp, h, nextTick, ref} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {paneLayout} from "../src/windows/paneLayout.js";
import {usePaneActions} from "../src/composables/paneActions.js";
import {arranged, fresh} from "../src/domain/panes.js";

const KEY = {environment: "main", person: 7, suite: "sample", page: "home", driver: "sample.main"};
const CHAT = arranged(fresh(), {tabs: ["messages.chat"], active: "messages.chat"}).layout;
const mounted = [];
beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("BroadcastChannel", class { postMessage() {} close() {} });
});
afterEach(() => {
    for (const app of mounted.splice(0)) app.unmount();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

async function openingBeforeLoad(cached) {
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    const store = paneLayout({saved: () => gate, defaults: async () => null, save: async () => ({ok: true}),
        tab: {read: () => cached, write: () => {}}, copy: {read: () => null, write: () => {}},
        entry: (name) => ({name, title: name, place: "pane", shows: "environment"})});
    let actions;
    const app = createApp({setup() {
        actions = usePaneActions({store, area: ref(null), catalogue: {windows: ref([])}, counts: {}, environment: "main"});
        return () => h("div");
    }});
    app.mount(document.createElement("div"));
    mounted.push(app);
    const loading = store.load(KEY);
    await nextTick();
    expect(store.loaded.value).toBe(false);
    actions.openView("agents.agents");
    release({layout: CHAT, version: 1});
    await loading;
    await nextTick();
    const pane = Object.values(store.layout.value.panes)[0];
    expect(pane.tabs).toEqual(["messages.chat", "agents.agents"]);
    expect(pane.active).toBe("agents.agents");
}

test("a header opening a window during the first layout read is kept", async () => {
    await openingBeforeLoad(null);
});

test("a header opening a window on a cached layout survives the server read", async () => {
    await openingBeforeLoad(CHAT);
});
