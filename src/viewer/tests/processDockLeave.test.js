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

const process = (extra) => ({id: 1, type: "processes.output", state: "docked", kept: false, leaves_at: null, target_model: "processes", target_id: 3, text: "", ...extra});

test("a docked process that has completed shows a line along its top and undocks after 5 seconds", async () => {
    const host = stacked([process({leaves_at: Date.now() / 1000 + LEAVE_SECONDS})]);
    await nextTick();
    expect(host.querySelector("[data-dock-action=undock]")).not.toBeNull();
    expect(host.querySelector(".dock-leave i").style.animationDuration).toBe("5s");
    vi.advanceTimersByTime(4000);
    await nextTick();
    expect(host.querySelector("[data-dock-action=undock]")).not.toBeNull();
    vi.advanceTimersByTime(1500);
    await nextTick();
    vi.advanceTimersByTime(DOCK_ARRIVAL_MS + 100);
    await nextTick();
    expect(host.querySelector("[data-dock-action=undock]")).toBeNull();
});

test("a docked process that still runs has no line and stays", async () => {
    const host = stacked([process()]);
    vi.advanceTimersByTime(60000);
    await nextTick();
    expect(host.querySelector("[data-dock-action=undock]")).not.toBeNull();
    expect(host.querySelector(".dock-leave")).toBeNull();
});

test("a docked process bar has a pin, and an unpin once it is kept", async () => {
    const host = stacked([process()]);
    await nextTick();
    const pin = host.querySelector("[data-dock-action=keep]");
    expect(pin.textContent.trim()).toBe("");
    expect(pin.getAttribute("aria-label")).toBe("Pin");
    expect(pin.getAttribute("title")).toBe("Pin");
    expect(pin.querySelector("svg")).not.toBeNull();
    app.unmount();
    const kept = stacked([process({kept: true})]);
    await nextTick();
    expect(kept.querySelector("[data-dock-action=unkeep]").getAttribute("aria-label")).toBe("Unpin");
    expect(kept.querySelector("[data-dock-action=unkeep]").textContent.trim()).toBe("");
    expect(kept.querySelector("[data-dock-action=keep]")).toBeNull();
});
