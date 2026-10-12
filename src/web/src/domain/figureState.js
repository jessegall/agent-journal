import {stateOf} from "./agentState.js";

// What the figure does, read from the same agent row and work rows as the status bar, so the two never disagree.
// Each held state names the clip the figure loops while it is true; a state with no clip of its own shows idle.
export const HELD = {
    idle: "idle",
    asleep: "sleep",
    thinking: "think",
    searching: "search",
    writing: "write",
    running: "work",
    waiting: "walk",
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
    if (waitingSince || agent?.data.asking) return {state: "asking", since: waitingSince || since};
    if (bar === "idle") return {state: now - since >= ASLEEP_AFTER ? "asleep" : "idle", since};
    const inFlight = agent?.data.event === "PreToolUse" && TOOL_STATES[agent.data.tool];
    return {state: inFlight || "thinking", since};
}

export const clipOf = (state) => HELD[state] || HELD.idle;

// One-off beats, each fired by a card the journal wrote on the agent's row and played once before the held state resumes;
// the first rule a card matches names its beat, and a voice with a gag of its own for a beat plays that instead
const BEATS = [
    {beat: "committed", matches: (card) => card.tone === "commit"},
    {beat: "failed", matches: (card) => card.icon === "check" && card.tone === "danger"},
    {beat: "refused", matches: (card) => card.tone === "danger"},
    {beat: "answered", matches: (card) => card.icon === "question"},
];

const BEAT_CLIPS = {committed: "celebrate", failed: "shake", refused: "shake", answered: "nod", heard: "nod"};
const GAGS = {butler: {committed: "butler_tray_down"}, squire: {failed: "squire_chase"}};

// The beats for what reached the agent's row after `seenAt` (seconds), oldest first: its cards, and the user's own message
export function beatsAfter(agent, seenAt) {
    const cards = (agent?.data.cards || []).filter((card) => card.at > seenAt);
    const fired = cards.map((card) => ({beat: BEATS.find((rule) => rule.matches(card))?.beat, at: card.at})).filter((fire) => fire.beat);
    const heard = Number(agent?.data.person_at || 0);
    return [...fired, ...(heard > seenAt ? [{beat: "heard", at: heard}] : [])].sort((a, b) => a.at - b.at);
}

// the clips a beat may play, the voice's own gag first
export const beatClipsOf = (voice, beat) => [GAGS[voice]?.[beat], BEAT_CLIPS[beat]].filter(Boolean);
