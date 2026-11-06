import {h} from "vue";
import {expect, test, vi} from "vitest";
import {context, mounted, page, pickButton, settle} from "./support/codingWindowContext.js";
import {agentFilterOptions} from "./support/agentFilterOptions.js";
import Agents from "../../core/modules/agents/web/src/agents.js";
import Helpers from "../../core/modules/agents/web/src/helpers.js";

vi.stubGlobal("matchMedia", () => ({matches: true}));
const AGENTS = [{}, {id: 3, session: "s-idle", role: "helper", program: "claude"}, {id: 4, session: "s-retired", role: "worker", program: "codex", state: "retired", ended_at: "2026-11-02T10:00:00Z", retired_at: "2026-11-03T10:00:00Z"}];
const cardOf = (element, id) => element.querySelector(`[data-agent-open="${id}"]`);

test("an older idle agent keeps the details returned on its page", async () => {
    const helper = {...AGENTS[1], state: "idle", ended_at: "2026-11-02T10:00:00Z", resume_reason: "The saved session is gone; this agent cannot resume.", facts: {
        profile_title: "Researcher", given_name: "Lady Lovelace", helper_job: "Read the cart", job_returned: "The cart rounds twice.", last_activity: "2026-11-01T10:00:00Z", tasks: [],
    }};
    const element = await mounted(Agents, context({"agent cards --options": agentFilterOptions, "agent cards": page([helper]), "usage agents --closed": page([])}));
    const card = cardOf(element, helper.id);
    expect(card.querySelector("[data-agent-name]").textContent).toBe("Lady Lovelace");
    expect(card.querySelector("[data-agent-title]").textContent).toBe("Researcher");
    expect(card.querySelector("[data-agent-job]").textContent).toBe("Read the cart");
    expect(card.querySelector("[data-agent-report]")).toBeNull();
    card.click();
    await settle();
    expect(card.querySelector("[data-agent-report]")).toBeNull();
    expect(card.querySelector("[data-agent-last-heard]")).not.toBeNull();
    expect(card.querySelector("[data-agent-resume-reason]").textContent).toContain("cannot resume");
});

test("retired agents show their reason and the upgrade count", async () => {
    const retired = {...AGENTS[2], retirement_reason: "Its question is answered"};
    const element = await mounted(Agents, context({"agent cards --options": {ok: true, value: {...agentFilterOptions.value, upgrade_retired: 12}}, "agent cards": page([retired]), "usage agents --closed": page([])}));
    await pickButton(element, "Retired");
    expect(cardOf(element, retired.id).querySelector(".agent-time").textContent).toContain("Retired,");
    cardOf(element, retired.id).click();
    await settle();
    expect(element.querySelector("[data-agent-retirement-reason]").textContent).toContain("Its question is answered");
    expect(element.querySelector("[data-agents-upgrade]").textContent).toBe("Retired during the upgrade: 12");
});

test("a reloaded agent key updates the facts in its card", async () => {
    const helper = {...AGENTS[1], facts: {tasks: [], given_name: "Earlier name"}};
    const answer = page([helper]);
    const held = context({"agent cards --options": agentFilterOptions, "agent cards": answer});
    const element = await mounted(Agents, held);
    cardOf(element, helper.id).click();
    await settle();
    answer.value.rows = [{...helper, facts: {...helper.facts, given_name: "Latest name"}}];
    await held.reload("agents");
    await settle();
    expect(cardOf(element, helper.id).querySelector("[data-agent-name]").textContent).toContain("Latest name");
    expect(held.reads.some((line) => line.startsWith("usage agents"))).toBe(false);
});

test("the server supplies the agent tabs and the chosen state is sent back", async () => {
    const held = context({"agent cards --options": agentFilterOptions, "agent cards": page([]), "usage agents --closed": page([])});
    const element = await mounted(Agents, held);
    expect([...element.querySelectorAll('.segmented button')].map((button) => button.textContent.trim())).toEqual(["Working", "Idle", "Retired", "All"]);
    for (const [label, state] of [["Idle", "idle"], ["Retired", "retired"], ["All", "all"], ["Working", "running"]]) {
        await pickButton(element, label);
        expect(held.reads.at(-1)).toContain(`--show ${state}`);
    }
});

test.each([Agents, Helpers])("the initial window read joins visible keys and leaves card details until requested", async (component) => {
    const held = context({"agent cards --options": agentFilterOptions, "agent cards": page([])});
    const readKeys = held.readKeys;
    held.readKeys = vi.fn(function (request) { return readKeys.call(this, request); });
    await mounted(component, held);
    expect(held.readKeys).toHaveBeenCalledTimes(1);
    expect(held.readKeys.mock.calls[0][0]).toMatchObject({only: [], state: {"agents.show": "running", "agents.limit": "25"}});
    expect(held.reads.some((line) => line.startsWith("usage tool") || line.startsWith("agent transcript") || line.startsWith("task list"))).toBe(false);
});
