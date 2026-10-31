import {playedLeast} from "./timeline.js";

// The figure's acts, one pile, and the sequences it plays whole. A new act is one entry of PILE, a new sequence one entry of SEQUENCES,
// never put in another's place.
//
// An act is {name, kind, weight, when, group, cooldown, lifetime}. Its kind is a clip the body plays, a look the eyes take on, a gaze the
// head takes at the message the moment is about (reactions.js readingAt), or a pick, a choice of something that is not a clip: the carrier that takes the work away, a perch's kind, a digit, a place to go, a spell the
// figure keeps up. Its weight is its tickets, a weight of 3 counting as three. `when` is the condition it may play under: the moment it
// answers, and anything else it needs, as a voice, a stretch of time the state has lasted, a free hand. Its group, {name, cooldown}, is
// the moment it answers, and the seconds before any act of the group may play again once one has; its own `cooldown` the seconds before
// it may play again itself; both are read in one place (cooldownsOf). Its `lifetime` is the seconds it stays worth playing while it waits
// in the beat queue (reactions.js freshBeats), LIFETIME unless it says. A reaction may turn `toward` its card or go `onto` it, playing
// there, and `holds` when nothing may cut it off. At each choice the pile is filtered to the acts whose condition holds, that the figure
// can draw and that are not cooling down, and one is drawn by weight (draw). A `nothing` act is the chance that the moment passes with
// nothing played.
//
// A sequence is {name, acts, when, breaks, cooldown, lifetime}: a run of acts the figure plays as one whole. While its `when` holds,
// nothing takes the figure off it, no act, moment, pastime or reaction, but what it names in `breaks`; what comes meanwhile waits in the
// beat queue and is dropped once its lifetime is over (sequenceIn). Its cooldown is the seconds before it may begin again once it has, its
// lifetime the seconds it stays worth beginning once it is due.
//
// The playful acts are `shenanigan`s, each keeping the figure from its spot for at most the seconds SHENANIGANS lists, the way back
// included: it plays one only while it has that much `room`, the seconds it may be away (reactions.js roomFor), any while it waits on
// the user, a worker or a run, as long as a long run has left before its anticipation, and none while its agent works. After
// SHENANIGAN.after acts in a row with none among them the next draw that may be one is one.
export const SHENANIGAN = {after: 3};

// the seconds an act stays worth playing while it waits in the beat queue, unless it has a lifetime of its own
export const LIFETIME = 10;

// The showpiece acts and how long each waits before it may play again once it has, in seconds, so they stay special: the run up to the
// parachute at most every 20 minutes, the disco dance at most every 2 hours and rarely then, the rope swing about every 15, the salto on a
// jump up and the pogo stick about every 6, the bug shot and the bug smashed with the mallet every 30; the tickle swats come as often as the
// user tickles. A cooldown only takes an act out of the draw while it lasts;
// its weight is its own.
export const SHOWPIECES = {hop_up: 20 * 60, disco: 2 * 60 * 60, rope_swing: 15 * 60, backflip: 6 * 60, bug_shot: 30 * 60, bug_smash: 30 * 60, tickle_swat: 0};

// The shenanigans and the most seconds each keeps the figure from its spot, the way back included: the run up the bubbles, its time out
// of sight and the parachute down; the disco dance; the rope swing's stay; the salto; the pogo stick's climb; a stay on a bubble
export const SHENANIGANS = {hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90};

// While a test run, a build or a check runs, building a server unit is drawn far above doing nothing, but no more often than the build's
// sequence allows (SEQUENCES build)
export const UNIT = {weight: 19};

// The sequences the figure plays whole. A server box built for a run: from the first blow of the hammer on it, through its inspections,
// until it is pushed onto the pile and the figure is free again, while it has a `box` in hand; broken only by the UFO or the crane come
// to take the pile; one in three minutes at most, and given up when the figure has not begun it a minute after it was due.
export const SEQUENCES = {
    build: {name: "build", acts: ["work", "inspect", "push"], when: {box: true}, breaks: ["ufo", "crane"], cooldown: 3 * 60, lifetime: 60},
};

// A one-armed hang from a bubble's side at most once every `every` seconds
export const HANG = {every: 2 * 60};

// The clip each voice plays when the agent puts one of the voice's own faces on a message, by voice and then by face
export const VOICE_FACES = {
    butler: {"🎩": "hat_tip", "🧐": "monocle", "🥂": "toast"},
    homie: {"🤙": "shaka", "😎": "shades", "🔥": "fire"},
    colleague: {"👍": "thumbs_up", "👀": "peer"},
    coach: {"🎉": "party_popper", "💪": "flex", "🏆": "trophy"},
    squire: {"⚔️": "sword", "🛡️": "shield_up", "🏰": "castle"},
};

// The clip every voice plays when the agent puts one of these faces on a message, beside its own
export const EVERY_VOICE_FACES = {"🙏": "thanks", "😠": "tantrum", "😡": "tantrum"};

// the look the eyes take on at a face the user puts on a message, which is aimed at the figure, so it always answers
const USER_FACES = {
    "❤️": "hearts", "👍": "amused", "🎉": "startled", "😄": "amused", "👀": "reading",
    "🙏": "hearts", "👎": "worried", "💔": "worried", "😠": "angry", "🎩": "amused",
    "🧐": "reading", "🥂": "amused", "🤙": "amused", "😎": "amused", "🔥": "startled", "💪": "amused", "🏆": "hearts",
    "⚔️": "angry", "🛡️": "worried", "🏰": "amused",
};

const act = (name, kind, weight, when) => ({name, kind, weight, when, lifetime: LIFETIME});
const clip = (name, weight, when = {}) => act(name, "clip", weight, when);
const look = (name, weight, when = {}) => act(name, "look", weight, when);
const gaze = (name, weight, when = {}) => act(name, "gaze", weight, when);
const pick = (name, weight, when = {}, more = {}) => ({...act(name, "pick", weight, when), ...more});
const nothing = (weight) => act("nothing", "nothing", weight, {});

// the seconds after any search before the figure searches again
const SEARCH_COOLDOWN = 120;

// a search act, waiting PROP_COOLDOWN seconds before it is drawn again
const PROP_COOLDOWN = 300;
const prop = (name, weight) => ({...clip(name, weight), cooldown: PROP_COOLDOWN});

// the seconds between two telephone calls, whatever workers were given work between them
export const CALL_COOLDOWN = 120;

// the acts of one moment, its group: each given the moment and whatever the moment says of them all, its `cooldown` the group's
const at = (moment, {cooldown = 0, ...shared}, entries) => entries.map((entry) => ({...shared, ...entry, when: {moment, ...entry.when}, group: {name: moment, cooldown}}));

// the way the figure celebrates: a jump for joy with its hands up, kept for the end of a run it anticipated; an everyday success
// gets a nod
const celebrations = () => [clip("joy", 2)];

// the idle acts, while the figure has nothing to do: each once the state has lasted `lasted` seconds, waiting a cooldown of its own, and so
// weighted against nothing that one is played about every half minute, looked for every second
const pastime = (name, weight, lasted, cooldown, more = {}) => ({...clip(name, weight, {free: true, lasted, ...more.when}), cooldown});

// a showpiece among the acts, waiting its own cooldown (SHOWPIECES)
const showpiece = (entry) => ({...entry, cooldown: SHOWPIECES[entry.name]});

// a shenanigan, keeping the figure from its spot as long as SHENANIGANS says
const shenanigan = (entry) => ({...entry, shenanigan: true, lasts: SHENANIGANS[entry.name]});

export const PILE = [
    // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
    // as it crawls into the chat instead of the visor's glow
    ...at("tests_passed", {cooldown: 20, toward: "card", onto: true}, [clip("nod", 2), nothing(1)]),
    // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
    ...at("tests_fixed", {cooldown: 20, toward: "card", onto: true}, [
        {...showpiece(clip("bug_shot", 3)), toward: "", onto: false},
        {...showpiece(clip("bug_smash", 2)), toward: "", onto: false},
        clip("nod", 2),
    ]),
    ...at("tests_failed", {cooldown: 20, toward: "card"}, [clip("startled", 2), clip("dismay", 1), clip("tantrum", 3), nothing(1)]),
    ...at("committed", {cooldown: 30, toward: "card", onto: true}, [clip("nod", 2), nothing(2)]),
    // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
    ...at("sin_fixed", {cooldown: 300}, [clip("halo", 1), nothing(2)]),
    // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
    // to ask forgiveness
    ...at("sin_committed", {cooldown: 300}, [clip("repent", 1), nothing(2)]),
    // what the agent has just done in the journal, acted out now and then, never every time
    // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
    // plays (reactions.js joinedCall)
    ...at("messaged", {cooldown: CALL_COOLDOWN}, [clip("phone_call", 1)]),
    ...at("task_finished", {cooldown: 90, toward: "card", onto: true}, [clip("nod", 4), clip("hand_rub", 4), nothing(7)]),
    ...at("question_asked", {cooldown: 60}, [clip("ask_sign", 9), clip("look_up", 3), nothing(8)]),
    // a report: the figure looks up at its bubble and reads along it, never the report scroll
    ...at("reported", {cooldown: 90}, [gaze("read", 3), clip("nod", 1), nothing(4)]),
    // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
    ...at("read_message", {cooldown: 30}, [gaze("read", 3), nothing(1)]),
    ...at("fact_filed", {cooldown: 120}, [clip("file_card", 3), clip("nod", 1), nothing(6)]),
    ...at("check_passed", {cooldown: 120, toward: "card", onto: true}, [clip("nod", 2), nothing(9)]),
    // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
    // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
    ...at("bar_done", {holds: true}, celebrations()),
    ...at("bar_failed", {holds: true}, [clip("fume", 1), clip("tantrum", 3)]),
    // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
    ...at("standing", {cooldown: 12}, [clip("look_left", 2), clip("look_right", 2), clip("look_up", 1), nothing(40)]),
    // landing from a launch it very rarely trips and falls to its knees
    ...at("launched", {cooldown: 300}, [clip("tumble", 3), nothing(47)]),
    // a break from the hammering now and then
    ...at("building", {cooldown: 30}, [clip("wipe_brow", 4), clip("look_left", 1), clip("look_right", 1), nothing(69)]),
    ...at("failed", {cooldown: 20, toward: "card"}, [clip("shake", 3), clip("tantrum", 2), nothing(2)]),
    ...at("refused", {cooldown: 20}, [clip("shake", 1), nothing(1)]),
    ...at("work_done", {cooldown: 120}, [clip("stretch", 2), nothing(3)]),
    // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
    // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
    // end (reactions.js thinkingAct)
    ...at("pondering", {cooldown: [30, 60]}, [pick("ponder", 1)]),
    ...at("thought_cloud", {cooldown: 90}, [pick("cloud", 1)]),
    ...at("light_bulb", {cooldown: 150}, [pick("bulb", 1)]),
    ...at("answered", {cooldown: 15}, [look("amused", 3), nothing(2)]),
    ...at("heard", {cooldown: 30}, [
        clip("bow", 1, {voices: ["butler"]}),
        clip("salute", 1, {voices: ["squire"]}),
        clip("nod", 1, {voices: ["coach", "colleague", "homie"]}),
        nothing(1),
    ]),
    ...at("long_walk", {cooldown: 90}, [clip("stumble", 3), nothing(22)]),
    ...at("card_arrived", {cooldown: 20, toward: "card"}, [clip("glance", 7), nothing(13)]),
    ...at("typing", {cooldown: 60}, [look("reading", 1), nothing(4)]),
    // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
    ...Object.entries(USER_FACES).flatMap(([face, mood]) => at(`reacted:${face}`, {}, [look(mood, 1)])),
    ...Object.entries(VOICE_FACES).flatMap(([voice, faces]) => Object.entries(faces).map(([face, name]) => at(`agent_reacted:${face}`, {}, [clip(name, 1, {voices: [voice]})])[0])),
    ...Object.entries(EVERY_VOICE_FACES).flatMap(([face, name]) => at(`agent_reacted:${face}`, {}, [clip(name, 1)])),
    // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
    ...at("pastime", {}, [
        pastime("stretch", 3, 90, 90),
        // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
        pastime("rest", 3, 180, 120),
        pastime("yawn", 2, 60, 60),
        pastime("whistle", 4, 45, 60, {when: {voices: ["coach"]}}),
        pastime("sip", 4, 45, 60, {when: {voices: ["colleague"]}}),
        pastime("groove", 4, 45, 60, {when: {voices: ["homie"]}}),
        pastime("shield_polish", 4, 45, 60, {when: {voices: ["squire"]}}),
        // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
        // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
        {...shenanigan(showpiece(clip("hop_up", 2))), flies: true},
        // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
        // (perches.js discoBall)
        shenanigan(showpiece(clip("disco", 2, {ball: "bubble"}))),
        nothing(560),
    ]),
    // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
    // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
    // squaring a stack of papers
    // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
    // minutes, so the next is always another; none at all while all wait;
    // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
    // bubbleNear)
    ...at("held:search", {cooldown: SEARCH_COOLDOWN}, [prop("search", 3), {...prop("binoculars", 2), when: {home: true}}, {...prop("glass_bubble", 2), when: {bubble: true}}]),
    ...at("held:type", {}, [clip("type", 3), clip("type_ponder", 1)]),
    ...at("held:watch", {}, [clip("watch", 2), clip("wave_up", 1)]),
    ...at("held:compacting", {}, [clip("pack_box", 3), clip("vacuum", 2), clip("compacting", 1)]),
    // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
    // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
    ...at("spell", {}, [pick("writing", 12, {state: "writing"}), pick("reading", 12, {state: "reading"}), pick("searching", 12, {state: "searching"}), nothing(4)]),
    // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
    // has long gone
    ...at("tickled", {}, [{...showpiece(clip("tickle_swat", 1)), lifetime: 3}]),
    // a slow docked bar near its end: the figure gets eager for it now and then
    ...at("eager", {}, [clip("eager", 2, {slow: true}), nothing(3)]),
    // a jump up more than the figure's own height now and then turns over backwards on the way
    ...at("jump", {}, [shenanigan(showpiece(clip("backflip", 7, {high: true}))), clip("jump", 13)]),
    // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
    ...at("climb", {}, [pick("hops", 3, {footholds: true})]),
    // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
    ...at("unit", {cooldown: SEQUENCES.build.cooldown}, [pick("unit", UNIT.weight), nothing(1)]),
    // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
    ...at("progress_jump", {cooldown: 6}, [clip("look_up", 1)]),
    // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
    // rolls in from
    ...at("carrier", {}, [pick("ufo", 3), pick("crane", 1)]),
    ...at("crane_from", {}, [pick("left", 1), pick("right", 1)]),
    // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
    // its corner
    ...at("perch", {}, [{...pick("hang", 1, {hands: true, free: true}), cooldown: HANG.every}, pick("stand", 5)]),
    // a digit a blow's dust lets out
    ...at("digit", {}, [pick("0", 1), pick("1", 1)]),
    // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
    // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
    ...at("roam", {}, [
        pick("rest", 35, {}, {stay: [25, 60]}),
        pick("seat", 15, {}, {stay: [15, 40]}),
        pick("edge", 25, {}, {stay: [8, 20]}),
        shenanigan(pick("bubble", 15, {}, {stay: [30, 80]})),
        // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
        pick("bubble", 6, {free: false}, {stay: [20, 45]}),
        pick("tab", 10, {}, {stay: [10, 25]}),
        // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
        pick("ledge", 9, {free: true}, {stay: [20, 45]}),
        // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
        // flat on the floor at its sides (perches.js composedSpot)
        pick("composed", 8, {free: true}, {stay: [25, 50]}),
        // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
        // leanSpot)
        pick("lean", 2, {free: true}, {stay: [20, 45]}),
        // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
        shenanigan(showpiece(pick("rope_swing", 8, {free: true, swings: true}, {stay: [25, 50]}))),
    ]),
    // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
    // a bubble, keeping to each a while
    ...at("laptop", {}, [pick("seat", 6, {}, {stay: [60, 150]}), pick("bubble_ledge", 1, {}, {stay: [30, 60]})]),
    // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
    ...at("ledge_at", {}, [pick("middle", 2, {}, {along: 1 / 2}), pick("third", 1, {}, {along: 1 / 3}), pick("two_thirds", 1, {}, {along: 2 / 3})]),
    // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
    // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
    // 1, figure.js SIDES) or its right (-1)
    ...at("composed_as", {}, [
        pick("facing", 4, {}, {turn: 0, leans: 0}),
        pick("turned_left", 1, {}, {turn: 335, leans: 0}),
        pick("turned_right", 1, {}, {turn: 25, leans: 0}),
        pick("leaning_on_left_arm", 1, {}, {turn: 0, leans: 1}),
        pick("leaning_on_right_arm", 1, {}, {turn: 0, leans: -1}),
    ]),
];

// whether a condition holds where things stand: its moment, a voice among its voices, a state lasted at least so long, and anything else
// it names, as a free hand or a high jump, as `scene` has it
const holds = (when, scene) =>
    Object.entries(when).every(([key, wanted]) => (key === "voices" ? wanted.includes(scene.voice) : key === "lasted" ? scene.lasted >= wanted : scene[key] === wanted));

// The cooldowns an act waits, as [key, seconds] pairs, each kept in the figure's memory under its key: its group's under the group's name,
// its own under the group's and its own; one that is none is left out
export const cooldownsOf = (entry) =>
    [[entry.group.name, entry.group.cooldown], [`${entry.group.name}/${entry.name}`, entry.cooldown]].filter(([, cooldown]) => cooldown);

// A cooldown is a number of seconds, or the least and the most, [least, most], when it lasts a random time between them each time: the
// least, and the seconds past the least it lasts this time, drawn with `random`
const leastOf = (cooldown) => (Array.isArray(cooldown) ? cooldown[0] : cooldown);
const beyondLeast = (cooldown, random) => (Array.isArray(cooldown) ? random() * (cooldown[1] - cooldown[0]) : 0);

// whether the pile holds any entry for `moment`
export const hasMoment = (moment) => PILE.some((entry) => entry.when.moment === moment);

// The entries that may play where things stand, `scene`: its moment and what else the conditions read, whether the figure `has` a clip,
// and, with `memory` (cooldown key to when it last played, in seconds) and `now`, only those not cooling down; a shenanigan only within
// the scene's `room`, none when it says none. With a `tally` of the acts played since the last shenanigan at SHENANIGAN.after or more,
// only the shenanigans, where there is one; and never the tally's last act again while anything else may play.
export function choicesFor(scene) {
    const has = scene.has ?? (() => true);
    const since = (key) => scene.now - (scene.memory.get(key) ?? -Infinity);
    const cooled = (entry) => !scene.memory || cooldownsOf(entry).every(([key, cooldown]) => since(key) >= leastOf(cooldown));
    const roomy = (entry) => !entry.shenanigan || entry.lasts <= (scene.room ?? 0);
    const choices = PILE.filter((entry) => holds(entry.when, scene) && (entry.kind !== "clip" || has(entry.name)) && cooled(entry) && roomy(entry));
    const due = (scene.tally?.plain ?? 0) >= SHENANIGAN.after && choices.some((entry) => entry.shenanigan);
    const kept = due ? choices.filter((entry) => entry.shenanigan) : choices;
    // the act just played is not drawn again at once, while anything else may play
    const fresh = kept.filter((entry) => entry.kind === "nothing" || entry.name !== scene.tally?.last);
    return fresh.some((entry) => entry.kind !== "nothing") ? fresh : kept;
}

// One entry drawn by weight from those that may play in `scene` (choicesFor), with `random`; null when none may, or when nothing is drawn.
// The one drawn starts its cooldown in the scene's memory, and is counted on the scene's tally, which a shenanigan sets back to none.
export function draw(scene, random) {
    const choices = choicesFor(scene);
    let roll = random() * choices.reduce((sum, entry) => sum + entry.weight, 0);
    const drawn = choices.find((entry) => (roll -= entry.weight) < 0) ?? choices.at(-1) ?? null;
    if (!drawn || drawn.kind === "nothing") return null;
    cool(scene, drawn, random);
    if (scene.tally) Object.assign(scene.tally, {plain: drawn.shenanigan ? 0 : scene.tally.plain + 1, last: drawn.name});
    return drawn;
}

// The cooldowns of `entry` begun in the scene's memory at its `now`, as when it is drawn; a cooldown of a random length is kept as one of
// its least that began as much later
function cool(scene, entry, random) {
    for (const [key, cooldown] of cooldownsOf(entry)) scene.memory?.set(key, scene.now + beyondLeast(cooldown, random));
}

// The entry `name` of the scene's moment taken without being drawn, as a perch's other kind when the drawn one does not fit: its cooldown
// begun as a draw begins it
export function taken(scene, name, random) {
    cool(scene, PILE.find((entry) => entry.when.moment === scene.moment && entry.name === name), random);
}

// The sequence that holds the figure where things stand, `scene`: the one whose condition holds, unless what the scene's `carrier` is, the
// UFO or the crane come for the work, is among what breaks it; null with none
export const sequenceIn = (scene) => Object.values(SEQUENCES).find((sequence) => holds(sequence.when, scene) && !sequence.breaks.includes(scene.carrier)) ?? null;

// whether `thing`, an act or a sequence waiting since `since`, is still worth playing at `now`: its lifetime is not yet over
export const alive = (thing, since, now) => now - since <= (thing.lifetime ?? LIFETIME);

const conditions = (when) => Object.entries(when).map(([key, value]) => `${key}=${value}`).join(" ");
const secondsOf = (cooldown) => `${[cooldown].flat().join("-")}s`;

// an entry as a line: what it is, its weight, the condition it plays under, whether it may be cut, its group's cooldown and its own, and
// its lifetime where it has one of its own
export const lineOf = (entry) =>
    `${entry.shenanigan ? `shenanigan of ${entry.lasts}s ` : ""}${entry.kind} ${entry.name} ×${entry.weight} when ${conditions(entry.when)}` +
    `${entry.kind === "clip" ? ", plays out" : ""}` +
    `${entry.group.cooldown ? `, group cools ${secondsOf(entry.group.cooldown)}` : ""}${entry.cooldown ? `, cools ${secondsOf(entry.cooldown)}` : ""}` +
    `${entry.lifetime === LIFETIME ? "" : `, lives ${entry.lifetime}s`}`;

// a sequence as a line: its acts, the condition it holds under, what breaks it, its cooldown and its lifetime
export const sequenceLineOf = (sequence) =>
    `sequence ${sequence.name} of ${sequence.acts.join(", ")} while ${conditions(sequence.when)}, broken by ${sequence.breaks.join(" or ")}, cools ${secondsOf(sequence.cooldown)}, lives ${sequence.lifetime}s`;

// whether the clip on screen, `shown`, played `seconds`, gives way now to what is wanted instead: never an act played once, which plays out
// whatever comes meanwhile, nor one that holds, declared on its clip (figure.js CLIPS holds) or on its beat (the pile's holds); a loop as
// soon as it has played its least (timeline.js playedLeast), or at once for a `trip` that drops everything, as for the end of a long run
// (reactions.js EAGER)
export const givesWay = (shown, seconds, trip = null) =>
    !shown || (!shown.once && !shown.holds && !shown.clip.holds && (Boolean(trip?.urgent) || playedLeast(shown.clip, seconds)));
