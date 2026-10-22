import {stateOf} from "./agentState.js";
import {createdAt, refOf, seconds} from "./row.js";

// What the figure does, read from the same agent row and work rows as the status bar, so the two never disagree.
// Each held state names the clip the figure loops while it is true; a state with no clip of its own idles. The walk is never held: it plays only while the figure moves.
export const HELD = {
    idle: "idle",
    asleep: "sleep",
    thinking: "think",
    searching: "search",
    reading: "read",
    writing: "write",
    running: "work",
    waiting: "waiting",
    asking: "waiting",
    compacting: "compacting",
    paused: "idle",
    stopped: "sleep",
};

// The states in which the agent cannot act, so the figure stays seated on a corner of the edge at home instead of roaming
export const RESTS = new Set(["asleep", "compacting", "paused", "stopped"]);

// The states in which the agent is at work
export const WORKING = new Set(["thinking", "searching", "reading", "writing", "running"]);

// A tool in flight says what the agent is doing with it; the providers report their own tools under these names.
const TOOL_STATES = {
    Read: "reading",
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

// A tool's pose stays this many seconds after it finishes, so a tool that runs for a moment is still seen.
export const TOOL_LINGERS = 3;

// How long a wait on the user lasts before the figure makes its one pointed remark, in seconds.
export const POINTED_AFTER = 180;

// The held state at `now` (seconds), with when it began; `waitingSince` is when the oldest thing waiting on the user arrived, as its badges
// count it, or 0 when nothing waits
export function figureStateOf(agent, waitingSince, now = Date.now() / 1000) {
    const bar = stateOf(agent);
    const since = seconds(agent?.heard_at) || now;
    if (BAR_STATES[bar]) return {state: BAR_STATES[bar], since};
    // the pose says what the agent does, so it waits on the user only while it does nothing else; where it stands says what waits
    if (bar === "idle" && (waitingSince || agent?.awaiting)) return {state: "asking", since: waitingSince || since};
    if (bar === "idle") return {state: now - since >= ASLEEP_AFTER ? "asleep" : "idle", since};
    const tool = agent?.tool;
    // a shell line says what it does itself: a read or a search through the shell shows the book or the glass, not the laptop
    const inFlight = Boolean(tool) && (agent.tool_running || now - since < TOOL_LINGERS) && (agent.tool_work || TOOL_STATES[tool]);
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
// only then, so the walk is never drawn on the spot. The clip of a leg that waits is marked `startsLeg`: the leg sets off the moment it is on screen.
// The body's mode, highest first: in the air, landing, on its way, or resting on its floor
export const AIRBORNE = "airborne";
export const LANDING = "landing";
export const TRAVELLING = "travelling";
export const GROUNDED = "grounded";
export const modeOf = ({airborne, landing, trip}) => (airborne ? AIRBORNE : landing ? LANDING : trip?.started ? TRAVELLING : GROUNDED);

export function clipFor(scene, canDraw) {
    const {mode, leaving, arriving, trip, landing, place, beat, state, doing} = scene;
    // a figure in the air on its feet falls before anything else, leaving included: it lands first, and then goes; one dropping with its
    // seat stays seated
    if (mode === AIRBORNE && place.posture === "stand") return {clip: "fall", facing: 0};
    if (leaving) return {clip: "exit", facing: 0, once: true, departure: true};
    if (arriving) return {clip: "enter", facing: 0, once: true, arrival: true};
    if (landing) return {clip: "land", facing: 0, once: true, landed: true};
    if (trip?.started && trip.moves && !trip.hopping && beat?.clip === "stumble") {
        return {clip: "stumble", facing: trip.way > 0 ? 90 : 270, posture: "walk", once: true};
    }
    if (trip?.started) return {...legClip(trip, doing, canDraw), ...(trip.moves ? {} : {startsLeg: true})};
    // a hanging figure holds on until it is let go; a beat waits until it has dropped
    if (place.posture === "hang") return {clip: `hang_${place.grip}`, facing: place.face};
    if (beat) return {clip: beat.clip, facing: beat.facing, once: true};
    if (["asking", "waiting"].includes(state)) return {clip: "waiting", facing: scene.composeFacing ?? 0};
    return {clip: canDraw(doing, place.posture) ? doing : clipOf(state), facing: place.posture === "sit" ? place.face : 0};
}

// the clip of a leg: its hop, or the walk, walked on with what the body is doing where that can be drawn on the move, its steps as much
// quicker as the trip's `pace` is above a walk
function legClip(trip, doing, canDraw) {
    if (trip.hopping) return {clip: trip.clip, facing: 0};
    const facing = trip.way > 0 ? 90 : 270;
    const steps = trip.pace > 1 ? {pace: trip.pace} : {};
    return doing !== "idle" && canDraw(doing, "walk") ? {clip: doing, facing, posture: "walk", ...steps} : {clip: "walk", facing, ...steps};
}

export {frameIn, closeAt, canSwitch} from "../figure/timeline.js";

// One-off beats, each fired by a card the journal wrote on the agent's row and played once before the held state resumes;
// the first rule a card matches names its beat
const BEATS = [
    {beat: "committed", matches: (card) => card.tone === "commit"},
    {beat: "failed", matches: (card) => card.icon === "check" && card.tone === "danger"},
    {beat: "refused", matches: (card) => card.tone === "danger"},
    {beat: "answered", matches: (card) => card.icon === "question"},
];

// the moment a face on a message is, by who put it there: the user's is aimed at the figure, the agent's is the figure's own to play out
const FACE_MOMENTS = {user: "reacted", agent: "agent_reacted"};

// The beats for faces the user or the agent has put on messages since `seenAt` (seconds), oldest first; `reactions` are the journal's
// reaction rows. The card is the message the face is on.
export function facesAfter(reactions, seenAt) {
    return reactions
        .filter((row) => FACE_MOMENTS[row.author] && createdAt(row) > seenAt)
        .map((row) => ({beat: `${FACE_MOMENTS[row.author]}:${row.face}`, time: createdAt(row), card: `messages:${row.message_id}`}))
        .sort((a, b) => a.time - b.time);
}

// A test run is a watched output whose reader's figure says Tests, so its result is its watch card's ending seen between two looks: the
// beats for each such card that has ended since `known` (card key to the ending it had) was last filled in, which this fills in
export function testResultsAfter(agent, known) {
    const ended = (agent?.data?.cards || []).filter((card) => card.watch?.figure?.startsWith("Tests") && card.watch.ending);
    const fresh = ended.filter((card) => known.get(card.key) !== card.watch.ending);
    fresh.forEach((card) => known.set(card.key, card.watch.ending));
    return fresh.map((card) => ({
        beat: card.watch.ending === "finished" ? "tests_passed" : "tests_failed",
        time: Number(card.time),
        card: card.key,
    }));
}

// The agent's row with the system's cards for its session, or for no session, among its own, as messages carry them
export const withSystemCards = (agent, messages) =>
    agent && {
        ...agent,
        data: {
            ...(agent.data || {}),
            cards: [
                ...(agent.data?.cards || []),
                ...messages
                    .filter((m) => m.author === "system" && [undefined, null, "", agent.session].includes(m.session))
                    .map((m) => ({
                        key: refOf(m),
                        time: createdAt(m),
                        icon: m.data.icon,
                        tone: m.data.tone,
                        label: m.text,
                        watch: m.data.output ? {figure: m.data.figure || "", ending: m.data.ending || ""} : null,
                    })),
            ],
        },
    };

export function cardsAfter(agent, known) {
    const cards = (agent?.data?.cards || []).filter((card) => card.key && !known.has(card.key));
    cards.forEach((card) => known.add(card.key));
    return cards.map((card) => ({beat: "card_arrived", time: Number(card.time), card: card.key}));
}

// The beats for what reached the agent's row after `seenAt` (seconds), oldest first: its cards, and the user's own message
export function beatsAfter(agent, seenAt) {
    const cards = (agent?.data?.cards || []).filter((card) => card.time > seenAt);
    const fired = cards
        .map((card) => ({beat: BEATS.find((rule) => rule.matches(card))?.beat, time: card.time, card: card.key}))
        .filter((fire) => fire.beat);
    const heard = Number(agent?.data?.person_at || 0);
    return [...fired, ...(heard > seenAt ? [{beat: "heard", time: heard}] : [])].sort((a, b) => a.time - b.time);
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
const occurrenceOf = (moment) => moment.time ?? moment.since;
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
