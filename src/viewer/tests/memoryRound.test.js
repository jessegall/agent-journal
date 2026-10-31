import {expect, test} from "vitest";
import {roundOf} from "../../core/modules/memories/web/src/round.js";

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
