// @vitest-environment node
import {expect, test} from "vitest";

const {
    AMBIENT,
    FLIP_ODDS,
    FLIP_OVER,
    LOOK_SECONDS,
    REACTIONS,
    WORKED_SECONDS,
    WORK_VARIANTS,
    ambientFor,
    answerTo,
    eyesAt,
    eyesShown,
    flips,
    letsGoFor,
    lookOf,
    pastimeFor,
    reactionTo,
    stretchClip,
    workClip,
    workMoments,
} = await import("../src/figure/reactions.js");
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
        ...WORK_VARIANTS.map(([clip]) => clip),
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

test("only a jump of more than the figure's own height sometimes turns over, and a stretch of work sometimes shows the laptop", () => {
    expect(flips(112 * FLIP_OVER, 112, () => 0)).toBe(false);
    expect(flips(112 * FLIP_OVER + 1, 112, () => FLIP_ODDS - 0.01)).toBe(true);
    expect(flips(112 * FLIP_OVER + 1, 112, () => FLIP_ODDS)).toBe(false);
    expect(workClip(() => 0)).toBe("type");
    expect(workClip(() => 0.99)).toBe("");
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

test("a look shows only while the figure faces no further than sideways, so one that comes while it hangs with its back turned waits", () => {
    for (const facing of [0, 60, 90, 270, 300, -90, 450]) expect(eyesShown(facing), facing).toBe(true);
    for (const facing of [180, 150, 210, -180, 540]) expect(eyesShown(facing), facing).toBe(false);
});

test("a look's clock runs only while its eyes are shown: it waits while the figure faces away, plays out its time, and then ends", () => {
    let looking = lookOf("hearts", 100);
    let drawn = eyesAt(looking, 180, 101);
    expect(drawn.eyes).toBe(null);
    looking = drawn.looking;
    drawn = eyesAt(looking, 0, 101.5);
    expect(drawn.eyes).toMatchObject({mood: "hearts", seconds: 0.5, lasts: LOOK_SECONDS});
    expect(eyesAt(drawn.looking, 0, 101 + LOOK_SECONDS)).toEqual({looking: null, eyes: null});
    // only a figure hanging with its back to the viewer lets go of where it is for a look
    expect(letsGoFor({posture: "hang", face: 180})).toBe(true);
    expect([letsGoFor({posture: "hang", face: 0}), letsGoFor({posture: "sit", face: 300})]).toEqual([false, false]);
});

test("the laptop is rolled once for a stretch of work and kept from one tool to the next, and a stretch of rest shows its own clip", () => {
    let rolled = stretchClip("running", {stretch: "", clip: ""}, () => 0);
    expect(rolled).toEqual({stretch: "work", clip: "type", shows: "type"});
    rolled = stretchClip("thinking", rolled, () => 0.99);
    expect(rolled.shows).toBe("type");
    expect(stretchClip("idle", rolled, () => 0)).toEqual({stretch: "idle", clip: "", shows: "idle"});
    expect(stretchClip("running", {stretch: "", clip: ""}, () => 0.99).shows).toBe("work");
});

test("typing is a moment, and so is the end of a stretch of work long enough, timed from when the work began", () => {
    expect(workMoments("idle", true, 0, 50)).toEqual({moments: [{beat: "typing", at: 50}], began: 0});
    expect(workMoments("running", false, 0, 50)).toEqual({moments: [], began: 50});
    expect(workMoments("thinking", false, 50, 60).began).toBe(50);
    expect(workMoments("idle", false, 50, 50 + WORKED_SECONDS)).toEqual({moments: [{beat: "work_done", at: 50 + WORKED_SECONDS}], began: 0});
    expect(workMoments("idle", false, 50, 51).moments).toEqual([]);
});

test("a moment is answered by its egg first, else by its reaction, a beat for the body or a look for the eyes, and a missing clip by nothing", () => {
    const memory = () => ({reacted: new Map(), played: []});
    const has = () => true;
    expect(answerTo({beat: "failed", at: 1}, "squire", memory(), 0, () => 0, has)).toEqual({beat: {clip: "squire_chase", card: ""}});
    expect(answerTo({beat: "reacted:\u2764\ufe0f", at: 1}, "butler", memory(), 0, () => 0, has)).toEqual({look: "hearts"});
    expect(answerTo({beat: "tests_passed", at: 1, card: "tests:1"}, "butler", memory(), 0, () => 0, has)).toEqual({
        beat: {clip: "joy", card: "tests:1"},
    });
    expect(answerTo({beat: "tests_passed", at: 1}, "butler", memory(), 0, () => 0, () => false)).toBe(null);
});

test("the figure does something by itself only while it is calm: idle, not hanging, with nothing to play and neither coming nor going", () => {
    const calm = {place: {posture: "sit"}, beats: 0, arriving: false, leaving: false};
    const waited = {state: "idle", lasted: 1000};
    const has = () => true;
    expect(pastimeFor(calm, waited, new Map(), 0, () => 0, has)).toEqual({clip: AMBIENT[0].clip, card: ""});
    expect(pastimeFor({...calm, beats: 1}, waited, new Map(), 0, () => 0, has)).toBe(null);
    expect(pastimeFor({...calm, place: {posture: "hang"}}, waited, new Map(), 0, () => 0, has)).toBe(null);
    expect(pastimeFor(calm, {...waited, state: "running"}, new Map(), 0, () => 0, has)).toBe(null);
});
