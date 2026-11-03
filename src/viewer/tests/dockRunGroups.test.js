import {createApp, h, nextTick} from "vue";
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

const LEAVE_SECONDS = 5;
const DECLARATION = {type: "processes.output", icon: "terminal", title: "Output {row_id}", body_url: "", leaves_after_seconds: LEAVE_SECONDS, draws_head: true, buttons: [], reads: []};
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

function stacked(items) {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(DockStack, {items})});
    app.provide(WINDOW_CONTEXT, {environment: "main"});
    app.mount(host);
    return host;
}

const running = (id) => ({id, type: "processes.output", state: "docked", kept: false, leaves_at: null, target_model: "processes", target_id: id, text: ""});
const finished = (id) => ({...running(id), leaves_at: Date.now() / 1000 + LEAVE_SECONDS});
const chips = (host) => host.querySelectorAll(".dock-runs-chips > *").length;
const cards = (host) => host.querySelectorAll("[data-dock-action=undock]").length;

async function pass(seconds) {
    vi.advanceTimersByTime(seconds * 1000);
    await nextTick();
    vi.advanceTimersByTime(DOCK_ARRIVAL_MS + 100);
    await nextTick();
}

test("a finished run that sits in a group leaves after 5 seconds", async () => {
    const host = stacked([running(1), running(2), finished(3)]);
    await nextTick();
    expect(host.querySelector("[data-dock-runs-open]")).not.toBeNull();
    expect(chips(host)).toBe(3);
    expect(host.querySelectorAll(".dock-runs-chips .dock-leave").length).toBe(1);
    await pass(LEAVE_SECONDS + 1);
    expect(host.querySelector("[data-dock-runs-open]")).not.toBeNull();
    expect(chips(host)).toBe(2);
});

test("a group with fewer than 2 running runs dissolves into single cards, the finished ones counting down", async () => {
    const host = stacked([running(1), finished(2), finished(3)]);
    await nextTick();
    expect(host.querySelector("[data-dock-runs-open]")).toBeNull();
    expect(cards(host)).toBe(3);
    expect(host.querySelectorAll(".dock-leave").length).toBe(2);
    await pass(LEAVE_SECONDS + 1);
    expect(cards(host)).toBe(1);
});

test("a group of 2 running runs and a finished one stays a group", async () => {
    const host = stacked([running(1), running(2), finished(3)]);
    await nextTick();
    expect(cards(host)).toBe(0);
    expect(chips(host)).toBe(3);
});
