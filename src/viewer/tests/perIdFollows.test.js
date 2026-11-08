import {expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import AgentDetail from "../src/resource/agent/AgentDetail.vue";
import {RESOURCE_SUBSCRIPTIONS} from "../src/resource/resourceEvents.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {context as agentContext} from "./support/agentWindowContext.js";
import {AGENT_EDIT_KEYS} from "./support/fileFeedWindowContext.js";
import {context, mounted, settle} from "./support/windowContext.js";
import AgentCardDetails from "../../core/modules/agents/web/src/AgentCardDetails.vue";
import TranscriptRows from "../../core/modules/agents/web/src/TranscriptRows.vue";
import MemoryFacts from "../../core/modules/memories/web/src/MemoryFacts.vue";
import PlanRounds from "../../core/modules/plan_reviews/web/src/PlanRounds.vue";
import AgentFileEdits from "../../suites/coding/web/src/AgentFileEdits.vue";
import Terminal from "../../suites/coding/web/src/Terminal.vue";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

const COMMAND_READ_WAIT_MS = 5100;
const empty = {ok: true, value: {rows: [], page: 1, size: 50, total: 0}};
const hookCall = (agents) => ({event: "hook_call.create", row_id: 900, changed_ids: {session_agent_id: agents}});

// a window whose follows are kept, so a test can make an event heard and count the reads it costs
function hearing(window) {
    const listeners = [];
    window.follow = (patterns, listener) => {
        listeners.push({patterns, listener});
        return () => {};
    };
    return {window, hear: (event) => listeners.filter(({patterns}) => patterns.some((pattern) => pattern.split(".")[0] === event.event.split(".")[0])).forEach(({listener}) => listener(event))};
}

async function readsFor(mount, event) {
    const {window, hear, props = {}, component} = mount();
    await mounted(component, window, props);
    await settle();
    const before = window.reads.length;
    hear(event);
    await settle();
    return window.reads.length - before;
}

function terminal() {
    const window = agentContext({"hook-call feed --session-agent-id 7": empty});
    window.option = () => ({value: "commands"});
    return {...hearing(window), component: Terminal, props: {agent: 7}};
}

const CASES = [
    ["the transcript", () => ({...hearing(agentContext({"agent transcript 7": empty})), component: TranscriptRows, props: {name: "transcript.7"}}), hookCall([8]), hookCall([7])],
    ["the terminal", terminal, hookCall([8]), hookCall([7])],
    ["the agent's file edits", () => ({...hearing(context({"file-edit list --agent 7": empty}, null, AGENT_EDIT_KEYS)), component: AgentFileEdits, props: {agent: 7}}),
        {event: "file_edit.create", row_id: 5, changed_ids: {session_agent_id: [8]}}, {event: "file_edit.create", row_id: 5, changed_ids: {session_agent_id: [7]}}],
];

test.each(CASES)("%s reads nothing for an event of another agent, and reloads for its own", async (_, mount, other, own) => {
    expect(await readsFor(mount, other)).toBe(0);
    expect(await readsFor(mount, own)).toBeGreaterThan(0);
});

test("a hook call update that does not say whose it is still reloads the transcript", async () => {
    const mount = CASES[0][1];
    expect(await readsFor(mount, {event: "hook_call.update", row_id: 900, changed_ids: {answer: []}})).toBeGreaterThan(0);
});

const memoryKeys = {"keywords.*": {line: "memory-keyword list --memory {id}", loading: "requested"}};
const memoryFacts = () => ({...hearing({...context({"memory-keyword list --memory 3": empty}, null, memoryKeys), option: () => ({value: {id: 3}})}), component: MemoryFacts});

test("the keywords of a memory read nothing for a keyword of another memory", async () => {
    expect(await readsFor(memoryFacts, {event: "memory_keyword.create", row_id: 4, changed_ids: {memory_id: [9]}})).toBe(0);
    expect(await readsFor(memoryFacts, {event: "memory_keyword.create", row_id: 4, changed_ids: {memory_id: [3]}})).toBeGreaterThan(0);
});

const roundKeys = {"rounds.*": {line: "plan rounds {id}", loading: "requested"}};
const planRounds = () => ({...hearing({...context({"plan rounds 3": empty}, null, roundKeys), option: () => ({value: {id: 3}})}), component: PlanRounds});

test("the review rounds of a plan read nothing for another plan", async () => {
    expect(await readsFor(planRounds, {event: "plan.change", row_id: 4, changed_ids: {}})).toBe(0);
    expect(await readsFor(planRounds, {event: "plan.change", row_id: 3, changed_ids: {}})).toBeGreaterThan(0);
});

test("an open agent card reads its command for its own hook calls and not for another agent's", async () => {
    vi.useFakeTimers({toFake: ["setTimeout", "clearTimeout", "Date"]});
    try {
        const window = agentContext({"usage tool": {ok: true, value: {}}});
        const {hear} = hearing(window);
        const opened = mounted(AgentCardDetails, window, {row: {id: 7, role: "worker"}, tasks: [], open: true});
        await vi.advanceTimersByTimeAsync(0);
        await opened;
        const before = window.reads.filter((line) => line.startsWith("usage tool")).length;
        hear(hookCall([8]));
        await vi.advanceTimersByTimeAsync(COMMAND_READ_WAIT_MS);
        expect(window.reads.filter((line) => line.startsWith("usage tool")).length).toBe(before);
        hear(hookCall([7]));
        await vi.advanceTimersByTimeAsync(COMMAND_READ_WAIT_MS);
        expect(window.reads.filter((line) => line.startsWith("usage tool")).length).toBeGreaterThan(before);
    } finally {
        vi.useRealTimers();
    }
});

test("an agent's inspector is one read to open and one read for each event about it", async () => {
    const lines = [];
    const read = async (line) => {
        lines.push(line.join(" "));
        return {ok: false, error: "the counts are all this test wants"};
    };
    const subscriptions = new WindowSubscriptions();
    const element = document.createElement("div");
    const app = createApp({render: () => h(AgentDetail, {id: 12, read, environment: "main"})});
    app.provide(RESOURCE_SUBSCRIPTIONS, subscriptions);
    app.provide(WINDOW_CONTEXT, context({}));
    app.mount(element);
    await settle();
    expect(lines).toEqual(["usage inspector 12 --environment main"]);
    subscriptions.dispatch({event: "agent.change", row_id: 12, environment: "main", changed_ids: {}});
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(lines).toHaveLength(2);
    subscriptions.dispatch({event: "agent.change", row_id: 13, environment: "main", changed_ids: {}});
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(lines).toHaveLength(2);
    app.unmount();
});
