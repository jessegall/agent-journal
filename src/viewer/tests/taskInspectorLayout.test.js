import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import HostedInspector from "../src/resource/HostedInspector.vue";
import {RESOURCE_SUBSCRIPTIONS} from "../src/resource/resourceEvents.js";
import {startButtons} from "../src/domain/buttons.js";
import {AllowancePrompts} from "../src/windows/allowancePrompts.js";
import {INSPECTOR_HOST} from "../src/windows/windowContext.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {perLine, settle} from "./support/windowContext.js";

const TASK = {noun: "task", module: "journal.core.tasks", fingerprint: "a", reads: "task inspect {row_id}", label: "Task {id} · {state}", title: "{title}", description: "", width: "medium", components: [], comments: true, events: ["task.*"],
    links: null, shareable: false};
const ROW = {id: 7, title: "Fix the totals", state: "started"};
let app = null;

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    vi.stubGlobal("fetch", perLine(async (url) => (String(url).startsWith("/api/buttons") ? {ok: true, status: 200, json: async () => ({buttons: [], missing: {}})} : {ok: true, json: async () => ({code: 0, value: {}, error: ""})})));
});

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function dialogInspector(props = {}) {
    await startButtons("main", new AllowancePrompts(async () => ({ok: true}))).load();
    const element = document.createElement("div");
    document.body.append(element);
    const host = {catalogue: {inspector: () => TASK, window: () => null, sectionsAt: () => []}, subscriptions: new WindowSubscriptions(), environment: "main", prompts: null, shellRead: null};
    const read = async (line) => (line.join(" ") === "task inspect 7" ? {ok: true, value: ROW} : {ok: true, value: {rows: [], total: 0}});
    app = createApp({render: () => h(HostedInspector, {noun: "task", id: 7, read, environment: "main", stepped: true, embedded: true, ...props})});
    app.directive("tip", {});
    app.provide(INSPECTOR_HOST, host);
    app.provide(RESOURCE_SUBSCRIPTIONS, host.subscriptions);
    app.mount(element);
    await settle();
    return element;
}

test("the tasks dialog mounts the shared layout without an X", async () => {
    const element = await dialogInspector();
    expect(element.querySelector("[data-inspector]")).not.toBeNull();
    expect(element.querySelector("[data-resource-close]")).toBeNull();
    expect(element.querySelector("[data-inspector-open]")).not.toBeNull();
});

test("Previous and Next step the selected task", async () => {
    const steps = [];
    const element = await dialogInspector({onStep: (by) => steps.push(by)});
    element.querySelector('[data-inspector-step="previous"]').click();
    element.querySelector('[data-inspector-step="next"]').click();
    expect(steps).toEqual([-1, 1]);
});

test("the task head shows the label and state", async () => {
    const element = await dialogInspector();
    expect(element.textContent).toContain("Task 7 · started");
    expect(element.querySelector("[data-resource-title]").textContent).toBe("Fix the totals");
});
