import {readdirSync, readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {h, nextTick} from "vue";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {context as agentContext} from "./support/agentWindowContext.js";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import WorkerDropdown from "../../suites/coding/modules/workers/web/src/WorkerDropdown.vue";
import {workersWindowContext} from "./support/workersWindowContext.js";
import {context, mounted, page} from "./support/codingWindowContext.js";

vi.stubGlobal("matchMedia", () => ({matches: true}));
vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

// a skeleton shows at the least 150 ms; the tests answer at once unless the mode says it is not a test
beforeEach(() => vi.stubEnv("MODE", "production"));
afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    document.body.innerHTML = "";
});

const MINIMUM_MS = 150;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const skeleton = (element) => element.querySelector("[data-tab-skeleton]");

// the tab is chosen, the skeleton shows at once, still shows before the minimum has passed, and is gone after it
async function expectMinimumOnSwitch(element, tabKey, content) {
    vi.useFakeTimers({toFake: ["setTimeout", "clearTimeout", "performance"]});
    element.querySelector(`[data-tab="${tabKey}"]`).click();
    await vi.advanceTimersByTimeAsync(0);
    await nextTick();
    expect(skeleton(element)).not.toBeNull();
    await vi.advanceTimersByTimeAsync(MINIMUM_MS - 1);
    await nextTick();
    expect(skeleton(element)).not.toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    await nextTick();
    expect(skeleton(element)).toBeNull();
    expect(element.querySelector(content)).not.toBeNull();
}

test("the plans window shows a skeleton for the minimum when another tab is chosen", async () => {
    const board = {ok: true, value: {open_total: 1, closed_total: 1, plans: []}};
    const tabs = [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}];
    const element = await mounted(PlanCards, {...context({"plan board": board}), tabs});
    await wait(MINIMUM_MS * 2);
    expect(element.querySelector("[data-tab-body]")).not.toBeNull();
    await expectMinimumOnSwitch(element, "closed", ".plans-note");
});

test("the workers dropdown shows a skeleton for the minimum when another tab is chosen", async () => {
    const tabs = [{key: "workers", label: "Workers", read: "agent list --role worker"}, {key: "recent", label: "Recent activity", read: "chat-mark main --type workers.worker"}];
    const element = await mounted(WorkerDropdown, {...workersWindowContext({"agent list --role worker": page([]), "chat-mark main --type workers.worker": page([])}), tabs});
    await wait(MINIMUM_MS * 2);
    await expectMinimumOnSwitch(element, "recent", "[data-tab-content]");
});

test("an open agent card shows a skeleton for the minimum when another tab is chosen", async () => {
    const tabs = [{key: "tasks", label: "Tasks", read: "usage agents", count_field: "tasks"}, {key: "transcript", label: "Transcript", read: "agent transcript", count_field: ""}];
    const options = {working: true, waiting: true, idle: true, stopped: true, environment: true, worker: true, helper: true, order: "number", every: false};
    const agents = [{id: 4, session: "s-two", program: "claude", role: "worker", ended_at: null}];
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, {
        ...agentContext({"agent cards": page(agents), "agent transcript 4": page([{id: 1, author: "user", text: "Read the cart"}])}),
        tabs,
        option: (key) => ({value: options[key]}),
    });
    document.body.append(element);
    element.querySelector('[data-agent-open="4"]').click();
    await wait(MINIMUM_MS * 2);
    await expectMinimumOnSwitch(element, "transcript", "[data-tab-content]");
});

test("a window that draws InnerTabs puts the body under them in a TabBody, so a switch cannot show a skeleton for less than the minimum", () => {
    const root = resolve(__dirname, "../..");
    const found = readdirRecursive(root).filter((path) => path.endsWith(".vue") && !path.endsWith("kit/InnerTabs.vue") && readFileSync(path, "utf8").includes("<InnerTabs"));
    expect(found.length).toBeGreaterThanOrEqual(3);
    for (const path of found) expect(readFileSync(path, "utf8"), path).toContain("<TabBody");
});

function readdirRecursive(folder) {
    return readdirSync(folder, {withFileTypes: true}).flatMap((entry) => {
        if (["node_modules", "dist", ".git"].includes(entry.name)) return [];
        const path = resolve(folder, entry.name);
        return entry.isDirectory() ? readdirRecursive(path) : [path];
    });
}
