import {ledgeSpot} from "./perches.js";

// While a watched command runs long, the figure waits on it without staring. For the first `watch` seconds of the run it watches the bar's
// line; then it sits on the edge of the docked card the bar runs on, `along` of the way across, its legs swinging and its head free for its
// weighted looks (looks.js), glancing at the bar now and then, a glance of `glance` seconds after `between` seconds with its eyes elsewhere.
// Seated it plays its sitting acts in turn, each for `act` seconds: leaning back on its hands, checking a pocket watch, dozing with a Z on
// its visor; and it looks up when the bar jumps `jump` of its length at once or passes `near` of it. The anticipation of a long run's end
// (reactions.js eagerFor) takes it off the card in time, as anywhere.
export const RUN_WAIT = {watch: 15, along: 0.3, glance: [1, 2], between: [6, 14], act: [8, 14], jump: 0.15, near: 0.9};

// the acts the figure plays seated on the card, the first of them as it sits down
export const SITTING_ACTS = ["ledge_sit", "pocket_watch", "doze"];

// The stage at `now` seconds of the run whose bar is `progress` (places.js progressOf): "watch" while it watches the line, "sit" once it
// waits seated; null with no bar running
export function runStage(progress, now) {
    if (!progress || progress.ended) return null;
    return now - progress.began < RUN_WAIT.watch ? "watch" : "sit";
}

// where the figure at `near`, on the docked card the bar runs on, sits waiting on the run (perches.js ledgeSpot), or null
export const runSeat = (figure, near) => ledgeSpot(RUN_WAIT.along, figure, near);

// The stretch at `now` the figure is in, {watches, until}, at the run's `stage`: watching the line throughout the watch, and seated, a
// glance at the bar after each stretch with its eyes elsewhere, drawn with `random`; `choice` the stretch it was in; null with no run
export function barWatchAt(choice, stage, now, random) {
    if (!stage) return null;
    if (stage === "watch") return {watches: true, seated: false, until: now};
    if (choice?.seated && now < choice.until) return choice;
    const watches = Boolean(choice?.seated) && !choice.watches;
    const [least, most] = watches ? RUN_WAIT.glance : RUN_WAIT.between;
    return {watches, seated: true, until: now + least + random() * (most - least)};
}

// The sitting act at `now` the figure plays seated, {clip, until}: `act`, the one it plays, while it lasts, else the next, another of
// SITTING_ACTS drawn with `random`; the first of them as it sits down
export function sittingActAt(act, now, random) {
    if (act && now < act.until) return act;
    const others = SITTING_ACTS.filter((name) => name !== act?.clip);
    const clip = act ? others[Math.floor(random() * others.length)] : SITTING_ACTS[0];
    return {clip, until: now + RUN_WAIT.act[0] + random() * (RUN_WAIT.act[1] - RUN_WAIT.act[0])};
}

// whether the bar moved from `last` to `share` of its length makes the figure look up: a jump of RUN_WAIT jump at once, or passing its near end
export const progressJumped = (last, share) => last !== null && (share - last >= RUN_WAIT.jump || (last < RUN_WAIT.near && share >= RUN_WAIT.near));
