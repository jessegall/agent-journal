// @vitest-environment node
import {expect, test} from "vitest";

const {ASLEEP_AFTER, beatClipsOf, beatsAfter, clipOf, figureStateOf} = await import("../src/domain/figureState.js");
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

test("a beat fires only for what reached the row after it was last seen, oldest first, and a voice's own gag comes first", () => {
    const row = agent({cards: [{at: 5, tone: "commit"}, {at: 20, icon: "check", tone: "danger"}, {at: 30, tone: "danger"}], person_at: 25});
    expect(beatsAfter(row, 10).map((fire) => fire.beat)).toEqual(["failed", "heard", "refused"]);
    expect(beatClipsOf("squire", "failed")).toEqual(["squire_chase", "shake"]);
    expect(beatClipsOf("homie", "failed")).toEqual(["shake"]);
});

test("the figure points at the most pressing thing behind a tab, never at a tab already in front, and at nothing that merely happens", () => {
    const counts = {question: 1, waiting: 2, suggestion: 1, feed: 9};
    expect(pointedView(counts, {question: "behind", waiting: "behind"})).toBe("question");
    expect(pointedView(counts, {question: "front", waiting: "behind"})).toBe("waiting");
    expect(pointedView(counts, {question: "front", waiting: "front", feed: "behind"})).toBe(null);
    expect(pointedView({question: 0}, {question: "behind"})).toBe(null);
});
