import {h} from "vue";
import {expect, test, vi} from "vitest";
import AgentLimits from "../../core/modules/agents/web/src/AgentLimits.vue";
import {context, mounted, pickButton, settle} from "./support/windowContext.js";

const worker = {key: "worker", label: "Worker", running: 1, kept: 3, run_limit: 2, kept_limit: 8, run_setting: "sample.run", kept_setting: "sample.kept", per_profile: false, profiles: []};
async function limits({rows = [structuredClone(worker)], refusal = "", readOnly = false} = {}) {
    const followed = [];
    const held = {...context({}), readOnly, follow: (patterns, handler) => followed.push({patterns, handler})};
    held.read = vi.fn(async (line) => line === "agent limits" ? {ok: true, value: {rows: structuredClone(rows)}} : {ok: true, value: {source: "environment main"}});
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
    expect(element.querySelector(".summary").textContent).toContain("All within limits, 1 running, 3 kept");
    expect(element.querySelector(".summary").getAttribute("aria-expanded")).toBe("false");
    element.querySelector(".summary").click();
    await settle();
    expect(element.querySelector(".limit-row").textContent).toContain("1 · none may start");
    expect(element.querySelector(".limit-row").textContent).toContain("3 of no limit");
});

test("helper profile limits show each effective override beside its counts", async () => {
    const {element} = await limits({rows: [{...worker, key: "helper", label: "Helper", per_profile: true, run_limit: 4, profiles: [{profile: "reader", title: "Reader", running: 1, kept: 2, run_limit: 3, kept_limit: 5}]}]});
    element.querySelector(".summary").click();
    await settle();
    expect(element.querySelector("[data-agent-limit-profile]").textContent).toContain("Reader1 of 32 of 5Within limits");
});

test("a person changes both limits for this environment through the settings command", async () => {
    const {element, held} = await limits();
    expect(held.read.mock.calls.map(([line]) => line)).toEqual(["agent limits"]);
    element.querySelector(".summary").click();
    await settle();
    await pickButton(element, "Edit limits");
    expect(held.read.mock.calls.map(([line]) => line)).toEqual(["agent limits", "setting show sample.run", "setting show sample.kept"]);
    await change(element, "[data-agent-run-limit]", "3");
    await change(element, "[data-agent-kept-limit]", "9");
    expect(held.run.mock.calls.map(([command]) => command)).toEqual([
        ["setting", "set", "sample.run", "3", "--environment", "main"],
        ["setting", "set", "sample.kept", "9", "--environment", "main"],
    ]);
    expect(element.querySelector("[data-agent-run-limit]").value).toBe("3");
    expect(element.querySelector("[data-agent-kept-limit]").value).toBe("9");
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
    expect(element.querySelector(".limit-row").textContent).toContain("1 of 64 of 8Within limits");
});

test("the summary puts over-limit entries before entries at a limit and counts the rest", async () => {
    const {element} = await limits({rows: [
        {...worker, key: "at", label: "At", running: 2},
        {...worker, key: "over", label: "Over", kept: 10},
        {...worker, key: "another", label: "Another", running: 2},
    ]});
    const summary = element.querySelector(".summary");
    expect(summary.textContent).toContain("Over: Over by 2");
    expect(summary.textContent.indexOf("Over:")).toBeLessThan(summary.textContent.indexOf("At:"));
    expect(summary.textContent).toContain("1 more");
    element.querySelector(".summary").click();
    await settle();
    expect(element.querySelectorAll('[data-agent-limit-type="over"] .bar i')[1].style.width).toBe("20%");
});
