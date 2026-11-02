import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h, nextTick, reactive} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import DockStack from "../src/chat/DockStack.vue";
import {DOCK_ARRIVAL_MS} from "../src/kit/ChatDock.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const DECLARATION = {type: "plans.plan", icon: "plan", title: "Plan {row_id}", body_url: "", draws_head: false, buttons: [], reads: []};
const CHAT_DOCK = readFileSync(resolve(__dirname, "../src/kit/ChatDock.vue"), "utf8");
let app;

beforeEach(() => {
    vi.useFakeTimers();
    loadDockDeclarations([DECLARATION]);
});
afterEach(() => {
    app?.unmount();
    document.body.innerHTML = "";
    vi.useRealTimers();
});

const plan = (id, extra) => ({id, type: "plans.plan", state: "docked", kept: false, leaves_at: null, target_model: "plans", target_id: id, text: "", ...extra});

function stacked(items) {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(DockStack, {items})});
    app.provide(WINDOW_CONTEXT, {environment: "main"});
    app.mount(host);
    return host;
}

test("a card that docks comes in under the dock enter classes", async () => {
    const items = reactive([]);
    const host = stacked(items);
    items.push(plan(1));
    await nextTick();
    const dock = host.querySelector(".chat-dock");
    expect(dock.classList.contains("dock-enter-active")).toBe(true);
    vi.advanceTimersByTime(DOCK_ARRIVAL_MS + 50);
    await nextTick();
    expect(dock.classList.contains("dock-enter-active")).toBe(false);
});

test("a card that undocks stays for the length of its leave transition and then goes", async () => {
    const items = reactive([plan(1)]);
    const host = stacked(items);
    await nextTick();
    items.splice(0, 1);
    await nextTick();
    const dock = host.querySelector(".chat-dock");
    expect(dock.classList.contains("dock-leave-active")).toBe(true);
    vi.advanceTimersByTime(DOCK_ARRIVAL_MS + 50);
    await nextTick();
    expect(host.querySelector(".chat-dock")).toBeNull();
});

test("a card the journal docked by itself leaves with the soft timed look", async () => {
    const items = reactive([plan(1, {leaves_at: Date.now() / 1000 + 60})]);
    const host = stacked(items);
    await nextTick();
    expect(host.querySelector(".chat-dock").classList.contains("timed")).toBe(true);
});

test("the card slides and fades under the transition classes, and a reduced-motion setting turns them off", () => {
    expect(CHAT_DOCK).toMatch(/\.chat-dock\.dock-enter-from \.chat-dock-card,\n\.chat-dock\.dock-leave-to \.chat-dock-card \{\s*transform: translateY\(14px\);\s*opacity: 0;/);
    expect(CHAT_DOCK).toMatch(/\.chat-dock\.dock-enter-active \.chat-dock-card \{\s*transition:\s*transform[^;]*,\s*opacity/);
    expect(CHAT_DOCK).toMatch(/\.chat-dock\.dock-leave-active \.chat-dock-card \{\s*transition:\s*transform[^;]*,\s*opacity/);
    expect(CHAT_DOCK).toMatch(/prefers-reduced-motion: reduce\) \{[^}]*\.chat-dock\.dock-leave-active/);
});
