// What the figure does about what happens around it, and how often. Every number that decides it is here, so it can be tuned in one place.
// Nothing fires every time: `odds` is the chance a moment is reacted to at all, and `cooldown` the seconds before the same reaction may
// play again, so the figure is a creature that notices things now and then, not a status icon.

// The reactions to a moment, by its name; the first whose roll succeeds plays. `moment` is a beat, a card seen to change, or a held state.
// What happens in the work moves the body: a `clip` plays once, turned to the card that caused it when `toward` says so. What the user
// does is answered by the eyes alone: they take on a `look` for LOOK_SECONDS over whatever the body is doing, which goes on undisturbed.
export const REACTIONS = [
    {moment: "tests_passed", clip: "joy", odds: 0.75, cooldown: 20, toward: "card"},
    {moment: "tests_failed", clip: "dismay", odds: 0.75, cooldown: 20, toward: "card"},
    {moment: "committed", clip: "joy", odds: 0.6, cooldown: 30},
    {moment: "failed", clip: "shake", odds: 0.6, cooldown: 20, toward: "card"},
    {moment: "refused", clip: "shake", odds: 0.5, cooldown: 20},
    {moment: "work_done", clip: "stretch", odds: 0.4, cooldown: 120},
    {moment: "answered", look: "amused", odds: 0.6, cooldown: 15},
    {moment: "heard", look: "amused", odds: 0.5, cooldown: 30},
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

// how long the eyes keep a look
export const LOOK_SECONDS = 3;

// While the agent works, the figure sits down with a laptop most of the time, and otherwise does what the state's own clip does
export const WORK_VARIANTS = {
    running: [["type", 0.7]],
    writing: [["type", 0.7]],
};

// Things it does by itself while it sits at rest: once the state has lasted `after` seconds, every so often (a random number of seconds
// between the two in `every`), and then with chance `odds`
export const AMBIENT = [
    {clip: "look_around", state: "idle", after: 60, every: [25, 60], odds: 0.6},
    {clip: "stretch", state: "idle", after: 240, every: [90, 180], odds: 0.5},
];

// the agent has worked for at least this many seconds when it settles, for "work_done" to be a moment
export const WORKED_SECONDS = 30;

// A jump of more than this many of the figure's own heights sometimes turns over backwards on the way
export const FLIP_OVER = 1;
export const FLIP_ODDS = 0.35;

// what a reaction does, a clip or a look, which is what its cooldown is kept under
const doing = (reaction) => reaction.clip ?? `look:${reaction.look}`;

// the reaction to this moment, or null: the first for it that is off cooldown and wins its roll. `memory` maps what a reaction does to
// when it last did it, in seconds, and is filled in here
export function reactionTo(moment, memory, now, random) {
    const found = REACTIONS.find(
        (each) => each.moment === moment && now - (memory.get(doing(each)) ?? -Infinity) >= each.cooldown && random() < each.odds
    );
    if (!found) return null;
    memory.set(doing(found), now);
    return found;
}

// the clip an ambient moment calls for after `held` seconds of `state`, or "": `next` maps a clip's name to when it may next play
export function ambientFor(state, held, next, now, random) {
    const found = AMBIENT.find((each) => each.state === state && held >= each.after && now >= (next.get(each.clip) ?? 0));
    if (!found) return "";
    const [least, most] = found.every;
    next.set(found.clip, now + least + random() * (most - least));
    return random() < found.odds ? found.clip : "";
}

// whether this jump up, `height` pixels for a figure `size` pixels tall, turns over on the way
export const flips = (height, size, random) => height > FLIP_OVER * size && random() < FLIP_ODDS;

// The clip a working state shows today: the figure rolls once for each stretch of the state, so it does not change its mind mid-way
export function workClip(state, usual, random) {
    const found = (WORK_VARIANTS[state] || []).find(([, odds]) => random() < odds);
    return found ? found[0] : usual;
}
