import {expect, test, vi} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import MemoryRound from "../../core/modules/memories/web/src/MemoryRound.vue";
import {roundOf} from "../../core/modules/memories/web/src/round.js";
import {peekRef} from "../src/route.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), peekRef: vi.fn()}));

test("a round's lines are drawn as the memories still shown and those faded out, each with its weights", () => {
    const parts = roundOf("shown|4|3|2\nshown|5|2|1\nfaded|6|1|0");
    expect(parts.map((part) => [part.label, part.rows.length])).toEqual([["Still shown", 2], ["Removed", 1]]);
    expect(parts[0].rows[0]).toEqual({id: 4, change: "weight 3 to 2"});
    expect(parts[1].rows[0]).toEqual({id: 6, change: "faded out at weight 0"});
});

test("lines that are no round, or none, draw nothing", () => {
    expect(roundOf("")).toBeNull();
    expect(roundOf("Memory 3: weight set")).toBeNull();
});

test("a memory in the faded round opens in the inspector", async () => {
    const window_ = {...context({}), option: () => ({value: {lines: "shown|122|5|4\nfaded|123|1|0"}})};
    const element = await mounted(MemoryRound, window_);
    [...element.querySelectorAll("button")].find((button) => button.textContent.includes("Still shown")).click();
    await settle();
    element.querySelector("[data-memory-ref='122']").click();
    expect(peekRef).toHaveBeenCalledWith("memories:122");
});
