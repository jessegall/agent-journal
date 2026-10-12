import {stateOf} from "./agentState.js";

// What the figure does, read from the same agent row and work rows as the status bar, so the two never disagree.
// Each held state names the clip the figure loops while it is true; a state with no clip of its own idles. The walk is never held: it plays only while the figure moves.
export const HELD = {
    idle: "idle",
    asleep: "sleep",
    thinking: "think",
    searching: "search",
    writing: "write",
    running: "work",
    waiting: "idle",
    asking: "idle",
    compacting: "idle",
    paused: "idle",
    stopped: "sleep",
};

// The states in which the agent cannot act, so the figure stays seated on a corner of the edge at home instead of roaming
export const RESTS = new Set(["asleep", "compacting", "paused", "stopped"]);

// The states in which the agent is at work
export const WORKING = new Set(["thinking", "searching", "writing", "running"]);

// A tool in flight says what the agent is doing with it; the providers report their own tools under these names.
const TOOL_STATES = {
    Read: "searching",
    Grep: "searching",
    Glob: "searching",
    WebSearch: "searching",
    WebFetch: "searching",
    Edit: "writing",
    MultiEdit: "writing",
    Write: "writing",
    NotebookEdit: "writing",
    Bash: "running",
};

const BAR_STATES = {paused: "paused", stopped: "stopped", compacting: "compacting", waiting: "waiting", running: "waiting"};

// An idle agent's figure falls asleep after this many seconds of nothing.
export const ASLEEP_AFTER = 600;

// How long a wait on the user lasts before the figure makes its one pointed remark, in seconds.
export const POINTED_AFTER = 180;

// The held state at `now` (seconds), with when it began; `waitingSince` is when the oldest thing waiting on the user arrived, as its badges
// count it, or 0 when nothing waits
export function figureStateOf(agent, works, waitingSince, now = Date.now() / 1000) {
    const bar = stateOf(agent, works);
    const since = Number(agent?.data.at || now);
    if (BAR_STATES[bar]) return {state: BAR_STATES[bar], since};
    // the pose says what the agent does, so it waits on the user only while it does nothing else; where it stands says what waits
    if (bar === "idle" && (waitingSince || agent?.data.asking)) return {state: "asking", since: waitingSince || since};
    if (bar === "idle") return {state: now - since >= ASLEEP_AFTER ? "asleep" : "idle", since};
    const inFlight = agent?.data.event === "PreToolUse" && TOOL_STATES[agent.data.tool];
    return {state: inFlight || "thinking", since};
}

export const clipOf = (state) => HELD[state] || HELD.idle;

// When the oldest thing waiting on the user arrived, in seconds: `since` kept while anything waits, `now` when something has just begun to
// wait, 0 once nothing does. `counts` are the views' badge counts.
export const waitingSinceAt = (counts, since, now) => (counts.question + counts.waiting + counts.suggestion > 0 ? since || now : 0);

// What the figure plays now, by clip name, with the way it faces: its entrance or exit, the landing, the leg of a trip it is on, its hang
// while it hangs, a beat until it is done, pointing once it stands at a tab while the agent waits on the user, else what its body is doing,
// drawn in its place. `scene` says where things stand, `doing` being the clip of the stretch it is in; `canDraw(name, posture)` whether a
// clip is drawn in a posture. A beat comes with the way it faces.
// A trip has `started` once the figure stands ready to travel and `moves` while a leg carries it; the hop of a leg or the walk is named
// only then, so the walk is never drawn on the spot. The clip of a leg that waits `departs`: the leg sets off the moment it is on screen.
export function clipFor(scene, canDraw) {
    const {leaving, arriving, trip, landing, place, beat, state, doing} = scene;
    if (leaving) return {clip: "exit", facing: 0, once: true, departure: true};
    if (arriving) return {clip: "enter", facing: 0, once: true, arrival: true};
    if (landing) return {clip: "land", facing: 0, once: true, landed: true};
    if (trip?.started) return {...legClip(trip, doing, canDraw), ...(trip.moves ? {} : {departs: true})};
    // a hanging figure holds on until it is let go; a beat waits until it has dropped
    if (place.posture === "hang") return {clip: `hang_${place.grip}`, facing: place.face};
    if (beat) return {clip: beat.clip, facing: beat.facing, once: true};
    if (place.view && state === "asking") return {clip: "point", facing: 0};
    return {clip: canDraw(doing, place.posture) ? doing : clipOf(state), facing: place.posture === "sit" ? place.face : 0};
}

// the clip of a leg: its hop, or the walk, walked on with what the body is doing where that can be drawn on the move
function legClip(trip, doing, canDraw) {
    if (trip.hopping) return {clip: trip.clip, facing: 0};
    const facing = trip.way > 0 ? 90 : 270;
    return doing !== "idle" && canDraw(doing, "walk") ? {clip: doing, facing, posture: "walk"} : {clip: "walk", facing};
}

// Whether the clip on screen gives way to another that is wanted: at once when it is cut short (figure.js CLIPS), else once it has played
// out, between the frame it was at when last drawn, `last`, and the frame it is at now, `index`
export function givesWay(clip, index, last) {
    if (clip.cutShort) return true;
    if (!clip.loops) return index >= clip.frames;
    const unit = clip.leaves || clip.frames;
    return Math.floor(index / unit) > Math.floor(last / unit);
}

// One-off beats, each fired by a card the journal wrote on the agent's row and played once before the held state resumes;
// the first rule a card matches names its beat
const BEATS = [
    {beat: "committed", matches: (card) => card.tone === "commit"},
    {beat: "failed", matches: (card) => card.icon === "check" && card.tone === "danger"},
    {beat: "refused", matches: (card) => card.tone === "danger"},
    {beat: "answered", matches: (card) => card.icon === "question"},
];

// The beats for faces the user has put on messages since `seenAt` (seconds), oldest first; `reactions` are the journal's reaction rows. The
// card is the message the face is on.
export function facesAfter(reactions, seenAt) {
    return reactions
        .filter((row) => !row.deleted && row.seen[0] === "user" && row.created > seenAt)
        .map((row) => ({beat: `reacted:${row.data.face}`, at: row.created, card: row.refs[0]}))
        .sort((a, b) => a.at - b.at);
}

// A test run's card is made when it starts and changes when it ends, so its result is a change seen between two looks: the beats for each
// test card that has ended since `known` (card key to the state it had) was last filled in, which this fills in
export function testResultsAfter(agent, known) {
    const ended = (agent?.data.cards || []).filter((card) => card.key?.startsWith("tests:") && ["done", "failed"].includes(card.state));
    const fresh = ended.filter((card) => known.get(card.key) !== card.state);
    fresh.forEach((card) => known.set(card.key, card.state));
    return fresh.map((card) => ({beat: card.state === "done" ? "tests_passed" : "tests_failed", at: Number(card.ended || card.at), card: card.key}));
}

// The beats for what reached the agent's row after `seenAt` (seconds), oldest first: its cards, and the user's own message
export function beatsAfter(agent, seenAt) {
    const cards = (agent?.data.cards || []).filter((card) => card.at > seenAt);
    const fired = cards
        .map((card) => ({beat: BEATS.find((rule) => rule.matches(card))?.beat, at: card.at, card: card.key}))
        .filter((fire) => fire.beat);
    const heard = Number(agent?.data.person_at || 0);
    return [...fired, ...(heard > seenAt ? [{beat: "heard", at: heard}] : [])].sort((a, b) => a.at - b.at);
}

// The figure's easter eggs. Each belongs to one true moment read from the agent's row, as the status bar reads it - a beat that fired,
// or a held state that has lasted long enough - and never plays at random or on a timer of its own.
export const EGGS = [
    // the squire runs after a literal bug across the pane when a check goes red
    {clip: "squire_chase", voice: "squire", beat: "failed"},
    // each voice makes its one pointed remark when the user has kept it waiting a long while
    {clip: "pointed", state: "asking", lasted: POINTED_AFTER},
];

// A moment is a beat that fired ({beat, at}) or a held state ({state, since, lasted}); `at` or `since` tells one occurrence from the next
const occurrenceOf = (moment) => moment.at ?? moment.since;
const belongs = (egg, voice, moment) =>
    (!egg.voice || egg.voice === voice) &&
    (egg.beat ? egg.beat === moment.beat : egg.state === moment.state && moment.lasted >= egg.lasted);

// The egg this moment plays, or null: one belongs to it, it has not played for this occurrence, and it is not the egg played last.
// `played` lists the eggs played so far, oldest first, each as {clip, occurrence}.
export function eggFor(voice, moment, played) {
    const egg = EGGS.find((each) => belongs(each, voice, moment));
    if (!egg || played.at(-1)?.clip === egg.clip) return null;
    return played.some((each) => each.clip === egg.clip && each.occurrence === occurrenceOf(moment))
        ? null
        : {clip: egg.clip, occurrence: occurrenceOf(moment)};
}
