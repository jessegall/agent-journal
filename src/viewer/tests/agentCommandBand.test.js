import {afterEach, expect, test, vi} from "vitest";
import {h} from "vue";
import {context, mounted, page, settleTransition as settle} from "./support/codingWindowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {READ_RATES} from "../src/composables/readRates.js";

vi.stubGlobal("matchMedia", () => ({matches: true}));
vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => (document.body.innerHTML = ""));

const WORKER = {id: 4, number: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
const TOOL_READ = "usage tool --agent 4";
const AFTER_RATE = READ_RATES.agentCommand + 150;

// an agents window whose followed events the test fires, and whose command reads are counted
function windowOf() {
    const held = context({"agent cards": page([WORKER]), "agent running": page([WORKER]), "usage agents --closed": page([]), [TOOL_READ]: {ok: true, value: {tool: "Bash make test"}}});
    const follows = [];
    held.follow = (patterns, heard) => {
        const follow = {patterns, heard};
        follows.push(follow);
        return () => follows.splice(follows.indexOf(follow), 1);
    };
    held.fire = () => follows.filter(({patterns}) => patterns.includes("hook_call.*")).forEach(({heard}) => heard({event: "hook_call.create", changed_ids: {session_agent_id: [4]}}));
    held.commandReads = () => held.reads.filter((line) => line.startsWith(TOOL_READ)).length;
    return held;
}

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

test("the command band of an open agent card is read at most every half second while events arrive", async () => {
    expect(READ_RATES.agentCommand).toBe(500);
    const held = windowOf();
    const element = await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents yet"})}, held);
    element.querySelector('[data-agent-open="4"]').click();
    await settle();
    await vi.waitFor(() => expect(held.commandReads()).toBeGreaterThan(0));
    await pause(AFTER_RATE);
    const before = held.commandReads();
    for (let event = 0; event < 13; event++) {
        held.fire();
        await pause(100);
    }
    await pause(AFTER_RATE);
    const reads = held.commandReads() - before;
    expect(reads).toBeGreaterThanOrEqual(3);
    expect(reads).toBeLessThanOrEqual(4);
});

test("the command band is not read once the agent card is closed", async () => {
    const held = windowOf();
    const element = await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents yet"})}, held);
    element.querySelector('[data-agent-open="4"]').click();
    await settle();
    await vi.waitFor(() => expect(held.commandReads()).toBeGreaterThan(0));
    element.querySelector(".agent-back").click();
    await settle();
    const before = held.commandReads();
    held.fire();
    await pause(AFTER_RATE);
    expect(held.commandReads()).toBe(before);
});
