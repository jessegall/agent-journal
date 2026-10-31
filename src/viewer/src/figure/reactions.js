import {HELD, WORKING, eggFor} from "../domain/figureState.js";
import {CALL_COOLDOWN, LIFETIME, alive, draw, hasMoment} from "./pile.js";
import {lookAngles, lookWay, upFor} from "./look.js";

// What the figure does about what happens around it, and when. Which animation plays is drawn from the one pile (pile.js); here are the
// moments it is drawn for, and how what is drawn is played, so the figure is a creature that notices things now and then, not a status icon.

// the carrier that comes this time to take the work away (pile.js carrier), the UFO or the claw crane, and the side the crane rolls in from
export const carrierOf = (random) => draw({moment: "carrier"}, random).name;
export const craneFrom = (random) => draw({moment: "crane_from"}, random).name;

// the clip a held clip is played as for this stretch of it (pile.js held:), itself when it is played one way only, and idle when it has
// ways to be played but none may play now, as when every search waits its cooldown; `scene` says what the variants' conditions read:
// `memory` when each variant waiting a cooldown last played, at `now`, and `home` whether the figure stands on the compose box
export function variantOf(clip, random, has, scene = {}) {
    const drawn = draw({moment: `held:${clip}`, has, ...scene}, random);
    if (drawn) return drawn.name;
    return hasMoment(`held:${clip}`) ? "idle" : clip;
}

// The figure reading along a message's bubble: for `seconds`, line by line down at most `lines` of them `line` pixels apart, its look
// sweeping each from `inset` pixels in from the bubble's left to as far in from its right over `sweep` seconds, and back to the next
export const READING = {seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90};

// The way a figure standing with the middle of its picture at page `x` faces to read the bubble `box`: its whole body turned READING turn
// degrees toward the screen behind it, 1 to its right and -1 to its left, so its head then only follows the lines; facing the screen
// squarely for a bubble less than READING ahead of the picture's `size` to either side
export function readingFacing(box, x, size) {
    const off = (box.left + box.right) / 2 - x;
    return Math.abs(off) < READING.ahead * size ? 180 : Math.sign(off) * READING.turn;
}

// A line has a slow scan and a shorter eased return onto the next line; neither the target nor its speed jumps at the ends.
const readingEase = (value) => {
    const k = Math.min(Math.max(value, 0), 1);
    return k * k * k * (10 + k * (-15 + 6 * k));
};

// Where the figure reads at `t` seconds, with the middle of the line retained to choose one consistent shoulder for a line behind it.
export function readingAt(box, t) {
    const insetX = Math.min(READING.inset, Math.max(box.right - box.left, 0) / 2);
    const insetY = Math.min(READING.inset, Math.max(box.bottom - box.top, 0) / 2);
    const lines = Math.max(1, Math.min(READING.lines, Math.floor((box.bottom - box.top - 2 * insetY) / READING.line) + 1));
    const elapsed = Math.max(t, 0);
    const line = Math.floor(elapsed / READING.sweep) % lines;
    const phase = elapsed % READING.sweep;
    const scan = READING.sweep - READING.returnSeconds;
    const back = readingEase((phase - scan) / READING.returnSeconds);
    const across = phase <= scan ? readingEase(phase / scan) : 1 - back;
    const down = line + (((line + 1) % lines) - line) * back;
    return {x: box.left + insetX + Math.max(box.right - box.left - 2 * insetX, 0) * across, y: box.top + insetY + down * READING.line, readingCenter: (box.left + box.right) / 2, mood: "reading", behind: true};
}

// how long the eyes keep a look, counted only while they are shown
export const LOOK_SECONDS = 3;

// whether a figure turned `facing` degrees shows its eyes: it faces no further than sideways from the viewer
export const eyesShown = (facing) => Math.abs(((((facing + 180) % 360) + 360) % 360) - 180) <= 90;

// how many times a second the eyes are drawn while they wear a look
export const LOOK_FPS = 12;

// a look the eyes take on at `now` seconds, not yet seen
export const lookOf = (mood, now) => ({mood, began: now, seen: 0});

// The look on the eyes of a figure turned `facing` degrees at `now` seconds: the look as it stands after this moment, null once it has
// been seen its time, and the eyes to draw with it, stepped as they are drawn, or none. Its clock runs only while the eyes are shown, so
// a look that comes while the figure faces away waits for it to turn round.
export function eyesAt(looking, facing, now) {
    if (!looking) return {looking: null, eyes: null};
    if (!eyesShown(facing)) return {looking: {...looking, began: now - looking.seen}, eyes: null};
    const seen = now - looking.began;
    if (seen >= LOOK_SECONDS) return {looking: null, eyes: null};
    return {looking: {...looking, seen}, eyes: {mood: looking.mood, seconds: Math.floor(seen * LOOK_FPS) / LOOK_FPS, lasts: LOOK_SECONDS}};
}

// whether a look makes the figure let go of where it is: it hangs there with its back to the viewer, so it lets go to turn round
export const letsGoFor = (place) => place.posture === "hang" && !eyesShown(place.face);

// The states in which the figure has nothing to do, and so plays its pastimes: idle, or waiting, on a run, a worker or the user alike
export const FREE = new Set(["idle", "waiting", "asking"]);

// the states of a run going on, a test run, a build or another command, which a long one makes a wait
const RUNS = new Set(["testing", "building", "running"]);

// The seconds the figure may be off its spot in `state` at `now`, for a shenanigan (pile.js SHENANIGANS): any while it has nothing to do;
// while a run goes whose docked bar, `progress` (places.js progressOf), says how much of it is done, the seconds it has left before the
// figure is due back for its anticipation (EAGER lead); none while its agent works, nor for a run whose bar has yet to show its pace
export function roomFor(state, progress, now) {
    if (FREE.has(state)) return Infinity;
    if (!RUNS.has(state) || !progress?.share || progress.ended) return 0;
    return Math.max(secondsLeft(now - progress.began, progress.share) - EAGER.lead, 0);
}

// the agent has worked for at least this many seconds when it settles, for "work_done" to be a moment
export const LONG_WALK_SECONDS = 5;

export function walkingMoment(trip, began, now) {
    if (!trip?.moves || trip.hopping) return {began: 0, moment: null};
    const since = began || now;
    return {began: since, moment: now - since >= LONG_WALK_SECONDS ? {beat: "long_walk", time: now} : null};
}

export const WORKED_SECONDS = 30;

// Now and then an edit, a read or a search, the work of `kept`, sets the figure typing at its laptop, reading its book or searching for a
// spell of a random number of seconds between the two in `seconds`, kept while its agent works on, so the act is seen though the tool lasts
// a moment; drawn from the pile (pile.js spell), and not drawn again within `every` seconds of the last draw, won or not
export const SPELL = {seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"]};

// The spell after this look at `now`, the agent's state being `state`: the spell in hand while it lasts, else one drawn for an edit or a
// read, {state, began, until, next}, `next` being when the next may be drawn
export function spellFor(state, spell, now, random, tally = null) {
    if (spell && now < spell.until) return spell;
    if (!SPELL.kept.includes(state) || now < (spell?.next ?? 0)) return spell;
    const drawn = draw({moment: "spell", state, tally}, random);
    const [least, most] = SPELL.seconds;
    return drawn ? {state: drawn.name, began: now, until: now + least + random() * (most - least), next: now + SPELL.every} : {state, began: 0, until: 0, next: now + SPELL.every};
}

// The held state as the figure plays it (figureState.js figureStateOf), the spell's while it lasts and its agent works
export const spellIn = (held, spell, now) => (spell && now < spell.until && WORKING.has(held.state) ? {state: spell.state, since: spell.began} : held);

// Once a docked bar's run looks about `lead` seconds from its end at the pace it has gone, now and then, as the pile draws it (pile.js
// eager), once a bar, the figure gets eager for it to end: it hurries onto the bar, taps its feet fast, then points down at it, bouncing,
// until it ends, and is never called off before. It starts only while the run looks at least `least` seconds from its end, the time its
// foot-tapping intro takes (figure.js EAGERNESS, 18 frames at 12 a second), so it is never begun too late to show before the end. Only a
// long run counts, one at least `after` seconds old by then, a minute, so a shorter run never does. A run that has gone on `long` seconds
// is anticipated every time, and `urgent`ly: the figure drops whatever it waits to do for it, once the act it plays has played out.
export const EAGER = {lead: 10, grace: 5, least: 1.5, after: 60, long: 120};
// The anticipation starts once the run's projected end, at the pace it has gone, is within `lead` seconds, and calms down again when the
// projection moves back past `lead` plus `grace` seconds, taking it up once more if the end comes within `lead` again.

// the seconds a run `elapsed` seconds old with `share` of it done has left, at the pace it has gone
export const secondsLeft = (elapsed, share) => (share > 0 ? (elapsed / share) * (1 - share) : Infinity);

// The figure's eagerness at `now` seconds for the bar docked over the compose box, `progress` (places.js progressOf), or null with none:
// the run it rolled for, known by when its card began so a bar drawn again is the same run, and whether it is eager for it; and the moment
// the bar's end is once it ends while the figure is eager, a pass or a failure, once for the run. The anticipation lasts until the end and
// not a moment past it: the bar ending, or going, turns it off at once, the end's moment with it, and `cut` says the anticipation on screen
// is cut there, its outro and all, so the reaction to the end plays at once and the figure is never still eager after the end.
export function eagerFor(progress, eager, random, now) {
    const same = Boolean(progress) && progress.began === eager?.run;
    if (eager?.on && (!same || progress.ended)) {
        const ending = same ? (progress.ended === "good" ? "bar_done" : "bar_failed") : "";
        return {eager: {run: eager.run, on: false}, moment: ending ? {beat: ending} : null, cut: true};
    }
    if (!progress || progress.ended) return {eager: eager && {...eager, on: false}, moment: null};
    const elapsed = now - progress.began;
    const left = secondsLeft(elapsed, progress.share);
    if (same) return {eager: heldEager(eager, left), moment: null};
    if (left > EAGER.lead) return {eager, moment: null};
    if (left < EAGER.least) return {eager: {run: progress.began, on: false}, moment: null};
    if (elapsed > EAGER.long) return {eager: {run: progress.began, on: true, urgent: true}, moment: null};
    if (elapsed < EAGER.after) return {eager: {run: progress.began, on: false}, moment: null};
    return {eager: {run: progress.began, on: draw({moment: "eager", slow: true}, random)?.name === "eager"}, moment: null};
}

// the eagerness of a run it is already rolled for, as the projected end `left` seconds away puts it: calmed when the end moved back past
// EAGER.lead plus EAGER.grace, and on again once it is within EAGER.lead and no nearer than EAGER.least
function heldEager(eager, left) {
    if (eager.on && left > EAGER.lead + EAGER.grace) return {...eager, on: false, calm: true};
    if (eager.calm && left <= EAGER.lead && left >= EAGER.least) return {...eager, on: true, calm: false};
    return eager;
}

// A jump of more than this many of the figure's own heights is high, and now and then turns over backwards on the way (pile.js jump)
export const FLIP_OVER = 1;

// the key a reaction's act is answered under, by its kind: a look on the eyes, a gaze of the head, and a clip for the rest
const ANSWERED_AS = {look: "look", gaze: "gaze"};

// The reaction to this moment drawn from the pile, or null when nothing is drawn: a clip the body plays, a look the eyes take on or a gaze
// the head takes, whether it turns toward its card or goes onto it, whether it holds, and its lifetime in the queue. `memory` maps a moment
// to when it last played, in seconds, and is filled in here.
export function reactionTo(moment, memory, now, random, voice = "", has = () => true, tally = null) {
    const drawn = draw({moment, voice, has, memory, now, tally}, random);
    if (!drawn) return null;
    return {[ANSWERED_AS[drawn.kind] ?? "clip"]: drawn.name, toward: drawn.toward ?? "", onto: Boolean(drawn.onto), holds: Boolean(drawn.holds), lifetime: drawn.lifetime};
}

// The act drawn after `held` seconds of a state, as its entry, or null: the idle acts while the figure has nothing to do, and the
// shenanigans that fit in `room` (roomFor), which is more than none only while it has nothing to do; `memory` holds when each act last
// played and `tally` the acts since the last shenanigan, filled in here, and `ball` where a disco ball may hang over the figure (perches.js
// discoBall), "" with no room
export const pastimeOf = (room, held, memory, now, random, voice = "", has = () => true, tally = null, ball = "") =>
    draw({moment: "pastime", free: room > 0, room, lasted: held, voice, has, memory, now, tally, ball}, random);

// whether this jump up, `height` pixels for a figure `size` pixels tall, turns over on the way, as the pile draws it; `memory` holds when the
// salto last turned, `now` being the time, so it waits its cooldown (pile.js SHOWPIECES), and only with the `room` for it (roomFor)
export const flips = (height, size, random, memory, now, room = 0) => draw({moment: "jump", high: height > FLIP_OVER * size, memory, now, room}, random).name === "backflip";

// the moments each held clip is, every look while it is held: building while the figure hammers, standing while it stands idle
const WHILE = {work: ["building"], idle: ["standing"]};

// The moments of the agent's work and of the user at the compose box at `now`: typing since the last look, the moment of the held clip
// (WHILE), pondering while the agent thinks, and the end of a stretch of work that lasted WORKED_SECONDS. `began` is when the work in hand
// began, 0 with none; it returns the moments and that time as it is now.
export function workMoments(state, typed, began, now) {
    const held = HELD[state];
    const moments = [...(typed ? [{beat: "typing", time: now}] : []), ...(WHILE[held] ?? []).map((beat) => ({beat, time: now}))];
    if (state === "thinking") moments.push({beat: "pondering", time: now, during: "thinking"});
    if (WORKING.has(state)) return {moments, began: began || now};
    if (began && now - began >= WORKED_SECONDS) moments.push({beat: "work_done", time: now});
    return {moments, began: 0};
}

// The thinking act for this play while the agent thinks, as the pile draws it and its parts at `now` (pile.js pondering), each part on its
// own cooldown in `memory`: the thinking with its thought cloud, "think_cloud", ending in the bulb, "ponder", when the bulb is due too;
// the bulb is drawn only after the thinking it ends, so it never lights alone; null when the thinking is not due
export function thinkingAct(memory, now, random) {
    if (!draw({moment: "pondering", memory, now}, random)) return null;
    if (!draw({moment: "thought_cloud", memory, now}, random)) return null;
    return draw({moment: "light_bulb", memory, now}, random) ? "ponder" : "think_cloud";
}

// the moments answered by an act put together from the pile's parts, by moment
const COMPOSED = {pondering: thinkingAct};

// What the figure does about a moment: the egg of `voice` that belongs to it, else its reaction when the roll says so, as a beat the body
// plays once ({beat: {clip, card, mark}}), `card` being the chat mark it turns to and `mark` the one that set it off, as the call says whom
// it calls (figureState.js callLines), or a look its eyes take on ({look: mood}); null for nothing.
// `memory` holds when each reaction last played (`reacted`), the eggs played so far (`played`) and the acts since the last shenanigan
// (`tally`), and is filled in here; `has(clip)`
// says whether the figure has a clip.
export function answerTo(moment, voice, memory, now, random, has) {
    const egg = eggFor(voice, moment, memory.played);
    if (egg && has(egg.clip)) {
        memory.played.push(egg);
        return {beat: {clip: egg.clip, card: ""}};
    }
    if (COMPOSED[moment.beat]) {
        const composed = COMPOSED[moment.beat](memory.reacted, now, random);
        return composed && has(composed) ? {beat: {clip: composed, card: "", ...(moment.during && {during: moment.during})}} : null;
    }
    const reaction = reactionTo(moment.beat, memory.reacted, now, random, voice, has, memory.tally);
    if (reaction?.look) return {look: reaction.look};
    if (reaction?.gaze && moment.card) return {gaze: {card: moment.card}};
    if (reaction?.clip) return {beat: {clip: reaction.clip, card: reaction.toward === "card" ? moment.card || "" : "", ...(moment.card ? {mark: moment.card} : {}), ...(reaction.onto && moment.card ? {onto: true} : {}), ...(reaction.holds && {holds: true}), ...(reaction.lifetime !== LIFETIME && {lifetime: reaction.lifetime})}};
    return null;
}

// What the figure does by itself after `waited` ({state, lasted}), as a beat, `flies` when it is the run off the top of the screen, or
// null: only while it is calm, nothing to play, off any hang or swing, held by no sequence (pile.js sequenceIn) and neither coming nor
// going. `scene` says where things stand, its `room` the seconds it may be away (roomFor); `memory` when each act last played and `tally`
// the acts since the last shenanigan, filled in here.
export function pastimeFor(scene, waited, memory, now, random, has, tally = null) {
    const calm = scene.place.posture !== "hang" && !scene.place.swings && !scene.beats && !scene.held && !scene.arriving && !scene.leaving && !scene.moving;
    if (!calm) return null;
    const drawn = pastimeOf(scene.room ?? 0, waited.lasted, memory, now, random, scene.voice, has, tally, scene.ball);
    return drawn && {clip: drawn.name, card: "", flies: Boolean(drawn.flies)};
}

// whether the beat at the head of `beats`, on screen as the clip `playing` ("" while none plays), may not be cut (pile.js holds), so stepping
// out of the way waits for it to end as any other act does
export const uncut = (beats, playing) => Boolean(playing) && beats[0]?.clip === playing && Boolean(beats[0].holds);

// The beat queue once `beat` comes first, as a stumble, a tickle or a fume does: put before every beat waiting, but after the beat on
// screen, at the queue's head while it plays as the clip `playing`, which plays out first, never broken off
export function queuedFirst(beats, beat, playing) {
    const onScreen = Boolean(playing) && beats[0]?.clip === playing;
    return onScreen ? [beats[0], beat, ...beats.slice(1)] : [beat, ...beats];
}

// the beat queue once the clip `name` has played to its end: its beat gone, wherever it stands, as when a beat put first came in front of it
// while it played
export function playedFrom(beats, name) {
    const at = beats.findIndex((beat) => beat.clip === name);
    return at < 0 ? beats : [...beats.slice(0, at), ...beats.slice(at + 1)];
}

// The queue with a worker given work, by the chat mark `card` that says so, joined to the telephone call already waiting or playing in
// `beats`, which then names every worker it gathered, one after another; null when no call is there to join
export function joinedCall(beats, card) {
    const at = beats.findIndex((beat) => beat.clip === "phone_call");
    if (at < 0) return null;
    const call = beats[at];
    const marks = call.marks ?? [call.mark];
    if (marks.includes(card)) return beats;
    return beats.map((beat, index) => (index === at ? {...call, marks: [...marks, card]} : beat));
}

// whether the figure looks at the running bar now, in the stretch `choice` (runWait.js barWatchAt) and with `shown` on screen: only in a stretch it watches,
// and never while an act played once, an entrance, an exit or any other, is on screen
export const watchesBar = (choice, shown) => Boolean(choice?.watches) && !shown.once;

// The telephone call to the workers given work while the last call's cooldown ran, `held` their chat marks, once that cooldown is over
// at `now` and the call may join `beats`, as its beat, noted in `reacted` as the call's time; null while it runs or when no worker waits
export function heldCall(held, beats, reacted, now) {
    const call = {clip: "phone_call", card: "", mark: held[0], marks: [...held]};
    if (!held.length || now - (reacted.get("messaged") ?? -Infinity) < CALL_COOLDOWN || !queues(beats, call)) return null;
    reacted.set("messaged", now);
    return call;
}

// how long a moment stays worth acting on, in seconds: the figure acts on what just happened, never late
export const FRESH_SECONDS = 10;

// The beats still worth playing at `now` (seconds): the one on screen, as `playing` names its clip, and every waiting beat within its
// lifetime since it was queued (pile.js alive); a beat with no time it was queued, as one shown during a state, stays
export const freshBeats = (beats, playing, now) =>
    beats.filter((beat, index) => (index === 0 && beat.clip === playing) || !beat.queuedAt || alive(beat, beat.queuedAt, now));

// the beat the figure plays now from the queue `beats`: the one at its head, or none while a sequence holds the figure (pile.js
// sequenceIn), so what comes meanwhile waits
export const headBeat = (beats, sequence) => (sequence ? null : (beats[0] ?? null));

// The beat queue as the agent stands in `state`: a beat shown during a state (`during`, as the thinking act is) gone once that state is
// over, whether it waits or plays; `cut` says whether the beat on screen, playing as the clip `playing`, is one of them, ended at once
export function stillGoing(beats, state, playing) {
    const kept = beats.filter((beat) => !beat.during || beat.during === state);
    return {beats: kept, cut: Boolean(playing) && beats[0]?.clip === playing && kept[0] !== beats[0]};
}

// whether `beat` is queued at all: a beat shown during a state never while another for that state already waits or plays
export const queues = (beats, beat) => !beat.during || !beats.some((each) => each.during === beat.during);

// How fast the figure's head can swing its look, in radians a second: a pointer moved faster is followed at this pace
export const LOOK_TURN_SPEED = 2 * Math.PI;

// The look on the page, {point, toward, amount, at}, `at` milliseconds `now` with `point` to look at or null, about `center`, the point on
// the page the head turns about: it eases in over LOOK_EASE_MS once there is something to look at, as far as `blend` (looks.js headBlend),
// and back out over as long from the last place looked at once there is not, as the UFO goes or the bar ends, so the head never snaps,
// `amount` how far into it the figure is, 0 to 1. The look is kept as `toward`, its way from `center` on the page, so the figure walking never swings it, and turns toward `point`
// no faster than LOOK_TURN_SPEED: with `head`, {depth, above, tip}, the head looking at the page from `depth` pixels before it, its eyes
// `above` its pivot and tipping no further than `tip` (figure.js LOOK_REACH, eyesAboveOf, HEAD_TIP), the head's own turn (look.js), else
// the look's turn about `center` on the page
export const LOOK_EASE_MS = 500;
export function gazeAfter(gaze, point, center, now, head = null, blend = 1) {
    const elapsedMs = now - (gaze.at || now);
    const step = elapsedMs / LOOK_EASE_MS;
    // A screen target and a prop can occupy the same page pixels on opposite sides of the figure. Let the old look ease away before
    // taking up the other depth, so changing `behind` never flips a fully turned head in one frame.
    const changesDepth = point && gaze.point && Boolean(point.behind) !== Boolean(gaze.point.behind);
    const leaving = changesDepth && gaze.amount > 0;
    const goal = point && !leaving ? blend : 0;
    const amount = gaze.amount < goal ? Math.min(gaze.amount + step, goal) : Math.max(gaze.amount - step, goal);
    const largest = (LOOK_TURN_SPEED * elapsedMs) / 1000;
    const from = gaze.toward ? {...gaze.point, x: center.x + gaze.toward.x, y: center.y + gaze.toward.y} : gaze.point;
    const turned = leaving ? from : point?.behind && point.mood === "reading" ? {...point} : point && from && !changesDepth ? (head && !point.behind && !from.behind ? lookTurned(from, point, center, largest, head) : headTurned(from, point, center, largest)) : point;
    const target = turned ?? from;
    const looked = target?.behind && target.mood === "reading" ? readingGazeAfter(gaze.point, target, center, elapsedMs, head) : target;
    return {point: looked ?? null, toward: looked ? {x: looked.x - center.x, y: looked.y - center.y} : null, amount, at: now};
}

// Reading keeps an unwrapped local yaw across the back of the head, then lets the shoulders follow it on a slower clock.
function readingGazeAfter(previous, point, center, elapsedMs, head) {
    const degrees = (angle) => angle * 180 / Math.PI;
    const wrapped = (angle) => degrees(Math.atan2(Math.sin(angle * Math.PI / 180), Math.cos(angle * Math.PI / 180)));
    const facing = head?.facing ?? 0;
    const depth = head?.depth ?? 24;
    const raw = wrapped(degrees(Math.atan2(point.x - center.x, -depth)) - facing);
    const anchored = wrapped(degrees(Math.atan2((point.readingCenter ?? point.x) - center.x, -depth)) - facing);
    const kept = previous?.mood === "reading" && Number.isFinite(previous.readingYaw);
    const change = kept ? wrapped(previous.readingFacing - facing) : 0;
    const reference = kept ? previous.readingYaw + change : anchored;
    const wanted = reference + wrapped(raw - reference);
    const seconds = Math.min(Math.max(elapsedMs / 1000, 0), 0.1);
    const largest = READING.turnSpeed * seconds;
    const yaw = kept ? reference + Math.min(Math.max(wanted - reference, -largest), largest) : wanted;
    const followed = kept ? previous.readingFollow + change : yaw;
    const follow = followed + (yaw - followed) * (1 - Math.exp(-seconds / READING.followSeconds));
    const tip = head?.tip ?? {up: 25, down: 35};
    const requestedPitch = degrees(lookAngles(point.x - center.x, -depth, center.y - point.y, head?.above ?? 0).pitch);
    const wantedPitch = Math.min(Math.max(requestedPitch, -tip.up), tip.down);
    const pitchStep = READING.tipSpeed * seconds;
    const pitch = kept ? previous.readingPitch + Math.min(Math.max(wantedPitch - previous.readingPitch, -pitchStep), pitchStep) : wantedPitch;
    return {...point, readingYaw: yaw, readingFollow: follow, readingPitch: pitch, readingFacing: facing};
}

// The point the head looks at next, from the one it looked at, `previous`, toward `target`, both on the page, the head's pivot at `center`
// looking at the page from `depth` pixels before it, its eyes `above` the pivot, tipping no further than `tip` degrees {down, up}: the
// head's turn (look.js lookAngles), as far as it tips, turned toward the target's the short way round by at most `largest` radians,
// wherever on the page that falls
export function lookTurned(previous, target, center, largest, {depth, above, tip}) {
    const tipped = (point) => {
        const {yaw, pitch} = lookAngles(point.x - center.x, depth, center.y - point.y, above);
        return {yaw, pitch: Math.min(Math.max(pitch, (-tip.up * Math.PI) / 180), (tip.down * Math.PI) / 180)};
    };
    const [a, b] = [lookWay(tipped(previous)), lookWay(tipped(target))];
    const apart = Math.acos(Math.min(Math.max(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1), 1));
    if (apart <= largest) return {...target};
    const k = largest / apart;
    const [p, q] = [Math.sin((1 - k) * apart) / Math.sin(apart), Math.sin(k * apart) / Math.sin(apart)];
    const [x, y, z] = a.map((part, index) => p * part + q * b[index]);
    const across = (depth * x) / y;
    return {...target, x: center.x + across, y: center.y - upFor(across, depth, -Math.asin(Math.min(Math.max(z, -1), 1)), above)};
}

// how near, in radians about the head, the look comes to a point for the figure to face it
export const LOOK_FACES = 0.15;

// whether the look at `point` faces `target`, both on the page, about the head's middle `center`
export function faces(point, target, center) {
    const gap = Math.atan2(target.y - center.y, target.x - center.x) - Math.atan2(point.y - center.y, point.x - center.x);
    return Math.abs(Math.atan2(Math.sin(gap), Math.cos(gap))) <= LOOK_FACES;
}

// The point the head looks at next, from the one it looked at, `previous`, toward `target`, both on the page: turned about the head,
// `center`, by at most `largest` radians, at the target's own distance
export function headTurned(previous, target, center, largest) {
    const from = Math.atan2(previous.y - center.y, previous.x - center.x);
    const to = Math.atan2(target.y - center.y, target.x - center.x);
    const gap = Math.atan2(Math.sin(to - from), Math.cos(to - from));
    const angle = from + Math.max(-largest, Math.min(largest, gap));
    const reach = Math.hypot(target.x - center.x, target.y - center.y);
    return {...target, x: center.x + reach * Math.cos(angle), y: center.y + reach * Math.sin(angle)};
}

// Whether the figure answers a moment with `eager` as it stands (eagerFor): while it is eager for a run's end nothing takes it off,
// neither an act, a look nor a tickle; only the end itself, which eagerFor answers once the eagerness is over
export const isListening = (eager) => !eager?.on;

// The moments the figure answers now, {answer, held}, with `eager` as it stands: while it is eager for a run's end none, the moments that
// came, `fresh`, held with those already `held`, one of each beat and card; once it listens again those held first, in the order they came,
// then the fresh ones
export function heardNow(eager, held, fresh) {
    if (isListening(eager)) return {answer: [...held, ...fresh], held: []};
    const kept = [...held, ...fresh].filter((moment, index, all) => all.findIndex((other) => other.beat === moment.beat && other.card === moment.card) === index);
    return {answer: [], held: kept};
}
