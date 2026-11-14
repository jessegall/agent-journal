import {createApp, h} from "vue";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test, vi} from "vitest";
import ProcessQueueBody from "../src/resource/ProcessQueueBody.vue";
import {RESOURCE_SUBSCRIPTIONS} from "../src/resource/resourceEvents.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {settle} from "./support/codingWindowContext.js";

vi.stubGlobal("matchMedia", () => ({matches: true}));
vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
});

const later = () => new Promise((resolve) => setTimeout(resolve, 30));
const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();
const RUN = {id: 70, task_id: 11, owner_agent_id: 21, category: "build", line: "make package", state: "running", section: "running", created_at: minutesAgo(3), started_at: minutesAgo(2), ended_at: null};
const SNAPSHOT = {environment_id: 1, environment_name: "main", parallel_limit: 3, limit_setting: "x", used_slots: 2, waiting_count: 1, halted: false, halt_cause: "", halt_reason: "", running: [RUN], waiting: [{...RUN, id: 71, section: "waiting", started_at: null}], recent: []};
const reader = (queue) => async () => ({ok: true, value: queue});
let app = null;
let subscriptions = null;

// an agent's Processes tab lists its running, waiting and finished runs in sections; the queue itself shows them by lane
async function panel(queue) {
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ProcessQueueBody, {read: reader(queue), agent: 41})});
    subscriptions = new WindowSubscriptions();
    app.provide(RESOURCE_SUBSCRIPTIONS, subscriptions);
    app.mount(element);
    await later();
    await settle();
}

afterEach(async () => {
    app?.unmount();
    app = null;
    subscriptions = null;
    document.body.innerHTML = "";
    await later();
});

test("test_started_ago: an expanded running command says when it started in the viewer's own words, with the exact time on hover, and a waiting one says no start", async () => {
    await panel(SNAPSHOT);
    const running = document.body.querySelector('[data-queue-process="70"]');
    expect(running.querySelector("[data-queue-started]").textContent).toBe("Started 2m ago");
    expect(running.querySelector("[data-queue-started]").getAttribute("title")).toMatch(/\d{4}/);
    expect(running.querySelector(".output-heading span").textContent).toMatch(/^Output 70 · Task 11 · Started 2m ago · \d+ m \d+ s$/);
    expect(running.querySelector("[data-queue-duration]").getAttribute("title")).toBe("Running for");
    const waiting = document.body.querySelector('[data-queue-process="71"]');
    expect(waiting.querySelector("[data-queue-started]")).toBeNull();
    expect(waiting.querySelector("[data-queue-duration]").getAttribute("title")).toBe("Waiting for");
    const old = {...SNAPSHOT, running: [{...RUN, started_at: null}]};
    document.body.innerHTML = "";
    app.unmount();
    await panel(old);
    expect(document.body.querySelector('[data-queue-process="70"] [data-queue-started]')).toBeNull();
});

test("test_empty_section_one_row: an empty section says None in one row that is one command row high, 31 px", async () => {
    await panel({...SNAPSHOT, running: [], waiting: [], waiting_count: 0, used_slots: 0});
    const empties = [...document.body.querySelectorAll("[data-queue-empty]")];
    expect(empties.map((row) => row.dataset.queueEmpty)).toEqual(["running", "waiting", "recent"]);
    expect(empties.map((row) => row.textContent)).toEqual(["None", "None", "None"]);
    const source = readFileSync(resolve(__dirname, "../src/resource/ProcessQueueBody.vue"), "utf8");
    expect(source).toMatch(/\.empty \{[^}]*height: 31px;[^}]*box-sizing: border-box;|\.empty \{[^}]*box-sizing: border-box;[^}]*height: 31px;/);
});
