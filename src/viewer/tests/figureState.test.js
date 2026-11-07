// @vitest-environment node
import {expect, test} from "vitest";

const {
    AIRBORNE,
    ASLEEP_AFTER,
    GROUNDED,
    LANDING,
    RESTS,
    TRAVELLING,
    WORKING,
    beatsAfter,
    canSwitch,
    clipFor,
    clipOf,
    closeAt,
    frameIn,
    modeOf,
    waitingSinceAt,
} = await import("../src/domain/figureState.js");
const {PILE} = await import("../src/figure/pile.js");
const {drawnIn, pointedView} = await import("../src/figure/places.js");
const {CLIPS} = await import("../src/figure/figure.js");

const STATES = [
    "idle",
    "asleep",
    "thinking",
    "searching",
    "reading",
    "writing",
    "running",
    "waiting",
    "asking",
    "compacting",
    "paused",
    "stopped",
];
test("the figure points at the most pressing thing behind a tab, never at a tab already in front, and at nothing that merely happens", () => {
    const counts = {question: 1, waiting: 2, suggestion: 1, feed: 9};
    expect(pointedView(counts, {question: "behind", waiting: "behind"})).toBe("question");
    expect(pointedView(counts, {question: "front", waiting: "behind"})).toBe("waiting");
    expect(pointedView(counts, {question: "front", waiting: "front", feed: "behind"})).toBe(null);
    expect(pointedView({question: 0}, {question: "behind"})).toBe(null);
});

test("the walk plays only while the figure moves: no held state is the walk", () => {
    for (const state of STATES) expect(clipOf(state)).not.toBe("walk");
});

test("a figure whose agent cannot act stays seated at home, and one that is idle, working or waiting roams", () => {
    for (const state of ["asleep", "compacting", "paused", "stopped"]) expect(RESTS.has(state), state).toBe(true);
    for (const state of ["idle", "thinking", "searching", "reading", "writing", "running", "waiting", "asking"])
        expect(RESTS.has(state), state).toBe(false);
});

// a scene in which the figure rests on its feet at home, the agent thinking, unless the test says otherwise
const scene = (changes = {}) => ({place: {posture: "stand", face: 0, view: null}, state: "thinking", doing: "think", ...changes});
// every clip draws standing and seated; the laptop only on a lap; and idle, think and work also on the move
const canDraw = (name, posture) => (name === "type" ? posture === "sit" : posture !== "walk" || ["idle", "think", "work"].includes(name));

test("coming and going and the landing come before anything else, and a trip's next leg waits for the landing to end", () => {
    expect(clipFor(scene({leaving: true, arriving: true}), canDraw)).toMatchObject({clip: "exit", departure: true});
    expect(clipFor(scene({arriving: true}), canDraw)).toMatchObject({clip: "enter", arrival: true});
    expect(clipFor(scene({landing: true}), canDraw)).toMatchObject({clip: "land", landed: true, once: true});
    expect(clipFor(scene({trip: {started: true, way: 1}, landing: true}), canDraw)).toMatchObject({clip: "land"});
    expect(clipFor(scene({trip: {started: true, moves: true, hopping: true, clip: "backflip", way: 1}}), canDraw)).toEqual({
        clip: "backflip",
        facing: 0,
    });
});

test("on the move the figure walks on with what its body is doing, and simply walks with nothing to do or a laptop to carry", () => {
    const moves = {started: true, moves: true};
    expect(clipFor(scene({trip: {...moves, way: 1}}), canDraw)).toEqual({clip: "think", facing: 90, posture: "walk"});
    expect(clipFor(scene({trip: {...moves, way: -1}, doing: "idle"}), canDraw)).toEqual({clip: "walk", facing: 270});
    expect(clipFor(scene({trip: {...moves, way: 1}, doing: "type"}), canDraw)).toEqual({clip: "walk", facing: 90});
    // A sprint has its own running cycle, even while its held state has a walking gesture.
    expect(clipFor(scene({trip: {...moves, way: 1, pace: 2}, doing: "idle"}), canDraw)).toEqual({clip: "run", facing: 90, pace: 2});
    expect(clipFor(scene({trip: {...moves, way: -1, pressing: true}, doing: "think"}), canDraw)).toEqual({clip: "run", facing: 270});
});

test("the walk is never named before the figure stands ready to go, and the leg it names then sets off with it", () => {
    // getting up, or waiting for what it plays where it rests, it keeps doing what it does in its place
    expect(clipFor(scene({trip: {way: 1}}), canDraw)).toEqual({clip: "think", facing: 0});
    expect(clipFor(scene({trip: {way: 1}, beat: {clip: "joy", facing: 90}}), canDraw)).toEqual({clip: "joy", facing: 90, once: true});
    // ready, the clip of the leg is the one the leg sets off with, and once it moves nothing more sets off
    expect(clipFor(scene({trip: {started: true, way: 1}, doing: "idle"}), canDraw)).toEqual({clip: "walk", facing: 90, startsLeg: true});
    expect(clipFor(scene({trip: {started: true, hopping: true, clip: "jump"}}), canDraw)).toEqual({
        clip: "jump",
        facing: 0,
        startsLeg: true,
    });
    expect(clipFor(scene({trip: {started: true, moves: true, way: 1}, doing: "idle"}), canDraw)).not.toHaveProperty("startsLeg");
});

test("the walk is cut short the moment there is nowhere to go, a fall, a hop up the bubbles or a parachute the moment it lands, a climb up a ladder the moment it is up, and every other clip plays out", () => {
    const named = Object.fromEntries(CLIPS.map((clip) => [clip.name, clip]));
    expect(CLIPS.filter((clip) => clip.interruptible).map((clip) => clip.name)).toEqual(["walk", "run", "ladder_climb", "fall", "hop_up", "chute"]);
    // mid-step the walk gives way at once, and so does a fall whose feet have met the ground
    expect(canSwitch(named.walk, 5, 4)).toBe(true);
    expect(canSwitch(named.fall, 3, 2)).toBe(true);
    // a hop, a landing and a beat play to their end, and a loop to the end of its cycle or of the stretch it leaves at
    for (const name of ["jump", "backflip", "land", "joy", "dismay", "stretch"]) {
        expect(canSwitch(named[name], named[name].frames - 1, named[name].frames - 2), name).toBe(false);
        expect(canSwitch(named[name], named[name].frames, named[name].frames - 1), name).toBe(true);
    }
    expect(canSwitch(named.idle, 5, 4)).toBe(false);
    expect(canSwitch(named.idle, named.idle.leaves, named.idle.leaves - 1)).toBe(true);
});

test("a clip walked on with stops walking the moment the figure stops, while what it does plays out in its place", () => {
    const think = {clip: {name: "think", postures: ["stand", "sit", "walk"]}, posture: "walk"};
    expect(drawnIn(think, "stand", true)).toBe("walk");
    expect(drawnIn(think, "stand", false)).toBe("stand");
    expect(drawnIn(think, "sit", false)).toBe("sit");
    expect(drawnIn({clip: {name: "type", postures: ["sit"]}}, "stand", false)).toBe("sit");
});

test("at rest it hangs by its grip, plays a beat turned to it, points while the agent waits, and draws what it does in its own posture", () => {
    expect(clipFor(scene({place: {posture: "hang", grip: "l", face: 180}, beat: {clip: "joy", facing: 90}}), canDraw)).toEqual({
        clip: "hang_l",
        facing: 180,
    });
    expect(clipFor(scene({beat: {clip: "joy", facing: 270}}), canDraw)).toEqual({clip: "joy", facing: 270, once: true});
    // restored (task 2652): pointing at the tab was dropped when the waiting pose came in, and is back beside it
    expect(clipFor(scene({place: {posture: "stand", view: "question"}, state: "asking", doing: "waiting"}), canDraw).clip).toBe("point");
    expect(clipFor(scene({place: {posture: "stand", view: "question"}}), canDraw).clip).toBe("think");
    expect(clipFor(scene({place: {posture: "sit", face: 60}, state: "running", doing: "type"}), canDraw)).toEqual({
        clip: "type",
        facing: 60,
    });
    // the laptop cannot be drawn standing, so standing it does what the state itself does
    expect(clipFor(scene({state: "running", doing: "type"}), canDraw)).toEqual({clip: clipOf("running"), facing: 0});
});

test("something waiting on the user is timed from when it began to wait, and nothing waiting clears the clock", () => {
    const none = {question: 0, waiting: 0, suggestion: 0};
    expect(waitingSinceAt({...none, question: 1}, 0, 50)).toBe(50);
    expect(waitingSinceAt({...none, waiting: 2}, 20, 50)).toBe(20);
    expect(waitingSinceAt(none, 20, 50)).toBe(0);
});

test("a book opens once, keeps reading across loops, and closes only when asked to finish", () => {
    const clip = CLIPS.find((each) => each.name === "read");
    const hold = clip.frames - clip.intro - clip.outro;
    for (let index = 0; index < clip.intro; index++) expect(frameIn(clip, index)).toBe(index);
    for (let index = clip.intro; index < clip.frames * 10; index++) {
        expect(frameIn(clip, index)).toBe(clip.intro + ((index - clip.intro) % hold));
        expect(frameIn(clip, index)).toBeLessThan(clip.frames - clip.outro);
    }
    for (let index = 0; index < clip.frames * 3; index++) {
        const closing = closeAt(clip, index);
        expect(closing).toBeGreaterThanOrEqual(index);
        expect((closing - clip.intro) % clip.leaves).toBe(0);
        for (let frame = 0; frame < clip.outro; frame++) {
            expect(frameIn(clip, closing + frame, closing)).toBe(clip.frames - clip.outro + frame);
        }
        expect(frameIn(clip, closing + clip.outro, closing)).toBe(clip.frames - 1);
    }
});

test("a figure in the air on its feet falls before anything else, leaving included, and one dropping with its seat stays seated", () => {
    const airborne = {mode: AIRBORNE, leaving: true};
    expect(clipFor(scene(airborne), canDraw)).toEqual({clip: "fall", facing: 0});
    expect(clipFor(scene({...airborne, leaving: false, place: {posture: "sit", face: 60, view: null}}), canDraw).clip).not.toBe("fall");
    expect(modeOf({airborne: {posture: "stand"}, landing: true, trip: {started: true}})).toBe(AIRBORNE);
    expect(modeOf({airborne: null, landing: true, trip: null})).toBe(LANDING);
    expect(modeOf({airborne: null, landing: false, trip: {started: true}})).toBe(TRAVELLING);
    expect(modeOf({airborne: null, landing: false, trip: {started: false}})).toBe(GROUNDED);
});

test("the layers give way highest first: a fall beats a beat, a beat waits for the landing and the trip, and leaving waits until grounded", () => {
    const beat = {clip: "cheer", facing: 0};
    expect(clipFor(scene({mode: AIRBORNE, beat}), canDraw).clip).toBe("fall");
    expect(clipFor(scene({mode: LANDING, landing: true, beat}), canDraw).clip).toBe("land");
    const trip = {started: true, moves: true, hopping: false, way: 1, pace: 1};
    expect(clipFor(scene({mode: TRAVELLING, trip, beat}), canDraw)).toMatchObject({clip: "think", posture: "walk"});
    expect(clipFor(scene({beat}), canDraw)).toMatchObject({clip: "cheer", once: true});
    expect(clipFor(scene({mode: AIRBORNE, leaving: true}), canDraw).clip).toBe("fall");
    expect(clipFor(scene({mode: GROUNDED, leaving: true}), canDraw).clip).toBe("exit");
});
