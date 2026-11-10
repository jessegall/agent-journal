import {expect, test} from "vitest";
import CostPanel from "../../core/modules/usage/web/src/CostPanel.vue";
import UsagePanel from "../../core/modules/usage/web/src/UsagePanel.vue";
import {mounted} from "./support/windowContext.js";
import {usageWindowContext as context} from "./support/usageWindowContext.js";

const AGENTS = [
    {id: 1, number: 1, role: "main", model: "Opus 5.5", cost_dollars: 1052.5},
    {id: 70, number: 7, role: "worker", model: "Sonnet 5.5", cost_dollars: 12.25},
    {id: 90, number: 9, role: "worker", model: "Sonnet 5.5", cost_dollars: 3.5},
    {id: 11, role: "reviewer", model: "", cost_dollars: 0},
];
const USAGE = {agents: AGENTS, windows: [{title: "7 days", used_percent: 17, reset_epoch_seconds: 1794085200}], cost_dollars: 1068.25};
const texts = (element, selector) => [...element.querySelectorAll(selector)].map((row) => [...row.children].map((part) => part.textContent).join(" "));

test("the cost dropdown says it is the predicted API price and not what a plan charges", async () => {
    const element = await mounted(CostPanel, context({"usage show": {ok: true, value: USAGE}}, 1));
    expect(element.textContent).toContain("Predicted API price");
    expect(element.querySelector("[data-cost-note]").textContent).toBe("What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.");
    expect(element.querySelector("[data-usage-meter]")).toBeNull();
});

test("the cost dropdown breaks the cost down by model and by agent, the dearest first, leaving out an agent with no cost", async () => {
    const element = await mounted(CostPanel, context({"usage show": {ok: true, value: USAGE}}, 1));
    expect(texts(element, "[data-cost-model]")).toEqual(["Opus 5.5 $1052.50", "Sonnet 5.5 $15.75"]);
    expect(texts(element, "[data-cost-agent]")).toEqual(["main 1 $1052.50", "worker 7 $12.25", "worker 9 $3.50"]);
});

test("the cost dropdown adds helpers up by profile, leaving out an agent with no profile or no cost", async () => {
    const agents = [...AGENTS, {id: 12, role: "helper", profile: "journal-researcher", model: "Haiku 5.5", cost_dollars: 0.5}, {id: 13, role: "helper", profile: "journal-researcher", model: "Haiku 5.5", cost_dollars: 0.25}, {id: 14, role: "helper", profile: "journal-debugger", model: "gpt", cost_dollars: null}];
    const element = await mounted(CostPanel, context({"usage show": {ok: true, value: {...USAGE, agents}}}, 1));
    expect(texts(element, "[data-cost-profile]")).toEqual(["journal-researcher $0.75"]);
});

test("the cost of this session reads the same in the dropdown as in the bar's figure", async () => {
    const element = await mounted(CostPanel, context({"usage show": {ok: true, value: USAGE}}, 1));
    expect(element.querySelector("[data-cost-session]").textContent).toContain("$1052.50");
    expect(element.querySelector("[data-cost-total]").textContent).toContain("$1068.25");
});

test("the allowance dropdown shows the plan's windows and no cost", async () => {
    const element = await mounted(UsagePanel, context({"usage show": {ok: true, value: USAGE}}));
    expect(element.querySelectorAll("[data-usage-meter]").length).toBe(1);
    expect(element.textContent).not.toContain("Cost of the open sessions");
});
