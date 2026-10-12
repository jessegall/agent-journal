import {stateOf} from "./agentState.js";

// What the figure does, read from the same agent row and work rows as the status bar, so the two never disagree.
// Each held state names the clip the figure loops while it is true; a state with no clip of its own sits on the edge. The walk is never held: it plays only while the figure moves.
export const HELD = {
    idle: "sit_on_edge",
    asleep: "sleep",
    thinking: "think",
    searching: "search",
    writing: "write",
    running: "work",
    waiting: "idle",
    asking: "idle",
    compacting: "sit_on_edge",
    paused: "sit_on_edge",
    stopped: "sleep",
};

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

// The clips in which the figure sits on a panel's corner instead of standing on its edge
export const SEATED = ["sit_on_edge"];

// One-off beats, each fired by a card the journal wrote on the agent's row and played once before the held state resumes;
// the first rule a card matches names its beat
const BEATS = [
    {beat: "committed", matches: (card) => card.tone === "commit"},
    {beat: "failed", matches: (card) => card.icon === "check" && card.tone === "danger"},
    {beat: "refused", matches: (card) => card.tone === "danger"},
    {beat: "answered", matches: (card) => card.icon === "question"},
];

export const BEAT_CLIPS = {committed: "celebrate", failed: "shake", refused: "shake", answered: "nod", heard: "nod"};

// The beats for what reached the agent's row after `seenAt` (seconds), oldest first: its cards, and the user's own message
export function beatsAfter(agent, seenAt) {
    const cards = (agent?.data.cards || []).filter((card) => card.at > seenAt);
    const fired = cards.map((card) => ({beat: BEATS.find((rule) => rule.matches(card))?.beat, at: card.at})).filter((fire) => fire.beat);
    const heard = Number(agent?.data.person_at || 0);
    return [...fired, ...(heard > seenAt ? [{beat: "heard", at: heard}] : [])].sort((a, b) => a.at - b.at);
}

// The figure's easter eggs. Each belongs to one true moment read from the agent's row, as the status bar reads it - a beat that fired,
// or a held state that has lasted long enough - and never plays at random or on a timer of its own.
export const EGGS = [
    // the squire runs after a literal bug across the pane when a check goes red
    {clip: "squire_chase", voice: "squire", beat: "failed"},
    // the butler sets his tray down when a commit lands, and picks it straight back up
    {clip: "butler_tray_down", voice: "butler", beat: "committed"},
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
