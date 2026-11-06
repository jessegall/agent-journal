import {h} from "vue";
import {expect, test, vi} from "vitest";
import AgentLimits from "../../core/modules/agents/web/src/AgentLimits.vue";
import {context, mounted, pickButton, settle} from "./support/windowContext.js";

const worker = {key: "worker", label: "Worker", running: 1, kept: 3, run_limit: 2, kept_limit: 8, run_setting: "sample.run", kept_setting: "sample.kept", per_profile: false, profiles: []};
async function limits({rows = [structuredClone(worker)], refusal = "", readOnly = false} = {}) {
    const followed = [];
    const held = {...context({}), readOnly, follow: (patterns, handler) => followed.push({patterns, handler})};
    held.read = async (line) => line === "agent limits" ? {ok: true, value: {rows: structuredClone(rows)}} : {ok: true, value: {source: "environment main"}};
    held.run = vi.fn(async (command) => {
        if (refusal) return {ok: false, error: refusal};
        for (const row of rows) {
            if (command[2] === row.run_setting) row.run_limit = Number(command[3]);
            if (command[2] === row.kept_setting) row.kept_limit = Number(command[3]);
        }
        return {ok: true};
    });
    const element = await mounted({render: () => h(AgentLimits)}, held);
    return {element, held, rows, followed};
}
async function change(element, selector, value) {
    const input = element.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event("change"));
    await settle();
}

test("agent limits show running and kept counts with the values in force", async () => {
    const {element} = await limits({rows: [{...worker, run_limit: 0, kept_limit: 0}]});
    expect(element.textContent).toContain("Running: 1 of 0");
    expect(element.textContent).toContain("Kept: 3 of no limit");
});

test("helper profile limits show each effective override beside its counts", async () => {
    const {element} = await limits({rows: [{...worker, key: "helper", label: "Helper", per_profile: true, run_limit: 4, profiles: [{profile: "reader", title: "Reader", running: 1, kept: 2, run_limit: 3, kept_limit: 5}]}]});
    expect(element.textContent).toContain("Limits per profile: running 4, kept 8.");
    expect(element.querySelector("[data-agent-limit-profile]").textContent).toBe("Reader: running 1 of 3 · kept 2 of 5");
});

test("a person changes both limits for this environment through the settings command", async () => {
    const {element, held} = await limits();
    await pickButton(element, "Edit limits");
    await change(element, "[data-agent-run-limit]", "3");
    await change(element, "[data-agent-kept-limit]", "9");
    expect(held.run.mock.calls.map(([command]) => command)).toEqual([
        ["setting", "set", "sample.run", "3", "--environment", "main"],
        ["setting", "set", "sample.kept", "9", "--environment", "main"],
    ]);
    expect(element.textContent).toContain("Running: 1 of 3 · Kept: 3 of 9");
    expect(element.textContent).toContain("environment main");
});

test("a refused limit change restores the value in force and shows the refusal", async () => {
    const {element} = await limits({refusal: "Only a person changes this setting"});
    await pickButton(element, "Edit limits");
    await change(element, "[data-agent-run-limit]", "6");
    expect(element.querySelector("[data-agent-run-limit]").value).toBe("2");
    expect(element.querySelector('[role="alert"]').textContent).toBe("Only a person changes this setting");
});

test("invalid limits and read-only viewers cannot write", async () => {
    const {element, held} = await limits();
    await pickButton(element, "Edit limits");
    await change(element, "[data-agent-run-limit]", "-1");
    expect(held.run).not.toHaveBeenCalled();
    expect(element.querySelector('[role="alert"]').textContent).toContain("whole number");
    const readonly = await limits({readOnly: true});
    expect(readonly.element.querySelector("[data-agent-limits-edit]").disabled).toBe(true);
    expect(readonly.held.run).not.toHaveBeenCalled();
});

test("setting and agent events refresh counts and effective limits", async () => {
    const {element, rows, followed} = await limits();
    rows[0].run_limit = 6;
    rows[0].kept = 4;
    await followed.find((item) => item.patterns.includes("setting.*") && item.patterns.includes("agent.*")).handler();
    await settle();
    expect(element.textContent).toContain("Running: 1 of 6 · Kept: 4 of 8");
});
