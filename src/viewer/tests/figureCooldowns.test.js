import {afterEach, describe, expect, it, vi} from "vitest";
import {KeptTimes} from "../src/figure/keptTimes.js";
import {reactionTo, thinkingAct} from "../src/figure/reactions.js";
import {SHOWPIECES} from "../src/figure/pile.js";

// the figure's memory as the page builds it at load for the environment `name`, `now` wall-clock seconds
const memoryAt = (now, name = "work") => new KeptTimes(`journal.figure.cooldowns.${name}`, now);

afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
});

describe("the figure's cooldowns", () => {
    it("keep each bug act, the bug shot and the mallet's smash, back for 30 minutes after it played, through a reload that reads its last play back from the page's session storage", () => {
        expect([SHOWPIECES.bug_shot, SHOWPIECES.bug_smash]).toEqual([30 * 60, 30 * 60]);
        // the pile's pick for a fixed run by the roll: the bug shot first, then the mallet's smash
        for (const [name, roll] of [["bug_shot", 0], ["bug_smash", 0.5]]) {
            sessionStorage.clear();
            const now = 1_800_000_000;
            expect(reactionTo("tests_fixed", memoryAt(now), now, () => roll).clip, name).toBe(name);
            // every probe below a reload from the storage as the play left it, so what a probe itself plays never counts
            const saved = sessionStorage.getItem("journal.figure.cooldowns.work");
            const reload = (at) => (sessionStorage.setItem("journal.figure.cooldowns.work", saved), memoryAt(at));
            const kept = JSON.parse(saved);
            expect(kept[`tests_fixed/${name}`], `${name} in the session storage`).toBe(now);
            expect(localStorage.getItem("journal.figure.cooldowns.work"), "never in the storage every tab shares").toBe(null);
            // made anew as on a reload, every few minutes through the half hour a fixed run never brings it again, whatever the roll
            for (let minute = 1; minute < 30; minute += 4) {
                const reloaded = reload(now + minute * 60);
                expect(reloaded.get(`tests_fixed/${name}`), `${name} read back at ${minute} minutes`).toBe(now);
                for (const again of [0, 0.5, 0.99]) {
                    const memory = reload(now + minute * 60);
                    expect(reactionTo("tests_fixed", memory, now + minute * 60 + 30, () => again)?.clip, `${name} ${minute} minutes on, roll ${again}`).not.toBe(name);
                }
            }
            // half an hour on it may play again
            const later = now + 30 * 60 + 1;
            expect(reactionTo("tests_fixed", reload(later), later, () => roll).clip, `${name} after half an hour`).toBe(name);
        }
    });

    it("hold through a reload: an act played, the memory rebuilt as a reload does, and the act still cools down until its time", () => {
        const now = 1_800_000_000;
        const before = memoryAt(now);
        expect(reactionTo("fact_filed", before, now, () => 0).clip, "the file card plays").toBe("file_card");
        const reloaded = memoryAt(now + 10);
        expect(reloaded.get("fact_filed"), "read back from the browser's storage").toBe(now);
        expect(reactionTo("fact_filed", reloaded, now + 10, () => 0), "still cooling down after the reload").toBe(null);
        expect(reactionTo("fact_filed", memoryAt(now + 121), now + 121, () => 0).clip, "and plays again once its cooldown is over").toBe("file_card");
    });

    it("keep the thinking act's random cooldown and its parts' through a reload, as wall-clock seconds", () => {
        const now = 1_800_000_000;
        const before = memoryAt(now);
        expect(thinkingAct(before, now, () => 0)).toBe("ponder");
        const reloaded = memoryAt(now + 5);
        for (const key of ["pondering", "thought_cloud", "light_bulb"]) expect(reloaded.get(key), key).toBe(before.get(key));
        expect(thinkingAct(reloaded, now + 5, () => 0), "not again straight after the reload").toBe(null);
    });

    it("are kept for each environment apart, and a time older than a day is let go", () => {
        const now = 1_800_000_000;
        reactionTo("fact_filed", memoryAt(now, "work"), now, () => 0);
        expect(memoryAt(now + 1, "home").get("fact_filed"), "another environment's figure is free to play it").toBeUndefined();
        expect(memoryAt(now + 25 * 60 * 60, "work").get("fact_filed"), "a day on it is forgotten").toBeUndefined();
    });

    it("lose only themselves when the storage throws: the figure works on, keeping its times for the page's life", () => {
        const refusing = {getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }};
        vi.stubGlobal("sessionStorage", refusing);
        const now = 1_800_000_000;
        const memory = memoryAt(now);
        expect(memory.size).toBe(0);
        expect(reactionTo("fact_filed", memory, now, () => 0).clip, "an act still plays").toBe("file_card");
        expect(reactionTo("fact_filed", memory, now + 10, () => 0), "and still cools down while the page lives").toBe(null);
        expect(thinkingAct(memory, now, () => 0)).toBe("ponder");
    });
});
