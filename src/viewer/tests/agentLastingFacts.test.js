import {h, reactive} from "vue";
import {afterEach, expect, test} from "vitest";
import AgentLastingFacts from "../../core/modules/agents/web/src/AgentLastingFacts.vue";
import {context, mounted, settle} from "./support/agentWindowContext.js";

const helper = {id: 42, number: 5, role: "helper", program: "codex", program_model: "gpt-6.1-sol", session_count: 2, memory_count: 3, replaced_session_end_reason: null, retired_at: null, retiring_actor_name: null};
afterEach(() => { document.body.innerHTML = ""; });
const facts = (row, props = {}) => mounted({render: () => h(AgentLastingFacts, {row, ...props})}, context({}));
const text = (element, name) => element.querySelector(`[data-agent-${name}]`)?.textContent ?? null;

test("a card names its driver once with its program, model and effort, and its sessions, and leaves its memories to their tab", async () => {
    const element = await facts({...helper, created_at: "2026-11-05T10:00:00Z"}, {programTitle: "Codex CLI", effort: "high"});
    expect(text(element, "driver-name")).toBe("Codex CLI, gpt-6.1-sol, high");
    expect(text(element, "first-dispatched")).not.toBeNull();
    expect(text(element, "session-count")).toBe("2");
    expect(text(element, "memory-count")).toBeNull();
    expect(text(element, "session-end-reason")).toBeNull();
    expect(text(element, "retired-by")).toBeNull();
});

test.each([["finished", "its work was finished"], ["cache_passed", "its cache had passed"], ["context_limit", "its context was full"], ["replaced_by_person", "a person replaced it"],
    ["driver_changed", "its driver was changed"], ["each_launch", "each job starts a new one"], ["never_started", "it never started"], ["unknown", "the reason is not known"], ["some_new_reason", "some new reason"]])(
    "a card whose session was replaced for %s says so in plain words", async (reason, words) => {
        const element = await facts({...helper, replaced_session_end_reason: reason});
        expect(text(element, "session-end-reason")).toBe(words);
    });

test("a retired agent names who retired it and when", async () => {
    const element = await facts({...helper, retired_at: "2026-11-02T10:00:00Z", retiring_actor_name: "Ada"});
    expect(text(element, "retired-by")).toBe("Ada");
    expect(element.querySelector("[data-agent-retired-at]")).not.toBeNull();
});

test("a card whose agent gets a new session shows the new driver, the count and the reason without being opened again", async () => {
    const row = reactive({...helper, program: "claude", program_model: "sonnet", session_count: 1});
    const element = await mounted({render: () => h(AgentLastingFacts, {row})}, context({}));
    expect(text(element, "driver-name")).toBe("Claude, sonnet");
    Object.assign(row, {program: "codex", program_model: "gpt-6.1-sol", session_count: 2, replaced_session_end_reason: "driver_changed"});
    await settle();
    expect(text(element, "driver-name")).toBe("Codex, gpt-6.1-sol");
    expect(text(element, "session-count")).toBe("2");
    expect(text(element, "session-end-reason")).toBe("its driver was changed");
});
