import {expect, test} from "vitest";
import {sharesAfter} from "../../suites/coding/modules/workers/web/src/programShares.js";

const rows = (...shares) => shares.map((share, id) => ({id: String(id), share}));

test("moving one share redistributes the rest in proportion without changing the input", () => {
    const original = rows(50, 30, 20);
    expect(sharesAfter(original, "0", 25).map((row) => row.share)).toEqual([25, 45, 30]);
    expect(original.map((row) => row.share)).toEqual([50, 30, 20]);
});
test("rounding leaves exactly one hundred in steps of five", () => {
    for (let value = 0; value <= 100; value += 5) {
        const changed = sharesAfter(rows(0, 0, 0, 0), "0", value);
        expect(changed.reduce((sum, row) => sum + row.share, 0)).toBe(100);
        expect(changed.every((row) => row.share % 5 === 0)).toBe(true);
    }
});
test("zero shares gain a fair part when the selected program gives some back", () => {
    expect(sharesAfter(rows(100, 0, 0), "0", 50).map((row) => row.share)).toEqual([50, 25, 25]);
});
test("one program keeps the whole share and a removed program changes nothing", () => {
    expect(sharesAfter(rows(0), "0", 20)).toEqual(rows(100));
    expect(sharesAfter(rows(80, 20), "gone", 50)).toEqual(rows(80, 20));
});
test("the slider clamps and rounds the value", () => {
    expect(sharesAfter(rows(50, 50), "0", 106)).toEqual(rows(100, 0));
    expect(sharesAfter(rows(50, 50), "0", -6)).toEqual(rows(0, 100));
    expect(sharesAfter(rows(50, 50), "0", 62)).toEqual(rows(60, 40));
});
