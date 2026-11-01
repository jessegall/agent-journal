import {PILE as ANIMATIONS, draw} from "./pile.js";
import {VISOR} from "./visor.js";
import {ChatMark} from "../domain/chatMark.js";

// The parcels of code the figure builds on the compose box's top and the UFO that takes them once the work is committed, drawn by the page
// beside the figure (chat/CodeParcel.vue, chat/FlyingSaucer.vue). Every number that decides where they go and when is here, in pixels and
// milliseconds on the page.

// A parcel's drawing, a square block of `units` 1U server units stacked, drawn in 3D by the figure's own renderer and camera
// (figure.js serverBlockOf): `width` pixels wide and as deep, `height` pixels high with the strip of its top that shows, `top`; and how
// far inside either end of the floor one stands at least
export const PARCEL = {width: 24, height: 27, top: 3, units: 2, inside: 14};

// How the parcels and the figure stack on the page, as CSS z-indexes: a parcel behind the figure, but the one it pushes ahead of it, drawn
// over the figure that leans into it, and the boxes on the pile, which the figure keeps clear of, marked for it to read
export const LAYER = {behind: 39, figure: 40, ahead: 41};
export const PILED = "[data-figure-pile]";

// The colours the status lights shine in: amber while the run goes, and the visor's green and red once it has ended
export const LIGHT_COLOURS = {amber: [1, 0.69, 0.125], good: VISOR.colours.good, bad: VISOR.colours.bad};

// Amber lights blink, each out of step with the next: the blink is `phases` steps of `ms` each, a light on for half of them and dimmed to
// `dim` for the rest; green and red stay on
export const BLINK = {phases: 4, ms: 230, dim: 0.25};

// how bright the light numbered `index` on a unit's front is at step `phase` of the blink, with its lights `lit`
export const brightness = (lit, phase, index) => (lit !== "amber" || (phase + index) % BLINK.phases < BLINK.phases / 2 ? 1 : BLINK.dim);

// the steps of the blink a unit's lights `lit` show, one for lights that stay on
export const phasesOf = (lit) => (lit === "amber" ? BLINK.phases : 1);

// The status lights on a unit's front after a look: each unit is built for the run going on as it is made, its `run`, and blinks amber
// until that run ends, then shines green or red as that run ended, for good, whatever later runs do; one made with no run going takes
// the next run's end. `ends` are the runs that ended at the look, each its card and tone (domain/figureState.js processEndsAfter)
export function litAfter(unit, ends) {
    if (unit.lit !== "amber") return unit.lit;
    const end = unit.run ? ends.find((each) => each.card === unit.run) : ends.at(-1);
    return end ? end.tone : unit.lit;
}

// every kind of light a unit shows, each drawn once (chat/VoiceFigure.vue)
export const LIGHT_KINDS = Object.keys(LIGHT_COLOURS);

// The 0 and 1 digits a blow's dust sprays out, as particles: how many at least and at most; how far from the cloud's middle, `middle`
// pixels over the unit's base, each starts, in pixels; how far it flies out, how long it takes to slow to a stop and how long it takes to
// fade, each drawn anew for every digit between the two, in pixels and milliseconds; and the spread of its way round the cloud, in
// radians either side of straight up
export const DIGITS = {least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75};

const between = ([least, most], random) => least + random() * (most - least);

// the digits of one blow at the rolls `random()` gives, each its text, where it starts and how far it flies against the unit's base's
// middle, and how long it moves and fades; each flies its own way out of the cloud, never down through the floor
export function digitsOf(random) {
    const count = DIGITS.least + Math.floor(random() * (DIGITS.most - DIGITS.least + 1));
    return Array.from({length: Math.min(count, DIGITS.most)}, () => {
        const way = -Math.PI / 2 + (random() * 2 - 1) * DIGITS.spread;
        const [across, up] = [Math.cos(way), Math.min(Math.sin(way), -0.1)];
        const start = between(DIGITS.start, random);
        const reach = between(DIGITS.reach, random);
        return {
            text: draw({moment: "digit"}, random).name,
            x: across * start,
            y: DIGITS.middle + up * start,
            dx: across * reach,
            dy: up * reach,
            moveMs: Math.round(between(DIGITS.moveMs, random)),
            fadeMs: Math.round(between(DIGITS.fadeMs, random)),
        };
    });
}

// The pile at the right end of the floor: blocks stacked `high` to a column, each on the top of the one under it, the columns going leftward from the end
export const PILE = {high: 3, gap: 1};

// where the parcel numbered `index` on the pile sits: `left` pixels from the floor's right end, its middle, and `up` above the floor
export function pileSlot(index) {
    const column = Math.floor(index / PILE.high);
    return {left: -(PARCEL.inside + PARCEL.width / 2 + column * (PARCEL.width + PILE.gap)), up: (index % PILE.high) * (PARCEL.height - PARCEL.top)};
}

// whether a run going on now builds a server unit, as the pile draws it (pile.js UNIT): nearly always, but one at most every few minutes
// (pile.js SEQUENCES build), `memory` holding when the last was granted, at `now` in seconds
export const unitGranted = (memory, now, random) => draw({moment: "unit", memory, now}, random) !== null;

// how long a run goes on before the figure builds for it, in seconds, so a run of a few seconds builds nothing and starts no wait
export const BUILD = {after: 5};

// the running chat marks among `cards` that build something, whatever the language or tool, as the server guessed from the command: a
// process or watch card still active; a test run builds nothing
export const buildRuns = (cards) => cards.filter((card) => card.active && (card.process || card.watch) && new ChatMark(card).isBuild());

// The run the figure builds for at `now`, in seconds, its card and when it began: the oldest running build among `cards`, else `shell`,
// a shell command read as a build; null with none, or while it has gone on less than BUILD.after
export function buildRunAt(cards, shell, now) {
    const mark = buildRuns(cards).sort((one, other) => Number(one.time) - Number(other.time))[0];
    const run = mark ? {card: mark.key, since: Number(mark.time)} : shell;
    return run && now - run.since >= BUILD.after ? run : null;
}

// The boxes of the run `run` (buildRunAt), as `units` had them: a run asks the pile for boxes (unitGranted) until it is granted them, and
// keeps them for as long as it goes, so it builds one box after another; once a granted run ends, the wait for the next (pile.js SEQUENCES
// build) is counted from then, `memory` holding when
export function unitsAfter(units, run, memory, now, random) {
    const same = Boolean(units && run && units.card === run.card);
    if (units?.granted && !same) memory.set("unit", now);
    if (!run) return null;
    return same && units.granted ? units : {card: run.card, granted: unitGranted(memory, now, random)};
}

// how far ahead of the box it takes to the pile the figure looks, and how high over the floor, in pixels: the way it goes, at its eyes
export const PUSH_LOOK = {ahead: 140, up: 70};

// What the figure looks at while it works on the boxes, `parcels` as they are and `making` one, a box at `xOf(box)` across the page on the
// floor's top `floor`: the top of the box it hammers, the surface its blows strike; ahead the way it goes, `way`, while it takes a built
// box round and pushes and stacks it, never at that box; and nothing at all while it sets out to build one, so its head is on its work
// and never on a progress bar; null while it does neither, so it may look elsewhere
export function workLook(parcels, making, xOf, floor, way) {
    const box = parcels.find((each) => each.state !== "piled");
    if (box?.state === "built") return {at: {x: xOf(box) + way * PUSH_LOOK.ahead, y: floor - PUSH_LOOK.up}};
    if (box) return {at: {x: xOf(box), y: floor - box.up - PARCEL.height}};
    return making ? {at: null} : null;
}

// how long the figure hammers each parcel in one stretch, a random number of milliseconds between the two
export const HAMMER = {least: 4000, most: 10000};
export const hammerMs = (random) => HAMMER.least + random() * (HAMMER.most - HAMMER.least);

// Now and then, about one stretch in `chance`, the figure stops hammering to inspect the box with a magnifying glass for `ms`, starting
// between `at` of the way through the stretch, and then hammers a new stretch; at most `most` inspections a box
export const INSPECT = {chance: 0.25, at: [0.25, 0.6], ms: 5000, most: 2};

// The hammering of a box begun at `now`, in milliseconds: when it began, when it is built, and its inspections, each as when it starts and
// ends after the box was begun; every stretch of hammering HAMMER long, an inspection cutting its stretch short and starting a new one
export function hammering(now, random) {
    const inspects = [];
    let at = 0;
    for (;;) {
        const ms = hammerMs(random);
        if (inspects.length >= INSPECT.most || random() >= INSPECT.chance) return {began: now, until: now + at + ms, inspects};
        const from = at + ms * (INSPECT.at[0] + random() * (INSPECT.at[1] - INSPECT.at[0]));
        inspects.push({from, to: from + INSPECT.ms});
        at = from + INSPECT.ms;
    }
}

// whether the figure inspects the box `box` at `now`, its hammering paused
export const inspecting = (box, now) => box.inspects.some((inspect) => now >= box.began + inspect.from && now < box.began + inspect.to);

// how many blows have landed `frames` frames into a hammering whose blows are `blowFrames` frames long and land `lands` of the way through
export const blowsLanded = (frames, blowFrames, lands) => Math.max(Math.floor(frames / blowFrames - lands) + 1, 0);

// While a box the figure built waits to be pushed it goes straight round behind it and pushes, in one move: it answers none of its idle
// moments meanwhile, the looks about and the breaks from the work, and none of their clips waits to play
export const IDLE_MOMENTS = new Set(["standing", "building", "typing", "work_done"]);
export const IDLE_CLIPS = new Set(ANIMATIONS.filter((entry) => IDLE_MOMENTS.has(entry.when.moment) && entry.kind === "clip").map((entry) => entry.name));

// whether a box the figure built waits among `parcels` to be pushed onto the pile
export const pushWaits = (parcels) => parcels.some((each) => each.state === "built");

// the moments of `moments` the figure answers with `parcels` as they are: all of them, but none of its idle ones while a box waits to be pushed
export const answeredWith = (moments, parcels) => (pushWaits(parcels) ? moments.filter((moment) => !IDLE_MOMENTS.has(moment.beat)) : moments);

// how far in front of its feet a pushing figure's hands meet the parcel's middle, and the room it leaves behind a parcel before pushing
export const PUSH = {reach: 40, room: 6};

// whether a figure with its feet at `feet` stands behind a parcel at `parcel`, on its left, so walking right pushes it
export const behind = (parcel, feet) => feet <= parcel - PUSH.reach + 2;

// Where the figure goes next to push a parcel at `parcel` onto the pile at `to`, its feet at `feet`, all page x: round behind the parcel
// first, then along to where the parcel meets the pile
export const pushStand = (parcel, to, feet) => (behind(parcel, feet) ? to - PUSH.reach : parcel - PUSH.reach - PUSH.room);

// Where a parcel at `parcel` is once a figure with its feet at `feet`, walking `way` (1 to the right, -1 to the left), has pushed it toward
// `to`: carried in front of the figure's hands while it walks right from behind it, never past `to`, and left where it is otherwise, as
// when the figure walks round it
export const pushedTo = (parcel, feet, to, way) =>
    way > 0 && feet < parcel && feet + PUSH.reach >= parcel - 2 ? Math.min(to, Math.max(parcel, feet + PUSH.reach)) : parcel;

// The UFO: the most its beam spans, so parcels further apart than that are taken one stop at a time; how far above the floor its middle
// hovers; and how long each part of its flight takes: flying in from far off, moving between stops, at each stop the beam coming on, the
// parcels rising up it and the beam going off, and flying away. Its saucer, drawn in 3D as the figure is (figure.js saucerOf), is `width`
// pixels across, three quarters of the figure's picture; its beam leaves the lamp under its belly `belly` pixels below its middle, `lamp`
// pixels wide; and the lights round its rim blink in turn over `blink` steps of `blinkMs` each.
export const UFO = {
    beamMost: 90, beamLeast: 34, hover: 150, enter: 1800, move: 900, beamOn: 300, lift: 1500, beamOff: 300, leave: 1800,
    width: 84, belly: 13, lamp: 22, blink: 4, blinkMs: 160,
};

// the UFO's beam with its middle at `at` over the floor at `floor`, on the page: where it leaves the lamp under the belly, and how far down
// it reaches, to the floor the boxes stand on
export const beamOf = (at, floor) => ({top: at.y + UFO.belly, reach: Math.max(floor - at.y - UFO.belly, 0)});

// The stops of a UFO taking `parcels` (each {id, x}): the parcels within one beam of each other taken together, left to right, each stop
// at their middle with a beam as wide as they lie
export function stopsOf(parcels) {
    const stops = [];
    for (const parcel of [...parcels].sort((a, b) => a.x - b.x)) {
        const last = stops.at(-1);
        if (last && parcel.x - last.left + PARCEL.width <= UFO.beamMost) {
            last.ids.push(parcel.id);
            last.right = parcel.x;
        } else stops.push({ids: [parcel.id], left: parcel.x, right: parcel.x});
    }
    return stops.map((stop) => ({...stop, x: (stop.left + stop.right) / 2, beam: Math.max(UFO.beamLeast, stop.right - stop.left + PARCEL.width + 8)}));
}

const STOP_MS = UFO.beamOn + UFO.lift + UFO.beamOff;

// how long a flight with `stops` stops lasts
export const flightMs = (stops) => UFO.enter + (stops - 1) * UFO.move + stops * STOP_MS + UFO.leave;

const ease = (k) => k * k * (3 - 2 * k);
const clamp = (k) => Math.min(Math.max(k, 0), 1);
const toward = (a, b, k) => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k});

// Where the UFO is `ms` into its flight over `stops` (stopsOf), hovering UFO.hover pixels above the floor's top at `floor`, coming in
// `from` far off and going `away`: its middle; how strong its beam is, 0 to 1, and how wide; the stop it is at and how far up the beam
// that stop's parcels have risen, 0 to 1; how many stops it has taken; whether it is still coming in, before its first beam; and whether
// it is gone
export function ufoAt(stops, ms, floor, from, away) {
    const over = (stop) => ({x: stop.x, y: floor - UFO.hover});
    const still = {beam: 0, width: stops[0].beam, stop: 0, risen: 0, taken: 0, coming: false, gone: false};
    if (ms < UFO.enter) return {...still, ...toward(from, over(stops[0]), ease(ms / UFO.enter)), coming: true};
    let at = ms - UFO.enter;
    for (const [index, stop] of stops.entries()) {
        if (index > 0) {
            if (at < UFO.move) return {...still, ...toward(over(stops[index - 1]), over(stop), ease(at / UFO.move)), width: stop.beam, stop: index, taken: index};
            at -= UFO.move;
        }
        if (at < STOP_MS) {
            const beam = clamp(at / UFO.beamOn) * (1 - clamp((at - UFO.beamOn - UFO.lift) / UFO.beamOff));
            return {...still, ...over(stop), beam, width: stop.beam, stop: index, risen: ease(clamp((at - UFO.beamOn) / UFO.lift)), taken: index};
        }
        at -= STOP_MS;
    }
    const k = clamp(at / UFO.leave);
    return {...still, ...toward(over(stops.at(-1)), away, k * k), stop: stops.length - 1, risen: 1, taken: stops.length, gone: k >= 1};
}

// How far up the beam the box ranked `rank` of `count` at a stop has been drawn when the stop's lift is `risen` of the way through, 0 to
// 1: the top box (rank 0) first and the others one after another over the first half of the lift, each pulled faster as it nears the UFO
export const BEAM_STAGGER = 0.5;
export function boxRisen(risen, rank, count) {
    const start = count > 1 ? (rank / count) * BEAM_STAGGER : 0;
    const k = clamp((risen - start) / (1 - start));
    return k * k;
}

// how far a box drawn `k` of the way up the beam sways across it, in pixels, its own sway set by `id`: growing smoothly out of rest over
// the first fifth of its lift, then dying away as it nears the UFO, never jumping sideways as the beam first takes its weight
export const BEAM_SWAY = 4;
export const boxSway = (k, id) => (k > 0 ? Math.sin(k * 12 + id * 1.7) * BEAM_SWAY * ease(clamp(k / 0.2)) * (1 - k) : 0);

// The crane: grabbers sent out on its rail along the chat window's top, each taking one box away. Every grabber is the same reel, a trolley
// that zips along the rail from one side and lets its cable down; only its grabbing end differs: the claw, a suction cup like a plunger's
// that drops onto the box's top, or a magnet. The arm is the same reel on the window's right edge instead: it moves up or down to the box's
// height, shoots its rod across, grips the box's side in its tongs and pulls it out sideways, quicker than the others. Each part of a visit,
// in milliseconds, or in pixels a millisecond for a move: the reel's zip along the rail; letting the cable down, slowing to a stop just
// over the box; a moment's hover; the grip; the lift, a tug up and a hold as the cable takes the weight over `tugShare` of it, then up past
// the window's top `clear` pixels; how short the cable is wound up. The arm's reel moves `lift` up or down and its rod shoots `zip`,
// each of its moves taking `least` at the least, so a box near the edge is still seen to go.
// `gap` is the least and most time between one grabber setting off and the next, `room` the pixels kept between two grabbers along the
// window, more than any moves in a step of the check (grabsClash), `pace` how much quicker or slower each goes than the rest, at most, and
// `kinds` the weight each kind is drawn by when several boxes wait.
export const GRAB = {
    zip: 1.1, lower: 800, hover: 280, grip: 340, lift: 1100, tug: 4, tugShare: 0.2, clear: 30, wound: 10,
    arm: {lift: 0.5, zip: 0.6, grip: 200, least: 260},
    gap: [250, 900], room: 30, pace: 0.15,
    kinds: {claw: 3, cup: 2, magnet: 2, arm: 2},
};

// The suction cup (chat/ClawCrane.vue), in pixels: its rod and its rubber cup, wide and high, squashed by `squash` of its height once it
// is pressed on the box; and the magnet: its block on the cable and the horseshoe under it, wide and high, its legs `leg` thick
export const CUP = {rod: 5, width: 18, height: 7, squash: 0.3};
export const MAGNET = {block: 3, width: 16, height: 9, leg: 4.5};

// Each grabbing end hanging under its cable, in pixels: how far over the box's top the cable's end stops when the end meets the box, and
// half the width it takes along the rail with its reel; the arm's tongs, how far out from the box's side their tip stops
export const ENDS = {claw: {clear: 9, half: 24}, cup: {clear: CUP.rod + CUP.height, half: 16}, magnet: {clear: MAGNET.block + MAGNET.height, half: 16}, arm: {clear: 3, half: 6}};

// The crane's claw (chat/ClawCrane.vue), in pixels from its hub, which comes down onto the top of the box: its two prongs come out to
// `side` beside the box's sides and down `reach` of them, their tips `spread` further out while the claw is wide open, so they come down
// around the box, and shut on its sides, each tip turned in under a `hook`
export const CLAW = {hub: 5, side: PARCEL.width / 2 + 1.5, reach: Math.round((PARCEL.height - PARCEL.top) * 0.75), spread: 9, hook: 3};

// the claw's prongs `open` of the way, 1 wide open and 0 shut: each the way it goes, -1 left and 1 right, where it leaves the hub's bar
// across, and where its tip is across and down
export const prongsOf = (open) =>
    [-1, 1].map((way) => ({way, top: way * (CLAW.side + CLAW.spread * open * 0.3), tip: way * (CLAW.side + CLAW.spread * open), reach: CLAW.reach}));

// The kinds of the grabbers for `count` boxes, drawn with `random`: the claw for a single box, else each drawn by weight (GRAB kinds), the
// arm taking no more than half of them, and never the very sequence of the visit before, `last`
export function kindsOf(count, random, last = []) {
    if (count === 1) return ["claw"];
    const drawn = (weights) => {
        let roll = random() * Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        return Object.keys(weights).find((kind) => (roll -= weights[kind]) < 0) ?? Object.keys(weights).at(-1);
    };
    const {arm, ...others} = GRAB.kinds;
    for (let tries = 0; ; tries++) {
        const kinds = [];
        for (let index = 0; index < count; index++) kinds.push(drawn(kinds.filter((kind) => kind === "arm").length < Math.floor(count / 2) ? {...others, arm} : others));
        if (tries >= 8 || kinds.join() !== last.join()) return kinds;
    }
}

const STEP_MS = 25;

// the box's top on the page, standing `up` pixels up the pile on the floor at `floor`
export const boxTop = (box, floor) => floor - box.up - PARCEL.height;

// The grabbers that take `items` (each {id, x, up}) away, one a box, drawn with `random` and kinds unlike `last`'s (kindsOf), the reels
// rolling in at page x `from` and out at `away` along the rail at the window's `top`, the arm on its `right` edge, over the floor at
// `floor`: each {id, kind, x, from, away, pace, start, ...}, and the arm's `y`, the height its reel sets off at. The box farthest along
// goes first, so the next can follow it in; a box with another on it waits for that one, and one the arm takes waits for every box to
// its right in the way of its rod. Each sets off a moment after the one before, `gap`, and no sooner than its way along the rail is clear
// of every grabber already out (grabsClash) and the boxes in its way are gone.
export function grabsOf(items, scene, random, last = []) {
    const kinds = kindsOf(items.length, random, last);
    const along = [...items].sort((one, other) => Math.abs(other.x - scene.from) - Math.abs(one.x - scene.from) || other.up - one.up);
    const planned = along.map((box, index) => ({id: box.id, kind: kinds[index], x: box.x, up: box.up, from: scene.from, away: scene.away, pace: 1 + (random() * 2 - 1) * GRAB.pace, y: between([scene.top + 40, scene.floor - 20], random)}));
    const scheduled = [];
    for (const grab of inTurn(planned)) {
        const blocking = blockersOf(grab, planned).map((other) => scheduled.find((each) => each.id === other.id));
        let start = Math.max(scheduled.length ? scheduled.at(-1).start + between(GRAB.gap, random) : 0, ...blocking.map((each) => each.start + clearMs(each, scene)));
        while (scheduled.some((each) => grabsClash({...grab, start}, each, scene))) start += STEP_MS;
        scheduled.push({...grab, start});
    }
    return scheduled;
}

// the boxes in the way of `grab`'s box among `planned`: one on top of it, and for the arm, any to its right its rod would pass through
const blockersOf = (grab, planned) =>
    planned.filter((other) => other.id !== grab.id && (onTop(other, grab) || (grab.kind === "arm" && other.x > grab.x && Math.abs(other.up - grab.up) < PARCEL.height)));
const onTop = (other, grab) => Math.abs(other.x - grab.x) < PARCEL.width && other.up > grab.up;

// the grabbers of `planned` in the order they set off: as planned, each put off until the boxes in its way have gone ahead of it
function inTurn(planned) {
    const turn = [];
    const waiting = [...planned];
    while (waiting.length) {
        const next = waiting.find((grab) => blockersOf(grab, planned).every((other) => turn.includes(other)));
        turn.push(next);
        waiting.splice(waiting.indexOf(next), 1);
    }
    return turn;
}

// how long each part of `grab`'s visit takes, in milliseconds, its box's top at `top` (boxTop), its parts in order
function partsOf(grab, scene, top) {
    if (grab.kind === "arm") {
        const move = (pixels, speed) => Math.max(pixels / (speed * grab.pace), GRAB.arm.least);
        const tip = grab.x + PARCEL.width / 2 + ENDS.arm.clear;
        return {
            lift: move(Math.abs(top + PARCEL.height / 2 - grab.y), GRAB.arm.lift),
            shoot: move(scene.right - tip, GRAB.arm.zip),
            grip: GRAB.arm.grip,
            pull: move(scene.right - tip + PARCEL.width + 2 * ENDS.arm.clear, GRAB.arm.zip),
        };
    }
    const zip = (from, to) => Math.abs(to - from) / (GRAB.zip * grab.pace);
    return {enter: zip(grab.from, grab.x), lower: GRAB.lower, hover: GRAB.hover, grip: GRAB.grip, lift: GRAB.lift, leave: zip(grab.x, grab.away)};
}

const sum = (parts) => Object.values(parts).reduce((total, ms) => total + ms, 0);

// how long `grab`'s visit lasts, and how long after it sets off its box is out of the way of the others, out past the window's top or edge
export const grabMs = (grab, scene) => sum(partsOf(grab, scene, boxTop(grab, scene.floor)));
function clearMs(grab, scene) {
    const {leave = 0, ...rest} = partsOf(grab, scene, boxTop(grab, scene.floor));
    return sum(rest);
}

// the span along the window's width `grab` takes at `ms` into the crane's visit, [left, right] in page x, or null while it is not out:
// a reel on the rail its end's half width either side of it; the arm from its tongs, with the box they pull, to the window's right edge
export function grabSpan(grab, ms, scene) {
    const at = grabberAt(grab, ms, {...scene, box: {x: grab.x, top: boxTop(grab, scene.floor)}});
    if (!at.out) return null;
    if (grab.kind === "arm") return [at.tip - (at.carried ? PARCEL.width + ENDS.arm.clear : 0), scene.right];
    return [at.x - ENDS[grab.kind].half, at.x + ENDS[grab.kind].half];
}

// whether grabbers `one` and `other` ever come within GRAB room of each other along the window at the same moment of the visit
export function grabsClash(one, other, scene) {
    const from = Math.max(one.start, other.start);
    const to = Math.min(one.start + grabMs(one, scene), other.start + grabMs(other, scene));
    for (let ms = from; ms <= to; ms += STEP_MS) {
        const [a, b] = [grabSpan(one, ms, scene), grabSpan(other, ms, scene)];
        if (a && b && a[0] < b[1] + GRAB.room && b[0] < a[1] + GRAB.room) return true;
    }
    return false;
}

// a move `k` of the way that slows to a stop at its end, never past it
const easeOut = (k) => 1 - (1 - k) ** 3;

// the cable's length `k` of the way through the lift from `reach` to `out`: a quick tug up and a hold as the cable takes the weight, then
// the rest of the way up
function liftedChain(reach, out, k) {
    if (k < GRAB.tugShare) return reach - GRAB.tug * clamp(k / (GRAB.tugShare / 3));
    return reach - GRAB.tug + (out - reach + GRAB.tug) * ease((k - GRAB.tugShare) / (1 - GRAB.tugShare));
}

// Where the grabber `grab` (grabsOf) is `ms` into the crane's visit, its rail along the window's `top`, the arm on its `right` edge, and its
// own box where `box` says it is now, {x, top} on the page, so its cable lets out, or its rod shoots, as far as that box is: whether it is
// `out`, set off and not yet done; and whether it is `done`. A reel on the rail: its trolley's page x; its cable's length down from the
// rail, below the window's top when less than nothing; how open its end is, 1 wide open and 0 shut on the box; and how far it has lifted its
// box, in pixels. The arm: the height of its reel on the edge, y; where its tongs' tip is, page x; how open they are; and how far right it
// has pulled its box, `carried`, in pixels.
export function grabberAt(grab, ms, scene) {
    const at = ms - grab.start;
    if (at < 0) return {kind: grab.kind, out: false, done: false, ...(grab.kind === "arm" ? {y: grab.y, tip: scene.right, open: 1, carried: 0} : {x: grab.from, chain: GRAB.wound, open: 1, lifted: 0})};
    return grab.kind === "arm" ? armAt(grab, at, scene) : reelAt(grab, at, scene);
}

function reelAt(grab, at, scene) {
    const parts = partsOf(grab, scene, scene.box.top);
    const reach = scene.box.top - scene.top - ENDS[grab.kind].clear;
    const out = -(PARCEL.height + GRAB.clear);
    const still = {kind: grab.kind, out: true, done: false, x: scene.box.x, chain: GRAB.wound, open: 1, lifted: 0};
    if (at < parts.enter) return {...still, x: grab.from + (scene.box.x - grab.from) * ease(at / parts.enter)};
    at -= parts.enter;
    if (at < parts.lower + parts.hover + parts.grip + parts.lift) {
        const lowered = easeOut(clamp(at / parts.lower));
        const shut = clamp((at - parts.lower - parts.hover) / parts.grip);
        const lift = clamp((at - parts.lower - parts.hover - parts.grip) / parts.lift);
        const chain = lift > 0 ? liftedChain(reach, out, lift) : GRAB.wound + (reach - GRAB.wound) * lowered;
        return {...still, chain, open: 1 - shut, lifted: lift > 0 ? Math.max(reach - chain, 0) : 0};
    }
    at -= parts.lower + parts.hover + parts.grip + parts.lift;
    const k = clamp(at / parts.leave);
    return {...still, x: scene.box.x + (grab.away - scene.box.x) * k * k, chain: out + (GRAB.wound - out) * ease(k), open: 0, lifted: reach - out, out: k < 1, done: k >= 1};
}

function armAt(grab, at, scene) {
    const parts = partsOf(grab, scene, scene.box.top);
    const height = scene.box.top + PARCEL.height / 2;
    const tip = scene.box.x + PARCEL.width / 2 + ENDS.arm.clear;
    const still = {kind: "arm", out: true, done: false, y: height, tip: scene.right, open: 1, carried: 0};
    if (at < parts.lift) return {...still, y: grab.y + (height - grab.y) * ease(at / parts.lift)};
    at -= parts.lift;
    if (at < parts.shoot) return {...still, tip: scene.right + (tip - scene.right) * easeOut(at / parts.shoot)};
    at -= parts.shoot;
    if (at < parts.grip) return {...still, tip, open: 1 - at / parts.grip};
    at -= parts.grip;
    const k = clamp(at / parts.pull);
    const pulled = (scene.right + PARCEL.width + 2 * ENDS.arm.clear - tip) * k * k;
    return {...still, tip: tip + pulled, open: 0, carried: pulled, out: k < 1, done: k >= 1};
}

// The pause after a box is piled before the next is begun, in seconds: mostly short, now and then a longer wait of a couple of seconds
export const BOX_GAP = {short: [0.4, 1.6], long: [2, 4], longShare: 0.25};
export const boxGapSeconds = (random) => between(random() < BOX_GAP.longShare ? BOX_GAP.long : BOX_GAP.short, random);

// Where along the floor, from `left` to `right` in page pixels, the figure aims to begin the next box: anywhere at random, but never
// within `spread` of where it began the last, `last`, null for the first
export const BUILD_SPREAD = 2 * PARCEL.width;
export function buildAim(left, right, last, random) {
    const width = Math.max(right - left, 1);
    const aim = left + random() * width;
    return last === null || Math.abs(aim - last) >= BUILD_SPREAD ? aim : left + ((aim - left + width / 2) % width);
}

// A pile is taken away without a commit once every box on it is piled and no run has built for LEFT_PILE_SECONDS, counted from
// `runEndAt`, when the last run ended, in seconds; `running` says whether a run builds now
export const LEFT_PILE_SECONDS = 60;
export const isPileLeft = (parcels, running, runEndAt, now) =>
    parcels.length > 0 && parcels.every((each) => each.state === "piled") && !running && runEndAt !== null && now - runEndAt >= LEFT_PILE_SECONDS;
