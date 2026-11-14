import {nextTick} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {DOCK_ARRIVAL_MS} from "../src/kit/ChatDock.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {stacked, unmountStacked} from "./support/stackedDock.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

const LEAVE_SECONDS = 5;
const DECLARATION = {type: "processes.output", icon: "terminal", title: "Output {row_id}", body_url: "", leaves_after_seconds: LEAVE_SECONDS, draws_head: true, buttons: [], reads: []};

beforeEach(() => {
    vi.useFakeTimers();
    loadDockDeclarations([DECLARATION]);
});
afterEach(() => {
    unmountStacked();
    document.body.innerHTML = "";
    vi.useRealTimers();
});

const running = (id) => ({id, type: "processes.output", state: "docked", kept: false, leaves_at: null, target_model: "processes", target_id: id, text: ""});
const finished = (id) => ({...running(id), leaves_at: new Date(Date.now() + LEAVE_SECONDS * 1000).toISOString()});
const cards = (host) => host.querySelectorAll("[data-dock-action=undock]").length;

async function pass(seconds) {
    vi.advanceTimersByTime(seconds * 1000);
    await nextTick();
    vi.advanceTimersByTime(DOCK_ARRIVAL_MS + 100);
    await nextTick();
}

test("three running processes dock as three cards, with no shared row and no chips", async () => {
    const host = stacked([running(1), running(2), running(3)]);
    await nextTick();
    expect(cards(host)).toBe(3);
    expect(host.querySelector("[data-dock-runs-open]")).toBeNull();
    expect(host.querySelector(".dock-runs-chips")).toBeNull();
});

test("a finished run keeps its own card for 5 seconds with the others going on, and then leaves", async () => {
    const host = stacked([running(1), running(2), finished(3)]);
    await nextTick();
    expect(cards(host)).toBe(3);
    expect(host.querySelectorAll(".dock-leave").length).toBe(1);
    await pass(LEAVE_SECONDS + 1);
    expect(cards(host)).toBe(2);
});
