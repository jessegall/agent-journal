import {h} from "vue";
import {afterEach, expect, test} from "vitest";
import AgentLastingFacts from "../../core/modules/agents/web/src/AgentLastingFacts.vue";
import {context, mounted} from "./support/agentWindowContext.js";

const helper = {id: 42, number: 5, role: "helper", program: "codex", program_model: "gpt-6.1-sol", session_count: 2, memory_count: 3, replaced_session_end_reason: "driver_changed", retired_at: null, retiring_actor_name: null};
afterEach(() => { document.body.innerHTML = ""; });
const facts = (row) => mounted({render: () => h(AgentLastingFacts, {row})}, context({}));
const text = (element, name) => element.querySelector(`[data-agent-${name}]`)?.textContent ?? null;

test("a card that is not retired shows no Started, Sessions or Last session ended line, and nothing else", async () => {
    const element = await facts({...helper, created_at: "2026-11-05T10:00:00Z"});
    expect(element.querySelector("[data-agent-lasting-facts]")).toBeNull();
    for (const name of ["first-dispatched", "session-count", "session-end-reason", "driver-name", "memory-count", "retired-by"]) expect(text(element, name)).toBeNull();
});

test("a retired agent names who retired it and when", async () => {
    const element = await facts({...helper, retired_at: "2026-11-02T10:00:00Z", retiring_actor_name: "Ada"});
    expect(text(element, "retired-by")).toBe("Ada");
    expect(element.querySelector("[data-agent-retired-at]")).not.toBeNull();
    expect(text(element, "session-count")).toBeNull();
});
