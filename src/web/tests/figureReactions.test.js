// @vitest-environment node
import {expect, test} from "vitest";

const {AMBIENT, FLIP_ODDS, FLIP_OVER, REACTIONS, WORK_VARIANTS, ambientFor, flips, reactionTo, workClip} = await import("../src/figure/reactions.js");
const {EGGS, HELD, beatsAfter, facesAfter, testResultsAfter} = await import("../src/domain/figureState.js");
const {CLIPS, EYES} = await import("../src/figure/figure.js");
const {FACES} = await import("../src/domain/faces.js");

test("a test run that passed turns the figure to its card and jumps for joy, and one that failed has it cover its eyes", () => {
    expect(REACTIONS.find((each) => each.moment === "tests_passed")).toMatchObject({clip: "joy", toward: "card"});
    expect(REACTIONS.find((each) => each.moment === "tests_failed")).toMatchObject({clip: "dismay", toward: "card"});
});

test("a reaction fires only when its roll wins, and not again before its cooldown is over", () => {
    const memory = new Map();
    expect(reactionTo("tests_passed", memory, 100, () => 0.99)).toBe(null);
    expect(reactionTo("tests_passed", memory, 100, () => 0).clip).toBe("joy");
    expect(reactionTo("tests_passed", memory, 105, () => 0)).toBe(null);
    expect(reactionTo("tests_passed", memory, 125, () => 0).clip).toBe("joy");
    expect(reactionTo("a moment nobody reacts to", memory, 200, () => 0)).toBe(null);
});

test("what the user does is answered by the eyes and never moves the body; what happens in the work moves the body", () => {
    const user = ["heard", "answered", "typing", ...FACES.map((face) => `reacted:${face}`)];
    for (const moment of user) {
        const reactions = REACTIONS.filter((each) => each.moment === moment);
        expect(reactions.length, moment).toBeGreaterThan(0);
        for (const each of reactions) expect([each.look, each.clip], moment).toEqual([expect.any(String), undefined]);
    }
    expect(reactionTo("reacted:\u2764\ufe0f", new Map(), 0, () => 0.99).look).toBe("hearts");
    for (const each of REACTIONS.filter((reaction) => !user.includes(reaction.moment))) expect(each.clip, each.moment).toEqual(expect.any(String));
});

test("every clip and look the figure is ever asked for exists, so no reaction, egg, held state or pastime is dead on arrival", () => {
    const named = new Set(CLIPS.map((clip) => clip.name));
    const asked = [
        ...REACTIONS.map((each) => each.clip).filter(Boolean),
        ...EGGS.map((egg) => egg.clip),
        ...AMBIENT.map((each) => each.clip),
        ...Object.values(HELD),
        ...Object.values(WORK_VARIANTS).flatMap((variants) => variants.map(([clip]) => clip)),
        "walk", "jump", "fall", "backflip", "land", "enter", "exit", "point", "hang_l", "hang_r",
    ];
    for (const clip of asked) expect(named.has(clip), clip).toBe(true);
    for (const each of REACTIONS.filter((reaction) => reaction.look)) expect(EYES[each.look], each.look).toBeDefined();
    for (const clip of CLIPS) expect(clip.postures.length, clip.name).toBeGreaterThan(0);
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

test("the user typing now and then makes its eyes read, and finishing a long stretch of work now and then makes it stretch", () => {
    const memory = new Map();
    expect(reactionTo("typing", memory, 0, () => 0).look).toBe("reading");
    expect(reactionTo("typing", memory, 10, () => 0)).toBe(null);
    expect(reactionTo("typing", memory, 100, () => 0.99)).toBe(null);
    expect(reactionTo("work_done", memory, 0, () => 0).clip).toBe("stretch");
});

test("every moment a reaction waits for is one the journal makes, from cards shaped as the server writes them", () => {
    // features/git_actions, features/checks (a failing check and a test run), features/journal_laws, features/ask_questions,
    // and the person_at runner/hook_report stamps when the user writes
    const cards = [
        {at: 2, tone: "commit", icon: "branch"},
        {at: 2, icon: "check", tone: "danger"},
        {at: 2, icon: "terminal", tone: "danger"},
        {at: 2, icon: "question"},
        {at: 2, key: "tests:1", icon: "check", state: "done", ended: 3},
        {at: 2, key: "tests:2", icon: "check", state: "failed", ended: 3},
    ];
    const agent = {data: {cards, person_at: 2}};
    const faces = FACES.map((face, n) => ({deleted: false, seen: ["user"], created: 2, data: {face}, refs: [`message:${n}`]}));
    const made = new Set([
        ...beatsAfter(agent, 1),
        ...testResultsAfter(agent, new Map()),
        ...facesAfter(faces, 1),
        // the figure's own page sees these two: a key pressed in the compose box, and the agent settling after WORKED_SECONDS of work
        {beat: "typing"},
        {beat: "work_done"},
    ].map((fire) => fire.beat));
    for (const each of REACTIONS) expect(made.has(each.moment), each.moment).toBe(true);
});
