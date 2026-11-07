import {h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import AgentLimits from "../../core/modules/agents/web/src/AgentLimits.vue";
import {context, mounted, page, settle, typeInto} from "./support/agentWindowContext.js";

const worker = {key: "worker", label: "Worker", running: 1, kept: 3, run_limit: 1, kept_limit: 3, run_setting: "sample.run", kept_setting: "sample.kept", run_source: "environment main", kept_source: "environment main", per_profile: false, profiles: []};
const idle = {id: 42, role: "worker", state: "idle", program: "claude", created_at: "2026-11-01T09:00:00Z", ended_at: "2026-11-01T10:00:00Z", facts: {given_name: "Ada", model: "sonnet", task_title: "Fix the cart"}};
afterEach(() => { document.body.innerHTML = ""; });
async function counts({readOnly = false} = {}) {
    const row = structuredClone(worker);
    const held = context({"agent limits": page([row]), "agent cards --show all --limit 10000": page([idle])});
    held.readOnly = readOnly;
    held.run = vi.fn(async (command) => {
        if (command[0] === "setting") row.run_limit = Number(command[3]);
        return {ok: true};
    });
    const element = await mounted({render: () => h(AgentLimits)}, held);
    return {element, held};
}
async function open(element) { element.querySelector("[data-agent-counts]").click(); await settle(); }

test("the badge counts full rows and the modal shows counts without status words", async () => {
    const {element} = await counts();
    expect(element.querySelector("[data-agent-count-badge]").textContent).toBe("1");
    await open(element);
    expect(document.body.querySelector("[data-agent-limit-type='worker']").textContent).toContain("1 of 13 of 3");
    expect(document.body.textContent).not.toContain("At limit");
});

test("maximum controls save a change and read-only viewers cannot edit", async () => {
    const {element, held} = await counts();
    await open(element);
    [...document.body.querySelectorAll("button")].find((button) => button.textContent === "Change the maximums").click();
    await settle();
    const input = document.body.querySelector("[data-agent-limit-input='run']");
    input.nextElementSibling.click();
    await settle();
    expect(held.run).toHaveBeenCalledWith(["setting", "set", "sample.run", "2", "--environment", "main"]);
});

test("an opened row lists its idle agent and retires it with a reason", async () => {
    const {element, held} = await counts();
    await open(element);
    document.body.querySelector("[data-agent-limit-type='worker']").click();
    await settle();
    const agent = document.body.querySelector("[data-count-agent='42']");
    expect(agent.textContent).toContain("Ada");
    [...agent.querySelectorAll("button")].find((button) => button.textContent === "Retire").click();
    await settle();
    typeInto(agent.querySelector("[data-agent-retire-reason]"), "Finished work");
    await settle();
    agent.querySelector("[data-agent-retire-confirm]").dispatchEvent(new Event("submit", {bubbles: true, cancelable: true}));
    await settle();
    expect(held.run).toHaveBeenCalledWith(["agent", "retire", "42", "--reason", "Finished work"]);
});
