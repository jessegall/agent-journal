import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import HookNumbers from "../../core/modules/developer/web/src/HookNumbers.vue";

test("the numbers show each hook, sort by the slowest and reset", async () => {
    const ran = [];
    const window = context({});
    window.run = async (line) => (ran.push(line), {ok: true, value: {rows: [{id: "stop", hook: "stop", count: 2, average_ms: 20, slowest_ms: 30, average_points: 5}]}});
    const element = await mounted(HookNumbers, window);
    await settle();
    expect(element.querySelector("[data-number-row]").textContent).toContain("30 ms");
    element.querySelector("[data-numbers-sort]").click();
    await settle();
    expect(ran).toContainEqual(["developer", "numbers", "--slowest"]);
    element.querySelector("[data-numbers-reset]").click();
    await settle();
    expect(ran).toContainEqual(["developer", "reset-numbers"]);
});
