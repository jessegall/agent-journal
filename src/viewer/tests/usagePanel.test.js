import {expect, test} from "vitest";
import UsagePanel from "../../core/modules/usage/web/src/UsagePanel.vue";
import {mounted, pickButton, typeInto} from "./support/windowContext.js";
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

test("the allowance shows the reset time of each window and says when a window is used up", async () => {
    const usage = {windows: [{...WINDOW, title: "5 hours", used_percent: 100}, WINDOW], cost_dollars: 1};
    const element = await mounted(UsagePanel, context({"usage show": {ok: true, value: usage}}));
    const meters = [...element.querySelectorAll("[data-usage-meter]")].map((meter) => meter.textContent);
    expect(meters[0]).toContain("At the usage limit.");
    expect(meters[0]).toContain(`Starts again ${new Date(1794085200 * 1000).toLocaleString()}`);
    expect(meters[1]).not.toContain("At the usage limit.");
    expect(meters[1]).toContain(`Starts again ${new Date(1794085200 * 1000).toLocaleString()}`);
    expect(meters.join(" ")).not.toMatch(/NaN|Invalid Date/);
});

test("the allowance menu sets a limit and lists and removes the limits that are set", async () => {
    const usage = {windows: [{...WINDOW, title: "5 hours", used_percent: 30}], agents: [{program: "claude"}], cost_dollars: 1};
    const limits = {ok: true, value: {rows: [{id: 4, window: "5 hours", mode: "fixed", percent: 50}], page: 1, size: 50, total: 1}};
    const windowContext = context({"usage show": {ok: true, value: usage}, "usage-limit list": limits});
    const lines = [];
    windowContext.run = async (line) => { lines.push(line.join(" ")); return {ok: true, value: null}; };
    const element = await mounted(UsagePanel, windowContext);
    expect(element.querySelector("[data-usage-limit]").textContent).toContain("5 hours: halt at 50%");
    const [window, mode] = element.querySelectorAll("[data-usage-limit-form] select");
    window.value = "hour";
    window.dispatchEvent(new Event("change"));
    mode.value = "budget";
    mode.dispatchEvent(new Event("change"));
    typeInto(element.querySelector("[data-usage-limit-form] input"), "20");
    await pickButton(element, "Set limit");
    await pickButton(element, "Remove");
    expect(lines).toEqual(["usage-limit set claude hour budget 20", "usage-limit delete 4"]);
});
