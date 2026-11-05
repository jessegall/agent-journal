// @vitest-environment node
import {expect, test} from "vitest";

const {CLIPS} = await import("../src/figure/figure.js");
const {SHOWPIECES} = await import("../src/figure/pile.js");
const {answerTo, freshBeats, headBeat, playedFrom} = await import("../src/figure/reactions.js");
const {actOver, testResultsAfter} = await import("../src/domain/figureState.js");

const has = () => true;
const FPS = 12;
// a watched test run's mark, `time` seconds when it began, running or ended `ending`
const run = (id, time, ending) => ({key: `messages:${id}`, time, label: "Running tests", guesses: {test: true}, watch: {figure: "Tests", ending}});

// The figure's beats played as VoiceFigure's step plays them, a frame at a time from `from` to `to` seconds: the act once on screen ends
// the moment its clip has played to its end, before what comes next is chosen, and only then does the head of the queue go on, unless a
// sequence holds the figure (`holding(seconds)`, as the box of the run pushed onto the pile). Each look a few times a second feeds the
// run marks `cards(seconds)` through testResultsAfter and answers what ended. It returns the acts played, each as it started.
function played({from, to, cards, holding, memory, known, state}) {
    const started = [];
    for (let frame = Math.round(from * FPS); frame <= to * FPS; frame++) {
        const now = frame / FPS;
        if (frame % 3 === 0) {
            for (const moment of testResultsAfter({data: {cards: cards(now)}}, known, 0)) {
                const answer = answerTo(moment, "butler", memory, now, () => 0, has);
                if (answer?.beat) state.beats = [...state.beats, {...answer.beat, queuedAt: now}];
            }
        }
        const shown = state.playing && {clip: CLIPS.find((clip) => clip.name === state.playing.name), once: true};
        if (shown && actOver(shown, Math.floor((now - state.playing.started) * FPS))) {
            state.beats = playedFrom(state.beats, state.playing.name);
            state.playing = null;
        }
        state.beats = freshBeats(state.beats, state.playing?.name ?? "", now);
        const head = headBeat(state.beats, holding(now));
        if (!state.playing && head) {
            state.playing = {name: head.clip, started: now};
            started.push({clip: head.clip, at: now});
        }
    }
    return started;
}

test("one fixed run plays the bug shot once, even when the push of its box holds the figure past the act's end, and the next fixed run after the cooldown plays it again", () => {
    const memory = {reacted: new Map(), played: []};
    const known = new Map();
    const state = {beats: [], playing: null};
    // a run fails, and the next passes a minute later: the bug of the failure is fixed; the run's box is pushed onto the pile from 3 seconds
    // after the pass until long after the bug shot would have ended, while the figure's beat still lives
    const first = (now) => [run(1, 10, now < 20 ? "" : "failed with code 1"), ...(now >= 60 ? [run(2, 60, now < 70 ? "" : "finished")] : [])];
    const pushing = (now) => (now >= 73 && now < 79 ? {name: "build"} : null);
    const once = played({from: 0, to: 120, cards: first, holding: pushing, memory, known, state});
    const shots = (acts) => acts.filter((act) => ["bug_shot", "bug_smash"].includes(act.clip));
    expect(shots(once).map((act) => act.clip)).toEqual(["bug_shot"]);
    expect(state.beats).toEqual([]);
    // the next fixed run, once the bug shot's own cooldown is over, plays it again
    const later = 70 + SHOWPIECES.bug_shot + 30;
    const second = (now) => [...first(now), run(3, later, now < later + 10 ? "" : "failed with code 1"), ...(now >= later + 40 ? [run(4, later + 40, now < later + 50 ? "" : "finished")] : [])];
    const again = played({from: later - 5, to: later + 90, cards: second, holding: () => null, memory, known, state});
    expect(shots(again).map((act) => act.clip)).toEqual(["bug_shot"]);
});
