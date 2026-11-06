import {expect, test} from "vitest";
import UsagePanel from "../../core/modules/usage/web/src/UsagePanel.vue";
import {mounted} from "./support/windowContext.js";
import {usageWindowContext as context} from "./support/usageWindowContext.js";

const WINDOW = {title: "7 days", used_percent: 17, reset_epoch_seconds: 1794085200};

test("the allowance names each window beside its percentage", async () => {
    const usage = {windows: [{...WINDOW, title: "5 hours", used_percent: 30}, WINDOW], cost_dollars: 1};
    const element = await mounted(UsagePanel, context({"usage show": {ok: true, value: usage}}));
    const meters = [...element.querySelectorAll("[data-usage-meter]")].map((meter) => meter.textContent);
    expect(meters[0]).toContain("5 hours");
    expect(meters[0]).toContain("30%");
    expect(meters[1]).toContain("7 days");
    expect(meters[1]).toContain("17%");
});
