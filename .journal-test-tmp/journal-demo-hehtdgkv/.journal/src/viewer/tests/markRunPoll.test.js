import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import MarkHost from "../src/chat/MarkHost.vue";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";

const RUN = {id: 1, type: "processes.command", variant: "running", text: "Running tests", figure: "10%", fraction: 0.1, target_model: "process", target_id: 7, state: "running", ended_at: null};

async function drawn(mark, percent, docked = false) {
    const reads = [];
    const context = {read: async (line) => (reads.push(line), {ok: true, value: {rows: [{progress: percent}]}}), run: async () => ({ok: true, value: {lines: []}})};
    const element = document.createElement("div");
    const app = createApp({render: () => h(MarkHost, {mark, docked})});
    app.provide(WINDOW_CONTEXT, context);
    app.mount(element);
    for (let round = 0; round < 5; round++) await nextTick();
    return {element, reads};
}

test("a running run's mark shows the percent of its output row", async () => {
    const {element, reads} = await drawn(RUN, 62);
    expect(reads[0]).toEqual(["output", "list", "--process", "7"]);
    expect(element.textContent).toContain("62%");
    expect(element.textContent).not.toContain("10%");
});

test("an ended mark reads nothing", async () => {
    const {reads} = await drawn({...RUN, ended_at: "2026-11-02T10:00:00Z", state: "ended"}, 62);
    expect(reads).toEqual([]);
});

test("a docked row's mark steps back and does not say it is in the dock, and one not docked does not step back", async () => {
    const docked = await drawn(RUN, 62, true);
    expect(docked.element.querySelector(".thread-turn.card.docked")).not.toBeNull();
    expect(docked.element.textContent).not.toContain("In the dock");
    const free = await drawn(RUN, 62);
    expect(free.element.querySelector(".docked")).toBeNull();
    expect(free.element.textContent).not.toContain("In the dock");
});
