// @vitest-environment node
import {expect, test} from "vitest";
import {PILE, SEQUENCES, SHENANIGAN, SHOWPIECES, choicesFor, draw, givesWay, lineOf, sequenceLineOf} from "../src/figure/pile.js";
import {CLIPS, LEFT_OUT} from "../src/figure/figure.js";
import {ACTS} from "../src/figure/acts.js";
import {unitGranted} from "../src/figure/parcels.js";
import {flips} from "../src/figure/reactions.js";

const names = (entries) => entries.map((entry) => entry.name);
// a roll that lands at `share` of the way through the tickets
const rolls = (...shares) => () => shares.shift();

test("the pile is filtered to what may play where things stand: the moment, the voice, how long the state has lasted, a free hand", () => {
    expect(names(choicesFor({moment: "tests_failed"}))).toEqual(["startled", "dismay", "tantrum", "nothing"]);
    expect(names(choicesFor({moment: "heard", voice: "butler"}))).toEqual(["bow", "nothing"]);
    expect(names(choicesFor({moment: "heard", voice: "homie"}))).toEqual(["nod", "nothing"]);
    // an idle act once the state has lasted long enough, and only while the figure has nothing to do; a shenanigan only with the room for it
    const idle = names(choicesFor({moment: "pastime", free: true, room: Infinity, lasted: 20, voice: "coach"}));
    expect(idle).toEqual(["hop_up", "nothing"]);
    expect(names(choicesFor({moment: "pastime", free: true, room: Infinity, lasted: 1000, voice: "coach"}))).toContain("whistle");
    expect(names(choicesFor({moment: "pastime", free: false, room: 0, lasted: 1000, voice: "coach"}))).toEqual(["nothing"]);
    // a hang only with a free hand while the figure has nothing to do, a backflip only on a high jump, the work's acts only while that work goes on
    expect(names(choicesFor({moment: "perch", hands: false}))).toEqual(["stand"]);
    expect(names(choicesFor({moment: "perch", hands: true, free: true}))).toEqual(["hang", "stand"]);
    expect(names(choicesFor({moment: "perch", hands: true, free: false}))).toEqual(["stand"]);
    expect(names(choicesFor({moment: "jump", high: false}))).toEqual(["jump"]);
    expect(names(choicesFor({moment: "spell", state: "reading"}))).toEqual(["reading", "nothing"]);
    // what the figure cannot draw where it is, it never draws
    expect(names(choicesFor({moment: "tests_failed", has: (name) => name !== "dismay"}))).toEqual(["startled", "tantrum", "nothing"]);
});

test("one is drawn by weight, a weight of 3 counting as three tickets, and a moment cools down once it has played", () => {
    // task_finished: nod 4, hand_rub 4, nothing 7: the first four tickets of fifteen are the nod's
    for (const [share, name] of [[0, "nod"], [0.26, "nod"], [0.27, "hand_rub"], [0.53, "hand_rub"]]) expect(draw({moment: "task_finished"}, rolls(share)).name).toBe(name);
    // a moment's nothing is a draw that plays nothing
    expect(draw({moment: "tests_failed"}, rolls(0.99))).toBe(null);
    const memory = new Map();
    expect(draw({moment: "tests_failed", memory, now: 100}, rolls(0)).name).toBe("startled");
    expect(draw({moment: "tests_failed", memory, now: 110}, rolls(0))).toBe(null);
    expect(draw({moment: "tests_failed", memory, now: 120}, rolls(0)).name).toBe("startled");
});

test("after three acts in a row with no shenanigan among them, the next draw that may be one is one; an act just played is not drawn again at once", () => {
    const tally = {plain: 0, last: ""};
    const free = {moment: "pastime", free: true, room: Infinity, lasted: 1000, voice: "butler", tally};
    // three plain acts, and the next draw, at a roll that would play nothing, is a shenanigan all the same
    for (let act = 0; act < SHENANIGAN.after; act++) draw({moment: "reported", tally}, rolls(0));
    expect(tally.plain).toBe(SHENANIGAN.after);
    const forced = draw(free, rolls(0.99));
    expect(forced.shenanigan).toBe(true);
    expect(tally.plain).toBe(0);
    // a moment with no shenanigan in it draws as ever
    for (let act = 0; act < SHENANIGAN.after; act++) draw({moment: "reported", tally: {plain: 0, last: ""}}, rolls(0));
    expect(draw({moment: "perch", tally: {plain: 5, last: ""}}, rolls(0)).name).toBe("stand");
    // the act just played is passed over while another may play
    expect(draw({moment: "reported", tally: {plain: 0, last: "read"}}, rolls(0)).name).toBe("nod");
    expect(draw({moment: "bar_failed", tally: {plain: 0, last: "fume"}}, rolls(0)).name).toBe("tantrum");
    expect(draw({moment: "bar_failed", tally: {plain: 0, last: "fume"}, has: (name) => name === "fume"}, rolls(0)).name).toBe("fume");
});

test("no act played once is cut off by the next moment: it plays out, a look about, a nod or a fall alike", () => {
    for (const name of ["look_left", "rest", "nod", "fall", "backflip", "tumble", "joy", "phone_call", "tantrum"]) {
        const clip = CLIPS.find((each) => each.name === name);
        for (const seconds of [0.5, 3, 60]) expect(givesWay({clip, once: true}, seconds, {urgent: true}), `${name} ${seconds}`).toBe(false);
    }
});

test("every act in the pile and every sequence, one line each: its weight, its condition, whether it may be cut, its group's cooldown and its own, and its lifetime", () => {
    expect([...PILE.map(lineOf), ...Object.values(SEQUENCES).map(sequenceLineOf)]).toEqual([
        "clip nod ×2 when moment=tests_passed, plays out, group cools 20s",
        "nothing nothing ×1 when moment=tests_passed, group cools 20s",
        "clip bug_shot ×3 when moment=tests_fixed, plays out, group cools 20s, cools 1800s",
        "clip bug_smash ×2 when moment=tests_fixed, plays out, group cools 20s, cools 1800s",
        "clip nod ×2 when moment=tests_fixed, plays out, group cools 20s",
        "clip startled ×2 when moment=tests_failed, plays out, group cools 20s",
        "clip dismay ×1 when moment=tests_failed, plays out, group cools 20s",
        "clip tantrum ×3 when moment=tests_failed, plays out, group cools 20s",
        "nothing nothing ×1 when moment=tests_failed, group cools 20s",
        "clip nod ×2 when moment=committed, plays out, group cools 30s",
        "nothing nothing ×2 when moment=committed, group cools 30s",
        "clip halo ×1 when moment=sin_fixed, plays out, group cools 300s",
        "nothing nothing ×2 when moment=sin_fixed, group cools 300s",
        "clip repent ×1 when moment=sin_committed, plays out, group cools 300s",
        "nothing nothing ×2 when moment=sin_committed, group cools 300s",
        "clip nod ×4 when moment=task_finished, plays out, group cools 90s",
        "clip hand_rub ×4 when moment=task_finished, plays out, group cools 90s",
        "nothing nothing ×7 when moment=task_finished, group cools 90s",
        "clip ask_sign ×9 when moment=question_asked, plays out, group cools 60s",
        "clip look_up ×3 when moment=question_asked, plays out, group cools 60s",
        "nothing nothing ×8 when moment=question_asked, group cools 60s",
        "gaze read ×3 when moment=reported, group cools 90s",
        "clip nod ×1 when moment=reported, plays out, group cools 90s",
        "nothing nothing ×4 when moment=reported, group cools 90s",
        "gaze read ×3 when moment=read_message, group cools 30s",
        "nothing nothing ×1 when moment=read_message, group cools 30s",
        "clip file_card ×3 when moment=fact_filed, plays out, group cools 120s",
        "clip nod ×1 when moment=fact_filed, plays out, group cools 120s",
        "nothing nothing ×6 when moment=fact_filed, group cools 120s",
        "clip nod ×2 when moment=check_passed, plays out, group cools 120s",
        "nothing nothing ×9 when moment=check_passed, group cools 120s",
        "clip joy ×2 when moment=bar_done, plays out",
        "clip fume ×1 when moment=bar_failed, plays out",
        "clip tantrum ×3 when moment=bar_failed, plays out",
        "clip look_left ×2 when moment=standing, plays out, group cools 12s",
        "clip look_right ×2 when moment=standing, plays out, group cools 12s",
        "clip look_up ×1 when moment=standing, plays out, group cools 12s",
        "nothing nothing ×40 when moment=standing, group cools 12s",
        "clip tumble ×3 when moment=launched, plays out, group cools 300s",
        "nothing nothing ×47 when moment=launched, group cools 300s",
        "clip wipe_brow ×4 when moment=building, plays out, group cools 30s",
        "clip look_left ×1 when moment=building, plays out, group cools 30s",
        "clip look_right ×1 when moment=building, plays out, group cools 30s",
        "nothing nothing ×69 when moment=building, group cools 30s",
        "clip shake ×3 when moment=failed, plays out, group cools 20s",
        "clip tantrum ×2 when moment=failed, plays out, group cools 20s",
        "nothing nothing ×2 when moment=failed, group cools 20s",
        "clip shake ×1 when moment=refused, plays out, group cools 20s",
        "nothing nothing ×1 when moment=refused, group cools 20s",
        "clip stretch ×2 when moment=work_done, plays out, group cools 120s",
        "nothing nothing ×3 when moment=work_done, group cools 120s",
        "pick ponder ×1 when moment=pondering, group cools 30-60s",
        "pick cloud ×1 when moment=thought_cloud, group cools 90s",
        "pick bulb ×1 when moment=light_bulb, group cools 150s",
        "look amused ×3 when moment=answered, group cools 15s",
        "nothing nothing ×2 when moment=answered, group cools 15s",
        "clip bow ×1 when moment=heard voices=butler, plays out, group cools 30s",
        "clip salute ×1 when moment=heard voices=squire, plays out, group cools 30s",
        "clip nod ×1 when moment=heard voices=coach,colleague,homie, plays out, group cools 30s",
        "nothing nothing ×1 when moment=heard, group cools 30s",
        "clip stumble ×3 when moment=long_walk, plays out, group cools 90s",
        "nothing nothing ×22 when moment=long_walk, group cools 90s",
        "clip glance ×7 when moment=card_arrived, plays out, group cools 20s",
        "nothing nothing ×13 when moment=card_arrived, group cools 20s",
        "look reading ×1 when moment=typing, group cools 60s",
        "nothing nothing ×4 when moment=typing, group cools 60s",
        "look hearts ×1 when moment=reacted:❤️",
        "look amused ×1 when moment=reacted:👍",
        "look startled ×1 when moment=reacted:🎉",
        "look amused ×1 when moment=reacted:😄",
        "look reading ×1 when moment=reacted:👀",
        "look hearts ×1 when moment=reacted:🙏",
        "look worried ×1 when moment=reacted:👎",
        "look worried ×1 when moment=reacted:💔",
        "look angry ×1 when moment=reacted:😠",
        "look amused ×1 when moment=reacted:🎩",
        "look reading ×1 when moment=reacted:🧐",
        "look amused ×1 when moment=reacted:🥂",
        "look amused ×1 when moment=reacted:🤙",
        "look amused ×1 when moment=reacted:😎",
        "look startled ×1 when moment=reacted:🔥",
        "look amused ×1 when moment=reacted:💪",
        "look hearts ×1 when moment=reacted:🏆",
        "look angry ×1 when moment=reacted:⚔️",
        "look worried ×1 when moment=reacted:🛡️",
        "look amused ×1 when moment=reacted:🏰",
        "clip hat_tip ×1 when moment=agent_reacted:🎩 voices=butler, plays out",
        "clip monocle ×1 when moment=agent_reacted:🧐 voices=butler, plays out",
        "clip toast ×1 when moment=agent_reacted:🥂 voices=butler, plays out",
        "clip shaka ×1 when moment=agent_reacted:🤙 voices=homie, plays out",
        "clip shades ×1 when moment=agent_reacted:😎 voices=homie, plays out",
        "clip fire ×1 when moment=agent_reacted:🔥 voices=homie, plays out",
        "clip thumbs_up ×1 when moment=agent_reacted:👍 voices=colleague, plays out",
        "clip peer ×1 when moment=agent_reacted:👀 voices=colleague, plays out",
        "clip party_popper ×1 when moment=agent_reacted:🎉 voices=coach, plays out",
        "clip flex ×1 when moment=agent_reacted:💪 voices=coach, plays out",
        "clip trophy ×1 when moment=agent_reacted:🏆 voices=coach, plays out",
        "clip sword ×1 when moment=agent_reacted:⚔️ voices=squire, plays out",
        "clip shield_up ×1 when moment=agent_reacted:🛡️ voices=squire, plays out",
        "clip castle ×1 when moment=agent_reacted:🏰 voices=squire, plays out",
        "clip thanks ×1 when moment=agent_reacted:🙏, plays out",
        "clip tantrum ×1 when moment=agent_reacted:😠, plays out",
        "clip tantrum ×1 when moment=agent_reacted:😡, plays out",
        "clip stretch ×3 when moment=pastime free=true lasted=90, plays out, cools 90s",
        "clip rest ×3 when moment=pastime free=true lasted=180, plays out, cools 120s",
        "clip yawn ×2 when moment=pastime free=true lasted=60, plays out, cools 60s",
        "clip whistle ×4 when moment=pastime free=true lasted=45 voices=coach, plays out, cools 60s",
        "clip sip ×4 when moment=pastime free=true lasted=45 voices=colleague, plays out, cools 60s",
        "clip groove ×4 when moment=pastime free=true lasted=45 voices=homie, plays out, cools 60s",
        "clip shield_polish ×4 when moment=pastime free=true lasted=45 voices=squire, plays out, cools 60s",
        "shenanigan of 20s clip hop_up ×2 when moment=pastime, plays out, cools 1200s",
        "shenanigan of 12s clip disco ×2 when moment=pastime ball=bubble, plays out, cools 7200s",
        "nothing nothing ×560 when moment=pastime",
        "clip search ×3 when moment=held:search, plays out, group cools 120s, cools 300s",
        "clip binoculars ×2 when moment=held:search home=true, plays out, group cools 120s, cools 300s",
        "clip glass_bubble ×2 when moment=held:search bubble=true, plays out, group cools 120s, cools 300s",
        "clip type ×3 when moment=held:type, plays out",
        "clip type_ponder ×1 when moment=held:type, plays out",
        "clip pack_box ×3 when moment=held:compacting, plays out",
        "clip vacuum ×2 when moment=held:compacting, plays out",
        "clip compacting ×1 when moment=held:compacting, plays out",
        "pick writing ×12 when moment=spell state=writing",
        "pick reading ×12 when moment=spell state=reading",
        "pick searching ×12 when moment=spell state=searching",
        "nothing nothing ×4 when moment=spell",
        "clip tickle_swat ×1 when moment=tickled, plays out, lives 3s",
        "clip eager ×2 when moment=eager slow=true, plays out",
        "nothing nothing ×3 when moment=eager",
        "shenanigan of 3s clip backflip ×7 when moment=jump high=true, plays out, cools 360s",
        "clip jump ×13 when moment=jump, plays out",
        "pick hops ×3 when moment=climb footholds=true",
        "pick unit ×19 when moment=unit, group cools 180s",
        "nothing nothing ×1 when moment=unit, group cools 180s",
        "clip look_up ×1 when moment=progress_jump, plays out, group cools 6s",
        "pick hang ×1 when moment=perch hands=true free=true, cools 120s",
        "pick stand ×5 when moment=perch",
        "pick 0 ×1 when moment=digit",
        "pick 1 ×1 when moment=digit",
        "pick rest ×35 when moment=roam",
        "pick seat ×15 when moment=roam",
        "pick edge ×25 when moment=roam",
        "shenanigan of 90s pick bubble ×15 when moment=roam",
        "pick bubble ×6 when moment=roam free=false",
        "pick tab ×10 when moment=roam",
        "pick ledge ×9 when moment=roam free=true",
        "pick composed ×8 when moment=roam free=true",
        "pick lean ×2 when moment=roam free=true",
        "shenanigan of 60s pick rope_swing ×8 when moment=roam free=true swings=true, cools 900s",
        "pick seat ×6 when moment=laptop",
        "pick bubble_ledge ×1 when moment=laptop",
        "pick middle ×2 when moment=ledge_at",
        "pick third ×1 when moment=ledge_at",
        "pick two_thirds ×1 when moment=ledge_at",
        "pick facing ×4 when moment=composed_as",
        "pick turned_left ×1 when moment=composed_as",
        "pick turned_right ×1 when moment=composed_as",
        "pick leaning_on_left_arm ×1 when moment=composed_as",
        "pick leaning_on_right_arm ×1 when moment=composed_as",
        "sequence build of work, inspect, push while box=true, cools 180s, lives 60s",
    ]);
    // every clip of the pile is one the figure has
    const clips = new Set(CLIPS.map((clip) => clip.name));
    for (const entry of PILE.filter((each) => each.type === "clip")) expect(clips.has(entry.name), entry.name).toBe(true);
});

test("each showpiece waits its own cooldown, listed in one place: the parachute 20 minutes, the disco 2 hours, the rope swing 15, the bug shot and the bug smash 30, the salto 5 to 8, the tickle swats none", () => {
    expect(SHOWPIECES.hop_up).toBe(20 * 60);
    expect([SHOWPIECES.disco, SHOWPIECES.rope_swing]).toEqual([2 * 60 * 60, 15 * 60]);
    expect([SHOWPIECES.bug_shot, SHOWPIECES.bug_smash]).toEqual([30 * 60, 30 * 60]);
    expect(SHOWPIECES.backflip >= 5 * 60 && SHOWPIECES.backflip <= 8 * 60).toBe(true);
    expect(SHOWPIECES.tickle_swat).toBe(0);
    // every showpiece in the pile takes its own cooldown from the list, beside its group's
    const showpieces = PILE.filter((entry) => entry.name in SHOWPIECES);
    expect(showpieces.length).toBeGreaterThan(0);
    for (const entry of showpieces) expect([entry.name, entry.cooldown]).toEqual([entry.name, SHOWPIECES[entry.name]]);
});

test("a showpiece is out of the draw while its cooldown lasts and back in at its own weight once it is over", () => {
    const memory = new Map();
    const idle = (now) => ({moment: "pastime", free: true, room: Infinity, lasted: 1000, voice: "butler", memory, now});
    const hopUp = (now) => choicesFor(idle(now)).find((entry) => entry.name === "hop_up");
    const weight = hopUp(0).weight;
    // the run to the parachute drawn, it is not drawn again for twenty minutes, whatever the roll
    const tickets = choicesFor(idle(0));
    const at = tickets.slice(0, tickets.findIndex((entry) => entry.name === "hop_up")).reduce((sum, entry) => sum + entry.weight, 0);
    expect(draw(idle(0), () => (at + 0.5) / tickets.reduce((sum, entry) => sum + entry.weight, 0)).name).toBe("hop_up");
    for (const now of [1, 60, 600, SHOWPIECES.hop_up - 1]) expect(hopUp(now), String(now)).toBeUndefined();
    expect(hopUp(SHOWPIECES.hop_up).weight).toBe(weight);
    // the salto on a jump up turns now and then, then waits its cooldown before it turns again
    const jumps = new Map();
    expect(flips(400, 112, () => 0, jumps, 0, Infinity)).toBe(true);
    expect(flips(400, 112, () => 0, jumps, SHOWPIECES.backflip - 1, Infinity)).toBe(false);
    expect(flips(400, 112, () => 0, jumps, SHOWPIECES.backflip, Infinity)).toBe(true);
});

test("a running test run builds a server unit nearly every time it may, but never two within three minutes", () => {
    const memory = new Map();
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    // a look every second for an hour, each unit built and piled in the next half minute
    const granted = [];
    for (let now = 0; now < 3600; now++) if (!granted.length || now - granted.at(-1) >= 30) unitGranted(memory, now, random) && granted.push(now);
    const gaps = granted.slice(1).map((at, index) => at - granted[index]);
    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(SEQUENCES.build.cooldown);
    // once it may, it builds one at once most of the time
    expect(gaps.filter((gap) => gap === SEQUENCES.build.cooldown).length / gaps.length).toBeGreaterThan(0.8);
    expect(granted.length).toBeGreaterThanOrEqual(Math.floor(3600 / SEQUENCES.build.cooldown) - 2);
});

test("a pass that fixed a failed test run, and only that, may bring a bug the figure shoots, in place of the visor's glow, waiting its own cooldown and the moment's", () => {
    const bugShot = (moment, scene = {}) => choicesFor({moment, ...scene}).some((entry) => entry.name === "bug_shot");
    expect(bugShot("tests_fixed")).toBe(true);
    for (const moment of ["tests_passed", "tests_failed", "committed", "check_passed", "bar_done", "pastime", "building"]) expect(bugShot(moment, {free: true, lasted: 1000}), moment).toBe(false);
    const entry = PILE.find((each) => each.name === "bug_shot");
    expect(entry).toMatchObject({when: {moment: "tests_fixed"}, cooldown: SHOWPIECES.bug_shot, toward: "", onto: false});
    // drawn, it is not drawn again for its cooldown, and nothing else of a fixed run plays inside the run's own
    const memory = new Map();
    expect(draw({moment: "tests_fixed", memory, now: 0}, () => 0).name).toBe("bug_shot");
    expect(choicesFor({moment: "tests_fixed", memory, now: 10}).filter((each) => each.type !== "nothing")).toEqual([]);
    expect(bugShot("tests_fixed", {memory, now: 30})).toBe(false);
    expect(bugShot("tests_fixed", {memory, now: SHOWPIECES.bug_shot})).toBe(true);
});

test("a finished task never brings the stamp: no stamp in the pile or among the clips, and its moment draws a nod, the hands rubbed together or nothing", () => {
    expect(PILE.some((entry) => entry.name === "stamp")).toBe(false);
    expect(CLIPS.some((clip) => clip.name === "stamp")).toBe(false);
    expect(Object.keys(ACTS)).not.toContain("stamp");
    const drawn = new Set();
    for (let share = 0; share < 1; share += 0.01) drawn.add(draw({moment: "task_finished"}, () => share)?.name ?? "nothing");
    expect([...drawn].sort()).toEqual(["hand_rub", "nod", "nothing"]);
});


test("the butler's hat tip is never cut off by what comes next", async () => {
    const {givesWay} = await import("../src/figure/pile.js");
    const tip = CLIPS.find((clip) => clip.name === "hat_tip");
    expect(tip.holds).toBe(true);
    expect(givesWay({clip: tip, once: true}, 0.1, {urgent: false})).toBe(false);
});

test("the butler never carries a cloth over his arm: no clip or act polishes with it, and his model's cloth is left out like the platter", () => {
    expect(CLIPS.some((clip) => clip.name === "polish")).toBe(false);
    expect(PILE.some((entry) => entry.name === "polish")).toBe(false);
    for (const lasted of [45, 1000]) expect(names(choicesFor({moment: "pastime", free: true, room: Infinity, lasted, voice: "butler"}))).not.toContain("polish");
    expect([...LEFT_OUT].sort()).toEqual(["butler_towel", "butler_tray"]);
});

test("the jump for joy is kept for the end of a run the figure anticipated; an everyday success gets a nod at most", () => {
    for (const moment of ["tests_passed", "tests_fixed", "committed", "task_finished", "check_passed"]) {
        expect(choicesFor({moment}).some((entry) => entry.name === "joy"), moment).toBe(false);
    }
    expect(choicesFor({moment: "bar_done"}).map((entry) => entry.name)).toEqual(["joy"]);
});

test("searching: no search within two minutes of the last, each search at most once in five, and idle while all wait", async () => {
    const {variantOf} = await import("../src/figure/reactions.js");
    const memory = new Map();
    const drawn = [];
    for (let second = 0; second < 1200; second += 10) drawn.push({second, clip: variantOf("search", Math.random, () => true, {memory, now: second, home: true})});
    const searches = drawn.filter((each) => each.clip !== "idle");
    for (let index = 1; index < searches.length; index++) expect(searches[index].second - searches[index - 1].second, "two minutes between searches").toBeGreaterThanOrEqual(120);
    for (const act of ["search", "binoculars", "rummage"]) {
        const times = searches.filter((each) => each.clip === act).map((each) => each.second);
        for (let index = 1; index < times.length; index++) expect(times[index] - times[index - 1], act).toBeGreaterThanOrEqual(300);
    }
    expect(drawn.every((each) => ["search", "binoculars", "rummage", "idle"].includes(each.clip))).toBe(true);
    expect(drawn.some((each) => each.clip === "idle"), "idle while every search waits").toBe(true);
});

test("the binoculars are picked only while the figure stands on the compose box, to scan up the chat from there", async () => {
    const {choicesFor} = await import("../src/figure/pile.js");
    expect(choicesFor({moment: "held:search", home: true}).map((each) => each.name)).toContain("binoculars");
    expect(choicesFor({moment: "held:search", home: false}).map((each) => each.name)).not.toContain("binoculars");
    const {ACTS} = await import("../src/figure/acts.js");
    expect(ACTS.binoculars.up, "tipped up the chat").toBeGreaterThan(5);
});
