import {WORKING, clipOf, eggFor} from "../domain/figureState.js";

// What the figure does about what happens around it, and how often. Every number that decides it is here, so it can be tuned in one place.
// Nothing fires every time: `odds` is the chance a moment is reacted to at all, and `cooldown` the seconds before the same reaction may
// play again, so the figure is a creature that notices things now and then, not a status icon.

// The reactions to a moment, by its name; the first whose roll succeeds plays. `moment` is a beat, a card seen to change, or a held state.
// A clip moves the body once; a look changes only the eyes. Card-directed clips face their source.
export const REACTIONS = [
    {moment: "tests_passed", clip: "joy", odds: 0.75, cooldown: 20, toward: "card"},
    {moment: "tests_failed", clip: "startled", odds: 0.75, cooldown: 20, toward: "card"},
    {moment: "committed", clip: "joy", odds: 0.6, cooldown: 30},
    {moment: "failed", clip: "shake", odds: 0.6, cooldown: 20, toward: "card"},
    {moment: "refused", clip: "shake", odds: 0.5, cooldown: 20},
    {moment: "work_done", clip: "stretch", odds: 0.4, cooldown: 120},
    {moment: "answered", look: "amused", odds: 0.6, cooldown: 15},
    {moment: "heard", voice: "butler", clip: "bow", odds: 0.5, cooldown: 30},
    {moment: "heard", voice: "squire", clip: "salute", odds: 0.5, cooldown: 30},
    {moment: "heard", voices: ["coach", "colleague", "homie"], clip: "nod", odds: 0.5, cooldown: 30},
    {moment: "long_walk", clip: "stumble", odds: 0.12, cooldown: 90},
    {moment: "card_arrived", clip: "glance", odds: 0.35, cooldown: 20, toward: "card"},
    {moment: "typing", look: "reading", odds: 0.2, cooldown: 60},
    // a face the user puts on a message is aimed at the figure, so it always answers
    {moment: "reacted:\u2764\ufe0f", look: "hearts", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83d\udc4d", look: "amused", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83c\udf89", look: "startled", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83d\ude04", look: "amused", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83d\udc40", look: "reading", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83d\ude4f", look: "hearts", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83d\udc4e", look: "worried", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83d\udc94", look: "worried", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83d\ude20", look: "angry", odds: 1, cooldown: 0},
    {moment: "reacted:\ud83c\udfa9", look: "amused", odds: 1, cooldown: 0},
];

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

// While the agent works, the figure seated works at a laptop most of the time, rolled once for each stretch of work so it keeps at it from
// one tool to the next; on its feet, or when the roll says no, it does what each state's own clip does
export const WORK_VARIANTS = [["type", 0.7]];

// Things it does by itself while it sits at rest: once the state has lasted `after` seconds, every so often (a random number of seconds
// between the two in `every`), and then with chance `odds`
export const AMBIENT = [
    {clip: "look_around", state: "idle", after: 60, every: [25, 60], odds: 0.6},
    {clip: "stretch", state: "idle", after: 240, every: [90, 180], odds: 0.5},
    {clip: "polish", voice: "butler", state: "idle", after: 90, every: [60, 150], odds: 0.5},
    ...[
        ["coach", "whistle"], ["colleague", "sip"], ["homie", "headphones"], ["squire", "shield_polish"],
    ].map(([voice, clip]) => ({voice, clip, state: "idle", after: 90, every: [60, 150], odds: 0.5})),
];

// the agent has worked for at least this many seconds when it settles, for "work_done" to be a moment
export const LONG_WALK_SECONDS = 5;

export function walkingMoment(trip, began, now) {
    if (!trip?.moves || trip.hopping) return {began: 0, moment: null};
    const since = began || now;
    return {began: since, moment: now - since >= LONG_WALK_SECONDS ? {beat: "long_walk", at: now} : null};
}

export const WORKED_SECONDS = 30;

// A jump of more than this many of the figure's own heights sometimes turns over backwards on the way
export const FLIP_OVER = 1;
export const FLIP_ODDS = 0.35;

// what a reaction does, a clip or a look, which is what its cooldown is kept under
const doing = (reaction) => reaction.clip ?? `look:${reaction.look}`;

// the reaction to this moment, or null: the first for it that is off cooldown and wins its roll. `memory` maps what a reaction does to
// when it last did it, in seconds, and is filled in here
export function reactionTo(moment, memory, now, random, voice = "", has = () => true) {
    const found = REACTIONS.find(
        (each) => each.moment === moment && (!each.voice || each.voice === voice) && (!each.voices || each.voices.includes(voice)) && (!each.clip || has(each.clip)) && now - (memory.get(doing(each)) ?? -Infinity) >= each.cooldown && random() < each.odds
    );
    if (!found) return null;
    memory.set(doing(found), now);
    return found;
}

// the clip an ambient moment calls for after `held` seconds of `state`, or "": `next` maps a clip's name to when it may next play
export function ambientFor(state, held, next, now, random, voice = "", has = () => true) {
    const found = AMBIENT.find((each) => each.state === state && (!each.voice || each.voice === voice) && has(each.clip) && held >= each.after && now >= (next.get(each.clip) ?? 0));
    if (!found) return "";
    const [least, most] = found.every;
    next.set(found.clip, now + least + random() * (most - least));
    return random() < found.odds ? found.clip : "";
}

// whether this jump up, `height` pixels for a figure `size` pixels tall, turns over on the way
export const flips = (height, size, random) => height > FLIP_OVER * size && random() < FLIP_ODDS;

// The clip a stretch of work shows, or "" for each state's own: the figure rolls once for each stretch, so it does not change its mind
export function workClip(random) {
    const found = WORK_VARIANTS.find(([, odds]) => random() < odds);
    return found ? found[0] : "";
}

// The clip the figure shows in `state`: through a stretch of work, the laptop when it rolled it once for the stretch, else the state's
// own. `rolled` is what it rolled for the stretch it was in, {stretch, clip}; it returns the roll for the stretch it is in now, with the
// clip it shows as `shows`.
export function stretchClip(state, rolled, random) {
    const stretch = WORKING.has(state) ? "work" : state;
    const roll = rolled.stretch === stretch ? rolled : {stretch, clip: WORKING.has(state) ? workClip(random) : ""};
    return {stretch: roll.stretch, clip: roll.clip, shows: ["reading", "writing"].includes(state) ? clipOf(state) : roll.clip || clipOf(state)};
}

// The moments of the agent's work and of the user at the compose box at `now`: typing since the last look, and the end of a stretch of
// work that lasted WORKED_SECONDS. `began` is when the work in hand began, 0 with none; it returns the moments and that time as it is now.
export function workMoments(state, typed, began, now) {
    const moments = typed ? [{beat: "typing", at: now}] : [];
    if (WORKING.has(state)) return {moments, began: began || now};
    if (began && now - began >= WORKED_SECONDS) moments.push({beat: "work_done", at: now});
    return {moments, began: 0};
}

// What the figure does about a moment: the egg of `voice` that belongs to it, else its reaction when the roll says so, as a beat the body
// plays once ({beat: {clip, card}}), `card` being the chat mark it turns to, or a look its eyes take on ({look: mood}); null for nothing.
// `memory` holds when each reaction last played (`reacted`) and the eggs played so far (`played`), and is filled in here; `has(clip)`
// says whether the figure has a clip.
export function answerTo(moment, voice, memory, now, random, has) {
    const egg = eggFor(voice, moment, memory.played);
    if (egg && has(egg.clip)) {
        memory.played.push(egg);
        return {beat: {clip: egg.clip, card: ""}};
    }
    const reaction = reactionTo(moment.beat, memory.reacted, now, random, voice, has);
    if (reaction?.look) return {look: reaction.look};
    if (reaction && has(reaction.clip)) return {beat: {clip: reaction.clip, card: reaction.toward === "card" ? moment.card || "" : ""}};
    return null;
}

// What the figure does by itself after `waited` ({state, lasted}), as a beat, or null: only while it is calm, at rest in the idle state
// with nothing to play, its hands free and neither coming nor going. `scene` says where things stand; `due` when each pastime may next
// play, filled in here.
export function pastimeFor(scene, waited, due, now, random, has) {
    const calm = waited.state === "idle" && scene.place.posture !== "hang" && !scene.beats && !scene.arriving && !scene.leaving && !scene.moving;
    if (!calm) return null;
    const clip = ambientFor(waited.state, waited.lasted, due, now, random, scene.voice, has);
    return clip && has(clip) ? {clip, card: ""} : null;
}
