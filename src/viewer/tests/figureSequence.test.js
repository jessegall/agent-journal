// @vitest-environment node
import {expect, test} from "vitest";

const {LIFETIME, PILE, SEQUENCES, alive, cooldownsOf, draw, sequenceIn} = await import("../src/figure/pile.js");
const {answerTo, freshBeats, headBeat, pastimeFor, queuedFirst} = await import("../src/figure/reactions.js");
const {GROUNDED, clipFor} = await import("../src/domain/figureState.js");

const has = () => true;
const memoryOf = () => ({reacted: new Map(), played: [], tally: {plain: 0, last: ""}});

test("every act is an object of the pile with its group, its lifetime and the cooldowns it waits, its group's and its own read from the act itself", () => {
    for (const entry of PILE) {
        expect(entry.group.name, entry.name).toBe(entry.when.moment);
        expect(typeof entry.lifetime, entry.name).toBe("number");
    }
    const search = PILE.find((entry) => entry.when.moment === "held:search" && entry.name === "search");
    expect([search.group, search.cooldown]).toEqual([{name: "held:search", cooldown: 120}, 300]);
    expect(cooldownsOf(search)).toEqual([["held:search", 120], ["held:search/search", 300]]);
    // a group's cooldown alone, an act's own alone
    expect(cooldownsOf(PILE.find((entry) => entry.name === "halo"))).toEqual([["sin_fixed", 300]]);
    expect(cooldownsOf(PILE.find((entry) => entry.name === "hang"))).toEqual([["perch/hang", 120]]);
    // drawn, no act of the group plays for the group's two minutes, and the act itself not for its own five
    const memory = new Map();
    const drawn = (now) => draw({moment: "held:search", home: true, memory, now}, () => 0)?.name ?? null;
    expect(drawn(0)).toBe("search");
    expect(drawn(119)).toBe(null);
    expect(drawn(120)).toBe("binoculars");
    expect(drawn(240), "the search and the binoculars wait their own five minutes").toBe(null);
    expect(drawn(300)).toBe("search");
});

test("an act waits in the queue only its lifetime: the tickle's swat of three seconds is dropped after them, a nod of the default ten kept within its own", () => {
    const memory = memoryOf();
    const swat = {...answerTo({beat: "tickled", time: 100}, "butler", memory, 100, () => 0, has).beat, queuedAt: 100};
    const nod = {...answerTo({beat: "task_finished", time: 100, card: "todos:1"}, "butler", memory, 100, () => 0, has).beat, queuedAt: 100};
    expect([swat.clip, swat.lifetime, nod.clip, nod.lifetime ?? LIFETIME]).toEqual(["tickle_swat", 3, "nod", 10]);
    const clips = (now) => freshBeats([swat, nod], "", now).map((beat) => beat.clip);
    expect(clips(103)).toEqual(["tickle_swat", "nod"]);
    expect(clips(104)).toEqual(["nod"]);
    expect(clips(110)).toEqual(["nod"]);
    expect(clips(111)).toEqual([]);
    // a sequence keeps to its own lifetime as well: the build is given up a minute after it was due and not begun
    expect([alive(SEQUENCES.build, 0, 60), alive(SEQUENCES.build, 0, 61)]).toEqual([true, false]);
});

test("a sequence is one entry of its own: the build, of the hammering, the inspections and the push, its cooldown the one the run's boxes wait", () => {
    expect(SEQUENCES.build).toEqual({name: "build", acts: ["work", "inspect", "push"], when: {box: true}, cooldown: 180, lifetime: 60});
    expect(PILE.find((entry) => entry.when.moment === "unit").group.cooldown).toBe(SEQUENCES.build.cooldown);
});

test("from the first blow on a box until it is pushed onto the pile the build plays whole: a celebration, a sign, a tickle and a pastime meanwhile wait", () => {
    const memory = memoryOf();
    const place = {posture: "stand", face: 0};
    const shown = (scene) => clipFor({mode: GROUNDED, place, state: "testing", ...scene}, has).clip;
    let beats = [];
    const queue = (moment, now) => {
        const beat = {...answerTo(moment, "butler", memory, now, () => 0, has).beat, queuedAt: now};
        beats = moment.beat === "tickled" ? queuedFirst(beats, beat, "") : [...beats, beat];
    };
    const build = sequenceIn({box: true});
    expect(build?.name).toBe("build");
    queue({beat: "tests_passed", time: 101, card: "tests:1"}, 101);
    queue({beat: "question_asked", time: 102, card: "question:1"}, 102);
    queue({beat: "tickled", time: 103}, 103);
    expect(beats.map((beat) => beat.clip)).toEqual(["tickle_swat", "nod", "ask_sign"]);
    // hammering, inspecting the box, hammering again and pushing it to the pile, the figure plays nothing but the build
    for (const [now, doing] of [[101, "work"], [103, "inspect"], [104, "work"], [106, "push"], [107, "push"]]) {
        beats = freshBeats(beats, "", now);
        expect(shown({beat: headBeat(beats, build), doing}), `${doing} at ${now}`).toBe(doing);
        const pastime = pastimeFor({place, beats: 0, held: true, room: Infinity, voice: "butler"}, {state: "idle", lasted: 1000}, new Map(), now, () => 0, has);
        expect(pastime, `no pastime at ${now}`).toBe(null);
    }
    // on the pile, the figure free again, what still lives plays: the swat's three seconds are over, the nod and the sign wait on
    beats = freshBeats(beats, "", 108);
    expect(sequenceIn({box: false})).toBe(null);
    expect(beats.map((beat) => beat.clip)).toEqual(["nod", "ask_sign"]);
    expect(shown({beat: headBeat(beats, null), doing: "idle"})).toBe("nod");
});
