import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page} from "./support/windowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";

const STARTED = "2026-11-03T02:00:00Z";
const worker = (extra = {}) => ({id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null, created_at: STARTED, ...extra});
let app;
let host;

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    app?.unmount();
    host?.remove();
    vi.useRealTimers();
});

// the agents window over a journal whose lists the test changes, with the listeners the window gave to follow what the journal says
async function drawn() {
    const answers = {"agent list": page([worker()]), "agent running": page([worker()]), "usage agents --closed": page([])};
    const listeners = [];
    const window_ = {...context(answers), follow: (...parts) => (listeners.push(parts[parts.length - 1]), () => {})};
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})});
    app.provide(WINDOW_CONTEXT, window_);
    app.mount(host);
    await vi.advanceTimersByTimeAsync(100);
    return {
        ends: async () => {
            const ended = worker({ended_at: new Date().toISOString()});
            answers["agent list"] = page([ended]);
            answers["agent running"] = page([]);
            listeners.forEach((listener) => listener({event: "agent.update", row_id: 4}));
            await vi.advanceTimersByTimeAsync(100);
        },
        pass: (seconds) => vi.advanceTimersByTimeAsync(seconds * 1000),
    };
}

const row = () => host.querySelector('[data-agent-row="4"]');
const hover = (type) => row().dispatchEvent(new MouseEvent(type));

test("a worker that is running shows in the running tab with no bar", async () => {
    await drawn();
    expect(row()).not.toBeNull();
    expect(host.querySelector("[data-agent-leave]")).toBeNull();
});

test("a worker that ended stays in the running tab with a faint bar that shows it will hide", async () => {
    const story = await drawn();
    await story.ends();
    expect(row()).not.toBeNull();
    expect(host.querySelector("[data-agent-leave] i").style.animationDuration).toBe("10000ms");
    await story.pass(9);
    expect(row()).not.toBeNull();
});

test("a worker that ended hides from the running tab after ten seconds", async () => {
    const story = await drawn();
    await story.ends();
    await story.pass(10.5);
    expect(row()).toBeNull();
});

test("while the pointer is over its row the countdown stops, and it goes on when the pointer leaves", async () => {
    const story = await drawn();
    await story.ends();
    await story.pass(5);
    hover("mouseenter");
    await story.pass(30);
    expect(row()).not.toBeNull();
    hover("mouseleave");
    await story.pass(4);
    expect(row()).not.toBeNull();
    await story.pass(2);
    expect(row()).toBeNull();
});

test("the closed tab keeps the ended worker whatever the countdown", async () => {
    const story = await drawn();
    await story.ends();
    await story.pass(11);
    host.querySelectorAll("[role=radio], .segmented button").forEach((button) => button.textContent.trim() === "Closed" && button.click());
    await vi.advanceTimersByTimeAsync(100);
    expect(row()).not.toBeNull();
    expect(host.querySelector("[data-agent-leave]")).toBeNull();
});
