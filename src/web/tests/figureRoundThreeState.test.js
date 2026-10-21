// @vitest-environment node
import {expect, test} from "vitest";
import {HELD, cardsAfter, clipFor, frameIn} from "../src/domain/figureState.js";
import {AMBIENT, LONG_WALK_SECONDS, answerTo, ambientFor, stretchClip, walkingMoment} from "../src/figure/reactions.js";
import {CLIPS} from "../src/figure/figure.js";

const VOICES = ["butler", "coach", "colleague", "homie", "squire"];
const memory = () => ({played: [], reacted: new Map()});
const has = (voice) => (name) => CLIPS.some((clip) => clip.name === name && (!clip.voices || clip.voices.includes(voice)));

test("waiting and asking tap a foot toward compose; compacting has its own clip", () => {
    expect(HELD.waiting).toBe("waiting");
    expect(HELD.asking).toBe("waiting");
    expect(HELD.compacting).toBe("compacting");
    expect(clipFor({place: {posture: "sit", face: 70}, state: "asking", doing: "waiting", composeFacing: -30}, () => true)).toEqual({clip: "waiting", facing: -30});
});

test("reading and writing are not replaced by a laptop work roll", () => {
    for (const state of ["reading", "writing"]) expect(stretchClip(state, {stretch: "work", clip: "type"}, () => 0).shows).toBe(HELD[state]);
});

test("sleep plays its yawn once, then loops only its sleeping frames", () => {
    const sleep = CLIPS.find((clip) => clip.name === "sleep");
    for (let frame = 0; frame < sleep.intro; frame++) expect(frameIn(sleep, frame)).toBe(frame);
    for (let frame = sleep.intro; frame < sleep.frames * 8; frame++) expect(frameIn(sleep, frame)).toBeGreaterThanOrEqual(sleep.intro);
});

test("each voice has its own available, occasional pastime", () => {
    for (const voice of VOICES) {
        const own = AMBIENT.find((rule) => rule.voice === voice);
        const due = new Map(AMBIENT.filter((rule) => rule !== own).map((rule) => [rule.clip, Infinity]));
        expect(ambientFor("idle", 1000, due, 1000, () => 0, voice, has(voice))).toBe(own.clip);
        expect(ambientFor("idle", 1000, due, 1001, () => 0, voice, has(voice))).toBe("");
        const blocked = new Map();
        expect(ambientFor("idle", 1000, blocked, 1000, () => 0, voice, () => false)).toBe("");
        expect(blocked.size).toBe(0);
    }
});

test("messages select a voice greeting, with odds and cooldown", () => {
    for (const voice of VOICES) {
        const remembered = memory(), expected = voice === "butler" ? "bow" : voice === "squire" ? "salute" : "nod";
        expect(answerTo({beat: "heard", time: 1}, voice, remembered, 1, () => 0.99, has(voice))).toBe(null);
        expect(answerTo({beat: "heard", time: 2}, voice, remembered, 2, () => 0, has(voice)).beat.clip).toBe(expected);
        expect(answerTo({beat: "heard", time: 3}, voice, remembered, 3, () => 0, has(voice))).toBe(null);
    }
});

test("a long walk can stumble, but a hop and a stationary figure never do", () => {
    const trip = {started: true, moves: true, hopping: false, way: 1};
    expect(walkingMoment(trip, 1, LONG_WALK_SECONDS).moment).toBe(null);
    expect(walkingMoment(trip, 1, LONG_WALK_SECONDS + 1).moment.beat).toBe("long_walk");
    expect(walkingMoment({...trip, hopping: true}, 1, 100)).toEqual({began: 0, moment: null});
    expect(walkingMoment(null, 1, 100)).toEqual({began: 0, moment: null});
    expect(clipFor({trip, place: {posture: "stand"}, beat: {clip: "stumble"}}, () => true)).toMatchObject({clip: "stumble", posture: "walk", once: true});
});

test("only a newly seen card produces an arrival glance", () => {
    const known = new Set(), row = {data: {cards: [{key: "card:1", time: 10}]}};
    expect(cardsAfter(row, known)).toEqual([{beat: "card_arrived", card: "card:1", time: 10}]);
    row.data.cards[0].time = 20;
    expect(cardsAfter(row, known)).toEqual([]);
    for (const voice of VOICES) expect(answerTo({beat: "card_arrived", card: "card:1"}, voice, memory(), 10, () => 0, has(voice)).beat).toEqual({clip: "glance", card: "card:1"});
});
