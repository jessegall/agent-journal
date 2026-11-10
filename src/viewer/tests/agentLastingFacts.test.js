import {h} from "vue";
import {afterEach, expect, test} from "vitest";
import AgentLastingFacts from "../../core/modules/agents/web/src/AgentLastingFacts.vue";
import {context, mounted} from "./support/agentWindowContext.js";

const helper = {id: 42, number: 5, role: "helper", program: "codex", program_model: "gpt-6.1-sol", session_count: 2, memory_count: 3, replaced_session_end_reason: null, retired_at: null, retiring_actor_name: null};
afterEach(() => { document.body.innerHTML = ""; });
const facts = (row) => mounted({render: () => h(AgentLastingFacts, {row})}, context({}));
const text = (element, name) => element.querySelector(`[data-agent-${name}]`)?.textContent ?? null;

test("a card names its driver, its sessions and its memories", async () => {
    const element = await facts(helper);
    expect(text(element, "driver-name")).toBe("Codex gpt-6.1-sol");
    expect(text(element, "session-count")).toBe("2");
    expect(text(element, "memory-count")).toBe("3");
    expect(text(element, "session-end-reason")).toBeNull();
    expect(text(element, "retired-by")).toBeNull();
});

test.each([["cache_passed", "its cache had passed"], ["each_launch", "each job starts a new one"], ["driver_changed", "its driver was changed"], ["replaced_by_person", "a person replaced it"], ["usage_limit", "usage limit"]])(
    "a card whose session was replaced for %s says so in plain words", async (reason, words) => {
        const element = await facts({...helper, replaced_session_end_reason: reason});
        expect(text(element, "session-end-reason")).toBe(words);
    });

test("a retired agent names who retired it and when", async () => {
    const element = await facts({...helper, retired_at: "2026-11-02T10:00:00Z", retiring_actor_name: "Ada"});
    expect(text(element, "retired-by")).toBe("Ada");
    expect(element.querySelector("[data-agent-retired-at]")).not.toBeNull();
});
