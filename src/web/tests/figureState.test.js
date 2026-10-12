// @vitest-environment node
import {expect, test} from "vitest";

const {ASLEEP_AFTER, EGGS, POINTED_AFTER, RESTS, beatsAfter, clipFor, clipOf, eggFor, figureStateOf, waitingSinceAt} =
    await import("../src/domain/figureState.js");
const {REACTIONS} = await import("../src/figure/reactions.js");
const {pointedView} = await import("../src/figure/places.js");

const NOW = 10_000;
const agent = (data) => ({n: 1, title: "claude-1", data: {status: "working", at: NOW, ...data}});
const stateAt = (data, waitingSince = 0, now = NOW) => figureStateOf(agent(data), [], waitingSince, now).state;

test("the figure does what the tool in flight says the agent does, and thinks between tools", () => {
    expect(stateAt({event: "PreToolUse", tool: "Grep"})).toBe("searching");
    expect(stateAt({event: "PreToolUse", tool: "Edit"})).toBe("writing");
    expect(stateAt({event: "PreToolUse", tool: "Bash"})).toBe("running");
    expect(stateAt({event: "PostToolUse", tool: "Bash"})).toBe("thinking");
});

test("a stopped, paused or compacting agent keeps its figure, plainly not working; absence is never a state", () => {
    expect(stateAt({status: "stopped"})).toBe("stopped");
    expect(clipOf("stopped")).toBe("sleep");
    expect(stateAt({paused: true})).toBe("paused");
    expect(stateAt({status: "compacting"})).toBe("compacting");
    expect(clipOf("a state nobody named")).toBe("idle");
});

test("an idle agent's figure falls asleep only after a long while, timed from the agent's own row", () => {
    expect(stateAt({status: "idle", at: NOW - 10})).toBe("idle");
    expect(stateAt({status: "idle", at: NOW - ASLEEP_AFTER})).toBe("asleep");
});

test("something waiting on the user is the asking state, timed from when it arrived", () => {
    expect(figureStateOf(agent({status: "idle"}), [], NOW - 30, NOW)).toEqual({state: "asking", since: NOW - 30});
    expect(stateAt({status: "idle", asking: {tool: "Bash"}})).toBe("asking");
});

test("while the agent works the figure shows the work, as the bar says Working, even with something waiting on the user", () => {
    expect(stateAt({event: "PreToolUse", tool: "Grep"}, NOW - 30)).toBe("searching");
    expect(stateAt({event: "PostToolUse", tool: "Grep"}, NOW - 30)).toBe("thinking");
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
const STATES = ["idle", "asleep", "thinking", "searching", "writing", "running", "waiting", "asking", "compacting", "paused", "stopped"];
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
    for (const state of ["idle", "thinking", "searching", "writing", "running", "waiting", "asking"])
        expect(RESTS.has(state), state).toBe(false);
});

// a scene in which the figure rests on its feet at home, the agent thinking, unless the test says otherwise
const scene = (changes = {}) => ({place: {posture: "stand", face: 0, view: null}, state: "thinking", doing: "think", ...changes});
// every clip draws standing and seated; the laptop only on a lap; and idle, think and work also on the move
const canDraw = (name, posture) => (name === "type" ? posture === "sit" : posture !== "walk" || ["idle", "think", "work"].includes(name));

test("coming and going, the hop of a trip and the landing come before anything the body is doing", () => {
    expect(clipFor(scene({leaving: true, arriving: true}), canDraw)).toMatchObject({clip: "exit", departure: true});
    expect(clipFor(scene({arriving: true}), canDraw)).toMatchObject({clip: "enter", arrival: true});
    expect(clipFor(scene({trip: {hopping: true, clip: "backflip", way: 1}, landing: true}), canDraw)).toMatchObject({clip: "backflip"});
    expect(clipFor(scene({landing: true}), canDraw)).toMatchObject({clip: "land", landed: true, once: true});
});

test("on the move the figure walks on with what its body is doing, and simply walks with nothing to do or a laptop to carry", () => {
    expect(clipFor(scene({trip: {way: 1}}), canDraw)).toEqual({clip: "think", facing: 90, posture: "walk"});
    expect(clipFor(scene({trip: {way: -1}, doing: "idle"}), canDraw)).toEqual({clip: "walk", facing: 270});
    expect(clipFor(scene({trip: {way: 1}, doing: "type"}), canDraw)).toEqual({clip: "walk", facing: 90});
});

test("at rest it hangs by its grip, plays a beat turned to it, points while the agent waits, and draws what it does in its own posture", () => {
    expect(clipFor(scene({place: {posture: "hang", grip: "l", face: 180}, beat: {clip: "joy", facing: 90}}), canDraw)).toEqual({
        clip: "hang_l",
        facing: 180,
    });
    expect(clipFor(scene({beat: {clip: "joy", facing: 270}}), canDraw)).toEqual({clip: "joy", facing: 270, once: true});
    expect(clipFor(scene({place: {posture: "stand", view: "question"}, state: "asking", doing: "idle"}), canDraw).clip).toBe("point");
    expect(clipFor(scene({place: {posture: "stand", view: "question"}}), canDraw).clip).toBe("think");
    expect(clipFor(scene({place: {posture: "sit", face: 60}, state: "running", doing: "type"}), canDraw)).toEqual({clip: "type", facing: 60});
    // the laptop cannot be drawn standing, so standing it does what the state itself does
    expect(clipFor(scene({state: "running", doing: "type"}), canDraw)).toEqual({clip: clipOf("running"), facing: 0});
});

test("something waiting on the user is timed from when it began to wait, and nothing waiting clears the clock", () => {
    const none = {question: 0, waiting: 0, suggestion: 0};
    expect(waitingSinceAt({...none, question: 1}, 0, 50)).toBe(50);
    expect(waitingSinceAt({...none, waiting: 2}, 20, 50)).toBe(20);
    expect(waitingSinceAt(none, 20, 50)).toBe(0);
});
