import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import HookNumbers from "../../core/modules/developer/web/src/HookNumbers.vue";

test("the numbers show points, sort by cost and reset", async () => {
    const ran = [];
    const window = context({}, null, {numbers: {line: "developer numbers", switches: ["costliest"]}});
    const rows = {ok: true, value: {rows: [{id: "stop", hook: "stop", count: 2, most_points: 30, average_points: 5}]}};
    window.read = async (line) => (ran.push(line), rows);
    window.run = async (line) => (ran.push(line), rows);
    const element = await mounted(HookNumbers, window);
    await settle();
    expect(element.querySelector("[data-number-row]").textContent).toContain("30");
    expect(element.textContent).toContain("Average points");
    expect(element.textContent).not.toContain("ms");
    element.querySelector("[data-numbers-sort]").click();
    await settle();
    expect(ran).toContain("developer numbers --costliest");
    element.querySelector("[data-numbers-reset]").click();
    await settle();
    expect(ran).toContainEqual(["developer", "reset-numbers"]);
    element.querySelector("[data-numbers-sort]").click();
    await settle();
    expect(ran.at(-1)).toBe("developer numbers");
});
