import {createdAt, refOf, seconds} from "./row.js";
import {EVERY_VOICE_FACES, VOICE_FACES} from "../figure/pile.js";
import {ChatMark} from "./chatMark.js";

// What the figure does, read from what the chat reads: the tool in hand and the chat's marks and messages.
// Each held state names the clip the figure loops while it is true; a state with no clip of its own idles. The walk is never held: it plays only while the figure moves.
export const HELD = {
    idle: "idle",
    asleep: "sleep",
    thinking: "idle",
    quiet: "idle",
    searching: "search",
    reading: "read",
    writing: "type",
    testing: "idle",
    building: "work",
    running: "idle",
    waiting: "waiting",
    asking: "waiting",
    compacting: "compacting",
    paused: "idle",
    stopped: "sleep",
};

// The states in which the agent cannot act, so the figure stays seated on a corner of the edge at home instead of roaming
export const RESTS = new Set(["asleep", "compacting", "paused", "stopped"]);

// The states in which the agent is at work
export const WORKING = new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]);

// A tool in flight says what the agent is doing with it; the providers report their own tools under these names.
export const TOOL_STATES = {
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

// An idle or waiting agent's figure plays, its idle moves and showpieces, until no tool has been used for this many seconds, and then
// falls asleep: an agent in a wait runs commands between its looks, so it sleeps only once it has run none for a while.
export const ASLEEP_AFTER = 120;

// A compaction is known once it is done, by its chat mark: the figure plays it for this many seconds after that mark
export const COMPACTING_SECONDS = 20;
export const justCompacted = (cards, now) => cards.some((card) => card.type === "memories.compaction" && now - card.time < COMPACTING_SECONDS);

export const clipOf = (state) => HELD[state] || HELD.idle;

// When the oldest thing waiting on the user arrived, in seconds: `since` kept while anything waits, `now` when something has just begun to
// wait, 0 once nothing does. `counts` are the views' badge counts.
export const waitingSinceAt = (counts, since, now) => (counts.question + counts.waiting + counts.suggestion > 0 ? since || now : 0);

// What the figure plays now, by clip name, with the way it faces: its fall, under a parachute when it comes down on one, its run up the
// bubbles while it is `flying`, its entrance or exit, the landing, the leg of a trip it is on, its hang
// while it hangs, its eagerness for the bar under it to end while it is `eager`, a beat until it is done, pointing once it stands at a tab while the agent waits
// on the user, else what its body is doing,
// drawn in its place. `scene` says where things stand, `doing` being the clip of the stretch it is in and `doingFacing` the way it faces for
// it, as toward a parcel it pushes, else the viewer, and `readingFacing` the way it turns standing to read a bubble beside it (reactions.js
// readingFacing), null while it reads none; `canDraw(name, posture)` whether a clip is drawn in a posture. A beat comes with the way it faces.
// A trip has `started` once the figure stands ready to travel and `moves` while a leg carries it; the hop of a leg or the walk is named
// only then, so the walk is never drawn on the spot. The clip of a leg that waits is marked `startsLeg`: the leg sets off the moment it is on screen.
// The body's mode, highest first: in the air, landing, on its way, or resting on its floor
export const AIRBORNE = "airborne";
export const LANDING = "landing";
export const TRAVELLING = "travelling";
export const GROUNDED = "grounded";
export const modeOf = ({airborne, landing, trip}) => (airborne ? AIRBORNE : landing ? LANDING : trip?.started ? TRAVELLING : GROUNDED);

// A figure lounging, its legs straight out along the floor, is only ever drawn side-on, turned the way its spot faces, whatever it plays
// there; on its way or in the air it faces as anywhere
export function clipFor(scene, canDraw) {
    const wanted = wantedClip(scene, canDraw);
    const lounging = scene.mode === GROUNDED && scene.place.posture === "lounge" && !scene.trip?.started;
    return lounging ? {...wanted, facing: scene.place.face} : wanted;
}

function wantedClip(scene, canDraw) {
    const {mode, leaving, arriving, trip, landing, place, beat, state, doing, doingFacing = 0, readingFacing = null} = scene;
    // a figure in the air on its feet falls before anything else, leaving included: it lands first, and then goes; one dropping with its
    // seat stays seated
    if (mode === AIRBORNE && place.posture === "stand") return {clip: scene.chute ? "chute" : "fall", facing: scene.grabbed ? (place.face ?? 0) : 0};
    // on its run up the bubbles it hops on and on, turned the way it goes
    if (scene.flying) return {clip: "hop_up", facing: scene.flying.way > 0 ? 90 : scene.flying.way < 0 ? 270 : 0};
    if (leaving) return {clip: "exit", facing: 0, once: true, departure: true};
    if (arriving) return {clip: "enter", facing: 0, once: true, arrival: true};
    if (landing) return {clip: "land", facing: 0, once: true, landed: true};
    if (trip?.started && trip.moves && !trip.hopping && beat?.clip === "stumble") {
        return {clip: "stumble", facing: trip.way > 0 ? 90 : 270, posture: "walk", once: true};
    }
    if (trip?.started) return {...legClip(trip, doing, canDraw), ...(trip.moves ? {} : {startsLeg: true})};
    // a hanging figure holds on until it is let go; a beat waits until it has dropped
    if (place.posture === "hang") return {clip: `hang_${place.grip}`, facing: place.face};
    // eager for a run's end it waits for nothing but that end
    if (scene.eager) return {clip: "eager", facing: 0};
    // a beat to play on its chat mark waits while the figure is on its way there
    if (beat && !(beat.onto && trip)) return {clip: beat.clip, facing: beat.facing, once: true, ...(beat.holds && {holds: true}), ...(beat.stretch && {stretch: beat.stretch})};
    // standing at the tab of what waits on the user it points up at it; anywhere else it waits turned toward the compose box
    if (place.view && state === "asking") return {clip: "point", facing: 0};
    // building a box and pushing it go on while the agent waits as well
    // reading a bubble beside it, it stands turned to it whatever it does meanwhile, but for a push, which faces the parcel
    const reads = readingFacing !== null && place.posture === "stand" && doing !== "push";
    if (["asking", "waiting"].includes(state) && !["work", "push"].includes(doing)) return {clip: "waiting", facing: reads ? readingFacing : (scene.composeFacing ?? 0)};
    return {clip: canDraw(doing, place.posture) ? doing : clipOf(state), facing: reads ? readingFacing : place.posture === "sit" ? place.face : doingFacing};
}

// A pressing or sprinting trip runs on its own cycle. An ordinary walk can keep a gesture in its upper body.
function legClip(trip, doing, canDraw) {
    if (trip.hopping) return {clip: trip.clip, facing: trip.facing ?? 0};
    const facing = trip.way > 0 ? 90 : 270;
    const steps = trip.pace > 1 ? {pace: trip.pace} : {};
    if (trip.running || trip.pressing || trip.sprinting || trip.pace > 1) return {clip: "run", facing, ...steps};
    return doing !== "idle" && canDraw(doing, "walk") ? {clip: doing, facing, posture: "walk", ...steps} : {clip: "walk", facing, ...steps};
}

export {actOver, frameIn, closeAt, canSwitch, goesOnFacing, stretchedAs, stretchedFrame} from "../figure/timeline.js";

// how a card's process ended, as its mark reports it
const outcomeOf = (card) => card.outcome;

// the commandments plugin's mark for a file: one mark for each file, kept up in place, in the warn tone while it holds sins and the good tone once repented
const SIN_MARKS = "plugin:code-commandments:sins:";
const isSinMark = (card) => card.type === "plugins.card" && card.markKey.startsWith(SIN_MARKS);

// One-off beats, each fired by a chat mark and played once before the held state resumes; the first rule a mark matches names its beat
const BEATS = [
    // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
    {beat: "sin_committed", matches: (card) => isSinMark(card) && card.variant !== "good"},
    {beat: "sin_fixed", matches: (card) => isSinMark(card) && card.variant === "good"},
    {beat: "committed", matches: (card) => card.type === "workers.worker" && card.variant === "merged"},
    {beat: "reported", matches: (card) => card.type === "workers.worker" && card.variant === "delivered"},
    {beat: "refused", matches: (card) => card.type === "workers.worker" && card.variant === "released"},
    {beat: "failed", matches: (card) => card.type === "workers.tests" && card.variant === "failed"},
    {beat: "check_passed", matches: (card) => card.type === "workers.tests" && card.variant === "passed"},
    {beat: "question_asked", matches: (card) => card.type === "questions.question" && card.variant === "open"},
    {beat: "answered", matches: (card) => card.type === "questions.answer"},
    {beat: "task_finished", matches: (card) => card.type === "tasks.task" && card.variant === "closed"},
    {beat: "fact_filed", matches: (card) => ["memories.memory", "memories.reminder"].includes(card.type) && card.variant === "made"},
];

// The beats for the user's messages the agent has read since `seenAt` (seconds), oldest first, each turned to its message
export const readingsAfter = (messages, seenAt) =>
    messages
        .filter((m) => m.author === "user" && seconds(m.read_at) > seenAt)
        .map((m) => ({beat: "read_message", time: seconds(m.read_at), card: refOf(m)}))
        .sort((a, b) => a.time - b.time);

// the moment a face on a message is, by who put it there: the user's is aimed at the figure, the agent's is the figure's own to play out
const FACE_MOMENTS = {user: "reacted", agent: "agent_reacted"};

// The beats for faces the user or the agent has put on messages since `seenAt` (seconds), oldest first; `faces` are the faces Chat.vue saw
// land, each {author, emoji, message_id, created_at}. The card is the message the face is on.
export function facesAfter(faces, seenAt) {
    return faces
        .filter((row) => FACE_MOMENTS[row.author] && createdAt(row) > seenAt)
        .map((row) => ({beat: `${FACE_MOMENTS[row.author]}:${row.emoji}`, time: createdAt(row), card: `message:${row.message_id}`}))
        .sort((a, b) => a.time - b.time);
}

// every face an agent's act answers, its voice's own and the ones every voice plays (figure/pile.js)
const ACTED_FACES = [...new Set([...Object.values(VOICE_FACES).flatMap((faces) => Object.keys(faces)), ...Object.keys(EVERY_VOICE_FACES)])];

// The beats for faces the agent wrote in its own messages since `seenAt` (seconds), oldest first: a face written counts as one the agent put
// on a message, so it plays the same act; the first acted face in a message is the one played. The card is the message it is in.
export function writtenFacesAfter(messages, seenAt) {
    return messages
        .filter((m) => m.author === "agent" && createdAt(m) > seenAt)
        .map((m) => ({m, face: ACTED_FACES.map((face) => [face, m.text.indexOf(face)]).filter(([, at]) => at >= 0).sort((a, b) => a[1] - b[1])[0]?.[0]}))
        .filter(({face}) => face)
        .map(({m, face}) => ({beat: `agent_reacted:${face}`, time: createdAt(m), card: refOf(m)}))
        .sort((a, b) => a.time - b.time);
}

// A test run is a chat mark the server guessed is one
const isTestRun = (card) => new ChatMark(card).isTest();

// A test run's ending: its watch card's, or a process card's tone once it is no longer active
const endingOf = (card) => card.watch?.ending || (card.process && !card.active && {passed: "finished", failed: "failed"}[outcomeOf(card)]) || "";

// A pass this many seconds or fewer after a failed test run is that failure fixed
export const FIX_SECONDS = 30 * 60;

// The test run's beat: a failure, a pass, or a pass that fixed the test run before it, which failed within FIX_SECONDS
const testBeat = (card, ended) => {
    if (endingOf(card) !== "finished") return "tests_failed";
    const before = ended.filter((other) => Number(other.time) < Number(card.time)).sort((a, b) => Number(b.time) - Number(a.time))[0];
    const fixed = before && endingOf(before) !== "finished" && Number(card.time) - Number(before.time) <= FIX_SECONDS;
    return fixed ? "tests_fixed" : "tests_passed";
};

// The beats for each test run that has ended since `known` (card key to the ending it had, empty while it ran) was last filled in,
// which this fills in: one seen running, or one that began after `since` (seconds, when the figure began to watch) and ended between
// two looks. An old run's mark that comes back into the chat, already ended, is no ending.
export function testResultsAfter(agent, known, since) {
    const runs = (agent?.data?.cards || []).filter(isTestRun);
    const ended = runs.filter((card) => endingOf(card));
    const fresh = ended.filter((card) => known.get(card.key) === "" || (!known.has(card.key) && Number(card.time) > since));
    runs.forEach((card) => known.set(card.key, endingOf(card)));
    return fresh.map((card) => ({beat: testBeat(card, ended), time: Number(card.time), card: card.key}));
}

// The process cards that have ended since `known` (card key to whether it was active) was last filled in, which this fills in: each one
// seen running and now ended as passed (tone good) or failed (tone bad), as {tone, time, card}. A card first seen already ended is not an end.
export function processEndsAfter(agent, known) {
    const cards = (agent?.data?.cards || []).filter((card) => card.process);
    const ended = cards.filter((card) => known.get(card.key) === true && !card.active && ["passed", "failed"].includes(outcomeOf(card)));
    cards.forEach((card) => known.set(card.key, card.active));
    return ended.map((card) => ({tone: outcomeOf(card) === "passed" ? "good" : "bad", time: Number(card.time), card: card.key}));
}

// The chat's mark rows as the figure reads them: each its key as the page marks it (markLook.js), the journal's own key, when it was made, its type and variant, how it stands and how it ended, whether
// it follows a run and what its title says it is about (chatMark.js)
export const cardsOfMarks = (marks) =>
    marks.map((mark) => {
        const title = mark.text.toLowerCase();
        return {
            key: `chat_mark:${mark.id}`,
            markKey: mark.key,
            time: createdAt(mark),
            type: mark.type,
            variant: mark.variant,
            outcome: mark.outcome,
            process: mark.type === "processes.command",
            active: !mark.ended_at,
            guesses: {test: title.includes("test"), build: title.includes("build"), upload: title.includes("upload")},
        };
    });

// A mark kept up in place keeps the time it was made, so a change of its variant would pass unseen: each card as of when its variant last changed,
// `known` holding key to {variant, time}, filled in here; a card first seen keeps its own time, and one seen changing takes `now`
export function cardsMoved(cards, known, now) {
    return cards.map((card) => {
        const was = known.get(card.key);
        const time = !was ? card.time : was.variant === card.variant ? was.time : now;
        known.set(card.key, {variant: card.variant, time});
        return {...card, time};
    });
}

export function cardsAfter(agent, known, since) {
    const cards = (agent?.data?.cards || []).filter((card) => card.key && !known.has(card.key));
    cards.forEach((card) => known.add(card.key));
    return cards.filter((card) => Number(card.time) > since).map((card) => ({beat: "card_arrived", time: Number(card.time), card: card.key}));
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
