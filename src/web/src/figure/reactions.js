// What the figure does about what happens around it, and how often. Every number that decides it is here, so it can be tuned in one place.
// Nothing fires every time: `odds` is the chance a moment is reacted to at all, and `cooldown` the seconds before the same reaction may
// play again, so the figure is a creature that notices things now and then, not a status icon.

// The reactions to a moment, by its name; the first whose roll succeeds plays. `moment` is a beat, a card seen to change, or a held state.
export const REACTIONS = [
    {moment: "tests_passed", clip: "joy", odds: 0.75, cooldown: 20, toward: "card"},
    {moment: "tests_failed", clip: "dismay", odds: 0.75, cooldown: 20, toward: "card"},
    {moment: "committed", clip: "celebrate", odds: 0.6, cooldown: 30},
    {moment: "failed", clip: "shake", odds: 0.6, cooldown: 20, toward: "card"},
    {moment: "refused", clip: "shake", odds: 0.5, cooldown: 20},
    {moment: "answered", clip: "nod", odds: 0.6, cooldown: 15},
    {moment: "heard", clip: "wave", odds: 0.15, cooldown: 120},
    {moment: "heard", clip: "nod", odds: 0.35, cooldown: 15},
    // the user typing in the box next to it, and the agent settling after a long stretch of work
    {moment: "typing", clip: "peek", odds: 0.2, cooldown: 60},
    {moment: "work_done", clip: "stretch", odds: 0.4, cooldown: 120},
    // a face the user puts on a message is aimed at the figure, so it always answers, and turns to the message to do it
    {moment: "reacted:\u2764\ufe0f", clip: "hearts", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83d\udc4d", clip: "nod", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83c\udf89", clip: "joy", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83d\ude04", clip: "laugh", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83d\udc40", clip: "look_around", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83d\ude4f", clip: "bow", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83d\udc4e", clip: "shake", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83d\udc94", clip: "dismay", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83d\ude20", clip: "flinch", odds: 1, cooldown: 0, toward: "card"},
    {moment: "reacted:\ud83c\udfa9", clip: "bow", odds: 1, cooldown: 0, toward: "card"},
];

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

// the clip that plays for this moment, or "": the first reaction for it that is off cooldown and wins its roll. `memory` maps a clip's name
// to when it last played, in seconds, and is filled in here
export function reactionTo(moment, memory, now, random) {
    const found = REACTIONS.find(
        (each) => each.moment === moment && now - (memory.get(each.clip) ?? -Infinity) >= each.cooldown && random() < each.odds
    );
    if (!found) return null;
    memory.set(found.clip, now);
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
