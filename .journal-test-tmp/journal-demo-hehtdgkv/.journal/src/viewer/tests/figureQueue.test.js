// @vitest-environment node
import {describe, expect, it} from "vitest";
import {CLIPS} from "../src/figure/figure.js";
import {givesWay} from "../src/figure/pile.js";
import {EAGER, answerTo, eagerFor, isListening, playedFrom, queuedFirst, queues, stillGoing, workMoments} from "../src/figure/reactions.js";

const named = Object.fromEntries(CLIPS.map((clip) => [clip.name, clip]));
const memoryOf = () => ({reacted: new Map(), played: [], tally: {plain: 0, last: ""}});
const has = () => true;

// the thinking act as the figure answers a look while the agent thinks, at `now`
function thinkingAct(memory, now) {
    const moment = workMoments("thinking", false, 0, now).moments.find((each) => each.beat === "pondering");
    return answerTo(moment, "butler", memory, now, () => 0, has)?.beat;
}

describe("the thinking act and the queue", () => {
    it("ends with the thinking: started while the agent thinks, it is gone from the queue and broken off the moment the thinking ends", () => {
        const act = thinkingAct(memoryOf(), 1000);
        expect(act.during).toBe("thinking");
        let beats = [act, {clip: "nod", card: ""}];
        const thinking = stillGoing(beats, "thinking", act.clip);
        expect([thinking.beats, thinking.cut], "while it thinks it plays on").toEqual([beats, false]);
        const ended = stillGoing(beats, "writing", act.clip);
        expect(ended.beats.map((beat) => beat.clip), "gone once the thinking ends").toEqual(["nod"]);
        expect(ended.cut, "broken off on screen, its bulb never reached").toBe(true);
        beats = ended.beats;
        expect(stillGoing([act], "idle", "").cut, "and dropped unplayed when it only waited").toBe(false);
        expect(stillGoing([act], "idle", "").beats).toEqual([]);
    });

    it("is never queued twice: another play while one for the thinking waits or plays is not queued", () => {
        const memory = memoryOf();
        const act = thinkingAct(memory, 1000);
        const again = {...act};
        expect(queues([act], again)).toBe(false);
        expect(queues([], again)).toBe(true);
        expect(queues([act], {clip: "nod", card: ""}), "other beats queue as ever").toBe(true);
    });

    it("a first beat that comes while it plays waits behind it: the act plays out, then the first beat, then what waited behind", () => {
        const act = thinkingAct(memoryOf(), 1000);
        const swat = {clip: "tickle_swat", card: ""};
        const queued = queuedFirst([act, {clip: "nod", card: ""}], swat, act.clip);
        expect(queued.map((beat) => beat.clip)).toEqual([act.clip, "tickle_swat", "nod"]);
        const after = playedFrom(playedFrom(queued, act.clip), "tickle_swat");
        expect(after.map((beat) => beat.clip), "after the act and the swat, the nod").toEqual(["nod"]);
        expect(stillGoing(after, "idle", "nod").beats.some((beat) => beat.clip === act.clip)).toBe(false);
        // a beat that played to its end takes only itself off the queue, never the one that came first meanwhile
        expect(playedFrom([swat, {clip: "nod", card: ""}], act.clip).map((beat) => beat.clip)).toEqual(["tickle_swat", "nod"]);
        // an act that played to its end while a beat put first came in front of it is gone too, so it never plays a second time
        const call = {clip: "phone_call", card: "messages:9"};
        expect(playedFrom([swat, call, {clip: "nod", card: ""}], "phone_call").map((beat) => beat.clip)).toEqual(["tickle_swat", "nod"]);
    });
});

describe("acts that hold", () => {
    it("the anticipation of a run's end plays through whatever comes but that end: no moment is heard while it lasts, and nothing else cuts its clip", () => {
        expect(named.eager.holds, "declared on the act").toBe(true);
        const progress = {share: 0.98, began: 0, ended: ""};
        const eager = eagerFor(progress, null, () => 0, EAGER.long + 1).eager;
        expect(eager.on).toBe(true);
        expect(isListening(eager), "a tickle, a card or a look waits it out").toBe(false);
        for (const seconds of [0.5, 3, 30]) {
            expect(givesWay({clip: named.eager}, seconds), `${seconds}`).toBe(false);
            expect(givesWay({clip: named.eager}, seconds, {urgent: true}), `${seconds} even for a trip that drops everything`).toBe(false);
        }
    });

    it("the celebration after it plays to its end: a first beat that comes meanwhile waits behind it, and it is never cut", () => {
        for (const [moment, tone] of [["bar_done", "good"], ["bar_failed", "bad"]]) {
            const progress = {share: 0.98, began: 0, ended: ""};
            const eager = eagerFor(progress, null, () => 0, EAGER.long + 1).eager;
            const end = eagerFor({...progress, share: 1, ended: tone}, eager, () => 0, EAGER.long + 5);
            expect(end.moment.beat).toBe(moment);
            expect(isListening(end.eager), "listening again once the run has ended").toBe(true);
            const celebration = answerTo(end.moment, "butler", memoryOf(), 0, () => 0, has).beat;
            expect(celebration.holds, `${moment} declared to hold`).toBe(true);
            const swat = {clip: "tickle_swat", card: ""};
            const queued = queuedFirst([celebration], swat, celebration.clip);
            expect(queued.map((beat) => beat.clip), `${moment} the swat waits behind it`).toEqual([celebration.clip, "tickle_swat"]);
            expect(givesWay({clip: named[celebration.clip], once: true, holds: true}, 60), `${moment} never cut`).toBe(false);
        }
        expect(givesWay({clip: named.nod, once: true}, 1), "nor any other act played once").toBe(false);
    });
});

describe("a one-off act whose mark moves while it plays", () => {
    it("goes on facing the way it began, never starting again from its first frame; a loop, another act or a finished one does not", async () => {
        const {goesOnFacing} = await import("../src/figure/timeline.js");
        const call = {name: "phone_call"};
        const playing = {clip: call, facing: 1, once: true};
        expect(goesOnFacing({clip: call, facing: -1, once: true}, playing, false), "the mark moved to the other side mid-call").toBe(true);
        expect(goesOnFacing({clip: call, facing: -1, once: true}, playing, true), "a call that played out is over").toBe(false);
        expect(goesOnFacing({clip: {name: "joy"}, facing: -1, once: true}, playing, false)).toBe(false);
        expect(goesOnFacing({clip: {name: "walk"}, facing: -1}, {clip: {name: "walk"}, facing: 1}, false), "a loop turns as it goes").toBe(false);
    });
});

describe("what the figure acts on", () => {
    it("drops an act left waiting in the queue past ten seconds, keeps the one on screen and the ones queued since", async () => {
        const {FRESH_SECONDS, freshBeats} = await import("../src/figure/reactions.js");
        const beats = [
            {clip: "joy", queuedAt: 100},
            {clip: "phone_call", queuedAt: 100},
            {clip: "nod", queuedAt: 108},
            {clip: "ponder", during: "thinking"},
        ];
        expect(freshBeats(beats, "joy", 100 + FRESH_SECONDS + 1).map((beat) => beat.clip), "the joy plays on; the late call goes").toEqual(["joy", "nod", "ponder"]);
        expect(freshBeats(beats, "", 100 + FRESH_SECONDS).map((beat) => beat.clip), "ten seconds is still fresh").toEqual(["joy", "phone_call", "nod", "ponder"]);
    });
});

it("stepping out of the way waits while an act that may not be cut plays, and goes at once otherwise", async () => {
    const {uncut} = await import("../src/figure/reactions.js");
    expect(uncut([{clip: "hat_tip", holds: true}], "hat_tip")).toBe(true);
    expect(uncut([{clip: "nod"}], "nod")).toBe(false);
    expect(uncut([{clip: "hat_tip", holds: true}], ""), "waiting in the queue, not yet on screen").toBe(false);
    expect(uncut([], "")).toBe(false);
});

it("the running bar is never watched while an act played once is on screen, an entrance, an exit or any other", async () => {
    const {watchesBar} = await import("../src/figure/reactions.js");
    const watching = {watches: true, until: 99};
    expect(watchesBar(watching, {clip: {name: "idle"}})).toBe(true);
    expect(watchesBar(watching, {clip: {name: "enter"}, once: true, arrival: true})).toBe(false);
    expect(watchesBar(watching, {clip: {name: "hat_tip"}, once: true})).toBe(false);
    expect(watchesBar({watches: false, until: 99}, {clip: {name: "idle"}})).toBe(false);
    expect(watchesBar(null, {clip: {name: "idle"}})).toBe(false);
});

it("as a run ends the figure looks at what told it, the mark or the docked bar, whichever is nearer, a second before its visor lights", async () => {
    const {nearestTell} = await import("../src/figure/places.js");
    const {lightOnce, VISOR} = await import("../src/figure/visor.js");
    const head = {x: 500, y: 500};
    const mark = {left: 100, right: 300, top: 100, bottom: 130};
    const bar = {left: 350, right: 750, top: 560, bottom: 566};
    expect(nearestTell(mark, bar, head), "the docked bar under it is nearer").toEqual({x: 500, y: 563});
    expect(nearestTell({left: 480, right: 520, top: 480, bottom: 500}, bar, head), "a mark beside its head is nearer").toEqual({x: 500, y: 490});
    expect(nearestTell(mark, null, head)).toEqual({x: 200, y: 115});
    expect(nearestTell(null, null, head)).toBe(null);
    // the visor lights only once the look has held VISOR.looks seconds
    expect(VISOR.looks).toBeGreaterThanOrEqual(1);
    let lit = {tone: "good", at: null, since: 0, card: "c"};
    lit = lightOnce(lit, true, 0.2);
    expect(lit.at).toBe(null);
    lit = lightOnce(lit, true, 0.2 + VISOR.looks - 0.01);
    expect(lit.at, "held just short of the second").toBe(null);
    lit = lightOnce(lit, true, 0.2 + VISOR.looks);
    expect(lit.at).toBe(0.2 + VISOR.looks);
});
