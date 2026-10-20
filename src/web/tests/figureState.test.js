// @vitest-environment node
import {expect, test} from "vitest";

const {
    AIRBORNE,
    ASLEEP_AFTER,
    EGGS,
    GROUNDED,
    LANDING,
    POINTED_AFTER,
    RESTS,
    TRAVELLING,
    WORKING,
    beatsAfter,
    canSwitch,
    clipFor,
    clipOf,
    closeAt,
    eggFor,
    figureStateOf,
    frameIn,
    modeOf,
    waitingSinceAt,
} = await import("../src/domain/figureState.js");
const {REACTIONS} = await import("../src/figure/reactions.js");
const {drawnIn, pointedView} = await import("../src/figure/places.js");
const {CLIPS} = await import("../src/figure/figure.js");

const NOW = 10_000;
const at = (seconds) => new Date(seconds * 1000).toISOString();
// An agent as the journal answers it; "running" says the last hook started the tool and "since" is when it was heard.
const agent = ({running, since = NOW, cards, person_at, ...fields} = {}) => ({
    table: "agents",
    id: 1,
    session: "claude-1",
    state: "working",
    status: "working",
    tool: "",
    tool_running: Boolean(running),
    awaiting: "",
    heard_at: at(since),
    data: {cards, person_at},
    ...fields,
});
const stateAt = (fields, waitingSince = 0, now = NOW) => figureStateOf(agent(fields), waitingSince, now).state;

test("the figure does what the tool in flight says the agent does, and thinks between tools", () => {
    expect(stateAt({running: true, tool: "Read"})).toBe("reading");
    expect(stateAt({running: true, tool: "Grep"})).toBe("searching");
    expect(stateAt({running: true, tool: "Edit"})).toBe("writing");
    expect(stateAt({running: true, tool: "Bash", since: NOW - 120})).toBe("running");
    expect(stateAt({tool: "Bash", since: NOW - 30})).toBe("thinking");
    expect(stateAt({running: true, tool: "Bash", tool_work: "reading"})).toBe("reading");
    expect(stateAt({running: true, tool: "Bash", tool_work: "searching"})).toBe("searching");
});

test("a stopped, paused or compacting agent keeps its figure, plainly not working; absence is never a state", () => {
    expect(stateAt({status: "stopped"})).toBe("stopped");
    expect(clipOf("stopped")).toBe("sleep");
    expect(stateAt({state: "paused"})).toBe("paused");
    expect(stateAt({status: "compacting"})).toBe("compacting");
    expect(clipOf("a state nobody named")).toBe("idle");
});

test("an idle agent's figure falls asleep only after a long while, timed from the agent's own row", () => {
    expect(stateAt({status: "idle", since: NOW - 10})).toBe("idle");
    expect(stateAt({status: "idle", since: NOW - ASLEEP_AFTER})).toBe("asleep");
});

test("something waiting on the user is the asking state, timed from when it arrived", () => {
    expect(figureStateOf(agent({status: "idle"}), NOW - 30, NOW)).toEqual({state: "asking", since: NOW - 30});
});

test("while the agent works the figure shows the work, as the bar says Working, even with something waiting on the user", () => {
    expect(stateAt({running: true, tool: "Grep"}, NOW - 30)).toBe("searching");
    expect(stateAt({tool: "Grep", since: NOW - 30}, NOW - 30)).toBe("thinking");
});

test("a beat fires only for what reached the row after it was last seen, oldest first", () => {
    const row = agent({
        cards: [
            {at: 5, tone: "commit"},
            {at: 20, icon: "check", tone: "danger"},
            {at: 30, tone: "danger"},
        ],
        person_at: 25,
    });
    expect(beatsAfter(row, 10).map((fire) => fire.beat)).toEqual(["failed", "heard", "refused"]);
});

const VOICES = ["bare", "butler", "homie", "coach", "colleague", "squire"];
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
// every moment the figure can meet: each beat, and each held state both fresh and long held
const MOMENTS = [
    ...[...new Set(REACTIONS.map((each) => each.moment))].map((beat) => ({beat, at: 1})),
    ...STATES.flatMap((state) => [0, POINTED_AFTER - 1, POINTED_AFTER, 10 * POINTED_AFTER].map((lasted) => ({state, since: 1, lasted}))),
];
// the design, said plainly: the squire's chase on a failed check, any voice's remark after a long wait
const expected = (voice, moment) =>
    (voice === "squire" && moment.beat === "failed" && "squire_chase") ||
    (moment.state === "asking" && moment.lasted >= POINTED_AFTER && "pointed") ||
    null;

test("no egg can fire without its own moment: for every voice and every moment, an egg plays only where it belongs", () => {
    for (const voice of VOICES) {
        for (const moment of MOMENTS) {
            expect(eggFor(voice, moment, [])?.clip ?? null).toBe(expected(voice, moment));
        }
    }
    expect(eggFor("homie", {beat: "failed", at: 1}, [])).toBe(null);
    expect(eggFor("squire", {beat: "committed", at: 1}, [])).toBe(null);
    expect(eggFor("butler", {state: "asking", since: 1, lasted: POINTED_AFTER - 1}, [])).toBe(null);
    expect(EGGS.map((egg) => egg.clip).sort()).toEqual(["pointed", "squire_chase"]);
});

test("an egg plays at most once for one occurrence of its moment, and never twice in a row", () => {
    const first = eggFor("squire", {beat: "failed", at: 5}, []);
    expect(first).toEqual({clip: "squire_chase", occurrence: 5});
    expect(eggFor("squire", {beat: "failed", at: 6}, [first])).toBe(null);
    const pointed = eggFor("squire", {state: "asking", since: 7, lasted: POINTED_AFTER}, [first]);
    expect(pointed).toEqual({clip: "pointed", occurrence: 7});
    expect(eggFor("squire", {state: "asking", since: 7, lasted: 2 * POINTED_AFTER}, [first, pointed])).toBe(null);
    const again = eggFor("squire", {beat: "failed", at: 8}, [first, pointed]);
    expect(again).toEqual({clip: "squire_chase", occurrence: 8});
    expect(eggFor("squire", {state: "asking", since: 7, lasted: 3 * POINTED_AFTER}, [first, pointed, again])).toBe(null);
});

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
    // on a sprint its steps come as much quicker
    expect(clipFor(scene({trip: {...moves, way: 1, pace: 2}, doing: "idle"}), canDraw)).toEqual({clip: "walk", facing: 90, pace: 2});
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

test("the walk is cut short the moment there is nowhere to go, a fall the moment it lands, and every other clip plays out", () => {
    const named = Object.fromEntries(CLIPS.map((clip) => [clip.name, clip]));
    expect(CLIPS.filter((clip) => clip.interruptible).map((clip) => clip.name)).toEqual(["walk", "fall"]);
    // mid-step the walk gives way at once, and so does a fall whose feet have met the ground
    expect(canSwitch(named.walk, 5, 4)).toBe(true);
    expect(canSwitch(named.fall, 3, 2)).toBe(true);
    // a hop, a landing and a beat play to their end, and a loop to the end of its cycle or of the stretch it leaves at
    for (const name of ["jump", "backflip", "land", "joy", "dismay", "stretch"]) {
        expect(canSwitch(named[name], named[name].frames - 1, named[name].frames - 2), name).toBe(false);
        expect(canSwitch(named[name], named[name].frames, named[name].frames - 1), name).toBe(true);
    }
    expect(canSwitch(named.think, 5, 4)).toBe(false);
    expect(canSwitch(named.think, named.think.frames, named.think.frames - 1)).toBe(true);
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
    expect(clipFor(scene({place: {posture: "stand", view: "question"}, state: "asking", doing: "waiting"}), canDraw).clip).toBe("waiting");
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

test("reads have their own working state; search tools and search-only shells keep the glass", () => {
    expect(clipOf("reading")).toBe("read");
    expect(WORKING.has("reading")).toBe(true);
    expect(RESTS.has("reading")).toBe(false);
    for (const tool of ["Grep", "Glob", "WebSearch", "WebFetch"]) {
        expect(stateAt({running: true, tool}), tool).toBe("searching");
    }
    expect(stateAt({tool: "Read", since: NOW - 30})).toBe("thinking");
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

test("each prop is chosen for its tools, and stays a moment after a quick tool finishes", () => {
    const prop = (fields) => clipOf(stateAt(fields));
    ["Read"].forEach((tool) => expect(prop({running: true, tool})).toBe("read"));
    ["Grep", "Glob"].forEach((tool) => expect(prop({running: true, tool})).toBe("search"));
    ["Edit", "Write"].forEach((tool) => expect(prop({running: true, tool})).toBe("write"));
    expect(prop({tool: "Read", since: NOW - 1})).toBe("read");
    expect(prop({tool: "Grep", since: NOW - 1})).toBe("search");
    expect(prop({tool: "Read", since: NOW - 10})).toBe("think");
});
