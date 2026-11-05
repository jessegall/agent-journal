import {fallStep} from "../domain/falls.js";
import {stretchedFrame} from "./timeline.js";
import {hitSurface} from "./splatter.js";

// The journal moments and the searches the figure acts out with things the page draws beside it (chat/FigureAct.vue): for each act its
// length, unless it plays a clip of figure.js's own, and the shares of its clip over which each of its parts plays, read alike by the clip
// that moves the body (figure.js) and by the page that draws what it holds, so the hand and the thing in it never part.
export const ACTS = {
    // a celebration: it jumps for joy `jumps` times with its arms flung up, each jump a little lower than the last
    joy: {frames: 50, fps: 14, jumps: 5},
    // a worker sent off or another session messaged: a call on an old desk telephone (figure.js TELEPHONE). The telephone appears on the
    // floor before it, whole, in a poof of smoke over `poof`, `above` its units over the floor, drops onto it over `drop` and settles with
    // a jiggle over `settle`, squashing `squash` flat as it lands and wobbling `wobbles` times to still (figure.js phoneArrival), its handset
    // resting on the cradle a moment; it bends to the handset over `reach` and lifts it to its ear over `lift`; it bends to the dial and
    // puts a finger in it over `finger` and turns it `turn` degrees over `dial`; over `back` the finger withdraws first for `release` of
    // that phase, then the dial springs back once the finger is clear. It
    // talks over `talk`, nodding `nods` times; it bends to put the handset back on the cradle over `hang`, stands back from it a moment, and the telephone goes in a poof over `goes`
    // While it talks and until the handset is down it says whom it calls in a speech bubble beside its head (figure/places.js callSays)
    // Seated it follows the same phases. The set sits beside and behind the hip, turned inward toward the hands; the torso
    // leans toward it while the far hand dials, then returns upright. `beside` and `behind` place it in the figure's units, `turn` rotates
    // the dial toward its owner, `lean` is the dialling lean in degrees, and `backLean` tips the torso toward the set for pickup.
    // phonePlacement.js reserves the complete rotated base and receiver footprint on the seat.
    phone_call: {frames: 108, fps: 12, poof: [0, 0.06], above: 0.7, drop: [0.015, 0.055], settle: [0.055, 0.12], squash: 0.24, wobbles: 3, reach: [0.13, 0.2], lift: [0.2, 0.28], finger: [0.28, 0.33], dial: [0.33, 0.42], turn: 250, back: [0.42, 0.5], release: 0.25, talk: [0.5, 0.72], nods: 3, hang: [0.72, 0.84], goes: [0.92, 1], seated: {finger: [0.28, 0.33], dial: [0.33, 0.42], back: [0.42, 0.5], reach: [0.13, 0.2], lift: [0.2, 0.28], beside: 1.2, behind: 0.95, wide: 0.82, turn: 45, lean: 20, backLean: 8}},
    // a question asked: it raises a sign with a question mark on a stick over its head and waggles it
    ask_sign: {frames: 42, fps: 12, raise: [0, 0.22], waggle: [0.22, 0.78], waggles: 3, lower: [0.78, 1]},
    // a report: it brings the rolled scroll up before its chest over `raise`, a roller in each hand, the free hand's on top; pulls the
    // rollers apart over `unrolls`, the written side toward itself and the parchment's plain back to the viewer (figure.js SCROLL); reads
    // it `lines` lines down, its head going slowly along each; rolls it closed between its hands over `rolls` and lowers it over `lower`
    scroll: {frames: 96, fps: 12, raise: [0, 0.09], unrolls: [0.09, 0.22], rolls: [0.85, 0.93], lower: [0.93, 1], lines: 3},
    // a task finished, a job well done: standing, it brings its hands together before its chest over `together`, rubs them round each
    // other `rubs` times, slowly, a stroke and a half a second at most, nodding a little with each, and lowers them over `apart`; `puffs`
    // small puffs rise from the hands once each over `puff`, with `sparkles` sparkles among them (chat/act/HandRub.vue)
    hand_rub: {frames: 48, fps: 12, together: [0, 0.12], rubs: 2, apart: [0.88, 1], puff: [0.2, 0.9], puffs: 2, sparkles: 1},
    // stopping to think at the laptop (figure.js type_ponder), under the thought cloud, its dots pulsing three times a loop
    type_ponder: {frames: 24, fps: 6, pulse: 4 / 3},
    // The thinking act, now and then while the agent thinks (figure.js thinkingClip, reactions.js thinkingAct), in its three plays. With
    // the cloud: it raises its finger to its cheek over `into`, tilting its head up, swaying `sways` times; three puffs rise from its head
    // over `puffs` into a small thought cloud over it, held over `cloud`, its three dots pulsing one after another, `pulse` seconds round
    // (chat/FigureAct.vue), and over `rise` its hand comes away. With the bulb: over `rise` the finger comes up, "got it", the light bulb
    // over the head (figure.js LIGHT_BULB) appears over `appears`, switches on over `lights`, glows, goes out over `fades` and is gone over
    // `goes`. "ponder" has both, the bulb at its end; "think_cloud" the cloud alone, its hand going down; "got_it" the bulb alone.
    ponder: {frames: 84, fps: 12, into: [0, 0.1], puffs: [0.06, 0.24], cloud: [0.06, 0.72], pulse: 1.2, sways: 2, rise: [0.72, 0.8], appears: [0.75, 0.78], lights: [0.79, 0.82], fades: [0.9, 0.96], goes: [0.95, 1]},
    think_cloud: {frames: 66, fps: 12, into: [0, 0.12], puffs: [0.07, 0.29], cloud: [0.07, 0.86], pulse: 1.2, sways: 2, rise: [0.86, 1]},
    got_it: {frames: 30, fps: 12, rise: [0, 0.25], appears: [0.05, 0.15], lights: [0.18, 0.26], fades: [0.72, 0.88], goes: [0.86, 1]},
    // a fact or a reminder: a small cabinet grows beside it, its drawer slides out, it files a card in it and the drawer shuts
    file_card: {frames: 42, fps: 12, grows: [0, 0.15], opens: [0.12, 0.28], reach: [0.2, 0.44], filed: [0.44, 0.56], back: [0.56, 0.72], shuts: [0.58, 0.72], sinks: [0.86, 1]},
    // searching from the compose box: binoculars at its eyes, tipped `up` degrees up the chat and scanning slowly up and down it `scan`
    // degrees either way, twice, with a little turn left and right
    binoculars: {frames: 100, fps: 10, sweep: 1, up: 9, scan: 6},
    // searching, now and then: at the edge of the chat window the figure reaches past it into the space beyond, where nothing is seen, and
    // rummages there like a cartoon character hunting through a closet: it turns side-on to the edge and leans in, head and shoulders past
    // it, over `leans`, digging about `digs` times, and flings what it pulls out back over its shoulder, one thing at each of `throws`, each
    // from `from` (the figure's units, across, forward and up, before it turns side-on) on the arc its throw gives it (throwsFor), shrinking
    // away to nothing over `shrinks` once it lands; over `pops` it pulls back out, having found nothing
    rummage: {
        frames: 120, fps: 12, leans: [0.05, 0.14], digs: 7, pops: [0.8, 0.9], throws: [0.18, 0.28, 0.38, 0.48], from: [0, -1.5, 1.5], shrinks: 0.05,
    },
    // a bar it was eager for failed: crushed at first, then plainly mad about it, stamping and fuming, steam rising off its head
    fume: {frames: 54, fps: 12, crushed: [0, 0.36], mad: [0.36, 0.96], stamps: 6, steam: [0.42, 0.96]},
    // Each voice has its own angry performance, with a full recovery before ordinary activity resumes.
    tantrum: {frames: 108, fps: 18, hops: 6},
    // a rope swing tied under a bubble, drawn whole from the act's first frame: its two ropes `rope` of the figure's height long from the
    // middle of the bubble's bottom edge, `ties` of it apart, just outside the figure's arms, down to a seat `seat` of it wide, a little wider
    // than its body, whose top is `under` of it below the line the figure sits on, where its thighs' underside rests. Its frames are an
    // intro, the figure sitting down onto the seat as it starts to swing; a held stretch looped for `swings` pendulum cycles toward the
    // camera and away, `angle` degrees either side of the bottom, around the fixed knots, its legs pumping; and an outro, settling as the
    // figure rises off it. The ropes stay straight and keep their length, the seat rising at both ends of the arc. The knots stand at
    // least `room` of the figure's height in from the chat's sides, with `clearance` extra room kept around the hanging figure.
    rope_swing: {intro: 12, hold: 60, outro: 12, fps: 12, swings: 2, rope: 0.62, ties: 0.53, seat: 0.59, under: 0.025, angle: 20, clearance: 0.12, room: 0.85},
    // a pogo stick up onto a bubble's top: it reaches behind its back and pulls the stick out over `draw`, bounces `count` times on the spot
    // over `bounces`, each higher than the last up to `bounce` of its height, and springs up over `spring` to the top of its throw, `over`
    // of its height past the bubble's edge; there it lets the stick go over `release`, the stick falling away over `drop`, and it falls
    // onto the bubble on its own feet; every hop and the fall are timed by one gravity (pogoHop); the lower shaft keeps its existing
    // `stick`-based length, with the handles `handles` of the picture's height above the feet, shared by the stick and the hands
    pogo: {frames: 54, fps: 12, draw: [0, 0.18], bounces: [0.18, 0.62], count: 3, bounce: 0.45, spring: [0.62, 0.82], over: 0.3, release: [0.82, 0.86], drop: [0.82, 1], stick: 0.62, handles: 0.2455},
    // a fixed run's bugs: two to five of them crawl along the chat window's walls (WALL_BUGS); the figure first walks to its firing spot,
    // turns its whole body toward each wall (back toward the screen for a top-wall bug), and pulls a rifle from behind its back
    // over `draw` and shoulders it, then shoots them one by one, each in its own `turn` of the act played over again for every bug
    // (bugShotFrame): it swings its aim onto the bug over `aim`, shoots `count` bursts over `shots`, each kicking the rifle and the shoulder
    // back, and the bug splatters on its wall at `splat`; after the last, drops of its splatter fly out at the screen over `fly`, growing
    // as they come, land on it as on a camera's lens at their `lens` places (from the figure's middle, in shares of the picture, as big as
    // `size`), and run down and fade over `drops`, as the rifle is lowered; a bug steeper from the figure's eyes than `back.limit` degrees is
    // first backed away from along the floor, facing it, stepping `back.stride` of the picture at a time, to within it (backPlan), never
    // nearer an end of its floor than `back.margin` of the picture
    bug_shot: {
        frames: 80, fps: 12, draw: [0, 0.22], turn: [0.25, 0.55], aim: [0.25, 0.32], shots: [0.33, 0.48], count: 2, splat: 0.48, fly: [0.56, 0.64], drops: [0.64, 1],
        back: {limit: 55, margin: 0.25, stride: 0.5},
        lens: [{at: [-1.3, -1.6], size: 0.2}, {at: [0.9, -0.9], size: 0.14}, {at: [-0.4, 0.2], size: 0.16}, {at: [1.6, -2.1], size: 0.1}],
    },
    // a fixed run's bug smashed with a big wooden mallet on the floor the figure stands on (smashPlan): the bug climbs up the back of the
    // floor's box, out of sight behind it, over `emerge`, comes over its top edge onto it over `climb`, and it and the figure walk to meet
    // each other over `walk`, until it is `away` of the picture out on the figure's left (`side`); the figure raises the mallet high before
    // its head over `raise` and holds it there for the wind-up until `swing`, swings it down over `swing` and flattens the bug at `blow`,
    // which lies flat and fades over `gone`, and lowers the mallet over `lower`
    bug_smash: {
        frames: 96, fps: 12, side: 1, emerge: [0, 0.09], climb: [0.09, 0.16], walk: [0.16, 0.38], raise: [0.46, 0.58], swing: [0.66, 0.72], blow: 0.72, gone: [0.84, 0.95],
        lower: [0.88, 0.95], away: 0.42,
    },
    // a sin repented: a halo grows over the head over `grows` and fades over `fades`, the figure floating up `float` of its units and down
    // with its hands folded and a serene, holy look
    halo: {frames: 48, fps: 12, grows: [0, 0.15], fades: [0.85, 1], float: 0.01},
    // A confession: the hands come to the chest during the descent, the head bows after the shoulders, and the figure rises slowly.
    repent: {frames: 84, fps: 12, stand: [0, 0.12], kneel: [0.12, 0.34], out: [0.18, 0.4], up: [0.34, 0.48], hold: [0.48, 0.74], down: [0.74, 0.86], rise: [0.76, 1]},
    // a disco dance under a disco ball: the classic move, one arm pointing up and the other down, switching sides `beats` times, the hips
    // swaying and the knees bouncing, the visor flashing through the colours; the ball `ball` of the picture across, turning, hung `clear`
    // of it over the hat, on a string at least `tie` of it long from the bottom of a bubble no further than `far` of the figure's height
    // above the hat
    disco: {frames: 96, fps: 12, beats: 8, ball: 0.24, clear: 0.08, tie: 0.1, far: 2.2},
    // leaning against a wall to rest (perches.js leanSpot): the wall `wall` of the picture out from its middle, the hand flat against it
    // `contact` of the figure's units above its feet; the whole body tilted `tilt` degrees toward it from the feet, its weight on that hand;
    // the other hand on its hip at `hip` (across, forward, up); the ankles crossed, the inner leg turned in `inner` degrees and the outer
    // `outer`, swung `over` degrees before the inner so its foot crosses over in front
    lean: {wall: 0.33, contact: 1.95, tilt: 16, hip: [0.62, 0.05, 1.5], inner: 20, outer: 42, over: 12},
    // coming down on a parachute, swaying `sway` degrees under it, its canopy (figure.js canopyOf) `width` of the picture across with its
    // rim `above` of the picture over the eyes, the lines running from the rim down to the hands
    chute: {frames: 24, fps: 8, sway: 8, width: 0.66, above: 0.5},
    // compacting: a box appears, it hops into it and the box shrinks with it inside; once the compaction is over the box grows back and
    // pops in a puff, and it jumps out. Its frames are an intro, a held stretch looped while the compaction lasts, and an outro
    pack_box: {intro: 36, hold: 24, outro: 26, fps: 12, appears: [0, 0.3], hop: [0.3, 0.62], into: [0.55, 0.88], shrinks: [0.86, 1], grows: [0, 0.3], pops: 0.38, leap: [0.38, 0.88], small: 0.5},
    // compacting: a press comes down onto its head, it holds it up with both hands and is squashed under it, and springs back once it lifts
    press: {intro: 24, hold: 24, outro: 24, fps: 12, lowers: [0, 0.55], squashes: [0.5, 1], frees: [0, 0.3], springs: [0.25, 0.7], lifts: [0.3, 1], flat: 0.42},
    // compacting: it vacuums up the words flying in from beside it, the canister on the floor and the nozzle in its hand
    vacuum: {intro: 10, hold: 40, outro: 10, fps: 10, words: 5},
};

const span = (u, from, to) => Math.min(Math.max((u - from) / (to - from), 0), 1);
const ease = (k) => k * k * (3 - 2 * k);

// how far `u` is through the part `[from, to]` of an act, eased, 0 before it and 1 after
export const partOf = (u, [from, to]) => ease(span(u, from, to));

// the things the figure flings over its shoulder rummaging (rummage), in the order it pulls them out
export const RUMMAGED = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"];

// How each thing flung out rummaging flies, worked out afresh for each rummage (throwsFor): thrown from the opening at `speed` units a
// second, `angle` degrees above level back over the shoulder, drifting `spread` units a second to either side, spinning `spin` degrees a
// second either way, and falling at `gravity` units a second squared until it reaches the floor at `floor`, where it lies and shrinks away
export const THROW = {speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2};

const within = ([least, most], random) => least + random() * (most - least);

// The throws of one rummage, one for each thing of RUMMAGED, each {velocity, spin}: its velocity across, back and up in units a second,
// and its spin in degrees a second, drawn from THROW's ranges
export function throwsFor(random) {
    return RUMMAGED.map(() => {
        const speed = within(THROW.speed, random);
        const angle = (within(THROW.angle, random) * Math.PI) / 180;
        const spin = within(THROW.spin, random) * (random() < 0.5 ? -1 : 1);
        return {velocity: [within(THROW.spread, random), speed * Math.cos(angle), speed * Math.sin(angle)], spin};
    });
}

// the throws of a rummage the page drew none for: the middle of each range, the spins turning either way in turn
export const MIDDLE_THROWS = throwsFor(() => 0.5).map((thrown, index) => ({...thrown, spin: Math.abs(thrown.spin) * (index % 2 ? -1 : 1)}));

// the seconds a throw is in the air, from the opening at `from` up and down onto the floor
export function flightSeconds(thrown, from) {
    const up = thrown.velocity[2];
    return (up + Math.sqrt(up * up + 2 * THROW.gravity * (from[2] - THROW.floor))) / THROW.gravity;
}

// Where thing `index` of RUMMAGED is `u` of the way through the rummage, thrown as `throws` says, as {at, turn, landed}: in flight from
// the opening along the arc gravity gives it, `at` in the figure's units before it turns side-on, `turn` how far it has spun in degrees,
// and `landed` how far it has shrunk away lying on the floor, 0 to 1; null before it is pulled out and once it is gone
export function flungAt(index, u, throws = MIDDLE_THROWS) {
    const act = ACTS.rummage;
    const seconds = ((u - act.throws[index]) * act.frames) / act.fps;
    const thrown = throws[index];
    const flight = flightSeconds(thrown, act.from);
    const lies = (act.shrinks * act.frames) / act.fps;
    if (seconds < 0 || seconds >= flight + lies) return null;
    const time = Math.min(seconds, flight);
    const at = act.from.map((from, axis) => from + thrown.velocity[axis] * time);
    at[2] -= (THROW.gravity * time * time) / 2;
    return {at, turn: thrown.spin * time, landed: Math.max(0, seconds - flight) / lies};
}

// The act whose things are drawn over the figure's picture (chat/FigureAct.vue) while the figure is drawn playing `clip` at `frame`, the
// clip the picture is drawn in, never one waiting to play meanwhile, as while it turns at a seat drawn idle: its name and how far through
// it it is, 0 to 1; none for a clip that is no act
export const actDrawn = (clip, frame) => (clip && ACTS[clip.name] ? {name: clip.name, u: frame / clip.frames} : null);

// Where a run of hops on the pogo stick is `share` of the way through its time, as {index, s, height}: hop `index` of `heights`, `s` of
// the way through it, and how high above its foot it is then. One gravity times them all: a hop lasts as the square root of its height,
// so a higher one takes longer, and its height goes as 4s(1 - s), rising fast off the ground, slowing to the top and falling faster
export function pogoHop(heights, share) {
    const lengths = heights.map((height) => Math.sqrt(height));
    const whole = lengths.reduce((sum, each) => sum + each, 0);
    let left = Math.min(Math.max(share, 0), 1) * whole;
    for (const [index, length] of lengths.entries()) {
        if (left <= length || index === lengths.length - 1) {
            const s = length > 0 ? Math.min(left / length, 1) : 1;
            return {index, s, height: heights[index] * 4 * s * (1 - s)};
        }
        left -= length;
    }
    return {index: 0, s: 1, height: 0};
}

// the pogo stick's bounces on the spot, in the figure's heights, each higher than the last
export const pogoBounces = () => Array.from({length: ACTS.pogo.count}, (_, hop) => (ACTS.pogo.bounce * (hop + 1)) / ACTS.pogo.count);

// The meeting of the mallet act on the floor the figure stands on, in shares of the figure's picture: the bug comes up behind the floor's
// box `reach` further out than the blow lands, never nearer an end of the floor than `margin`, starting `tall` below its top edge, out of
// sight; the figure walks in steps `stride` long; and the bug keeps to its floor while the floor moves no more than `carried` pixels in a
// frame, as the figure does (floors.js CARRIED_WITHIN)
export const SMASH = {reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5};

// The mallet act of a figure with its middle at `x` on the floor `floor` (its left, right and top on the page), its picture `size` pixels
// across: where the figure and the bug start and end, each [from, to] in pixels from the floor's left, so a floor that moves carries them;
// both walk to meet halfway, the bug ending `away` of the picture out on the figure's left, where the blow lands, and a figure with too
// little room for that walks back to it on its own
export function smashPlan(x, floor, size) {
    const {away, side} = ACTS.bug_smash;
    const out = side * away * size;
    const [low, high] = [floor.left + SMASH.margin * size, floor.right - SMASH.margin * size];
    const from = Math.min(Math.max(x + out + side * SMASH.reach * size, low), high);
    const gap = from - out - x;
    const to = from - (side * gap > 0 ? gap / 2 : 0);
    return {figure: [x - floor.left, to - out - floor.left], bug: [from - floor.left, to - floor.left]};
}

// The mallet act by the plan `plan` (smashPlan) `u` of the way through, the figure's picture `size` pixels across: the figure's middle in
// pixels from the floor's left, the steps it has walked and the way it walks (1 the viewer's right); and the bug: in pixels from the floor's
// left, how far below the floor's top edge it is, behind the box, the degrees it is turned from walking, 90 head up as it climbs, whether
// it is still whole, how flat the blow has left it, 0 whole to 1 flat, and how much of it still shows as it fades
export function smashAt(plan, u, size) {
    const act = ACTS.bug_smash;
    const walked = partOf(u, act.walk);
    const along = ([from, to]) => from + (to - from) * walked;
    return {
        figure: along(plan.figure),
        steps: Math.abs(along(plan.figure) - plan.figure[0]) / (SMASH.stride * size),
        way: Math.sign(plan.figure[1] - plan.figure[0]),
        bug: {
            dx: along(plan.bug),
            below: SMASH.tall * size * (1 - partOf(u, act.emerge)),
            turn: 90 * (1 - partOf(u, act.climb)),
            whole: u < act.blow,
            flat: u >= act.blow ? 1 : 0,
            shows: 1 - partOf(u, act.gone),
        },
    };
}

// One frame of the mallet act's bug, `bug` ({x, y, speed, falling}), `on` where the act puts it on its floor now ({x, y}), or null once the
// floor is gone or no longer reaches under it: on its floor while that holds it, carried with it, up too; once it went, or dropped further
// in a frame than SMASH carried, as a bar docked over the compose box closes, it falls at GRAVITY from where it was onto `ground`, the top of what is
// under it, and stays there
export function bugStep(bug, on, ground, seconds) {
    if (!bug.falling && on && (bug.y === undefined || on.y - bug.y <= SMASH.carried)) return {x: on.x, y: on.y, speed: 0, falling: false};
    const fell = fallStep({y: bug.y, speed: bug.speed}, ground, seconds);
    return {x: bug.x, y: fell.y, speed: fell.speed, falling: true};
}

// The bugs of a bug shot on the chat window's walls: at least `least` and at most `most` of them, each on the left, the right or the top wall,
// `inset` pixels in from it, crawling along it `speed` pixels a second, turning back `margin` of the wall's length from its ends
export const WALL_BUGS = {least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1};

// the bugs of a bug shot drawn with `random`, each {wall, along, way}: its wall, where along it it starts, 0 to 1, and the way it crawls
export function wallBugs(random) {
    const count = WALL_BUGS.least + Math.floor(random() * (WALL_BUGS.most - WALL_BUGS.least + 1));
    return Array.from({length: count}, () => ({
        wall: WALL_BUGS.walls[Math.floor(random() * WALL_BUGS.walls.length)],
        along: WALL_BUGS.margin + random() * (1 - 2 * WALL_BUGS.margin),
        way: random() < 0.5 ? -1 : 1,
    }));
}

// Where the wall bug `bug` is `seconds` after it came, in the chat window `world` (its left, top, right and bottom on the page): the page
// point it stands at on its wall, crawling back and forth along it, and the way its back faces, in degrees, 0 its feet down
export function wallBugAt(bug, world, seconds) {
    const tall = bug.wall === "top" ? world.right - world.left : world.bottom - world.top;
    const span = 1 - 2 * WALL_BUGS.margin;
    const run = (bug.along - WALL_BUGS.margin + (bug.way * WALL_BUGS.speed * seconds) / tall) / span;
    const phase = ((run % 2) + 2) % 2;
    const along = WALL_BUGS.margin + span * (phase <= 1 ? phase : 2 - phase);
    if (bug.wall === "top") return {x: world.left + along * tall, y: world.top + WALL_BUGS.inset, turn: 180};
    const x = bug.wall === "left" ? world.left + WALL_BUGS.inset : world.right - WALL_BUGS.inset;
    return {x, y: world.top + along * tall, turn: bug.wall === "left" ? 90 : -90};
}

// The bug shot `raw` frames in when it shoots `count` bugs: the frame of its clip, its turn played over once for each bug (timeline.js
// stretchedFrame, `stretch`); the bug it aims at, by its turn; and how many it has shot, a bug splattering at its turn's `splat`
export function bugShotFrame(raw, count) {
    const act = ACTS.bug_shot;
    const [from, to] = act.turn.map((share) => share * act.frames);
    const stretch = {from, to, extra: (count - 1) * (to - from)};
    const frame = stretchedFrame(raw, stretch);
    const turn = raw < from ? 0 : Math.min(Math.floor((raw - from) / (to - from)), count - 1);
    const done = raw >= from + count * (to - from);
    const shot = done ? count : turn + (frame / act.frames >= act.splat ? 1 : 0);
    return {frame, stretch, bug: turn, shot};
}

// The bug shot `raw` frames in, its bugs `bugs` (wallBugs) in the chat window `world`: each bug where it is on its wall (wallBugAt), still
// where it was shot once it is, and whether it is; the frame of the clip (bugShotFrame); and the page point the rifle aims at, swung from
// the bug before onto the bug of this turn over the turn's `aim`; the slush each shot bug burst into and the splashes it has left
// (slushAt), and the shot bugs whose slush is flying at the camera, each with the seconds since its shot and where it burst (cameraDrops).
// Live `surfaces` are the chat's visible boxes; `bursts`, kept for this run, checks their current faces during flight and keeps each
// actual landing on the same box as the chat scrolls.
export function bugShotScene(bugs, world, raw, {surfaces = [], bursts = null} = {}) {
    const act = ACTS.bug_shot;
    const {frame, bug, shot} = bugShotFrame(raw, bugs.length);
    const placed = bugs.map((each, index) => ({...wallBugAt(each, world, Math.min(raw / act.fps, bugShotTimes(index).shot)), shot: index < shot}));
    const swing = partOf(frame / act.frames, act.aim);
    const [from, to] = [placed[Math.max(bug - 1, 0)], placed[bug]];
    const shots = bugs.map((each, index) => ({bug: each, index, seconds: raw / act.fps - bugShotTimes(index).shot, spot: wallBugAt(each, world, bugShotTimes(index).shot)})).filter((each) => each.seconds >= 0);
    const slush = shots.flatMap((each) => {
        const particles = bursts?.get(each.index) ?? slushOf(each.bug, world, each.spot, bursts ? [] : surfaces);
        bursts?.set(each.index, particles);
        if (bursts) landSlush(particles, each.seconds, surfaces);
        return slushAt(particles, each.seconds, surfaces);
    });
    const camera = shots.filter((each) => sprayesCamera(each.bug)).map((each) => ({seconds: each.seconds, from: each.spot}));
    const back = Number(bugs[Math.max(bug - 1, 0)].wall === "top") * (1 - swing) + Number(bugs[bug].wall === "top") * swing;
    return {bugs: placed, frame, target: {x: from.x + (to.x - from.x) * swing, y: from.y + (to.y - from.y) * swing, back}, slush, camera};
}

// When the turn of bug number `index` of the bug shot has its beats, in the shot's raw frames, but the second its bug is shot: the frame
// the figure may begin to back away for it (the draw's end for the first bug, the splat of the bug before for the rest), the frame its
// aim is on it, and the second its splat comes
export function bugShotTimes(index) {
    const act = ACTS.bug_shot;
    const [from, to] = act.turn.map((share) => share * act.frames);
    const turn = from + index * (to - from);
    return {walk: index ? turn - (to - from) + (act.splat * act.frames - from) : act.draw[1] * act.frames, aim: turn + (act.aim[1] * act.frames - from), shot: (turn + (act.splat * act.frames - from)) / act.fps};
}

// The backing away of a figure with its middle at `at.x` and its eyes at `at.y`, on a floor from `at.left` to `at.right` (all on the page),
// its picture `size` pixels across, before each of its bugs `bugs` (wallBugs) in the chat window `world`: one leg for each, {from, to, begin,
// end} in pixels and in the shot's raw frames. A bug steeper from the eyes than ACTS.bug_shot.back.limit is backed away from, along the
// floor, until it is within it, the figure walking over the frames between bugShotTimes' walk and aim; one at an easy angle, or one a
// bug before already backed far enough from, none, and the figure never walks toward a bug, nor nearer an end of its floor than the margin
export function backPlan(bugs, world, at, size) {
    const {limit, margin} = ACTS.bug_shot.back;
    const [low, high] = [at.left + margin * size, at.right - margin * size];
    let x = at.x;
    return bugs.map((bug, index) => {
        const times = bugShotTimes(index);
        const spot = wallBugAt(bug, world, times.shot);
        const needed = Math.abs(spot.y - at.y) / Math.tan((limit * Math.PI) / 180);
        const away = spot.x === x ? (x - low >= high - x ? -1 : 1) : Math.sign(x - spot.x);
        const wanted = Math.abs(spot.x - x) >= needed ? x : spot.x + away * needed;
        const to = away > 0 ? Math.max(x, Math.min(wanted, high)) : Math.min(x, Math.max(wanted, low));
        const leg = {from: x, to, begin: times.walk, end: times.aim};
        x = to;
        return leg;
    });
}

// Where the figure is `raw` frames into the bug shot by its backing away `plan` (backPlan), its picture `size` pixels across: its middle
// on the page, the steps of its stride walked so far, and the way it is walking this frame (1 the viewer's right, 0 standing)
export function backAt(plan, raw, size) {
    const stride = ACTS.bug_shot.back.stride * size;
    let walked = 0;
    for (const leg of plan) {
        if (raw <= leg.begin) return {x: leg.from, steps: walked / stride, way: 0};
        if (raw < leg.end) {
            const x = leg.from + (leg.to - leg.from) * partOf(raw, [leg.begin, leg.end]);
            return {x, steps: (walked + Math.abs(x - leg.from)) / stride, way: Math.sign(leg.to - leg.from)};
        }
        walked += Math.abs(leg.to - leg.from);
    }
    return {x: plan.at(-1)?.to ?? 0, steps: walked / stride, way: 0};
}

// A shot bug leaves nothing at its place: it bursts into slush, SLUSH.count particles thrown out from where it was hit, away from its wall
// within SLUSH.spread degrees of straight out, at SLUSH.speed pixels a second, then falling under SLUSH.gravity; each flies until it meets
// a chat box, the floor or an edge of the chat window and leaves a small splash there, which holds SLUSH.hold seconds and fades over
// SLUSH.fade. On a box or a side wall it runs down while it fades. Now and then (sprayesCamera) it flies at the screen too (cameraDrops).
export const SLUSH = {count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60, longest: 5};

const INWARD = {left: [1, 0], right: [-1, 0], top: [0, 1]};

// a small repeatable stream of numbers from 0 to 1 from `seed`, so a bug bursts the same way each time it is drawn
function seeded(seed) {
    let state = (Math.floor(Math.abs(seed) * 1e6) % 2147483646) + 1;
    return () => (state = (state * 48271) % 2147483647) / 2147483647;
}

// whether the slush of `bug` flies at the camera as well as about the walls: a share SLUSH.camera of bugs, decided by where the bug crawls
export const sprayesCamera = (bug) => (bug.along * 97) % 1 < SLUSH.camera;

const flownTo = (p, t) => ({x: p.from.x + p.vx * t, y: p.from.y + p.vy * t + 0.5 * SLUSH.gravity * t * t});

// Where a drop first meets a chat box or the window. The walls' times are exact; the short curved segments between them are swept
// across the boxes, so a fast drop cannot pass through a thin card between two frames.
function landing(p, world, surfaces) {
    const floorTime = (-p.vy + Math.sqrt(p.vy * p.vy + 2 * SLUSH.gravity * (world.bottom - p.from.y))) / SLUSH.gravity;
    const edges = [{t: floorTime, on: "floor"}];
    if (p.vx < 0) edges.push({t: (world.left - p.from.x) / p.vx, on: "left"});
    if (p.vx > 0) edges.push({t: (world.right - p.from.x) / p.vx, on: "right"});
    const high = p.vy * p.vy + 2 * SLUSH.gravity * (world.top - p.from.y);
    if (p.vy < 0 && high >= 0) edges.push({t: (-p.vy - Math.sqrt(high)) / SLUSH.gravity, on: "top"});
    const edge = edges.filter((each) => each.t >= 0).sort((a, b) => a.t - b.t)[0];
    let before = p.from;
    for (let start = 0; start < edge.t; start += SLUSH.step) {
        const end = Math.min(start + SLUSH.step, edge.t);
        const after = flownTo(p, end);
        const hit = hitSurface(before, after, surfaces);
        if (hit) return {...hit, t: start + (end - start) * hit.share};
        before = after;
    }
    const point = flownTo(p, edge.t);
    return {...edge, x: Math.min(Math.max(point.x, world.left), world.right), y: Math.min(Math.max(point.y, world.top), world.bottom)};
}

// The slush of the wall bug `bug` (wallBugs) shot at `from` ({x, y}) in the chat window `world`: each particle {x, y, vx, vy, r} thrown out
// from there (kept separately as `from`, never overwritten by the landing), with where it lands, {t, x, y, on}
export function slushOf(bug, world, from, surfaces = []) {
    const random = seeded(bug.along + 1);
    const [nx, ny] = INWARD[bug.wall];
    const straight = Math.atan2(ny, nx);
    return Array.from({length: SLUSH.count}, () => {
        const angle = straight + (random() - 0.5) * 2 * ((SLUSH.spread * Math.PI) / 180);
        const speed = SLUSH.speed[0] + random() * (SLUSH.speed[1] - SLUSH.speed[0]);
        const particle = {from: {x: from.x, y: from.y}, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: SLUSH.radius[0] + random() * (SLUSH.radius[1] - SLUSH.radius[0])};
        return {...particle, ...landing(particle, world, surfaces)};
    });
}

// In a live burst only freeze contacts that have happened. A bubble may scroll out of a drop's way, or into it, while it flies; sweeping
// just the flight since the last draw against the current faces avoids snapping it to a landing planned before the box moved.
function landSlush(particles, seconds, surfaces) {
    for (const p of particles) {
        if (p.settled) continue;
        const until = Math.min(seconds, p.t);
        for (let start = p.checked ?? 0; start < until; start += SLUSH.step) {
            const end = Math.min(start + SLUSH.step, until);
            const hit = hitSurface(flownTo(p, start), flownTo(p, end), surfaces);
            if (!hit) continue;
            Object.assign(p, hit, {t: start + (end - start) * hit.share});
            break;
        }
        p.checked = seconds;
        p.settled = seconds >= p.t;
    }
}

// The particles `seconds` after the shot (slushOf): each still flying as {x, y, r, flying: true}, or, once it has landed, its splash as
// {x, y, r, flying: false, on, opacity}: it grows over its first tenth of a second, holds, then fades away. A stain on a box follows that
// same element, clipped to its visible face, and runs down it; one whose box has left the page is no longer drawn.
export function slushAt(particles, seconds, surfaces = []) {
    if (seconds < 0) return [];
    return particles.flatMap((p) => {
        if (seconds < p.t) return [{...flownTo(p, seconds), r: p.r, flying: true}];
        const age = seconds - p.t;
        const opacity = 1 - Math.min(Math.max((age - SLUSH.hold) / SLUSH.fade, 0), 1);
        if (opacity <= 0) return [];
        const surface = p.on === "surface" ? surfaces.find((each) => each.id === p.surface) : null;
        if (p.on === "surface" && !surface) return [];
        const x = surface ? surface.left + p.dx : p.x;
        const y = surface ? surface.top + p.dy : p.y;
        const run = surface ? Math.min(age * age * 12, 48, Math.max(0, surface.bottom - y)) : ["left", "right"].includes(p.on) ? Math.min(age * age * 8, 32) : 0;
        return [{x, y, r: p.r * (1 + 1.2 * Math.min(age / 0.1, 1)), flying: false, on: p.on, opacity, run, ...(surface ? {clip: surface.clip ?? surface} : {})}];
    });
}

// The drops of slush that fly at the screen `seconds` after the bug was shot, in a picture `size` pixels across, the bug at `from` (x, y)
// and the picture's middle at `middle`: each flying out at the screen from the bug over the shot's `fly`, growing from a speck to its size as
// it comes, then on the glass at its lens place, running down and fading over its `drops`; none before the shot
export function cameraDrops(seconds, size, from, middle) {
    const {fly, drops, lens, frames, fps} = ACTS.bug_shot;
    if (seconds < 0) return [];
    const flying = ((fly[1] - fly[0]) * frames) / fps;
    const dripping = ((drops[1] - drops[0]) * frames) / fps;
    const flown = partOf(seconds, [0, flying]);
    const dripped = partOf(seconds, [flying, flying + dripping]);
    return lens.map((drop) => {
        const landed = {x: middle.x + drop.at[0] * size, y: middle.y + drop.at[1] * size};
        return {
            x: from.x + (landed.x - from.x) * flown,
            y: from.y + (landed.y - from.y) * flown,
            r: drop.size * size * (0.15 + 0.85 * flown * flown),
            run: dripped * dripped * size * 1.2,
            fade: 1 - dripped,
            landed: flown >= 1,
        };
    });
}

// The same drops by how far through the bug shot it is, `u` of its frames, none before they fly
export function splatDrops(u, size, from, middle) {
    const {fly, frames, fps} = ACTS.bug_shot;
    return u < fly[0] ? [] : cameraDrops(((u - fly[0]) * frames) / fps, size, from, middle);
}

// The parachute over the figure `u` of the way through its sway, in the picture's pixels: the canopy's picture `canopy` (figure.js
// Stage.drawCanopy, its rim's middle `at` and its lines' ends `ends`, the left pair first) placed with its rim's middle ACTS.chute above of
// the picture `size` over the eyes at `head`, turned `turn` degrees about that middle as it sways; and its lines, each from where it leaves
// the rim, turned with it, down to the hand on its side, `hands` the two hands' grips in either order
export function chuteOver(canopy, head, hands, size, u) {
    const {sway, above} = ACTS.chute;
    const middle = {x: head.x, y: head.y - above * size};
    const turn = (sway / 2) * Math.sin(2 * Math.PI * u);
    const [cos, sin] = [Math.cos((turn * Math.PI) / 180), Math.sin((turn * Math.PI) / 180)];
    const turned = (end) => {
        const [dx, dy] = [end.x - canopy.at.x, end.y - canopy.at.y];
        return {x: middle.x + dx * cos - dy * sin, y: middle.y + dx * sin + dy * cos};
    };
    const [left, right] = [...hands].sort((one, other) => one.x - other.x);
    const ends = canopy.ends.map(turned);
    return {left: middle.x - canopy.at.x, top: middle.y - canopy.at.y, middle, turn, lines: ends.map((from, index) => ({from, to: index < ends.length / 2 ? left : right}))};
}

// how far a thing that grows out of the floor at the start of an act and sinks at its end stands up at `u`, 0 to 1
export const standingAt = (act, u) => partOf(u, act.grows) * (1 - partOf(u, act.sinks));

// where an act whose frames are an intro, a held stretch and an outro is at `u` of its frames: how far through the intro, the share of the
// held stretch, null outside it, and how far through the outro
export function heldPhases(act, u) {
    const frame = u * (act.intro + act.hold + act.outro);
    const held = frame >= act.intro && frame < act.intro + act.hold;
    return {into: span(frame, 0, act.intro), held: held ? (frame - act.intro) / act.hold : null, out: span(frame, act.intro + act.hold, act.intro + act.hold + act.outro)};
}

// how the picture is squeezed at `u` of the act, as {x, y} scales from the feet, or null: shrunk with the box it is packed in, or
// squashed flat under the press and springing back
export function squeezeOf(name, u) {
    const act = ACTS[name];
    if (name === "pack_box") {
        const {into, held, out} = heldPhases(act, u);
        const size = 1 - (1 - act.small) * partOf(into, act.shrinks) * (1 - partOf(out, act.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (held ?? 0));
        return {x: size, y: size};
    }
    if (name === "press") {
        const {into, out} = heldPhases(act, u);
        const flat = act.flat * partOf(into, act.squashes) * (1 - partOf(out, act.frees));
        const spring = 0.14 * Math.sin(2 * Math.PI * span(out, ...act.springs)) * (1 - span(out, ...act.springs));
        return {x: 1 + 0.5 * flat - spring / 2, y: 1 - flat + spring};
    }
    return null;
}

// whether the picture is hidden below the floor through the act, as the figure in the box sinks past it
export const hidesBelowFloor = (name) => name === "pack_box";

// how far above the rope swing's seat the figure is at `u` of its frames, 0 sat on it to 1: sitting down onto it through the intro, rising off
// it through the outro
export function offSwing(u) {
    const {into, out} = heldPhases(ACTS.rope_swing, u);
    return 1 - partOf(into, [0, 1]) * (1 - partOf(out, [0, 1]));
}

// The rope swing's angle as a share of its full arc at `u`, -1 away from the camera to 1 toward it. Its held loop is the small-angle
// pendulum's sine: fastest at the bottom and still at each end. The same phase runs through the intro and outro with an eased envelope,
// so sitting down and rising off never start or stop the swing's velocity in one frame, and held loops join at the same speed.
export function swingAt(u) {
    const act = ACTS.rope_swing;
    const {into, out} = heldPhases(act, u);
    const phase = (u * (act.intro + act.hold + act.outro) - act.intro) / act.hold;
    return partOf(into, [0, 1]) * (1 - partOf(out, [0, 1])) * Math.sin(2 * Math.PI * act.swings * phase);
}

