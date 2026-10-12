// @vitest-environment node
import {expect, test} from "vitest";

const {AMBIENT, FLIP_ODDS, FLIP_OVER, REACTIONS, ambientFor, flips, reactionTo, workClip} = await import("../src/figure/reactions.js");
const {BEAT_CLIPS, testResultsAfter} = await import("../src/domain/figureState.js");

test("a test run that passed turns the figure to its card and jumps for joy, and one that failed has it cover its eyes", () => {
    expect(REACTIONS.find((each) => each.moment === "tests_passed")).toMatchObject({clip: "joy", toward: "card"});
    expect(REACTIONS.find((each) => each.moment === "tests_failed")).toMatchObject({clip: "dismay", toward: "card"});
    expect(BEAT_CLIPS.tests_passed).toBe("joy");
});

test("a reaction fires only when its roll wins, and not again before its cooldown is over", () => {
    const memory = new Map();
    expect(reactionTo("tests_passed", memory, 100, () => 0.99)).toBe(null);
    expect(reactionTo("tests_passed", memory, 100, () => 0).clip).toBe("joy");
    expect(reactionTo("tests_passed", memory, 105, () => 0)).toBe(null);
    expect(reactionTo("tests_passed", memory, 125, () => 0).clip).toBe("joy");
    expect(reactionTo("a moment nobody reacts to", memory, 200, () => 0)).toBe(null);
});

test("a moment with two reactions plays the first that is off cooldown and wins its roll", () => {
    const memory = new Map();
    expect(reactionTo("heard", memory, 0, () => 0).clip).toBe("wave");
    expect(reactionTo("heard", memory, 1, () => 0).clip).toBe("nod");
});

test("a figure at rest looks about and stretches only after the state has lasted, and then not on every occasion", () => {
    const next = new Map();
    const [look] = AMBIENT;
    expect(ambientFor("idle", look.after - 1, next, 0, () => 0)).toBe("");
    expect(ambientFor("idle", look.after, next, 0, () => 0)).toBe("look_around");
    expect(ambientFor("idle", look.after, next, 1, () => 0)).toBe("");
    expect(ambientFor("working", 999, next, 1000, () => 0)).toBe("");
    const rolled = new Map();
    expect(ambientFor("idle", look.after, rolled, 0, () => 0.99)).toBe("");
});

test("only a jump of more than the figure's own height sometimes turns over, and a working state sometimes shows the laptop", () => {
    expect(flips(112 * FLIP_OVER, 112, () => 0)).toBe(false);
    expect(flips(112 * FLIP_OVER + 1, 112, () => FLIP_ODDS - 0.01)).toBe(true);
    expect(flips(112 * FLIP_OVER + 1, 112, () => FLIP_ODDS)).toBe(false);
    expect(workClip("running", "work", () => 0)).toBe("type");
    expect(workClip("running", "work", () => 0.99)).toBe("work");
    expect(workClip("thinking", "think", () => 0)).toBe("think");
});

test("a test card that ends is seen once, as a pass or a failure, and a card already known is not seen again", () => {
    const card = (key, state) => ({key, state, at: 5, ended: 9});
    const known = new Map();
    const agent = (...cards) => ({data: {cards}});
    expect(testResultsAfter(agent(card("tests:1", "running")), known)).toEqual([]);
    expect(testResultsAfter(agent(card("tests:1", "done")), known)).toEqual([{beat: "tests_passed", at: 9, card: "tests:1"}]);
    expect(testResultsAfter(agent(card("tests:1", "done")), known)).toEqual([]);
    expect(testResultsAfter(agent(card("tests:2", "failed")), known)).toEqual([{beat: "tests_failed", at: 9, card: "tests:2"}]);
});

test("the user typing now and then makes it peek, and finishing a long stretch of work now and then makes it stretch", () => {
    const memory = new Map();
    expect(reactionTo("typing", memory, 0, () => 0).clip).toBe("peek");
    expect(reactionTo("typing", memory, 10, () => 0)).toBe(null);
    expect(reactionTo("typing", memory, 100, () => 0.99)).toBe(null);
    expect(reactionTo("work_done", memory, 0, () => 0).clip).toBe("stretch");
});
