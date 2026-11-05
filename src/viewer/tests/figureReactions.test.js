// @vitest-environment node
import {expect, test} from "vitest";

const {
    EAGER,
    FLIP_OVER,
    LOOK_SECONDS,
    WORKED_SECONDS,
    answerTo,
    eagerFor,
    eyesAt,
    eyesShown,
    flips,
    letsGoFor,
    lookOf,
    pastimeFor,
    pastimeOf,
    queuedFirst,
    reactionTo,
    roomFor,
    workMoments,
} = await import("../src/figure/reactions.js");
const {HELD, beatsAfter, cardsAfter, cardsOfMarks, facesAfter, readingsAfter, testResultsAfter} = await import("../src/domain/figureState.js");
const {CLIPS, EYES} = await import("../src/figure/figure.js");
// the faces the user can put on a message
const FACES = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
const {EVERY_VOICE_FACES, PILE, VOICE_FACES, givesWay} = await import("../src/figure/pile.js");

// the pile's entries of a moment
const of = (moment) => PILE.filter((entry) => entry.when.moment === moment);

test("a test run that passed turns the figure to its card and nods, while a failure can startle, dismay or anger it", () => {
    const passed = of("tests_passed").filter((entry) => entry.type === "clip" && !entry.shenanigan);
    expect(passed.every((entry) => entry.toward === "card" && entry.onto)).toBe(true);
    expect(passed.map((entry) => entry.name)).toEqual(["nod"]);
    expect(of("tests_failed").filter((entry) => entry.type === "clip").map((entry) => [entry.name, entry.toward])).toEqual([["startled", "card"], ["dismay", "card"], ["tantrum", "card"]]);
});

test("every voice can throw a tantrum at a test, anticipated run or check failure, with the quieter reactions still available", () => {
    for (const voice of Object.keys(VOICE_FACES)) {
        for (const moment of ["tests_failed", "bar_failed", "failed"]) {
            expect(reactionTo(moment, new Map(), 100, () => 0.6, voice), `${voice} ${moment}`).toMatchObject({
                clip: "tantrum",
                toward: moment === "bar_failed" ? "" : "card",
                holds: moment === "bar_failed",
            });
        }
        for (const [moment, name] of [["tests_failed", "startled"], ["bar_failed", "fume"], ["failed", "shake"]]) {
            expect(reactionTo(moment, new Map(), 100, () => 0, voice).clip, `${voice} ${moment}`).toBe(name);
        }
    }
});

test("a missing tantrum falls back to existing failure reactions and its failure groups retain their cooldown", () => {
    const without = (name) => name !== "tantrum";
    for (const voice of Object.keys(VOICE_FACES)) {
        expect(reactionTo("tests_failed", new Map(), 100, () => 0.7, voice, without).clip).toBe("dismay");
        expect(reactionTo("bar_failed", new Map(), 100, () => 0.99, voice, without).clip).toBe("fume");
        expect(reactionTo("failed", new Map(), 100, () => 0.5, voice, without).clip).toBe("shake");
        for (const moment of ["tests_failed", "failed"]) {
            const memory = new Map();
            expect(reactionTo(moment, memory, 100, () => 0.6, voice).clip).toBe("tantrum");
            expect(reactionTo(moment, memory, 119.99, () => 0.6, voice)).toBe(null);
            expect(reactionTo(moment, memory, 120, () => 0.6, voice).clip).toBe("tantrum");
        }
    }
});

test("an anticipated failure's tantrum keeps its queue priority and plays out before later work", () => {
    const memory = {reacted: new Map()};
    const answer = answerTo({beat: "bar_failed", time: 100}, "butler", memory, 100, () => 0.6, () => true);
    expect(answer).toEqual({beat: {clip: "tantrum", card: "", holds: true}});
    const call = {clip: "phone_call"}, nod = {clip: "nod"};
    expect(queuedFirst([call, nod], answer.beat, "phone_call")).toEqual([call, answer.beat, nod]);
    const clip = CLIPS.find((each) => each.name === "tantrum");
    expect(givesWay({clip, once: true, holds: answer.beat.holds}, 0.5, {urgent: true})).toBe(false);
});

test("a reaction fires only when its roll wins, and not again before its cooldown is over", () => {
    const memory = new Map();
    expect(reactionTo("tests_passed", memory, 100, () => 0.99)).toBe(null);
    expect(reactionTo("tests_passed", memory, 100, () => 0).clip).toBe("nod");
    expect(reactionTo("tests_passed", memory, 105, () => 0)).toBe(null);
    expect(reactionTo("tests_passed", memory, 125, () => 0).clip).toBe("nod");
    expect(reactionTo("a moment nobody reacts to", memory, 200, () => 0)).toBe(null);
});

test("typing and reactions change the eyes; messages and work can move the body", () => {
    const user = ["answered", "typing", ...FACES.map((face) => `reacted:${face}`)];
    for (const moment of user) {
        const reactions = of(moment).filter((entry) => entry.type !== "nothing");
        expect(reactions.length, moment).toBeGreaterThan(0);
        for (const each of reactions) expect(each.type, moment).toBe("look");
    }
    expect(reactionTo("reacted:\u2764\ufe0f", new Map(), 0, () => 0.99).look).toBe("hearts");
});

test("every clip and look the figure is ever asked for exists, so no reaction, held state or pastime is dead on arrival", () => {
    const named = new Set(CLIPS.map((clip) => clip.name));
    const asked = [
        ...PILE.filter((entry) => entry.type === "clip").map((entry) => entry.name),
        ...Object.values(HELD),
        "walk",
        "jump",
        "fall",
        "backflip",
        "land",
        "enter",
        "exit",
        "point",
        "hang_l",
        "hang_r",
    ];
    for (const clip of asked) expect(named.has(clip), clip).toBe(true);
    for (const each of PILE.filter((entry) => entry.type === "look")) expect(EYES[each.name], each.name).toBeDefined();
    for (const clip of CLIPS) expect(clip.postures.length, clip.name).toBeGreaterThan(0);
});

test("a figure at rest stretches only after the state has lasted, not again before its cooldown, and then not on every occasion", () => {
    const look = of("pastime").find((entry) => entry.name === "stretch");
    const only = (name) => name === "stretch";
    const memory = new Map();
    const idle = roomFor("idle", null, 0);
    expect(pastimeOf(idle, look.when.lasted - 1, memory, 0, () => 0, "", only)).toBe(null);
    expect(pastimeOf(idle, look.when.lasted, memory, 0, () => 0, "", only).name).toBe("stretch");
    expect(pastimeOf(idle, look.when.lasted, memory, 1, () => 0, "", only)).toBe(null);
    // an idle act is for a figure with nothing to do
    expect(pastimeOf(roomFor("thinking", null, 0), 999, new Map(), 1000, () => 0, "", only)).toBe(null);
    expect(pastimeOf(idle, look.when.lasted, new Map(), 0, () => 0.99, "", only)).toBe(null);
});

test("only a jump of more than the figure's own height sometimes turns over", () => {
    const [backflip, jump] = of("jump");
    const odds = backflip.weight / (backflip.weight + jump.weight);
    expect(flips(112 * FLIP_OVER, 112, () => 0, null, 0, Infinity)).toBe(false);
    expect(flips(112 * FLIP_OVER + 1, 112, () => odds - 0.01, null, 0, Infinity)).toBe(true);
    expect(flips(112 * FLIP_OVER + 1, 112, () => odds, null, 0, Infinity)).toBe(false);
    // a salto is a shenanigan, never turned while the agent works
    expect(flips(112 * FLIP_OVER + 1, 112, () => 0, null, 0, 0)).toBe(false);
});

test("a watched test run that ends is seen once, as a pass or a failure, and a run already known is not seen again", () => {
    const card = (key, ending) => ({key, time: 9, label: "Running tests", guesses: {test: true}, watch: {figure: "Tests 100%", ending}});
    const known = new Map();
    const agent = (...cards) => ({data: {cards}});
    expect(testResultsAfter(agent(card("messages:1", "")), known, 0)).toEqual([]);
    expect(testResultsAfter(agent(card("messages:1", "finished")), known, 0)).toEqual([{beat: "tests_passed", time: 9, card: "messages:1"}]);
    expect(testResultsAfter(agent(card("messages:1", "finished")), known, 0)).toEqual([]);
    expect(testResultsAfter(agent(card("messages:2", "failed with code 1")), known, 0)).toEqual([
        {beat: "tests_failed", time: 9, card: "messages:2"},
    ]);
    expect(testResultsAfter(agent({key: "messages:3", time: 9, watch: {figure: "", ending: "finished"}}), known, 0)).toEqual([]);
    // an old run's mark that comes back into the chat already ended, from before the figure began to watch, celebrates nothing,
    // however often it comes and goes
    const later = new Map();
    for (let look = 0; look < 5; look++) expect(testResultsAfter(agent(...(look % 2 ? [] : [card("messages:7", "finished")])), later, 100)).toEqual([]);
});

test("the user typing now and then makes its eyes read, and finishing a long stretch of work now and then makes it stretch", () => {
    const memory = new Map();
    expect(reactionTo("typing", memory, 0, () => 0).look).toBe("reading");
    expect(reactionTo("typing", memory, 10, () => 0)).toBe(null);
    expect(reactionTo("typing", memory, 100, () => 0.99)).toBe(null);
    expect(reactionTo("work_done", memory, 0, () => 0).clip).toBe("stretch");
});

test("every moment a reaction waits for is one the journal makes, from cards shaped as the server writes them", () => {
    let marks = 100;
    const mark = (type, variant, fields = {}) => ({id: ++marks, type, variant, key: `${type}:${variant}`, text: "", outcome: "none", created_at: new Date(2000).toISOString(), ...fields});
    const run = (id, seconds, outcome) => mark("processes.command", outcome === "passed" ? "finished" : "failed", {id, key: `process:${id}`, text: "Running tests", outcome, ended_at: new Date((seconds + 1) * 1000).toISOString(), created_at: new Date(seconds * 1000).toISOString()});
    const cards = cardsOfMarks([
        mark("workers.worker", "merged"),
        mark("workers.worker", "delivered"),
        mark("workers.worker", "released"),
        mark("workers.tests", "failed"),
        mark("workers.tests", "passed"),
        mark("questions.question", "open"),
        mark("questions.answer", "agent"),
        mark("tasks.task", "closed"),
        mark("memories.memory", "made"),
        mark("plugins.card", "warn", {key: "plugin:code-commandments:sins:src/a.py"}),
        mark("plugins.card", "good", {key: "plugin:code-commandments:sins:src/b.py"}),
        run(1, 2, "passed"),
        run(2, 2, "failed"),
        run(8, 5, "failed"),
        run(9, 6, "passed"),
    ]);
    const agent = {data: {cards, person_at: 2}};
    // the user's faces, and the agent's own in every voice's set and those of every voice
    const own = [...Object.values(VOICE_FACES).flatMap((faces) => Object.keys(faces)), ...Object.keys(EVERY_VOICE_FACES)];
    const put = [...FACES.map((face) => ["user", face]), ...own.map((face) => ["agent", face])];
    const faces = put.map(([author, face], n) => ({
        table: "reactions",
        id: n + 1,
        author,
        created_at: new Date(2000).toISOString(),
        emoji: face,
        message_id: n,
    }));
    const made = new Set(
        [
            ...beatsAfter(agent, 1),
            ...cardsAfter(agent, new Set(), 0),
            ...testResultsAfter(agent, new Map(), 0),
            ...facesAfter(faces, 1),
            ...readingsAfter([{table: "messages", id: 9, author: "user", read_at: 5}], 1),
            // the figure's own page sees these two: a key pressed in the compose box, and the agent settling after WORKED_SECONDS of work
            {beat: "typing"},
            {beat: "work_done"},
            // and thinking, which the thinking act plays at
            ...workMoments("thinking", false, 0, 1).moments,
            {beat: "long_walk"},
            {beat: "building"},
            {beat: "standing"},
            // the figure's own page sees a launch end, as the docks open under it
            {beat: "launched"},
            // and the bar of a run it waits on seated jumping ahead or passing its near end (runWait.js progressJumped)
            {beat: "progress_jump"},
            // a slow run's docked bar ending while the figure is eager for it, passed or failed
            ...["good", "bad"].map((ended) => {
                const bar = {};
                const eager = eagerFor({bar, share: 0.97, ended: "", began: 0}, null, () => 0, EAGER.after + 30).eager;
                return eagerFor({bar, share: 1, ended, began: 0}, eager, () => 0, EAGER.after * 3).moment;
            }),
        ].map((fire) => fire.beat)
    );
    // every reaction's moment: the pile's moments but those of the figure's own choices, drawn where it chooses them
    const choices = ["pastime", "spell", "eager", "jump", "run_end", "thought_cloud", "light_bulb", "perch", "digit", "roam", "ledge_at", "composed_as", "unit", "climb", "tickled", "laptop"];
    for (const moment of new Set(PILE.map((entry) => entry.when.moment)))
        if (!choices.includes(moment) && !moment.startsWith("held:")) expect(made.has(moment), moment).toBe(true);
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

test("typing is a moment, and so is the end of a stretch of work long enough, timed from when the work began; standing idle is one every look", () => {
    expect(workMoments("waiting", true, 0, 50)).toEqual({moments: [{beat: "typing", time: 50}], began: 0});
    // thinking, as while a plain command runs, it stands as it stands idle, and glances about now and then
    expect(workMoments("running", false, 0, 50)).toEqual({moments: [{beat: "standing", time: 50}], began: 50});
    expect(workMoments("thinking", false, 50, 60).began).toBe(50);
    expect(workMoments("reading", false, 10, 20)).toEqual({moments: [], began: 10});
    expect(workMoments("waiting", false, 50, 50 + WORKED_SECONDS)).toEqual({
        moments: [{beat: "work_done", time: 50 + WORKED_SECONDS}],
        began: 0,
    });
    expect(workMoments("waiting", false, 50, 51).moments).toEqual([]);
    expect(workMoments("idle", false, 0, 51).moments).toEqual([{beat: "standing", time: 51}]);
});

test("a moment is answered by its reaction, a beat for the body or a look for the eyes, and a missing clip by nothing", () => {
    const memory = () => ({reacted: new Map()});
    const has = () => true;
    expect(answerTo({beat: "reacted:\u2764\ufe0f", time: 1}, "butler", memory(), 0, () => 0, has)).toEqual({look: "hearts"});
    // a passed run is answered on its own card: the figure goes onto it first
    expect(answerTo({beat: "tests_passed", time: 1, card: "tests:1"}, "butler", memory(), 0, () => 0, has)).toEqual({
        beat: {clip: "nod", card: "tests:1", mark: "tests:1", onto: true},
    });
    // with no clip to play, a pass is answered by nothing, as is any moment of clips alone
    expect(answerTo({beat: "tests_passed", time: 1}, "butler", memory(), 0, () => 0, () => false)).toBe(null);
    expect(answerTo({beat: "work_done", time: 1}, "butler", memory(), 0, () => 0, () => false)).toBe(null);
});

test("the figure does something by itself only while it is calm, not hanging, held by no sequence, with nothing to play and neither coming nor going; at work nothing", () => {
    const calm = {place: {posture: "sit"}, beats: 0, arriving: false, leaving: false, room: roomFor("idle", null, 0)};
    const waited = {state: "idle", lasted: 1000};
    const has = () => true;
    expect(pastimeFor(calm, waited, new Map(), 0, () => 0, has)).toEqual({clip: "stretch", card: "", flies: false});
    expect(pastimeFor({...calm, beats: 1}, waited, new Map(), 0, () => 0, has)).toBe(null);
    expect(pastimeFor({...calm, held: true}, waited, new Map(), 0, () => 0, has)).toBe(null);
    expect(pastimeFor({...calm, place: {posture: "hang"}}, waited, new Map(), 0, () => 0, has)).toBe(null);
    expect(pastimeFor({...calm, room: roomFor("running", null, 0)}, {...waited, state: "running"}, new Map(), 0, () => 0, has)).toBe(null);
});


test("a beat put first waits behind the one playing, which plays out, and goes before every one not yet begun", async () => {
    const {queuedFirst} = await import("../src/figure/reactions.js");
    const joy = {clip: "joy"};
    const nod = {clip: "nod"};
    const swat = {clip: "tickle_swat"};
    expect(queuedFirst([joy, nod], swat, "joy")).toEqual([joy, swat, nod]);
    expect(queuedFirst([joy, nod], swat, "")).toEqual([swat, joy, nod]);
    expect(queuedFirst([], swat, "joy")).toEqual([swat]);
});

test("the head follows the pointer no faster than a set speed, and reaches it in the end", async () => {
    const {headTurned, LOOK_TURN_SPEED} = await import("../src/figure/reactions.js");
    const center = {x: 0, y: 0};
    const frame = 1 / 60;
    let look = {x: 100, y: 0};
    const target = {x: -100, y: 1};
    const angle = (point) => Math.atan2(point.y, point.x);
    const next = headTurned(look, target, center, LOOK_TURN_SPEED * frame);
    expect(Math.abs(angle(next) - angle(look))).toBeLessThanOrEqual(LOOK_TURN_SPEED * frame + 1e-9);
    for (let step = 0; step < 60; step++) look = headTurned(look, target, center, LOOK_TURN_SPEED * frame);
    expect(Math.hypot(look.x - target.x, look.y - target.y)).toBeLessThan(1);
});

test("while the figure is eager for a run's end no moment takes it off, and the end is heard once the eagerness is over", async () => {
    const {isListening, eagerFor, heardNow} = await import("../src/figure/reactions.js");
    const eager = {run: 100, on: true};
    expect(isListening(eager), "no tickle, act, look or reaction is heard while eager").toBe(false);
    // what comes meanwhile is held, one of each, and answered once it listens again, before what comes then
    const tickle = {beat: "tickled", time: 150};
    const held = heardNow(eager, heardNow(eager, [], [tickle]).held, [tickle, {beat: "read_message", card: "messages:5"}]);
    expect(held).toEqual({answer: [], held: [tickle, {beat: "read_message", card: "messages:5"}]});
    expect(heardNow(null, held.held, [{beat: "committed"}]).answer.map((moment) => moment.beat)).toEqual(["tickled", "read_message", "committed"]);
    const ended = eagerFor({bar: {}, share: 1, ended: "good", began: 100}, eager, () => 0, 200);
    expect(ended.moment).toEqual({beat: "bar_done"});
    expect(isListening(ended.eager), "the end comes with the eagerness over").toBe(true);
    expect(isListening(null)).toBe(true);
});
