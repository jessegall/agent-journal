<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {agent} from "../composables/leadAgent.js";
import {useHomeViews} from "../composables/homeViews.js";
import {figureStatus} from "../composables/voiceFigure.js";
import {beatsAfter, canSwitch, clipFor, facesAfter, figureStateOf, testResultsAfter, waitingSinceAt} from "../domain/figureState.js";
import {loadVoiceFigure} from "../figure/assets.js";
import {clickedAway, stayAtHome, stayForLook, stayingAt, targetFor} from "../figure/perches.js";
import {LOOK_FPS, answerTo, eyesAt, lookOf, pastimeFor, stretchClip, workMoments} from "../figure/reactions.js";
import {
    BODY,
    CHANGE_SECONDS,
    HOME,
    POSTURES,
    boxAt,
    drawnIn,
    facingToward,
    footingNow,
    footingOn,
    landingOn,
    spotOf,
    tripBetween,
} from "../figure/places.js";
import {rows} from "../sync/rows.js";

// The figure plays what the figure modules decide: what it does in figureState.js and reactions.js, where it goes in perches.js, and how
// it stands and travels in places.js. This component holds only the drawing and the clock.

// The figure is this many pixels square, as the chat's flat figure is
const SIZE = 112;
// how often the figure looks again at what the agent does and where things are, in milliseconds
const LOOK_EVERY = 1000;
// how many times a second the body is drawn while it eases from one clip, posture or facing to the next
const BLEND_FPS = 30;

const props = defineProps({voice: {type: String, required: true}});

const canvas = ref(null);
const voice = computed(() => props.voice);
const {views} = useHomeViews();
const counts = computed(() => Object.fromEntries(Object.entries(views.value).map(([key, view]) => [key, view.count || 0])));

let player = null;
let clips = [];
let frameTimer = 0;
let lookTimer = 0;
let legTimer = 0;
let footFrame = 0;
const now = ref(Date.now() / 1000);
const waitingSince = ref(0);
// below the figure's feet in its picture, as a share of its height: the clips' ground row (figure.js GROUND)
const below = ref(0);
// where the figure rests, or last rested while it travels: a spot on a line with the posture it takes there (places.js)
const place = ref({x: 0, y: 0, posture: "stand", view: null, on: null});
// the picture's left and top in the window: kept at the place while the figure rests, and at the end of each leg while it travels
const at = ref({x: 0, y: 0});
// the trip in hand (places.js tripBetween), as its legs still to go and the spot it goes to, or null; `started` once the figure stands
// ready to travel, `moves` while a leg carries it, and `hopping` and `clip` for the leg it is on or sets off on next
const moving = ref(null);
const leg = ref({x: 0, y: 0, ms: 0, lead: 0, easing: "linear"});
// the one-off clips the body waits to play, oldest first, each as {clip, card}, `card` the chat mark it turns to while it plays, or ""
const beats = ref([]);
// the look the eyes wear (reactions.js eyesAt), or null
let looking = null;
// what the figure remembers between looks: when each reaction last played and the eggs played so far, when each pastime may next play,
// and the state each test run's card had when last looked at
const memory = {reacted: new Map(), played: []};
const pastimesDue = new Map();
const testStates = new Map();
// the voice's own entrance plays when its figure appears, and its exit when the environment's agent goes; with no agent it is not shown
const arriving = ref(false);
// the landing plays once after a jump or a fall, unless the figure goes on to hang
const landing = ref(false);
const leaving = ref(false);
const here = ref(false);
let seenAt = Date.now() / 1000;
let playing = {name: "", started: 0, shown: null, index: 0};
// the clip on screen, so the page can draw what the rig has no bones for, such as the bug the squire chases
const shownClip = ref(null);
// the posture the clip on screen is drawn in
let drawn = "stand";
// whether the legs on screen walk, as the page marks it for whoever measures the figure, beside the name of the clip on screen
const walking = ref(false);

const held = computed(() => figureStateOf(agent.value, rows("work"), waitingSince.value, now.value));
// the stay the figure keeps while nothing calls it anywhere, and the box it was last clicked out of, kept clear of it (perches.js)
let stay = {where: "seat", until: 0};
let cleared = {until: 0};
// the sides, "l" or "r", of the hands this voice carries nothing in, which it can hang by
let hands = [];
// what the figure rests on (places.js footingOn), watched each frame; null while it travels, when the trip keeps the footing of the spot it
// goes to, taken as the spot was read from the page
let footing = null;
// the clip rolled for the stretch the figure is in (reactions.js stretchClip)
let rolled = {stretch: "", clip: ""};
// the user has typed in the compose box since the last look, and when the agent's work in hand began
let typed = false;
let workBegan = 0;

// the clip of this name the figure has, or idle when it has none
const clipNamed = (name) => clips.find((clip) => clip.name === name) || clips.find((clip) => clip.name === "idle");
const hasClip = (name) => clips.some((clip) => clip.name === name);
const canDraw = (name, posture) => clipNamed(name).postures.includes(posture);
const figureSize = () => ({size: SIZE, below: below.value});

// the clip the figure's body shows for the stretch it is in
function doing() {
    rolled = stretchClip(held.value.state, rolled, Math.random);
    return rolled.shows;
}

// what plays now, as figureState.js clipFor decides it, with the clip itself in place of its name
function current() {
    const first = beats.value[0];
    const beat = first && {clip: first.clip, facing: facingToward(first.card, at.value.x + SIZE / 2)};
    const scene = {
        leaving: leaving.value,
        arriving: arriving.value,
        trip: moving.value,
        landing: landing.value,
        place: place.value,
        beat,
        state: held.value.state,
        doing: doing(),
    };
    const wanted = clipFor(scene, canDraw);
    return {...wanted, clip: clipNamed(wanted.clip)};
}

const keyOf = (shown) => `${shown.clip.name}/${shown.facing}`;
const frameOf = (clip) => Math.floor(((performance.now() - playing.started) / 1000) * clip.fps);

// A clip plays out before another starts, or gives way at once when it is interruptible (figureState.js canSwitch). It is the one rule every
// clip goes through, so no clip needs its own check.
const playedOut = () => !playing.shown || canSwitch(playing.shown.clip, frameOf(playing.shown.clip), playing.index);

// how far through its step the walk under a clip on the move is, stepped as the walk's own frames are
function strideNow() {
    const {frames, fps} = clipNamed("walk");
    return (Math.floor((performance.now() / 1000) * fps) % frames) / frames;
}

function step() {
    clearTimeout(frameTimer);
    if (!player || document.hidden) return;
    const wanted = current();
    const shown = keyOf(wanted) === playing.name || playedOut() ? wanted : playing.shown;
    const key = keyOf(shown);
    if (playing.name !== key) playing = {name: key, started: performance.now(), shown, index: 0};
    shownClip.value = shown.clip;
    const index = frameOf(shown.clip);
    playing.index = index;
    if (shown.once && index >= shown.clip.frames) {
        if (shown.departure) {
            leaving.value = false;
            here.value = false;
            return;
        }
        if (shown.arrival) arriving.value = false;
        else if (shown.landed) landing.value = false;
        else beats.value = beats.value.slice(1);
        playing = {name: "", started: 0, shown: null, index: 0};
        return step();
    }
    // the leg waiting for the clip it sets off with goes in the frame that clip goes on screen, so the walk is never drawn on the spot
    if (shown === wanted && wanted.startsLeg && !moving.value.moves) depart();
    drawn = drawnIn(shown, moving.value ? POSTURES[place.value.posture].travels : place.value.posture, moving.value?.moves);
    if (!moving.value?.started) rest();
    const look = eyesAt(looking, shown.facing, performance.now() / 1000);
    looking = look.looking;
    const stride = drawn === "walk" ? strideNow() : null;
    walking.value = stride !== null || shown.clip.name === "walk";
    player.show(shown.clip, shown.clip.loops ? index % shown.clip.frames : Math.min(index, shown.clip.frames - 1), shown.facing, {
        posture: drawn,
        eyes: look.eyes,
        stride,
    });
    const strideFps = stride === null ? 0 : clipNamed("walk").fps;
    const fps = Math.max(shown.clip.fps, look.eyes ? LOOK_FPS : 0, strideFps, player.blending() ? BLEND_FPS : 0);
    frameTimer = setTimeout(step, 1000 / fps);
}

// the picture's left and top for a figure on a spot in `posture`
const placed = (spot, posture) => {
    const box = boxAt(spot, figureSize(), posture);
    return {x: box.left, y: box.top};
};
// The picture kept where the figure rests, in the posture of the clip on screen; when that posture changes where it rests, as it sits down
// or gets up, the picture slides to its new place while the body eases into the posture
let restedPosture = "stand";
let slideTimer = 0;
const sliding = ref(false);
const rest = () => {
    if (drawn !== restedPosture) slide();
    restedPosture = drawn;
    at.value = placed(place.value, drawn);
};

// the picture's next move eases over the time a change of posture takes
function slide() {
    sliding.value = true;
    clearTimeout(slideTimer);
    slideTimer = setTimeout(() => (sliding.value = false), CHANGE_SECONDS * 1000);
}

// the trip to a spot, from where the figure is in the posture it travels in to that spot in the one it travels in there (places.js); the
// clip on screen is drawn in that posture first, so the figure gets to its feet or takes its grip where it is before the first leg
async function moveTo(spot, straight = false) {
    const from = placed(place.value, POSTURES[place.value.posture].travels);
    const to = placed(spot, POSTURES[spot.posture].travels);
    const trip = tripBetween(from, to, SIZE, {straight, hangs: spot.posture === "hang"});
    if (!trip) return settle(spot);
    footing = null;
    moving.value = {...trip, to: spot, footing: footingOn(spot)};
    step();
    if (sliding.value) await new Promise((done) => setTimeout(done, CHANGE_SECONDS * 1000));
    if (moving.value?.to === spot) nextLeg();
}

// the trip waits for its next leg to set off (depart), or ends at its spot when no leg is left
function nextLeg() {
    clearTimeout(legTimer);
    const legs = moving.value.legs;
    const next = legs.find((each) => each.ms > 0);
    if (!next) {
        const {to, footing: held} = moving.value;
        const landed = landingOn(to, held, figureSize());
        moving.value = null;
        if (Math.hypot(landed.x - to.x, landed.y - to.y) >= 1) slide();
        settle(landed, held);
        return step();
    }
    const left = legs.slice(legs.indexOf(next));
    moving.value = {...moving.value, started: true, moves: false, hopping: Boolean(next.hopping), clip: next.clip, legs: left};
    step();
}

// the next leg carries the picture to its end, and lands it when it hopped
function depart() {
    const [next, ...legs] = moving.value.legs;
    moving.value = {...moving.value, moves: true, legs};
    leg.value = next;
    at.value = {x: next.x, y: next.y};
    legTimer = setTimeout(() => {
        landing.value = Boolean(moving.value.hopping && moving.value.lands);
        nextLeg();
    }, next.lead + next.ms);
}

function settle(spot, held = footingOn(spot)) {
    place.value = spot;
    footing = held;
}

// Each frame what the figure rests on carries it along as it moves (places.js footingNow); when the ground went from under it, it goes at
// once, without waiting for its clip, as gravity does not, straight up or down to the ground at home and on to its place there
function watchFooting() {
    footFrame = requestAnimationFrame(watchFooting);
    if (!footing || moving.value || !here.value || document.hidden) return;
    const to = footingNow(footing, figureSize());
    if (!to) return uprooted();
    if (Math.hypot(to.x - place.value.x, to.y - place.value.y) <= 0.3) return;
    place.value = {...place.value, ...to};
    rest();
}

function uprooted() {
    footing = null;
    stay = stayAtHome(stay);
    clearTimeout(legTimer);
    playing = {name: "", started: 0, shown: null, index: 0};
    beats.value = [];
    landing.value = false;
    moveTo(stayingAt(stay, figureSize(), place.value), true);
}

// the scene the reactions are decided in
const scene = () => ({place: place.value, beats: beats.value.length, arriving: arriving.value, leaving: leaving.value});

function look() {
    clearTimeout(lookTimer);
    now.value = Date.now() / 1000;
    waitingSince.value = waitingSinceAt(counts.value, waitingSince.value, now.value);
    const happened = [
        ...beatsAfter(agent.value, seenAt),
        ...testResultsAfter(agent.value, testStates),
        ...facesAfter(rows("reaction"), seenAt),
    ];
    if (happened.length) seenAt = Math.max(seenAt, ...happened.map((fire) => fire.at));
    const work = workMoments(held.value.state, typed, workBegan, now.value);
    typed = false;
    workBegan = work.began;
    [...happened, ...work.moments].forEach(react);
    const waited = {state: held.value.state, since: held.value.since, lasted: now.value - held.value.since};
    const egg = answerTo(waited, voice.value, memory, now.value, Math.random, hasClip)?.beat;
    const pastime = pastimeFor(scene(), waited, pastimesDue, now.value, Math.random, hasClip);
    const after = [egg, pastime].filter(Boolean);
    if (after.length) beats.value = [...beats.value, ...after];
    const target = targetFor({
        state: held.value.state,
        counts: counts.value,
        stay,
        now: now.value,
        near: place.value,
        figure: figureSize(),
        hands,
        cleared,
    });
    stay = target.stay;
    if (!moving.value && !arriving.value) moveTo(target.spot);
    if (!document.hidden) lookTimer = setTimeout(look, LOOK_EVERY);
}

// a click on the figure's body sends it out of the way of what it was drawn over, on a trip like any other
function clicked(event) {
    ({stay, cleared} = clickedAway(stay, event.currentTarget.parentElement.getBoundingClientRect(), Date.now() / 1000));
    look();
}

// the part of the picture the body is drawn in, which takes the click
const bodyStyle = {
    left: `${BODY.left * 100}%`,
    width: `${(BODY.right - BODY.left) * 100}%`,
    top: `${BODY.top * 100}%`,
    height: `${(BODY.bottom - BODY.top) * 100}%`,
};

const onType = (event) => {
    if (event.target.closest?.(HOME)) typed = true;
};

// what the figure does about a moment, as reactions.js answerTo decides: a beat the body plays, or a look the eyes take on
function react(moment) {
    const answer = answerTo(moment, voice.value, memory, now.value, Math.random, hasClip);
    if (answer?.beat) beats.value = [...beats.value, answer.beat];
    if (!answer?.look) return;
    looking = lookOf(answer.look, performance.now() / 1000);
    stay = stayForLook(stay, place.value);
}

// the figure appears at home on its feet, where its entrance plays
function home() {
    place.value = spotOf(null, figureSize());
    rest();
}

// the environment's agent arriving or going: the figure enters, or makes its exit and is gone
function present(live) {
    if (!player || live === here.value) return;
    if (live) {
        here.value = true;
        home();
    }
    leaving.value = !live;
    arriving.value = live;
    step();
}

const seen = () => {
    if (document.hidden) return;
    look();
    step();
};

async function load(name) {
    player = null;
    if (!name) return;
    try {
        const [loaded, module] = await Promise.all([loadVoiceFigure(name), import("../figure/figure.js")]);
        if (name !== voice.value || !canvas.value) return;
        const {FigurePlayer} = await import("../figure/player.js");
        clips = module.CLIPS;
        hands = [...loaded.stance.free];
        testResultsAfter(agent.value, testStates);
        below.value = module.GROUND;
        canvas.value.width = canvas.value.height = Math.round(SIZE * (window.devicePixelRatio || 1));
        player = new FigurePlayer(loaded, canvas.value);
        home();
        here.value = Boolean(agent.value);
        arriving.value = here.value;
        figureStatus.value = "shown";
        cancelAnimationFrame(footFrame);
        footFrame = requestAnimationFrame(watchFooting);
        look();
        step();
    } catch (error) {
        console.error(error);
        figureStatus.value = "failed";
    }
}

watch(voice, load);
watch(() => Boolean(agent.value), present);
onMounted(() => {
    document.addEventListener("visibilitychange", seen);
    document.addEventListener("input", onType, true);
    window.addEventListener("resize", look);
    load(voice.value);
});
onUnmounted(() => {
    cancelAnimationFrame(footFrame);
    clearTimeout(legTimer);
    clearTimeout(slideTimer);
    clearTimeout(frameTimer);
    clearTimeout(lookTimer);
    document.removeEventListener("visibilitychange", seen);
    document.removeEventListener("input", onType, true);
    window.removeEventListener("resize", look);
});

const chasing = computed(() => shownClip.value?.name === "squire_chase");
// during an entrance or exit what is below the edge the figure stands on is hidden, as the box it climbs over or drops past would hide it
const passing = computed(() => ["enter", "exit"].includes(shownClip.value?.name));
const chaseMs = computed(() => (chasing.value ? (shownClip.value.frames / shownClip.value.fps) * 1000 : 0));

const style = computed(() => ({
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    transform: `translate(${at.value.x}px, ${at.value.y}px)`,
    transition: moving.value?.moves
        ? `transform ${leg.value.ms}ms ${leg.value.easing} ${leg.value.lead}ms`
        : sliding.value
          ? `transform ${CHANGE_SECONDS * 1000}ms ease-in-out`
          : "none",
}));
</script>

<template>
    <div
        v-show="figureStatus === 'shown' && here"
        class="voice-figure"
        :style="style"
        aria-hidden="true"
        :data-walking="walking"
        :data-clip="shownClip?.name"
    >
        <div class="voice-figure-body" :style="bodyStyle" @click="clicked" />
        <div :class="['voice-figure-actor', {chasing}]" :style="chasing ? {animationDuration: `${chaseMs}ms`} : null">
            <canvas ref="canvas" class="voice-figure-canvas" :style="passing ? {clipPath: `inset(0 0 ${below * 100}% 0)`} : null" />
            <template v-if="chasing">
                <svg class="voice-figure-bug" :style="{animationDuration: `${chaseMs}ms`}" viewBox="0 0 16 12" width="16" height="12">
                    <path d="M3 3 1 1M3 6H0M3 9 1 11M13 3l2-2M13 6h3M13 9l2 2" stroke="currentColor" stroke-width="1.2" />
                    <ellipse cx="8" cy="6" rx="5" ry="4" fill="currentColor" />
                </svg>
            </template>
        </div>
    </div>
</template>

<style scoped>
.voice-figure {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    pointer-events: none;
}

.voice-figure-body {
    position: absolute;
    z-index: 1;
    pointer-events: auto;
    cursor: pointer;
}

/* one thin edge in the page's own text colour, so the figure reads on a dark page and a light one alike; a wider
   second shadow reads as a halo around it rather than an edge on it */
.voice-figure-canvas {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 1px color-mix(in srgb, var(--text) 45%, transparent));
}

.voice-figure-actor {
    width: 100%;
    height: 100%;
}

/* the squire runs out across the pane after the bug and comes back */
.voice-figure-actor.chasing {
    animation-name: voice-figure-chase;
    animation-timing-function: ease-in-out;
}

@keyframes voice-figure-chase {
    0%,
    100% {
        transform: none;
    }

    50% {
        transform: translateX(160px);
    }
}

/* the bug runs off ahead of the squire and gets away while he turns back */
.voice-figure-bug {
    position: absolute;
    bottom: 8%;
    left: 60%;
    color: var(--text);
    animation-name: voice-figure-bug;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
}

@keyframes voice-figure-bug {
    0% {
        transform: translateX(0);
        opacity: 1;
    }

    45% {
        transform: translateX(120%) translateX(60px);
        opacity: 1;
    }

    60% {
        transform: translateX(120%) translateX(90px);
        opacity: 0;
    }

    100% {
        transform: translateX(120%) translateX(90px);
        opacity: 0;
    }
}
</style>
