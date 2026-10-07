import {afterEach, describe, expect, test} from "vitest";
import {capitalised, helperCount, helperWord, words} from "../src/composables/helperWords.js";
import {helperName} from "../src/domain/helpers.js";
import {MODES} from "../src/domain/modes.js";
import {KIND_SWITCHES} from "../src/domain/orchestra.js";

afterEach(() => {
    words.value = {helper: "", helpers: ""};
});

describe("a profile's word for helpers", () => {
    test("counts and labels use the word of the profile in use", () => {
        words.value = {helper: "footman", helpers: "footmen"};
        expect(helperCount(1)).toBe("1 footman");
        expect(helperCount(3)).toBe("3 footmen");
        expect(helperWord(2)).toBe("footmen");
        expect(capitalised(helperWord())).toBe("Footman");
        expect(helperName({n: 4, data: {}})).toBe("Footman 4");
    });

    test("texts built at module level follow a change of profile", () => {
        words.value = {helper: "player", helpers: "players"};
        expect(KIND_SWITCHES.find((s) => s.key === "helper").label).toBe("Players");
        expect(MODES.find((m) => m.key === "solo").note).toContain("no players");
    });
});
