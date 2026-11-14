import {createApp, h, nextTick, reactive} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import MarkHost from "../src/chat/MarkHost.vue";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";

const RUN = {id: 1, type: "processes.command", variant: "running", text: "Running tests", figure: "10%", fraction: 0.1, target_model: "process", target_id: 7, state: "running", ended_at: null};

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
});

async function drawn(mark, docked = false) {
    const reads = [];
    const context = {read: async (line) => (reads.push(line), {ok: true, value: {rows: [{progress: 62}]}}), run: async () => ({ok: true, value: {lines: []}})};
    const element = document.createElement("div");
    const app = createApp({render: () => h(MarkHost, {mark, docked})});
    app.provide(WINDOW_CONTEXT, context);
    app.mount(element);
    for (let round = 0; round < 5; round++) await nextTick();
    return {element, reads};
}

test("a running run's mark makes no output list request and shows the figure the journal wrote on it", async () => {
    const {element, reads} = await drawn(RUN);
    await vi.advanceTimersByTimeAsync(10000);
    expect(reads).toEqual([]);
    expect(element.textContent).toContain("10%");
});

test("a running run's mark moves when the journal changes its figure", async () => {
    const mark = reactive({...RUN});
    const {element} = await drawn(mark);
    Object.assign(mark, {figure: "62%", fraction: 0.62});
    await nextTick();
    expect(element.textContent).toContain("62%");
    expect(element.textContent).not.toContain("10%");
});

test("an ended mark reads nothing", async () => {
    const {reads} = await drawn({...RUN, ended_at: "2026-11-02T10:00:00Z", state: "ended"});
    expect(reads).toEqual([]);
});

test("a docked row's mark steps back and does not say it is in the dock, and one not docked does not step back", async () => {
    const docked = await drawn(RUN, true);
    expect(docked.element.querySelector(".thread-turn.card.docked")).not.toBeNull();
    expect(docked.element.textContent).not.toContain("In the dock");
    const free = await drawn(RUN);
    expect(free.element.querySelector(".docked")).toBeNull();
    expect(free.element.textContent).not.toContain("In the dock");
});
