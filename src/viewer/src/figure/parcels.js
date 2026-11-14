import {PILE as ANIMATIONS, draw} from "./pile.js";
import {VISOR} from "./visor.js";
import {ChatMark} from "../domain/chatMark.js";

// The parcels of code the figure builds on the compose box's top, drawn by the page beside the figure (chat/CodeParcel.vue). Every number
// that decides where they go and when is here, in pixels and milliseconds on the page.

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

// every type of light a unit shows, each drawn once (chat/VoiceFigure.vue)
export const LIGHT_TYPES = Object.keys(LIGHT_COLOURS);

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
export const IDLE_CLIPS = new Set(ANIMATIONS.filter((entry) => IDLE_MOMENTS.has(entry.when.moment) && entry.type === "clip").map((entry) => entry.name));

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
