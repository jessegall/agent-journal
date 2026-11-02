import {expect, test} from "vitest";
import UsagePanel from "../../core/modules/usage/web/src/UsagePanel.vue";
import {context, mounted} from "./support/windowContext.js";

const WINDOW = {title: "7 days", used_percent: 17, reset_epoch_seconds: 1794085200};

test("the allowance names each window beside its percentage", async () => {
    const usage = {windows: [{...WINDOW, title: "5 hours", used_percent: 30}, WINDOW], unreported_windows: [], cost_dollars: 1};
    const element = await mounted(UsagePanel, context({"usage show": {ok: true, value: usage}}));
    const meters = [...element.querySelectorAll("[data-usage-meter]")].map((meter) => meter.textContent);
    expect(meters[0]).toContain("5 hours");
    expect(meters[0]).toContain("30%");
    expect(meters[1]).toContain("7 days");
    expect(meters[1]).toContain("17%");
    expect(element.querySelector("[data-usage-unreported]")).toBeNull();
});

test("a window the program did not report still has its line, saying so", async () => {
    const element = await mounted(UsagePanel, context({"usage show": {ok: true, value: {windows: [WINDOW], unreported_windows: ["5 hours"], cost_dollars: 1}}}));
    const line = element.querySelector("[data-usage-unreported]").textContent;
    expect(line).toContain("5 hours");
    expect(line).toContain("not reported");
});
